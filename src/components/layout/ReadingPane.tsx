import { ThreadView } from "../email/ThreadView";
import { useThreadStore } from "@/stores/threadStore";
import { EmptyState } from "../ui/EmptyState";
import { ReadingPaneIllustration } from "../ui/illustrations";

export function ReadingPane() {
  const { threads, selectedThreadId } = useThreadStore();
  const selectedThread = threads.find((t) => t.id === selectedThreadId);

  if (!selectedThread) {
    return (
      <div className="flex-1 flex flex-col bg-bg-primary/50 glass-panel">
        <EmptyState illustration={ReadingPaneIllustration} title="Velo" subtitle="Select an email to read" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-bg-primary/50 overflow-hidden glass-panel">
      <ThreadView thread={selectedThread} />
    </div>
  );
}
