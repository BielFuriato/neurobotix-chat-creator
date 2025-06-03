
// Configuração da API do OpenAI GPT
// IMPORTANTE: Substitua YOUR_API_KEY pela sua chave real da OpenAI
const OPENAI_API_KEY = 'YOUR_API_KEY'; // Coloque sua chave aqui
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface GPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GPTResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class GPTService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || OPENAI_API_KEY;
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

      const messages: GPTMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ];

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // Ou gpt-4 se você tiver acesso
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data: GPTResponse = await response.json();
      return data.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';

    } catch (error) {
      console.error('Erro ao chamar GPT:', error);
      return 'Desculpe, estou temporariamente indisponível. Tente novamente em alguns instantes.';
    }
  }

  // Método para processar e extrair texto de documentos
  async processDocument(content: string, fileName: string): Promise<string> {
    try {
      const messages: GPTMessage[] = [
        { 
          role: 'system', 
          content: 'Extraia e organize as informações mais importantes deste documento. Mantenha a formatação clara e organize por tópicos quando apropriado.' 
        },
        { 
          role: 'user', 
          content: `Documento: ${fileName}\n\nConteúdo:\n${content}` 
        }
      ];

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 1000,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        return content; // Retorna conteúdo original se falhar
      }

      const data: GPTResponse = await response.json();
      return data.choices[0]?.message?.content || content;

    } catch (error) {
      console.error('Erro ao processar documento:', error);
      return content; // Retorna conteúdo original se falhar
    }
  }
}

export const gptService = new GPTService();
