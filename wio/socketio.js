const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }
});
const port = 3000;
const openaiApiKey = process.env.OPENAI_API_KEY;

// Middleware para entender JSON no corpo das requisições
app.use(express.json());

// Configuração de CORS única e consistente
app.use(cors({
    origin: "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/chat",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Configuração do Socket.IO
io.on("connection", (socket) => {
    console.log("Usuário conectado: " + socket.id);
    socket.on("message", (msg) => {
        console.log("Mensagem recebida:", msg);
        io.emit("message", msg);
    });
});

// Rota de arquivos estáticos
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/chat", (req, res) => {
    res.sendFile(path.join(__dirname, "chat.html"));
});

app.get("/chat.js", (req, res) => {
    res.sendFile(path.join(__dirname, "chat.js"));
});

app.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, "style.css"));
});

app.get("/style-login.css", (req, res) => {
    res.sendFile(path.join(__dirname, "style-login.css"));
});

// Rota para interagir com a API do OpenAI para chat
app.post('/openai/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Mensagem não pode ser vazia" });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }]
        }, {
            headers: { 'Authorization': `Bearer ${openaiApiKey}` }
        });

        res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Erro ao gerar resposta:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Erro ao gerar resposta da API do OpenAI" });
    }
});

// Rota para interagir com a API do OpenAI para geração de imagens
app.post('/openai/image', async (req, res) => {
    const imageDescription = req.body.description;

    if (!imageDescription) {
        return res.status(400).json({ error: "Descrição da imagem não pode ser vazia" });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/images/generations', {
            prompt: imageDescription,
            n: 1,
            size: '1024x1024'
        }, {
            headers: { 'Authorization': `Bearer ${openaiApiKey}` }
        });

        console.log(response.data)
        res.json({ url: response.data.data[0].url });
    } catch (error) {
        console.error('Erro ao gerar imagem:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Erro ao gerar imagem da API do OpenAI" });
    }
});

// Rota para buscar uma imagem de gato
app.post('/gatos', async (req, res) => {
    try {
        // Requisição GET para buscar imagem na The Cat API
        const response = await axios.get('https://api.thecatapi.com/v1/images/search');

        // Extraindo a URL, largura e altura da imagem
        const catData = response.data[0];
        const catImageInfo = {
            id: catData.id,
            url: catData.url,
            width: catData.width,
            height: catData.height
        };

        console.log(catImageInfo); // Log para ver o retorno da API
        res.json(catImageInfo); // Enviando os dados da imagem como resposta
    } catch (error) {
        console.error('Erro ao buscar imagem:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Erro ao buscar imagem de gato" });
    }
});
app.post('/cachorro', async (req, res) => {
    try {
        // Requisição GET para buscar imagem na The Cat API
        const response = await axios.get('https://api.thecatapi.com/v1/images/search');

        // Extraindo a URL, largura e altura da imagem
        const catData = response.data[0];
        const catImageInfo = {
            id: catData.id,
            url: catData.url,
            width: catData.width,
            height: catData.height
        };

        console.log(catImageInfo); // Log para ver o retorno da API
        res.json(catImageInfo); // Enviando os dados da imagem como resposta
    } catch (error) {
        console.error('Erro ao buscar imagem:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Erro ao buscar imagem de gato" });
    }
});

// Iniciar o servidor
server.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`);
});
