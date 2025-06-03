
import { useState } from 'react';
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

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [chatbots] = useState([
    {
      id: 1,
      name: 'Suporte Técnico',
      status: 'ativo',
      conversations: 1247,
      satisfaction: 4.8,
      sector: 'Suporte',
      lastActive: '2 min atrás'
    },
    {
      id: 2,
      name: 'Vendas Online',
      status: 'treinamento',
      conversations: 856,
      satisfaction: 4.6,
      sector: 'Vendas',
      lastActive: '1 hora atrás'
    },
    {
      id: 3,
      name: 'Onboarding',
      status: 'integrado',
      conversations: 324,
      satisfaction: 4.9,
      sector: 'RH',
      lastActive: '5 min atrás'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500';
      case 'treinamento': return 'bg-yellow-500';
      case 'integrado': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'treinamento': return 'Em Treinamento';
      case 'integrado': return 'Integrado';
      default: return 'Inativo';
    }
  };

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
            onClick={() => navigate('/chatbot/create')}
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
                +2 desde o mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversas Totais</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,427</div>
              <p className="text-xs text-muted-foreground">
                +15% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,849</div>
              <p className="text-xs text-muted-foreground">
                +8% desde a semana passada
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfação Média</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">
                ⭐ Excelente performance
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
                          <span>{bot.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{bot.conversations} conversas</div>
                        <div className="text-sm text-muted-foreground">⭐ {bot.satisfaction}</div>
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
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/chatbot/create')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Novo Chatbot
              </Button>
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
              <div className="space-y-4">
                {Array.from({ length: 7 }, (_, i) => {
                  const day = new Date();
                  day.setDate(day.getDate() - (6 - i));
                  const conversations = Math.floor(Math.random() * 200) + 100;
                  const satisfaction = (Math.random() * 0.5 + 4.5).toFixed(1);
                  
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {day.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                      </span>
                      <div className="flex items-center space-x-4 flex-1 ml-4">
                        <div className="flex-1">
                          <Progress value={(conversations / 300) * 100} className="h-2" />
                        </div>
                        <span className="text-sm font-medium w-12">{conversations}</span>
                        <span className="text-sm text-muted-foreground w-8">⭐{satisfaction}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
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
                  <span>2,427/10,000</span>
                </div>
                <Progress value={24.27} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Integrações</span>
                  <span>2/Ilimitadas</span>
                </div>
                <Progress value={100} />
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
