function randomStatus(current) {
  const statuses = ["Processando", "Enviado", "Entregue"];
  const currentIndex = statuses.indexOf(current);
  if (currentIndex < statuses.length - 1) {
    // 50% chance de avançar para o próximo status
    return Math.random() > 0.5 ? statuses[currentIndex + 1] : current;
  }
  return current;
}

function generateOrders() {
  return [
    { id: 1, status: "Processando", updatedAt: new Date().toISOString() },
    { id: 2, status: "Processando", updatedAt: new Date().toISOString() },
    { id: 3, status: "Processando", updatedAt: new Date().toISOString() },
    { id: 4, status: "Processando", updatedAt: new Date().toISOString() },
    { id: 5, status: "Processando", updatedAt: new Date().toISOString() },
    { id: 6, status: "Processando", updatedAt: new Date().toISOString() },
    { id: 7, status: "Processando", updatedAt: new Date().toISOString() },
    { id: 8, status: "Processando", updatedAt: new Date().toISOString() },
    { id: 9, status: "Processando", updatedAt: new Date().toISOString() },
    { id: 10, status: "Processando", updatedAt: new Date().toISOString() },
    { id: 11, status: "Processando", updatedAt: new Date().toISOString() },
    { id: 12, status: "Processando", updatedAt: new Date().toISOString() },
    { id: 13, status: "Processando", updatedAt: new Date().toISOString() },
    { id: 14, status: "Processando", updatedAt: new Date().toISOString() },
  ];
}

let orders = generateOrders();

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const sendUpdate = () => {
        // Atualiza status aleatoriamente
        orders = orders.map((order) => ({
          ...order,
          status: randomStatus(order.status),
          updatedAt: new Date().toISOString(),
        }));

        const data = `data: ${JSON.stringify({ orders })}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      sendUpdate();

      const interval = setInterval(sendUpdate, 3000);

      // O cancel é chamado se o cliente desconectar
      controller.signal?.addEventListener?.("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
    cancel() {
      // fallback para limpar intervalo se cancel chamado
      clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
