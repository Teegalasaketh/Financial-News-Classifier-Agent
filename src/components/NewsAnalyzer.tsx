/**
 * NewsAnalyzer.tsx
 * Financial-only AI classifier.
 * - Real-time validation feedback as user types
 * - Blocks non-financial text before API call
 * - Shows AI analyst summary immediately after classification
 * - Records result to user's analytics history
 */

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { ClassifiedNews } from '@/lib/types';
import { useClassify, isFinancialNews } from '@/hooks/useClassify';
import { ClassifiedSummary } from '@/components/ClassifiedSummary';

interface Props {
  onClassified: (result: ClassifiedNews) => void;
  userId?: string;
  onRecord?: (result: any) => void;
}

export function NewsAnalyzer({ onClassified, onRecord }: Props) {
  const [input, setInput]           = useState('');
  const [apiError, setApiError]     = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ClassifiedNews | null>(null);

  const { classify, isLoading } = useClassify({
    onSuccess: (data) => {
      setApiError(null);
      const result = data as unknown as ClassifiedNews;
      setLastResult(result);       // show summary panel
      onClassified(result);        // push to live feed
      onRecord?.(data);
      setInput('');                // clear textarea
    },
    onError: (err: any) => {
      setApiError(err?.message ?? 'Classification failed. Please try again.');
      setLastResult(null);
    },
  });

  const trimmed    = input.trim();
  const hasText    = trimmed.length > 0;
  const isFinancial = isFinancialNews(trimmed);
  const isValid    = trimmed.length >= 15 && isFinancial;
  const showWarning = hasText && trimmed.length >= 10 && !isFinancial;

  const handleClassify = () => {
    setApiError(null);
    setLastResult(null);
    classify(trimmed);
  };

  return (
    <div className="border border-border bg-card rounded-lg p-4">
      <h2 className="text-sm font-semibold text-card-foreground mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        AI News Classifier
      </h2>

      {/* Textarea */}
      <div className="relative mb-2">
        <Textarea
          placeholder="Paste a financial news headline or article, e.g. 'Fed raises rates by 25bps amid inflation concerns...'"
          className={`bg-muted border text-sm font-mono min-h-[80px] resize-none placeholder:text-muted-foreground/40 transition-colors pr-8 ${
            showWarning
              ? 'border-amber-500/60'
              : isValid
              ? 'border-primary/40'
              : 'border-border'
          }`}
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setApiError(null);
            setLastResult(null);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && isValid) handleClassify();
          }}
        />
        {hasText && (
          <div className="absolute top-2 right-2">
            {isValid
              ? <CheckCircle2 className="w-4 h-4 text-primary" />
              : <AlertTriangle className="w-4 h-4 text-amber-500" />
            }
          </div>
        )}
      </div>

      {/* Validation / error messages */}
      <div className="mb-3 min-h-[1rem]">
        {showWarning && !apiError && (
          <p className="text-xs font-mono text-amber-500 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            Only financial news can be classified — add market context or a ticker symbol.
          </p>
        )}
        {isValid && !apiError && (
          <p className="text-xs font-mono text-primary/60 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
            Financial news detected — ready to classify.
          </p>
        )}
        {apiError && (
          <p className="text-xs font-mono text-destructive flex items-center gap-1.5">
            <XCircle className="w-3 h-3 flex-shrink-0" />
            {apiError}
          </p>
        )}
      </div>

      {/* Classify button */}
      <Button
        onClick={handleClassify}
        disabled={isLoading || !isValid}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs disabled:opacity-40"
      >
        {isLoading
          ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analyzing...</>
          : <><Sparkles className="w-4 h-4 mr-2" />Classify News (⌘+Enter)</>
        }
      </Button>

      <p className="text-[10px] font-mono text-muted-foreground/50 mt-2 text-center">
        Financial news only · Powered by Groq AI
      </p>

      {/* AI Analyst Summary — shown right after classification */}
      {lastResult && (
        <ClassifiedSummary
          result={lastResult}
          onDismiss={() => setLastResult(null)}
        />
      )}
    </div>
  );
}