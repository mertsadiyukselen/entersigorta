'use client';
import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const guides = [
  {
    title: 'Trafik Sigortası Nedir?',
    body:
      'Trafiğe çıkan her aracın yaptırmak zorunda olduğu, üçüncü şahıslara verilecek maddi/bedeni zararları poliçe limitleri dahilinde karşılayan zorunlu sigorta türüdür.',
  },
  {
    title: 'Kasko ile Trafik Sigortası Arasındaki Fark',
    body:
      'Trafik sigortası karşı tarafı korur; kasko ise kendi aracınızdaki hasarları teminat altına alır. İkisi birbirini tamamlar.',
  },
  {
    title: 'Tamamlayıcı Sağlık Sigortası Nedir?',
    body:
      'SGK’nın karşıladığı hizmetlere ek olarak fark ücretlerini teminat altına alır. Anlaşmalı özel hastanelerde çok daha düşük maliyetle hizmet almanızı sağlar.',
  },
  {
    title: 'Konut Sigortası Neleri Kapsar?',
    body:
      'Konut, eşya ve üçüncü kişilere verilebilecek zararlar gibi birçok riski poliçe kapsamına göre güvenceye alır. Yangın, su baskını, hırsızlık gibi teminatlar eklenebilir.',
  },
  {
    title: 'DASK (Zorunlu Deprem Sigortası)',
    body:
      'Deprem ve deprem kaynaklı yangın, tsunami ve yer kayması gibi risklerin neden olacağı maddi zararları belirli limitler dahilinde karşılayan zorunlu sigortadır.',
  },
];

function AccordionItem({ title, body, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`faq-item ${open ? 'open' : ''} reveal active`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <svg className="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className="faq-answer" style={{ maxHeight: open ? '300px' : '0', padding: open ? '0 24px 20px' : '0 24px' }}>
        <p>{body}</p>
      </div>
    </div>
  );
}

export default function SigortaRehberiPage() {
  return (
    <>
      <SiteHeader activeKey="rehber" />

      <section className="kariyer-hero" style={{ paddingTop: 140 }}>
        <span className="hero-badge" style={{ position: 'relative' }}>
          📚 Sigorta Rehberi
        </span>
        <h1>
          Merak Ettiklerinizi
          <br />
          <span className="gradient-text">Hızla Öğrenin</span>
        </h1>
        <p>Kısa ve net anlatımlarla sigortayı daha kolay anlayın.</p>
        <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" href="/sigorta-teklif-al">
            Teklif Alın
          </Link>
          <Link className="btn btn-secondary" href="/sigorta-urunleri">
            Ürünleri İncele
          </Link>
        </div>
      </section>

      <section className="faq" style={{ paddingTop: 70 }}>
        <div className="container">
          <div className="section-header reveal active">
            <span className="section-tag">Bilgilendirme</span>
            <h2>Sık Sorulan Konular</h2>
            <p>En sık karşılaşılan soruların kısa cevapları.</p>
          </div>
          <div className="faq-list">
            {guides.map((g, i) => (
              <AccordionItem key={g.title} title={g.title} body={g.body} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

