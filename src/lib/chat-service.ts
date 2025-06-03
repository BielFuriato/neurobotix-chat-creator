
import { database, Interaction } from './database';
import { gptService } from './gpt-service';
import { trainingService } from './training-service';

export class ChatService {
  async sendMessage(
    chatbotId: number, 
    userMessage: string, 
    chatbotName: string = 'Assistente'
  ): Promise<string> {
    try {
      // Obter conhecimento do chatbot
      const knowledge = await trainingService.getChatbotKnowledge(chatbotId);
      
      // Gerar resposta usando GPT
      const botResponse = await gptService.generateResponse(
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
      return 'Desculpe, ocorreu um erro. Tente novamente.';
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
