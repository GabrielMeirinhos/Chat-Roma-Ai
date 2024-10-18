const express = require("express");
const http = require("http");
const sktIo = require("socket.io");
const path = require("path"); // Adicione esta linha

const app = express();
const server = http.createServer(app);
const io = sktIo(server);
const port = 3001

app.use(express.static(path.join(__dirname, 'wio'))); 

io.on("connection", (socket) => {
    console.log("Usuario conectado " + socket.id);
    socket.on("message", (msg) => {
        console.log(msg);
        io.emit("message", msg);
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/chat", (req, res) => {
    res.sendFile(path.join(__dirname,  "chat.html"));
});

server.listen(port, () => {
    console.log("Servidor rodando na porta: " + port);
});