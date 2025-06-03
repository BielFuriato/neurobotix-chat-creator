
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  Link, 
  MessageSquare, 
  Trash2,
  Plus,
  Book
} from 'lucide-react';

interface TrainingData {
  documents: Array<{
    id: string;
    name: string;
    type: 'pdf' | 'doc' | 'url' | 'faq';
    status: 'processed' | 'processing' | 'failed';
    addedAt: string;
  }>;
}

interface TrainingProps {
  chatbot: any;
}

export const Training = ({ chatbot }: TrainingProps) => {
  const [customKnowledge, setCustomKnowledge] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [documents, setDocuments] = useState<TrainingData['documents']>([
    {
      id: '1',
      name: 'Manual de Produtos.pdf',
      type: 'pdf',
      status: 'processed',
      addedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'FAQ Suporte.docx',
      type: 'doc',
      status: 'processed',
      addedAt: '2024-01-14'
    },
    {
      id: '3',
      name: 'https://site.com/ajuda',
      type: 'url',
      status: 'processing',
      addedAt: '2024-01-16'
    }
  ]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsLoading(true);
    try {
      for (const file of files) {
        const newDoc = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type.includes('pdf') ? 'pdf' as const : 'doc' as const,
          status: 'processing' as const,
          addedAt: new Date().toISOString().split('T')[0]
        };
        setDocuments(prev => [...prev, newDoc]);
      }
      
      toast({
        title: "Documentos carregados!",
        description: "Os documentos estão sendo processados.",
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUrl = async () => {
    if (!newUrl) return;
    
    const newDoc = {
      id: Date.now().toString(),
      name: newUrl,
      type: 'url' as const,
      status: 'processing' as const,
      addedAt: new Date().toISOString().split('T')[0]
    };
    
    setDocuments(prev => [...prev, newDoc]);
    setNewUrl('');
    
    toast({
      title: "URL adicionada!",
      description: "O conteúdo da URL está sendo processado.",
    });
  };

  const handleAddFaq = async () => {
    if (!newFaq.question || !newFaq.answer) return;
    
    const newDoc = {
      id: Date.now().toString(),
      name: `FAQ: ${newFaq.question}`,
      type: 'faq' as const,
      status: 'processed' as const,
      addedAt: new Date().toISOString().split('T')[0]
    };
    
    setDocuments(prev => [...prev, newDoc]);
    setNewFaq({ question: '', answer: '' });
    
    toast({
      title: "FAQ adicionada!",
      description: "A pergunta e resposta foram adicionadas ao conhecimento.",
    });
  };

  const handleSaveKnowledge = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Conhecimento salvo!",
        description: "O conhecimento personalizado foi adicionado.",
      });
      setCustomKnowledge('');
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

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast({
      title: "Documento removido",
      description: "O documento foi removido do treinamento.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-green-500';
      case 'processing': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processed': return 'Processado';
      case 'processing': return 'Processando';
      case 'failed': return 'Falhou';
      default: return 'Desconhecido';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'doc':
        return FileText;
      case 'url':
        return Link;
      case 'faq':
        return MessageSquare;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload de Documentos
          </CardTitle>
          <CardDescription>
            Carregue PDFs, documentos Word e outros arquivos para treinar seu chatbot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Arraste arquivos aqui ou clique para selecionar</p>
            <p className="text-muted-foreground mb-4">Suportamos PDF, DOC, DOCX até 10MB</p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Selecionar Arquivos
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Adicionar URLs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Link className="w-5 h-5 mr-2" />
            Adicionar URLs
          </CardTitle>
          <CardDescription>
            Adicione URLs de páginas web para extrair conhecimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="https://exemplo.com/ajuda"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddUrl}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Perguntas e Respostas (FAQ)
          </CardTitle>
          <CardDescription>
            Adicione perguntas frequentes e suas respostas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Pergunta</Label>
            <Input
              placeholder="Como posso cancelar meu pedido?"
              value={newFaq.question}
              onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Resposta</Label>
            <Textarea
              placeholder="Para cancelar seu pedido, acesse sua conta..."
              value={newFaq.answer}
              onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
              rows={3}
            />
          </div>
          <Button onClick={handleAddFaq}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar FAQ
          </Button>
        </CardContent>
      </Card>

      {/* Conhecimento Personalizado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Book className="w-5 h-5 mr-2" />
            Conhecimento Personalizado
          </CardTitle>
          <CardDescription>
            Insira informações específicas sobre sua empresa, produtos ou serviços
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Digite aqui informações importantes que o chatbot deve saber sobre sua empresa, produtos, políticas, etc..."
            value={customKnowledge}
            onChange={(e) => setCustomKnowledge(e.target.value)}
            rows={6}
          />
          <Button onClick={handleSaveKnowledge} disabled={isLoading || !customKnowledge}>
            {isLoading ? "Salvando..." : "Salvar Conhecimento"}
          </Button>
        </CardContent>
      </Card>

      {/* Histórico de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Treinados</CardTitle>
          <CardDescription>
            Histórico de todos os documentos e conteúdos utilizados no treinamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc) => {
              const Icon = getTypeIcon(doc.type);
              return (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">Adicionado em {doc.addedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(doc.status)}`} />
                      <span>{getStatusText(doc.status)}</span>
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(doc.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
