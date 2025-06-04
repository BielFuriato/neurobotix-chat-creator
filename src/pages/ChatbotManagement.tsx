import { useState, useEffect } from 'react';
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
import { database } from '@/lib/database';

const ChatbotManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [chatbot, setChatbot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatbot = async () => {
      setLoading(true);
      await database.init();
      const dbChatbot = await database.getChatbotById(Number(id));
      // Buscar attendantName nas configurações
      const settings = await database.getSettings(Number(id));
      setChatbot({
        ...dbChatbot,
        attendantName: settings?.attendantName || "",
      });
      setLoading(false);
    };
    fetchChatbot();
  }, [id]);

  if (loading || !chatbot) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{chatbot.name}</h1>
                <p className="text-muted-foreground text-sm sm:text-base">Gerencie e configure seu chatbot</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TestBot chatbot={chatbot} />
              <Button variant="outline">
                Publicar
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs de Configuração */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="w-full overflow-x-auto">
            <TabsList className="grid w-full grid-cols-7 min-w-[700px]">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="training">Treinamento</TabsTrigger>
              <TabsTrigger value="customization">Personalização</TabsTrigger>
              <TabsTrigger value="integrations">Integrações</TabsTrigger>
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
              <TabsTrigger value="test">Teste</TabsTrigger>
            </TabsList>
          </div>

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