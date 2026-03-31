"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { FileText, MessageSquare, ChevronDown } from "lucide-react";

interface MobileSwipeLayoutProps {
  notesPanel: ReactNode;
  editorPanel: ReactNode;
  rightPanel: ReactNode;
  rightPanelOptions?: { id: string; label: string; icon?: ReactNode }[];
  activeRightPanel?: string;
  onRightPanelChange?: (id: string) => void;
}

const PANELS = ["notes", "editor", "right"] as const;

export function MobileSwipeLayout({
  notesPanel,
  editorPanel,
  rightPanel,
  rightPanelOptions = [
    { id: "chat", label: "Chat", icon: <MessageSquare className="size-3.5" /> },
    { id: "outline", label: "Outline", icon: <FileText className="size-3.5" /> },
  ],
  activeRightPanel = "chat",
  onRightPanelChange,
}: MobileSwipeLayoutProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "x",
    skipSnaps: false,
    containScroll: "trimSnaps",
  });

  const [activeIndex, setActiveIndex] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const currentOption = rightPanelOptions.find((o) => o.id === activeRightPanel);

  return (
    <div className="flex h-full flex-col bg-neutral-950">
      {/* Panel label bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2">
        <div className="flex items-center gap-2">
          {PANELS.map((panel, index) => (
            <button
              key={panel}
              onClick={() => scrollTo(index)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors min-h-[36px]",
                activeIndex === index
                  ? "bg-[color:var(--accent-teal)]/15 text-[color:var(--accent-teal)]"
                  : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              {panel === "notes" && "Notes"}
              {panel === "editor" && "Editor"}
              {panel === "right" && (currentOption?.label ?? "Chat")}
            </button>
          ))}
        </div>

        {/* Right panel dropdown selector */}
        {activeIndex === 2 && rightPanelOptions.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 px-2 py-1 text-xs text-neutral-300 min-h-[36px]"
            >
              {currentOption?.icon}
              {currentOption?.label}
              <ChevronDown className="size-3" />
            </button>
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-xl border border-neutral-700 bg-neutral-800 py-1 shadow-xl">
                  {rightPanelOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        onRightPanelChange?.(option.id);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors",
                        activeRightPanel === option.id
                          ? "text-[color:var(--accent-teal)]"
                          : "text-neutral-300 hover:bg-neutral-700"
                      )}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Swipeable panels */}
      <div ref={emblaRef} className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Panel 0: Notes list */}
          <div className="min-w-0 shrink-0 grow-0 basis-full h-full overflow-y-auto">
            {notesPanel}
          </div>

          {/* Panel 1: Editor */}
          <div className="min-w-0 shrink-0 grow-0 basis-full h-full overflow-y-auto">
            {editorPanel}
          </div>

          {/* Panel 2: Right panel (Chat / Outline) */}
          <div className="min-w-0 shrink-0 grow-0 basis-full h-full overflow-y-auto">
            {rightPanel}
          </div>
        </div>
      </div>

      {/* Bottom indicator dots */}
      <div className="flex items-center justify-center gap-2 border-t border-neutral-800 py-3">
        {PANELS.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "size-2 rounded-full transition-all",
              activeIndex === index
                ? "w-6 bg-[color:var(--accent-teal)]"
                : "bg-neutral-600"
            )}
            aria-label={`Go to panel ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
