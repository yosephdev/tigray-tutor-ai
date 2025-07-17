import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

class DatabaseService {
  async saveUserProgress(userId: string, lessonId: string, progress: number) {
    try {
      const progressRef = doc(db, 'progress', `${userId}_${lessonId}`);
      await setDoc(progressRef, {
        userId,
        lessonId,
        progress,
        updatedAt: new Date(),
      }, { merge: true });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  async getUserProgress(userId: string, lessonId: string) {
    try {
      const progressRef = doc(db, 'progress', `${userId}_${lessonId}`);
      const progressSnap = await getDoc(progressRef);
      
      if (progressSnap.exists()) {
        return progressSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting progress:', error);
      return null;
    }
  }

  async saveUserProfile(userId: string, profile: any) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...profile,
        updatedAt: new Date(),
      }, { merge: true });
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }
}

export const dbService = new DatabaseService();
