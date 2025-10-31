import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

export class AuthService {
  async signIn(email: string, password: string) {
    if (!auth) throw new Error("Auth not initialized");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async signUp(email: string, password: string) {
    if (!auth) throw new Error("Auth not initialized");
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async signOut() {
    if (!auth) throw new Error("Auth not initialized");
    await signOut(auth);
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    if (!auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  }
}

export const authService = new AuthService();