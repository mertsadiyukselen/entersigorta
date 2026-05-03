import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import RehberArticleGrid from '../components/RehberArticleGrid';
import FaqBlock from './FaqBlock';
import { prisma } from '../../lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sigorta Rehberi | Enter Sigorta',
  description: 'Tarih ve kategoriyle düzenlenmiş sigorta yazıları, kısa bilgilendirme notları.',
};

export default async function SigortaRehberiPage() {
  let articles = [];
  try {
    articles = await prisma.guideArticle.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        publishedAt: true,
      },
    });
  } catch {
    articles = [];
  }

  const serialized = articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    publishedAt: a.publishedAt.toISOString(),
  }));

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
        <p>Kategorili yazılarla sigortayı daha kolay anlayın.</p>
        <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" href="/sigorta-teklif-al">
            Teklif Alın
          </Link>
          <Link className="btn btn-secondary" href="/sigorta-urunleri">
            Ürünleri İncele
          </Link>
          <Link className="btn btn-secondary" href="/kariyer">
            Kariyer
          </Link>
        </div>
      </section>

      <section className="rehber-list-section">
        <div className="container">
          <div className="section-header reveal active">
            <span className="section-tag">Makaleler</span>
            <h2>Rehber Yazıları</h2>
            <p>Tarih ve kategoriye göre filtreleyin; detaya tıklayarak tam metni okuyun.</p>
          </div>
          <RehberArticleGrid articles={serialized} />
        </div>
      </section>

      <FaqBlock />

      <SiteFooter />
    </>
  );
}
