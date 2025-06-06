
import { database, Interaction } from './database';
import { ollamaService } from './ollama-service';
import { trainingService } from './training-service';

export class ChatService {
  async sendMessage(
    chatbotId: number, 
    userMessage: string, 
    chatbotName: string = 'Assistente'
  ): Promise<string> {
    try {
      // Verificar se o Ollama está rodando
      const isOllamaRunning = await ollamaService.checkHealth();
      if (!isOllamaRunning) {
        return 'Erro: Ollama não está rodando. Execute "ollama serve" no terminal e tente novamente.';
      }

      // Obter conhecimento do chatbot
      const knowledge = await trainingService.getChatbotKnowledge(chatbotId);
      
      // Gerar resposta usando Ollama
      const botResponse = await ollamaService.generateResponse(
        userMessage, 
        knowledge, 
        chatbotName
      );

      // Salvar interação no banco
      await database.addInteraction({
        chatbotId,
        userInput: userMessage,
        botResponse: botResponse,
        timestamp: new Date().toISOString()
      });

      return botResponse;
    } catch (error) {
      console.error('Erro no chat service:', error);
      return 'Desculpe, ocorreu um erro. Verifique se o Ollama está rodando.';
    }
  }

  async getChatHistory(chatbotId: number): Promise<Interaction[]> {
    return await database.getInteractionsByChatbotId(chatbotId);
  }

  async getChatMetrics(chatbotId: number) {
    const interactions = await this.getChatHistory(chatbotId);
    
    return {
      totalInteractions: interactions.length,
      totalUsers: new Set(interactions.map(i => 'user')).size, // Simplificado
      averageResponseTime: 1.2, // Simulado
      satisfactionScore: 4.5 // Simulado
    };
  }
}

export const chatService = new ChatService();
