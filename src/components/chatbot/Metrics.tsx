
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock,
  Download,
  Star,
  ThumbsUp,
  Activity
} from 'lucide-react';

interface MetricsProps {
  chatbot: any;
}

export const Metrics = ({ chatbot }: MetricsProps) => {
  const [period, setPeriod] = useState('7d');

  const metrics = {
    totalConversations: 1247,
    activeUsers: 856,
    averageRating: 4.8,
    responseTime: '2.3s',
    resolutionRate: 92,
    popularKeywords: [
      { word: 'cancelar', count: 156 },
      { word: 'entrega', count: 134 },
      { word: 'pagamento', count: 98 },
      { word: 'produto', count: 87 },
      { word: 'devolução', count: 76 }
    ],
    dailyStats: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      conversations: Math.floor(Math.random() * 50) + 100,
      users: Math.floor(Math.random() * 30) + 70,
      satisfaction: (Math.random() * 0.5 + 4.5).toFixed(1)
    }))
  };

  const exportData = () => {
    // Simular export de dados
    const csvContent = "data:text/csv;charset=utf-8,Date,Conversations,Users,Satisfaction\n" +
      metrics.dailyStats.map(stat => `${stat.date},${stat.conversations},${stat.users},${stat.satisfaction}`).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `metrics-${chatbot.name}-${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Métricas e Analytics</CardTitle>
              <CardDescription>
                Acompanhe o desempenho do seu chatbot
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Últimas 24h</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Interações</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalConversations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              ⭐⭐⭐⭐⭐ Excelente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.responseTime}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-12%</span> vs período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance por Período */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Diária</CardTitle>
          <CardDescription>
            Conversas, usuários e satisfação por dia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.dailyStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium w-16">{stat.date}</span>
                <div className="flex items-center space-x-6 flex-1 ml-4">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">{stat.conversations}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">{stat.users}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{stat.satisfaction}</span>
                  </div>
                </div>
                <div className="flex-1 max-w-32">
                  <Progress value={(stat.conversations / 150) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Taxa de Resolução */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ThumbsUp className="w-5 h-5 mr-2" />
              Taxa de Resolução
            </CardTitle>
            <CardDescription>
              Porcentagem de problemas resolvidos automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-green-600 mb-2">{metrics.resolutionRate}%</div>
              <Progress value={metrics.resolutionRate} className="h-3" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Resolvidos automaticamente:</span>
                <span className="font-medium">{Math.round(metrics.totalConversations * (metrics.resolutionRate / 100))}</span>
              </div>
              <div className="flex justify-between">
                <span>Escalados para humano:</span>
                <span className="font-medium">{Math.round(metrics.totalConversations * ((100 - metrics.resolutionRate) / 100))}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Palavras-chave Populares */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Palavras-chave Mais Usadas
            </CardTitle>
            <CardDescription>
              Termos mais mencionados pelos usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.popularKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <span className="font-medium">{keyword.word}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(keyword.count / metrics.popularKeywords[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{keyword.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Retenção de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Taxa de Retenção</CardTitle>
          <CardDescription>
            Porcentagem de usuários que retornam para conversar novamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">76%</div>
              <p className="text-sm text-muted-foreground">Retorno em 24h</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">54%</div>
              <p className="text-sm text-muted-foreground">Retorno em 7 dias</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">32%</div>
              <p className="text-sm text-muted-foreground">Retorno em 30 dias</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
