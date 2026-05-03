'use client';

import { useEffect, useMemo, useState } from 'react';

const emptyForm = {
  slug: '',
  title: '',
  excerpt: '',
  category: 'Genel',
  body: '',
  publishedAt: '',
  sortOrder: 0,
  isActive: true,
};

function suggestSlug(title) {
  return title
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export default function AdminGuidesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const sorted = useMemo(() => [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)), [items]);

  const fetchItems = () => {
    setLoading(true);
    fetch('/api/guides?all=1')
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
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setForm({
      ...emptyForm,
      publishedAt: d.toISOString().slice(0, 16),
      sortOrder: sorted.length ? Math.max(...sorted.map((b) => b.sortOrder ?? 0)) + 1 : 0,
    });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    const d = row.publishedAt ? new Date(row.publishedAt) : new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setForm({
      slug: row.slug || '',
      title: row.title || '',
      excerpt: row.excerpt || '',
      category: row.category || 'Genel',
      body: row.body || '',
      publishedAt: d.toISOString().slice(0, 16),
      sortOrder: row.sortOrder ?? 0,
      isActive: row.isActive !== false,
    });
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.slug.trim() || !form.title.trim()) return;

    setSaving(true);
    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      excerpt: form.excerpt.trim() || null,
      category: form.category.trim() || 'Genel',
      body: form.body,
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
      sortOrder: Number(form.sortOrder),
      isActive: !!form.isActive,
    };

    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...payload, id: editing.id } : payload;

    await fetch('/api/guides', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setSaving(false);
    reset();
    fetchItems();
  };

  const remove = async (id) => {
    if (!confirm('Bu yazı silinsin mi?')) return;
    await fetch(`/api/guides?id=${id}`, { method: 'DELETE' });
    fetchItems();
  };

  const toggle = async (row) => {
    await fetch('/api/guides', {
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
        .field input,.field select,.field textarea{width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:.92rem;background:#fafbfc;font-family:inherit}
        textarea{min-height:220px;line-height:1.55}
        .mono{font-family: ui-monospace, monospace; font-size: 0.86rem;}
        .rowActions{display:flex;gap:10px;margin-top:10px;flex-wrap:wrap}
        .btn{padding:10px 14px;border-radius:10px;border:1px solid #e2e8f0;background:#fff;cursor:pointer;font-weight:700;font-size:.85rem}
        .btnDanger{border-color:rgba(239,68,68,.35);color:#ef4444}
        .table{width:100%;border-collapse:collapse;font-size:.9rem}
        .table th{text-align:left;padding:14px 18px;background:#f8fafc;color:#64748b;font-size:.78rem;text-transform:uppercase;letter-spacing:.5px}
        .table td{padding:14px 18px;border-top:1px solid #f1f5f9;vertical-align:top}
        .badge{display:inline-flex;align-items:center;gap:8px;padding:4px 10px;border-radius:999px;font-weight:800;font-size:.75rem}
        .badgeOn{background:rgba(34,197,94,.12);color:#166534;cursor:pointer}
        .badgeOff{background:rgba(245,158,11,.14);color:#92400e;cursor:pointer}
        @media (max-width:900px){.grid{grid-template-columns:1fr}}
      `}</style>

      <div className="header">
        <div>
          <h1>📚 Sigorta Rehberi Yazıları</h1>
          <p>Yayında görünen Markdown makaleler; sıra, tarih ve kategori buradan.</p>
        </div>
        <button className="btnPrimary" onClick={openCreate}>
          ➕ Yeni Yazı
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 22, marginBottom: 20, border: '2px solid #0f172a' }}>
          <form onSubmit={save}>
            <div className="grid">
              <div>
                <div className="field">
                  <label>Başlık *</label>
                  <input
                    value={form.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setForm((f) => ({
                        ...f,
                        title,
                        slug: editing ? f.slug : suggestSlug(title),
                      }));
                    }}
                    placeholder="Örn: Trafik Sigortası Nedir?"
                    required
                  />
                </div>
                <div className="field">
                  <label>URL slug *</label>
                  <input
                    className="mono"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="trafik-sigortasi-nedir"
                    required
                  />
                </div>
                <div className="field">
                  <label>Kategori</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Araç, Konut, Sağlık, Kariyer…"
                  />
                </div>
              </div>
              <div>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="field">
                    <label>Yayın tarihi</label>
                    <input type="datetime-local" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Sıra</label>
                    <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Durum</label>
                    <select value={form.isActive ? '1' : '0'} onChange={(e) => setForm({ ...form, isActive: e.target.value === '1' })}>
                      <option value="1">Yayında</option>
                      <option value="0">Taslak</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Özet (liste görünümü)</label>
                  <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Kısa tanıtım cümlesi" />
                </div>
              </div>
            </div>

            <div className="field">
              <label>İçerik (Markdown)</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Paragraflar, **kalın**, [örnek link](/yol)"
                rows={14}
              />
            </div>

            <div className="rowActions">
              <button type="submit" className="btnPrimary" disabled={saving}>
                {saving ? 'Kaydediliyor…' : editing ? 'Güncelle' : 'Oluştur'}
              </button>
              <button type="button" className="btn" onClick={reset}>
                İptal
              </button>
              <span style={{ color: '#64748b', fontSize: '.85rem', alignSelf: 'center' }}>Başlıklar için ## ve listeler için - kullanabilirsiniz.</span>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div style={{ padding: 28, color: '#64748b' }}>Yükleniyor…</div>
        ) : sorted.length === 0 ? (
          <div style={{ padding: 28, color: '#64748b' }}>Henüz yazı yok. Seed için: npx prisma db seed</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Kategori</th>
                <th>Tarih</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 900, color: '#0f172a' }}>
                    {row.title}
                    <div className="mono" style={{ color: '#64748b', marginTop: 4, fontWeight: 600 }}>
                      /sigorta-rehberi/{row.slug}
                    </div>
                  </td>
                  <td>{row.category}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(row.publishedAt).toLocaleString('tr-TR')}</td>
                  <td>
                    <span
                      className={`badge ${row.isActive ? 'badgeOn' : 'badgeOff'}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggle(row)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') toggle(row);
                      }}
                    >
                      {row.isActive ? '✅ Yayında' : '▪️ Taslak'}
                    </span>
                  </td>
                  <td>
                    <button className="btn" onClick={() => openEdit(row)}>
                      ✏️
                    </button>
                    <button className="btn btnDanger" onClick={() => remove(row.id)} style={{ marginLeft: 8 }}>
                      🗑️
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
