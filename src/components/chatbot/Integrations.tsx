
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Bot, 
  Code, 
  Link, 
  Copy,
  Check,
  ExternalLink,
  Calendar
} from 'lucide-react';

interface IntegrationsProps {
  chatbot: any;
}

export const Integrations = ({ chatbot }: IntegrationsProps) => {
  const [whatsappEnabled, setWhatsappEnabled] = useState(chatbot.integrations?.whatsapp || false);
  const [messengerEnabled, setMessengerEnabled] = useState(chatbot.integrations?.messenger || false);
  const [websiteEnabled, setWebsiteEnabled] = useState(chatbot.integrations?.website || true);
  const [googleCalendarEnabled, setGoogleCalendarEnabled] = useState(chatbot.integrations?.googleCalendar || false);
  const [apiKey] = useState('nb_ak_' + Math.random().toString(36).substr(2, 20));
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const embedCode = `<!-- Widget NeuroBotix -->
<script>
  window.neuroBotixConfig = {
    botId: '${chatbot.id}',
    apiKey: '${apiKey}',
    theme: 'auto',
    position: 'bottom-right'
  };
</script>
<script src="https://cdn.neurobotix.com/widget.js" defer></script>`;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast({
        title: "Copiado!",
        description: "Código copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      toast({
        title: "Integrações atualizadas!",
        description: "As configurações de integração foram salvas.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Google Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Google Calendar</CardTitle>
                <CardDescription>
                  Permita agendamentos automáticos via chatbot
                </CardDescription>
              </div>
            </div>
            <Switch checked={googleCalendarEnabled} onCheckedChange={setGoogleCalendarEnabled} />
          </div>
        </CardHeader>
        {googleCalendarEnabled && (
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Para conectar ao Google Calendar, você precisa:
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Conta Google ativa</li>
                <li>Autorização para acessar o Google Calendar</li>
                <li>Configurar disponibilidade de horários</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Label htmlFor="calendar-id">ID do Calendário</Label>
              <Input
                id="calendar-id"
                placeholder="exemplo@gmail.com ou calendar-id"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-duration">Duração Padrão (minutos)</Label>
              <Input
                id="default-duration"
                type="number"
                placeholder="30"
                defaultValue="30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buffer-time">Tempo de Buffer (minutos)</Label>
              <Input
                id="buffer-time"
                type="number"
                placeholder="15"
                defaultValue="15"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Conectar com Google
              </Button>
              <Button variant="outline" size="sm">
                Configurar Horários
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* WhatsApp */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>WhatsApp Business</CardTitle>
                <CardDescription>
                  Conecte seu chatbot ao WhatsApp Business
                </CardDescription>
              </div>
            </div>
            <Switch checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} />
          </div>
        </CardHeader>
        {whatsappEnabled && (
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Para conectar ao WhatsApp, você precisa:
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Conta WhatsApp Business verificada</li>
                <li>Token de acesso da API do WhatsApp</li>
                <li>Webhook configurado</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp-token">Token de Acesso</Label>
              <Input
                id="whatsapp-token"
                type="password"
                placeholder="Insira seu token do WhatsApp Business"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp-number">Número do WhatsApp</Label>
              <Input
                id="whatsapp-number"
                placeholder="+55 11 99999-9999"
              />
            </div>
            <Badge variant="outline" className="text-yellow-600">
              Em Desenvolvimento
            </Badge>
          </CardContent>
        )}
      </Card>

      {/* Messenger */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Facebook Messenger</CardTitle>
                <CardDescription>
                  Integre com o Messenger do Facebook
                </CardDescription>
              </div>
            </div>
            <Switch checked={messengerEnabled} onCheckedChange={setMessengerEnabled} />
          </div>
        </CardHeader>
        {messengerEnabled && (
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Para conectar ao Messenger, você precisa:
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Página no Facebook</li>
                <li>App configurado no Facebook Developers</li>
                <li>Token de acesso da página</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Label htmlFor="messenger-token">Token da Página</Label>
              <Input
                id="messenger-token"
                type="password"
                placeholder="Insira o token da sua página do Facebook"
              />
            </div>
            <Badge variant="outline" className="text-yellow-600">
              Em Desenvolvimento
            </Badge>
          </CardContent>
        )}
      </Card>

      {/* Widget para Site */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Widget para Site</CardTitle>
                <CardDescription>
                  Adicione o chatbot ao seu website
                </CardDescription>
              </div>
            </div>
            <Switch checked={websiteEnabled} onCheckedChange={setWebsiteEnabled} />
          </div>
        </CardHeader>
        {websiteEnabled && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Código de Incorporação</Label>
              <div className="relative">
                <Textarea
                  value={embedCode}
                  readOnly
                  rows={8}
                  className="font-mono text-sm bg-muted/50"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(embedCode, 'embed')}
                >
                  {copied === 'embed' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h4 className="font-medium mb-2">Como instalar:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>Copie o código acima</li>
                <li>Cole antes da tag &lt;/body&gt; do seu site</li>
                <li>O widget aparecerá automaticamente</li>
              </ol>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Testar Widget
              </Button>
              <Button variant="outline" size="sm">
                Personalizar Posição
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* API */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
              <Link className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>API de Integração</CardTitle>
              <CardDescription>
                Use nossa API para integrações personalizadas
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="flex space-x-2">
              <Input
                value={apiKey}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                onClick={() => copyToClipboard(apiKey, 'apikey')}
              >
                {copied === 'apikey' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Endpoint Base</Label>
            <div className="flex space-x-2">
              <Input
                value="https://api.neurobotix.com/v1"
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                onClick={() => copyToClipboard('https://api.neurobotix.com/v1', 'endpoint')}
              >
                {copied === 'endpoint' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Documentação da API
            </Button>
            <Button variant="outline" size="sm">
              Gerar Nova API Key
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Salvar Integrações
        </Button>
      </div>
    </div>
  );
};
