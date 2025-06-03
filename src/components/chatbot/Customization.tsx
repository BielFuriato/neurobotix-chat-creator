
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Palette, Type, MessageSquare } from 'lucide-react';

interface CustomizationProps {
  chatbot: any;
}

export const Customization = ({ chatbot }: CustomizationProps) => {
  const [primaryColor, setPrimaryColor] = useState(chatbot.colors?.primary || '#8B5CF6');
  const [secondaryColor, setSecondaryColor] = useState(chatbot.colors?.secondary || '#3B82F6');
  const [font, setFont] = useState(chatbot.font || 'Inter');
  const [style, setStyle] = useState(chatbot.style || 'moderno');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Personalização salva!",
        description: "As configurações visuais foram atualizadas.",
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

  const presetColors = [
    { name: 'Roxo/Azul', primary: '#8B5CF6', secondary: '#3B82F6' },
    { name: 'Verde/Azul', primary: '#10B981', secondary: '#06B6D4' },
    { name: 'Rosa/Laranja', primary: '#EC4899', secondary: '#F59E0B' },
    { name: 'Vermelho/Rosa', primary: '#EF4444', secondary: '#EC4899' },
    { name: 'Índigo/Cyan', primary: '#6366F1', secondary: '#06B6D4' },
  ];

  return (
    <div className="space-y-6">
      {/* Cores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Cores do Chat
          </CardTitle>
          <CardDescription>
            Personalize as cores que aparecerão na interface do chat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cor Primária</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#8B5CF6"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cor Secundária</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Paletas Predefinidas</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {presetColors.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setPrimaryColor(preset.primary);
                    setSecondaryColor(preset.secondary);
                  }}
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex space-x-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{preset.name}</p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipografia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Type className="w-5 h-5 mr-2" />
            Tipografia
          </CardTitle>
          <CardDescription>
            Escolha a fonte que será usada no chat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Fonte</Label>
            <Select value={font} onValueChange={setFont}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter (Recomendada)</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Open Sans">Open Sans</SelectItem>
                <SelectItem value="Lato">Lato</SelectItem>
                <SelectItem value="Poppins">Poppins</SelectItem>
                <SelectItem value="Montserrat">Montserrat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estilo do Balão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Estilo das Mensagens
          </CardTitle>
          <CardDescription>
            Escolha o estilo dos balões de mensagem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Estilo do Balão</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="moderno">Moderno (Bordas arredondadas)</SelectItem>
                <SelectItem value="classico">Clássico (Balões tradicionais)</SelectItem>
                <SelectItem value="minimalista">Minimalista (Sem bordas)</SelectItem>
                <SelectItem value="corporativo">Corporativo (Formal)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview do Chat</CardTitle>
          <CardDescription>
            Veja como ficará a aparência do seu chat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg">
              {/* Header do Chat */}
              <div 
                className="p-4 rounded-t-lg text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">Ana</p>
                    <p className="text-xs opacity-90">Online</p>
                  </div>
                </div>
              </div>

              {/* Mensagens */}
              <div className="p-4 space-y-3" style={{ fontFamily: font }}>
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg max-w-xs">
                    <p className="text-sm">Olá! Como posso ajudar você hoje?</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div 
                    className="text-white p-3 rounded-lg max-w-xs"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    <p className="text-sm">Preciso de ajuda com meu pedido</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg max-w-xs">
                    <p className="text-sm">Claro! Qual é o número do seu pedido?</p>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Digite sua mensagem..."
                    className="flex-1 p-2 border rounded-lg text-sm"
                    disabled
                  />
                  <button 
                    className="p-2 rounded-lg text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    ↵
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Personalização"}
        </Button>
      </div>
    </div>
  );
};
