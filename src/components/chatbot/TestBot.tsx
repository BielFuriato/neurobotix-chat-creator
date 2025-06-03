
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bot, Send, User, Play, RotateCcw } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface TestBotProps {
  chatbot: any;
}

export const TestBot = ({ chatbot }: TestBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Olá! Eu sou ${chatbot.attendantName || 'Ana'}, assistente virtual da ${chatbot.sector}. Como posso ajudar você hoje?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const predefinedResponses = {
    'oi': 'Olá! Como posso ajudar você?',
    'olá': 'Oi! Em que posso ser útil hoje?',
    'ajuda': 'Claro! Posso ajudar com informações sobre produtos, pedidos, entrega e muito mais. O que você gostaria de saber?',
    'cancelar': 'Para cancelar seu pedido, acesse sua conta na seção "Meus Pedidos" ou me informe o número do pedido.',
    'entrega': 'Nosso prazo de entrega padrão é de 5-7 dias úteis. Gostaria de rastrear algum pedido específico?',
    'preço': 'Posso ajudar com informações sobre preços. Sobre qual produto você gostaria de saber?',
    'pagamento': 'Aceitamos cartão de crédito, débito, PIX e boleto bancário. Precisa de ajuda com algum pagamento?',
    'default': 'Entendi sua pergunta. Deixe-me ajudar você com isso. Se precisar de atendimento especializado, posso conectar você com nossa equipe.'
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (message.includes(key) && key !== 'default') {
        return response;
      }
    }
    
    return predefinedResponses.default;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular delay de digitação do bot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const resetChat = () => {
    setMessages([
      {
        id: '1',
        text: `Olá! Eu sou ${chatbot.attendantName || 'Ana'}, assistente virtual da ${chatbot.sector}. Como posso ajudar você hoje?`,
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setInputMessage('');
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Botão de Teste Rápido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="w-5 h-5 mr-2" />
            Teste do Chatbot
          </CardTitle>
          <CardDescription>
            Teste seu chatbot antes de publicar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Iniciar Teste
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md h-[600px] flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Testando: {chatbot.name}</span>
                  <Button variant="outline" size="sm" onClick={resetChat}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </DialogTitle>
                <DialogDescription>
                  Converse com seu chatbot para testar as respostas
                </DialogDescription>
              </DialogHeader>
              
              {/* Interface do Chat */}
              <div className="flex flex-col flex-1">
                {/* Header do Chat */}
                <div 
                  className="p-3 text-white rounded-t-lg"
                  style={{ backgroundColor: chatbot.colors?.primary || '#8B5CF6' }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{chatbot.attendantName || 'Ana'}</p>
                      <p className="text-xs opacity-90">Online</p>
                    </div>
                  </div>
                </div>

                {/* Mensagens */}
                <ScrollArea className="flex-1 p-3 border-l border-r bg-gray-50 dark:bg-gray-900">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg text-sm ${
                            message.sender === 'user'
                              ? 'text-white'
                              : 'bg-white dark:bg-gray-800 border'
                          }`}
                          style={{
                            backgroundColor: message.sender === 'user' 
                              ? chatbot.colors?.secondary || '#3B82F6'
                              : undefined
                          }}
                        >
                          <p>{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' 
                              ? 'text-white/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {message.timestamp.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-800 border p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-3 border-l border-r border-b rounded-b-lg bg-white dark:bg-gray-900">
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua mensagem..."
                      className="flex-1"
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      style={{ backgroundColor: chatbot.colors?.primary || '#8B5CF6' }}
                      className="text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Logs de Teste */}
      <Card>
        <CardHeader>
          <CardTitle>Logs de Conversas</CardTitle>
          <CardDescription>
            Histórico das últimas conversas de teste
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Sessão de Teste #{i + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.floor(Math.random() * 10) + 3} mensagens • {Math.floor(Math.random() * 60) + 1}min atrás
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-green-600">
                    ✓ Concluída
                  </Badge>
                  <Button variant="ghost" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sugestões de Teste */}
      <Card>
        <CardHeader>
          <CardTitle>Sugestões de Teste</CardTitle>
          <CardDescription>
            Experimente estas perguntas para testar seu chatbot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Como posso cancelar meu pedido?',
              'Qual o prazo de entrega?',
              'Quais formas de pagamento vocês aceitam?',
              'Preciso de ajuda com um produto',
              'Quero falar com um atendente',
              'Horário de atendimento'
            ].map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto p-3"
                onClick={() => setInputMessage(suggestion)}
              >
                "{suggestion}"
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
