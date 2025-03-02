import { assistant } from "@/mastra/agents";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, system } = await req.json();

  if (system) {
    assistant.instructions = system;
  }

  const stream = await assistant.stream(messages);

  return stream.toTextStreamResponse();
}
