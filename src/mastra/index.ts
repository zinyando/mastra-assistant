import { Mastra } from "@mastra/core";
import { assistant } from "./agents";

export const mastra = new Mastra({
  agents: { assistant },
});
