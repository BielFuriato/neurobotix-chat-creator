import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch'; // npm install node-fetch

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());

// Permitir CORS para todas as rotas
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Configuração para servir arquivos estáticos
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Simulação de banco de dados para bots
const bots = [
  { id: 'bot123', apiKey: 'nb_ak_abc123', name: 'Chatbot NeuroBotix' },
];

// Endpoint proxy para buscar HTML de outras URLs
app.get('/proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('URL obrigatória');
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0', // Simula um navegador
      }
    });
    const html = await response.text();
    res.header('Access-Control-Allow-Origin', '*');
    res.send(html);
  } catch (err) {
    res.status(500).send('Erro ao buscar URL');
  }
});

// Endpoint para validar botId e apiKey
app.get('/chatbot/:botId', (req, res) => {
  const { botId } = req.params;
  const { apiKey } = req.query;

  const bot = bots.find((b) => b.id === botId && b.apiKey === apiKey);

  if (!bot) {
    return res.status(403).json({ error: 'botId ou apiKey inválidos.' });
  }

  res.status(200).json({ message: `Bem-vindo ao ${bot.name}!` });
});

// Endpoint para interações do chatbot
app.post('/chatbot/:botId/message', (req, res) => {
  const { botId } = req.params;
  const { apiKey, message } = req.body;

  const bot = bots.find((b) => b.id === botId && b.apiKey === apiKey);

  if (!bot) {
    return res.status(403).json({ error: 'botId ou apiKey inválidos.' });
  }

  const response = `Você disse: "${message}". Aqui está minha resposta!`;
  res.status(200).json({ response });
});

// Inicia o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});