"use client";

interface Thread {
  id: string;
  title: string;
}

interface ThreadSidebarProps {
  threads: Thread[];
  activeThreadId: string | null;
  onSelectThread: (id: string) => void;
  onNewThread: () => void;
}

export function ThreadSidebar({ threads, activeThreadId, onSelectThread, onNewThread }: ThreadSidebarProps) {
  return (
    <div className="w-56 bg-neutral-900 border-r border-neutral-800 flex flex-col h-full">
      <div className="p-3 border-b border-neutral-800">
        <button
          onClick={onNewThread}
          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {threads.length === 0 ? (
          <p className="text-neutral-500 text-sm p-2">No conversations yet</p>
        ) : (
          <ul className="space-y-1">
            {threads.map((thread) => (
              <li key={thread.id}>
                <button
                  onClick={() => onSelectThread(thread.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeThreadId === thread.id
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <span className="truncate block">{thread.title}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
