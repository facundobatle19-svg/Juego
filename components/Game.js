import React, { useState, useEffect } from "react";
import { pickImpostor } from "../utils/helpers";
import Task from "./Task";
import Meeting from "./Meeting";

export default function Game({ players, username }) {
  const [impostor, setImpostor] = useState("");
  const [tasksDone, setTasksDone] = useState({});
  const [meeting, setMeeting] = useState(false);

  useEffect(() => {
    setImpostor(pickImpostor(players));
    setTasksDone(players.reduce((acc, p) => ({ ...acc, [p]: 0 }), {}));
  }, [players]);

  const handleCompleteTask = () => {
    setTasksDone({
      ...tasksDone,
      [username]: tasksDone[username] + 1,
    });
  };

  const callMeeting = () => setMeeting(true);

  if (meeting) {
    return <Meeting players={players} impostor={impostor} />;
  }

  return (
    <div>
      <h1>Juego del Impostor</h1>
      <p>{username === impostor ? "Sos el impostor 😈" : "Sos un tripulante 👨‍🚀"}</p>
      {username !== impostor && <Task onComplete={handleCompleteTask} />}
      <button onClick={callMeeting}>Llamar a reunión</button>
      <h3>Tareas completadas: {tasksDone[username]}</h3>
    </div>
  );
}