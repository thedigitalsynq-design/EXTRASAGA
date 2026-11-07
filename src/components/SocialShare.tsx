"use client";

import React, { useState } from "react";
import { Share2, MessageCircle, Send, Copy, Check } from "lucide-react";

interface SocialShareProps {
  title: string;
  url?: string;
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : url || "";
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(currentUrl);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-3.5 border-y border-glow-line my-6">
      <span className="text-xs font-bold text-popcorn-dim font-kannada flex items-center gap-1.5 mr-2">
        <Share2 className="w-4 h-4 text-signal-soft" />
        Share:
      </span>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-revealed hover:bg-[#4ADE80]/15 text-popcorn-dim hover:text-[#4ADE80] font-semibold text-xs transition-colors border border-glow-line hover:border-[#4ADE80]/40"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>WhatsApp</span>
      </a>

      {/* X (formerly Twitter) */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-revealed hover:bg-screen text-popcorn-dim hover:text-popcorn font-semibold text-xs transition-colors border border-glow-line hover:border-glow-line-strong"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>X</span>
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-revealed hover:bg-ultra/15 text-popcorn-dim hover:text-ultra-soft font-semibold text-xs transition-colors border border-glow-line hover:border-ultra/40"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span>Facebook</span>
      </a>

      {/* Telegram */}
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-revealed hover:bg-signal/15 text-popcorn-dim hover:text-signal-soft font-semibold text-xs transition-colors border border-glow-line hover:border-signal/40"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Telegram</span>
      </a>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-revealed hover:bg-signal-deep text-popcorn-dim hover:text-popcorn font-semibold text-xs transition-colors border border-glow-line hover:border-signal/40"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 change-positive" />
            <span className="font-kannada change-positive">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span className="font-kannada">Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
