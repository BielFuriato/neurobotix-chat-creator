
import { database, Interaction } from './database';
import { ollamaService } from './ollama-service';
import { trainingService } from './training-service';

export class ChatService {
  async sendMessage(
    chatbotId: number, 
    userMessage: string, 
    chatbotName: string = 'Assistente'
  ): Promise<string> {
    console.log(`💬 Nova mensagem para chatbot ${chatbotId} (${chatbotName}): "${userMessage}"`);
    
    try {
      // Verificar se o Ollama está rodando
      console.log(`🔍 Verificando status do Ollama...`);
      const isOllamaRunning = await ollamaService.checkHealth();
      console.log(`🤖 Ollama status: ${isOllamaRunning ? 'ATIVO' : 'INATIVO'}`);
      
      if (!isOllamaRunning) {
        return 'Erro: Ollama não está rodando. Execute "ollama serve" no terminal e tente novamente.';
      }

      // Obter conhecimento do chatbot
      console.log(`📚 Obtendo base de conhecimento do chatbot...`);
      const knowledge = await trainingService.getChatbotKnowledge(chatbotId);
      console.log(`📊 Conhecimento obtido: ${knowledge.length} caracteres`);
      console.log(`📝 Preview do conhecimento:`, knowledge.substring(0, 500) + '...');
      
      // Gerar resposta usando Ollama
      console.log(`🤖 Enviando para Ollama...`);
      const botResponse = await ollamaService.generateResponse(
        userMessage, 
        knowledge, 
        chatbotName
      );
      console.log(`✅ Resposta do Ollama: "${botResponse}"`);

      // Salvar interação no banco
      console.log(`💾 Salvando interação no banco...`);
      await database.addInteraction({
        chatbotId,
        userInput: userMessage,
        botResponse: botResponse,
        timestamp: new Date().toISOString()
      });
      console.log(`✅ Interação salva`);

      return botResponse;
    } catch (error) {
      console.error('❌ Erro no chat service:', error);
      return 'Desculpe, ocorreu um erro. Verifique se o Ollama está rodando.';
    }
  }

  async getChatHistory(chatbotId: number): Promise<Interaction[]> {
    console.log(`📜 Obtendo histórico do chat para chatbot ${chatbotId}`);
    const history = await database.getInteractionsByChatbotId(chatbotId);
    console.log(`📊 Histórico: ${history.length} interações encontradas`);
    return history;
  }

  async getChatMetrics(chatbotId: number) {
    const interactions = await this.getChatHistory(chatbotId);
    
    const metrics = {
      totalInteractions: interactions.length,
      totalUsers: new Set(interactions.map(i => 'user')).size, // Simplificado
      averageResponseTime: 1.2, // Simulado
      satisfactionScore: 4.5 // Simulado
    };
    
    console.log(`📈 Métricas do chatbot ${chatbotId}:`, metrics);
    return metrics;
  }
}

export const chatService = new ChatService();
