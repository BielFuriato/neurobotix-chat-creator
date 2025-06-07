import { trainingService } from './src/lib/training-service';

(async () => {
  const chatbotId = 22; // Substitua pelo ID do seu chatbot
  const knowledge = await trainingService.getChatbotKnowledge(chatbotId);
  console.log('Conhecimento treinado:', knowledge);
})();