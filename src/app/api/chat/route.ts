import { assistant } from "@/mastra/agents";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, system } = await req.json();

  if (system) {
    assistant.instructions = system;
  }

  const stream = await assistant.stream(messages);

  const encoder = new TextEncoder();
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  (async () => {
    try {
      const reader = stream.textStream;
      for await (const chunk of reader) {
        try {
          const formattedChunk = `data: ${JSON.stringify({ type: "text", value: chunk })}\n\n`;
          await writer.write(encoder.encode(formattedChunk));
        } catch (writeError) {
          console.log("Write error (client likely disconnected):", writeError);
          break;
        }
      }

      try {
        await writer.write(encoder.encode("data: [DONE]\n\n"));
      } catch (closeError) {
        console.log("Error writing close event:", closeError);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("ResponseAborted")) {
        console.log("Client disconnected:", error);
      } else {
        console.error("Stream processing error:", error);

        try {
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", value: error instanceof Error ? error.message : String(error) })}\n\n`
            )
          );
        } catch (writeError) {
          console.log("Error writing error message:", writeError);
        }
      }
    } finally {
      try {
        if (writer.desiredSize !== null) {
          await writer.close();
        }
      } catch (e) {
        console.log("Error closing writer:", e);
      }
    }
  })();

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
