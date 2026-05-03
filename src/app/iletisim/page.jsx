'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import OfficeMap from '../components/OfficeMap';

export default function IletisimPage() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  const companyPhone = settings.company_phone || '0 (312) 426 01 10';
  const companyEmail = settings.company_email || 'info@entersigorta.com';
  const companyAddress = settings.company_address || 'Çankaya Mah. Cinnah Cad. 75/8, Çankaya / ANKARA';
  const whatsappNumber = settings.whatsapp_number || '903124260110';

  return (
    <>
      <SiteHeader activeKey="iletisim" />

      <section className="kariyer-hero" style={{ paddingTop: 140 }}>
        <span className="hero-badge" style={{ position: 'relative' }}>
          📞 İletişim
        </span>
        <h1>
          Her Zaman
          <br />
          <span className="gradient-text">Yanınızdayız</span>
        </h1>
        <p>Soru ve talepleriniz için bize ulaşabilirsiniz.</p>
      </section>

      <section className="contact" style={{ paddingTop: 70 }}>
        <div className="container">
          <div className="section-header reveal active">
            <span className="section-tag">Bize Ulaşın</span>
            <h2>İletişim Bilgileri</h2>
            <p>Telefon, e-posta veya WhatsApp üzerinden hızlıca iletişime geçin.</p>
          </div>

          <div className="contact-split reveal active">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="info-card" style={{ flexDirection: 'column', textAlign: 'center', padding: '28px 20px' }}>
                <div className="info-icon" style={{ width: '52px', height: '52px', margin: '0 auto 12px', background: 'rgba(229, 9, 20, 0.14)', borderRadius: '14px' }}>
                  📍
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>Adres</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{companyAddress}</p>
              </div>
              <div className="info-card" style={{ flexDirection: 'column', textAlign: 'center', padding: '28px 20px' }}>
                <div className="info-icon" style={{ width: '52px', height: '52px', margin: '0 auto 12px', background: 'rgba(255,255,255,0.06)', borderRadius: '14px' }}>
                  📞
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>Telefon</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{companyPhone}</p>
              </div>
              <div className="info-card" style={{ flexDirection: 'column', textAlign: 'center', padding: '28px 20px' }}>
                <div className="info-icon" style={{ width: '52px', height: '52px', margin: '0 auto 12px', background: 'rgba(255,255,255,0.06)', borderRadius: '14px' }}>
                  ✉️
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>E-posta</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{companyEmail}</p>
              </div>
              <div className="info-card" style={{ flexDirection: 'column', textAlign: 'center', padding: '28px 20px' }}>
                <div className="info-icon" style={{ width: '52px', height: '52px', margin: '0 auto 12px', background: 'rgba(37,211,102,0.14)', borderRadius: '14px' }}>
                  💬
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>WhatsApp</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Hızlı destek için yazın</p>
                <a className="service-link" style={{ marginTop: 10, justifyContent: 'center' }} href={`https://wa.me/${whatsappNumber}`} target="_blank">
                  WhatsApp’a Git →
                </a>
              </div>
            </div>

            <OfficeMap address={`${companyAddress} (Çankaya / ANKARA)`} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

