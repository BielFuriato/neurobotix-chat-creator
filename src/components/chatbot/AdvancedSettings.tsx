
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Clock, 
  Users, 
  Shield,
  AlertTriangle,
  Plus,
  Trash2
} from 'lucide-react';

interface AdvancedSettingsProps {
  chatbot: any;
}

interface ConditionalRule {
  id: string;
  keyword: string;
  response: string;
  enabled: boolean;
}

export const AdvancedSettings = ({ chatbot }: AdvancedSettingsProps) => {
  const [fallbackHuman, setFallbackHuman] = useState(chatbot.fallbackHuman || false);
  const [scheduleEnabled, setScheduleEnabled] = useState(chatbot.schedule?.enabled || false);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('18:00');
  const [workingDays, setWorkingDays] = useState('weekdays');
  const [maxConversations, setMaxConversations] = useState('1000');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [conditionalRules, setConditionalRules] = useState<ConditionalRule[]>([
    {
      id: '1',
      keyword: 'cancelar',
      response: 'Para cancelar seu pedido, acesse sua conta ou fale com nosso suporte.',
      enabled: true
    },
    {
      id: '2',
      keyword: 'entrega',
      response: 'Sobre entrega: nosso prazo padrão é de 5-7 dias úteis.',
      enabled: true
    }
  ]);

  const [newRule, setNewRule] = useState({ keyword: '', response: '' });

  const planLimits = {
    free: { conversations: 100, rules: 3, integrations: 1 },
    pro: { conversations: 10000, rules: 50, integrations: 'unlimited' },
    enterprise: { conversations: 'unlimited', rules: 'unlimited', integrations: 'unlimited' }
  };

  const currentLimits = planLimits[chatbot.plan as keyof typeof planLimits] || planLimits.free;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
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
    } finally {
      setIsLoading(false);
    }
  };

  const addConditionalRule = () => {
    if (!newRule.keyword || !newRule.response) return;
    
    if (conditionalRules.length >= (currentLimits.rules as number) && currentLimits.rules !== 'unlimited') {
      toast({
        title: "Limite atingido",
        description: `Seu plano permite no máximo ${currentLimits.rules} regras condicionais.`,
        variant: "destructive",
      });
      return;
    }

    const rule: ConditionalRule = {
      id: Date.now().toString(),
      keyword: newRule.keyword,
      response: newRule.response,
      enabled: true
    };

    setConditionalRules([...conditionalRules, rule]);
    setNewRule({ keyword: '', response: '' });
    
    toast({
      title: "Regra adicionada!",
      description: "Nova regra condicional foi criada.",
    });
  };

  const removeRule = (id: string) => {
    setConditionalRules(conditionalRules.filter(rule => rule.id !== id));
    toast({
      title: "Regra removida",
      description: "A regra condicional foi excluída.",
    });
  };

  const toggleRule = (id: string) => {
    setConditionalRules(conditionalRules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  return (
    <div className="space-y-6">
      {/* Limites do Plano */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Limites do Plano {chatbot.plan?.toUpperCase()}
          </CardTitle>
          <CardDescription>
            Configurações baseadas no seu plano atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Conversas/mês</span>
                <Badge variant="outline">
                  {typeof currentLimits.conversations === 'number' 
                    ? `${maxConversations}/${currentLimits.conversations}` 
                    : 'Ilimitado'
                  }
                </Badge>
              </div>
              {typeof currentLimits.conversations === 'number' && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(parseInt(maxConversations) / currentLimits.conversations) * 100}%` }}
                  />
                </div>
              )}
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Regras Condicionais</span>
                <Badge variant="outline">
                  {typeof currentLimits.rules === 'number' 
                    ? `${conditionalRules.length}/${currentLimits.rules}` 
                    : 'Ilimitado'
                  }
                </Badge>
              </div>
              {typeof currentLimits.rules === 'number' && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(conditionalRules.length / currentLimits.rules) * 100}%` }}
                  />
                </div>
              )}
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Integrações</span>
                <Badge variant="outline">
                  {currentLimits.integrations === 'unlimited' ? 'Ilimitado' : `2/${currentLimits.integrations}`}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fallback Humano */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5" />
              <div>
                <CardTitle>Fallback para Atendimento Humano</CardTitle>
                <CardDescription>
                  Transferir para humano quando o bot não conseguir ajudar
                </CardDescription>
              </div>
            </div>
            <Switch checked={fallbackHuman} onCheckedChange={setFallbackHuman} />
          </div>
        </CardHeader>
        {fallbackHuman && (
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Quando ativado, o chatbot oferecerá a opção de falar com um atendente humano 
                caso não consiga resolver a questão do usuário.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Mensagem de Transferência</Label>
              <Textarea
                placeholder="Não consegui resolver sua questão. Gostaria de falar com um atendente humano?"
                rows={2}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Horário de Atendimento */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5" />
              <div>
                <CardTitle>Horário de Atendimento</CardTitle>
                <CardDescription>
                  Configure quando o chatbot estará ativo
                </CardDescription>
              </div>
            </div>
            <Switch checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} />
          </div>
        </CardHeader>
        {scheduleEnabled && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Horário de Início</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Horário de Fim</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Dias de Funcionamento</Label>
                <Select value={workingDays} onValueChange={setWorkingDays}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekdays">Segunda à Sexta</SelectItem>
                    <SelectItem value="weekend">Fins de Semana</SelectItem>
                    <SelectItem value="all">Todos os Dias</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mensagem Fora do Horário</Label>
              <Textarea
                placeholder="Nosso atendimento funciona de segunda à sexta, das 8h às 18h. Deixe sua mensagem que retornaremos em breve!"
                rows={2}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Regras Condicionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Regras Condicionais
          </CardTitle>
          <CardDescription>
            Configure respostas automáticas para palavras-chave específicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lista de Regras Existentes */}
          <div className="space-y-3">
            {conditionalRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <Switch 
                    checked={rule.enabled} 
                    onCheckedChange={() => toggleRule(rule.id)}
                    size="sm"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Se palavra-chave: <Badge variant="outline">{rule.keyword}</Badge>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Resposta: {rule.response.substring(0, 50)}...
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRule(rule.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Adicionar Nova Regra */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Adicionar Nova Regra</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Palavra-chave</Label>
                <Input
                  placeholder="Ex: cancelar, entrega, preço"
                  value={newRule.keyword}
                  onChange={(e) => setNewRule({...newRule, keyword: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Resposta Automática</Label>
                <Textarea
                  placeholder="Digite a resposta que o bot deve dar quando esta palavra-chave for mencionada..."
                  value={newRule.response}
                  onChange={(e) => setNewRule({...newRule, response: e.target.value})}
                  rows={3}
                />
              </div>
              <Button onClick={addConditionalRule} disabled={!newRule.keyword || !newRule.response}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Regra
              </Button>
            </div>
          </div>

          {typeof currentLimits.rules === 'number' && conditionalRules.length >= currentLimits.rules && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">Limite de regras atingido</p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Faça upgrade do seu plano para adicionar mais regras condicionais.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
};
