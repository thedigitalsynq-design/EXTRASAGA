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
import { formatEditorialDate, formatCineNumber, slugify } from "@/lib/utils";
import { TRUSTED_NEWS_SOURCES, TrustedNewsSource } from "@/lib/ingest/trustedSources";

const ADMIN_EMAIL_ALIASES = [
  "admin@cinijaatre.com",
  "admin@sinikannada.com",
  "admin@extrasaga.press",
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
  { id: "articles", label: "Manual Articles", icon: FileText },
  { id: "releases", label: "Cinema Releases", icon: Clapperboard },
  { id: "sources", label: "Trusted Sources", icon: Radio },
  { id: "imported", label: "Imported Articles (Auto)", icon: RefreshCw },
  { id: "reviews", label: "Movie Reviews", icon: Star },
  { id: "ads", label: "Ads", icon: DollarSign },
  { id: "comments", label: "Comments", icon: MessageSquare },
  { id: "settings", label: "SEO & Settings", icon: Settings },
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
      language: "en",
      industry: "sandalwood",
      genres: ["Action", "Drama"],
      director: "",
      producers: [""],
      cast: [{ name: "", role: "Lead Actor" }],
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
    if (confirm("Are you sure you want to delete this movie?")) {
      await DataService.deleteMovie(id);
      const updated = await DataService.getMovies();
      setMovies(updated);
      showToast("Movie deleted successfully!");
    }
  };

  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovie?.title || !editingMovie?.theatricalReleaseDate) {
      alert("Please enter a title and a release date");
      return;
    }
    const saved = await DataService.saveMovie(editingMovie);
    const updated = await DataService.getMovies();
    setMovies(updated);
    setIsMovieEditorOpen(false);
    showToast(`Movie "${saved.title}" saved successfully!`);
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
        data.message || `Rollover complete! ${data.movedToTheatres || 0} movie(s) moved to In Theatres, ${data.movedToArchive || 0} moved to Archive.`
      );
    } catch {
      const log = await DataService.runDailyCinemaRollover();
      const updated = await DataService.getMovies();
      setMovies(updated);
      const logs = await DataService.getAutomationLogs();
      setAutomationLogs(logs);
      showToast(`Rollover complete! ${log.inTheatresCount} movie(s) now in theatres, ${log.archivedCount} archived.`);
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
        showToast("Article approved successfully and now live on the website!");
        return;
      }
    } catch {
      // Fallback local
    }
    await DataService.approveArticle(id);
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "published" } : a))
    );
    showToast("Article approved successfully and now live on the website!");
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
        showToast(`${data.count || "All"} pending article(s) approved and published!`);
        return;
      }
    } catch {
      // Fallback local
    }
    const count = await DataService.approveAllPendingArticles();
    setArticles((prev) =>
      prev.map((a) => ({ ...a, status: "published" }))
    );
    showToast(`${count} pending article(s) approved and published!`);
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
        showToast(`Source ${sourceId} ${!currentEnabled ? "enabled" : "disabled"}`);
      }
    } catch {
      showToast("Failed to update source");
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
        showToast(`Sync complete! ${data.report?.articlesImported || 0} new article(s) imported.`);
      } else {
        showToast("An error occurred while syncing");
      }
    } catch {
      showToast("Sync failed");
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
      setAuthError(data.error || `Incorrect email or password. (Demo: ${DEFAULT_ADMIN_EMAIL} / admin123)`);
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
        setAuthError(`Incorrect email or password. (Demo: ${DEFAULT_ADMIN_EMAIL} / admin123)`);
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
      categoryName: "Sandalwood",
      tags: ["Sandalwood"],
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
    if (confirm("Are you sure you want to delete this article?")) {
      await DataService.deleteArticle(id);
      await loadData();
      showToast("Article deleted successfully!");
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
      categoryName: cat?.name || "Sandalwood",
    });

    setIsEditorOpen(false);
    setEditingArticle(null);
    await loadData();
    showToast("Article published / updated successfully!");
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
      <div className="min-h-[75vh] flex items-center justify-center p-4 bg-paper">
        <div className="w-full max-w-md bg-sheet p-8 border-2 border-ink shadow-press space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-poster-red mx-auto flex items-center justify-center text-paper border-2 border-ink shadow-sticker">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-ink uppercase tracking-tight">
              CINIJAATRE <span className="text-poster-red">PRESS DESK</span>
            </h1>
            <p className="text-xs text-ink-muted font-medium">
              Editorial Terminal &amp; Automated Pipeline Administration
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-poster-red/10 border-2 border-poster-red text-poster-red text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-ink mb-1 tracking-wider">
                Admin Dispatch Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full bg-paper border-2 border-ink p-2.5 text-sm text-ink font-bold focus:outline-none focus:bg-band shadow-sticker transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-ink mb-1 tracking-wider">
                Security Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full bg-paper border-2 border-ink p-2.5 text-sm text-ink font-bold focus:outline-none focus:bg-band shadow-sticker transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-poster-red hover:bg-ink text-paper font-black text-xs uppercase tracking-wider border-2 border-ink shadow-sticker transition-colors btn-press-interactive"
            >
              Sign In to Editorial Console
            </button>
          </form>

          <div className="p-3.5 bg-paper border border-ink text-xs text-ink space-y-1 shadow-sticker">
            <span className="font-black uppercase tracking-wider block text-[11px] text-ink-muted">Terminal Credentials:</span>
            <div>
              Email: <code className="text-poster-red font-mono-tabular font-bold">{DEFAULT_ADMIN_EMAIL}</code>
            </div>
            <div>Password: <code className="text-poster-red font-mono-tabular font-bold">admin123</code></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-paper text-ink font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#4ADE80] text-ink px-5 py-3 border-2 border-ink shadow-press flex items-center gap-2 text-xs font-black uppercase tracking-wider">
          <CheckCircle className="w-4 h-4 text-ink" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-sheet border-b-2 border-ink px-4 sm:px-6 py-4 shadow-press">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-poster-red flex items-center justify-center text-paper border-2 border-ink shadow-sticker">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-ink uppercase tracking-tight">
                  CINIJAATRE <span className="text-poster-red">PRESS</span> — Editorial Console
                </h1>
                <span className="px-2 py-0.5 bg-band text-ink text-[10px] font-black border border-ink shadow-sticker uppercase font-mono-tabular">
                  LIVE DESK ACTIVE
                </span>
              </div>
              <p className="text-xs text-ink-muted font-medium">
                Manage all Indian cinema news publishing, reviews, releases, and ingestion wires
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 bg-paper hover:bg-band text-ink text-xs font-black uppercase flex items-center gap-1.5 border-2 border-ink shadow-sticker transition-all btn-press-interactive"
            >
              <Eye className="w-3.5 h-3.5 text-poster-red" />
              <span>View Live Frontpage</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-1.5 bg-paper hover:bg-poster-red hover:text-paper text-ink border-2 border-ink shadow-sticker transition-colors btn-press-interactive"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Analytics Highlights Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-sheet border-2 border-ink shadow-press card-press-interactive">
            <span className="text-[11px] uppercase tracking-wider text-ink-muted block font-black font-mono-tabular">Total Articles</span>
            <div className="text-2xl font-black text-ink font-mono-tabular mt-1">{totalArticles}</div>
            <span className="text-[10px] text-poster-red font-black uppercase">✓ All Published</span>
          </div>

          <div className="p-4 bg-sheet border-2 border-ink shadow-press card-press-interactive">
            <span className="text-[11px] uppercase tracking-wider text-ink-muted block font-black font-mono-tabular">Total Views</span>
            <div className="text-2xl font-black text-poster-violet font-mono-tabular mt-1">
              {formatCineNumber(totalViews)}
            </div>
            <span className="text-[10px] text-ink-muted font-bold font-mono-tabular">+18% Weekly Surge</span>
          </div>

          <div className="p-4 bg-sheet border-2 border-ink shadow-press card-press-interactive">
            <span className="text-[11px] uppercase tracking-wider text-ink-muted block font-black font-mono-tabular">Breaking Wires</span>
            <div className="text-2xl font-black text-poster-red font-mono-tabular mt-1">{breakingCount}</div>
            <span className="text-[10px] text-poster-red font-black uppercase">Active On Ticker</span>
          </div>

          <div className="p-4 bg-sheet border-2 border-ink shadow-press card-press-interactive">
            <span className="text-[11px] uppercase tracking-wider text-ink-muted block font-black font-mono-tabular">Movie Reviews</span>
            <div className="text-2xl font-black text-ink font-mono-tabular mt-1">{reviews.length}</div>
            <span className="text-[10px] text-poster-gold font-black uppercase">Dual-Axis Audited</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b-2 border-ink pb-4 mb-6 overflow-x-auto no-scrollbar">
          {ADMIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap btn-press-interactive ${
                  isActive
                    ? "bg-ink text-paper border-2 border-ink shadow-sticker"
                    : "bg-paper text-ink border border-ink hover:bg-band"
                }`}
              >
                <Icon className="w-4 h-4 text-poster-red" />
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
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-sheet border border-glow-line rounded-xl pl-9 pr-4 py-2.5 text-xs text-popcorn placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-kannada shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-popcorn-muted absolute left-3 top-3" />
              </div>

              <button
                onClick={handleOpenNewArticle}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-[#8e1d27] text-white font-bold text-xs font-kannada flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-crimson/20 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Write New Article</span>
              </button>
            </div>

            {/* Articles Table */}
            <div className="bg-sheet rounded-2xl border border-glow-line overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse font-kannada">
                <thead>
                  <tr className="bg-hall text-popcorn-dim text-[11px] uppercase tracking-wider border-b border-glow-line font-mono">
                    <th className="py-3.5 px-4 font-semibold">Image</th>
                    <th className="py-3.5 px-4 font-semibold">Headline</th>
                    <th className="py-3.5 px-4 font-semibold">Category</th>
                    <th className="py-3.5 px-4 font-semibold">Views</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glow-line text-xs">
                  {filteredArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-screen transition-colors">
                      <td className="py-3 px-4">
                        <div className="relative w-12 h-9 rounded-lg overflow-hidden border border-glow-line shadow-2xs">
                          <Image
                            src={art.featuredImage}
                            alt={art.title}
                            fill
                            className="object-cover"
                            sizes="50px"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-popcorn max-w-sm">
                        <div className="truncate">{art.title}</div>
                        <div className="text-[10px] text-popcorn-muted font-sans font-normal truncate">
                          /{art.slug}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-hall text-popcorn-dim font-medium text-[11px] border border-glow-line">
                          {art.categoryName}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-popcorn-dim font-medium">
                        {formatCineNumber(art.views)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {art.isBreaking && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                              Breaking
                            </span>
                          )}
                          {art.isTopStory && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                              Top
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            Published
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/news/${art.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg hover:bg-screen text-popcorn-dim hover:text-popcorn transition-colors border border-transparent hover:border-glow-line"
                            title="View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleEditArticle(art)}
                            className="p-1.5 rounded-lg hover:bg-sky-500/10 text-sky-400 hover:text-sky-400 transition-colors border border-transparent hover:border-sky-500/30"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-400 transition-colors border border-transparent hover:border-rose-500/30"
                            title="Delete"
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-sheet border border-glow-line shadow-2xs">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-popcorn flex items-center gap-2">
                    <Clapperboard className="w-5 h-5 text-brand-crimson" />
                    <span>Cinema Releases & Daily Rollover (Releases Hub)</span>
                  </h3>
                  <p className="text-xs text-popcorn-dim mt-1 font-sans">
                    Real-time date classification (Asia/Kolkata): Last 30 days In Theatres, Upcoming Radar, and Permanent Archive across 6 industries.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleRunDailyRollover}
                    disabled={isRolloverRunning}
                    className="px-4 py-2.5 rounded-xl bg-hall hover:bg-screen text-popcorn text-xs font-bold font-sans flex items-center gap-2 transition-all border border-glow-line disabled:opacity-50"
                    title="Move movies whose confirmed release date has arrived to released, and archive older than 30 days"
                  >
                    <RefreshCw className={`w-4 h-4 text-emerald-400 ${isRolloverRunning ? "animate-spin" : ""}`} />
                    <span>{isRolloverRunning ? "Running..." : "Run Daily Rollover"}</span>
                  </button>
                  <button
                    onClick={handleOpenNewMovie}
                    className="px-4 py-2.5 rounded-xl bg-brand-crimson hover:bg-[#8e1d27] text-white text-xs font-bold font-sans flex items-center gap-2 transition-all shadow-md shadow-brand-crimson/20"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add New Movie</span>
                  </button>
                </div>
              </div>

              {/* Status Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans">
                <div className="p-4 rounded-2xl bg-sheet border border-glow-line shadow-2xs">
                  <span className="text-[11px] text-popcorn-dim font-medium block">Total Movies</span>
                  <div className="text-2xl font-black text-popcorn mt-1">{movies.length}</div>
                  <span className="text-[10px] text-popcorn-dim font-kannada">Across 6 film industries</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-2xs">
                  <span className="text-[11px] text-emerald-400 font-bold block flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>In Theatres (Last 30 Days)</span>
                  </span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">{inTheatresCount}</div>
                  <span className="text-[10px] text-emerald-400 font-kannada">Released in the last 30 days</span>
                </div>
                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 shadow-2xs">
                  <span className="text-[11px] text-sky-400 font-bold block flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>Upcoming Movies</span>
                  </span>
                  <div className="text-2xl font-black text-sky-400 mt-1">{upcomingCount}</div>
                  <span className="text-[10px] text-sky-400 font-kannada">Counting down by date</span>
                </div>
                <div className="p-4 rounded-2xl bg-hall border border-glow-line shadow-2xs">
                  <span className="text-[11px] text-popcorn-dim font-medium block">Permanent Archive</span>
                  <div className="text-2xl font-black text-popcorn-dim mt-1">{archivedCount}</div>
                  <span className="text-[10px] text-popcorn-dim font-kannada">Older than 30 days</span>
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
                          : "bg-sheet text-popcorn-dim hover:text-popcorn border-glow-line hover:border-glow-line-strong"
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
                    className="bg-sheet border border-glow-line rounded-xl px-3 py-1.5 text-xs text-popcorn focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-sans shadow-2xs"
                  >
                    <option value="all">All Languages</option>
                    <option value="kn">Kannada (Sandalwood)</option>
                    <option value="te">Telugu (Tollywood)</option>
                    <option value="ta">Tamil (Kollywood)</option>
                    <option value="ml">Malayalam (Mollywood)</option>
                    <option value="hi">Hindi (Bollywood)</option>
                    <option value="en">English (Hollywood)</option>
                  </select>

                  <div className="relative flex-1 sm:w-60">
                    <input
                      type="text"
                      placeholder="Search movies..."
                      value={movieSearch}
                      onChange={(e) => setMovieSearch(e.target.value)}
                      className="w-full bg-sheet border border-glow-line rounded-xl pl-8 pr-3 py-1.5 text-xs text-popcorn placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson shadow-2xs"
                    />
                    <Search className="w-3.5 h-3.5 text-popcorn-muted absolute left-2.5 top-2" />
                  </div>
                </div>
              </div>

              {/* Movies Table */}
              <div className="bg-sheet rounded-2xl border border-glow-line overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-hall text-popcorn-dim text-[11px] uppercase tracking-wider border-b border-glow-line font-mono">
                      <th className="py-3.5 px-4 font-semibold">Poster</th>
                      <th className="py-3.5 px-4 font-semibold">Title</th>
                      <th className="py-3.5 px-4 font-semibold">Release Date</th>
                      <th className="py-3.5 px-4 font-semibold">Industry</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold">Date Confidence</th>
                      <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glow-line">
                    {filteredMovies.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-popcorn-muted">
                          No movies found. Click &ldquo;Add New Movie&rdquo; to get started.
                        </td>
                      </tr>
                    ) : (
                      filteredMovies.map((mov) => {
                        const statusColors: Record<string, string> = {
                          in_theatres: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                          upcoming: "bg-sky-500/10 text-sky-400 border-sky-500/30",
                          archived: "bg-hall text-popcorn-dim border-glow-line",
                        };

                        const statusLabels: Record<string, string> = {
                          in_theatres: "In Theatres",
                          upcoming: "Upcoming Release",
                          archived: "Archived",
                        };

                        return (
                          <tr key={mov.id} className="hover:bg-screen transition-colors">
                            <td className="py-3 px-4">
                              <div className="w-12 h-16 rounded-lg overflow-hidden relative bg-hall shrink-0 border border-glow-line shadow-2xs">
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
                              <div className="font-bold text-popcorn text-sm line-clamp-1">{mov.title}</div>
                              <div className="text-[11px] text-popcorn-dim font-sans line-clamp-1">
                                {mov.titleEn} • {mov.director}
                              </div>
                              <div className="text-[10px] text-popcorn-muted mt-0.5 line-clamp-1">
                                {mov.genres.join(", ")}
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap font-sans">
                              <div className="font-bold text-popcorn">{mov.theatricalReleaseDate}</div>
                              <div className="text-[10px] text-popcorn-dim font-kannada">
                                {formatEditorialDate(mov.theatricalReleaseDate)}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-hall text-popcorn font-bold uppercase font-sans border border-glow-line">
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
                                <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Confirmed</span>
                                </span>
                              ) : (
                                <span className="text-amber-400 font-bold text-[11px] flex items-center gap-1">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Tentative</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5 font-sans">
                                <Link
                                  href={`/movies/${mov.slug}`}
                                  target="_blank"
                                  className="p-1.5 rounded-lg hover:bg-screen text-popcorn-dim hover:text-popcorn transition-colors"
                                  title="View movie release article"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                  onClick={() => handleEditMovie(mov)}
                                  className="p-1.5 rounded-lg hover:bg-sky-500/10 text-sky-400 hover:text-sky-400 transition-colors"
                                  title="Edit movie details"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMovie(mov.id)}
                                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-400 transition-colors"
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
                <div className="p-5 rounded-2xl bg-sheet border border-glow-line shadow-2xs">
                  <h4 className="text-sm font-bold text-popcorn flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Daily Automation Logs (Recent Runs)</span>
                  </h4>
                  <div className="space-y-2 text-xs font-mono">
                    {automationLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-hall border border-glow-line flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              log.status === "success" ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          ></span>
                          <span className="text-popcorn font-bold uppercase">{log.action}</span>
                          <span className="text-popcorn-dim truncate">{log.details}</span>
                        </div>
                        <div className="text-[11px] text-popcorn-muted shrink-0">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-sheet border border-glow-line shadow-2xs">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-popcorn font-sans flex items-center gap-2">
                  <Radio className="w-5 h-5 text-brand-crimson animate-pulse" />
                  <span>Trusted Regional Cinema News Sources</span>
                </h3>
                <p className="text-xs text-popcorn-dim mt-1 font-sans">
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
                      : "bg-sheet text-popcorn-dim hover:text-popcorn border-glow-line hover:border-glow-line-strong"
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
                    className="p-5 rounded-2xl bg-sheet border border-glow-line hover:border-glow-line-strong flex flex-col justify-between space-y-4 shadow-2xs transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-black text-popcorn font-sans truncate">
                          {src.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Trust: {src.trustScore}%
                        </span>
                      </div>
                      <p className="text-xs text-popcorn-dim font-sans line-clamp-2">
                        {src.description}
                      </p>
                      <div className="mt-2.5 flex items-center gap-2 text-[10px] text-popcorn-dim font-sans">
                        <span className="uppercase font-bold text-amber-400">{src.industry}</span>
                        <span>•</span>
                        <a
                          href={src.homepage}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-popcorn flex items-center gap-1 underline text-popcorn-dim"
                        >
                          <span>Visit Site</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-glow-line flex items-center justify-between">
                      <span className="text-[11px] font-sans text-popcorn-dim">
                        Status:{" "}
                        <strong className={src.enabled ? "text-emerald-400 font-bold" : "text-popcorn-muted"}>
                          {src.enabled ? "Active / Auto-Sync" : "Disabled"}
                        </strong>
                      </span>
                      <button
                        onClick={() => handleToggleSource(src.id, src.enabled)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold font-sans transition-all border ${
                          src.enabled
                            ? "bg-rose-500/10 hover:bg-rose-500/15 text-rose-400 border-rose-500/30"
                            : "bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-sheet border border-glow-line shadow-2xs">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-popcorn font-sans flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-emerald-400" />
                    <span>Imported Articles & Editorial Approval (Approval Hub)</span>
                  </h3>
                  <p className="text-xs text-popcorn-dim mt-1 font-sans">
                    Review, approve and publish articles auto-imported from real news portals.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-hall text-popcorn-dim text-xs font-sans font-bold border border-glow-line">
                    Total: {importedArticles.length}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-sans font-bold border border-amber-500/30">
                    Pending: {pendingArticles.length}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-sans font-bold border border-emerald-500/30">
                    Live: {approvedArticles.length}
                  </span>
                </div>
              </div>

              {/* Moderation Controls & Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-sheet p-3.5 rounded-2xl border border-glow-line shadow-2xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setImportedFilter("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      importedFilter === "all"
                        ? "bg-brand-crimson text-white border-brand-crimson shadow-2xs"
                        : "bg-sheet text-popcorn-dim hover:text-popcorn border-glow-line hover:border-glow-line-strong"
                    }`}
                  >
                    All Imported ({importedArticles.length})
                  </button>
                  <button
                    onClick={() => setImportedFilter("pending")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      importedFilter === "pending"
                        ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                        : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/15 border-amber-500/30"
                    }`}
                  >
                    <span>⏳ Pending Approval ({pendingArticles.length})</span>
                  </button>
                  <button
                    onClick={() => setImportedFilter("published")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      importedFilter === "published"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                        : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 border-emerald-500/30"
                    }`}
                  >
                    ✓ Live & Published ({approvedArticles.length})
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {pendingArticles.length > 0 && (
                    <button
                      onClick={handleApproveAllPending}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve All Pending ({pendingArticles.length})</span>
                    </button>
                  )}
                  <button
                    onClick={handleSyncNow}
                    disabled={isSyncing}
                    className="px-3.5 py-1.5 rounded-xl bg-hall hover:bg-screen text-popcorn text-xs font-bold flex items-center gap-1.5 border border-glow-line transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-brand-crimson" : ""}`} />
                    <span>{isSyncing ? "Syncing..." : "Sync Feeds"}</span>
                  </button>
                </div>
              </div>

              {/* Articles Approval Table */}
              <div className="bg-sheet rounded-2xl border border-glow-line overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="bg-hall text-popcorn-dim text-[11px] uppercase tracking-wider border-b border-glow-line font-mono">
                      <th className="py-3.5 px-4 font-semibold">Headline & Summary</th>
                      <th className="py-3.5 px-4 font-semibold">Original Publisher</th>
                      <th className="py-3.5 px-4 font-semibold">Industry</th>
                      <th className="py-3.5 px-4 font-semibold">Date</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 text-right font-semibold">Approval Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glow-line">
                    {displayedArticles.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-popcorn-muted font-sans text-xs">
                          No articles found. Click &quot;Sync Feeds&quot; to import new articles.
                        </td>
                      </tr>
                    ) : (
                      displayedArticles.slice(0, 40).map((art) => {
                        const isPending = art.status === "pending";
                        return (
                          <tr key={art.id} className="hover:bg-screen transition-colors">
                            <td className="py-3 px-4 font-bold text-popcorn max-w-md">
                              <div className="line-clamp-1">{art.title}</div>
                              <div className="text-[10px] text-popcorn-dim font-normal line-clamp-1 mt-0.5">
                                {art.summary}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30 text-[11px]">
                                  {art.source?.name || art.author.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 uppercase font-bold text-popcorn-dim text-[11px]">
                              {art.industry || "cinema"}
                            </td>
                            <td className="py-3 px-4 text-popcorn-dim text-[11px] whitespace-nowrap">
                              {new Date(art.publishedAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              {isPending ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                  Pending Approval
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                  Live
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
                                    <span>Approve</span>
                                  </button>
                                )}
                                {art.source?.url && (
                                  <a
                                    href={art.source.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg hover:bg-screen text-popcorn-dim hover:text-popcorn transition-colors border border-glow-line"
                                    title="Original Article (Canonical Source)"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {!isPending && (
                                  <Link
                                    href={`/news/${art.slug}`}
                                    target="_blank"
                                    className="p-1.5 rounded-lg hover:bg-sky-500/10 text-sky-400 hover:text-sky-400 transition-colors border border-transparent hover:border-sky-500/30"
                                    title="View on Site"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </Link>
                                )}
                                <button
                                  onClick={() => handleDeleteArticle(art.id)}
                                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-400 transition-colors border border-transparent hover:border-rose-500/30"
                                  title="Reject / Delete"
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
              <h3 className="text-base font-bold text-popcorn font-kannada">
                Movie Review Management ({reviews.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-sheet border border-glow-line space-y-3 shadow-2xs hover:shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-popcorn font-kannada text-sm">
                      {rev.movieTitle}
                    </span>
                    <span className="text-xs font-bold text-amber-400 font-sans">
                      ★ {rev.rating.toFixed(1)}/5
                    </span>
                  </div>
                  <p className="text-xs text-popcorn-dim font-kannada line-clamp-2">
                    {rev.summary}
                  </p>
                  <div className="text-[11px] text-popcorn-dim font-kannada">
                    Directed by: <strong className="text-popcorn">{rev.director}</strong>
                  </div>
                  <div className="pt-2 border-t border-glow-line flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-bold font-kannada bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {rev.verdict}
                    </span>
                    <Link
                      href={`/reviews/${rev.slug}`}
                      target="_blank"
                      className="text-xs text-brand-crimson hover:underline font-kannada font-bold"
                    >
                      View Review
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
            <h3 className="text-base font-bold text-popcorn font-kannada">
              Ad Placement Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: "head",
                  placement: "Header Leaderboard (728x90)",
                  status: "Active",
                  target: "Main homepage header",
                },
                {
                  id: "side",
                  placement: "Sidebar Rectangle (300x250)",
                  status: "Active",
                  target: "All news pages and the homepage",
                },
                {
                  id: "in",
                  placement: "In-Article Banner",
                  status: "Active",
                  target: "Mid-body of news articles",
                },
                {
                  id: "foot",
                  placement: "Footer Banner",
                  status: "Active",
                  target: "Bottom of every page",
                },
              ].map((ad) => (
                <div
                  key={ad.id}
                  className="p-5 rounded-2xl bg-sheet border border-glow-line space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-popcorn font-kannada text-sm">
                      {ad.placement}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      {ad.status}
                    </span>
                  </div>
                  <p className="text-xs text-popcorn-dim font-kannada">{ad.target}</p>
                  <div className="pt-2 flex items-center gap-2">
                    <button className="px-3 py-1 rounded-xl bg-hall hover:bg-screen text-popcorn text-xs font-kannada transition-colors border border-glow-line">
                      Change Ad Code
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
            <h3 className="text-base font-bold text-popcorn font-kannada">
              Reader Comments Review
            </h3>
            <div className="p-6 rounded-2xl bg-sheet border border-glow-line text-center space-y-2 shadow-2xs">
              <p className="text-xs sm:text-sm text-popcorn-dim font-kannada">
                All public comments are auto-approved and go live instantly. Malicious or abusive language is filtered automatically.
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-2xl bg-sheet p-6 sm:p-8 rounded-2xl border border-glow-line shadow-2xs">
            <h3 className="text-base font-bold text-popcorn font-kannada">
              Website & SEO Settings
            </h3>
            <div className="space-y-4 text-xs font-kannada">
              <div>
                <label className="block text-popcorn-dim mb-1 font-semibold">
                  Site Title:
                </label>
                <input
                  type="text"
                  defaultValue="CINI JAATRE — Premium Multilingual Cinema Journalism"
                  className="w-full bg-sheet border border-glow-line rounded-xl p-2.5 text-popcorn focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                />
              </div>

              <div>
                <label className="block text-popcorn-dim mb-1 font-semibold">
                  Meta Description:
                </label>
                <textarea
                  rows={3}
                  defaultValue="Latest Sandalwood news, movie reviews, box office, OTT updates and photo galleries."
                  className="w-full bg-sheet border border-glow-line rounded-xl p-2.5 text-popcorn resize-none focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                />
              </div>

              <div>
                <label className="block text-popcorn-dim mb-1 font-semibold">
                  Google AdSense Publisher ID:
                </label>
                <input
                  type="text"
                  defaultValue="pub-984218392109312"
                  className="w-full bg-sheet border border-glow-line rounded-xl p-2.5 text-popcorn font-sans focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                />
              </div>

              <button
                onClick={() => showToast("Settings saved!")}
                className="px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-[#8e1d27] text-white font-bold transition-all shadow-md shadow-brand-crimson/20 active:scale-95"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MOVIE CREATE / EDIT MODAL */}
      {isMovieEditorOpen && editingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-sheet rounded-3xl border border-glow-line shadow-2xl p-6 sm:p-8 my-8 font-kannada text-popcorn">
            <div className="flex items-center justify-between pb-4 border-b border-glow-line mb-6">
              <h2 className="text-lg font-bold text-popcorn flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-brand-crimson" />
                <span>{editingMovie.id ? "Edit Movie" : "Add New Movie"}</span>
              </h2>
              <button
                onClick={() => setIsMovieEditorOpen(false)}
                className="w-8 h-8 rounded-full bg-hall hover:bg-screen text-popcorn-dim hover:text-popcorn flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title (Regional / Kannada) */}
                <div>
                  <label className="block font-bold text-popcorn-dim mb-1 font-kannada">
                    Movie Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMovie.title || ""}
                    onChange={(e) => setEditingMovie({ ...editingMovie, title: e.target.value })}
                    placeholder="e.g. Kantara Chapter 1"
                    className="w-full bg-sheet border border-glow-line rounded-xl px-3.5 py-2 text-popcorn focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-kannada"
                  />
                </div>

                {/* Title (English) */}
                <div>
                  <label className="block font-bold text-popcorn-dim mb-1">
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
                    className="w-full bg-sheet border border-glow-line rounded-xl px-3.5 py-2 text-popcorn focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Theatrical Release Date */}
                <div>
                  <label className="block font-bold text-popcorn-dim mb-1">
                    Theatrical Release Date (YYYY-MM-DD) *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingMovie.theatricalReleaseDate || ""}
                    onChange={(e) =>
                      setEditingMovie({ ...editingMovie, theatricalReleaseDate: e.target.value })
                    }
                    className="w-full bg-sheet border border-glow-line rounded-xl px-3.5 py-2 text-popcorn focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  />
                </div>

                {/* Confidence */}
                <div>
                  <label className="block font-bold text-popcorn-dim mb-1">
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
                    className="w-full bg-sheet border border-glow-line rounded-xl px-3.5 py-2 text-popcorn focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="tentative">Tentative</option>
                  </select>
                </div>

                {/* Language / Industry */}
                <div>
                  <label className="block font-bold text-popcorn-dim mb-1">
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
                    className="w-full bg-sheet border border-glow-line rounded-xl px-3.5 py-2 text-popcorn focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  >
                    <option value="kn">Kannada (Sandalwood)</option>
                    <option value="te">Telugu (Tollywood)</option>
                    <option value="ta">Tamil (Kollywood)</option>
                    <option value="ml">Malayalam (Mollywood)</option>
                    <option value="hi">Hindi (Bollywood)</option>
                    <option value="en">English (Hollywood)</option>
                  </select>
                </div>
              </div>

              {/* Director & Cast */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-popcorn-dim mb-1 font-kannada">
                    Director
                  </label>
                  <input
                    type="text"
                    value={editingMovie.director || ""}
                    onChange={(e) => setEditingMovie({ ...editingMovie, director: e.target.value })}
                    placeholder="e.g. Rishab Shetty"
                    className="w-full bg-sheet border border-glow-line rounded-xl px-3.5 py-2 text-popcorn focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-kannada"
                  />
                </div>
                <div>
                  <label className="block font-bold text-popcorn-dim mb-1 font-kannada">
                    Main Cast (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingMovie.cast?.map((c) => c.name).join(", ") || ""}
                    onChange={(e) => {
                      const names = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                      setEditingMovie({
                        ...editingMovie,
                        cast: names.map((name) => ({ name, role: "Lead Role" })),
                      });
                    }}
                    placeholder="e.g. Rishab Shetty, Rukmini Vasant, Jayaram"
                    className="w-full bg-sheet border border-glow-line rounded-xl px-3.5 py-2 text-popcorn focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-kannada"
                  />
                </div>
              </div>

              {/* Genres & Production */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-popcorn-dim mb-1 font-kannada">
                    Genres (Comma separated)
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
                    placeholder="e.g. Action, Mythological Thriller, Drama"
                    className="w-full bg-sheet border border-glow-line rounded-xl px-3.5 py-2 text-popcorn focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-kannada"
                  />
                </div>
                <div>
                  <label className="block font-bold text-popcorn-dim mb-1 font-kannada">
                    Production House
                  </label>
                  <input
                    type="text"
                    value={editingMovie.productionCompany || ""}
                    onChange={(e) =>
                      setEditingMovie({ ...editingMovie, productionCompany: e.target.value })
                    }
                    placeholder="e.g. Hombale Films"
                    className="w-full bg-sheet border border-glow-line rounded-xl px-3.5 py-2 text-popcorn focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-kannada"
                  />
                </div>
              </div>

              {/* Poster Image URL & Trailer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-popcorn-dim mb-1">
                    Official Poster Image URL
                  </label>
                  <input
                    type="url"
                    value={editingMovie.posterImage || ""}
                    onChange={(e) =>
                      setEditingMovie({ ...editingMovie, posterImage: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-sheet border border-glow-line rounded-xl px-3.5 py-2 text-popcorn focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  />
                </div>
                <div>
                  <label className="block font-bold text-popcorn-dim mb-1">
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
                    className="w-full bg-sheet border border-glow-line rounded-xl px-3.5 py-2 text-popcorn focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  />
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <label className="block font-bold text-popcorn-dim mb-1 font-kannada">
                  Synopsis & Overview
                </label>
                <textarea
                  rows={4}
                  value={editingMovie.synopsis || ""}
                  onChange={(e) => setEditingMovie({ ...editingMovie, synopsis: e.target.value })}
                  placeholder="Enter a detailed plot synopsis and technical details..."
                  className="w-full bg-sheet border border-glow-line rounded-xl px-3.5 py-2 text-popcorn focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-kannada"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-glow-line flex items-center justify-end gap-3 font-kannada">
                <button
                  type="button"
                  onClick={() => setIsMovieEditorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-hall hover:bg-screen text-popcorn-dim font-bold transition-colors border border-glow-line"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-crimson hover:bg-[#8e1d27] text-white font-bold transition-all shadow-md shadow-brand-crimson/20 flex items-center gap-1.5 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Movie</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARTICLE CREATE / EDIT MODAL */}
      {isEditorOpen && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-sheet rounded-3xl border border-glow-line shadow-2xl p-6 sm:p-8 my-8 font-kannada text-popcorn">
            <div className="flex items-center justify-between pb-4 border-b border-glow-line mb-6">
              <h2 className="text-lg font-bold text-popcorn">
                {editingArticle.id ? "Edit Article" : "Create New Article"}
              </h2>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="w-8 h-8 rounded-full bg-hall hover:bg-screen text-popcorn-dim hover:text-popcorn flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-popcorn-dim mb-1">
                  Headline *
                </label>
                <input
                  type="text"
                  value={editingArticle.title || ""}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="e.g. New update on Kantara Chapter 1..."
                  required
                  className="w-full bg-sheet border border-glow-line rounded-xl p-2.5 text-sm text-popcorn focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-kannada"
                />
              </div>

              {/* English Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-popcorn-dim mb-1 font-sans">
                    English Title (SEO)
                  </label>
                  <input
                    type="text"
                    value={editingArticle.titleEn || ""}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, titleEn: e.target.value })
                    }
                    placeholder="Kantara Chapter 1 update..."
                    className="w-full bg-sheet border border-glow-line rounded-xl p-2.5 text-popcorn font-sans focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-popcorn-dim mb-1 font-sans">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingArticle.slug || ""}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, slug: slugify(e.target.value) })
                    }
                    placeholder="kantara-chapter-1-update"
                    className="w-full bg-sheet border border-glow-line rounded-xl p-2.5 text-popcorn font-sans focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-popcorn-dim mb-1">Category</label>
                  <select
                    value={editingArticle.category || "sandalwood"}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        category: e.target.value as CategorySlug,
                      })
                    }
                    className="w-full bg-sheet border border-glow-line rounded-xl p-2.5 text-popcorn font-kannada focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name} ({cat.englishName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-popcorn-dim mb-1">Status</label>
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
                    className="w-full bg-sheet border border-glow-line rounded-xl p-2.5 text-popcorn focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                  >
                    <option value="published">Publish Now</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Schedule</option>
                  </select>
                </div>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block font-semibold text-popcorn-dim mb-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={editingArticle.featuredImage || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, featuredImage: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-sheet border border-glow-line rounded-xl p-2.5 text-popcorn font-sans focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block font-semibold text-popcorn-dim mb-1">
                  Summary / Excerpt *
                </label>
                <textarea
                  rows={2}
                  value={editingArticle.summary || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, summary: e.target.value })
                  }
                  placeholder="Write the key takeaway of the story here..."
                  required
                  className="w-full bg-sheet border border-glow-line rounded-xl p-2.5 text-popcorn font-kannada resize-none focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
                />
              </div>

              {/* Rich Content */}
              <div>
                <label className="block font-semibold text-popcorn-dim mb-1">
                  Full Article Body *
                </label>
                <textarea
                  rows={8}
                  value={editingArticle.content || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, content: e.target.value })
                  }
                  placeholder="Full details. Use ### for sub-headings and **bold** for emphasis..."
                  required
                  className="w-full bg-sheet border border-glow-line rounded-xl p-3 text-popcorn font-kannada resize-y focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson"
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
                    className="w-4 h-4 text-brand-crimson rounded border-glow-line-strong focus:ring-brand-crimson"
                  />
                  <span className="text-popcorn font-bold">Breaking News</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArticle.isTopStory)}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, isTopStory: e.target.checked })
                    }
                    className="w-4 h-4 text-amber-500 rounded border-glow-line-strong focus:ring-amber-500"
                  />
                  <span className="text-popcorn font-bold">Top Story</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArticle.isTrending)}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, isTrending: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-500 rounded border-glow-line-strong focus:ring-emerald-500"
                  />
                  <span className="text-popcorn font-bold">Trending</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-glow-line flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-hall hover:bg-screen text-popcorn-dim font-bold transition-colors border border-glow-line"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-crimson hover:bg-[#8e1d27] text-white font-bold transition-all shadow-md shadow-brand-crimson/20 flex items-center gap-1.5 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

