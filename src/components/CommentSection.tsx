"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Heart, Send, User } from "lucide-react";
import { Comment } from "@/types";
import { DataService } from "@/lib/dataService";
import { formatEditorialTimeAgo } from "@/lib/utils";

interface CommentSectionProps {
  articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    DataService.getComments(articleId).then(setComments);
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const newCom = await DataService.addComment({
      articleId,
      authorName: name.trim() || "Anonymous Cinephile",
      content: content.trim(),
    });

    setComments((prev) => [newCom, ...prev]);
    setName("");
    setContent("");
    setIsSubmitting(false);
    setSuccessMsg("Thank you! Your comment has been published to the reader wire.");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <section className="my-10 bg-sheet border-2 border-ink shadow-press p-6 sm:p-8">
      <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-ink">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-band border-2 border-ink flex items-center justify-center text-ink shadow-sticker">
            <MessageSquare className="w-4 h-4 text-poster-red" />
          </div>
          <h3 className="text-xl font-black text-ink uppercase tracking-tight">
            Reader Wire Comments ({comments.length})
          </h3>
        </div>
        <span className="text-xs font-mono-tabular font-bold text-ink-muted uppercase">
          Moderated Discussion
        </span>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-xs uppercase font-black text-ink mb-1.5 tracking-wider">
            Your Name & City:
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Praveen Kumar, Bengaluru"
              className="w-full bg-paper border-2 border-ink px-4 py-2.5 text-sm text-ink placeholder-ink-muted/60 focus:outline-none focus:bg-band shadow-sticker font-bold transition-colors"
            />
            <User className="w-4 h-4 text-ink-muted absolute right-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase font-black text-ink mb-1.5 tracking-wider">
            Your Take:
          </label>
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your review or reaction to this story..."
            required
            className="w-full bg-paper border-2 border-ink p-3.5 text-sm text-ink placeholder-ink-muted/60 focus:outline-none focus:bg-band shadow-sticker font-medium transition-colors resize-none"
          />
        </div>

        {successMsg && (
          <div className="p-2.5 bg-[#4ADE80]/20 border-2 border-ink text-xs text-ink font-bold shadow-sticker flex items-center gap-2">
            <span>✓</span>
            <span>{successMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-poster-red hover:bg-ink text-paper font-black text-xs uppercase tracking-wider border-2 border-ink shadow-sticker flex items-center gap-2 transition-all btn-press-interactive disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? "Publishing..." : "Post Comment"}</span>
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="p-6 bg-paper border-2 border-dashed border-ink/40 text-center">
            <p className="text-sm text-ink-muted font-bold uppercase tracking-wider">
              No reader comments yet. Be the first to share your critique!
            </p>
          </div>
        ) : (
          comments.map((com) => (
            <div
              key={com.id}
              className="p-4 bg-paper border-2 border-ink shadow-sticker space-y-2 card-press-interactive"
            >
              <div className="flex items-center justify-between border-b border-ink/20 pb-1.5">
                <span className="text-sm font-black text-ink uppercase tracking-tight">
                  {com.authorName}
                </span>
                <span className="text-[11px] text-ink-muted font-mono-tabular font-bold">
                  {formatEditorialTimeAgo(com.createdAt)}
                </span>
              </div>
              <p className="text-sm text-ink leading-relaxed font-medium">
                {com.content}
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs text-ink-muted font-bold">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-2 py-0.5 bg-band border border-ink shadow-sticker hover:text-poster-red transition-colors"
                >
                  <Heart className="w-3 h-3 text-poster-red" />
                  <span className="font-mono-tabular">{com.likes} Likes</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
