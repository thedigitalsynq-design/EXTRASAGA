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
    <div className="flex flex-wrap items-center gap-2 py-3.5 px-4 bg-sheet border-2 border-ink shadow-sticker my-6">
      <span className="text-xs uppercase font-black text-ink flex items-center gap-1.5 mr-2 tracking-wider">
        <Share2 className="w-4 h-4 text-press" />
        Dispatch:
      </span>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-paper hover:bg-band text-ink font-bold text-xs uppercase tracking-wider transition-all border border-ink shadow-sticker btn-press-interactive"
      >
        <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
        <span>WhatsApp</span>
      </a>

      {/* X (formerly Twitter) */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-paper hover:bg-band text-ink font-bold text-xs uppercase tracking-wider transition-all border border-ink shadow-sticker btn-press-interactive"
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
        className="flex items-center gap-1.5 px-3 py-1.5 bg-paper hover:bg-band text-ink font-bold text-xs uppercase tracking-wider transition-all border border-ink shadow-sticker btn-press-interactive"
      >
        <svg className="w-3.5 h-3.5 fill-current text-[#1877F2]" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span>Facebook</span>
      </a>

      {/* Telegram */}
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-paper hover:bg-band text-ink font-bold text-xs uppercase tracking-wider transition-all border border-ink shadow-sticker btn-press-interactive"
      >
        <Send className="w-3.5 h-3.5 text-[#229ED9]" />
        <span>Telegram</span>
      </a>

      {/* Copy link */}
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-paper hover:bg-band text-ink font-bold text-xs uppercase tracking-wider transition-all border border-ink shadow-sticker btn-press-interactive"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-press" />
            <span className="text-press font-black">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
