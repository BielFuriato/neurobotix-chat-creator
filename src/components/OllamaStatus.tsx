
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { ollamaService } from '@/lib/ollama-service';

export const OllamaStatus = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const health = await ollamaService.checkHealth();
      setIsRunning(health);
      
      if (health) {
        const availableModels = await ollamaService.listModels();
        setModels(availableModels);
      } else {
        setModels([]);
      }
    } catch (error) {
      setIsRunning(false);
      setModels([]);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <Card className={`border ${isRunning ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {isRunning ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-medium">
              Status do Ollama: 
              <Badge variant={isRunning ? "default" : "destructive"} className="ml-2">
                {isRunning ? "Conectado" : "Desconectado"}
              </Badge>
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkStatus}
            disabled={isChecking}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Verificar
          </Button>
        </div>

        {!isRunning && (
          <div className="text-sm text-red-700 mb-2">
            Para usar o Ollama, execute no terminal: <code className="bg-red-100 px-2 py-1 rounded">ollama serve</code>
          </div>
        )}

        {models.length > 0 && (
          <div className="text-sm text-green-700">
            <span className="font-medium">Modelos disponíveis:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {models.map((model) => (
                <Badge key={model} variant="outline" className="text-xs">
                  {model}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {isRunning && models.length === 0 && (
          <div className="text-sm text-amber-700">
            Nenhum modelo encontrado. Execute: <code className="bg-amber-100 px-2 py-1 rounded">ollama pull llama3.2:3b</code>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
