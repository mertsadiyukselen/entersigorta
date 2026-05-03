import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Get total counts for sidebar badges
  const totalApps = await prisma.application.count();
  const subeApps = await prisma.application.count({ where: { subject: 'sube' } });

  return (
    <div className="admin-wrapper">
      <style>{`
        .admin-wrapper {
          display: flex;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .admin-sidebar {
          width: 270px;
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0e1a 0%, #111827 100%);
          color: white;
          padding: 0;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 100;
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
        }
        .admin-sidebar-header {
          padding: 28px 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .admin-sidebar-brand {
          font-size: 1.3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #FF3366, #FF9933);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }
        .admin-sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.04);
          border-radius: 10px;
          font-size: 0.85rem;
        }
        .admin-sidebar-user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF3366, #FF9933);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 700;
        }
        .admin-sidebar nav {
          flex: 1;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .admin-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.92rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .admin-nav-link:hover {
          background: rgba(255,255,255,0.06);
          color: #fff;
        }
        .admin-nav-link .nav-badge {
          margin-left: auto;
          background: linear-gradient(135deg, #FF3366, #FF9933);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
        }
        .admin-nav-section {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #475569;
          padding: 16px 16px 8px;
        }
        .admin-sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .admin-logout {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 10px;
          color: #ef4444;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 500;
          transition: all 0.2s ease;
          width: 100%;
        }
        .admin-logout:hover {
          background: rgba(239,68,68,0.1);
        }
        .admin-main {
          flex: 1;
          margin-left: 270px;
          padding: 30px 40px;
          background: #f8fafc;
          color: #1e293b;
          min-height: 100vh;
        }
        @media (max-width: 768px) {
          .admin-sidebar { width: 60px; padding: 10px 0; }
          .admin-sidebar-header, .admin-nav-section, .admin-sidebar-user, .admin-sidebar-footer span { display: none; }
          .admin-nav-link span, .admin-nav-link .nav-badge { display: none; }
          .admin-nav-link { justify-content: center; padding: 14px; }
          .admin-main { margin-left: 60px; padding: 20px; }
        }
      `}</style>
      
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">Enter Sigorta</div>
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-user-avatar">A</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Admin</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{session.user?.email}</div>
            </div>
          </div>
        </div>
        
        <nav>
          <div className="admin-nav-section">Ana Menü</div>
          <Link href="/admin" className="admin-nav-link">
            📊 <span>Dashboard</span>
            <div className="nav-badge">{totalApps}</div>
          </Link>
          
          <div className="admin-nav-section">Başvuru Tipleri</div>
          <Link href="/admin?filter=sube" className="admin-nav-link">
            🏢 <span>Şube Başvuruları</span>
            <div className="nav-badge">{subeApps}</div>
          </Link>
          <Link href="/admin?filter=teklif" className="admin-nav-link">
            📋 <span>Sigorta Teklifleri</span>
          </Link>
          <Link href="/admin?filter=kariyer" className="admin-nav-link">
            👔 <span>Kariyer Başvuruları</span>
          </Link>
          <Link href="/admin?filter=hasar" className="admin-nav-link">
            ⚠️ <span>Hasar Bildirimleri</span>
          </Link>

          <div className="admin-nav-section">İçerik</div>
          <Link href="/admin/jobs" className="admin-nav-link">
            💼 <span>İlan Yönetimi</span>
          </Link>
          <Link href="/admin/banners" className="admin-nav-link">
            🖼️ <span>Banner Slider</span>
          </Link>
          <Link href="/admin/partner-logos" className="admin-nav-link">
            🏷️ <span>Şirket Logoları</span>
          </Link>
          <Link href="/admin/guides" className="admin-nav-link">
            📚 <span>Sigorta Rehberi</span>
          </Link>

          <div className="admin-nav-section">Sistem</div>
          <Link href="/admin/settings" className="admin-nav-link">
            ⚙️ <span>Ayarlar</span>
          </Link>
          <Link href="/kariyer" target="_blank" className="admin-nav-link">
            👔 <span>Kariyer Sayfası</span>
          </Link>
          <Link href="/" target="_blank" className="admin-nav-link">
            🌐 <span>Siteyi Görüntüle</span>
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/api/auth/signout" className="admin-logout">
            🚪 <span>Çıkış Yap</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
