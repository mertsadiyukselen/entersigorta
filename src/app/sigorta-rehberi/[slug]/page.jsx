import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import GuideMarkdown from '../../components/GuideMarkdown';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const slug = decodeURIComponent(params.slug);
  const row = await prisma.guideArticle.findFirst({
    where: { slug, isActive: true },
    select: { title: true, excerpt: true },
  });
  return {
    title: row?.title ? `${row.title} | Enter Sigorta` : 'Rehber',
    description: row?.excerpt || 'Sigorta rehberi',
  };
}

export default async function GuideArticlePage({ params }) {
  const slug = decodeURIComponent(params.slug);

  const article = await prisma.guideArticle.findFirst({
    where: { slug, isActive: true },
  });

  if (!article) {
    notFound();
  }

  const dateFmt = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <>
      <SiteHeader activeKey="rehber" />

      <article className="guide-article-shell">
        <div className="container" style={{ maxWidth: 760, paddingTop: 120, paddingBottom: 48 }}>
          <nav aria-label="Breadcrumb" className="guide-breadcrumb">
            <Link href="/sigorta-rehberi">Sigorta Rehberi</Link>
            <span aria-hidden="true"> / </span>
            <span>{article.category}</span>
          </nav>

          <header className="guide-article-head">
            <div className="guide-article-meta">
              <time dateTime={article.publishedAt.toISOString()}>{dateFmt}</time>
              <span className="guide-article-catpill">{article.category}</span>
            </div>
            <h1 className="guide-article-title">{article.title}</h1>
            {article.excerpt ? (
              <p className="guide-article-lead">{article.excerpt}</p>
            ) : null}
          </header>

          <GuideMarkdown>{article.body}</GuideMarkdown>

          <footer className="guide-article-foot">
            <Link href="/sigorta-teklif-al" className="btn btn-primary">
              Teklif Alın
            </Link>
            <Link href="/sigorta-rehberi" className="btn btn-secondary">
              Tüm yazılar
            </Link>
          </footer>
        </div>
      </article>

      <SiteFooter />
    </>
  );
}
