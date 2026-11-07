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
  Radio,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Globe,
  Clapperboard,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  Article,
  MovieReview,
  CategorySlug,
  Movie,
  AutomationLog,
  FilmIndustry,
  LanguageCode,
  MovieReleaseStatus,
  ReleaseDateConfidence,
} from "@/types";
import { CATEGORIES } from "@/data/mockData";
import { DataService } from "@/lib/dataService";
import { formatKannadaDate, formatKannadaNumber, slugify } from "@/lib/utils";
import { TRUSTED_NEWS_SOURCES, TrustedNewsSource } from "@/lib/ingest/trustedSources";

const ADMIN_EMAIL_ALIASES = [
  "admin@cinijaatre.com",
  "admin@sinikannada.com",
  "admin@filmygarage.com",
] as const;
const DEFAULT_ADMIN_EMAIL = ADMIN_EMAIL_ALIASES[0];
const LANGUAGE_TO_INDUSTRY: Record<LanguageCode, FilmIndustry> = {
  kn: "sandalwood",
  te: "tollywood",
  ta: "kollywood",
  ml: "mollywood",
  hi: "bollywood",
  en: "hollywood",
  bn: "bengali",
  pa: "punjabi",
  other: "regional",
};

const ADMIN_TABS = [
  { id: "articles", label: "ಮ್ಯಾನುಯಲ್ ಲೇಖನಗಳು (Manual)", icon: FileText },
  { id: "releases", label: "ಸಿನಿಮಾ ಬಿಡುಗಡೆಗಳು (Releases)", icon: Clapperboard },
  { id: "sources", label: "ಸುದ್ದಿ ಮೂಲಗಳು (Trusted Sources)", icon: Radio },
  { id: "imported", label: "ಆಟೋ ಆಮದು ಲೇಖನಗಳು (Imported)", icon: RefreshCw },
  { id: "reviews", label: "ಸಿನಿಮಾ ವಿಮರ್ಶೆ (Reviews)", icon: Star },
  { id: "ads", label: "ಜಾಹೀರಾತುಗಳು (Ads)", icon: DollarSign },
  { id: "comments", label: "ಕಾಮೆಂಟ್ಸ್ (Comments)", icon: MessageSquare },
  { id: "settings", label: "SEO & ಸೆಟ್ಟಿಂಗ್ಸ್", icon: Settings },
] as const;

type AdminTabId = (typeof ADMIN_TABS)[number]["id"];

const MOVIE_STATUS_OPTIONS = [
  { id: "all", label: "All Status" },
  { id: "in_theatres", label: "In Theatres" },
  { id: "upcoming", label: "Upcoming" },
  { id: "archived", label: "Archived" },
] as const;

