'use client';
import { useEffect, useMemo, useState } from 'react';

const emptyForm = {
  name: '',
  imageUrl: '',
  linkUrl: '',
  sortOrder: 0,
  isActive: true,
};

export default function AdminPartnerLogosPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [uploadStatus, setUploadStatus] = useState('');

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || b.id - a.id);
  }, [items]);

  const fetchItems = () => {
    setLoading(true);
    fetch('/api/partner-logos?all=1')
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const reset = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
  };

  const openCreate = () => {
    setForm({
      ...emptyForm,
      sortOrder: sorted.length ? Math.max(...sorted.map((b) => b.sortOrder ?? 0)) + 1 : 0,
    });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name || '',
      imageUrl: row.imageUrl || '',
      linkUrl: row.linkUrl || '',
      sortOrder: row.sortOrder ?? 0,
      isActive: row.isActive !== false,
    });
    setShowForm(true);
  };

  const imageUrlEffective = () => (form.imageUrl.trim() ? form.imageUrl.trim() : editing?.imageUrl?.trim?.() || '');

  const onUploadLogo = async (ev) => {
    const file = ev.target.files?.[0];
    ev.target.value = '';
    if (!file) return;
    setUploadStatus('⏳ Yükleniyor…');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload/partner-logo', { method: 'POST', body: fd, credentials: 'same-origin' });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setUploadStatus(`❌ ${json.error || 'Yükleme başarısız'}`);
      return;
    }
    setForm({ ...form, imageUrl: json.url || '' });
    setUploadStatus('✓ Yüklendi');
    setTimeout(() => setUploadStatus(''), 2500);
  };

  const save = async (e) => {
    e.preventDefault();
    const logoUrl = imageUrlEffective();
    if (!form.name.trim() || !logoUrl) return;

    setSaving(true);
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing.id } : form;

    await fetch('/api/partner-logos', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, imageUrl: logoUrl, sortOrder: Number(form.sortOrder) }),
    });

    setSaving(false);
    reset();
    fetchItems();
  };

  const remove = async (id) => {
    if (!confirm('Bu logo silinsin mi?')) return;
    await fetch(`/api/partner-logos?id=${id}`, { method: 'DELETE' });
    fetchItems();
  };

  const toggle = async (row) => {
    await fetch('/api/partner-logos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...row, isActive: !row.isActive }),
    });
    fetchItems();
  };

  return (
    <div>
      <style>{`
        .header{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:24px}
        .header h1{font-size:1.8rem;font-weight:800;color:#0f172a;margin:0}
        .header p{color:#64748b;margin:6px 0 0}
        .btnPrimary{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;border:0;border-radius:12px;font-weight:800;cursor:pointer}
        .card{background:#fff;border:1px solid #f1f5f9;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,.05);overflow:hidden}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .field{margin-bottom:14px}
        .field label{display:block;font-weight:700;font-size:.85rem;color:#334155;margin-bottom:6px}
        .field input,.field select{width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:.92rem;background:#fafbfc}
        .rowActions{display:flex;gap:10px;margin-top:10px;flex-wrap:wrap}
        .btn{padding:10px 14px;border-radius:10px;border:1px solid #e2e8f0;background:#fff;cursor:pointer;font-weight:700;font-size:.85rem}
        .btnDanger{border-color:rgba(239,68,68,.35);color:#ef4444}
        .table{width:100%;border-collapse:collapse}
        .table th{text-align:left;padding:14px 18px;background:#f8fafc;color:#64748b;font-size:.78rem;text-transform:uppercase;letter-spacing:.5px}
        .table td{padding:16px 18px;border-top:1px solid #f1f5f9;vertical-align:top}
        .badge{display:inline-flex;align-items:center;gap:8px;padding:4px 10px;border-radius:999px;font-weight:800;font-size:.75rem}
        .badgeOn{background:rgba(34,197,94,.12);color:#166534;cursor:pointer}
        .badgeOff{background:rgba(245,158,11,.14);color:#92400e;cursor:pointer}
        .preview{width:140px;height:64px;border-radius:12px;background:#0b0b0b;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .preview img{width:100%;height:100%;object-fit:contain;background:#fff}
        @media (max-width:900px){.grid{grid-template-columns:1fr}.preview{width:100%;height:120px}}
      `}</style>

      <div className="header">
        <div>
          <h1>🏷️ Şirket Logoları</h1>
          <p>Ana sayfadaki “Sigorta Şirketlerimiz” bölümünde gösterilecek logoları buradan yönetin.</p>
        </div>
        <button className="btnPrimary" onClick={openCreate}>
          ➕ Yeni Logo
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 22, marginBottom: 20, border: '2px solid #0f172a' }}>
          <form onSubmit={save}>
            <div className="grid">
              <div>
                <div className="field">
                  <label>Şirket Adı *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Örn: Allianz" required />
                </div>
                <div className="field">
                  <label>Logo görsel URL * veya yükleme</label>
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="/uploads/partners/... veya tam URL (PNG/JPEG, max ~800 KB)" />
                  <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
                    <label className="btn" style={{ cursor: 'pointer', marginBottom: 0 }}>
                      📤 Dosya yükle (PNG/JPEG/GIF/WebP)
                      <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={onUploadLogo} style={{ display: 'none' }} />
                    </label>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{uploadStatus}</span>
                  </div>
                </div>
                <div className="field">
                  <label>Tıklanınca Gidilecek Link (opsiyonel)</label>
                  <input value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              <div>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="field">
                    <label>Sıra</label>
                    <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Durum</label>
                    <select value={form.isActive ? '1' : '0'} onChange={(e) => setForm({ ...form, isActive: e.target.value === '1' })}>
                      <option value="1">Aktif</option>
                      <option value="0">Pasif</option>
                    </select>
                  </div>
                </div>
                <div className="preview" title="Önizleme">
                  {imageUrlEffective() ? <img src={imageUrlEffective()} alt="Preview" /> : null}
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
        ) : sorted.length === 0 ? (
          <div style={{ padding: 28, color: '#64748b' }}>Henüz logo eklenmemiş.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Önizleme</th>
                <th>Şirket</th>
                <th>Sıra</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.id}>
                  <td style={{ width: 170 }}>
                    <div className="preview" title={row.imageUrl}>
                      <img src={row.imageUrl} alt={row.name} />
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 900, color: '#0f172a' }}>{row.name}</div>
                    <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: 4 }}>{row.linkUrl || ''}</div>
                  </td>
                  <td style={{ fontWeight: 800 }}>{row.sortOrder ?? 0}</td>
                  <td>
                    <span className={`badge ${row.isActive ? 'badgeOn' : 'badgeOff'}`} onClick={() => toggle(row)} title="Tıklayarak değiştir">
                      {row.isActive ? '✅ Aktif' : '⏸️ Pasif'}
                    </span>
                  </td>
                  <td>
                    <button className="btn" onClick={() => openEdit(row)}>
                      ✏️ Düzenle
                    </button>
                    <button className="btn btnDanger" onClick={() => remove(row.id)} style={{ marginLeft: 8 }}>
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

