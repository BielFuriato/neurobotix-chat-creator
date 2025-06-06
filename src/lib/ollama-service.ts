
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
    try {
      // Sistema de prompt que incorpora o conhecimento treinado
      const systemPrompt = `Você é ${chatbotName}, um assistente virtual inteligente.
      
CONHECIMENTO BASE:
${context}

INSTRUÇÕES:
- Use APENAS as informações fornecidas no conhecimento base para responder
- Se a pergunta não puder ser respondida com as informações disponíveis, diga: "Desculpe, não tenho informações suficientes para responder essa pergunta. Posso ajudá-lo com algo mais?"
- Seja cordial, profissional e direto
- Mantenha respostas concisas mas completas
- Se apropriado, ofereça informações relacionadas que possam ser úteis`;

      const fullPrompt = `${systemPrompt}\n\nUsuário: ${userMessage}\nAssistente:`;

      const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: fullPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 500
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API Ollama: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response || 'Desculpe, não consegui gerar uma resposta.';

    } catch (error) {
      console.error('Erro ao chamar Ollama:', error);
      
      // Verificar se é erro de conexão
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return 'Erro: Ollama não está rodando. Execute "ollama serve" no terminal e tente novamente.';
      }
      
      return 'Desculpe, estou temporariamente indisponível. Verifique se o Ollama está rodando.';
    }
  }

  // Método para processar e extrair texto de documentos
  async processDocument(content: string, fileName: string): Promise<string> {
    try {
      const prompt = `Extraia e organize as informações mais importantes deste documento. Mantenha a formatação clara e organize por tópicos quando apropriado.

Documento: ${fileName}

Conteúdo:
${content}

Resposta organizada:`;

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
        return content; // Retorna conteúdo original se falhar
      }

      const data: OllamaResponse = await response.json();
      return data.response || content;

    } catch (error) {
      console.error('Erro ao processar documento:', error);
      return content; // Retorna conteúdo original se falhar
    }
  }

  // Método para verificar se o Ollama está rodando
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Método para listar modelos disponíveis
  async listModels(): Promise<string[]> {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.models?.map((model: any) => model.name) || [];
    } catch (error) {
      console.error('Erro ao listar modelos:', error);
      return [];
    }
  }
}

export const ollamaService = new OllamaService();
