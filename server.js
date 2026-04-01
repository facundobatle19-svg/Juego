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

// ✅ PALABRAS CON PISTA
const words = [
    { word: "Gato", hint: "Animal doméstico" },
    { word: "Perro", hint: "Mejor amigo del hombre" },
    { word: "Pizza", hint: "Comida italiana" },
    { word: "Messi", hint: "Futbolista argentino" },
    { word: "Computadora", hint: "Sirve para programar" },
    { word: "Avión", hint: "Vuela por el cielo" },
    { word: "Mate", hint: "Infusión argentina" },
    { word: "Cine", hint: "Lugar para ver películas" },
    { word: "Fútbol", hint: "Deporte popular" },
    { word: "Asado", hint: "Comida típica argentina" },
    { word: "Helado", hint: "Postre frío" },
    { word: "Montaña", hint: "Gran elevación natural" },
    { word: "Río", hint: "Corriente de agua" },
    { word: "Libro", hint: "Se lee" },
    { word: "Celular", hint: "Dispositivo móvil" },
    { word: "Televisión", hint: "Pantalla para ver programas" },
    { word: "Escuela", hint: "Lugar para aprender" },
    { word: "Profesor", hint: "Enseña" },
    { word: "Alumno", hint: "Aprende" },
    { word: "Auto", hint: "Vehículo terrestre" },
    { word: "Bicicleta", hint: "Se mueve con pedales" },
    { word: "Tren", hint: "Transporte sobre rieles" },
    { word: "Barco", hint: "Viaja por el agua" },
    { word: "Playa", hint: "Arena y mar" },
    { word: "Sol", hint: "Estrella que ilumina la Tierra" },
    { word: "Luna", hint: "Satélite natural" },
    { word: "Estrella", hint: "Brilla en el cielo" },
    { word: "Nube", hint: "Está en el cielo" },
    { word: "Lluvia", hint: "Agua que cae del cielo" },
    { word: "Tormenta", hint: "Lluvia con viento" },
    { word: "Fuego", hint: "Produce calor" },
    { word: "Hielo", hint: "Agua congelada" },
    { word: "Bosque", hint: "Muchos árboles" },
    { word: "Desierto", hint: "Muy seco" },
    { word: "Isla", hint: "Tierra rodeada de agua" },
    { word: "Puente", hint: "Une dos lados" },
    { word: "Camino", hint: "Por donde se transita" },
    { word: "Semáforo", hint: "Controla el tránsito" },
    { word: "Hospital", hint: "Lugar para curarse" },
    { word: "Doctor", hint: "Cuida la salud" },
    { word: "Enfermero", hint: "Asiste al médico" },
    { word: "Farmacia", hint: "Venden medicamentos" },
    { word: "Pan", hint: "Alimento básico" },
    { word: "Queso", hint: "Derivado de la leche" },
    { word: "Leche", hint: "Bebida blanca" },
    { word: "Café", hint: "Bebida estimulante" },
    { word: "Té", hint: "Infusión caliente" },
    { word: "Agua", hint: "Esencial para la vida" },
    { word: "Jugo", hint: "Bebida de frutas" },
    { word: "Chocolate", hint: "Dulce de cacao" },
    { word: "Caramelo", hint: "Dulce pequeño" },
    { word: "Torta", hint: "Postre de cumpleaños" },
    { word: "Galleta", hint: "Se come con mate" },
    { word: "Cuchillo", hint: "Sirve para cortar" },
    { word: "Tenedor", hint: "Utensilio con puntas" },
    { word: "Cuchara", hint: "Para sopas" },
    { word: "Plato", hint: "Donde se sirve comida" },
    { word: "Vaso", hint: "Para beber" },
    { word: "Mesa", hint: "Mueble para comer" },
    { word: "Silla", hint: "Para sentarse" },
    { word: "Puerta", hint: "Entrada a un lugar" },
    { word: "Ventana", hint: "Deja pasar la luz" },
    { word: "Techo", hint: "Parte superior de una casa" },
    { word: "Piso", hint: "Se camina sobre él" },
    { word: "Cama", hint: "Para dormir" },
    { word: "Almohada", hint: "Para apoyar la cabeza" },
    { word: "Manta", hint: "Abriga" },
    { word: "Reloj", hint: "Marca la hora" },
    { word: "Calendario", hint: "Muestra fechas" },
    { word: "Bolígrafo", hint: "Sirve para escribir" },
    { word: "Lápiz", hint: "Se puede borrar" },
    { word: "Cuaderno", hint: "Para escribir notas" },
    { word: "Mochila", hint: "Lleva útiles" },
    { word: "Juego", hint: "Actividad divertida" },
    { word: "Pelota", hint: "Se usa en deportes" },
    { word: "Raqueta", hint: "Para tenis" },
    { word: "Gol", hint: "Punto en fútbol" },
    { word: "Equipo", hint: "Grupo de jugadores" },
    { word: "Árbitro", hint: "Hace cumplir reglas" },
    { word: "Carrera", hint: "Competencia de velocidad" },
    { word: "Música", hint: "Se escucha" },
    { word: "Canción", hint: "Tiene letra y ritmo" },
    { word: "Guitarra", hint: "Instrumento de cuerdas" },
    { word: "Piano", hint: "Instrumento con teclas" },
    { word: "Batería", hint: "Instrumento de percusión" },
    { word: "Baile", hint: "Movimiento con música" },
    { word: "Fiesta", hint: "Celebración" },
    { word: "Regalo", hint: "Se da en ocasiones especiales" },
    { word: "Cumpleaños", hint: "Se celebra cada año" },
    { word: "Amigo", hint: "Persona cercana" }
];

