import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { tavily } from "@tavily/core";

export const tavilyExtract = createTool({
  id: "Tavily Extract",
  description:
    "Extract content from a list of URLs using Tavily's extraction API.",
  inputSchema: z.object({
    urls: z
      .array(z.string().url())
      .max(20)
      .describe("List of URLs to extract content from (max 20)"),
  }),
  execute: async ({ context }) => {
    try {
      const { urls } = context;
      const apiKey = process.env.TAVILY_API_KEY;
      if (!apiKey) {
        throw new Error("TAVILY_API_KEY environment variable is not set");
      }

      const tvly = tavily({ apiKey });

      console.log("Extracting content from URLs:", urls);

      const response = await tvly.extract(urls, {
        extractDepth: "advanced",
      });

      return {
        results: response.results.map((result) => ({
          url: result.url,
          content: result.rawContent || "",
        })),
        failedResults: response.failedResults || [],
      };
    } catch (error: unknown) {
      console.error("Tavily extract error:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to extract content with Tavily: ${errorMessage}`);
    }
  },
});

export const tavilySearch = createTool({
  id: "Tavily Search",
  description:
    "Search the web for information using Tavily's AI-optimized search engine.",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
    searchDepth: z
      .enum(["basic", "advanced"])
      .optional()
      .describe(
        "The depth of the search. 'basic' is faster, 'advanced' is more thorough."
      ),
    maxResults: z
      .number()
      .min(1)
      .max(20)
      .optional()
      .describe("Maximum number of results to return (1-20)."),
    includeAnswer: z
      .boolean()
      .optional()
      .describe(
        "Whether to include an AI-generated answer based on the search results."
      ),
    topic: z
      .enum(["general", "news"])
      .optional()
      .describe("The category of search to perform."),
    timeRange: z
      .enum(["day", "week", "month", "year"])
      .optional()
      .describe("Filter results by time range."),
  }),
  execute: async ({ context }) => {
    try {
      const {
        query,
        searchDepth = "basic",
        maxResults = 5,
        includeAnswer = false,
        topic = "general",
        timeRange,
      } = context;

      const apiKey = process.env.TAVILY_API_KEY;
      if (!apiKey) {
        throw new Error("TAVILY_API_KEY environment variable is not set");
      }

      const tvly = tavily({ apiKey });

      const response = await tvly.search(query, {
        searchDepth,
        maxResults,
        includeAnswer,
        topic,
        ...(timeRange && { timeRange }),
      });

      return {
        results: response.results,
        query: response.query,
        responseTime: response.responseTime,
        answer: response.answer,
      };
    } catch (error: unknown) {
      console.error("Tavily search error:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to search with Tavily: ${errorMessage}`);
    }
  },
});
