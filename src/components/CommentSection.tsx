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
    <section className="my-10 bg-sheet border border-line rounded-xl shadow-lg p-6 sm:p-8">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-line">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-surface border border-line rounded-lg flex items-center justify-center text-ink">
            <MessageSquare className="w-4 h-4 text-press" />
          </div>
          <h3 className="text-xl font-bold text-ink uppercase tracking-tight">
            Reader Wire Comments ({comments.length})
          </h3>
        </div>
        <span className="text-xs font-mono-tabular font-semibold text-ink-mute uppercase">
          Moderated Discussion
        </span>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-xs uppercase font-bold text-ink mb-1.5 tracking-wider">
            Your Name & City:
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Praveen Kumar, Bengaluru"
              className="w-full bg-surface border border-line rounded-lg px-4 py-2.5 text-sm text-ink placeholder-ink-mute/50 focus:outline-none focus:border-press/50 font-medium transition-colors"
            />
            <User className="w-4 h-4 text-ink-mute absolute right-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase font-bold text-ink mb-1.5 tracking-wider">
            Your Take:
          </label>
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your review or reaction to this story..."
            required
            className="w-full bg-surface border border-line rounded-lg p-3.5 text-sm text-ink placeholder-ink-mute/50 focus:outline-none focus:border-press/50 font-normal transition-colors resize-none"
          />
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-2">
            <span>✓</span>
            <span>{successMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-press hover:bg-press/90 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? "Publishing..." : "Post Comment"}</span>
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="p-6 bg-surface/30 border border-dashed border-line rounded-xl text-center">
            <p className="text-sm text-ink-mute font-medium uppercase tracking-wider">
              No reader comments yet. Be the first to share your critique!
            </p>
          </div>
        ) : (
          comments.map((com) => (
            <div
              key={com.id}
              className="p-4 bg-surface/60 border border-line rounded-xl space-y-2 hover:border-line/80 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-line/40 pb-2">
                <span className="text-sm font-bold text-ink uppercase tracking-tight">
                  {com.authorName}
                </span>
                <span className="text-[11px] text-ink-mute font-mono-tabular">
                  {formatEditorialTimeAgo(com.createdAt)}
                </span>
              </div>
              <p className="text-sm text-ink leading-relaxed font-normal">
                {com.content}
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs text-ink-mute">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-surface border border-line rounded-md hover:text-press transition-colors"
                >
                  <Heart className="w-3 h-3 text-press" />
                  <span className="font-mono-tabular font-medium">{com.likes} Likes</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
