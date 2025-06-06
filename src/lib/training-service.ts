
import { database, KnowledgeBase } from './database';
import { ollamaService } from './ollama-service';

export class TrainingService {
  // Processar upload de arquivos
  async processFileUpload(files: FileList, chatbotId: number): Promise<void> {
    console.log(`🔄 Iniciando processamento de ${files.length} arquivo(s) para chatbot ${chatbotId}`);
    
    for (const file of files) {
      try {
        console.log(`📄 Processando arquivo: ${file.name} (${file.type})`);
        
        const content = await this.extractTextFromFile(file);
        console.log(`📝 Texto extraído (${content.length} caracteres):`, content.substring(0, 200) + '...');
        
        const processedContent = await ollamaService.processDocument(content, file.name);
        console.log(`🤖 Conteúdo processado pelo Ollama (${processedContent.length} caracteres):`, processedContent.substring(0, 200) + '...');
        
        const knowledgeId = await database.addKnowledge({
          chatbotId,
          sourceType: file.type.includes('pdf') ? 'pdf' : 'doc',
          content: processedContent,
          fileName: file.name,
          uploadedAt: new Date().toISOString()
        });
        
        console.log(`✅ Conhecimento salvo no banco com ID: ${knowledgeId}`);
      } catch (error) {
        console.error(`❌ Erro ao processar arquivo ${file.name}:`, error);
        throw error;
      }
    }
    
    console.log(`🎉 Processamento completo! Verificando base de conhecimento...`);
    const allKnowledge = await this.getChatbotKnowledge(chatbotId);
    console.log(`📚 Base de conhecimento atual (${allKnowledge.length} caracteres):`, allKnowledge.substring(0, 300) + '...');
  }

  // Extrair texto de arquivos
  private async extractTextFromFile(file: File): Promise<string> {
    console.log(`🔍 Extraindo texto de: ${file.name} (${file.type})`);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        if (file.type === 'application/pdf') {
          // Para PDF, seria necessário uma biblioteca como pdf-parse
          // Por simplicidade, vamos simular a extração
          console.log(`⚠️ PDF detectado - usando extração simulada para ${file.name}`);
          resolve(content || 'Conteúdo do PDF extraído - ATENÇÃO: Esta é uma simulação, o conteúdo real do PDF não está sendo lido corretamente');
        } else {
          // Para arquivos de texto
          console.log(`📄 Arquivo de texto processado: ${content ? content.length : 0} caracteres`);
          resolve(content || '');
        }
      };
      
      reader.onerror = () => {
        console.error(`❌ Erro ao ler arquivo ${file.name}:`, reader.error);
        reject(new Error('Erro ao ler arquivo'));
      };
      
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        // Para outros tipos, simula extração
        console.log(`⚠️ Tipo de arquivo não suportado completamente: ${file.type}`);
        reader.readAsText(file);
      }
    });
  }

  // Processar URL
  async processUrl(url: string, chatbotId: number): Promise<void> {
    try {
      console.log(`🌐 Processando URL: ${url} para chatbot ${chatbotId}`);
      
      // Simula extração de conteúdo da URL
      // Em produção, usaria um scraper ou serviço de extração
      const content = `Conteúdo extraído de: ${url}`;
      console.log(`📝 Conteúdo da URL (simulado): ${content}`);
      
      await database.addKnowledge({
        chatbotId,
        sourceType: 'url',
        content: content,
        fileName: url,
        uploadedAt: new Date().toISOString()
      });
      
      console.log(`✅ URL adicionada à base de conhecimento`);
    } catch (error) {
      console.error('❌ Erro ao processar URL:', error);
      throw error;
    }
  }

  // Adicionar FAQ
  async addFaq(question: string, answer: string, chatbotId: number): Promise<void> {
    const content = `Pergunta: ${question}\nResposta: ${answer}`;
    console.log(`❓ Adicionando FAQ para chatbot ${chatbotId}:`, content);
    
    await database.addKnowledge({
      chatbotId,
      sourceType: 'faq',
      content: content,
      fileName: `FAQ: ${question}`,
      uploadedAt: new Date().toISOString()
    });
    
    console.log(`✅ FAQ adicionada à base de conhecimento`);
  }

  // Adicionar conhecimento personalizado
  async addCustomKnowledge(content: string, chatbotId: number): Promise<void> {
    console.log(`📝 Adicionando conhecimento personalizado para chatbot ${chatbotId} (${content.length} caracteres)`);
    
    const processedContent = await ollamaService.processDocument(content, 'Conhecimento Personalizado');
    console.log(`🤖 Conhecimento processado pelo Ollama: ${processedContent.substring(0, 200)}...`);
    
    await database.addKnowledge({
      chatbotId,
      sourceType: 'custom',
      content: processedContent,
      fileName: 'Conhecimento Personalizado',
      uploadedAt: new Date().toISOString()
    });
    
    console.log(`✅ Conhecimento personalizado salvo`);
  }

  // Obter todo o conhecimento de um chatbot formatado para o GPT
  async getChatbotKnowledge(chatbotId: number): Promise<string> {
    console.log(`📚 Buscando conhecimento para chatbot ${chatbotId}`);
    
    const knowledgeItems = await database.getKnowledgeByChatbotId(chatbotId);
    console.log(`📊 Encontrados ${knowledgeItems.length} itens de conhecimento`);
    
    if (knowledgeItems.length === 0) {
      console.log(`⚠️ Nenhum conhecimento encontrado para chatbot ${chatbotId}`);
      return 'Nenhum conhecimento específico foi fornecido. Responda de forma geral e educada.';
    }

    const formattedKnowledge = knowledgeItems
      .map((item, index) => {
        console.log(`📄 Item ${index + 1}: ${item.fileName} (${item.content.length} caracteres, tipo: ${item.sourceType})`);
        return `=== ${item.fileName} ===\n${item.content}`;
      })
      .join('\n\n');

    console.log(`📚 Base de conhecimento final: ${formattedKnowledge.length} caracteres total`);
    return formattedKnowledge;
  }

  // Listar documentos de treinamento
  async getTrainingDocuments(chatbotId: number): Promise<KnowledgeBase[]> {
    console.log(`📋 Listando documentos de treinamento para chatbot ${chatbotId}`);
    const documents = await database.getKnowledgeByChatbotId(chatbotId);
    console.log(`📊 Encontrados ${documents.length} documentos`);
    return documents;
  }

  // Remover documento de treinamento
  async removeTrainingDocument(id: number): Promise<void> {
    console.log(`🗑️ Removendo documento de treinamento ID: ${id}`);
    await database.deleteKnowledge(id);
    console.log(`✅ Documento removido`);
  }
}

export const trainingService = new TrainingService();
