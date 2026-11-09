"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Mail, Sparkles } from "lucide-react";

export default function SpotlightNewsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <section
      aria-label="Stay in the Spotlight Newsletter"
      className="w-full my-8 rounded-[32px] bg-[#F0E6DC] border-2 border-ink shadow-press p-8 sm:p-12 relative overflow-hidden"
    >
      {/* Decorative Winding Arrow and Ambient Backdrop Circles */}
      <div aria-hidden="true" className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#FFE57F]/40 blur-lg pointer-events-none" />
      <div aria-hidden="true" className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#FFAAA6]/30 blur-lg pointer-events-none" />

      {/* SVG Connecting Organic Line */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block opacity-25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 60,80 Q 220,20 380,90 T 700,50 Q 880,100 1050,40"
          stroke="#17140F"
          strokeWidth="1.75"
          strokeDasharray="4 4"
        />
      </svg>

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        {/* Handwritten Hook Annotation */}
        <div className="flex items-center justify-center">
          <span className="font-handwritten text-xl sm:text-2xl text-ink font-semibold flex items-center gap-1.5 select-none transform -rotate-1">
            Let&apos;s keep the conversation going!
            <span className="text-press text-xl font-bold">⤹</span>
          </span>
        </div>

        {/* Elegant Serif Accent Headline with Hand-Drawn Wavy Underline */}
        <div className="space-y-2">
          <h3 className="text-3xl sm:text-5xl lg:text-6xl font-poster uppercase text-ink tracking-tight leading-tight">
            Stay in the{" "}
            <span className="relative inline-block font-serif-accent italic font-normal text-ink">
              Spotlight.
              {/* Hand-drawn underline SVG */}
              <svg
                aria-hidden="true"
                className="absolute -bottom-2 left-0 w-full h-3 text-press pointer-events-none"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 2,7 Q 50,1 100,6 T 198,7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h3>

          <p className="text-sm sm:text-base text-ink-dim font-grotesk font-medium max-w-xl mx-auto leading-relaxed pt-2">
            Get our morning dispatch: audited box office receipts, unspun critical verdicts, and inside dispatches across all six Indian filmmaking traditions. Delivered daily at 8:00 AM IST.
          </p>
        </div>

        {/* Sleek Input Field with High-Contrast Black Pill Button */}
        {isSubmitted ? (
          <div className="p-4 rounded-full bg-paper border-2 border-ink shadow-press inline-flex items-center gap-2.5 text-ink font-poster text-sm font-bold uppercase tracking-wider animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>You&apos;re On The VIP Press Pass · Welcome To EXTRA-SAAGA</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto"
          >
            <div className="relative w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dim" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-11 pr-5 py-3.5 rounded-full bg-paper border-2 border-ink text-sm text-ink placeholder:text-ink-dim/60 font-grotesk font-medium shadow-sticker focus:outline-none focus:ring-2 focus:ring-ink"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-ink text-paper text-sm font-poster uppercase font-bold tracking-wider hover:bg-press transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-press shrink-0 flex items-center justify-center gap-2"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-ink-dim pt-2">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Zero Spam, Pure Cinema Receipts
          </span>
          <span>·</span>
          <span>Join 2,400,000+ Readers Across India</span>
          <span>·</span>
          <span>Unsubscribe Anytime</span>
        </div>
      </div>
    </section>
  );
}

