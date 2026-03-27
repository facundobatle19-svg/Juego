import React, { useState } from "react";

export default function Meeting({ players, impostor }) {
  const [voted, setVoted] = useState("");
  const [result, setResult] = useState("");

  const vote = (player) => {
    setVoted(player);
    if (player === impostor) setResult("¡Impostor expulsado! 🎉");
    else setResult("No era el impostor 😢");
  };

  return (
    <div>
      <h1>Reunión</h1>
      {!voted ? (
        <div>
          {players.map((p, i) => (
            <button key={i} onClick={() => vote(p)}>
              Votar a {p}
            </button>
          ))}
        </div>
      ) : (
        <h2>{result}</h2>
      )}
    </div>
  );
}