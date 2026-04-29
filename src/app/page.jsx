'use client';
import { useEffect, useState } from 'react';
import HeroSlider from './components/HeroSlider';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: 'sube', city: '', experience: '', segem: '', currentJob: '', education: '', message: '' });
  const [statusMsg, setStatusMsg] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState({});
  
  useEffect(() => {
    // Fetch dynamic settings (WhatsApp, Instagram)
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {});

    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 500);
      }, 1200);
    }
    
    // Scroll reveal + navbar
    const reveals = document.querySelectorAll('.reveal');
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      reveals.forEach(reveal => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - 80) {
          reveal.classList.add('active');
        }
      });
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    // Counter animation
    const counters = document.querySelectorAll('.stat-number');
    const animateCounters = () => {
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 60;
        let current = 0;
        const update = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.ceil(current);
            requestAnimationFrame(update);
          } else {
            counter.textContent = target;
          }
        };
        update();
      });
    };
    setTimeout(animateCounters, 1500);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('Gönderiliyor...');

    // Serialize extra fields into message for DB storage
    const detailedMessage = [
      formData.city ? `📍 İl/İlçe: ${formData.city}` : '',
      formData.experience ? `📊 Sektör Tecrübesi: ${formData.experience}` : '',
      formData.segem ? `📜 SEGEM Sertifikası: ${formData.segem}` : '',
      formData.currentJob ? `💼 Mevcut Meslek: ${formData.currentJob}` : '',
      formData.education ? `🎓 Eğitim Durumu: ${formData.education}` : '',
      formData.message ? `💬 Ek Not: ${formData.message}` : '',
    ].filter(Boolean).join('\n');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          subject: formData.subject,
          message: detailedMessage || formData.message,
        })
      });
      if(res.ok) {
        setStatusMsg('✅ Başvurunuz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.');
        setFormData({ name: '', phone: '', email: '', subject: 'sube', city: '', experience: '', segem: '', currentJob: '', education: '', message: '' });
      } else {
        setStatusMsg('❌ Bir hata oluştu, lütfen tekrar deneyin.');
      }
    } catch(err) {
      setStatusMsg('❌ Bağlantı hatası.');
    }
  };

  const whatsappNumber = settings.whatsapp_number || '903124260110';
  const instagramHandle = settings.instagram_handle || 'entersigorta';

  return (
    <>
      {/* PRELOADER */}
      <div className="preloader" id="preloader">
        <div className="preloader-content">
          <img src="/enter_sigorta.png" alt="Enter Sigorta" className="preloader-logo" />
          <div className="preloader-spinner"></div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="nav-container">
          <a href="#hero" className="nav-logo">
            <img src="/enter_sigorta.png" alt="Enter Sigorta Logo" className="brand-logo" />
          </a>
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#hero" className="nav-link active" onClick={() => setIsMenuOpen(false)}>Ana Sayfa</a></li>
            <li><a href="/sigorta-sube-basvurusu" className="nav-link" onClick={() => setIsMenuOpen(false)}>Sigorta Şube Başvurusu</a></li>
            <li><a href="/sigorta-teklif-al" className="nav-link" onClick={() => setIsMenuOpen(false)}>Sigorta Teklif Al</a></li>
            <li
              className={`nav-dropdown ${openDropdown === 'urunler' ? 'open' : ''}`}
              onMouseEnter={() => setOpenDropdown('urunler')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className="nav-link nav-link-button"
                aria-haspopup="menu"
                aria-expanded={openDropdown === 'urunler'}
                onClick={() => setOpenDropdown(openDropdown === 'urunler' ? null : 'urunler')}
              >
                Sigorta Ürünleri
                <svg className="nav-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <div className="dropdown-panel" role="menu" aria-label="Sigorta Ürünleri">
                <div className="dropdown-grid">
                  <div className="dropdown-col">
                    <div className="dropdown-title">Aracımız İçin</div>
                    <a className="dropdown-link" href="/sigorta-urunleri#arac" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>Kasko Sigortası</a>
                    <a className="dropdown-link" href="/sigorta-urunleri#arac" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>Trafik Sigortası</a>
                    <a className="dropdown-link" href="/sigorta-urunleri#arac" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>Motosiklet Sigortası</a>
                  </div>
                  <div className="dropdown-col">
                    <div className="dropdown-title">Sağlığımız İçin</div>
                    <a className="dropdown-link" href="/sigorta-urunleri#saglik" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>Tamamlayıcı Sağlık</a>
                    <a className="dropdown-link" href="/sigorta-urunleri#saglik" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>Bireysel Emeklilik</a>
                    <a className="dropdown-link" href="/sigorta-urunleri#saglik" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>Seyahat Sağlık</a>
                  </div>
                  <div className="dropdown-col">
                    <div className="dropdown-title">Evimiz İçin</div>
                    <a className="dropdown-link" href="/sigorta-urunleri#ev" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>DASK</a>
                    <a className="dropdown-link" href="/sigorta-urunleri#ev" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>Konut Sigortası</a>
                  </div>
                  <div className="dropdown-col">
                    <div className="dropdown-title">Ailemiz İçin</div>
                    <a className="dropdown-link" href="/sigorta-urunleri#aile" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>Hayat Sigortası</a>
                    <a className="dropdown-link" href="/sigorta-urunleri#aile" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>Ferdi Kaza</a>
                  </div>
                </div>
              </div>
            </li>
            <li><a href="/kariyer" className="nav-link" onClick={() => setIsMenuOpen(false)}>Kariyer</a></li>
            <li><a href="/sigorta-rehberi" className="nav-link" onClick={() => setIsMenuOpen(false)}>Sigorta Rehberi</a></li>
            <li><a href="/iletisim" className="nav-link" onClick={() => setIsMenuOpen(false)}>İletişim</a></li>
          </ul>
          <a href="/sigorta-teklif-al" className="nav-cta">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/></svg>
            Hemen Teklif Alın
          </a>
          <button className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menüyü aç">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* TOP BAR - Telefon & Sosyal Medya */}
      <div className="top-bar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href={`tel:+${whatsappNumber}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ccc', fontSize: '0.85rem' }}>
            📞 {whatsappNumber.replace(/(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3 $4 $5')}
          </a>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <a href={`https://instagram.com/${instagramHandle}`} target="_blank" aria-label="Instagram" style={{ color: '#ccc' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/></svg>
            </a>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" aria-label="WhatsApp" style={{ color: '#25D366' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* HERO - Sigorta Şubesi Başvurusu Odaklı */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>
        <div className="hero-content reveal">
          <HeroSlider
            fallbackSlide={{
              title: 'Sigortacılığa Başlamanın Tam Zamanı',
              subtitle: "Türkiye'nin En Büyük Acentesiyle",
              description:
                'Şube başvurusu, teklif alma ve ürünlerde avantajlı fiyatlarla hızlı çözümler. Her zaman yanınızdayız.',
              imageUrl: '/enter_sigorta.png',
              primaryCtaText: 'Hemen Başvurun',
              primaryCtaHref: '/sigorta-sube-basvurusu',
              secondaryCtaText: 'Teklif Alın',
              secondaryCtaHref: '/sigorta-teklif-al',
              isActive: true,
            }}
          />
          <div className="hero-quickcards">
            <a className="quickcard" href="#sube-basvurusu">
              <div className="quickcard-icon">🏢</div>
              <div className="quickcard-body">
                <div className="quickcard-title">Sigorta Şube Başvurusu</div>
                <div className="quickcard-text">Kendi işinizi kurmak için hemen başvurun.</div>
              </div>
              <div className="quickcard-cta">Form Doldur →</div>
            </a>
            <a className="quickcard" href="#teklif">
              <div className="quickcard-icon">🧾</div>
              <div className="quickcard-body">
                <div className="quickcard-title">Sigorta Teklif Al</div>
                <div className="quickcard-text">Avantajlı fiyatlarla poliçeni seç.</div>
              </div>
              <div className="quickcard-cta">Hemen Teklif →</div>
            </a>
            <a className="quickcard" href="/kariyer">
              <div className="quickcard-icon">🧑‍💼</div>
              <div className="quickcard-body">
                <div className="quickcard-title">Kariyer</div>
                <div className="quickcard-text">Takım arkadaşımız olun.</div>
              </div>
              <div className="quickcard-cta">Başvur →</div>
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number" data-target="36">0</span>
              <span className="stat-label">Güçlü Sigorta Şirketi</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" data-target="81">0</span>
              <span className="stat-label">Şehirdeyiz</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" data-target="500">0</span>+
              <span className="stat-label">Sigorta Şubesi</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="trust-badges">
        <div className="container line-badges">
          <div className="badge-item reveal" style={{ '--delay': '0.1s' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>%100 Güvenli</span>
          </div>
          <div className="badge-item reveal" style={{ '--delay': '0.2s' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>7/24 Destek</span>
          </div>
          <div className="badge-item reveal" style={{ '--delay': '0.3s' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>Hızlı Poliçe</span>
          </div>
          <div className="badge-item reveal" style={{ '--delay': '0.4s' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span>En İyi Fiyat</span>
          </div>
        </div>
      </section>

      {/* SİGORTA ŞİRKETLERİMİZ */}
      <section className="partners" id="sirketlerimiz">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Sigorta Şirketlerimiz</span>
            <h2>Geniş İş Ortağı Ağı</h2>
            <p>Farklı şirketlerin ürünlerini karşılaştırmalı şekilde sunarak ihtiyacınıza en uygun poliçeyi seçmenizi kolaylaştırıyoruz.</p>
          </div>
        </div>
        <div className="partners-marquee">
          <div className="marquee-track">
            {[
              'Allianz', 'Axa', 'Anadolu', 'HDI', 'Mapfre', 'Sompo', 'Neova', 'Quick',
              'Türkiye Sigorta', 'Ray', 'Bereket', 'Zurich', 'Groupama', 'Türk Nippon', 'Hepiyi',
              'Koru', 'Doğa', 'Güneş', 'Eureko', 'Dubai Starr',
              'Allianz', 'Axa', 'Anadolu', 'HDI', 'Mapfre', 'Sompo', 'Neova', 'Quick',
              'Türkiye Sigorta', 'Ray', 'Bereket', 'Zurich', 'Groupama', 'Türk Nippon', 'Hepiyi',
              'Koru', 'Doğa', 'Güneş', 'Eureko', 'Dubai Starr',
            ].map((name, i) => (
              <div className="partner-logo reveal" style={{ '--delay': `${0.04 * (i % 8)}s` }} key={i}>
                <div className="partner-mark" aria-hidden="true">
                  {name.trim().slice(0, 2).toUpperCase()}
                </div>
                <span className="partner-name">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SİGORTA ŞUBESİ BAŞVURUSU - ANA BÖLÜM ========== */}
      <section className="partner-section" id="sube-basvurusu">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Kurumsal İş Ortaklığı</span>
            <h2>Sigorta Şubesi Olmak İçin<br/><span className="gradient-text">Başvurun</span></h2>
            <p>Güçlü kurumsal altyapımız, geniş sigorta şirketi entegrasyonumuz ve anında destek ekibimizle işletmenizi bir adım ileriye taşıyın.</p>
          </div>
          <div className="partner-grid">
            <div className="partner-content reveal">
              <ul className="partner-features">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Doğrudan Yetkili Acente Statüsü</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> 30+ Sigorta Şirketi Ağı</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Prestijli Kurumsal Tabela & Kurulum Desteği</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Özel Hasar & Teknik Destek Ekibi</li>
              </ul>
              <div className="partner-graphics" style={{ marginTop: '30px' }}>
                <div className="partner-glass-card pc-1 reveal" style={{ '--delay': '0.2s' }}>
                  <div className="pc-icon">🏢</div>
                  <div>
                    <h4>Kendi İşiniz</h4>
                    <p>Tüm branşlarda tam yetki</p>
                  </div>
                </div>
                <div className="partner-glass-card pc-2 reveal" style={{ '--delay': '0.3s' }}>
                  <div className="pc-icon">📈</div>
                  <div>
                    <h4>Operasyon Desteği</h4>
                    <p>Kurulumdan satışa her adımda yanınızdayız</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BAŞVURU FORMU */}
            <form className="contact-form reveal" onSubmit={handleSubmit} style={{ '--delay': '0.2s' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '6px', textAlign: 'center', color: '#fff' }}>📋 Sigorta Şubesi Başvuru Formu</h3>
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>Aşağıdaki bilgileri eksiksiz doldurarak başvurunuzu tamamlayın.</p>
              
              {/* Kişisel Bilgiler */}
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '18px', marginBottom: '18px' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>👤 Kişisel Bilgiler</p>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Ad Soyad</label>
                    <input type="text" id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Adınız Soyadınız" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Telefon</label>
                    <input type="tel" id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="05XX XXX XX XX" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">E-posta</label>
                    <input type="email" id="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="ornek@email.com" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">Başvuru Yapılacak İl / İlçe</label>
                    <input type="text" id="city" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="Örn: Ankara / Çankaya" required />
                  </div>
                </div>
              </div>

              {/* Mesleki Bilgiler */}
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '18px', marginBottom: '18px' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>💼 Mesleki Bilgiler</p>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="experience">Sigorta Sektörü Tecrübeniz</label>
                    <select id="experience" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} required>
                      <option value="">Seçiniz</option>
                      <option value="Tecrübem yok">Tecrübem yok, yeni başlayacağım</option>
                      <option value="1 yıldan az">1 yıldan az</option>
                      <option value="1-3 yıl">1-3 yıl</option>
                      <option value="3-5 yıl">3-5 yıl</option>
                      <option value="5-10 yıl">5-10 yıl</option>
                      <option value="10+ yıl">10 yıldan fazla</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="segem">SEGEM Sertifikanız Var Mı?</label>
                    <select id="segem" value={formData.segem} onChange={e => setFormData({...formData, segem: e.target.value})} required>
                      <option value="">Seçiniz</option>
                      <option value="Evet, mevcut">Evet, SEGEM sertifikam var</option>
                      <option value="Hayır, almayı planlıyorum">Hayır, almayı planlıyorum</option>
                      <option value="Sürecim devam ediyor">Sürecim devam ediyor</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="currentJob">Mevcut Mesleğiniz</label>
                    <input type="text" id="currentJob" value={formData.currentJob} onChange={e => setFormData({...formData, currentJob: e.target.value})} placeholder="Örn: Sigortacı, Muhasebeci, Öğretmen..." />
                  </div>
                  <div className="form-group">
                    <label htmlFor="education">Eğitim Durumu</label>
                    <select id="education" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})}>
                      <option value="">Seçiniz</option>
                      <option value="Lise">Lise</option>
                      <option value="Ön Lisans">Ön Lisans</option>
                      <option value="Lisans">Lisans</option>
                      <option value="Yüksek Lisans">Yüksek Lisans / Doktora</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Ek Notlar */}
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>📝 Ek Bilgiler</p>
              <div className="form-group">
                <label htmlFor="message">Eklemek İstediğiniz Notlar (İsteğe Bağlı)</label>
                <textarea id="message" rows="3" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Varsa eklemek istediğiniz bilgiler..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-full">
                <span>Başvurumu Gönder</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>
              </button>
              {statusMsg && <p style={{ marginTop: '15px', color: statusMsg.includes('✅') ? '#4caf50' : '#ff5252', textAlign:'center', fontWeight: 'bold', fontSize: '0.95rem' }}>{statusMsg}</p>}
            </form>
          </div>
        </div>
      </section>

      {/* TEKLİF AL */}
      <section className="services" id="teklif">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">En Doğru Sigortaya Ulaşın</span>
            <h2>Teklif Alın</h2>
            <p>Avantajlı fiyatlarla sigortanızı yaptırmak için hemen teklif alın.</p>
          </div>
          <div className="mini-offer reveal" style={{ '--delay': '0.15s' }}>
            <div className="mini-offer-left">
              <div className="mini-offer-title">Tüm Sigorta Ürünlerinde En Uygun Fiyat Fırsatı</div>
              <div className="mini-offer-text">Kısa bilgi bırakın, ekibimiz en uygun seçenekleri sizin için hazırlasın.</div>
            </div>
            <div className="mini-offer-actions">
              <a className="btn btn-primary" href={`https://wa.me/${whatsappNumber}`} target="_blank">WhatsApp’tan Teklif</a>
              <a className="btn btn-secondary" href="#urunler">Ürünlere Git</a>
            </div>
          </div>
        </div>
      </section>

      {/* ÜRÜNLER */}
      <section className="services" id="urunler">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Sigorta Ürünleri</span>
            <h2>Popüler Ürünler</h2>
            <p>Konut, sağlık ve araç sigortalarında hızlı teklif.</p>
          </div>
          <div className="services-grid">
            <div className="service-card reveal" style={{ '--delay': '0.1s' }}>
              <div className="service-icon" style={{ fontSize: '2rem' }}>🏠</div>
              <h3>Konut Sigortası</h3>
              <p>Evinizi, eşyalarınızı ve sorumluluklarınızı güvenceye alın.</p>
              <a href="#teklif" className="service-link">Teklif Al →</a>
            </div>
            <div className="service-card reveal" style={{ '--delay': '0.2s' }}>
              <div className="service-icon" style={{ fontSize: '2rem' }}>🏥</div>
              <h3>Sağlık Sigortası</h3>
              <p>Özel hastanede tedavi; uygun primlerle hızlı çözüm.</p>
              <a href="#teklif" className="service-link">Teklif Al →</a>
            </div>
            <div className="service-card reveal" style={{ '--delay': '0.3s' }}>
              <div className="service-icon" style={{ fontSize: '2rem' }}>🚗</div>
              <h3>Trafik Sigortası</h3>
              <p>Zorunlu trafik sigortasında en uygun seçenekleri karşılaştırın.</p>
              <a href="#teklif" className="service-link">Teklif Al →</a>
            </div>
            <div className="service-card reveal" style={{ '--delay': '0.4s' }}>
              <div className="service-icon" style={{ fontSize: '2rem' }}>🛡️</div>
              <h3>Kasko Sigortası</h3>
              <p>Çarpma, hırsızlık, sel gibi risklerde kaskonuz yanınızda.</p>
              <a href="#teklif" className="service-link">Teklif Al →</a>
            </div>
          </div>
        </div>
      </section>

      {/* NEDEN BİZ */}
      <section className="why-us" id="neden-biz">
        <div className="container">
          <div className="why-us-layout">
            <div className="why-us-left reveal">
              <span className="big-number">3</span>
              <h2>Enter Sigorta'yı <br/>Tercih Etmeniz İçin <br/><span className="gradient-text">3 Güçlü Neden</span></h2>
            </div>
            <div className="why-us-right">
              <div className="why-card reveal" style={{ '--delay': '0.1s' }}>
                <div className="why-card-icon">
                  <svg viewBox="0 0 32 32" fill="none"><path d="M16 4l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <h3>30+ Sigorta Şirketi</h3>
                  <p>Türkiye'nin en güçlü sigorta şirketlerinin ürünlerini tek çatı altında karşılaştırmalı olarak sunuyoruz.</p>
                </div>
              </div>
              <div className="why-card reveal" style={{ '--delay': '0.2s' }}>
                <div className="why-card-icon">
                  <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M6 28c0-5 4-9 10-9s10 4 10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <div>
                  <h3>Profesyonel Destek</h3>
                  <p>Hasar anında, yenileme süreçlerinde ve tüm ihtiyaçlarınızda uzman kadromuzla 7/24 yanınızdayız.</p>
                </div>
              </div>
              <div className="why-card reveal" style={{ '--delay': '0.3s' }}>
                <div className="why-card-icon">
                  <svg viewBox="0 0 32 32" fill="none"><path d="M8 16h16M16 8v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><rect x="4" y="4" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="1.5"/></svg>
                </div>
                <div>
                  <h3>Sigorta Şubesi Fırsatı</h3>
                  <p>Sigorta sektöründe kendi işinizi kurmak istiyorsanız, sigorta şubemiz olarak ailemize katılın.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="faq" id="sss">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Merak Edilenler</span>
            <h2>Sıkça Sorulan Sorular</h2>
          </div>
          <div className="faq-list">
            {[
              { q: 'Sigorta şubesi nasıl olunur?', a: 'Sigorta şubesi olmak için formumuzu doldurmanız yeterlidir. Uzman ekibimiz başvurunuzu değerlendirip sizinle iletişime geçecektir. Tüm yasal süreçlerde ve kurulum aşamasında yanınızdayız.' },
              { q: 'Zorunlu Trafik Sigortası nedir?', a: 'Trafiğe çıkan her aracın yaptırmak zorunda olduğu, karşı tarafa verilecek zararları karşılayan zorunlu sigorta türüdür.' },
              { q: 'Kasko ve Trafik Sigortası arasındaki fark nedir?', a: 'Trafik sigortası karşı tarafa verilen zararları karşılarken, kasko kendi aracınızdaki hasarları teminat altına alır. İkisi birbirini tamamlar.' },
              { q: 'Tamamlayıcı Sağlık Sigortası nedir?', a: 'SGK tarafından karşılanmayan veya kısmen karşılanan sağlık giderlerini teminat altına alır. Fark ücreti ödemeden özel hastanelerde tedavi olabilirsiniz.' },
              { q: 'Hangi sigorta şirketleriyle çalışıyorsunuz?', a: 'HDI, Mapfre, Neova, Quick, Türk Nippon, Axa, Allianz, Sompo Japan ve daha birçok güçlü sigorta şirketi ile çalışmaktayız.' },
            ].map((item, i) => (
              <FaqItem key={i} question={item.q} answer={item.a} delay={`${0.1 + i * 0.05}s`} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-box reveal">
            <div className="cta-content">
              <h2>Hemen Şube Başvurunuzu Yapın</h2>
              <p>Sigorta sektöründe kendi işinizin patronu olun. Detaylı bilgi ve başvuru için bize ulaşın.</p>
            </div>
            <div className="cta-actions">
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" className="btn btn-primary" style={{ background:'#25D366', boxShadow:'0 4px 20px rgba(37,211,102,0.3)' }}>WhatsApp'tan Yazın</a>
              <a href="#sube-basvurusu" className="btn btn-secondary" style={{ borderColor:'rgba(255,255,255,0.5)', color:'#fff' }}>Form Doldurun</a>
            </div>
          </div>
        </div>
      </section>

      {/* İLETİŞİM BİLGİLERİ */}
      <section className="contact" id="iletisim">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">İletişim</span>
            <h2>Bize Ulaşın</h2>
            <p>Sorularınız için bize ulaşın, en kısa sürede dönüş yapalım.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }} className="reveal">
            {/* Sol: İletişim Kartları */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="info-card" style={{ flexDirection: 'column', textAlign: 'center', padding: '28px 20px' }}>
                <div className="info-icon" style={{ width: '52px', height: '52px', margin: '0 auto 12px', background: 'linear-gradient(135deg, rgba(218,41,28,0.15), rgba(255,90,54,0.1))', borderRadius: '14px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="1.5" style={{ width: '24px', height: '24px' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>Adres</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Çankaya Mah. Cinnah Cad. 75/8<br/>Çankaya / ANKARA</p>
              </div>
              <div className="info-card" style={{ flexDirection: 'column', textAlign: 'center', padding: '28px 20px' }}>
                <div className="info-icon" style={{ width: '52px', height: '52px', margin: '0 auto 12px', background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))', borderRadius: '14px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="1.5" style={{ width: '24px', height: '24px' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>Telefon</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>0 (312) 426 01 10</p>
              </div>
              <div className="info-card" style={{ flexDirection: 'column', textAlign: 'center', padding: '28px 20px' }}>
                <div className="info-icon" style={{ width: '52px', height: '52px', margin: '0 auto 12px', background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(234,88,12,0.1))', borderRadius: '14px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" style={{ width: '24px', height: '24px' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>E-posta</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>info@entersigorta.com</p>
              </div>
              <div className="info-card" style={{ flexDirection: 'column', textAlign: 'center', padding: '28px 20px' }}>
                <div className="info-icon" style={{ width: '52px', height: '52px', margin: '0 auto 12px', background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))', borderRadius: '14px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" style={{ width: '24px', height: '24px' }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>Çalışma Saatleri</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Pzt-Cum: 08:00 - 18:00<br/>Cmts: 09:00 - 16:00</p>
              </div>
            </div>
            {/* Sağ: Harita */}
            <div className="map-container" style={{ marginTop: 0, height: '100%', minHeight: '400px' }}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3061.2720235284067!2d32.85501867664654!3d39.89056638753235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34f9a0cba5cd9%3A0x6b7724bc2f8ba29d!2sCinnah%20Cd.%20No%3A75%2C%2006690%20%C3%87ankaya%2FAnkara!5e0!3m2!1str!2str!4v1712760000000!5m2!1str!2str" width="100%" height="100%" style={{ border:0, minHeight:'400px' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <a href="#hero" className="footer-logo">
                <img src="/enter_sigorta.png" alt="Enter Sigorta Logo" className="brand-logo-footer" />
              </a>
              <p className="footer-desc">Uzman kadromuzla 7/24 kesintisiz hizmet vererek, sigorta ihtiyaçlarınız için yanınızdayız.</p>
            </div>
            <div className="footer-col">
              <h4>Hızlı Linkler</h4>
              <ul>
                <li><a href="/sigorta-urunleri">Sigorta Ürünleri</a></li>
                <li><a href="#neden-biz">Neden Biz</a></li>
                <li><a href="/sigorta-sube-basvurusu">Sigorta Şubesi Başvurusu</a></li>
                <li><a href="#sss">SSS</a></li>
                <li><a href="/iletisim">İletişim</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Ürünlerimiz</h4>
              <ul>
                <li><a href="/sigorta-urunleri#arac">Araç Sigortaları</a></li>
                <li><a href="/sigorta-urunleri#saglik">Sağlık Sigortaları</a></li>
                <li><a href="/sigorta-urunleri#ev">Konut Sigortaları</a></li>
                <li><a href="/sigorta-urunleri#arac">Kasko & Trafik</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>İletişim</h4>
              <p>Çankaya Mah. Cinnah Cad. 75/8<br/>Çankaya / ANKARA</p>
              <p>0 (312) 426 01 10</p>
              <p>info@entersigorta.com</p>
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
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href={`https://instagram.com/${instagramHandle}`} target="_blank" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOATING */}
      <a href={`https://wa.me/${whatsappNumber}`} target="_blank" className="whatsapp-float">
        <span className="whatsapp-text">Bize Yazın!</span>
        <div className="whatsapp-icon-bg">
          <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </div>
      </a>

      {/* COOKIE BANNER */}
      <CookieBanner />


    </>
  );
}

function FaqItem({ question, answer, delay }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''} reveal`} style={{ '--delay': delay }}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{question}</span>
        <svg className="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)' }}><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div className="faq-answer" style={{ maxHeight: open ? '300px' : '0', padding: open ? '0 24px 20px' : '0 24px', overflow: 'hidden', transition: 'all 0.4s ease' }}>
        <p>{answer}</p>
      </div>
    </div>
  );
}

function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('cookies_accepted')) {
      setTimeout(() => setShow(true), 2000);
    }
  }, []);
  if (!show) return null;
  return (
    <div className="cookie-banner show">
      <div className="cookie-content">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/></svg>
        <p>Çerez (cookie) kullanıyoruz. Devam etmeniz <strong>Çerez Politikamızı</strong> kabul ettiğiniz anlamına gelir.</p>
      </div>
      <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }} onClick={() => { localStorage.setItem('cookies_accepted', 'true'); setShow(false); }}>Kabul Et</button>
    </div>
  );
}
