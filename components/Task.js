import React from "react";

export default function Task({ onComplete }) {
  return (
    <div>
      <h2>Realizá tu tarea</h2>
      <button onClick={onComplete}>Completar tarea</button>
    </div>
  );
}