'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: 'Ana Sayfa', key: 'home' },
  { href: '/sigorta-sube-basvurusu', label: 'Şube Başvurusu', key: 'sube' },
  { href: '/sigorta-teklif-al', label: 'Teklif Al', key: 'teklif' },
  { href: '/sigorta-urunleri', label: 'Ürünler', key: 'urunler' },
  { href: '/sigorta-rehberi', label: 'Rehber', key: 'rehber' },
  { href: '/kariyer', label: 'Kariyer', key: 'kariyer' },
  { href: '/iletisim', label: 'İletişim', key: 'iletisim' },
];

export default function SiteHeader({ activeKey = '' }) {
  const [settings, setSettings] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const whatsappNumber = settings.whatsapp_number || '903124260110';

  return (
    <nav className="navbar scrolled" style={{ top: 0 }}>
      <div className="nav-container">
        <Link href="/" className="nav-logo" aria-label="Ana sayfa" onClick={() => setIsMenuOpen(false)}>
          <img src="/enter_sigorta.png" alt="Logo" className="brand-logo" />
        </Link>

        <ul id="site-header-nav" className={`nav-links ${isMenuOpen ? 'active' : ''}`} aria-label="Ana menü">
          {navItems.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className={`nav-link ${activeKey === item.key ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" className="nav-cta" rel="noreferrer">
          WhatsApp
        </a>

        <button
          type="button"
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen((o) => !o)}
          aria-expanded={isMenuOpen}
          aria-controls="site-header-nav"
          aria-label={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

