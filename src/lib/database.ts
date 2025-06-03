
// Configuração do IndexedDB para armazenamento local
interface User {
  id?: number;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

interface Chatbot {
  id?: number;
  userId: number;
  name: string;
  description: string;
  avatarUrl?: string;
  sector: string;
  status: 'active' | 'inactive' | 'training';
  createdAt: string;
}

interface KnowledgeBase {
  id?: number;
  chatbotId: number;
  sourceType: 'pdf' | 'doc' | 'url' | 'faq' | 'custom';
  content: string;
  fileName?: string;
  uploadedAt: string;
}

interface Interaction {
  id?: number;
  chatbotId: number;
  userInput: string;
  botResponse: string;
  timestamp: string;
}

interface Settings {
  chatbotId: number;
  themeColor: string;
  font: string;
  style: string;
  integrationScript?: string;
  attendantName: string;
}

class Database {
  private dbName = 'neurobot_db';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Users table
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
          userStore.createIndex('email', 'email', { unique: true });
        }

        // Chatbots table
        if (!db.objectStoreNames.contains('chatbots')) {
          const chatbotStore = db.createObjectStore('chatbots', { keyPath: 'id', autoIncrement: true });
          chatbotStore.createIndex('userId', 'userId', { unique: false });
        }

        // Knowledge base table
        if (!db.objectStoreNames.contains('knowledge_base')) {
          const knowledgeStore = db.createObjectStore('knowledge_base', { keyPath: 'id', autoIncrement: true });
          knowledgeStore.createIndex('chatbotId', 'chatbotId', { unique: false });
        }

        // Interactions table
        if (!db.objectStoreNames.contains('interactions')) {
          const interactionStore = db.createObjectStore('interactions', { keyPath: 'id', autoIncrement: true });
          interactionStore.createIndex('chatbotId', 'chatbotId', { unique: false });
        }

        // Settings table
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'chatbotId' });
        }
      };
    });
  }

  // Users methods
  async createUser(user: Omit<User, 'id'>): Promise<number> {
    const transaction = this.db!.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.add(user);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const transaction = this.db!.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    const index = store.index('email');
    const request = index.get(email);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Chatbots methods
  async createChatbot(chatbot: Omit<Chatbot, 'id'>): Promise<number> {
    const transaction = this.db!.transaction(['chatbots'], 'readwrite');
    const store = transaction.objectStore('chatbots');
    const request = store.add(chatbot);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getChatbotsByUserId(userId: number): Promise<Chatbot[]> {
    const transaction = this.db!.transaction(['chatbots'], 'readonly');
    const store = transaction.objectStore('chatbots');
    const index = store.index('userId');
    const request = index.getAll(userId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getChatbotById(id: number): Promise<Chatbot | null> {
    const transaction = this.db!.transaction(['chatbots'], 'readonly');
    const store = transaction.objectStore('chatbots');
    const request = store.get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async updateChatbot(chatbot: Chatbot): Promise<void> {
    const transaction = this.db!.transaction(['chatbots'], 'readwrite');
    const store = transaction.objectStore('chatbots');
    const request = store.put(chatbot);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Knowledge base methods
  async addKnowledge(knowledge: Omit<KnowledgeBase, 'id'>): Promise<number> {
    const transaction = this.db!.transaction(['knowledge_base'], 'readwrite');
    const store = transaction.objectStore('knowledge_base');
    const request = store.add(knowledge);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getKnowledgeByChatbotId(chatbotId: number): Promise<KnowledgeBase[]> {
    const transaction = this.db!.transaction(['knowledge_base'], 'readonly');
    const store = transaction.objectStore('knowledge_base');
    const index = store.index('chatbotId');
    const request = index.getAll(chatbotId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteKnowledge(id: number): Promise<void> {
    const transaction = this.db!.transaction(['knowledge_base'], 'readwrite');
    const store = transaction.objectStore('knowledge_base');
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Interactions methods
  async addInteraction(interaction: Omit<Interaction, 'id'>): Promise<number> {
    const transaction = this.db!.transaction(['interactions'], 'readwrite');
    const store = transaction.objectStore('interactions');
    const request = store.add(interaction);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getInteractionsByChatbotId(chatbotId: number): Promise<Interaction[]> {
    const transaction = this.db!.transaction(['interactions'], 'readonly');
    const store = transaction.objectStore('interactions');
    const index = store.index('chatbotId');
    const request = index.getAll(chatbotId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Settings methods
  async saveSettings(settings: Settings): Promise<void> {
    const transaction = this.db!.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');
    const request = store.put(settings);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSettings(chatbotId: number): Promise<Settings | null> {
    const transaction = this.db!.transaction(['settings'], 'readonly');
    const store = transaction.objectStore('settings');
    const request = store.get(chatbotId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }
}

export const database = new Database();
export type { User, Chatbot, KnowledgeBase, Interaction, Settings };
