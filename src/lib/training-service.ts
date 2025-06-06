
import { database, KnowledgeBase } from './database';
import { ollamaService } from './ollama-service';

export class TrainingService {
  // Processar upload de arquivos
  async processFileUpload(files: FileList, chatbotId: number): Promise<void> {
    for (const file of files) {
      try {
        const content = await this.extractTextFromFile(file);
        const processedContent = await ollamaService.processDocument(content, file.name);
        
        await database.addKnowledge({
          chatbotId,
          sourceType: file.type.includes('pdf') ? 'pdf' : 'doc',
          content: processedContent,
          fileName: file.name,
          uploadedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Erro ao processar arquivo ${file.name}:`, error);
        throw error;
      }
    }
  }

  // Extrair texto de arquivos
  private async extractTextFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        if (file.type === 'application/pdf') {
          // Para PDF, seria necessário uma biblioteca como pdf-parse
          // Por simplicidade, vamos simular a extração
          resolve(content || 'Conteúdo do PDF extraído');
        } else {
          // Para arquivos de texto
          resolve(content || '');
        }
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        // Para outros tipos, simula extração
        reader.readAsText(file);
      }
    });
  }

  // Processar URL
  async processUrl(url: string, chatbotId: number): Promise<void> {
    try {
      // Simula extração de conteúdo da URL
      // Em produção, usaria um scraper ou serviço de extração
      const content = `Conteúdo extraído de: ${url}`;
      
      await database.addKnowledge({
        chatbotId,
        sourceType: 'url',
        content: content,
        fileName: url,
        uploadedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao processar URL:', error);
      throw error;
    }
  }

  // Adicionar FAQ
  async addFaq(question: string, answer: string, chatbotId: number): Promise<void> {
    const content = `Pergunta: ${question}\nResposta: ${answer}`;
    
    await database.addKnowledge({
      chatbotId,
      sourceType: 'faq',
      content: content,
      fileName: `FAQ: ${question}`,
      uploadedAt: new Date().toISOString()
    });
  }

  // Adicionar conhecimento personalizado
  async addCustomKnowledge(content: string, chatbotId: number): Promise<void> {
    const processedContent = await ollamaService.processDocument(content, 'Conhecimento Personalizado');
    
    await database.addKnowledge({
      chatbotId,
      sourceType: 'custom',
      content: processedContent,
      fileName: 'Conhecimento Personalizado',
      uploadedAt: new Date().toISOString()
    });
  }

  // Obter todo o conhecimento de um chatbot formatado para o GPT
  async getChatbotKnowledge(chatbotId: number): Promise<string> {
    const knowledgeItems = await database.getKnowledgeByChatbotId(chatbotId);
    
    if (knowledgeItems.length === 0) {
      return 'Nenhum conhecimento específico foi fornecido. Responda de forma geral e educada.';
    }

    return knowledgeItems
      .map(item => `=== ${item.fileName} ===\n${item.content}`)
      .join('\n\n');
  }

  // Listar documentos de treinamento
  async getTrainingDocuments(chatbotId: number): Promise<KnowledgeBase[]> {
    return await database.getKnowledgeByChatbotId(chatbotId);
  }

  // Remover documento de treinamento
  async removeTrainingDocument(id: number): Promise<void> {
    await database.deleteKnowledge(id);
  }
}

export const trainingService = new TrainingService();
