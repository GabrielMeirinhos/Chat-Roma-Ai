// Inicializando o socket com o servidor
const socket = io("https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev");

// Recupera o nome de usuário armazenado, redirecionando para a página de login se ele não existir
const username = localStorage.getItem("username");
if (!username) {
    window.location.href = "/";
}

// Evento de conexão do socket
socket.on("connect", () => {
    console.log("Conectado ao servidor");
});

// Recebe e exibe as mensagens do servidor
socket.on("message", (msg) => {
    const ul = document.querySelector("ul");
    const li = document.createElement("li");

    // Define a classe da mensagem para distinguir mensagens enviadas pelo usuário
    li.className = msg.username === username ? "my-message" : "other-message";

    // Verifica se a mensagem é uma URL de som e exibe o link para o áudio
    if (msg.text.includes(".mp3")) {
        li.innerHTML = `${msg.username}: <audio controls src="${msg.text}"></audio>`;
    } else if (msg.text.includes(".png") || msg.text.includes(".jpg")) {
        li.innerHTML = msg.username === username ? 
            `<img src="${msg.text}" alt="Imagem gerada">` : 
            `${msg.username}: <img src="${msg.text}" alt="Imagem gerada">`;
    } else {
        // Renderiza como texto normal
        li.innerHTML = msg.username === username ? `${msg.text}` : `${msg.username}: ${msg.text}`;
    }

    ul.appendChild(li);
    ul.scrollTop = ul.scrollHeight;
});


// Função para enviar mensagem de texto para a API ChatGPT no backend
async function enviarParaAPImensagem(mensagem) {
    try {
        const response = await fetch("https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/openai/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: mensagem })
        });
        if (!response.ok) throw new Error("Erro na requisição da API");
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Erro ao enviar mensagem para a API:", error);
        return "Desculpe, não consegui processar sua solicitação.";
    }
}

// Função para enviar uma descrição de imagem para a API de geração de imagem do OpenAI no backend
async function enviarParaAPIimagem(descricao) {
    try {
        const response = await fetch("https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/openai/image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description: descricao })
        });
        if (!response.ok) throw new Error("Erro na requisição da API");
        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error("Erro ao gerar imagem:", error);
        return "Desculpe, não consegui processar sua solicitação.";
    }
}
async function enviarParaAPIPokemon(nome) {
    try {
        const response = await fetch("https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/buscar-pokemon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: nome }) // Envia o nome do Pokémon
        });

        if (!response.ok) throw new Error("Pokémon não encontrado");

        const data = await response.json();
        return data.url; // Retorna a URL da imagem do Pokémon
    } catch (error) {
        console.error("Erro ao buscar Pokémon:", error);
        return null; // Retorna null em caso de erro
    }
}


// Função para enviar uma solicitação para a API de gatos
async function enviarParaApiGatos() {
    try {
        const response = await fetch("https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/gatos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description: "Solicitação de imagem de gato" })
        });

        if (!response.ok) throw new Error("Erro na requisição da API de gatos");
        
        const data = await response.json();
        return data.url; // Retorna a URL da imagem recebida da API
    } catch (error) {
        console.error("Erro ao buscar imagem de gato:", error);
        return "Desculpe, não consegui buscar uma imagem de gato.";
    }
}
async function enviarParaApiCachorros() {
    try {
        const response = await fetch("https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/cachorro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description: "Solicitação de imagem de cachorro" })
        });

        if (!response.ok) throw new Error("Erro na requisição da API de cachorros");
        
        const data = await response.json();
        return data.url; // Retorna a URL da imagem recebida da API
    } catch (error) {
        console.error("Erro ao buscar imagem de cachorro:", error);
        return "Desculpe, não consegui buscar uma imagem de cachorro.";
    }
}
async function enviarParaApiRaposa() {
    try {
        const response = await fetch("https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/raposa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description: "Solicitação de imagem de raposa" })
        });

        if (!response.ok) throw new Error("Erro na requisição da API de raposa");
        
        const data = await response.json();
        console.log(data)
        console.log(data.image)
        return data.image; // Retorna a URL da imagem recebida da API
    } catch (error) {
        console.error("Erro ao buscar imagem de cachorro:", error);
        return "Desculpe, não consegui buscar uma imagem de raposa.";
    }
}

// Função para tocar som a partir de uma URL
function tocarSom(url) {
    const audio = new Audio(url);
    audio.play();
}

// Mapeamento de comandos para URLs de sons
const sons = {
    "gato mia": "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/gato.mp3",
    "auau": "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/cachorro.mp3",
    "galinha": "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/galinha.mp3",
    "muh": "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/vaca.mp3",

    "suspense" : "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/dun.mp3",
    "bom dia" : "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/bomdia.mp3",
    "peido" : "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/peido.mp3",
    "faz o l" : "https://reimagined-space-couscous-5wgq5x6g4q5cpgw7-3000.app.github.dev/sons/lulinha.mp3",

};

// Função para verificar e tocar som
function verificarComandoESom(messageText) {
    for (const comando in sons) {
        if (messageText.includes(comando)) {
            tocarSom(sons[comando]);
            break;
        }
    }
}


// Função principal para enviar mensagens ao servidor
async function enviar() {
    const msgInput = document.querySelector("input");
    const messageText = msgInput.value.trim();

    if (messageText) {

        verificarComandoESom(messageText);


        if (messageText.startsWith("/text ")) {
            const mensagem = messageText.slice(6);
            const resposta = await enviarParaAPImensagem(mensagem);
            socket.emit("message", { username: "ChatGPT", text: resposta });
        } else if (messageText.startsWith("/image ")) {
            const descricao = messageText.slice(7);
            const imagemURL = await enviarParaAPIimagem(descricao);
            socket.emit("message", { username: "ChatGPT", text: imagemURL });
        } else if (messageText.startsWith("/pokemon ")) {
            const descricao = messageText.slice(9);
            const imagemURL = await enviarParaAPIPokemon(descricao);
            socket.emit("message", { username: "Pokemon", text: imagemURL });
        }else if (messageText.includes("GATOS")) {
            const imagemURL = await enviarParaApiGatos();
            socket.emit("message", { username: "Gato", text: imagemURL });
        } else if (messageText.includes("CACHORROS")) {
            const imagemURL = await enviarParaApiCachorros();
            socket.emit("message", { username: "Cachorro", text: imagemURL });
        } else if (messageText.includes("RAPOSAS")) {
            const imagemURL = await enviarParaApiRaposa();
            socket.emit("message", { username: "Raposa", text: imagemURL });
        }
         else {
            socket.emit("message", { username: username, text: messageText });
        }
        msgInput.value = "";
    } else {
        alert("Por favor, digite uma mensagem antes de enviar.");
    }
}

// Escuta a tecla Enter para enviar a mensagem
document.querySelector("input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        enviar();
    }
});
