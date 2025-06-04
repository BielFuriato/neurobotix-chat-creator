
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/Header';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Plus, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Activity,
  Settings,
  Play,
  Pause
} from 'lucide-react';
import { database, Chatbot } from '@/lib/database';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChatbots = async () => {
      if (user?.id) {
        try {
          const userChatbots = await database.getChatbotsByUserId(parseInt(user.id));
          setChatbots(userChatbots);
        } catch (error) {
          console.error('Erro ao carregar chatbots:', error);
        }
      }
      setIsLoading(false);
    };

    loadChatbots();
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'training': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'training': return 'Em Treinamento';
      case 'inactive': return 'Inativo';
      default: return 'Inativo';
    }
  };

  // Calcular métricas baseadas nos chatbots reais
  const totalConversations = chatbots.reduce((sum, bot) => sum + (bot.id || 0) * 100, 0); // Simulado
  const activeUsers = Math.floor(totalConversations * 0.75); // Simulado
  const averageSatisfaction = chatbots.length > 0 ? 4.8 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Carregando...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header do Dashboard */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo de volta, {user?.name}! Aqui está um resumo dos seus chatbots.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/create-chatbot')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Novo Chatbot
          </Button>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Chatbots</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chatbots.length}</div>
              <p className="text-xs text-muted-foreground">
                {chatbots.length === 0 ? 'Crie seu primeiro chatbot' : 'Chatbots ativos'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversas Totais</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConversations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {totalConversations === 0 ? 'Nenhuma conversa ainda' : 'Total de interações'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {activeUsers === 0 ? 'Aguardando primeiros usuários' : 'Usuários únicos'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfação Média</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageSatisfaction}</div>
              <p className="text-xs text-muted-foreground">
                {averageSatisfaction === 0 ? 'Sem avaliações ainda' : '⭐ Excelente performance'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Chatbots */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Seus Chatbots</CardTitle>
              <CardDescription>
                Gerencie e monitore todos os seus chatbots
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chatbots.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum chatbot criado</h3>
                  <p className="text-muted-foreground mb-4">
                    Comece criando seu primeiro chatbot
                  </p>
                  <Button 
                    onClick={() => navigate('/create-chatbot')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Chatbot
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatbots.map((bot) => (
                    <div key={bot.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">{bot.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{bot.sector}</span>
                            <span>•</span>
                            <span>Criado em {new Date(bot.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">0 conversas</div>
                          <div className="text-sm text-muted-foreground">Novo</div>
                        </div>
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(bot.status)}`} />
                          <span>{getStatusText(bot.status)}</span>
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/chatbot/${bot.id}`)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate('/create-chatbot')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Novo Chatbot
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gráfico de Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance dos Últimos 7 Dias</CardTitle>
              <CardDescription>
                Conversas e satisfação por dia
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chatbots.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                  <p>Dados aparecerão após criar chatbots</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from({ length: 7 }, (_, i) => {
                    const day = new Date();
                    day.setDate(day.getDate() - (6 - i));
                    const conversations = Math.floor(Math.random() * 50) + 10;
                    const satisfaction = (Math.random() * 0.5 + 4.5).toFixed(1);
                    
                    return (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {day.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                        </span>
                        <div className="flex items-center space-x-4 flex-1 ml-4">
                          <div className="flex-1">
                            <Progress value={(conversations / 100) * 100} className="h-2" />
                          </div>
                          <span className="text-sm font-medium w-12">{conversations}</span>
                          <span className="text-sm text-muted-foreground w-8">⭐{satisfaction}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Uso do Plano */}
        <Card>
          <CardHeader>
            <CardTitle>Uso do Plano {user?.plan?.toUpperCase()}</CardTitle>
            <CardDescription>
              Acompanhe o uso dos recursos do seu plano atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Chatbots</span>
                  <span>{chatbots.length}/5</span>
                </div>
                <Progress value={(chatbots.length / 5) * 100} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Conversas</span>
                  <span>{totalConversations}/10,000</span>
                </div>
                <Progress value={(totalConversations / 10000) * 100} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Integrações</span>
                  <span>0/Ilimitadas</span>
                </div>
                <Progress value={0} />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-muted-foreground">
                Precisa de mais recursos? Faça upgrade do seu plano.
              </p>
              <Button variant="outline">
                Ver Planos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