type MovieStatusFilter = (typeof MOVIE_STATUS_OPTIONS)[number]["id"];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState<string>(DEFAULT_ADMIN_EMAIL);
  const [loginPassword, setLoginPassword] = useState("admin123");
  const [authError, setAuthError] = useState("");

  // Navigation tab
  const [activeTab, setActiveTab] = useState<AdminTabId>("articles");

  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [reviews, setReviews] = useState<MovieReview[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Movies & Cinema Releases state
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieSearch, setMovieSearch] = useState("");
  const [movieLangFilter, setMovieLangFilter] = useState("all");
  const [movieStatusFilter, setMovieStatusFilter] = useState<MovieStatusFilter>("all");
  const [isMovieEditorOpen, setIsMovieEditorOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Partial<Movie> | null>(null);
  const [isRolloverRunning, setIsRolloverRunning] = useState(false);
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>([]);

  // Trusted News Sources & Automation State
  const [sources, setSources] = useState<TrustedNewsSource[]>(TRUSTED_NEWS_SOURCES);
  const [isSyncing, setIsSyncing] = useState(false);
  const [sourceLangFilter, setSourceLangFilter] = useState("all");
  const [importedFilter, setImportedFilter] = useState<"all" | "pending" | "published">("all");

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);

  // Review Modal State
  const [isReviewEditorOpen, setIsReviewEditorOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Partial<MovieReview> | null>(null);

  // Notification
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    // Check server-side session first
    fetch("/api/admin/auth")
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          // Check local session fallback
          const logged =
            sessionStorage.getItem("filmygarage_admin_auth") ||
            sessionStorage.getItem("cinijaatre_admin_auth");
          if (logged === "true") {
            setIsAuthenticated(true);
          }
        }
      })
      .catch(() => {
        const logged =
          sessionStorage.getItem("filmygarage_admin_auth") ||
          sessionStorage.getItem("cinijaatre_admin_auth");
        if (logged === "true") {
          setIsAuthenticated(true);
        }
      });

    loadData();
  }, []);

  const loadData = async () => {
    const arts = await DataService.getArticles(undefined, undefined, true);
    const revs = await DataService.getReviews();
    const movs = await DataService.getMovies();
    const logs = await DataService.getAutomationLogs();
    setArticles(arts);
    setReviews(revs);
    setMovies(movs);
    setAutomationLogs(logs);
    loadSources();
  };

  // Movie Actions
  const handleOpenNewMovie = () => {
    setEditingMovie({
      title: "",
      titleEn: "",
      slug: "",
      synopsis: "",
      introduction: "",
      theatricalReleaseDate: new Date().toISOString().split("T")[0],
      releaseDateConfidence: "confirmed",
      language: "kn",
      industry: "sandalwood",
      genres: ["ಆಕ್ಷನ್", "ಡ್ರಾಮಾ"],
      director: "",
      producers: [""],
      cast: [{ name: "", role: "ನಾಯಕ" }],
      productionCompany: "",
      distributionCompany: "",
      posterImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      trailerYoutubeId: "",
      trailerUrl: "",
      isFeatured: false,
    });
    setIsMovieEditorOpen(true);
  };

  const handleEditMovie = (mov: Movie) => {
    setEditingMovie({ ...mov });
    setIsMovieEditorOpen(true);
  };

  const handleDeleteMovie = async (id: string) => {
    if (confirm("ನೀವು ಖಚಿತವಾಗಿ ಈ ಸಿನಿಮಾವನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?")) {
      await DataService.deleteMovie(id);
      const updated = await DataService.getMovies();
      setMovies(updated);
      showToast("ಸಿನಿಮಾವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ!");
    }
  };

  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovie?.title || !editingMovie?.theatricalReleaseDate) {
      alert("ದಯವಿಟ್ಟು ಶೀರ್ಷಿಕೆ ಮತ್ತು ಬಿಡುಗಡೆ ದಿನಾಂಕವನ್ನು ನಮೂದಿಸಿ");
      return;
    }
    const saved = await DataService.saveMovie(editingMovie);
    const updated = await DataService.getMovies();
    setMovies(updated);
    setIsMovieEditorOpen(false);
    showToast(`"${saved.title}" ಸಿನಿಮಾವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸೇವ್ ಮಾಡಲಾಗಿದೆ!`);
  };

  const handleRunDailyRollover = async () => {
    setIsRolloverRunning(true);
    try {
      const res = await fetch("/api/cron/daily-releases", { method: "POST" });
      const data = await res.json();
      const updated = await DataService.getMovies();
      setMovies(updated);
      const logs = await DataService.getAutomationLogs();
      setAutomationLogs(logs);
      showToast(
        data.message || `ರೋಲ್‌ಓವರ್ ಪೂರ್ಣಗೊಂಡಿದೆ! ${data.movedToTheatres || 0} ಸಿನಿಮಾ ಥಿಯೇಟರ್‌ಗೆ, ${data.movedToArchive || 0} ಆರ್ಕೈವ್‌ಗೆ ವರ್ಗಾವಣೆಗೊಂಡಿದೆ.`
      );
    } catch {
      const log = await DataService.runDailyCinemaRollover();
      const updated = await DataService.getMovies();
      setMovies(updated);
      const logs = await DataService.getAutomationLogs();
      setAutomationLogs(logs);
      showToast(`ರೋಲ್‌ಓವರ್ ಪೂರ್ಣಗೊಂಡಿದೆ! ${log.inTheatresCount} ಸಿನಿಮಾ ಚಿತ್ರಮಂದಿರಗಳಲ್ಲಿ, ${log.archivedCount} ಆರ್ಕೈವ್‌ನಲ್ಲಿ.`);
    } finally {
      setIsRolloverRunning(false);
    }
  };

  const handleApproveArticle = async (id: string) => {
    try {
      const res = await fetch("/api/articles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", id }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: "published" } : a))
        );
        showToast("ಲೇಖನ ಯಶಸ್ವಿಯಾಗಿ ಅನುಮೋದಿಸಲಾಗಿದೆ ಮತ್ತು ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಲೈವ್ ಆಗಿದೆ!");
        return;
      }
    } catch {
      // Fallback local
    }
    await DataService.approveArticle(id);
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "published" } : a))
    );
    showToast("ಲೇಖನ ಯಶಸ್ವಿಯಾಗಿ ಅನುಮೋದಿಸಲಾಗಿದೆ ಮತ್ತು ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಲೈವ್ ಆಗಿದೆ!");
  };

  const handleApproveAllPending = async () => {
    try {
      const res = await fetch("/api/articles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_all" }),
      });
      if (res.ok) {
        const data = await res.json();
        setArticles((prev) =>
          prev.map((a) => ({ ...a, status: "published" }))
        );
        showToast(`${data.count || "ಎಲ್ಲಾ"} ಬಾಕಿ ಲೇಖನಗಳನ್ನು ಅನುಮೋದಿಸಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ!`);
        return;
      }
    } catch {
      // Fallback local
    }
    const count = await DataService.approveAllPendingArticles();
    setArticles((prev) =>
      prev.map((a) => ({ ...a, status: "published" }))
    );
    showToast(`${count} ಬಾಕಿ ಲೇಖನಗಳನ್ನು ಅನುಮೋದಿಸಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ!`);
  };

  const loadSources = async () => {
    try {
      const res = await fetch("/api/ingest/sources");
      if (res.ok) {
        const data = await res.json();
        if (data.sources && data.sources.length > 0) {
          setSources(data.sources);
        }
      }
    } catch {
      // Fallback to static sources
    }
  };

  const handleToggleSource = async (sourceId: string, currentEnabled: boolean) => {
    try {
      const res = await fetch("/api/ingest/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle",
          sourceId,
          enabled: !currentEnabled,
        }),
      });
      if (res.ok) {
        setSources((prev) =>
          prev.map((s) => (s.id === sourceId ? { ...s, enabled: !currentEnabled } : s))
        );
        showToast(`ಮೂಲ ${sourceId} ${!currentEnabled ? "ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ" : "ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ"}`);
      }
    } catch {
      showToast("ಮೂಲ ಬದಲಾವಣೆ ವಿಫಲವಾಗಿದೆ");
    }
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/ingest/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        await loadData();
        showToast(`ಸಿಂಕ್ ಪೂರ್ಣಗೊಂಡಿದೆ! ${data.report?.articlesImported || 0} ಹೊಸ ನೈಜ ಲೇಖನಗಳು ಆಮದಾಗಿವೆ.`);
      } else {
        showToast("ಸಿಂಕ್ ಮಾಡುವಲ್ಲಿ ದೋಷ ಕಂಡುಬಂದಿದೆ");
      }
    } catch {
      showToast("ಸಿಂಕ್ ಪ್ರಕ್ರಿಯೆ ವಿಫಲವಾಗಿದೆ");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if (res.ok) {
        sessionStorage.setItem("cinijaatre_admin_auth", "true");
        sessionStorage.setItem("filmygarage_admin_auth", "true");
        setIsAuthenticated(true);
        setAuthError("");
        return;
      }

      const data = await res.json().catch(() => ({}));
      setAuthError(data.error || `ತಪ್ಪಾದ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್. (ಡೆಮೊ: ${DEFAULT_ADMIN_EMAIL} / admin123)`);
    } catch {
      // Offline fallback
      if (
        ADMIN_EMAIL_ALIASES.includes(loginEmail as (typeof ADMIN_EMAIL_ALIASES)[number]) &&
        loginPassword === "admin123"
      ) {
        sessionStorage.setItem("cinijaatre_admin_auth", "true");
        sessionStorage.setItem("filmygarage_admin_auth", "true");
        setIsAuthenticated(true);
        setAuthError("");
      } else {
        setAuthError(`ತಪ್ಪಾದ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್. (ಡೆಮೊ: ${DEFAULT_ADMIN_EMAIL} / admin123)`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch (e) {
      // ignore
    }
    sessionStorage.removeItem("filmygarage_admin_auth");
    sessionStorage.removeItem("cinijaatre_admin_auth");
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
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-gray-200/90 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-crimson mx-auto flex items-center justify-center text-white shadow-md shadow-brand-crimson/25">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-gray-950 font-sans tracking-tight">
              FILMY <span className="text-brand-crimson">GARAGE</span>
            </h1>
            <p className="text-xs text-gray-500 font-kannada">
              ಫಿಲ್ಮಿ ಗ್ಯಾರೇಜ್ - ಅಡ್ಮಿನ್ ಲಾಗಿನ್ (ಲೇಖನಗಳು, ವಿಮರ್ಶೆಗಳು, ಜಾಹೀರಾತುಗಳು ಮತ್ತು ಸೆಟ್ಟಿಂಗ್ಸ್ ನಿರ್ವಹಣಾ ಫಲಕ)
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-kannada flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 font-sans mb-1">
                ಇಮೇಲ್ (Admin Email)
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-900 focus:outline-none focus:border-brand-crimson focus:bg-white font-sans transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 font-sans mb-1">
                ಪಾಸ್‌ವರ್ಡ್ (Password)
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-900 focus:outline-none focus:border-brand-crimson focus:bg-white font-sans transition-all shadow-2xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-crimson hover:bg-[#8e1d27] text-white font-bold text-sm font-kannada transition-colors shadow-md"
            >
              ಪ್ರವೇಶಿಸಿ (Sign In to Dashboard)
            </button>
          </form>

          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-[11px] text-gray-600 space-y-1 shadow-2xs">
            <span className="font-semibold text-gray-900 block">ಡೆಮೊ ಪ್ರವೇಶ ವಿವರ:</span>
            <div>
              ಇಮೇಲ್: <code className="text-amber-800 font-bold">{DEFAULT_ADMIN_EMAIL}</code>
            </div>
            <div>ಪಾಸ್‌ವರ್ಡ್: <code className="text-amber-800 font-bold">admin123</code></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-kannada text-sm animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200/90 px-4 sm:px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-crimson flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-gray-950 font-sans tracking-tight">
                  FILMY <span className="text-brand-crimson">GARAGE</span> - ಸಂಪಾದಕೀಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-sans border border-emerald-200">
                  PROD ACTIVE
                </span>
              </div>
              <p className="text-xs text-gray-500 font-kannada">
                ಸುದ್ದಿ ಪ್ರಕಟಣೆ, ವಿಮರ್ಶೆ, ಜಾಹೀರಾತು ಮತ್ತು ಓದುಗರ ಅನಿಸಿಕೆಗಳ ನಿರ್ವಹಣೆ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-kannada flex items-center gap-1.5 border border-gray-200 transition-colors shadow-2xs font-semibold"
            >
              <Eye className="w-3.5 h-3.5 text-brand-crimson" />
              <span>ಲೈವ್ ವೆಬ್‌ಸೈಟ್ ನೋಡಿ</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-brand-crimson border border-gray-200 transition-colors"
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
          <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
            <span className="text-[11px] text-gray-500 font-kannada block font-medium">ಒಟ್ಟು ಲೇಖನಗಳು</span>
            <div className="text-2xl font-black text-gray-950 font-sans mt-1">{totalArticles}</div>
            <span className="text-[10px] text-emerald-700 font-sans font-bold">✓ ಎಲ್ಲಾ ಪ್ರಕಟಿತ</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
            <span className="text-[11px] text-gray-500 font-kannada block font-medium">ಒಟ್ಟು ವೀಕ್ಷಣೆಗಳು</span>
            <div className="text-2xl font-black text-amber-700 font-sans mt-1">
              {formatKannadaNumber(totalViews)}
            </div>
            <span className="text-[10px] text-gray-500 font-sans">+18% ಈ ವಾರ</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
            <span className="text-[11px] text-gray-500 font-kannada block font-medium">ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್</span>
            <div className="text-2xl font-black text-brand-crimson font-sans mt-1">{breakingCount}</div>
            <span className="text-[10px] text-brand-crimson font-sans font-bold">ಲೈವ್ ಟಿಕ್ಕರ್‌ನಲ್ಲಿ</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
            <span className="text-[11px] text-gray-500 font-kannada block font-medium">ಸಿನಿಮಾ ವಿಮರ್ಶೆಗಳು</span>
            <div className="text-2xl font-black text-emerald-700 font-sans mt-1">{reviews.length}</div>
            <span className="text-[10px] text-emerald-700 font-sans font-bold">ಸ್ಟಾರ್ ರೇಟಿಂಗ್ಸ್</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-6 overflow-x-auto no-scrollbar font-kannada">
          {ADMIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-brand-crimson text-white shadow-sm"
                    : "text-gray-700 hover:text-gray-950 hover:bg-gray-100"
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
                  className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-kannada shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
              </div>

              <button
                onClick={handleOpenNewArticle}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-[#8e1d27] text-white font-bold text-xs font-kannada flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-crimson/20 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>ಹೊಸ ಸುದ್ದಿ ಲೇಖನ ಬರೆಯಿರಿ</span>
              </button>
            </div>

            {/* Articles Table */}
            <div className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse font-kannada">
                <thead>
                  <tr className="bg-gray-50/80 text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-200 font-mono">
                    <th className="py-3.5 px-4 font-semibold">ಚಿತ್ರ</th>
                    <th className="py-3.5 px-4 font-semibold">ಶೀರ್ಷಿಕೆ (Headline)</th>
                    <th className="py-3.5 px-4 font-semibold">ವಿಭಾಗ</th>
                    <th className="py-3.5 px-4 font-semibold">ವೀಕ್ಷಣೆ</th>
                    <th className="py-3.5 px-4 font-semibold">ಸ್ಥಿತಿ</th>
                    <th className="py-3.5 px-4 text-right font-semibold">ಕ್ರಿಯೆಗಳು</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="relative w-12 h-9 rounded-lg overflow-hidden border border-gray-200 shadow-2xs">
                          <Image
                            src={art.featuredImage}
                            alt={art.title}
                            fill
                            className="object-cover"
                            sizes="50px"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-950 max-w-sm">
                        <div className="truncate">{art.title}</div>
                        <div className="text-[10px] text-gray-400 font-sans font-normal truncate">
                          /{art.slug}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium text-[11px] border border-gray-200">
                          {art.categoryName}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-gray-600 font-medium">
                        {formatKannadaNumber(art.views)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {art.isBreaking && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                              ಬ್ರೇಕಿಂಗ್
                            </span>
                          )}
                          {art.isTopStory && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                              ಟಾಪ್
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            ಪ್ರಕಟಿತ
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/news/${art.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-950 transition-colors border border-transparent hover:border-gray-200"
                            title="ನೋಡಿ"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleEditArticle(art)}
                            className="p-1.5 rounded-lg hover:bg-sky-50 text-sky-600 hover:text-sky-700 transition-colors border border-transparent hover:border-sky-200"
                            title="ತಿದ್ದುಪಡಿ"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors border border-transparent hover:border-rose-200"
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

        {/* TAB: CINEMA RELEASES & AUTOMATION (MASTER PROMPT REQUIREMENT 6) */}
        {activeTab === "releases" && (() => {
          const filteredMovies = movies.filter((m) => {
            const matchesSearch =
              !movieSearch ||
              m.title.toLowerCase().includes(movieSearch.toLowerCase()) ||
              m.titleEn.toLowerCase().includes(movieSearch.toLowerCase()) ||
              m.director.toLowerCase().includes(movieSearch.toLowerCase());
            const matchesLang = movieLangFilter === "all" || m.language === movieLangFilter;
            const matchesStatus = movieStatusFilter === "all" || m.releaseStatus === movieStatusFilter;
            return matchesSearch && matchesLang && matchesStatus;
          });

          const inTheatresCount = movies.filter((m) => m.releaseStatus === "in_theatres").length;
          const upcomingCount = movies.filter((m) => m.releaseStatus === "upcoming").length;
          const archivedCount = movies.filter((m) => m.releaseStatus === "archived").length;

          return (
            <div className="space-y-6 font-kannada">
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
                    <Clapperboard className="w-5 h-5 text-brand-crimson" />
                    <span>ಸಿನಿಮಾ ಬಿಡುಗಡೆಗಳು ಮತ್ತು ದೈನಂದಿನ ರೋಲ್‌ಓವರ್ (Cinema Releases Hub)</span>
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 font-sans">
                    Real-time date classification (Asia/Kolkata): Last 30 days In Theatres, Upcoming Radar, and Permanent Archive across 6 industries.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleRunDailyRollover}
                    disabled={isRolloverRunning}
                    className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold font-sans flex items-center gap-2 transition-all border border-gray-200 disabled:opacity-50"
                    title="Move movies whose confirmed release date has arrived to released, and archive older than 30 days"
                  >
                    <RefreshCw className={`w-4 h-4 text-emerald-600 ${isRolloverRunning ? "animate-spin" : ""}`} />
                    <span>{isRolloverRunning ? "ಚಲಾಯಿಸಲಾಗುತ್ತಿದೆ..." : "ದೈನಂದಿನ ರೋಲ್‌ಓವರ್ ಚಲಾಯಿಸಿ"}</span>
                  </button>
                  <button
                    onClick={handleOpenNewMovie}
                    className="px-4 py-2.5 rounded-xl bg-brand-crimson hover:bg-[#8e1d27] text-white text-xs font-bold font-sans flex items-center gap-2 transition-all shadow-md shadow-brand-crimson/20"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>ಹೊಸ ಸಿನಿಮಾ ಸೇರಿಸಿ (Add Movie)</span>
                  </button>
                </div>
              </div>

              {/* Status Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans">
                <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
                  <span className="text-[11px] text-gray-500 font-medium block">ಒಟ್ಟು ಸಿನಿಮಾಗಳು (Total)</span>
                  <div className="text-2xl font-black text-gray-950 mt-1">{movies.length}</div>
                  <span className="text-[10px] text-gray-500 font-kannada">6 ಭಾಷಾ ಚಿತ್ರರಂಗಗಳು</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 shadow-2xs">
                  <span className="text-[11px] text-emerald-700 font-bold block flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>ಚಿತ್ರಮಂದಿರಗಳಲ್ಲಿ (Last 30 Days)</span>
                  </span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">{inTheatresCount}</div>
                  <span className="text-[10px] text-emerald-600 font-kannada">ಕಳೆದ 30 ದಿನಗಳ ಬಿಡುಗಡೆ</span>
                </div>
                <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200/80 shadow-2xs">
                  <span className="text-[11px] text-sky-700 font-bold block flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>ಮುಂಬರುವ ಸಿನಿಮಾಗಳು (Upcoming)</span>
                  </span>
                  <div className="text-2xl font-black text-sky-700 mt-1">{upcomingCount}</div>
                  <span className="text-[10px] text-sky-600 font-kannada">ದಿನಾಂಕ ಲೆಕ್ಕಾಚಾರದಲ್ಲಿ</span>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 shadow-2xs">
                  <span className="text-[11px] text-gray-500 font-medium block">ಶಾಶ್ವತ ಆರ್ಕೈವ್ (Permanent Archive)</span>
                  <div className="text-2xl font-black text-gray-700 mt-1">{archivedCount}</div>
                  <span className="text-[10px] text-gray-500 font-kannada">30 ದಿನ ಮೀರಿದವು</span>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 text-xs">
                  {MOVIE_STATUS_OPTIONS.map((st) => ({
                    ...st,
                    label:
                      st.id === "all"
                        ? "All Status"
                        : st.id === "in_theatres"
                        ? `In Theatres (${inTheatresCount})`
                        : st.id === "upcoming"
                        ? `Upcoming (${upcomingCount})`
                        : `Archived (${archivedCount})`,
                  })).map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setMovieStatusFilter(st.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap text-xs border ${
                        movieStatusFilter === st.id
                          ? "bg-brand-crimson text-white border-brand-crimson shadow-2xs"
                          : "bg-white text-gray-600 hover:text-gray-950 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={movieLangFilter}
                    onChange={(e) => setMovieLangFilter(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-sans shadow-2xs"
                  >
                    <option value="all">ಎಲ್ಲಾ ಭಾಷೆಗಳು (All)</option>
                    <option value="kn">ಕನ್ನಡ (Sandalwood)</option>
                    <option value="te">ತೆಲುಗು (Tollywood)</option>
                    <option value="ta">ತಮಿಳು (Kollywood)</option>
                    <option value="ml">ಮಲಯಾಳಂ (Mollywood)</option>
                    <option value="hi">ಹಿಂದಿ (Bollywood)</option>
                    <option value="en">English (Hollywood)</option>
                  </select>

                  <div className="relative flex-1 sm:w-60">
                    <input
                      type="text"
                      placeholder="ಸಿನಿಮಾ ಹುಡುಕಿ..."
                      value={movieSearch}
                      onChange={(e) => setMovieSearch(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson shadow-2xs"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
                  </div>
                </div>
              </div>

              {/* Movies Table */}
              <div className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50/80 text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-200 font-mono">
                      <th className="py-3.5 px-4 font-semibold">ಪೋಸ್ಟರ್</th>
                      <th className="py-3.5 px-4 font-semibold">ಸಿನಿಮಾ ಹೆಸರು (Title)</th>
                      <th className="py-3.5 px-4 font-semibold">ಬಿಡುಗಡೆ ದಿನಾಂಕ (Release Date)</th>
                      <th className="py-3.5 px-4 font-semibold">ಚಿತ್ರರಂಗ</th>
                      <th className="py-3.5 px-4 font-semibold">ಸ್ಥಿತಿ (Status)</th>
                      <th className="py-3.5 px-4 font-semibold">ದಿನಾಂಕ ವಿಶ್ವಾಸ</th>
                      <th className="py-3.5 px-4 text-right font-semibold">ಕ್ರಮಗಳು (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredMovies.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-400">
                          ಯಾವುದೇ ಸಿನಿಮಾಗಳು ಕಂಡುಬಂದಿಲ್ಲ. &ldquo;ಹೊಸ ಸಿನಿಮಾ ಸೇರಿಸಿ&rdquo; ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.
                        </td>
                      </tr>
                    ) : (
                      filteredMovies.map((mov) => {
                        const statusColors: Record<string, string> = {
                          in_theatres: "bg-emerald-50 text-emerald-700 border-emerald-200",
                          upcoming: "bg-sky-50 text-sky-700 border-sky-200",
                          archived: "bg-gray-100 text-gray-600 border-gray-200",
                        };

                        const statusLabels: Record<string, string> = {
                          in_theatres: "ಪ್ರದರ್ಶನಗೊಳ್ಳುತ್ತಿದೆ",
                          upcoming: "ಮುಂಬರುವ ಬಿಡುಗಡೆ",
                          archived: "ಆರ್ಕೈವ್",
                        };

                        return (
                          <tr key={mov.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-3 px-4">
                              <div className="w-12 h-16 rounded-lg overflow-hidden relative bg-gray-100 shrink-0 border border-gray-200 shadow-2xs">
                                <Image
                                  src={mov.posterImage}
                                  alt={mov.title}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4 max-w-xs">
                              <div className="font-bold text-gray-950 text-sm line-clamp-1">{mov.title}</div>
                              <div className="text-[11px] text-gray-500 font-sans line-clamp-1">
                                {mov.titleEn} • {mov.director}
                              </div>
                              <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                                {mov.genres.join(", ")}
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap font-sans">
                              <div className="font-bold text-gray-900">{mov.theatricalReleaseDate}</div>
                              <div className="text-[10px] text-gray-500 font-kannada">
                                {formatKannadaDate(mov.theatricalReleaseDate)}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-800 font-bold uppercase font-sans border border-gray-200">
                                {mov.industry}
                              </span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  statusColors[mov.releaseStatus] || statusColors.upcoming
                                }`}
                              >
                                {statusLabels[mov.releaseStatus] || mov.releaseStatus}
                              </span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap font-sans">
                              {mov.releaseDateConfidence === "confirmed" ? (
                                <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Confirmed</span>
                                </span>
                              ) : (
                                <span className="text-amber-700 font-bold text-[11px] flex items-center gap-1">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Tentative</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5 font-sans">
                                <Link
                                  href={`/movies/${mov.slug}`}
                                  target="_blank"
                                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-950 transition-colors"
                                  title="View movie release article"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                  onClick={() => handleEditMovie(mov)}
                                  className="p-1.5 rounded-lg hover:bg-sky-50 text-sky-600 hover:text-sky-700 transition-colors"
                                  title="Edit movie details"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMovie(mov.id)}
                                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors"
                                  title="Delete movie"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Automation Telemetry Logs */}
              {automationLogs.length > 0 && (
                <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
                  <h4 className="text-sm font-bold text-gray-950 flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>ದೈನಂದಿನ ಆಟೋಮೇಷನ್ ಲಾಗ್‌ಗಳು (Recent Automation Runs)</span>
                  </h4>
                  <div className="space-y-2 text-xs font-mono">
                    {automationLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              log.status === "success" ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          ></span>
                          <span className="text-gray-900 font-bold uppercase">{log.action}</span>
                          <span className="text-gray-500 truncate">{log.details}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 shrink-0">
                          {new Date(log.timestamp).toLocaleString("en-IN", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* TAB: SOURCES MANAGEMENT (Requirement 8) */}
        {activeTab === "sources" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-950 font-sans flex items-center gap-2">
                  <Radio className="w-5 h-5 text-brand-crimson animate-pulse" />
                  <span>Trusted Regional Cinema News Sources</span>
                </h3>
                <p className="text-xs text-gray-600 mt-1 font-sans">
                  Official RSS syndication feeds across Telugu, Tamil, Malayalam, Hindi, English, and Kannada.
                </p>
              </div>
              <button
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-[#8e1d27] text-white text-xs font-bold font-sans flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-crimson/20 shrink-0 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Syncing Feeds..." : "Sync All Feeds Now"}</span>
              </button>
            </div>

            {/* Language filter for sources */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-sans">
              {[
                { id: "all", label: "All Sources" },
                { id: "te", label: "Telugu (Tollywood)" },
                { id: "ta", label: "Tamil (Kollywood)" },
                { id: "ml", label: "Malayalam (Mollywood)" },
                { id: "hi", label: "Hindi (Bollywood)" },
                { id: "en", label: "English (Hollywood)" },
                { id: "kn", label: "Kannada (Sandalwood)" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSourceLangFilter(pill.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap text-xs border ${
                    sourceLangFilter === pill.id
                      ? "bg-brand-crimson text-white border-brand-crimson shadow-2xs"
                      : "bg-white text-gray-600 hover:text-gray-950 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Source Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sources
                .filter((s) => sourceLangFilter === "all" || s.language === sourceLangFilter)
                .map((src) => (
                  <div
                    key={src.id}
                    className="p-5 rounded-2xl bg-white border border-gray-200/90 hover:border-gray-300 flex flex-col justify-between space-y-4 shadow-2xs transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-black text-gray-950 font-sans truncate">
                          {src.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Trust: {src.trustScore}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-sans line-clamp-2">
                        {src.description}
                      </p>
                      <div className="mt-2.5 flex items-center gap-2 text-[10px] text-gray-500 font-sans">
                        <span className="uppercase font-bold text-amber-700">{src.industry}</span>
                        <span>•</span>
                        <a
                          href={src.homepage}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-gray-950 flex items-center gap-1 underline text-gray-600"
                        >
                          <span>Visit Site</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] font-sans text-gray-500">
                        Status:{" "}
                        <strong className={src.enabled ? "text-emerald-700 font-bold" : "text-gray-400"}>
                          {src.enabled ? "Active / Auto-Sync" : "Disabled"}
                        </strong>
                      </span>
                      <button
                        onClick={() => handleToggleSource(src.id, src.enabled)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold font-sans transition-all border ${
                          src.enabled
                            ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {src.enabled ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB: IMPORTED ARTICLES STREAM & ADMIN APPROVAL (Requirement 8) */}
        {activeTab === "imported" && (() => {
          const importedArticles = articles.filter((a) => a.isScraped || a.source?.url);
          const pendingArticles = importedArticles.filter((a) => a.status === "pending");
          const approvedArticles = importedArticles.filter((a) => a.status === "published" || !a.status);

          const displayedArticles =
            importedFilter === "pending"
              ? pendingArticles
              : importedFilter === "published"
              ? approvedArticles
              : importedArticles;

          return (
            <div className="space-y-6">
              {/* Header & Stats Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-950 font-sans flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-emerald-600" />
                    <span>ಆಟೋ ಆಮದು ಲೇಖನಗಳು & ಸಂಪಾದಕೀಯ ಅನುಮೋದನೆ (Admin Approval Hub)</span>
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 font-sans">
                    ನೈಜ ಸುದ್ದಿ ಪೋರ್ಟಲ್‌ಗಳಿಂದ ಆಟೋ-ಆಮದಾದ ಲೇಖನಗಳ ಪರಿಶೀಲನೆ, ಅನುಮೋದನೆ ಮತ್ತು ಲೈವ್ ಪ್ರಕಟಣೆ.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-sans font-bold border border-gray-200">
                    ಒಟ್ಟು: {importedArticles.length}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-sans font-bold border border-amber-200">
                    ಬಾಕಿ: {pendingArticles.length}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-sans font-bold border border-emerald-200">
                    ಲೈವ್: {approvedArticles.length}
                  </span>
                </div>
              </div>

              {/* Moderation Controls & Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-200/90 shadow-2xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setImportedFilter("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      importedFilter === "all"
                        ? "bg-brand-crimson text-white border-brand-crimson shadow-2xs"
                        : "bg-white text-gray-600 hover:text-gray-950 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    ಎಲ್ಲಾ ಆಮದು ({importedArticles.length})
                  </button>
                  <button
                    onClick={() => setImportedFilter("pending")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      importedFilter === "pending"
                        ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                        : "bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200"
                    }`}
                  >
                    <span>⏳ ಅನುಮೋದನೆ ಬಾಕಿ ({pendingArticles.length})</span>
                  </button>
                  <button
                    onClick={() => setImportedFilter("published")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      importedFilter === "published"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                        : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200"
                    }`}
                  >
                    ✓ ಲೈವ್ ಪ್ರಕಟಿತ ({approvedArticles.length})
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {pendingArticles.length > 0 && (
                    <button
                      onClick={handleApproveAllPending}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>ಎಲ್ಲಾ ಬಾಕಿ ಅನುಮೋದಿಸಿ ({pendingArticles.length})</span>
                    </button>
                  )}
                  <button
                    onClick={handleSyncNow}
                    disabled={isSyncing}
                    className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center gap-1.5 border border-gray-200 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-brand-crimson" : ""}`} />
                    <span>{isSyncing ? "ಸಿಂಕ್ ಆಗುತ್ತಿದೆ..." : "ಫೀಡ್ ಸಿಂಕ್"}</span>
                  </button>
                </div>
              </div>

              {/* Articles Approval Table */}
              <div className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="bg-gray-50/80 text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-200 font-mono">
                      <th className="py-3.5 px-4 font-semibold">Headline & Summary</th>
                      <th className="py-3.5 px-4 font-semibold">Original Publisher</th>
                      <th className="py-3.5 px-4 font-semibold">Industry</th>
                      <th className="py-3.5 px-4 font-semibold">Date</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 text-right font-semibold">Approval Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {displayedArticles.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400 font-sans text-xs">
                          ಯಾವುದೇ ಲೇಖನಗಳು ಕಂಡುಬಂದಿಲ್ಲ. &quot;ಫೀಡ್ ಸಿಂಕ್&quot; ಕ್ಲಿಕ್ ಮಾಡಿ ಹೊಸ ಲೇಖನಗಳನ್ನು ಆಮದು ಮಾಡಿಕೊಳ್ಳಿ.
                        </td>
                      </tr>
                    ) : (
                      displayedArticles.slice(0, 40).map((art) => {
                        const isPending = art.status === "pending";
                        return (
                          <tr key={art.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-3 px-4 font-bold text-gray-950 max-w-md">
                              <div className="line-clamp-1">{art.title}</div>
                              <div className="text-[10px] text-gray-500 font-normal line-clamp-1 mt-0.5">
                                {art.summary}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200 text-[11px]">
                                  {art.source?.name || art.author.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 uppercase font-bold text-gray-500 text-[11px]">
                              {art.industry || "cinema"}
                            </td>
                            <td className="py-3 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                              {new Date(art.publishedAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              {isPending ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                  ಅನುಮೋದನೆ ಬಾಕಿ
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                  ಲೈವ್ ಆಗಿದೆ
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {isPending && (
                                  <button
                                    onClick={() => handleApproveArticle(art.id)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-all active:scale-95"
                                    title="Approve & Publish Live"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>ಅನುಮೋದಿಸಿ</span>
                                  </button>
                                )}
                                {art.source?.url && (
                                  <a
                                    href={art.source.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-950 transition-colors border border-gray-200"
                                    title="ಮೂಲ ಲೇಖನ ಲಿಂಕ್ (Original Canonical Source)"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {!isPending && (
                                  <Link
                                    href={`/news/${art.slug}`}
                                    target="_blank"
                                    className="p-1.5 rounded-lg hover:bg-sky-50 text-sky-600 hover:text-sky-700 transition-colors border border-transparent hover:border-sky-200"
                                    title="ಸೈಟ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </Link>
                                )}
                                <button
                                  onClick={() => handleDeleteArticle(art.id)}
                                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors border border-transparent hover:border-rose-200"
                                  title="ತಿರಸ್ಕರಿಸಿ / ಅಳಿಸಿ"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

        {/* TAB 2: MOVIE REVIEWS */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-950 font-kannada">
                ಸಿನಿಮಾ ವಿಮರ್ಶೆಗಳ ನಿರ್ವಹಣೆ ({reviews.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-white border border-gray-200/90 space-y-3 shadow-2xs hover:shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-950 font-kannada text-sm">
                      {rev.movieTitle}
                    </span>
                    <span className="text-xs font-bold text-amber-700 font-sans">
                      ★ {rev.rating.toFixed(1)}/5
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-kannada line-clamp-2">
                    {rev.summary}
                  </p>
                  <div className="text-[11px] text-gray-500 font-kannada">
                    ನಿರ್ದೇಶನ: <strong className="text-gray-900">{rev.director}</strong>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-700 font-bold font-kannada bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {rev.verdict}
                    </span>
                    <Link
                      href={`/reviews/${rev.slug}`}
                      target="_blank"
                      className="text-xs text-brand-crimson hover:underline font-kannada font-bold"
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
            <h3 className="text-base font-bold text-gray-950 font-kannada">
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
                  className="p-5 rounded-2xl bg-white border border-gray-200/90 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-950 font-kannada text-sm">
                      {ad.placement}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      {ad.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-kannada">{ad.target}</p>
                  <div className="pt-2 flex items-center gap-2">
                    <button className="px-3 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-kannada transition-colors border border-gray-200">
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
            <h3 className="text-base font-bold text-gray-950 font-kannada">
              ಓದುಗರ ಕಾಮೆಂಟ್‌ಗಳ ಸಮಗ್ರ ಪರಿಶೀಲನೆ
            </h3>
            <div className="p-6 rounded-2xl bg-white border border-gray-200/90 text-center space-y-2 shadow-2xs">
              <p className="text-xs sm:text-sm text-gray-600 font-kannada">
                ಎಲ್ಲಾ ಸಾರ್ವಜನಿಕ ಕಾಮೆಂಟ್‌ಗಳು ಸ್ವಯಂ ಅನುಮೋದನೆ ಪಡೆದು ಲೈವ್ ಆಗಿವೆ. ದುರುದ್ದೇಶಪೂರಿತ ಅಥವಾ ಅಶ್ಲೀಲ ಪದಗಳನ್ನು ಆಟೋಮ್ಯಾಟಿಕ್ ಫಿಲ್ಟರ್ ಮಾಡಲಾಗುತ್ತದೆ.
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-2xl bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/90 shadow-2xs">
            <h3 className="text-base font-bold text-gray-950 font-kannada">
              ವೆಬ್‌ಸೈಟ್ & SEO ಸೆಟ್ಟಿಂಗ್ಸ್
            </h3>
            <div className="space-y-4 text-xs font-kannada">
              <div>
                <label className="block text-gray-600 mb-1 font-semibold">
                  ಪೋರ್ಟಲ್ ಶೀರ್ಷಿಕೆ (Site Title):
                </label>
                <input
                  type="text"
                  defaultValue="CINI JAATRE - ಪ್ರೀಮಿಯಂ ಬಹುಭಾಷಾ ಸಿನಿಮಾ ಜರ್ನಲಿಸಂ"
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-semibold">
                  ಮೆಟಾ ವಿವರಣೆ (Meta Description):
                </label>
                <textarea
                  rows={3}
                  defaultValue="ಸ್ಯಾಂಡಲ್ವುಡ್ ಇತ್ತೀಚಿನ ಸುದ್ದಿ, ಸಿನಿಮಾ ವಿಮರ್ಶೆ, ಬಾಕ್ಸ್ ಆಫೀಸ್, ಒಟಿಟಿ ಅಪ್ಡೇಟ್ಸ್ ಮತ್ತು ಫೋಟೋ ಗ್ಯಾಲರಿ."
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-gray-950 resize-none focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-semibold">
                  Google AdSense Publisher ID:
                </label>
                <input
                  type="text"
                  defaultValue="pub-984218392109312"
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-gray-950 font-sans focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                />
              </div>

              <button
                onClick={() => showToast("ಸೆಟ್ಟಿಂಗ್ಸ್ ಉಳಿಸಲಾಗಿದೆ!")}
                className="px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-[#8e1d27] text-white font-bold transition-all shadow-md shadow-brand-crimson/20 active:scale-95"
              >
                ಸೆಟ್ಟಿಂಗ್ಸ್ ಉಳಿಸಿ (Save Settings)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MOVIE CREATE / EDIT MODAL */}
      {isMovieEditorOpen && editingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-gray-200/90 shadow-2xl p-6 sm:p-8 my-8 font-kannada text-gray-950">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-brand-crimson" />
                <span>{editingMovie.id ? "ಸಿನಿಮಾ ವಿವರ ತಿದ್ದುಪಡಿ (Edit Movie)" : "ಹೊಸ ಸಿನಿಮಾ ಸೇರಿಸಿ (Add New Movie)"}</span>
              </h2>
              <button
                onClick={() => setIsMovieEditorOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-950 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title (Regional / Kannada) */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1 font-kannada">
                    ಸಿನಿಮಾ ಹೆಸರು (Title - Native Script) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMovie.title || ""}
                    onChange={(e) => setEditingMovie({ ...editingMovie, title: e.target.value })}
                    placeholder="ಉದಾ: ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-kannada"
                  />
                </div>

                {/* Title (English) */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    English Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMovie.titleEn || ""}
                    onChange={(e) => {
                      const titleEn = e.target.value;
                      setEditingMovie({
                        ...editingMovie,
                        titleEn,
                        slug: editingMovie.slug || slugify(titleEn),
                      });
                    }}
                    placeholder="e.g. Kantara Chapter 1"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Theatrical Release Date */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Theatrical Release Date (YYYY-MM-DD) *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingMovie.theatricalReleaseDate || ""}
                    onChange={(e) =>
                      setEditingMovie({ ...editingMovie, theatricalReleaseDate: e.target.value })
                    }
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  />
                </div>

                {/* Confidence */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Release Date Confidence
                  </label>
                  <select
                    value={editingMovie.releaseDateConfidence || "confirmed"}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      if (nextValue === "confirmed" || nextValue === "tentative") {
                        setEditingMovie({
                          ...editingMovie,
                          releaseDateConfidence: nextValue,
                        });
                      }
                    }}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  >
                    <option value="confirmed">ಖಚಿತ ದಿನಾಂಕ (Confirmed)</option>
                    <option value="tentative">ತಾತ್ಕಾಲಿಕ ದಿನಾಂಕ (Tentative)</option>
                  </select>
                </div>

                {/* Language / Industry */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Language & Industry
                  </label>
                  <select
                    value={editingMovie.language || "kn"}
                    onChange={(e) => {
                      const value = e.target.value;
                      const validLanguages = ["kn", "te", "ta", "ml", "hi", "en"] as const;

                      if (validLanguages.includes(value as (typeof validLanguages)[number])) {
                        const lang = value as (typeof validLanguages)[number];
                        setEditingMovie({
                          ...editingMovie,
                          language: lang,
                          industry: LANGUAGE_TO_INDUSTRY[lang],
                        });
                      }
                    }}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  >
                    <option value="kn">ಕನ್ನಡ (Sandalwood)</option>
                    <option value="te">తెలుగు (Tollywood)</option>
                    <option value="ta">தமிழ் (Kollywood)</option>
                    <option value="ml">മലയാളം (Mollywood)</option>
                    <option value="hi">हिन्दी (Bollywood)</option>
                    <option value="en">English (Hollywood)</option>
                  </select>
                </div>
              </div>

              {/* Director & Cast */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 font-kannada">
                    ನಿರ್ದೇಶಕರು (Director)
                  </label>
                  <input
                    type="text"
                    value={editingMovie.director || ""}
                    onChange={(e) => setEditingMovie({ ...editingMovie, director: e.target.value })}
                    placeholder="ಉದಾ: ರಿಷಬ್ ಶೆಟ್ಟಿ"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-kannada"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1 font-kannada">
                    ಪ್ರಮುಖ ತಾರಾಗಣ (Main Cast - Comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingMovie.cast?.map((c) => c.name).join(", ") || ""}
                    onChange={(e) => {
                      const names = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                      setEditingMovie({
                        ...editingMovie,
                        cast: names.map((name) => ({ name, role: "ಮುಖ್ಯ ಪಾತ್ರ" })),
                      });
                    }}
                    placeholder="ಉದಾ: ರಿಷಬ್ ಶೆಟ್ಟಿ, ರುಕ್ಮಿಣಿ ವಸಂತ್, ಜಯರಾಮ್"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-kannada"
                  />
                </div>
              </div>

              {/* Genres & Production */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 font-kannada">
                    ಜಾನರ್ (Genres - Comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingMovie.genres?.join(", ") || ""}
                    onChange={(e) =>
                      setEditingMovie({
                        ...editingMovie,
                        genres: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="ಉದಾ: ಆಕ್ಷನ್, ಮೈಥಾಲಾಜಿಕಲ್ ಥ್ರಿಲ್ಲರ್, ಡ್ರಾಮಾ"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-kannada"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1 font-kannada">
                    ನಿರ್ಮಾಣ ಸಂಸ್ಥೆ (Production House)
                  </label>
                  <input
                    type="text"
                    value={editingMovie.productionCompany || ""}
                    onChange={(e) =>
                      setEditingMovie({ ...editingMovie, productionCompany: e.target.value })
                    }
                    placeholder="ಉದಾ: ಹೊಂಬಾಳೆ ಫಿಲ್ಮ್ಸ್"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-kannada"
                  />
                </div>
              </div>

              {/* Poster Image URL & Trailer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Official Poster Image URL
                  </label>
                  <input
                    type="url"
                    value={editingMovie.posterImage || ""}
                    onChange={(e) =>
                      setEditingMovie({ ...editingMovie, posterImage: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    YouTube Trailer ID / URL
                  </label>
                  <input
                    type="text"
                    value={editingMovie.trailerYoutubeId || editingMovie.trailerUrl || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const ytMatch = val.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                      const trailerYoutubeId = ytMatch ? ytMatch[1] : val;
                      setEditingMovie({
                        ...editingMovie,
                        trailerYoutubeId,
                        trailerUrl: val.startsWith("http") ? val : `https://www.youtube.com/watch?v=${val}`,
                      });
                    }}
                    placeholder="e.g. dQw4w9WgXcQ or full YouTube link"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  />
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <label className="block font-bold text-gray-700 mb-1 font-kannada">
                  ಸಿನಿಮಾ ಕಥಾಸಾರಾಂಶ (Synopsis & Overview)
                </label>
                <textarea
                  rows={4}
                  value={editingMovie.synopsis || ""}
                  onChange={(e) => setEditingMovie({ ...editingMovie, synopsis: e.target.value })}
                  placeholder="ಸಿನಿಮಾದ ವಿವರವಾದ ಕಥಾಸಾರಾಂಶ, ತಾಂತ್ರಿಕ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-kannada"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 font-kannada">
                <button
                  type="button"
                  onClick={() => setIsMovieEditorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors border border-gray-200"
                >
                  ರದ್ದುಮಾಡಿ (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-crimson hover:bg-[#8e1d27] text-white font-bold transition-all shadow-md shadow-brand-crimson/20 flex items-center gap-1.5 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>ಸಿನಿಮಾ ಸೇವ್ ಮಾಡಿ (Save Movie)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARTICLE CREATE / EDIT MODAL */}
      {isEditorOpen && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-gray-200/90 shadow-2xl p-6 sm:p-8 my-8 font-kannada text-gray-950">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-gray-950">
                {editingArticle.id ? "ಸುದ್ದಿ ಲೇಖನ ತಿದ್ದುಪಡಿ (Edit)" : "ಹೊಸ ಸುದ್ದಿ ಲೇಖನ ರಚನೆ (Create)"}
              </h2>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-950 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  ಕನ್ನಡ ಶೀರ್ಷಿಕೆ (Headline) *
                </label>
                <input
                  type="text"
                  value={editingArticle.title || ""}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="ಉದಾ: ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಹೊಸ ಅಪ್ಡೇಟ್..."
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-kannada"
                />
              </div>

              {/* English Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1 font-sans">
                    English Title (SEO)
                  </label>
                  <input
                    type="text"
                    value={editingArticle.titleEn || ""}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, titleEn: e.target.value })
                    }
                    placeholder="Kantara Chapter 1 update..."
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-gray-950 font-sans focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1 font-sans">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingArticle.slug || ""}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, slug: slugify(e.target.value) })
                    }
                    placeholder="kantara-chapter-1-update"
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-gray-950 font-sans focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">ವಿಭಾಗ (Category)</label>
                  <select
                    value={editingArticle.category || "sandalwood"}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        category: e.target.value as CategorySlug,
                      })
                    }
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-gray-950 font-kannada focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name} ({cat.englishName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-600 mb-1">ಸ್ಥಿತಿ (Status)</label>
                  <select
                    value={editingArticle.status || "published"}
                    onChange={(e) => {
                      const nextStatus = e.target.value;
                      if (
                        nextStatus === "published" ||
                        nextStatus === "draft" ||
                        nextStatus === "scheduled"
                      ) {
                        setEditingArticle({
                          ...editingArticle,
                          status: nextStatus,
                        });
                      }
                    }}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  >
                    <option value="published">ಈಗಲೇ ಪ್ರಕಟಿಸಿ (Publish Now)</option>
                    <option value="draft">ಡ್ರಾಫ್ಟ್ (Draft)</option>
                    <option value="scheduled">ಶೆಡ್ಯೂಲ್ (Schedule)</option>
                  </select>
                </div>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block font-semibold text-gray-600 mb-1">
                  ಮುಖ್ಯ ಚಿತ್ರದ URL (Featured Image URL)
                </label>
                <input
                  type="url"
                  value={editingArticle.featuredImage || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, featuredImage: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-gray-950 font-sans focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block font-semibold text-gray-600 mb-1">
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
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-gray-950 font-kannada resize-none focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                />
              </div>

              {/* Rich Content */}
              <div>
                <label className="block font-semibold text-gray-600 mb-1">
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
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-950 font-kannada resize-y focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
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
                    className="w-4 h-4 text-brand-crimson rounded border-gray-300 focus:ring-brand-crimson"
                  />
                  <span className="text-gray-900 font-bold">ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್ (Breaking News)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArticle.isTopStory)}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, isTopStory: e.target.checked })
                    }
                    className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                  />
                  <span className="text-gray-900 font-bold">ಟಾಪ್ ಸ್ಟೋರಿ (Top Story)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArticle.isTrending)}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, isTrending: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-gray-900 font-bold">ಟ್ರೆಂಡಿಂಗ್ (Trending)</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors border border-gray-200"
                >
                  ರದ್ದುಮಾಡಿ (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-crimson hover:bg-[#8e1d27] text-white font-bold transition-all shadow-md shadow-brand-crimson/20 flex items-center gap-1.5 active:scale-95"
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

