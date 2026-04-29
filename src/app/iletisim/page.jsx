'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }} className="reveal active">
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

            <div className="map-container" style={{ marginTop: 0, height: '100%', minHeight: '420px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3061.2720235284067!2d32.85501867664654!3d39.89056638753235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34f9a0cba5cd9%3A0x6b7724bc2f8ba29d!2sCinnah%20Cd.%20No%3A75%2C%2006690%20%C3%87ankaya%2FAnkara!5e0!3m2!1str!2str!4v1712760000000!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '420px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