app.use(express.json());
app.use(express.static(__dirname));

// 📂 Leer usuarios
const getUsers = () => {
    if (fs.existsSync(USERS_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
        } catch (e) { return []; }
    }
    return [];
};

// 🔐 LOGIN
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

// 🔌 SOCKETS
io.on("connection", (socket) => {

    // 👤 REGISTRAR USUARIO
    socket.on("register-user", ({ username, character }) => {
        socket.username = username;

        let users = getUsers();

        if (!users.some(u => u.username === username)) {
            users.push({ username, character });
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        }

        console.log(`${username} se unió al lobby`);
        io.emit("users-list", users);
    });

    // 🎮 INICIAR JUEGO (AHORA RECIBE useHint)
    socket.on("start-game", ({ useHint }) => {
        const currentUsers = getUsers();

        if (currentUsers.length < 2) {
            return socket.emit("error-msg", "Mínimo 2 jugadores para empezar");
        }

        // 🎲 palabra + pista
        const selected = words[Math.floor(Math.random() * words.length)];
        const selectedWord = selected.word;
        const hint = selected.hint;

        // 🕵️ impostor
        const impostorIndex = Math.floor(Math.random() * currentUsers.length);
        const impostorName = currentUsers[impostorIndex].username;

        // 📤 enviar roles
        for (let [id, s] of io.sockets.sockets) {
            if (s.username === impostorName) {
                s.emit("receive-role", { 
                    role: "impostor",
                    hint: useHint ? hint : null // 👈 clave
                });
            } else {
                s.emit("receive-role", { 
                    role: "player", 
                    word: selectedWord
                });
            }
        }
    });

    // 🚪 LOGOUT
    socket.on("logout", () => {
        if (socket.username) {
            console.log(`${socket.username} cerró sesión`);

            let users = getUsers().filter(u => u.username !== socket.username);
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

            io.emit("users-list", users);
        }
    });

    // ❌ DESCONECTAR
    socket.on("disconnect", () => {
        if (socket.username) {
            console.log(`${socket.username} se desconectó`);

            let users = getUsers().filter(u => u.username !== socket.username);
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

            io.emit("users-list", users);
        }
    });
});

// 🚀 SERVIDOR
httpServer.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});