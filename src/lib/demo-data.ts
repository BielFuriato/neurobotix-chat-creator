
import { database } from './database';

export const createDemoUser = async () => {
  try {
    // Verificar se o usuário demo já existe
    const existingUser = await database.getUserByEmail('demo@neurobotix.com');
    if (existingUser) {
      console.log('Usuário demo já existe');
      return existingUser.id!;
    }

    // Criar usuário demo
    const demoUserId = await database.createUser({
      email: 'demo@neurobotix.com',
      password: 'demo123',
      name: 'Usuário Demo',
      company: 'NeuroBotix Demo',
      createdAt: new Date().toISOString()
    });

    console.log('Usuário demo criado com ID:', demoUserId);

    // Criar chatbots de exemplo para o usuário demo
    const demoChatbots = [
      {
        userId: demoUserId,
        name: 'Suporte Técnico',
        description: 'Chatbot para atendimento ao suporte técnico da empresa',
        sector: 'Suporte',
        status: 'active' as const,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias atrás
      },
      {
        userId: demoUserId,
        name: 'Vendas Online',
        description: 'Assistente virtual para auxiliar no processo de vendas',
        sector: 'Vendas',
        status: 'training' as const,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 dias atrás
      },
      {
        userId: demoUserId,
        name: 'Onboarding',
        description: 'Bot para integração de novos funcionários',
        sector: 'RH',
        status: 'active' as const,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias atrás
      }
    ];

    for (const chatbot of demoChatbots) {
      const chatbotId = await database.createChatbot(chatbot);
      console.log(`Chatbot demo "${chatbot.name}" criado com ID:`, chatbotId);

      // Adicionar algumas interações demo
      const interactions = [
        {
          chatbotId,
          userInput: 'Olá, preciso de ajuda',
          botResponse: 'Olá! Como posso ajudá-lo hoje?',
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          chatbotId,
          userInput: 'Como funciona o produto?',
          botResponse: 'Ficarei feliz em explicar como nosso produto funciona...',
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      for (const interaction of interactions) {
        await database.addInteraction(interaction);
      }
    }

    return demoUserId;
  } catch (error) {
    console.error('Erro ao criar dados demo:', error);
    return null;
  }
};
