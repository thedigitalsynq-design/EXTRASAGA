"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Heart, Send, User } from "lucide-react";
import { Comment } from "@/types";
import { DataService } from "@/lib/dataService";
import { formatKannadaTimeAgo } from "@/lib/utils";

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
      authorName: name.trim() || "ಅನಾಮಧೇಯ ಓದುಗರು",
      content: content.trim(),
    });

    setComments((prev) => [newCom, ...prev]);
    setName("");
    setContent("");
    setIsSubmitting(false);
    setSuccessMsg("ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಅನಿಸಿಕೆ ಪ್ರಕಟವಾಗಿದೆ.");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <section className="my-10 bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-200">
        <MessageSquare className="w-5 h-5 text-brand-crimson" />
        <h3 className="text-lg font-bold text-gray-950 font-kannada">
          ಓದುಗರ ಅನಿಸಿಕೆಗಳು ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-xs text-gray-600 font-kannada mb-1.5 font-medium">
            ನಿಮ್ಮ ಹೆಸರು (Name):
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ಊರು ನಮೂದಿಸಿ..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-crimson focus:bg-white transition-all font-kannada shadow-2xs"
            />
            <User className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600 font-kannada mb-1.5 font-medium">
            ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ / ಕಾಮೆಂಟ್ (Comment):
          </label>
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="ಈ ಸುದ್ದಿಯ ಬಗ್ಗೆ ನಿಮ್ಮ ಅನಿಸಿಕೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ..."
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-crimson focus:bg-white transition-all font-kannada resize-none shadow-2xs"
          />
        </div>

        {successMsg && (
          <p className="text-xs text-emerald-700 font-kannada font-semibold">
            ✓ {successMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-[#8e1d27] disabled:opacity-50 text-white font-bold text-xs font-kannada flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? "ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ..." : "ಕಾಮೆಂಟ್ ಪೋಸ್ಟ್ ಮಾಡಿ"}</span>
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-xs text-gray-500 font-kannada text-center py-4">
            ಇನ್ನೂ ಯಾವುದೇ ಕಾಮೆಂಟ್‌ಗಳಿಲ್ಲ. ನೀವೇ ಮೊದಲಿಗರಾಗಿ ಅಭಿಪ್ರಾಯ ಹಂಚಿಕೊಳ್ಳಿ!
          </p>
        ) : (
          comments.map((com) => (
            <div
              key={com.id}
              className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-950 font-kannada">
                  {com.authorName}
                </span>
                <span className="text-[11px] text-gray-500 font-kannada">
                  {formatKannadaTimeAgo(com.createdAt)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-kannada leading-relaxed">
                {com.content}
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-500">
                <button className="flex items-center gap-1 hover:text-brand-crimson transition-colors">
                  <Heart className="w-3 h-3" />
                  <span>{com.likes} ಲೈಕ್ಸ್</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

