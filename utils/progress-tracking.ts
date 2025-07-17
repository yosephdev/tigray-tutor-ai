import { Redis } from '@upstash/redis';
import { AppError } from './error-handling';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function updateProgress(userId: string, lessonId: string, score: number) {
    const key = `progress:${userId}:${lessonId}`;
    const value = {
        user_id: userId,
        lesson_id: lessonId,
        score,
        completed: score >= 70,
        last_accessed: new Date().toISOString()
    };

    try {
        await redis.hset(key, value);
        return value;
    } catch (error) {
        throw new AppError('Failed to update progress', 500);
    }
}