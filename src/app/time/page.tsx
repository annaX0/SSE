"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [hora, setHora] = useState("");

  useEffect(() => {
    const source = new EventSource("/api/time-sse");

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setHora(data.hora);
    };

    source.onerror = () => {
      source.close();
    };

    return () => {
      source.close();
    };
  }, []);

  return (
    <main style={{ padding: "2rem", fontSize: "2rem" }}>
      <h1>🕒 Hora atual via SSE:</h1>
      <p>{hora || "Conectando..."}</p>
    </main>
  );
}
