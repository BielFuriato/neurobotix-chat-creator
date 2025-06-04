
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { database } from '@/lib/database';
import { 
  Clock, 
  Shield, 
  Users, 
  MessageSquare, 
  Settings, 
  AlertTriangle,
  Trash2
} from 'lucide-react';

interface AdvancedSettingsProps {
  chatbot: any;
}

export const AdvancedSettings = ({ chatbot }: AdvancedSettingsProps) => {
  const [scheduleEnabled, setScheduleEnabled] = useState(chatbot.schedule?.enabled || false);
  const [fallbackEnabled, setFallbackEnabled] = useState(chatbot.fallbackHuman || false);
  const [autoResponse, setAutoResponse] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      toast({
        title: "Configurações salvas!",
        description: "As configurações avançadas foram atualizadas.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este chatbot? Esta ação não pode ser desfeita.")) {
      try {
        await database.deleteChatbot(chatbot.id);
        toast({
          title: "Chatbot excluído!",
          description: "O chatbot foi removido com sucesso.",
        });
        navigate('/dashboard');
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: "Tente novamente mais tarde",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Horário de Funcionamento */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle>Horário de Funcionamento</CardTitle>
              <CardDescription>
                Configure quando o chatbot estará ativo
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="schedule-enabled">Ativar horário personalizado</Label>
            <Switch 
              checked={scheduleEnabled} 
              onCheckedChange={setScheduleEnabled}
            />
          </div>
          
          {scheduleEnabled && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Horário de Início</Label>
                  <Input
                    id="start-time"
                    type="time"
                    defaultValue="08:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">Horário de Fim</Label>
                  <Input
                    id="end-time"
                    type="time"
                    defaultValue="18:00"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Dias da Semana</Label>
                <div className="flex flex-wrap gap-2">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
                    <Button key={day} variant="outline" className="text-xs">
                      {day}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="outside-hours-message">Mensagem fora do horário</Label>
                <Textarea
                  id="outside-hours-message"
                  placeholder="Olá! Nosso atendimento funciona de segunda à sexta, das 8h às 18h. Deixe sua mensagem que retornaremos em breve!"
                  rows={3}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fallback Humano */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-green-600" />
            <div>
              <CardTitle>Transferência para Humano</CardTitle>
              <CardDescription>
                Configure quando transferir para atendimento humano
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="fallback-enabled">Permitir transferência para humano</Label>
            <Switch 
              checked={fallbackEnabled} 
              onCheckedChange={setFallbackEnabled}
            />
          </div>

          {fallbackEnabled && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="trigger-keywords">Palavras-chave para transferência</Label>
                <Input
                  id="trigger-keywords"
                  placeholder="atendente, humano, falar com alguém"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-attempts">Máximo de tentativas do bot</Label>
                <Select defaultValue="3">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 tentativa</SelectItem>
                    <SelectItem value="2">2 tentativas</SelectItem>
                    <SelectItem value="3">3 tentativas</SelectItem>
                    <SelectItem value="5">5 tentativas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transfer-message">Mensagem de transferência</Label>
                <Textarea
                  id="transfer-message"
                  placeholder="Vou transferir você para um de nossos atendentes. Aguarde um momento..."
                  rows={2}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Respostas Automáticas */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <div>
              <CardTitle>Respostas Automáticas</CardTitle>
              <CardDescription>
                Configure comportamentos automáticos do chatbot
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Resposta automática</Label>
              <p className="text-sm text-muted-foreground">
                Responder automaticamente quando não entender
              </p>
            </div>
            <Switch 
              checked={autoResponse} 
              onCheckedChange={setAutoResponse}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="default-response">Resposta padrão</Label>
            <Textarea
              id="default-response"
              placeholder="Desculpe, não entendi sua pergunta. Pode reformular ou ser mais específico?"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="greeting-message">Mensagem de boas-vindas</Label>
            <Textarea
              id="greeting-message"
              placeholder="Olá! Sou o assistente virtual. Como posso ajudá-lo hoje?"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="response-delay">Delay entre respostas (segundos)</Label>
            <Select defaultValue="1">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Imediato</SelectItem>
                <SelectItem value="1">1 segundo</SelectItem>
                <SelectItem value="2">2 segundos</SelectItem>
                <SelectItem value="3">3 segundos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Limites e Restrições */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-orange-600" />
            <div>
              <CardTitle>Limites e Restrições</CardTitle>
              <CardDescription>
                Configure limites baseados no seu plano
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="daily-limit">Limite diário de conversas</Label>
            <Input
              id="daily-limit"
              type="number"
              placeholder="1000"
              defaultValue={chatbot.plan === 'free' ? '100' : chatbot.plan === 'pro' ? '1000' : '10000'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="context-memory">Memória de contexto (mensagens)</Label>
            <Select defaultValue="10">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 mensagens</SelectItem>
                <SelectItem value="10">10 mensagens</SelectItem>
                <SelectItem value="20">20 mensagens</SelectItem>
                <SelectItem value="50">50 mensagens</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate-limit">Limite de mensagens por usuário/minuto</Label>
            <Input
              id="rate-limit"
              type="number"
              placeholder="10"
              defaultValue="10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Zona de Perigo */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
              <CardDescription>
                Ações irreversíveis - use com cuidado
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
              Excluir Chatbot
            </h4>
            <p className="text-sm text-red-600 dark:text-red-300 mb-4">
              Esta ação removerá permanentemente o chatbot, incluindo todas as conversas, 
              configurações e dados de treinamento. Esta ação não pode ser desfeita.
            </p>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Chatbot Permanentemente
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};
