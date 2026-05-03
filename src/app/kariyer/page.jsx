'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const typeLabels = {
  'tam-zamanli': 'Tam Zamanlı',
  'yari-zamanli': 'Yarı Zamanlı',
  'staj': 'Staj',
};

const deptLabels = {
  'satis': 'Satış & Pazarlama',
  'hasar': 'Hasar Yönetimi',
  'muhasebe': 'Muhasebe & Finans',
  'yonetim': 'Yönetim',
  'it': 'Bilgi Teknolojileri',
  'diger': 'Diğer',
};

const deptIcons = {
  'satis': '📊',
  'hasar': '🛡️',
  'muhasebe': '💰',
  'yonetim': '👔',
  'it': '💻',
  'diger': '📋',
};

export default function KariyerPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => { setJobs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <SiteHeader activeKey="kariyer" />

      <section className="kariyer-hero">
        <span className="hero-badge" style={{ position: 'relative' }}>👔 Kariyer Fırsatları</span>
        <h1>Enter Sigorta'da<br/><span className="gradient-text">Kariyer Yapın</span></h1>
        <p>Sigorta sektörünün dinamik dünyasında yerinizi alın. Açık pozisyonlarımızı inceleyin ve ekibimize katılın.</p>
      </section>

      <section className="container kariyer-rehber-banner" style={{ maxWidth: 900, marginTop: -32, marginBottom: 8 }}>
        <div className="kariyer-rehber-inner">
          <div>
            <span className="kariyer-rehber-tag">Kariyer rehberi</span>
            <h2 className="kariyer-rehber-title">Sektörü tanımadan başvuru mu?</h2>
            <p className="kariyer-rehber-text">
              Sigorta rehberimizde sektör, ürünler ve meslek yolu hakkında kısa yazıları okuyabilirsiniz—özellikle &quot;Sigorta acentesinde kariyer&quot; yazısı yeni başlayanlar için.
            </p>
          </div>
          <Link href="/sigorta-rehberi" className="btn btn-secondary kariyer-rehber-btn">
            Rehbere Git →
          </Link>
        </div>
      </section>

      <section className="jobs-section">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            <div className="preloader-spinner" style={{ margin: '0 auto 16px', width: '30px', height: '30px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-red)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            Yükleniyor...
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-jobs">
            <div className="empty-jobs-icon">💼</div>
            <h3>Şu anda açık pozisyon bulunmamaktadır</h3>
            <p>Yeni pozisyonlar açıldığında bu sayfada listelenecektir. Sosyal medya hesaplarımızı takip ederek güncel kalabilirsiniz.</p>
            <Link href="/" className="btn btn-secondary" style={{ marginTop: '20px', display: 'inline-flex' }}>Ana Sayfaya Dön</Link>
          </div>
        ) : (
          <>
            <p className="jobs-count">📋 {jobs.length} açık pozisyon bulundu</p>
            {jobs.map(job => (
              <div key={job.id} className="job-card" onClick={() => setSelectedJob(job)}>
                <div className="job-icon">
                  {deptIcons[job.department] || '📋'}
                </div>
                <div className="job-info">
                  <h3>{job.title}</h3>
                  <div className="job-tags">
                    <span className="job-tag location">📍 {job.location}</span>
                    <span className="job-tag type">⏰ {typeLabels[job.type] || job.type}</span>
                    <span className="job-tag dept">{deptLabels[job.department] || job.department}</span>
                  </div>
                </div>
                <div className="job-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </div>
            ))}
          </>
        )}
      </section>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="job-modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="job-modal" onClick={e => e.stopPropagation()}>
            <button className="job-modal-close" onClick={() => setSelectedJob(null)}>✕</button>
            <div className="job-tags" style={{ marginBottom: '16px' }}>
              <span className="job-tag location">📍 {selectedJob.location}</span>
              <span className="job-tag type">⏰ {typeLabels[selectedJob.type] || selectedJob.type}</span>
              <span className="job-tag dept">{deptLabels[selectedJob.department] || selectedJob.department}</span>
            </div>
            <h2>{selectedJob.title}</h2>
            
            <div className="job-modal-section">
              <h4>Pozisyon Açıklaması</h4>
              <p>{selectedJob.description}</p>
            </div>

            <div className="job-modal-section">
              <h4>Aranan Nitelikler</h4>
              <ul>
                {selectedJob.requirements.split('\n').filter(Boolean).map((req, i) => (
                  <li key={i}>{req.replace(/^[-•]\s*/, '')}</li>
                ))}
              </ul>
            </div>

            <a href={`mailto:kariyer@entersigorta.com?subject=Başvuru: ${selectedJob.title}`} className="job-apply-btn">
              📧 Bu Pozisyona Başvur
            </a>
          </div>
        </div>
      )}

      <SiteFooter />
    </>
  );
}
