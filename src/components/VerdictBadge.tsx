import React from "react";
import { FilmsDiscourseVerdictLevel } from "@/types/boxOffice";
import { normalizeVerdictKey, getVerdictPresentation } from "@/lib/boxOfficeEngine/verdictEngine";

export { normalizeVerdictKey, getVerdictPresentation };

interface VerdictBadgeProps {
  verdict: FilmsDiscourseVerdictLevel | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function VerdictBadge({ verdict, size = "md", className = "" }: VerdictBadgeProps) {
  const { label, badgeClass, symbol } = getVerdictPresentation(verdict);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[9px] gap-1",
    md: "px-2.5 py-1 text-[11px] gap-1.5",
    lg: "px-3.5 py-1.5 text-xs gap-2",
  }[size];

  return (
    <span
      className={`inline-flex items-center uppercase tracking-wider font-mono-tabular transition-transform ${badgeClass} ${sizeClasses} ${className}`}
      title={`Theatrical Trade Verdict: ${label}`}
    >
      <span aria-hidden="true" className="shrink-0 text-[10px]">{symbol}</span>
      <span className="truncate">{label}</span>
    </span>
  );
}
