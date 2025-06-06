
import { database, KnowledgeBase } from './database';
import { ollamaService } from './ollama-service';

// Importar pdf-parse para extrair texto de PDFs
let pdfParse: any = null;

// Carregar pdf-parse dinamicamente
const loadPdfParse = async () => {
  if (!pdfParse) {
    try {
      pdfParse = (await import('pdf-parse')).default;
      console.log('📚 pdf-parse carregado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao carregar pdf-parse:', error);
      throw new Error('Biblioteca PDF não disponível');
    }
  }
  return pdfParse;
};

export class TrainingService {
  // Processar upload de arquivos
  async processFileUpload(files: FileList, chatbotId: number): Promise<void> {
    console.log(`🔄 Iniciando processamento de ${files.length} arquivo(s) para chatbot ${chatbotId}`);
    
    for (const file of files) {
      try {
        console.log(`📄 Processando arquivo: ${file.name} (${file.type}, ${file.size} bytes)`);
        
        const content = await this.extractTextFromFile(file);
        console.log(`📝 Texto extraído (${content.length} caracteres):`, content.substring(0, 500) + '...');
        
        if (content.length < 10) {
          console.warn(`⚠️ Arquivo ${file.name} tem conteúdo muito pequeno, pode não ter sido extraído corretamente`);
        }
        
        const processedContent = await ollamaService.processDocument(content, file.name);
        console.log(`🤖 Conteúdo processado pelo Ollama (${processedContent.length} caracteres):`, processedContent.substring(0, 300) + '...');
        
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
    console.log(`📚 Base de conhecimento atual (${allKnowledge.length} caracteres)`);
  }

  // Extrair texto de arquivos com suporte real a PDF
  private async extractTextFromFile(file: File): Promise<string> {
    console.log(`🔍 Extraindo texto de: ${file.name} (${file.type})`);
    
    return new Promise(async (resolve, reject) => {
      try {
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          console.log(`📖 Processando PDF: ${file.name}`);
          
          // Carregar biblioteca PDF
          const pdfParser = await loadPdfParse();
          
          // Converter arquivo para buffer
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          console.log(`🔧 Extraindo texto do PDF (${buffer.length} bytes)...`);
          
          // Extrair texto do PDF
          const data = await pdfParser(buffer);
          const extractedText = data.text || '';
          
          console.log(`✅ PDF processado: ${extractedText.length} caracteres extraídos`);
          console.log(`📄 Preview do texto:`, extractedText.substring(0, 500) + '...');
          
          if (extractedText.length === 0) {
            console.warn(`⚠️ PDF ${file.name} não contém texto extraível`);
            resolve('PDF sem texto extraível ou protegido.');
          } else {
            resolve(extractedText);
          }
          
        } else {
          // Para arquivos de texto
          console.log(`📄 Processando arquivo de texto: ${file.name}`);
          
          const reader = new FileReader();
          
          reader.onload = (e) => {
            const content = e.target?.result as string;
            console.log(`📄 Arquivo de texto processado: ${content ? content.length : 0} caracteres`);
            resolve(content || '');
          };
          
          reader.onerror = () => {
            console.error(`❌ Erro ao ler arquivo ${file.name}:`, reader.error);
            reject(new Error('Erro ao ler arquivo'));
          };
          
          reader.readAsText(file);
        }
      } catch (error) {
        console.error(`❌ Erro ao extrair texto de ${file.name}:`, error);
        reject(error);
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
    const content = `PERGUNTA FREQUENTE:
Pergunta: ${question}
Resposta: ${answer}

Esta é uma pergunta frequente que deve ser respondida exatamente como especificado acima.`;
    
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

  // Obter todo o conhecimento de um chatbot formatado para o Ollama
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
        return `=== DOCUMENTO: ${item.fileName} ===
TIPO: ${item.sourceType.toUpperCase()}
CONTEÚDO:
${item.content}

---`;
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
