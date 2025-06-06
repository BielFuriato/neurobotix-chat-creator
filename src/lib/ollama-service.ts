
// Serviço para integração com Ollama local
const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const DEFAULT_MODEL = 'llama3.2:3b'; // Modelo padrão

interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OllamaResponse {
  response: string;
  done: boolean;
}

export class OllamaService {
  private model: string;

  constructor(model?: string) {
    this.model = model || DEFAULT_MODEL;
  }

  async generateResponse(
    userMessage: string, 
    context: string, 
    chatbotName: string = 'Assistente'
  ): Promise<string> {
    console.log(`🤖 Ollama - Gerando resposta com modelo: ${this.model}`);
    console.log(`👤 Usuário: "${userMessage}"`);
    console.log(`🤖 Chatbot: ${chatbotName}`);
    console.log(`📚 Contexto (${context.length} caracteres):`, context.substring(0, 500) + '...');
    
    try {
      // Sistema de prompt melhorado para usar o conhecimento de forma mais efetiva
      const systemPrompt = `Você é ${chatbotName}, um assistente virtual especializado e inteligente.

IMPORTANTE: Use APENAS as informações da BASE DE CONHECIMENTO abaixo para responder. NÃO invente informações.

BASE DE CONHECIMENTO:
${context}

INSTRUÇÕES DE RESPOSTA:
1. Leia cuidadosamente a pergunta do usuário
2. Procure na base de conhecimento acima por informações relevantes
3. Se encontrar informações relevantes, responda de forma completa e precisa
4. Se NÃO encontrar informações na base de conhecimento, responda: "Desculpe, não tenho informações específicas sobre isso na minha base de conhecimento atual. Posso ajudá-lo com algo mais relacionado ao que foi treinado?"
5. Seja cordial, profissional e direto
6. Use apenas fatos da base de conhecimento, nunca invente informações
7. Se apropriado, cite o documento de origem da informação

REGRAS IMPORTANTES:
- NUNCA invente preços, horários, políticas ou informações não presentes na base
- SEMPRE baseie suas respostas no conhecimento fornecido
- Se a pergunta for muito vaga, peça esclarecimentos
- Mantenha um tom profissional e prestativo`;

      const fullPrompt = `${systemPrompt}

PERGUNTA DO USUÁRIO: ${userMessage}

RESPOSTA (baseada apenas na base de conhecimento):`;
      
      console.log(`📝 Prompt completo gerado (${fullPrompt.length} caracteres)`);

      const requestBody = {
        model: this.model,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.3, // Mais baixo para respostas mais precisas
          top_p: 0.8,
          max_tokens: 800,
          stop: ['PERGUNTA DO USUÁRIO:', 'BASE DE CONHECIMENTO:']
        }
      };
      
      console.log(`🚀 Enviando requisição para Ollama...`);

      const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log(`📡 Resposta HTTP: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        throw new Error(`Erro na API Ollama: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      console.log(`✅ Resposta bruta do Ollama:`, data);
      
      const finalResponse = data.response?.trim() || 'Desculpe, não consegui gerar uma resposta adequada.';
      console.log(`📤 Resposta final: "${finalResponse}"`);
      
      return finalResponse;

    } catch (error) {
      console.error('❌ Erro ao chamar Ollama:', error);
      
      // Verificar se é erro de conexão
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return 'Erro: Ollama não está rodando. Execute "ollama serve" no terminal e tente novamente.';
      }
      
      return 'Desculpe, estou temporariamente indisponível. Verifique se o Ollama está rodando.';
    }
  }

  // Método para processar e extrair texto de documentos
  async processDocument(content: string, fileName: string): Promise<string> {
    console.log(`📄 Processando documento: ${fileName} (${content.length} caracteres)`);
    
    try {
      const prompt = `Extraia e organize as informações mais importantes deste documento. Mantenha a formatação clara e organize por tópicos quando apropriado.

Documento: ${fileName}

Conteúdo:
${content}

Resposta organizada:`;

      console.log(`📝 Prompt para processamento: ${prompt.substring(0, 200)}...`);

      const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.3,
            max_tokens: 1000
          }
        })
      });

      if (!response.ok) {
        console.log(`⚠️ Erro HTTP ao processar documento: ${response.status}, usando conteúdo original`);
        return content; // Retorna conteúdo original se falhar
      }

      const data: OllamaResponse = await response.json();
      const processedContent = data.response || content;
      
      console.log(`✅ Documento processado: ${processedContent.length} caracteres`);
      return processedContent;

    } catch (error) {
      console.error('❌ Erro ao processar documento:', error);
      console.log(`⚠️ Retornando conteúdo original devido ao erro`);
      return content; // Retorna conteúdo original se falhar
    }
  }

  // Método para verificar se o Ollama está rodando
  async checkHealth(): Promise<boolean> {
    try {
      console.log(`🔍 Verificando saúde do Ollama...`);
      const response = await fetch('http://localhost:11434/api/tags');
      const isHealthy = response.ok;
      console.log(`💚 Ollama health check: ${isHealthy ? 'OK' : 'FALHOU'}`);
      return isHealthy;
    } catch (error) {
      console.error('❌ Erro no health check do Ollama:', error);
      return false;
    }
  }

  // Método para listar modelos disponíveis
  async listModels(): Promise<string[]> {
    try {
      console.log(`📋 Listando modelos disponíveis...`);
      const response = await fetch('http://localhost:11434/api/tags');
      if (!response.ok) {
        console.log(`⚠️ Erro ao listar modelos: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      const models = data.models?.map((model: any) => model.name) || [];
      console.log(`📊 Modelos encontrados:`, models);
      return models;
    } catch (error) {
      console.error('❌ Erro ao listar modelos:', error);
      return [];
    }
  }
}

export const ollamaService = new OllamaService();
