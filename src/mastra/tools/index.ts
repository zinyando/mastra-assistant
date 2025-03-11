import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const tavilySearch = createTool({
  id: "Tavily Search",
  description: "Search the web for information.",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
  }),
  execute: async ({ context }) => {
    const { query } = context;
    return `You searched for: ${query}`;
  },
});

export const tavilyExtract = createTool({
  id: "Tavily Extract",
  description: "Extract information from the web.",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
  }),
  execute: async ({ context }) => {
    const { query } = context;
    return `You extracted: ${query}`;
  },
});
