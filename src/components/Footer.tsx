"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <p>
          Collections are in ₹ crore. India net excludes GST; worldwide is India gross plus overseas. Figures come from trade and producer reports and are updated as they arrive.
        </p>
        <p>
          We record visits, including IP address and approximate location, to understand our audience.
        </p>
        <p>
          Posters are the property of their studios and distributors.
        </p>
        <p className="foot-contact">
          <span className="soc soc-foot">
            <a
              href="https://x.com/FilmsDiscourse"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Films Discourse on X (@FilmsDiscourse)"
              title="Follow us on X"
            >
              <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="currentColor">
                <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z" />
              </svg>
            </a>
            <a
              href="mailto:hello@filmsdiscourse.com"
              aria-label="Email Films Discourse"
              title="Email us"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </a>
          </span>
          <span>
            Write to us at <a href="mailto:hello@filmsdiscourse.com">hello@filmsdiscourse.com</a> · Follow{" "}
            <a href="https://x.com/FilmsDiscourse" target="_blank" rel="noopener noreferrer">
              @FilmsDiscourse
            </a>{" "}
            on X
          </span>
        </p>

        <div className="foot-cols">
          <nav aria-label="Films Discourse">
            <b>Films Discourse</b>
            <Link href="/archive">About us</Link>
            <Link href="/archive">Editorial team</Link>
            <Link href="/archive">Contact us</Link>
            <Link href="/archive">Advertise with us</Link>
          </nav>
          <nav aria-label="Transparency and standards">
            <b>Transparency &amp; standards</b>
            <Link href="/box-office">Box office methodology</Link>
            <Link href="/box-office">Data sources &amp; estimation</Link>
            <Link href="/archive">Editorial policy</Link>
            <Link href="/archive">Corrections &amp; report an error</Link>
            <Link href="/box-office">Box office glossary</Link>
          </nav>
          <nav aria-label="Legal">
            <b>Legal</b>
            <Link href="/archive">Terms of use</Link>
            <Link href="/archive">Privacy policy</Link>
            <Link href="/archive">Cookie policy</Link>
            <Link href="/archive">Cookie settings</Link>
          </nav>
        </div>

        <p>© 2026 Films Discourse · EXTRASAGA</p>
      </div>
    </footer>
  );
}
