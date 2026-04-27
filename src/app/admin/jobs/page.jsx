'use client';
import { useEffect, useState } from 'react';

const typeOptions = [
  { value: 'tam-zamanli', label: 'Tam Zamanlı' },
  { value: 'yari-zamanli', label: 'Yarı Zamanlı' },
  { value: 'staj', label: 'Staj' },
];

const deptOptions = [
  { value: 'satis', label: 'Satış & Pazarlama' },
  { value: 'hasar', label: 'Hasar Yönetimi' },
  { value: 'muhasebe', label: 'Muhasebe & Finans' },
  { value: 'yonetim', label: 'Yönetim' },
  { value: 'it', label: 'Bilgi Teknolojileri' },
  { value: 'diger', label: 'Diğer' },
];

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', location: '', type: 'tam-zamanli', department: 'satis',
    description: '', requirements: '', isActive: true
  });

  const fetchJobs = () => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => { setJobs(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const resetForm = () => {
    setForm({ title: '', location: '', type: 'tam-zamanli', department: 'satis', description: '', requirements: '', isActive: true });
    setEditingJob(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const method = editingJob ? 'PUT' : 'POST';
    const body = editingJob ? { ...form, id: editingJob.id } : form;
    
    await fetch('/api/jobs', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    setSaving(false);
    resetForm();
    fetchJobs();
  };

  const handleEdit = (job) => {
    setForm({
      title: job.title,
      location: job.location,
      type: job.type,
      department: job.department,
      description: job.description,
      requirements: job.requirements,
      isActive: job.isActive
    });
    setEditingJob(job);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/jobs?id=${id}`, { method: 'DELETE' });
    fetchJobs();
  };

  const handleToggleActive = async (job) => {
    await fetch('/api/jobs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...job, isActive: !job.isActive }),
    });
    fetchJobs();
  };

  return (
    <div>
      <style>{`
        .jobs-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .jobs-header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
        }
        .jobs-header p {
          color: #64748b;
          margin-top: 4px;
        }
        .add-job-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #8b5cf6, #6d28d9);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .add-job-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139,92,246,0.3);
        }
        .job-form-card {
          background: white;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 2px solid #8b5cf6;
        }
        .job-form-card h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 20px;
        }
        .jf-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .jf-field {
          margin-bottom: 16px;
        }
        .jf-field label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 6px;
        }
        .jf-field input, .jf-field select, .jf-field textarea {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.9rem;
          color: #0f172a;
          transition: all 0.2s;
          background: #fafbfc;
        }
        .jf-field input:focus, .jf-field select:focus, .jf-field textarea:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
        }
        .jf-field textarea {
          min-height: 100px;
          resize: vertical;
        }
        .jf-field .hint {
          font-size: 0.75rem;
          color: #94a3b8;
          margin-top: 4px;
        }
        .jf-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .jf-submit {
          padding: 12px 28px;
          background: linear-gradient(135deg, #8b5cf6, #6d28d9);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9rem;
        }
        .jf-cancel {
          padding: 12px 28px;
          background: #f1f5f9;
          color: #64748b;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9rem;
        }
        .jobs-table {
          background: white;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
          overflow: hidden;
        }
        .jobs-table table {
          width: 100%;
          border-collapse: collapse;
        }
        .jobs-table thead { background: #f8fafc; }
        .jobs-table th {
          padding: 14px 20px;
          text-align: left;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          border-bottom: 1px solid #f1f5f9;
        }
        .jobs-table td {
          padding: 16px 20px;
          font-size: 0.9rem;
          border-bottom: 1px solid #f8fafc;
          vertical-align: middle;
        }
        .jobs-table tbody tr:hover { background: #f8fafc; }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .status-active { background: #d1fae5; color: #065f46; }
        .status-inactive { background: #fef3c7; color: #92400e; }
        .action-btn {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          transition: all 0.15s;
          margin-right: 6px;
          font-family: inherit;
        }
        .action-btn:hover { border-color: #8b5cf6; color: #8b5cf6; }
        .action-btn.delete:hover { border-color: #ef4444; color: #ef4444; }
        .empty-jobs-admin {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
        }
        @media (max-width: 768px) {
          .jf-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="jobs-header">
        <div>
          <h1>💼 İlan Yönetimi</h1>
          <p>Kariyer sayfasında görünecek iş ilanlarını yönetin.</p>
        </div>
        <button className="add-job-btn" onClick={() => { resetForm(); setShowForm(true); }}>
          ➕ Yeni İlan Ekle
        </button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="job-form-card">
          <h3>{editingJob ? '✏️ İlanı Düzenle' : '➕ Yeni İlan Oluştur'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="jf-row">
              <div className="jf-field">
                <label>Pozisyon Başlığı *</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Örn: Satış Danışmanı" required />
              </div>
              <div className="jf-field">
                <label>Lokasyon *</label>
                <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Örn: Ankara / Çankaya" required />
              </div>
            </div>
            <div className="jf-row">
              <div className="jf-field">
                <label>Çalışma Şekli</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="jf-field">
                <label>Departman</label>
                <select value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                  {deptOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="jf-field">
              <label>Pozisyon Açıklaması *</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Pozisyonun detaylı açıklamasını yazın..." required />
            </div>
            <div className="jf-field">
              <label>Aranan Nitelikler *</label>
              <textarea value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} placeholder="Her niteliği yeni satırda yazın:&#10;- En az 2 yıl tecrübe&#10;- SEGEM sertifikası&#10;- İyi derecede iletişim becerisi" required />
              <div className="hint">Her niteliği yeni satırda, başına - koyarak yazın</div>
            </div>
            <div className="jf-actions">
              <button type="submit" className="jf-submit" disabled={saving}>
                {saving ? '⏳ Kaydediliyor...' : editingJob ? '💾 Güncelle' : '✅ İlan Oluştur'}
              </button>
              <button type="button" className="jf-cancel" onClick={resetForm}>İptal</button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs Table */}
      <div className="jobs-table">
        {loading ? (
          <div className="empty-jobs-admin">Yükleniyor...</div>
        ) : jobs.length === 0 ? (
          <div className="empty-jobs-admin">
            <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.4 }}>💼</div>
            <h3 style={{ color: '#475569', marginBottom: '8px' }}>Henüz ilan eklenmemiş</h3>
            <p>"Yeni İlan Ekle" butonuna tıklayarak ilk ilanınızı oluşturun.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Pozisyon</th>
                <th>Lokasyon</th>
                <th>Tip</th>
                <th>Durum</th>
                <th>Tarih</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{job.title}</td>
                  <td>{job.location}</td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {typeOptions.find(o => o.value === job.type)?.label || job.type}
                  </td>
                  <td>
                    <span 
                      className={`status-badge ${job.isActive ? 'status-active' : 'status-inactive'}`}
                      onClick={() => handleToggleActive(job)}
                      title="Tıklayarak durumu değiştirin"
                    >
                      {job.isActive ? '✅ Aktif' : '⏸️ Pasif'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    {new Date(job.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => handleEdit(job)}>✏️ Düzenle</button>
                    <button className="action-btn delete" onClick={() => handleDelete(job.id)}>🗑️ Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
