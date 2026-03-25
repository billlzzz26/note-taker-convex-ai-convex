"use client";

interface ToolCall {
  toolName: string;
  args: Record<string, unknown>;
  result: unknown;
}

interface NoteToolRenderersProps {
  toolCalls: ToolCall[];
}

export function NoteToolRenderers({ toolCalls }: NoteToolRenderersProps) {
  if (toolCalls.length === 0) return null;

  const getIcon = (toolName: string) => {
    switch (toolName) {
      case "save_note":
        return "💾";
      case "search_notes":
        return "🔍";
      case "list_notes":
        return "📋";
      case "get_notes_by_tag":
        return "🏷️";
      case "update_note":
        return "✏️";
      case "delete_note":
        return "🗑️";
      default:
        return "🔧";
    }
  };

  const getResultMessage = (toolName: string, result: unknown) => {
    const r = result as { message?: string; notes?: unknown[]; count?: number };
    return r.message || "Operation completed";
  };

  return (
    <div className="flex flex-col gap-2 my-2">
      {toolCalls.map((tc, index) => (
        <div
          key={index}
          className="bg-neutral-800 rounded-lg p-3 flex items-start gap-3"
        >
          <span className="text-lg">{getIcon(tc.toolName)}</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {tc.toolName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              {getResultMessage(tc.toolName, tc.result)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
