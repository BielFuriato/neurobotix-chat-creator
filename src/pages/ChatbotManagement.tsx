
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { ArrowLeft, Bot } from 'lucide-react';
import { GeneralInfo } from '@/components/chatbot/GeneralInfo';
import { Training } from '@/components/chatbot/Training';
import { Customization } from '@/components/chatbot/Customization';
import { Integrations } from '@/components/chatbot/Integrations';
import { Metrics } from '@/components/chatbot/Metrics';
import { AdvancedSettings } from '@/components/chatbot/AdvancedSettings';
import { TestBot } from '@/components/chatbot/TestBot';

const ChatbotManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');

  // Dados simulados do chatbot
  const chatbot = {
    id: id || '1',
    name: 'Suporte Técnico',
    description: 'Chatbot para atendimento de suporte técnico',
    sector: 'Suporte',
    status: 'ativo',
    avatar: null,
    attendantName: 'Ana',
    colors: {
      primary: '#8B5CF6',
      secondary: '#3B82F6'
    },
    font: 'Inter',
    style: 'moderno',
    integrations: {
      whatsapp: false,
      messenger: false,
      website: true
    },
    schedule: {
      enabled: true,
      hours: '08:00 - 18:00',
      days: 'Segunda à Sexta'
    },
    fallbackHuman: true,
    plan: 'pro'
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{chatbot.name}</h1>
                <p className="text-muted-foreground">Gerencie e configure seu chatbot</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <TestBot chatbot={chatbot} />
            <Button variant="outline">
              Publicar
            </Button>
          </div>
        </div>

        {/* Tabs de Configuração */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="training">Treinamento</TabsTrigger>
            <TabsTrigger value="customization">Personalização</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="test">Teste</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralInfo chatbot={chatbot} />
          </TabsContent>

          <TabsContent value="training">
            <Training chatbot={chatbot} />
          </TabsContent>

          <TabsContent value="customization">
            <Customization chatbot={chatbot} />
          </TabsContent>

          <TabsContent value="integrations">
            <Integrations chatbot={chatbot} />
          </TabsContent>

          <TabsContent value="metrics">
            <Metrics chatbot={chatbot} />
          </TabsContent>

          <TabsContent value="settings">
            <AdvancedSettings chatbot={chatbot} />
          </TabsContent>

          <TabsContent value="test">
            <TestBot chatbot={chatbot} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChatbotManagement;
