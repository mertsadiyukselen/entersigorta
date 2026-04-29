'use client';
import { useEffect, useMemo, useState } from 'react';

const emptyForm = {
  title: '',
  subtitle: '',
  description: '',
  imageUrl: '',
  primaryCtaText: '',
  primaryCtaHref: '',
  secondaryCtaText: '',
  secondaryCtaHref: '',
  sortOrder: 0,
  isActive: true,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const sortedBanners = useMemo(() => {
    return [...banners].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || b.id - a.id);
  }, [banners]);

  const fetchBanners = () => {
    setLoading(true);
    fetch('/api/banners?all=1')
      .then((res) => res.json())
      .then((data) => {
        setBanners(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const reset = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
  };

  const openCreate = () => {
    setForm({ ...emptyForm, sortOrder: sortedBanners.length ? Math.max(...sortedBanners.map((b) => b.sortOrder ?? 0)) + 1 : 0 });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (banner) => {
    setEditing(banner);
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      imageUrl: banner.imageUrl || '',
      primaryCtaText: banner.primaryCtaText || '',
      primaryCtaHref: banner.primaryCtaHref || '',
      secondaryCtaText: banner.secondaryCtaText || '',
      secondaryCtaHref: banner.secondaryCtaHref || '',
      sortOrder: banner.sortOrder ?? 0,
      isActive: banner.isActive !== false,
    });
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.imageUrl.trim()) return;

    setSaving(true);
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing.id } : form;

    await fetch('/api/banners', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, sortOrder: Number(form.sortOrder) }),
    });

    setSaving(false);
    reset();
    fetchBanners();
  };

  const remove = async (id) => {
    if (!confirm('Bu banner silinsin mi?')) return;
    await fetch(`/api/banners?id=${id}`, { method: 'DELETE' });
    fetchBanners();
  };

  const toggle = async (banner) => {
    await fetch('/api/banners', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...banner, isActive: !banner.isActive }),
    });
    fetchBanners();
  };

  return (
    <div>
      <style>{`
        .header {
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          gap:16px;
          flex-wrap:wrap;
          margin-bottom:24px;
        }
        .header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          color:#0f172a;
          margin:0;
        }
        .header p { color:#64748b; margin:6px 0 0; }
        .btnPrimary {
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:12px 22px;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          color:white;
          border:0;
          border-radius:12px;
          font-weight:800;
          cursor:pointer;
        }
        .card {
          background:white;
          border:1px solid #f1f5f9;
          border-radius:16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          overflow:hidden;
        }
        .grid {
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap:16px;
        }
        .field { margin-bottom: 14px; }
        .field label { display:block; font-weight:700; font-size:0.85rem; color:#334155; margin-bottom:6px; }
        .field input, .field textarea {
          width:100%;
          padding:11px 14px;
          border:1.5px solid #e2e8f0;
          border-radius:10px;
          font-size:0.92rem;
          background:#fafbfc;
        }
        .field textarea { min-height: 90px; resize: vertical; }
        .rowActions { display:flex; gap:10px; margin-top:10px; flex-wrap:wrap; }
        .btn { padding:10px 14px; border-radius:10px; border:1px solid #e2e8f0; background:white; cursor:pointer; font-weight:700; font-size:0.85rem; }
        .btnDanger { border-color: rgba(239,68,68,0.35); color:#ef4444; }
        .table { width:100%; border-collapse:collapse; }
        .table th { text-align:left; padding:14px 18px; background:#f8fafc; color:#64748b; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.5px; }
        .table td { padding:16px 18px; border-top:1px solid #f1f5f9; vertical-align:top; }
        .badge {
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:4px 10px;
          border-radius:999px;
          font-weight:800;
          font-size:0.75rem;
        }
        .badgeOn { background: rgba(34,197,94,0.12); color:#166534; cursor:pointer; }
        .badgeOff { background: rgba(245,158,11,0.14); color:#92400e; cursor:pointer; }
        .preview {
          width: 120px;
          height: 64px;
          border-radius: 10px;
          background: #0b0b0b;
          border: 1px solid #e2e8f0;
          overflow:hidden;
        }
        .preview img { width:100%; height:100%; object-fit:cover; }
        @media (max-width: 900px) {
          .grid { grid-template-columns: 1fr; }
          .preview { width: 100%; height: 160px; }
        }
      `}</style>

      <div className="header">
        <div>
          <h1>🖼️ Banner Slider Yönetimi</h1>
          <p>Ana sayfadaki slider içeriklerini buradan yönetin. Görsel için URL veya `/banner/1.jpg` gibi public yol kullanabilirsiniz.</p>
        </div>
        <button className="btnPrimary" onClick={openCreate}>
          ➕ Yeni Banner
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 22, marginBottom: 20, border: '2px solid #0f172a' }}>
          <form onSubmit={save}>
            <div className="grid">
              <div>
                <div className="field">
                  <label>Başlık *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Örn: Sigortacılığa Başlamanın Tam Zamanı" required />
                </div>
                <div className="field">
                  <label>Alt Başlık</label>
                  <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Örn: Türkiye'nin En Büyük Acentesiyle" />
                </div>
                <div className="field">
                  <label>Açıklama</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Kısa açıklama..." />
                </div>
              </div>
              <div>
                <div className="field">
                  <label>Görsel URL *</label>
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="/banners/hero-1.jpg veya https://..." required />
                </div>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="field">
                    <label>Birincil Buton</label>
                    <input value={form.primaryCtaText} onChange={(e) => setForm({ ...form, primaryCtaText: e.target.value })} placeholder="Örn: Hemen Başvurun" />
                    <input style={{ marginTop: 8 }} value={form.primaryCtaHref} onChange={(e) => setForm({ ...form, primaryCtaHref: e.target.value })} placeholder="/sigorta-sube-basvurusu" />
                  </div>
                  <div className="field">
                    <label>İkincil Buton</label>
                    <input value={form.secondaryCtaText} onChange={(e) => setForm({ ...form, secondaryCtaText: e.target.value })} placeholder="Örn: Teklif Alın" />
                    <input style={{ marginTop: 8 }} value={form.secondaryCtaHref} onChange={(e) => setForm({ ...form, secondaryCtaHref: e.target.value })} placeholder="/sigorta-teklif-al" />
                  </div>
                </div>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="field">
                    <label>Sıra</label>
                    <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Durum</label>
                    <select value={form.isActive ? '1' : '0'} onChange={(e) => setForm({ ...form, isActive: e.target.value === '1' })} style={{ width: '100%', padding: 11, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fafbfc' }}>
                      <option value="1">Aktif</option>
                      <option value="0">Pasif</option>
                    </select>
                  </div>
                </div>
                <div className="preview">
                  {form.imageUrl ? <img src={form.imageUrl} alt="Preview" /> : null}
                </div>
              </div>
            </div>

            <div className="rowActions">
              <button type="submit" className="btnPrimary" disabled={saving}>
                {saving ? '⏳ Kaydediliyor...' : editing ? '💾 Güncelle' : '✅ Oluştur'}
              </button>
              <button type="button" className="btn" onClick={reset}>
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div style={{ padding: 28, color: '#64748b' }}>Yükleniyor...</div>
        ) : sortedBanners.length === 0 ? (
          <div style={{ padding: 28, color: '#64748b' }}>Henüz banner eklenmemiş.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Önizleme</th>
                <th>Başlık</th>
                <th>Sıra</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {sortedBanners.map((b) => (
                <tr key={b.id}>
                  <td style={{ width: 150 }}>
                    <div className="preview" title={b.imageUrl}>
                      <img src={b.imageUrl} alt={b.title} />
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{b.title}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 4 }}>{b.subtitle || ''}</div>
                  </td>
                  <td style={{ fontWeight: 800 }}>{b.sortOrder ?? 0}</td>
                  <td>
                    <span className={`badge ${b.isActive ? 'badgeOn' : 'badgeOff'}`} onClick={() => toggle(b)} title="Tıklayarak değiştir">
                      {b.isActive ? '✅ Aktif' : '⏸️ Pasif'}
                    </span>
                  </td>
                  <td>
                    <button className="btn" onClick={() => openEdit(b)}>
                      ✏️ Düzenle
                    </button>
                    <button className="btn btnDanger" onClick={() => remove(b.id)} style={{ marginLeft: 8 }}>
                      🗑️ Sil
                    </button>
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

