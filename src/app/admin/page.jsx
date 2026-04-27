import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

const subjectLabels = {
  sube: 'Şube Başvurusu',
  teklif: 'Sigorta Teklifi',
  kariyer: 'Kariyer Başvurusu',
  hasar: 'Hasar Bildirimi',
  diger: 'Diğer',
};

const subjectColors = {
  sube: { bg: '#dbeafe', color: '#1e40af' },
  teklif: { bg: '#fce7f3', color: '#be185d' },
  kariyer: { bg: '#d1fae5', color: '#065f46' },
  hasar: { bg: '#fef3c7', color: '#b45309' },
  diger: { bg: '#e2e8f0', color: '#475569' },
};

export default async function AdminDashboard({ searchParams }) {
  const filter = searchParams?.filter || 'all';
  
  const where = filter !== 'all' ? { subject: filter } : {};
  
  const applications = await prisma.application.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  // Stats
  const totalCount = await prisma.application.count();
  const subeCount = await prisma.application.count({ where: { subject: 'sube' } });
  const teklifCount = await prisma.application.count({ where: { subject: 'teklif' } });
  const hasarCount = await prisma.application.count({ where: { subject: 'hasar' } });
  const kariyerCount = await prisma.application.count({ where: { subject: 'kariyer' } });

  // Today's count
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = await prisma.application.count({
    where: { createdAt: { gte: today } }
  });

  const stats = [
    { label: 'Toplam Başvuru', value: totalCount, icon: '📊', color: '#3b82f6' },
    { label: 'Şube Başvurusu', value: subeCount, icon: '🏢', color: '#8b5cf6' },
    { label: 'Sigorta Teklifi', value: teklifCount, icon: '📋', color: '#ec4899' },
    { label: 'Kariyer', value: kariyerCount, icon: '👔', color: '#f59e0b' },
    { label: 'Bugün Gelen', value: todayCount, icon: '📅', color: '#10b981' },
  ];

  return (
    <div>
      <style>{`
        .dash-header {
          margin-bottom: 30px;
        }
        .dash-header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }
        .dash-header p {
          color: #64748b;
          margin-top: 4px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 22px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
        }
        .stat-card-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
        }
        .stat-card-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }
        .stat-card-label {
          font-size: 0.82rem;
          color: #64748b;
          margin-top: 2px;
        }
        .filter-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .filter-btn {
          padding: 8px 18px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          border: 1px solid #e2e8f0;
          color: #64748b;
          background: white;
        }
        .filter-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }
        .filter-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        .table-container {
          background: white;
          border-radius: 16px;
          padding: 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
          overflow: hidden;
        }
        .table-container table {
          width: 100%;
          border-collapse: collapse;
        }
        .table-container thead {
          background: #f8fafc;
        }
        .table-container th {
          padding: 14px 20px;
          text-align: left;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          border-bottom: 1px solid #f1f5f9;
        }
        .table-container td {
          padding: 16px 20px;
          font-size: 0.9rem;
          border-bottom: 1px solid #f8fafc;
          vertical-align: top;
        }
        .table-container tbody tr {
          transition: background 0.15s ease;
        }
        .table-container tbody tr:hover {
          background: #f8fafc;
        }
        .subject-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
        }
        .contact-cell {
          line-height: 1.6;
        }
        .contact-cell .phone {
          font-weight: 600;
          color: #0f172a;
        }
        .contact-cell .email {
          font-size: 0.82rem;
          color: #94a3b8;
        }
        .message-cell {
          max-width: 280px;
          color: #475569;
          line-height: 1.5;
        }
        .date-cell {
          color: #94a3b8;
          font-size: 0.82rem;
          white-space: nowrap;
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
        }
        .empty-state-icon {
          font-size: 3rem;
          margin-bottom: 16px;
          opacity: 0.5;
        }
      `}</style>

      <div className="dash-header">
        <h1>📊 Başvurular Dashboard</h1>
        <p>Site üzerinden gelen tüm başvuruları takip edin ve yönetin.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card-icon" style={{ background: s.color + '15', color: s.color }}>
              {s.icon}
            </div>
            <div>
              <div className="stat-card-value">{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <Link href="/admin" className={`filter-btn ${filter === 'all' ? 'active' : ''}`}>
          Tümü ({totalCount})
        </Link>
        <Link href="/admin?filter=sube" className={`filter-btn ${filter === 'sube' ? 'active' : ''}`}>
          🏢 Şube ({subeCount})
        </Link>
        <Link href="/admin?filter=teklif" className={`filter-btn ${filter === 'teklif' ? 'active' : ''}`}>
          📋 Teklif ({teklifCount})
        </Link>
        <Link href="/admin?filter=hasar" className={`filter-btn ${filter === 'hasar' ? 'active' : ''}`}>
          ⚠️ Hasar ({hasarCount})
        </Link>
      </div>

      {/* Table */}
      <div className="table-container">
        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>Henüz başvuru bulunmamaktadır</h3>
            <p>Yeni başvurular geldiğinde burada listelenecektir.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Ad Soyad</th>
                <th>İletişim</th>
                <th>Tip</th>
                <th>Mesaj</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const colors = subjectColors[app.subject] || subjectColors.diger;
                return (
                  <tr key={app.id}>
                    <td className="date-cell">
                      {new Date(app.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      <br/>
                      <span style={{ fontSize: '0.75rem' }}>{new Date(app.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{app.name}</td>
                    <td className="contact-cell">
                      <div className="phone">{app.phone}</div>
                      <div className="email">{app.email}</div>
                    </td>
                    <td>
                      <span className="subject-badge" style={{ background: colors.bg, color: colors.color }}>
                        {subjectLabels[app.subject] || app.subject}
                      </span>
                    </td>
                    <td className="message-cell">{app.message}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
