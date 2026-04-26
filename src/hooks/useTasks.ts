/**
 * useTasks.ts
 * Per-user task/watchlist management stored in Supabase table `user_tasks`.
 *
 * Table schema (run in Supabase SQL editor):
 *   create table user_tasks (
 *     id uuid primary key default gen_random_uuid(),
 *     user_id uuid references auth.users not null,
 *     title text not null,
 *     ticker text,
 *     note text,
 *     done boolean default false,
 *     created_at timestamptz default now()
 *   );
 *   alter table user_tasks enable row level security;
 *   create policy "Users manage own tasks"
 *     on user_tasks for all using (auth.uid() = user_id);
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Task {
  id: string;
  title: string;
  ticker: string | null;
  note: string | null;
  done: boolean;
  created_at: string;
}

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('user_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to load tasks');
    else setTasks(data as Task[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const addTask = async (title: string, ticker?: string, note?: string) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('user_tasks')
      .insert({ user_id: userId, title, ticker: ticker || null, note: note || null })
      .select()
      .single();
    if (error) { toast.error('Failed to add task'); return; }
    setTasks(prev => [data as Task, ...prev]);
    toast.success('Task added');
  };

  const toggleTask = async (id: string, done: boolean) => {
    const { error } = await supabase
      .from('user_tasks')
      .update({ done })
      .eq('id', id);
    if (error) { toast.error('Failed to update task'); return; }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done } : t));
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('user_tasks').delete().eq('id', id);
    if (error) { toast.error('Failed to delete task'); return; }
    setTasks(prev => prev.filter(t => t.id !== id));
    toast.success('Task removed');
  };

  return { tasks, loading, addTask, toggleTask, deleteTask, refetch: fetchTasks };
}