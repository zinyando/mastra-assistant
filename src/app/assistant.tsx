"use client";

import { Thread } from "@/components/assistant-ui/thread";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { MastraRuntimeProvider } from "./MastraRuntimeProvider";

export const Assistant = () => {
  return (
    <MastraRuntimeProvider>
      <div className="grid h-dvh grid-cols-[200px_1fr] gap-x-2 px-4 py-4">
        <ThreadList />
        <Thread />
      </div>
    </MastraRuntimeProvider>
  );
};
