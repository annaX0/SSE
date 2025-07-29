export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;

      const interval = setInterval(() => {
        if (closed) return;

        const now = new Date().toLocaleTimeString("pt-BR");
        const data = `data: ${JSON.stringify({ hora: now })}\n\n`;
        controller.enqueue(encoder.encode(data));
      }, 1000);

      setTimeout(() => {
        if (!closed) {
          clearInterval(interval);
          controller.close();
          closed = true;
        }
      }, 6000);

      // Sem controller.signal (não disponível no Next.js)
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
