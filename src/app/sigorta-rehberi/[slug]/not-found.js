import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';

export default function GuideNotFound() {
  return (
    <>
      <SiteHeader activeKey="rehber" />
      <section className="kariyer-hero" style={{ paddingTop: 160, minHeight: '50vh' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Yazı bulunamadı</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 12 }}>
          Aradığınız rehber yazısı yayından kaldırılmış veya bağlantı hatalı olabilir.
        </p>
        <Link href="/sigorta-rehberi" className="btn btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>
          Rehbere dön
        </Link>
      </section>
      <SiteFooter />
    </>
  );
}
