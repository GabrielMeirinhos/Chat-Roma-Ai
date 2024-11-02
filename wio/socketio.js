const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const axios = require('axios');
const cors = require('cors');
const { link } = require("fs");
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

io.on("connection", (socket) => {
    console.log("Usuário conectado: " + socket.id);

    socket.on("message", (msg) => {
        console.log("Mensagem recebida:", msg);

        // Verifica se a mensagem é um comando de som
        const sons = {
            "gato mia": "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/gato.mp3",
            "auau": "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/cachorro.mp3",
            "galinha": "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/galinha.mp3",
            "muh": "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/vaca.mp3",
            "suspense": "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/dun.mp3",
            "bom dia": "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/bomdia.mp3",
            "peido": "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/peido.mp3",
            "faz o l": "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/lulinha.mp3",
            "kkk": "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/haha.mp3",
        };

        // Detecta e envia comando de som a todos
        for (const comando in sons) {
            if (msg.text.includes(comando)) {
                io.emit("playSound", { url: sons[comando] }); // Emitir o evento de som para todos os usuários
                return; // Sai para evitar envio adicional do mesmo som como mensagem
            }
        }

        // Caso não seja som, emite como mensagem padrão
        io.emit("message", msg);
    });
});
// Rota de arquivos estáticos
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.use("/sons", express.static(path.join(__dirname, "sons")));

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

app.post('/buscar-pokemon', async (req, res) => {
    const { name } = req.body;

    try {
        // Verifica se o nome foi fornecido
        if (!name) {
            return res.status(400).json({ error: 'Nome do Pokémon é necessário' });
        }

        // Faz a requisição GET à PokéAPI com o nome do Pokémon
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        const pokemonData = {
            name: response.data.name,
            image: response.data.sprites.front_shiny
        };
        res.json({ url: pokemonData.image });
    } catch (error) {
        console.error('Erro ao buscar o Pokémon:', error.message);
        res.status(404).json({ error: 'Pokémon não encontrado' });
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
        // Requisição GET para buscar imagem na API de cachorros
        const response = await axios.get('https://dog.ceo/api/breeds/image/random');

        const dogImageInfo = {
            url: response.data.message,
            status: response.data.status 
        };

        console.log(dogImageInfo); // Log para verificar o retorno da API
        res.json(dogImageInfo); // Enviando a URL da imagem como resposta
    } catch (error) {
        console.error('Erro ao buscar imagem de cachorro:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Erro ao buscar imagem de cachorro" });
    }
});
app.post('/raposa', async (req, res) => {
    try {
        // Requisição GET para buscar imagem na API de raposas
        const response = await axios.get('https://randomfox.ca/floof/');

        const foxImageInfo = {
            image: response.data.image,
            link: response.data.link
        };

        console.log(foxImageInfo); // Log para verificar o retorno da API
        res.json(foxImageInfo); // Enviando a URL da imagem e o link como resposta JSON
    } catch (error) {
        console.error('Erro ao buscar imagem de raposa:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Erro ao buscar imagem de raposa" });
    }
});
// Iniciar o servidor
server.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`);
});
