import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

export const assistant = new Agent({
  name: "Assistant",
  instructions: "You are a helpful assistant.",
  model: openai("gpt-4o-mini"),
});
