const express = require("express");
const fs = require("fs");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 3000;
const USERS_FILE = path.join(__dirname, "users.json");
const words = ["Gato", "Perro", "Pizza", "Messi", "Computadora", "Avión", "Mate", "Cine", "Fútbol", "Asado"];

app.use(express.json());
app.use(express.static(__dirname));

// Función para leer usuarios de forma segura
const getUsers = () => {
    if (fs.existsSync(USERS_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
        } catch (e) { return []; }
    }
    return [];
};

// Login inicial
app.post("/login", (req, res) => {
    const { username, character } = req.body;
    let users = getUsers();

    if (users.some(u => u.character === character)) {
        return res.send({ success: false, message: "Personaje ya elegido por otro" });
    }

    if (!users.some(u => u.username === username)) {
        users.push({ username, character });
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    }
    res.send({ success: true, username });
});

io.on("connection", (socket) => {
    
    socket.on("register-user", (username) => {
        socket.username = username;
        console.log(`${username} se unió al lobby`);
        // Avisar a TODOS que la lista cambió
        io.emit("users-list", getUsers());
    });

    socket.on("start-game", () => {
        const currentUsers = getUsers();
        if (currentUsers.length < 2) {
            return socket.emit("error-msg", "Mínimo 2 jugadores para empezar");
        }

        const selectedWord = words[Math.floor(Math.random() * words.length)];
        const impostorIndex = Math.floor(Math.random() * currentUsers.length);
        const impostorName = currentUsers[impostorIndex].username;

        // Enviar roles
        for (let [id, s] of io.sockets.sockets) {
            if (s.username === impostorName) {
                s.emit("receive-role", { role: "impostor" });
            } else {
                s.emit("receive-role", { role: "player", word: selectedWord });
            }
        }
    });

    socket.on("disconnect", () => {
        if (socket.username) {
            console.log(`${socket.username} se desconectó`);
            let users = getUsers().filter(u => u.username !== socket.username);
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
            // Actualizar la lista para los que se quedan
            io.emit("users-list", users);
        }
    });
});

httpServer.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));