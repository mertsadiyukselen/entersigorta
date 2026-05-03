'use client';

import { useState } from 'react';

const faqItems = [
  {
    title: 'Policeyi nereden yönetirim?',
    body: 'Teklif sürecinden poliçe kesimine kadar danışmanınız size yönlendirme yapar; dijital kanallardan da süreçlerinizi takip edebilirsiniz.',
  },
  {
    title: 'Hasar anında ne yapmalıyım?',
    body: 'Güvenliğinizi sağladıktan sonra hasarı fotoğraflayın, iletişim bilgilerini alın ve en kısa sürede bize ya da şirkete bildirin.',
  },
  {
    title: 'Teminatları nereden okuyabilirim?',
    body: 'Her poliçede teminat özeti bulunur. Detay için poliçe şartnamesi ve başvuru formunu incelemeniz önemlidir.',
  },
];

function AccordionItem({ title, body, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`faq-item ${open ? 'open' : ''} reveal active`}>
      <button type="button" className="faq-question" onClick={() => setOpen(!open)}>
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

export default function FaqBlock() {
  return (
    <section className="faq" style={{ paddingTop: 48, paddingBottom: 100 }}>
      <div className="container">
        <div className="section-header reveal active">
          <span className="section-tag">İpuçları</span>
          <h2>Hızlı Cevaplar</h2>
          <p>Poliçe ve bildirimlerle ilgili kısa notlar.</p>
        </div>
        <div className="faq-list">
          {faqItems.map((g, i) => (
            <AccordionItem key={g.title} title={g.title} body={g.body} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
