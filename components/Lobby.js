import React, { useState } from "react";

export default function Lobby({ username, players, setPlayers, setGameStarted }) {
  const [input, setInput] = useState("");

  const addPlayer = () => {
    if (!input) return;
    setPlayers([...players, input]);
    setInput("");
  };

  const startGame = () => {
    if (players.length < 3) {
      alert("Se necesitan al menos 3 jugadores.");
      return;
    }
    setGameStarted(true);
  };

  return (
    <div>
      <h1>Lobby</h1>
      <p>Bienvenido, {username}</p>
      <div>
        <input
          type="text"
          placeholder="Agregar jugador"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addPlayer}>Agregar</button>
      </div>
      <ul>
        {players.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
      <button onClick={startGame}>Iniciar Juego</button>
    </div>
  );
}