'use client';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const sections = [
  {
    id: 'arac',
    tag: 'Aracımız İçin',
    title: 'Araç Sigortaları',
    items: [
      { icon: '🚗', title: 'Trafik Sigortası', desc: 'Zorunlu trafik sigortasında hızlı ve karşılaştırmalı teklif.' },
      { icon: '🛡️', title: 'Kasko Sigortası', desc: 'Çarpma, hırsızlık, sel gibi risklerde aracınızı koruyun.' },
      { icon: '🏍️', title: 'Motosiklet Sigortası', desc: 'Motosikletiniz için uygun teminat seçenekleri.' },
    ],
  },
  {
    id: 'saglik',
    tag: 'Sağlığımız İçin',
    title: 'Sağlık & Emeklilik',
    items: [
      { icon: '🏥', title: 'Tamamlayıcı Sağlık', desc: 'SGK anlaşmalı hastanelerde fark ödemeden hizmet.' },
      { icon: '✈️', title: 'Seyahat Sağlık', desc: 'Yurt içi/yurt dışı seyahatler için güvence.' },
      { icon: '📈', title: 'Bireysel Emeklilik (BES)', desc: 'Geleceğiniz için birikim ve devlet katkısı.' },
    ],
  },
  {
    id: 'ev',
    tag: 'Evimiz İçin',
    title: 'Konut Sigortaları',
    items: [
      { icon: '🏠', title: 'Konut Sigortası', desc: 'Ev, eşya ve sorumluluk teminatlarıyla kapsamlı koruma.' },
      { icon: '🏚️', title: 'DASK', desc: 'Zorunlu deprem sigortası için hızlı işlem.' },
    ],
  },
  {
    id: 'aile',
    tag: 'Ailemiz İçin',
    title: 'Aile & Bireysel',
    items: [
      { icon: '❤️', title: 'Hayat Sigortası', desc: 'Aileniz için finansal güvence.' },
      { icon: '👨‍👩‍👧‍👦', title: 'Ferdi Kaza', desc: 'Beklenmedik kazalara karşı teminat.' },
    ],
  },
];

export default function SigortaUrunleriPage() {
  return (
    <>
      <SiteHeader activeKey="urunler" />

      <section className="kariyer-hero" style={{ paddingTop: 140 }}>
        <span className="hero-badge" style={{ position: 'relative' }}>
          🧩 Sigorta Ürünleri
        </span>
        <h1>
          İhtiyacınıza Uygun
          <br />
          <span className="gradient-text">Sigortayı Seçin</span>
        </h1>
        <p>Ürünleri inceleyin, dilediğiniz ürün için hızlı teklif alın.</p>
        <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" href="/sigorta-teklif-al">
            Teklif Alın
          </Link>
          <Link className="btn btn-secondary" href="/sigorta-rehberi">
            Rehberi Oku
          </Link>
        </div>
      </section>

      {sections.map((sec, idx) => (
        <section key={sec.id} className="services" id={sec.id} style={{ background: idx % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-primary)' }}>
          <div className="container">
            <div className="section-header reveal active">
              <span className="section-tag">{sec.tag}</span>
              <h2>{sec.title}</h2>
              <p>Detaylar ve fiyat için hemen teklif alabilirsiniz.</p>
            </div>
            <div className="services-grid">
              {sec.items.map((it) => (
                <div key={it.title} className="service-card reveal active">
                  <div className="service-icon" style={{ fontSize: '2rem' }}>
                    {it.icon}
                  </div>
                  <h3>{it.title}</h3>
                  <p>{it.desc}</p>
                  <Link href="/sigorta-teklif-al" className="service-link">
                    Teklif Al →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <SiteFooter />
    </>
  );
}

