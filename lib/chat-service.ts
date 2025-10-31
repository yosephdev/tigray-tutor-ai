import { getAdminDatabase } from './firebase-admin';

class ChatService {
  private getDb() {
    return getAdminDatabase();
  }

  async saveMessage(userId: string, message: any) {
    try {
      const db = this.getDb();
      const messagesRef = db.ref(`chats/${userId}/messages`);
      const newMessageRef = messagesRef.push();
      await newMessageRef.set(message);
      console.log('Message saved successfully');
    } catch (error) {
      console.error('Error saving message:', error);
      throw new Error('Could not save message');
    }
  }

  async getMessages(userId: string) {
    try {
      const db = this.getDb();
      const messagesRef = db.ref(`chats/${userId}/messages`);
      const snapshot = await messagesRef.once('value');
      const messages = snapshot.val();
      return messages ? Object.keys(messages).map(key => ({ id: key, ...messages[key] })) : [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Could not fetch messages');
    }
  }
}

export const chatService = new ChatService();
