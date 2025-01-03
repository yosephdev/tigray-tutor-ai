import { createClient } from '@supabase/supabase-js';
import { AppError } from './error-handling';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function updateProgress(userId: string, lessonId: string, score: number) {
    const { data, error } = await supabase
      .from('progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        score,
        completed: score >= 70,
        last_accessed: new Date().toISOString()
      });
  
    if (error) throw new AppError('Failed to update progress', 500);
    return data;
  }