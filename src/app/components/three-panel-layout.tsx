"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Panel = "sidebar" | "main" | "right";

interface ThreePanelLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
  right: ReactNode;
  defaultPanel?: Panel;
}

const PANELS: Panel[] = ["sidebar", "main", "right"];
const PANEL_LABELS: Record<Panel, string> = {
  sidebar: "Notes",
  main: "Editor",
  right: "Chat",
};

export function ThreePanelLayout({
  sidebar,
  main,
  right,
  defaultPanel = "main",
}: ThreePanelLayoutProps) {
  const [active, setActive] = useState<Panel>(defaultPanel);

  return (
    <div className="flex h-full flex-col bg-neutral-950">
      {/* Panel content */}
      <div className="flex-1 overflow-hidden">
        {/* Mobile: show active panel only */}
        <div className="flex h-full lg:hidden">
          {active === "sidebar" && (
            <div className="w-full h-full overflow-y-auto">{sidebar}</div>
          )}
          {active === "main" && (
            <div className="w-full h-full overflow-y-auto">{main}</div>
          )}
          {active === "right" && (
            <div className="w-full h-full overflow-y-auto">{right}</div>
          )}
        </div>

        {/* Desktop: show all 3 panels */}
        <div className="hidden lg:flex h-full">
          <div className="w-72 shrink-0 h-full overflow-y-auto border-r border-neutral-800">
            {sidebar}
          </div>
          <div className="flex-1 min-w-0 h-full overflow-y-auto">{main}</div>
          <div className="w-80 shrink-0 h-full overflow-y-auto border-l border-neutral-800">
            {right}
          </div>
        </div>
      </div>

      {/* Bottom tab bar */}
      <nav className="flex border-t border-neutral-800 bg-neutral-900 lg:hidden">
        {PANELS.map((panel) => (
          <button
            key={panel}
            onClick={() => setActive(panel)}
            className={cn(
              "flex-1 py-3 text-xs font-medium transition-colors min-h-[48px]",
              active === panel
                ? "text-[color:var(--accent-teal)]"
                : "text-neutral-400"
            )}
          >
            {PANEL_LABELS[panel]}
          </button>
        ))}
      </nav>
    </div>
  );
}
