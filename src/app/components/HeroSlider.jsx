'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

function normalizeHref(href) {
  if (!href) return '';
  return href.trim();
}

export default function HeroSlider({ fallbackSlide }) {
  const [banners, setBanners] = useState([]);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch('/api/banners')
      .then((res) => res.json())
      .then((data) => setBanners(Array.isArray(data) ? data : []))
      .catch(() => setBanners([]));
  }, []);

  const slides = useMemo(() => {
    const active = banners.filter((b) => b && b.isActive !== false);
    if (active.length > 0) return active;
    return fallbackSlide ? [fallbackSlide] : [];
  }, [banners, fallbackSlide]);

  useEffect(() => {
    if (!slides.length) return;
    if (paused) return;

    timerRef.current = setInterval(() => {
      setIdx((cur) => (cur + 1) % slides.length);
    }, 6500);

    return () => clearInterval(timerRef.current);
  }, [slides.length, paused]);

  useEffect(() => {
    if (!slides.length) return;
    if (idx >= slides.length) setIdx(0);
  }, [slides.length, idx]);

  if (!slides.length) return null;
  const current = slides[idx];

  const primaryHref = normalizeHref(current.primaryCtaHref) || '/sigorta-sube-basvurusu';
  const secondaryHref = normalizeHref(current.secondaryCtaHref) || '/sigorta-teklif-al';

  return (
    <div className="hero-slider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="hero-slide">
        <img className="hero-slide-bg" src={current.imageUrl} alt={current.title || 'Banner'} />
        <div className="hero-slide-overlay" />
        <div className="hero-slide-content">
          {current.subtitle ? <span className="hero-badge">{current.subtitle}</span> : null}
          <h1 className="hero-slide-title">
            {current.title}
          </h1>
          {current.description ? <p className="hero-subtitle">{current.description}</p> : null}
          <div className="hero-actions">
            {current.primaryCtaText ? (
              <Link href={primaryHref} className="btn btn-primary btn-lg">
                <span>{current.primaryCtaText}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            ) : null}
            {current.secondaryCtaText ? <Link href={secondaryHref} className="btn btn-secondary">{current.secondaryCtaText}</Link> : null}
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            className="hero-nav hero-prev"
            aria-label="Önceki banner"
            onClick={() => setIdx((cur) => (cur - 1 + slides.length) % slides.length)}
          >
            ‹
          </button>
          <button
            type="button"
            className="hero-nav hero-next"
            aria-label="Sonraki banner"
            onClick={() => setIdx((cur) => (cur + 1) % slides.length)}
          >
            ›
          </button>

          <div className="hero-dots" role="tablist" aria-label="Banner seçimi">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`hero-dot ${i === idx ? 'active' : ''}`}
                aria-label={`Banner ${i + 1}`}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

