import { database, KnowledgeBase } from "./database";
import { ollamaService } from "./ollama-service";

// Configuração simplificada do PDF.js para Vite
const pdfjsLib = await import('pdfjs-dist');
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

export class TrainingService {
  /**
   * Processa o upload de arquivos (PDFs, DOCs, TXTs)
   */
  async processFileUpload(
    files: FileList, 
    chatbotId: number,
    progressCallback?: (progress: number) => void
  ): Promise<void> {
    console.log(`🔄 Iniciando processamento de ${files.length} arquivo(s)`);

    const totalFiles = files.length;
    let processedFiles = 0;

    for (const file of files) {
      try {
        if (progressCallback) progressCallback((processedFiles / totalFiles) * 50);
        
        console.log(`📄 Processando arquivo: ${file.name} (${file.type}, ${file.size} bytes)`);

        let content = '';
        
        if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
          content = await this.extractTextFromPdf(file);
        } else {
          content = await this.readFileAsText(file);
        }

        // Remove metadados e referências ao arquivo
        content = this.cleanContent(content, file.name);

        if (content.length < 10) {
          throw new Error("O documento não contém texto suficiente");
        }

        if (progressCallback) progressCallback((processedFiles / totalFiles) * 80);

        // Processa o conteúdo sem mencionar a origem
        const processedContent = await ollamaService.processDocument(
          content,
          "Conteúdo extraído"
        );

        await database.addKnowledge({
          chatbotId,
          sourceType: "pdf",
          content: processedContent,
          fileName: "Conhecimento de documento",
          uploadedAt: new Date().toISOString(),
        });

        processedFiles++;
        if (progressCallback) progressCallback((processedFiles / totalFiles) * 100);

      } catch (error) {
        console.error(`❌ Erro ao processar arquivo ${file.name}:`, error);
        throw error;
      }
    }
  }

  /**
   * Extrai texto de PDFs usando pdf.js
   */
  private extractTextFromPdf(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const processPdf = async () => {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const loadingTask = pdfjsLib.getDocument(arrayBuffer);
          const pdf = await loadingTask.promise;
          
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            // Filtra apenas itens que contém texto
            const textItems = textContent.items.filter((item): item is { str: string } => 
              'str' in item
            );
            
            fullText += textItems.map(item => item.str).join(' ') + '\n\n';
            page.cleanup();
          }
          
          resolve(fullText.trim());
        } catch (error) {
          console.error(`❌ Erro ao extrair texto do PDF:`, error);
          reject(new Error(`Falha ao processar PDF: ${error instanceof Error ? error.message : String(error)}`));
        }
      };

      processPdf().catch(reject);
    });
  }

  /**
   * Limpa o conteúdo removendo metadados e referências
   */
  private cleanContent(content: string, filename: string): string {
    // Remove referências ao nome do arquivo
    let cleaned = content.replace(new RegExp(filename, 'gi'), '');
    
    // Remove metadados comuns
    const metadataPatterns = [
      /Creator:.*?\n/g,
      /Producer:.*?\n/g,
      /CreationDate:.*?\n/g,
      /ModDate:.*?\n/g,
      /Page \d+ of \d+/g,
      /\d{1,3}\s+\/\s+\d{1,3}/g,
      /^.*\.pdf$/gim
    ];
    
    metadataPatterns.forEach(pattern => {
      cleaned = cleaned.replace(pattern, '');
    });
    
    return cleaned.trim();
  }

  /**
   * Lê arquivos de texto (TXT, DOC, DOCX simplificado)
   */
  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || "");
      reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
      reader.readAsText(file);
    });
  }

  /**
   * Processa URLs para extrair conteúdo
   */
  async processUrl(
    url: string, 
    chatbotId: number, 
    progressCallback?: (progress: number) => void
  ): Promise<void> {
    try {
      if (progressCallback) progressCallback(30);
      
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error(`Erro ao buscar URL: ${response.status}`);
      
      if (progressCallback) progressCallback(60);
      
      const data = await response.json();
      const htmlContent = data.contents;
      
      if (!htmlContent) throw new Error("Nenhum conteúdo encontrado na URL");
      
      const textContent = this.extractTextFromHtml(htmlContent);
      
      if (progressCallback) progressCallback(80);
      
      const processedContent = await ollamaService.processDocument(
        textContent,
        "Conteúdo da web"
      );
      
      await database.addKnowledge({
        chatbotId,
        sourceType: "url",
        content: processedContent,
        fileName: url,
        uploadedAt: new Date().toISOString(),
      });
      
      if (progressCallback) progressCallback(100);
    } catch (error) {
      console.error("❌ Erro ao processar URL:", error);
      throw error;
    }
  }

  /**
   * Extrai texto de HTML
   */
  private extractTextFromHtml(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove elementos desnecessários
    const elementsToRemove = temp.querySelectorAll('script, style, noscript, header, footer');
    elementsToRemove.forEach(el => el.remove());
    
    return temp.textContent?.replace(/\s+/g, ' ').trim() || '';
  }

  /**
   * Adiciona uma FAQ à base de conhecimento
   */
  async addFaq(
    question: string,
    answer: string,
    chatbotId: number,
    progressCallback?: (progress: number) => void
  ): Promise<void> {
    try {
      if (progressCallback) progressCallback(30);
      
      const content = `Pergunta: ${question}\nResposta: ${answer}`;

      await database.addKnowledge({
        chatbotId,
        sourceType: "faq",
        content: content,
        fileName: `FAQ: ${question.substring(0, 50)}${question.length > 50 ? '...' : ''}`,
        uploadedAt: new Date().toISOString(),
      });

      if (progressCallback) progressCallback(100);
    } catch (error) {
      console.error("❌ Erro ao adicionar FAQ:", error);
      throw error;
    }
  }

  /**
   * Adiciona conhecimento personalizado
   */
  async addCustomKnowledge(
    content: string,
    chatbotId: number,
    progressCallback?: (progress: number) => void
  ): Promise<void> {
    try {
      if (progressCallback) progressCallback(30);
      
      const processedContent = await ollamaService.processDocument(
        content,
        "Conhecimento personalizado"
      );

      await database.addKnowledge({
        chatbotId,
        sourceType: "custom",
        content: processedContent,
        fileName: "Conhecimento personalizado",
        uploadedAt: new Date().toISOString(),
      });

      if (progressCallback) progressCallback(100);
    } catch (error) {
      console.error("❌ Erro ao adicionar conhecimento:", error);
      throw error;
    }
  }

  /**
   * Obtém todo o conhecimento de um chatbot
   */
  async getChatbotKnowledge(chatbotId: number): Promise<string> {
    const knowledgeItems = await database.getKnowledgeByChatbotId(chatbotId);
    return knowledgeItems
      .map(item => item.content)
      .join("\n\n---\n\n");
  }

  /**
   * Lista documentos de treinamento
   */
  async getTrainingDocuments(chatbotId: number): Promise<KnowledgeBase[]> {
    return await database.getKnowledgeByChatbotId(chatbotId);
  }

  /**
   * Remove documento de treinamento
   */
  async removeTrainingDocument(id: number): Promise<void> {
    await database.deleteKnowledge(id);
  }
}

export const trainingService = new TrainingService();