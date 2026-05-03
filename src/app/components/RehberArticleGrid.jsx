'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

function formatDate(d) {
  if (!d) return '';
  try {
    return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(
      new Date(d),
    );
  } catch {
    return '';
  }
}

export default function RehberArticleGrid({ articles }) {
  const categories = useMemo(() => {
    const s = new Set(articles.map((a) => a.category).filter(Boolean));
    return ['Tümü', ...Array.from(s).sort((a, b) => a.localeCompare(b, 'tr'))];
  }, [articles]);

  const [cat, setCat] = useState('Tümü');

  const filtered =
    cat === 'Tümü' ? articles : articles.filter((a) => (a.category || 'Genel') === cat);

  if (!articles.length) {
    return (
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px 0' }}>
        Henüz rehber yazısı yok.
      </p>
    );
  }

  return (
    <>
      <div className="rehber-category-bar" role="tablist" aria-label="Kategori filtreleri">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={cat === c}
            className={`rehber-cat-chip ${cat === c ? 'active' : ''}`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="rehber-article-grid">
        {filtered.map((a) => (
          <Link key={a.id} href={`/sigorta-rehberi/${encodeURIComponent(a.slug)}`} className="rehber-card reveal active">
            <span className="rehber-card-meta">
              <span className="rehber-card-date">{formatDate(a.publishedAt)}</span>
              <span className="rehber-card-cat">{a.category}</span>
            </span>
            <h3 className="rehber-card-title">{a.title}</h3>
            {a.excerpt ? <p className="rehber-card-excerpt">{a.excerpt}</p> : null}
            <span className="rehber-card-cta">
              Okumaya devam <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
