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
      authorName: name.trim() || "Anonymous Reader",
      content: content.trim(),
    });

    setComments((prev) => [newCom, ...prev]);
    setName("");
    setContent("");
    setIsSubmitting(false);
    setSuccessMsg("Thank you! Your comment has been published.");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <section className="my-10 bg-revealed rounded-3xl border border-glow-line p-6 sm:p-7">
      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-glow-line">
        <MessageSquare className="w-5 h-5 text-signal-soft" />
        <h3 className="text-lg font-bold text-popcorn font-kannada">
          Reader Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-xs text-popcorn-muted font-kannada mb-1.5 font-medium">
            Your Name:
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name and city..."
              className="w-full bg-hall border border-glow-line rounded-xl px-4 py-2.5 text-sm text-popcorn placeholder-popcorn-muted focus:outline-none focus:border-signal transition-all font-kannada"
            />
            <User className="w-4 h-4 text-popcorn-muted absolute right-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-popcorn-muted font-kannada mb-1.5 font-medium">
            Your Comment:
          </label>
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts on this story here..."
            required
            className="w-full bg-hall border border-glow-line rounded-xl p-3.5 text-sm text-popcorn placeholder-popcorn-muted focus:outline-none focus:border-signal transition-all font-kannada resize-none"
          />
        </div>

        {successMsg && (
          <p className="text-xs change-positive font-kannada font-semibold">
            ✓ {successMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-signal-deep hover:bg-signal disabled:opacity-50 text-popcorn font-bold text-xs font-kannada flex items-center gap-1.5 transition-colors shadow-[0_0_20px_rgba(255,46,80,0.2)]"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? "Posting..." : "Post Comment"}</span>
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-xs text-popcorn-muted font-kannada text-center py-4">
            No comments yet. Be the first to share your take!
          </p>
        ) : (
          comments.map((com) => (
            <div
              key={com.id}
              className="p-4 rounded-2xl bg-hall border border-glow-line hover:border-glow-line-strong transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-popcorn font-kannada">
                  {com.authorName}
                </span>
                <span className="text-[11px] text-popcorn-muted font-kannada font-mono-tabular">
                  {formatEditorialTimeAgo(com.createdAt)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-popcorn-dim font-kannada leading-relaxed">
                {com.content}
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-popcorn-muted">
                <button className="flex items-center gap-1 hover:text-signal-soft transition-colors">
                  <Heart className="w-3 h-3" />
                  <span>{com.likes} Likes</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
