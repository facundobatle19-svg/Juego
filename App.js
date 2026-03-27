import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Lobby from "./components/Lobby";
import Game from "./components/Game";

function App() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div style={{ fontFamily: "Arial", textAlign: "center", padding: "20px" }}>
      {!username && <Login setUsername={setUsername} />}
      {username && !gameStarted && (
        <Lobby
          username={username}
          players={players}
          setPlayers={setPlayers}
          setGameStarted={setGameStarted}
        />
      )}
      {gameStarted && <Game players={players} username={username} />}
    </div>
  );
}

export default App;