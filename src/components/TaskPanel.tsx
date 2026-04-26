/**
 * TaskPanel.tsx — Per-user task/watchlist manager.
 * Connects to Supabase via useTasks hook.
 */

import { useState } from 'react';
import { useTasks, Task } from '@/hooks/useTasks';
import { CheckSquare, Square, Trash2, Plus, Loader2, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  userId: string;
}

export function TaskPanel({ userId }: Props) {
  const { tasks, loading, addTask, toggleTask, deleteTask } = useTasks(userId);
  const [title, setTitle] = useState('');
  const [ticker, setTicker] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;
    setAdding(true);
    await addTask(title.trim(), ticker.trim() || undefined);
    setTitle('');
    setTicker('');
    setAdding(false);
  };

  return (
    <div className="border border-border bg-card rounded-lg p-4">
      <h2 className="text-sm font-semibold text-card-foreground mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
        <ListTodo className="w-4 h-4 text-primary" />
        My Watchlist
      </h2>

      {/* Add task */}
      <div className="flex gap-2 mb-3">
        <input
          value={ticker}
          onChange={e => setTicker(e.target.value.toUpperCase())}
          placeholder="AAPL"
          className="w-16 bg-muted border border-border rounded px-2 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60"
          maxLength={5}
        />
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Watch for earnings report..."
          className="flex-1 bg-muted border border-border rounded px-2 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60"
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
        />
        <Button size="sm" onClick={handleAdd} disabled={adding || !title.trim()}
          className="bg-primary/20 border border-primary/40 hover:bg-primary/30 text-primary h-auto px-2 py-1.5">
          {adding ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
        </Button>
      </div>

      {/* Task list */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span className="text-xs font-mono">Loading...</span>
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-xs font-mono text-muted-foreground text-center py-4">
            No tasks yet — add a ticker to watch
          </p>
        ) : tasks.map((task: Task) => (
          <div key={task.id}
            className={`flex items-center gap-2 px-2 py-1.5 rounded border transition-all group ${
              task.done ? 'border-border/30 opacity-50' : 'border-border hover:border-primary/30'
            }`}>
            <button onClick={() => toggleTask(task.id, !task.done)} className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors">
              {task.done ? <CheckSquare className="w-3.5 h-3.5 text-primary" /> : <Square className="w-3.5 h-3.5" />}
            </button>
            {task.ticker && (
              <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded flex-shrink-0">
                {task.ticker}
              </span>
            )}
            <span className={`flex-1 text-xs font-mono truncate ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all flex-shrink-0">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {tasks.length > 0 && (
        <p className="text-[10px] font-mono text-muted-foreground mt-2 text-right">
          {tasks.filter(t => t.done).length}/{tasks.length} completed
        </p>
      )}
    </div>
  );
}