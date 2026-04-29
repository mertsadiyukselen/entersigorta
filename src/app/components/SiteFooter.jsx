'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SiteFooter() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  const whatsappNumber = settings.whatsapp_number || '903124260110';
  const instagramHandle = settings.instagram_handle || 'entersigorta';

  const companyPhone = settings.company_phone || '0 (312) 426 01 10';
  const companyEmail = settings.company_email || 'info@entersigorta.com';
  const companyAddress = settings.company_address || 'Çankaya Mah. Cinnah Cad. 75/8, Çankaya / ANKARA';

  return (
    <footer className="footer" style={{ marginTop: 0 }}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link href="/" className="footer-logo" aria-label="Ana sayfa">
              <img src="/enter_sigorta.png" alt="Logo" className="brand-logo-footer" />
            </Link>
            <p className="footer-desc">Sigorta ihtiyaçlarınız için hızlı teklif, destek ve çözüm. Her zaman yanınızdayız.</p>
          </div>

          <div className="footer-col">
            <h4>Hızlı Linkler</h4>
            <ul>
              <li>
                <Link href="/sigorta-urunleri">Sigorta Ürünleri</Link>
              </li>
              <li>
                <Link href="/sigorta-sube-basvurusu">Sigorta Şubesi Başvurusu</Link>
              </li>
              <li>
                <Link href="/sigorta-teklif-al">Teklif Al</Link>
              </li>
              <li>
                <Link href="/sigorta-rehberi">Sigorta Rehberi</Link>
              </li>
              <li>
                <Link href="/iletisim">İletişim</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Ürünler</h4>
            <ul>
              <li>
                <Link href="/sigorta-urunleri#arac">Araç Sigortaları</Link>
              </li>
              <li>
                <Link href="/sigorta-urunleri#saglik">Sağlık Sigortaları</Link>
              </li>
              <li>
                <Link href="/sigorta-urunleri#ev">Konut Sigortaları</Link>
              </li>
              <li>
                <Link href="/sigorta-urunleri#aile">Aile & Bireysel</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>İletişim</h4>
            <p>{companyAddress}</p>
            <p>{companyPhone}</p>
            <p>{companyEmail}</p>
          </div>
        </div>

        <div className="footer-bottom">
          <div style={{ textAlign: 'center', width: '100%' }}>
            <p>&copy; 2026 Enter Sigorta. Tüm hakları saklıdır.</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.6 }}>
              5N1K Sigorta Aracılık Hizmetleri LTD.ŞTİ.
            </p>
          </div>

          <div className="social-links" style={{ justifyContent: 'center', width: '100%', marginTop: '12px' }}>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" aria-label="WhatsApp" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a href={`https://instagram.com/${instagramHandle}`} target="_blank" aria-label="Instagram" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

