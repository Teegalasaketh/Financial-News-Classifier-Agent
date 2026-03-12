import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { headline } = await req.json();
    if (!headline) throw new Error("No headline provided");

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1024,
        messages: [
          {
            role: "system",
            content: "You are a financial news classification agent. Analyze the given financial news headline/snippet and classify it. You must call the classify_news function with your analysis.",
          },
          { role: "user", content: headline },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "classify_news",
              description: "Classify a financial news article for market impact analysis",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Clean headline title" },
                  summary: { type: "string", description: "2-sentence summary of market implications" },
                  sentiment: { type: "string", enum: ["bullish", "bearish", "neutral"] },
                  impactLevel: { type: "string", enum: ["high", "medium", "low"] },
                  affectedSectors: { type: "array", items: { type: "string" }, description: "Affected market sectors" },
                  tradingSignal: { type: "string", enum: ["buy", "hold", "sell"] },
                  confidenceScore: { type: "number", description: "Confidence 0-1" },
                  entities: { type: "array", items: { type: "string" }, description: "Key entities mentioned" },
                  priceMovement: { type: "string", description: "Predicted price movement range e.g. +0.5% to +1.2%" },
                },
                required: ["title", "summary", "sentiment", "impactLevel", "affectedSectors", "tradingSignal", "confidenceScore", "entities", "priceMovement"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "classify_news" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Groq API error:", response.status, t);
      throw new Error("AI classification failed");
    }

    const data = await response.json();

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No classification result returned");

    const classification = JSON.parse(toolCall.function.arguments);

    const result = {
      id: crypto.randomUUID(),
      ...classification,
      source: "AI Analysis",
      publishedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("classify-news error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});