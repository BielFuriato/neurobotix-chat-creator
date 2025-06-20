import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { OllamaStatus } from '@/components/OllamaStatus';
import { 
  Upload, 
  FileText, 
  Link, 
  MessageSquare, 
  Trash2,
  Plus,
  Book,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { trainingService } from '@/lib/training-service';
import { KnowledgeBase } from '@/lib/database';

interface TrainingProps {
  chatbot: any;
}

export const Training = ({ chatbot }: TrainingProps) => {
  const [customKnowledge, setCustomKnowledge] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [documents, setDocuments] = useState<KnowledgeBase[]>([]);
  const { toast } = useToast();

  // Estados de loading individuais
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [isUrlAdding, setIsUrlAdding] = useState(false);
  const [isFaqAdding, setIsFaqAdding] = useState(false);
  const [isKnowledgeSaving, setIsKnowledgeSaving] = useState(false);

  // Estados de progresso individuais
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [urlAddProgress, setUrlAddProgress] = useState(0);
  const [faqAddProgress, setFaqAddProgress] = useState(0);
  const [knowledgeSaveProgress, setKnowledgeSaveProgress] = useState(0);

  // Carregar documentos ao montar componente
  useEffect(() => {
    loadDocuments();
  }, [chatbot.id]);

  const loadDocuments = async () => {
    try {
      const docs = await trainingService.getTrainingDocuments(parseInt(chatbot.id));
      setDocuments(docs);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsFileUploading(true);
    setFileUploadProgress(0);
    try {
      await trainingService.processFileUpload(
        files, 
        parseInt(chatbot.id),
        (progress) => {
          setFileUploadProgress(progress);
        }
      );
      await loadDocuments();
      
      toast({
        title: "Documentos carregados!",
        description: `${files.length} documento(s) processado(s) com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Erro ao processar documentos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsFileUploading(false);
      setFileUploadProgress(0);
      event.target.value = '';
    }
  };

  const handleAddUrl = async () => {
    if (!newUrl) return;
    
    setIsUrlAdding(true);
    setUrlAddProgress(0);
    try {
      await trainingService.processUrl(
        newUrl, 
        parseInt(chatbot.id),
        (progress) => {
          setUrlAddProgress(progress);
        }
      );
      await loadDocuments();
      setNewUrl('');
      
      toast({
        title: "URL adicionada!",
        description: "O conteúdo da URL foi processado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao processar URL",
        description: "Verifique se a URL está correta e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUrlAdding(false);
      setUrlAddProgress(0);
    }
  };

  const handleAddFaq = async () => {
    if (!newFaq.question || !newFaq.answer) return;
    
    setIsFaqAdding(true);
    setFaqAddProgress(0);
    try {
      await trainingService.addFaq(
        newFaq.question, 
        newFaq.answer, 
        parseInt(chatbot.id),
        (progress) => {
          setFaqAddProgress(progress);
        }
      );
      await loadDocuments();
      setNewFaq({ question: '', answer: '' });
      
      toast({
        title: "FAQ adicionada!",
        description: "A pergunta e resposta foram adicionadas ao conhecimento.",
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar FAQ",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsFaqAdding(false);
      setFaqAddProgress(0);
    }
  };

  const handleSaveKnowledge = async () => {
    if (!customKnowledge.trim()) return;

    setIsKnowledgeSaving(true);
    setKnowledgeSaveProgress(0);
    try {
      await trainingService.addCustomKnowledge(
        customKnowledge, 
        parseInt(chatbot.id),
        (progress) => {
          setKnowledgeSaveProgress(progress);
        }
      );
      await loadDocuments();
      setCustomKnowledge('');
      
      toast({
        title: "Conhecimento salvo!",
        description: "O conhecimento personalizado foi adicionado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsKnowledgeSaving(false);
      setKnowledgeSaveProgress(0);
    }
  };

  const removeDocument = async (id: number) => {
    try {
      await trainingService.removeTrainingDocument(id);
      await loadDocuments();
      
      toast({
        title: "Documento removido",
        description: "O documento foi removido do treinamento.",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (sourceType: string) => {
    return 'bg-green-500'; // Todos processados com sucesso
  };

  const getStatusText = () => {
    return 'Processado';
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
      case 'custom':
        return Book;
      default:
        return FileText;
    }
  };

  const getSourceTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'doc': return 'Documento';
      case 'url': return 'URL';
      case 'faq': return 'FAQ';
      case 'custom': return 'Personalizado';
      default: return 'Documento';
    }
  };

  return (
    <div className="space-y-6">
      {/* Status do Ollama */}
      <OllamaStatus />

      {/* Estatísticas de Treinamento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Documentos</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Processados</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Book className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Base de Conhecimento</p>
                <p className="text-2xl font-bold">
                  {documents.reduce((acc, doc) => acc + doc.content.length, 0) > 0 ? 'Ativa' : 'Vazia'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
            <p className="text-muted-foreground mb-4">Suportamos PDF, DOC, DOCX, TXT até 10MB</p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={isFileUploading}
            />
            <Button asChild disabled={isFileUploading}>
              <label htmlFor="file-upload" className="cursor-pointer">
                {isFileUploading ? (
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </span>
                ) : "Selecionar Arquivos"}
              </label>
            </Button>
            {isFileUploading && (
              <div className="mt-4">
                <Progress value={fileUploadProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  {fileUploadProgress}% concluído
                </p>
              </div>
            )}
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
              disabled={isUrlAdding}
            />
            <Button onClick={handleAddUrl} disabled={isUrlAdding || !newUrl}>
              {isUrlAdding ? (
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Adicionando...
                </span>
              ) : (
                <span className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </span>
              )}
            </Button>
          </div>
          {isUrlAdding && (
            <div className="mt-4">
              <Progress value={urlAddProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-1">
                {urlAddProgress}% concluído
              </p>
            </div>
          )}
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
              disabled={isFaqAdding}
            />
          </div>
          <div className="space-y-2">
            <Label>Resposta</Label>
            <Textarea
              placeholder="Para cancelar seu pedido, acesse sua conta..."
              value={newFaq.answer}
              onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
              rows={3}
              disabled={isFaqAdding}
            />
          </div>
          <Button 
            onClick={handleAddFaq} 
            disabled={isFaqAdding || !newFaq.question || !newFaq.answer}
          >
            {isFaqAdding ? (
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Adicionando...
              </span>
            ) : (
              <span className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar FAQ
              </span>
            )}
          </Button>
          {isFaqAdding && (
            <div className="mt-4">
              <Progress value={faqAddProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-1">
                {faqAddProgress}% concluído
              </p>
            </div>
          )}
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
            disabled={isKnowledgeSaving}
          />
          <Button 
            onClick={handleSaveKnowledge} 
            disabled={isKnowledgeSaving || !customKnowledge.trim()}
          >
            {isKnowledgeSaving ? (
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </span>
            ) : "Salvar Conhecimento"}
          </Button>
          {isKnowledgeSaving && (
            <div className="mt-4">
              <Progress value={knowledgeSaveProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-1">
                {knowledgeSaveProgress}% concluído
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle>Base de Conhecimento</CardTitle>
          <CardDescription>
            Todos os documentos e conteúdos utilizados no treinamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum documento adicionado ainda</p>
              <p className="text-sm text-muted-foreground">Adicione documentos, URLs ou FAQs para treinar seu chatbot</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => {
                const Icon = getTypeIcon(doc.sourceType);
                return (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.fileName}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>Tipo: {getSourceTypeLabel(doc.sourceType)}</span>
                          <span>•</span>
                          <span>Adicionado em {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(doc.sourceType)}`} />
                        <span>{getStatusText()}</span>
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.id!)}
                        disabled={isFileUploading || isUrlAdding || isFaqAdding || isKnowledgeSaving}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};