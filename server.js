const express = require("express");
const fs = require("fs");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, "users.json");

const words = [
    { word: "Gato", hint: "Animal doméstico" },
    { word: "Perro", hint: "Mejor amigo del hombre" },
    { word: "Pizza", hint: "Comida italiana" },
        { word: "Heladera", hint: "Siempre está cerrada pero todos la abren" },
        { word: "Semáforo", hint: "Da órdenes sin hablar" },
        { word: "Biblioteca", hint: "Un lugar donde el silencio pesa" },
        { word: "Reloj", hint: "Nunca se detiene, pero no se mueve" },
        { word: "Sombra", hint: "Te sigue aunque no la invites" },
        { word: "Teclado", hint: "Habla sin voz" },
        { word: "Montaña", hint: "Mientras más subís, menos aire hay" },
        { word: "Cartera", hint: "A veces está llena, muchas veces no" },
        { word: "Ascensor", hint: "Sube y baja sin cansarse" },
        { word: "Ventana", hint: "Permite ver sin salir" },
        
        { word: "Zapato", hint: "Siempre va de a dos" },
        { word: "Luna", hint: "Aparece cuando el sol se va" },
        { word: "Espejo", hint: "Nunca miente, pero tampoco habla" },
        { word: "Fuego", hint: "Puede dar calor o problemas" },
        { word: "Libro", hint: "Tiene mundos sin moverse" },
        { word: "Llave", hint: "Abre más que puertas" },
        { word: "Cama", hint: "Donde todo termina cada día" },
        { word: "Puerta", hint: "Divide pero también conecta" },
        { word: "Nube", hint: "Cambia de forma sin avisar" },
        { word: "Arena", hint: "Mucho de algo muy pequeño" },
        
        { word: "Celular", hint: "No se separa de la mano" },
        { word: "Auriculares", hint: "Te aíslan sin moverte" },
        { word: "Televisor", hint: "Muestra historias sin que participes" },
        { word: "Cuchillo", hint: "Divide con precisión" },
        { word: "Camisa", hint: "Va por dentro o por fuera" },
        { word: "Puente", hint: "Une lo separado" },
        { word: "Auto", hint: "Se mueve sin patas" },
        { word: "Paraguas", hint: "Se abre cuando peor está el clima" },
        { word: "Gafas", hint: "Te ayudan a ver lo que ya está" },
        { word: "Bolso", hint: "Carga más de lo que parece" },
        
        { word: "Desierto", hint: "Mucho espacio, poca vida" },
        { word: "Isla", hint: "Rodeada por lo mismo en todos lados" },
        { word: "Camino", hint: "No es destino, pero te lleva" },
        { word: "Tren", hint: "Nunca gira libremente" },
        { word: "Barco", hint: "Avanza sin ruedas" },
        { word: "Hospital", hint: "Donde se lucha por seguir" },
        { word: "Escuela", hint: "No siempre se aprende lo importante" },
        { word: "Cine", hint: "Oscuro pero lleno de historias" },
        { word: "Teatro", hint: "Todo es real y falso a la vez" },
        { word: "Parque", hint: "Un respiro dentro del ruido" }
        
];

app.use(express.json());
app.use(express.static(__dirname));

const getUsers = () => {
    if (fs.existsSync(USERS_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
        } catch {
            return [];
        }
    }
    return [];
};

app.post("/login", (req, res) => {
    const { username, character, useHint, impostorCount } = req.body;
    let users = getUsers();

    // 🚨 VALIDAR SIEMPRE EL PERSONAJE
    const characterTaken = users.find(u => u.character === character);

    // Si el personaje ya está ocupado → bloquear
    if (characterTaken) {
        return res.send({ success: false, message: "Personaje ya elegido" });
    }

    // ❌ NO usar username como identificador único
    // ✅ permitir nombres repetidos
    users.push({ 
        username, 
        character, 
        useHint, 
        impostorCount: Number(impostorCount) 
    });

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    res.send({ success: true });
});

io.on("connection", (socket) => {

    socket.on("register-user", ({ username }) => {
        socket.username = username;
        io.emit("users-list", getUsers());
    });

    socket.on("start-game", () => {
        const users = getUsers();

        if (users.length < 2) {
            return socket.emit("error-msg", "Mínimo 2 jugadores");
        }

        const selected = words[Math.floor(Math.random() * words.length)];

        // Buscamos la configuración del usuario que inició la partida
        const host = users.find(u => u.username === socket.username);
        let requestedImpostors = host ? host.impostorCount : 1;

        // Validamos que no haya más impostores que jugadores (dejando al menos 1 civil)
        const actualImpostors = Math.min(requestedImpostors, users.length - 1);

        const shuffled = [...users].sort(() => 0.5 - Math.random());
        const impostors = shuffled.slice(0, actualImpostors).map(u => u.username);

        for (let [id, s] of io.sockets.sockets) {
            const userData = users.find(u => u.username === s.username);
            if (!userData) continue;

            if (impostors.includes(s.username)) {
                s.emit("receive-role", {
                    role: "impostor",
                    hint: userData.useHint ? selected.hint : null
                });
            } else {
                s.emit("receive-role", {
                    role: "player",
                    word: selected.word
                });
            }
        }
    });

    socket.on("logout", () => {
        if (socket.username) {
            let users = getUsers().filter(u => u.username !== socket.username);
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
            io.emit("users-list", users);
        }
    });

    socket.on("disconnect", () => {});
});

httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});