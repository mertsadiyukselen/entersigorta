'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export default function SubeBasvurusuPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    experience: '',
    segem: '',
    currentJob: '',
    education: '',
    message: '',
    kvkk: false,
  });
  const [statusMsg, setStatusMsg] = useState('');
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  const whatsappNumber = settings.whatsapp_number || '903124260110';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('Gönderiliyor...');

    const detailedMessage = [
      formData.city ? `📍 İl/İlçe: ${formData.city}` : '',
      formData.experience ? `📊 Tecrübe: ${formData.experience}` : '',
      formData.segem ? `📜 SEGEM: ${formData.segem}` : '',
      formData.currentJob ? `💼 Mevcut Meslek: ${formData.currentJob}` : '',
      formData.education ? `🎓 Eğitim: ${formData.education}` : '',
      formData.message ? `💬 Not: ${formData.message}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          subject: 'sube',
          message: detailedMessage,
        }),
      });

      if (res.ok) {
        setStatusMsg('✅ Başvurunuz alındı! En kısa sürede sizinle iletişime geçeceğiz.');
        setFormData({
          name: '',
          phone: '',
          email: '',
          city: '',
          experience: '',
          segem: '',
          currentJob: '',
          education: '',
          message: '',
          kvkk: false,
        });
      } else {
        setStatusMsg('❌ Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch {
      setStatusMsg('❌ Bağlantı hatası.');
    }
  };

  return (
    <>
      <SiteHeader activeKey="sube" />

      <section className="kariyer-hero" style={{ paddingTop: 140 }}>
        <span className="hero-badge" style={{ position: 'relative' }}>
          🏢 Sigorta Şube Başvurusu
        </span>
        <h1>
          Sigorta Şubemiz Olmak İçin
          <br />
          <span className="gradient-text">Başvurun</span>
        </h1>
        <p>Bilgilerinizi bırakın, ekibimiz sizi arayıp süreç ve şartlar hakkında bilgi versin.</p>
        <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <a className="btn btn-primary" href="#basvuru-formu">
            Form Doldur
          </a>
          <Link className="btn btn-secondary" href="/sigorta-teklif-al">
            Teklif Alın
          </Link>
        </div>
      </section>

      <section className="partner-section" id="basvuru-formu" style={{ paddingTop: 70 }}>
        <div className="container">
          <div className="section-header reveal active">
            <span className="section-tag">Başvuru Formu</span>
            <h2>Bilgilerinizi Doldurun</h2>
            <p>Değerlendirme sonrası sizinle iletişime geçip detayları paylaşacağız.</p>
          </div>

          <div className="partner-grid">
            <div className="partner-content reveal active">
              <ul className="partner-features">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Yetkili acente ağı ve operasyon desteği
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Tek noktadan karşılaştırmalı teklif imkânı
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Eğitim, kurulum ve sürekli danışmanlık
                </li>
              </ul>
              <div className="cta-actions" style={{ justifyContent: 'flex-start' }}>
                <a className="btn btn-primary" href={`https://wa.me/${whatsappNumber}`} target="_blank">
                  WhatsApp’tan Yazın
                </a>
                <Link className="btn btn-secondary" href="/sigorta-urunleri">
                  Ürünleri İncele
                </Link>
              </div>
            </div>

            <form className="contact-form reveal active" onSubmit={handleSubmit}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: 10, textAlign: 'center' }}>📋 Başvuru Formu</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Ad Soyad</label>
                  <input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Adınız Soyadınız"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Telefon</label>
                  <input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="05XX XXX XX XX"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">E-posta</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">İl / İlçe</label>
                  <input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Örn: Ankara / Çankaya"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="experience">Tecrübeniz Var mı?</label>
                  <select
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="Var">Var</option>
                    <option value="Yok">Yok</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="segem">SEGEM Belgeniz Var mı?</label>
                  <select
                    id="segem"
                    value={formData.segem}
                    onChange={(e) => setFormData({ ...formData, segem: e.target.value })}
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="Evet">Evet</option>
                    <option value="Hayır">Hayır</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Mesajınız</label>
                <textarea
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Kısaca bilgi verin..."
                />
              </div>

              <div className="form-group" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <input
                  id="kvkk"
                  type="checkbox"
                  checked={formData.kvkk}
                  onChange={(e) => setFormData({ ...formData, kvkk: e.target.checked })}
                  style={{ width: 18, height: 18, marginTop: 4 }}
                  required
                />
                <label htmlFor="kvkk" style={{ margin: 0 }}>
                  Kişisel verilerimin işlenmesini kabul ediyorum (KVKK).
                </label>
              </div>

              <button className="btn btn-primary btn-full" type="submit">
                Başvur
              </button>

              {statusMsg && (
                <p
                  style={{
                    marginTop: 14,
                    textAlign: 'center',
                    fontWeight: 700,
                    color: statusMsg.includes('✅') ? '#22c55e' : 'var(--accent-red)',
                  }}
                >
                  {statusMsg}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

