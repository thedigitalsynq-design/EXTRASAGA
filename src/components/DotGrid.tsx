import React from "react";

interface DotGridProps {
  className?: string;
  rows?: number;
  cols?: number;
}

export default function DotGrid({
  className = "",
  rows = 4,
  cols = 4,
}: DotGridProps) {
  return (
    <div
      aria-hidden="true"
      className={`grid gap-1.5 pointer-events-none select-none opacity-20 ${className}`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <span key={i} className="w-1 h-1 rounded-full bg-ink inline-block" />
      ))}
    </div>
  );
}

