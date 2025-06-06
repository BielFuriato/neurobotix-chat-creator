import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Bot, User, Send, MessageSquare } from 'lucide-react';
import { chatService } from '@/lib/chat-service';

interface Message {
  id: string;
  content: string;
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
      content: `Olá! Sou ${chatbot.name}. Como posso ajudá-lo hoje?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll automático para o final
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await chatService.sendMessage(
        parseInt(chatbot.id),
        inputMessage,
        chatbot.name
      );

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro. Verifique se a API do OpenAI está configurada corretamente.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquare className="w-4 h-4 mr-2" />
          Testar Bot
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bot className="w-5 h-5 mr-2" />
            Teste do {chatbot.name}
          </DialogTitle>
        </DialogHeader>

        {/* Conteúdo de mensagens com scroll */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="flex flex-col space-y-4 px-4 py-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <Card className={`max-w-[75%] break-words p-3 ${
                    message.sender === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' 
                        ? 'text-purple-200' 
                        : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </Card>
                  
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <Card className="p-3 bg-muted">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Âncora para scroll automático */}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input de mensagem */}
        <div className="flex space-x-2 pt-4 border-t px-4">
          <Input
            placeholder="Digite sua mensagem..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
