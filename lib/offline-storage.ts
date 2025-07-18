export class OfflineStorage {
  private dbName = 'Tigray TutorDB';
  private version = 1;

  async cacheLessons(lessons: any[]) {
    if ('caches' in window) {
      const cache = await caches.open('tigray-tutor-lessons');
      await cache.put('/lessons', new Response(JSON.stringify(lessons)));
    }
  }
  
  async getCachedLessons() {
    if ('caches' in window) {
      const cache = await caches.open('tigray-tutor-lessons');
      const response = await cache.match('/lessons');
      if (response) {
        return await response.json();
      }
    }
    return [];
  }
  
  async syncWhenOnline() {
    if (navigator.onLine) {
      // Sync cached data with Firebase
      console.log('Syncing offline data...');
    }
  }
}

export const offlineStorage = new OfflineStorage();
