"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  FileText,
  Star,
  Film,
  Camera,
  MessageSquare,
  Settings,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Search,
  Save,
  X,
  UploadCloud,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Article, MovieReview, CategorySlug } from "@/types";
import { CATEGORIES } from "@/data/mockData";
import { DataService } from "@/lib/dataService";
import { formatKannadaDate, formatKannadaNumber, slugify } from "@/lib/utils";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("admin@sinikannada.com");
  const [loginPassword, setLoginPassword] = useState("admin123");
  const [authError, setAuthError] = useState("");

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    "articles" | "reviews" | "ads" | "analytics" | "comments" | "settings"
  >("articles");

  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [reviews, setReviews] = useState<MovieReview[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);

  // Review Modal State
  const [isReviewEditorOpen, setIsReviewEditorOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Partial<MovieReview> | null>(null);

  // Notification
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    // Check local session
    const logged = sessionStorage.getItem("sini_admin_auth");
    if (logged === "true") {
      setIsAuthenticated(true);
    }
    loadData();
  }, []);

  const loadData = async () => {
    const arts = await DataService.getArticles();
    const revs = await DataService.getReviews();
    setArticles(arts);
    setReviews(revs);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === "admin@sinikannada.com" && loginPassword === "admin123") {
      sessionStorage.setItem("sini_admin_auth", "true");
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("ತಪ್ಪಾದ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್. (ಡೆಮೊ: admin@sinikannada.com / admin123)");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("sini_admin_auth");
    setIsAuthenticated(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Article Actions
  const handleOpenNewArticle = () => {
    setEditingArticle({
      title: "",
      titleEn: "",
      slug: "",
      summary: "",
      content: "",
      category: "sandalwood",
      categoryName: "ಸ್ಯಾಂಡಲ್ವುಡ್",
      tags: ["ಸ್ಯಾಂಡಲ್ವುಡ್"],
      featuredImage:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
      imageCaption: "",
      readTimeMinutes: 3,
      isBreaking: false,
      isTopStory: false,
      isTrending: false,
      isFeatured: false,
      status: "published",
    });
    setIsEditorOpen(true);
  };

  const handleEditArticle = (art: Article) => {
    setEditingArticle({ ...art });
    setIsEditorOpen(true);
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm("ನೀವು ಖಚಿತವಾಗಿ ಈ ಲೇಖನವನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?")) {
      await DataService.deleteArticle(id);
      await loadData();
      showToast("ಲೇಖನವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ!");
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title) return;

    const slug = editingArticle.slug || slugify(editingArticle.title);
    const cat = CATEGORIES.find((c) => c.slug === editingArticle.category);

    await DataService.saveArticle({
      ...editingArticle,
      slug,
      categoryName: cat?.name || "ಸ್ಯಾಂಡಲ್ವುಡ್",
    });

    setIsEditorOpen(false);
    setEditingArticle(null);
    await loadData();
    showToast("ಲೇಖನ ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಕಟವಾಗಿದೆ / ನವೀಕರಿಸಲಾಗಿದೆ!");
  };

  // Filtered articles
  const filteredArticles = articles.filter((a) => {
    if (!searchTerm) return true;
    return (
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate totals
  const totalViews = articles.reduce((acc, a) => acc + (a.views || 0), 0);
  const totalArticles = articles.length;
  const breakingCount = articles.filter((a) => a.isBreaking).length;

  // Render Login Form if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-brand-dark p-8 rounded-2xl border border-brand-border shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-brand-red mx-auto flex items-center justify-center text-white shadow-lg shadow-brand-red/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white font-kannada">
              ಸಿನಿ ಕನ್ನಡ - ಅಡ್ಮಿನ್ ಲಾಗಿನ್
            </h1>
            <p className="text-xs text-brand-muted font-kannada">
              ಲೇಖನಗಳು, ವಿಮರ್ಶೆಗಳು, ಜಾಹೀರಾತುಗಳು ಮತ್ತು ಸೆಟ್ಟಿಂಗ್ಸ್ ನಿರ್ವಹಣಾ ಫಲಕ
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-brand-red/20 border border-brand-red/40 text-brand-red text-xs font-kannada flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 font-sans mb-1">
                ಇಮೇಲ್ (Admin Email)
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full bg-brand-card border border-brand-border rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-red font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 font-sans mb-1">
                ಪಾಸ್‌ವರ್ಡ್ (Password)
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full bg-brand-card border border-brand-border rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-red font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-sm font-kannada transition-colors shadow-lg shadow-brand-red/20"
            >
              ಪ್ರವೇಶಿಸಿ (Sign In to Dashboard)
            </button>
          </form>

          <div className="p-3 bg-brand-card rounded-lg border border-brand-border/60 text-[11px] text-brand-muted space-y-1">
            <span className="font-semibold text-gray-300 block">ಡೆಮೊ ಪ್ರವೇಶ ವಿವರ:</span>
            <div>ಇಮೇಲ್: <code className="text-brand-yellow">admin@sinikannada.com</code></div>
            <div>ಪಾಸ್‌ವರ್ಡ್: <code className="text-brand-yellow">admin123</code></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0F0F11]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-kannada text-sm animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-brand-dark border-b border-brand-border px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-red flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white font-kannada">
                  ಸಿನಿ ಕನ್ನಡ - ಸಂಪಾದಕೀಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್
                </h1>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-sans">
                  PROD ACTIVE
                </span>
              </div>
              <p className="text-xs text-brand-muted font-kannada">
                ಸುದ್ದಿ ಪ್ರಕಟಣೆ, ವಿಮರ್ಶೆ, ಜಾಹೀರಾತು ಮತ್ತು ಓದುಗರ ಅನಿಸಿಕೆಗಳ ನಿರ್ವಹಣೆ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-brand-card hover:bg-brand-red text-gray-300 hover:text-white text-xs font-kannada flex items-center gap-1.5 border border-brand-border transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>ಲೈವ್ ವೆಬ್‌ಸೈಟ್ ನೋಡಿ</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-brand-card hover:bg-brand-red text-brand-muted hover:text-white transition-colors"
              title="ಲಾಗ್‌ಔಟ್"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Analytics Highlights Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-brand-dark border border-brand-border">
            <span className="text-[11px] text-brand-muted font-kannada block">ಒಟ್ಟು ಲೇಖನಗಳು</span>
            <div className="text-2xl font-black text-white font-sans mt-1">{totalArticles}</div>
            <span className="text-[10px] text-emerald-400 font-sans">✓ ಎಲ್ಲಾ ಪ್ರಕಟಿತ</span>
          </div>

          <div className="p-4 rounded-xl bg-brand-dark border border-brand-border">
            <span className="text-[11px] text-brand-muted font-kannada block">ಒಟ್ಟು ವೀಕ್ಷಣೆಗಳು</span>
            <div className="text-2xl font-black text-brand-yellow font-sans mt-1">
              {formatKannadaNumber(totalViews)}
            </div>
            <span className="text-[10px] text-brand-muted font-sans">+18% ಈ ವಾರ</span>
          </div>

          <div className="p-4 rounded-xl bg-brand-dark border border-brand-border">
            <span className="text-[11px] text-brand-muted font-kannada block">ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್</span>
            <div className="text-2xl font-black text-brand-red font-sans mt-1">{breakingCount}</div>
            <span className="text-[10px] text-brand-red font-sans">ಲೈವ್ ಟಿಕ್ಕರ್‌ನಲ್ಲಿ</span>
          </div>

          <div className="p-4 rounded-xl bg-brand-dark border border-brand-border">
            <span className="text-[11px] text-brand-muted font-kannada block">ಸಿನಿಮಾ ವಿಮರ್ಶೆಗಳು</span>
            <div className="text-2xl font-black text-emerald-400 font-sans mt-1">{reviews.length}</div>
            <span className="text-[10px] text-emerald-400 font-sans">ಸ್ಟಾರ್ ರೇಟಿಂಗ್ಸ್</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-brand-border pb-3 mb-6 overflow-x-auto no-scrollbar font-kannada">
          {[
            { id: "articles", label: "ಸುದ್ದಿ ಲೇಖನಗಳು (Articles)", icon: FileText },
            { id: "reviews", label: "ಸಿನಿಮಾ ವಿಮರ್ಶೆ (Reviews)", icon: Star },
            { id: "ads", label: "ಜಾಹೀರಾತುಗಳು (Ads)", icon: DollarSign },
            { id: "comments", label: "ಕಾಮೆಂಟ್ಸ್ (Comments)", icon: MessageSquare },
            { id: "settings", label: "SEO & ಸೆಟ್ಟಿಂಗ್ಸ್", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-brand-red text-white"
                    : "text-gray-400 hover:text-white hover:bg-brand-dark"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ARTICLES MANAGEMENT */}
        {activeTab === "articles" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="ಲೇಖನ ಹುಡುಕಿ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-brand-card border border-brand-border rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-brand-muted focus:outline-none focus:border-brand-red font-kannada"
                />
                <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-2.5" />
              </div>

              <button
                onClick={handleOpenNewArticle}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs font-kannada flex items-center justify-center gap-2 transition-colors shadow-lg shadow-brand-red/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>ಹೊಸ ಸುದ್ದಿ ಲೇಖನ ಬರೆಯಿರಿ</span>
              </button>
            </div>

            {/* Articles Table */}
            <div className="bg-brand-dark rounded-xl border border-brand-border overflow-hidden">
              <table className="w-full text-left border-collapse font-kannada">
                <thead>
                  <tr className="bg-brand-card text-brand-muted text-[11px] uppercase tracking-wider border-b border-brand-border">
                    <th className="py-3 px-4">ಚಿತ್ರ</th>
                    <th className="py-3 px-4">ಶೀರ್ಷಿಕೆ (Headline)</th>
                    <th className="py-3 px-4">ವಿಭಾಗ</th>
                    <th className="py-3 px-4">ವೀಕ್ಷಣೆ</th>
                    <th className="py-3 px-4">ಸ್ಥಿತಿ</th>
                    <th className="py-3 px-4 text-right">ಕ್ರಿಯೆಗಳು</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60 text-xs">
                  {filteredArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-brand-card/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="relative w-12 h-9 rounded overflow-hidden">
                          <Image
                            src={art.featuredImage}
                            alt={art.title}
                            fill
                            className="object-cover"
                            sizes="50px"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-white max-w-sm">
                        <div className="truncate">{art.title}</div>
                        <div className="text-[10px] text-brand-muted font-sans font-normal truncate">
                          /{art.slug}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-brand-card text-gray-300 font-medium">
                          {art.categoryName}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-gray-300">
                        {formatKannadaNumber(art.views)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {art.isBreaking && (
                            <span className="px-1.5 py-0.5 rounded bg-brand-red text-white text-[9px] font-bold">
                              ಬ್ರೇಕಿಂಗ್
                            </span>
                          )}
                          {art.isTopStory && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black text-[9px] font-bold">
                              ಟಾಪ್
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            ಪ್ರಕಟಿತ
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/news/${art.slug}`}
                            target="_blank"
                            className="p-1.5 rounded hover:bg-brand-card text-brand-muted hover:text-white transition-colors"
                            title="ನೋಡಿ"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleEditArticle(art)}
                            className="p-1.5 rounded hover:bg-brand-card text-sky-400 hover:text-sky-300 transition-colors"
                            title="ತಿದ್ದುಪಡಿ"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-1.5 rounded hover:bg-brand-card text-brand-red hover:text-red-400 transition-colors"
                            title="ಅಳಿಸಿ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MOVIE REVIEWS */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-kannada">
                ಸಿನಿಮಾ ವಿಮರ್ಶೆಗಳ ನಿರ್ವಹಣೆ ({reviews.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-brand-dark border border-brand-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-kannada text-sm">
                      {rev.movieTitle}
                    </span>
                    <span className="text-xs font-bold text-brand-yellow font-sans">
                      ★ {rev.rating.toFixed(1)}/5
                    </span>
                  </div>
                  <p className="text-xs text-brand-muted font-kannada line-clamp-2">
                    {rev.summary}
                  </p>
                  <div className="text-[11px] text-gray-300 font-kannada">
                    ನಿರ್ದೇಶನ: <strong>{rev.director}</strong>
                  </div>
                  <div className="pt-2 border-t border-brand-border flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-bold font-kannada">
                      {rev.verdict}
                    </span>
                    <Link
                      href={`/reviews/${rev.slug}`}
                      target="_blank"
                      className="text-xs text-brand-red hover:underline font-kannada font-bold"
                    >
                      ವಿಮರ್ಶೆ ವೀಕ್ಷಿಸಿ
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ADS MANAGEMENT */}
        {activeTab === "ads" && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white font-kannada">
              ಜಾಹೀರಾತು ಸ್ಥಳಗಳ ನಿರ್ವಹಣೆ (Ad Placements)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: "head",
                  placement: "ಹೆಡರ್ ಲೀಡರ್‌ಬೋರ್ಡ್ (728x90)",
                  status: "ಸಕ್ರಿಯವಾಗಿದೆ (Active)",
                  target: "ಮುಖಪುಟದ ಪ್ರಮುಖ ಹೆಡರ್",
                },
                {
                  id: "side",
                  placement: "ಸೈಡ್‌ಬಾರ್ ರೆಕ್ಟ್ಯಾಂಗಲ್ (300x250)",
                  status: "ಸಕ್ರಿಯವಾಗಿದೆ (Active)",
                  target: "ಎಲ್ಲಾ ಸುದ್ದಿ ಪುಟಗಳು ಮತ್ತು ಮುಖಪುಟ",
                },
                {
                  id: "in",
                  placement: "ಇನ್-ಆರ್ಟಿಕಲ್ ಬ್ಯಾನರ್",
                  status: "ಸಕ್ರಿಯವಾಗಿದೆ (Active)",
                  target: "ಸುದ್ದಿ ಲೇಖನದ ಮಧ್ಯಭಾಗದಲ್ಲಿ",
                },
                {
                  id: "foot",
                  placement: "ಫೂಟರ್ ಬ್ಯಾನರ್",
                  status: "ಸಕ್ರಿಯವಾಗಿದೆ (Active)",
                  target: "ಪುಟದ ಕೊನೆಯಲ್ಲಿ",
                },
              ].map((ad) => (
                <div
                  key={ad.id}
                  className="p-5 rounded-xl bg-brand-dark border border-brand-border space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white font-kannada text-sm">
                      {ad.placement}
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      {ad.status}
                    </span>
                  </div>
                  <p className="text-xs text-brand-muted font-kannada">{ad.target}</p>
                  <div className="pt-2 flex items-center gap-2">
                    <button className="px-3 py-1 rounded bg-brand-card hover:bg-brand-red text-white text-xs font-kannada transition-colors">
                      ಜಾಹೀರಾತು ಕೋಡ್ ಬದಲಿಸಿ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: COMMENTS MODERATION */}
        {activeTab === "comments" && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white font-kannada">
              ಓದುಗರ ಕಾಮೆಂಟ್‌ಗಳ ಸಮಗ್ರ ಪರಿಶೀಲನೆ
            </h3>
            <div className="p-6 rounded-xl bg-brand-dark border border-brand-border text-center space-y-2">
              <p className="text-xs sm:text-sm text-gray-300 font-kannada">
                ಎಲ್ಲಾ ಸಾರ್ವಜನಿಕ ಕಾಮೆಂಟ್‌ಗಳು ಸ್ವಯಂ ಅನುಮೋದನೆ ಪಡೆದು ಲೈವ್ ಆಗಿವೆ. ದುರುದ್ದೇಶಪೂರಿತ ಅಥವಾ ಅಶ್ಲೀಲ ಪದಗಳನ್ನು ಆಟೋಮ್ಯಾಟಿಕ್ ಫಿಲ್ಟರ್ ಮಾಡಲಾಗುತ್ತದೆ.
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-2xl bg-brand-dark p-6 rounded-xl border border-brand-border">
            <h3 className="text-base font-bold text-white font-kannada">
              ವೆಬ್‌ಸೈಟ್ & SEO ಸೆಟ್ಟಿಂಗ್ಸ್
            </h3>
            <div className="space-y-4 text-xs font-kannada">
              <div>
                <label className="block text-brand-muted mb-1 font-semibold">
                  ಪೋರ್ಟಲ್ ಶೀರ್ಷಿಕೆ (Site Title):
                </label>
                <input
                  type="text"
                  defaultValue="ಸಿನಿ ಕನ್ನಡ - ಕರ್ನಾಟಕದ ನಂ.1 ಸಿನಿಮಾ ಮತ್ತು ಮನರಂಜನಾ ಪೋರ್ಟಲ್"
                  className="w-full bg-brand-card border border-brand-border rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-brand-muted mb-1 font-semibold">
                  ಮೆಟಾ ವಿವರಣೆ (Meta Description):
                </label>
                <textarea
                  rows={3}
                  defaultValue="ಸ್ಯಾಂಡಲ್ವುಡ್ ಇತ್ತೀಚಿನ ಸುದ್ದಿ, ಸಿನಿಮಾ ವಿಮರ್ಶೆ, ಬಾಕ್ಸ್ ಆಫೀಸ್, ಒಟಿಟಿ ಅಪ್ಡೇಟ್ಸ್ ಮತ್ತು ಫೋಟೋ ಗ್ಯಾಲರಿ."
                  className="w-full bg-brand-card border border-brand-border rounded-lg p-2.5 text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-brand-muted mb-1 font-semibold">
                  Google AdSense Publisher ID:
                </label>
                <input
                  type="text"
                  defaultValue="pub-984218392109312"
                  className="w-full bg-brand-card border border-brand-border rounded-lg p-2.5 text-white font-sans"
                />
              </div>

              <button
                onClick={() => showToast("ಸೆಟ್ಟಿಂಗ್ಸ್ ಉಳಿಸಲಾಗಿದೆ!")}
                className="px-5 py-2.5 rounded-lg bg-brand-red text-white font-bold transition-colors"
              >
                ಸೆಟ್ಟಿಂಗ್ಸ್ ಉಳಿಸಿ (Save Settings)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ARTICLE CREATE / EDIT MODAL */}
      {isEditorOpen && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-brand-dark rounded-2xl border border-brand-border shadow-2xl p-6 my-8 font-kannada">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-5">
              <h2 className="text-lg font-bold text-white">
                {editingArticle.id ? "ಸುದ್ದಿ ಲೇಖನ ತಿದ್ದುಪಡಿ (Edit)" : "ಹೊಸ ಸುದ್ದಿ ಲೇಖನ ರಚನೆ (Create)"}
              </h2>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-lg bg-brand-card text-brand-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-gray-200 mb-1">
                  ಕನ್ನಡ ಶೀರ್ಷಿಕೆ (Headline) *
                </label>
                <input
                  type="text"
                  value={editingArticle.title || ""}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="ಉದಾ: ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಹೊಸ ಅಪ್ಡೇಟ್..."
                  required
                  className="w-full bg-brand-card border border-brand-border rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-red font-kannada"
                />
              </div>

              {/* English Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-muted mb-1 font-sans">
                    English Title (SEO)
                  </label>
                  <input
                    type="text"
                    value={editingArticle.titleEn || ""}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, titleEn: e.target.value })
                    }
                    placeholder="Kantara Chapter 1 update..."
                    className="w-full bg-brand-card border border-brand-border rounded-lg p-2.5 text-white font-sans"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brand-muted mb-1 font-sans">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingArticle.slug || ""}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, slug: slugify(e.target.value) })
                    }
                    placeholder="kantara-chapter-1-update"
                    className="w-full bg-brand-card border border-brand-border rounded-lg p-2.5 text-white font-sans"
                  />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-muted mb-1">ವಿಭಾಗ (Category)</label>
                  <select
                    value={editingArticle.category || "sandalwood"}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        category: e.target.value as CategorySlug,
                      })
                    }
                    className="w-full bg-brand-card border border-brand-border rounded-lg p-2.5 text-white font-kannada"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name} ({cat.englishName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-muted mb-1">ಸ್ಥಿತಿ (Status)</label>
                  <select
                    value={editingArticle.status || "published"}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full bg-brand-card border border-brand-border rounded-lg p-2.5 text-white"
                  >
                    <option value="published">ಈಗಲೇ ಪ್ರಕಟಿಸಿ (Publish Now)</option>
                    <option value="draft">ಡ್ರಾಫ್ಟ್ (Draft)</option>
                    <option value="scheduled">ಶೆಡ್ಯೂಲ್ (Schedule)</option>
                  </select>
                </div>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block font-semibold text-brand-muted mb-1">
                  ಮುಖ್ಯ ಚಿತ್ರದ URL (Featured Image URL)
                </label>
                <input
                  type="url"
                  value={editingArticle.featuredImage || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, featuredImage: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-brand-card border border-brand-border rounded-lg p-2.5 text-white font-sans"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block font-semibold text-brand-muted mb-1">
                  ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ (Summary / Excerpt) *
                </label>
                <textarea
                  rows={2}
                  value={editingArticle.summary || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, summary: e.target.value })
                  }
                  placeholder="ಸುದ್ದಿಯ ಪ್ರಮುಖ ಸಾರಾಂಶವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ..."
                  required
                  className="w-full bg-brand-card border border-brand-border rounded-lg p-2.5 text-white font-kannada resize-none"
                />
              </div>

              {/* Rich Content */}
              <div>
                <label className="block font-semibold text-brand-muted mb-1">
                  ಸಂಪೂರ್ಣ ಕನ್ನಡ ಲೇಖನ (Full Rich Article) *
                </label>
                <textarea
                  rows={8}
                  value={editingArticle.content || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, content: e.target.value })
                  }
                  placeholder="ಪೂರ್ಣ ವಿವರಗಳು, ಉಪಶೀರ್ಷಿಕೆಗಳಿಗೆ ### ಬಳಸಿ, ದಪ್ಪ ಅಕ್ಷರಗಳಿಗೆ **ಬಳಸಿ**..."
                  required
                  className="w-full bg-brand-card border border-brand-border rounded-lg p-3 text-white font-kannada resize-y"
                />
              </div>

              {/* Checkboxes: Breaking, Top Story, Trending */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArticle.isBreaking)}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, isBreaking: e.target.checked })
                    }
                    className="w-4 h-4 text-brand-red rounded border-brand-border bg-brand-card"
                  />
                  <span className="text-white font-bold">ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್ (Breaking News)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArticle.isTopStory)}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, isTopStory: e.target.checked })
                    }
                    className="w-4 h-4 text-amber-500 rounded border-brand-border bg-brand-card"
                  />
                  <span className="text-white font-bold">ಟಾಪ್ ಸ್ಟೋರಿ (Top Story)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArticle.isTrending)}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, isTrending: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-500 rounded border-brand-border bg-brand-card"
                  />
                  <span className="text-white font-bold">ಟ್ರೆಂಡಿಂಗ್ (Trending)</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-lg bg-brand-card hover:bg-brand-border text-gray-300 font-bold transition-colors"
                >
                  ರದ್ದುಮಾಡಿ (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-brand-red hover:bg-brand-crimson text-white font-bold transition-colors shadow-lg shadow-brand-red/20 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>ಪ್ರಕಟಿಸಿ (Publish Article)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

