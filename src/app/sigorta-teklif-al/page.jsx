'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const productOptions = [
  { value: 'trafik', label: 'Trafik Sigortası' },
  { value: 'kasko', label: 'Kasko Sigortası' },
  { value: 'saglik', label: 'Sağlık Sigortası' },
  { value: 'konut', label: 'Konut Sigortası' },
  { value: 'dask', label: 'DASK' },
  { value: 'bes', label: 'Bireysel Emeklilik (BES)' },
  { value: 'diger', label: 'Diğer' },
];

export default function TeklifAlPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    product: 'trafik',
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

    const detailedMessage = [`🧾 Ürün: ${productOptions.find((p) => p.value === formData.product)?.label || formData.product}`, formData.message]
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
          subject: 'teklif',
          message: detailedMessage,
        }),
      });

      if (res.ok) {
        setStatusMsg('✅ Talebiniz alındı! En kısa sürede teklif için dönüş yapacağız.');
        setFormData({ name: '', phone: '', email: '', product: 'trafik', message: '', kvkk: false });
      } else {
        setStatusMsg('❌ Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch {
      setStatusMsg('❌ Bağlantı hatası.');
    }
  };

  return (
    <>
      <nav className="navbar scrolled" style={{ top: 0 }}>
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <img src="/enter_sigorta.png" alt="Logo" className="brand-logo" />
          </Link>
          <ul className="nav-links">
            <li>
              <Link href="/" className="nav-link">
                Ana Sayfa
              </Link>
            </li>
            <li>
              <Link href="/sigorta-sube-basvurusu" className="nav-link">
                Şube Başvurusu
              </Link>
            </li>
            <li>
              <Link href="/sigorta-teklif-al" className="nav-link active">
                Teklif Al
              </Link>
            </li>
            <li>
              <Link href="/sigorta-urunleri" className="nav-link">
                Ürünler
              </Link>
            </li>
            <li>
              <Link href="/sigorta-rehberi" className="nav-link">
                Rehber
              </Link>
            </li>
          </ul>
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" className="nav-cta">
            WhatsApp
          </a>
        </div>
      </nav>

      <section className="kariyer-hero" style={{ paddingTop: 140 }}>
        <span className="hero-badge" style={{ position: 'relative' }}>
          🧾 Sigorta Teklif Al
        </span>
        <h1>
          En Doğru Sigortaya
          <br />
          <span className="gradient-text">Ulaşın</span>
        </h1>
        <p>Ürünü seçin, iletişim bilgilerinizi bırakın. Size özel teklifleri hazırlayalım.</p>
        <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <a className="btn btn-primary" href="#teklif-formu">
            Hemen Teklif Al
          </a>
          <Link className="btn btn-secondary" href="/sigorta-urunleri">
            Ürünleri İncele
          </Link>
        </div>
      </section>

      <section className="contact" id="teklif-formu" style={{ paddingTop: 70 }}>
        <div className="container">
          <div className="section-header reveal active">
            <span className="section-tag">Teklif Formu</span>
            <h2>Bilgilerinizi Doldurun</h2>
            <p>Talebiniz bize ulaştığında sizinle iletişime geçip en uygun seçenekleri paylaşırız.</p>
          </div>

          <div className="contact-layout" style={{ gridTemplateColumns: '1fr 1.2fr' }}>
            <div className="contact-info reveal active">
              <div className="info-card">
                <div className="info-icon">⚡</div>
                <div>
                  <h4>Hızlı Dönüş</h4>
                  <p>Mesai saatlerinde aynı gün dönüş hedefi.</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">🧩</div>
                <div>
                  <h4>Karşılaştırmalı Teklif</h4>
                  <p>Farklı şirketlerden seçenekleri yan yana sunarız.</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">🛡️</div>
                <div>
                  <h4>Hasar Desteği</h4>
                  <p>Poliçe süresince danışmanlık ve destek.</p>
                </div>
              </div>
              <div className="cta-actions" style={{ justifyContent: 'flex-start', marginTop: 8 }}>
                <a className="btn btn-primary" href={`https://wa.me/${whatsappNumber}`} target="_blank" style={{ background: '#25D366' }}>
                  WhatsApp’tan Yazın
                </a>
              </div>
            </div>

            <form className="contact-form reveal active" onSubmit={handleSubmit}>
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
                  <label htmlFor="product">Ürün</label>
                  <select id="product" value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })}>
                    {productOptions.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Not (Opsiyonel)</label>
                <textarea
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Örn: Plaka, konut m², yaş vb. bilgileri yazabilirsiniz."
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

              <button type="submit" className="btn btn-primary btn-full">
                Teklif İste
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
    </>
  );
}

