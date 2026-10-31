import React from "react";
import Link from "next/link";
import { Film, Send, ShieldCheck, Heart } from "lucide-react";
import { CATEGORIES } from "@/data/mockData";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0c] border-t border-brand-border text-white mt-16 font-kannada">
      {/* Top Banner Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-red via-brand-yellow to-brand-crimson"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-brand-red flex items-center justify-center text-white shadow-lg shadow-brand-red/30">
                <Film className="w-5 h-5" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">ಸಿನಿ</span>
                <span className="text-2xl font-black text-brand-red">ಕನ್ನಡ</span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-sm">
              **ಸಿನಿ ಕನ್ನಡ** - ಕನ್ನಡಿಗರ ನೆಚ್ಚಿನ ಡಿಜಿಟಲ್ ಸಿನಿಮಾ ಮತ್ತು ಮನರಂಜನಾ ತಾಣ. ಸ್ಯಾಂಡಲ್ವುಡ್, ಬಾಲಿವುಡ್, ಹಾಲಿವುಡ್ ಚಿತ್ರರಂಗದ ಕ್ಷಣಕ್ಷಣದ ಬ್ರೇಕಿಂಗ್ ಸುದ್ದಿ, ನೈಜ ಸಿನಿಮಾ ವಿಮರ್ಶೆ, ಬಾಕ್ಸ್ ಆಫೀಸ್ ಗಳಿಕೆ ಮತ್ತು ಸೆಲೆಬ್ರಿಟಿ ಸಂದರ್ಶನಗಳ ಸಮಗ್ರ ಪೋರ್ಟಲ್.
            </p>

            <div className="pt-2">
              <span className="text-xs font-bold text-gray-300 block mb-2">
                ಟೆಲಿಗ್ರಾಂ & ವಾಟ್ಸಾಪ್ ಚಾನೆಲ್ ಸೇರಿ:
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-cyan-500/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ಟೆಲಿಗ್ರಾಂ</span>
                </a>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-emerald-500/30"
                >
                  <span>ವಾಟ್ಸಾಪ್ ಚಾನೆಲ್</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Categories 1 */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-red pl-2">
              ಪ್ರಮುಖ ವಿಭಾಗಗಳು
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={cat.slug === "mukhaputa" ? "/" : `/category/${cat.slug}`}
                    className="hover:text-brand-red transition-colors block py-0.5"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Categories 2 */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-red pl-2">
              ಮನರಂಜನೆ & ಸಿನಿಮಾ
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {CATEGORIES.slice(6, 12).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-brand-red transition-colors block py-0.5"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Special & Admin */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-red pl-2">
              ವಿಶೇಷ ಸೇವೆಗಳು
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/box-office" className="hover:text-emerald-400 transition-colors block py-0.5">
                  ಬಾಕ್ಸ್ ಆಫೀಸ್ ರಿಪೋರ್ಟ್
                </Link>
              </li>
              <li>
                <Link href="/ott" className="hover:text-sky-400 transition-colors block py-0.5">
                  OTT ಬಿಡುಗಡೆ ಕ್ಯಾಲೆಂಡರ್
                </Link>
              </li>
              <li>
                <Link href="/category/reviews" className="hover:text-brand-yellow transition-colors block py-0.5">
                  ಸ್ಟಾರ್ ರೇಟಿಂಗ್ ವಿಮರ್ಶೆಗಳು
                </Link>
              </li>
              <li>
                <Link href="/admin" className="flex items-center gap-1 text-brand-red font-bold hover:underline py-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ಅಡ್ಮಿನ್ ಲಾಗಿನ್ (Admin)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <p>
            &copy; {new Date().getFullYear()} ಸಿನಿ ಕನ್ನಡ (Sini Kannada). ಸರ್ವ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>ಗೌಪ್ಯತೆ ನೀತಿ (Privacy Policy)</span>
            <span>•</span>
            <span>ಬಳಕೆಯ ನಿಯಮಗಳು (Terms of Use)</span>
            <span>•</span>
            <span>ಸಂಪರ್ಕಿಸಿ (Contact Us)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

