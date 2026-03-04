import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { ClassifiedNews } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Props {
  onClassified: (result: ClassifiedNews) => void;
}

export function NewsAnalyzer({ onClassified }: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('classify-news', {
        body: { headline: input.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      onClassified(data as ClassifiedNews);
      setInput('');
      toast.success('News classified successfully');
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Classification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-border bg-card rounded-lg p-4">
      <h2 className="text-sm font-semibold text-card-foreground mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        AI News Classifier
      </h2>
      <Textarea
        placeholder="Paste a financial news headline or article snippet to classify..."
        className="bg-muted border-border text-sm font-mono min-h-[80px] resize-none mb-3 placeholder:text-muted-foreground/50"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) analyze();
        }}
      />
      <Button
        onClick={analyze}
        disabled={loading || !input.trim()}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
        {loading ? 'Analyzing...' : 'Classify News (⌘+Enter)'}
      </Button>
    </div>
  );
}
