import { db } from './firebase';
import { ref, set, get, child } from 'firebase/database';

class DatabaseService {
  async saveUserProgress(userId: string, lessonId: string, progress: number) {
    if (!db) return;
    try {
      const progressRef = ref(db, `progress/${userId}_${lessonId}`);
      await set(progressRef, {
        userId,
        lessonId,
        progress,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  async getUserProgress(userId: string, lessonId: string) {
    if (!db) return null;
    try {
      const dbRef = ref(db);
      const progressSnap = await get(child(dbRef, `progress/${userId}_${lessonId}`));
      
      if (progressSnap.exists()) {
        return progressSnap.val();
      }
      return null;
    } catch (error) {
      console.error('Error getting progress:', error);
      return null;
    }
  }

  async saveUserProfile(userId: string, profile: any) {
    if (!db) return;
    try {
      const userRef = ref(db, `users/${userId}`);
      await set(userRef, {
        ...profile,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }
}

export const dbService = new DatabaseService();
