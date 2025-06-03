
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, Bot } from 'lucide-react';

interface ChatbotData {
  id: string;
  name: string;
  description: string;
  sector: string;
  avatar?: string | null;
  attendantName: string;
}

interface GeneralInfoProps {
  chatbot: ChatbotData;
}

export const GeneralInfo = ({ chatbot }: GeneralInfoProps) => {
  const [name, setName] = useState(chatbot.name);
  const [description, setDescription] = useState(chatbot.description);
  const [sector, setSector] = useState(chatbot.sector);
  const [attendantName, setAttendantName] = useState(chatbot.attendantName);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Configurações salvas!",
        description: "As informações do chatbot foram atualizadas.",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Gerais</CardTitle>
        <CardDescription>
          Configure as informações básicas do seu chatbot
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Chatbot</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do seu chatbot"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendant">Nome do Atendente</Label>
            <Input
              id="attendant"
              value={attendantName}
              onChange={(e) => setAttendantName(e.target.value)}
              placeholder="Nome que aparecerá nas conversas"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o propósito do seu chatbot"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sector">Setor</Label>
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Suporte">Suporte Técnico</SelectItem>
              <SelectItem value="Vendas">Vendas</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="RH">Recursos Humanos</SelectItem>
              <SelectItem value="Atendimento">Atendimento ao Cliente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Avatar do Chatbot</Label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Carregar Avatar
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Recomendamos uma imagem de 64x64 pixels
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
