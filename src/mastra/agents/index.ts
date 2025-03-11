import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import * as tools from "../tools/";

export const assistant = new Agent({
  name: "Assistant",
  instructions:
    "You are a helpful assistant. When asked something that requires internet search use Tavily Search. If you have a list of URLs, use Tavily Extract to extract content from them.",
  model: openai("gpt-4o"),
  tools: {
    tavilyExtract: tools.tavilyExtract,
    tavilySearch: tools.tavilySearch,
  },
});
