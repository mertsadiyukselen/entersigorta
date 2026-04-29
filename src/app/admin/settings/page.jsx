import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export default async function SettingsPage() {
  const settingsRecords = await prisma.setting.findMany();
  const settings = settingsRecords.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  async function saveSettings(formData) {
    'use server';
    
    const keys = [
      'smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass',
      'seo_title', 'seo_description', 'seo_keywords',
      'whatsapp_number', 'instagram_handle',
      'company_phone', 'company_email', 'company_address'
    ];
    
    for (const key of keys) {
      const value = formData.get(key);
      if (value !== null) {
        await prisma.setting.upsert({
          where: { key: key },
          update: { value: value.toString() },
          create: { key: key, value: value.toString() },
        });
      }
    }
    
    revalidatePath('/admin/settings');
    revalidatePath('/');
  }

  return (
    <div>
      <style>{`
        .settings-header {
          margin-bottom: 30px;
        }
        .settings-header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
        }
        .settings-header p {
          color: #64748b;
          margin-top: 4px;
        }
        .settings-grid {
          display: grid;
          gap: 24px;
          max-width: 700px;
        }
        .settings-card {
          background: white;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
        }
        .settings-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        .settings-card-header .card-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        .settings-card-header h2 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
        }
        .settings-card-header p {
          font-size: 0.82rem;
          color: #94a3b8;
          margin-top: 2px;
        }
        .form-field {
          margin-bottom: 16px;
        }
        .form-field:last-child {
          margin-bottom: 0;
        }
        .form-field label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 6px;
        }
        .form-field input, .form-field textarea {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.9rem;
          color: #0f172a;
          transition: all 0.2s ease;
          background: #fafbfc;
        }
        .form-field input:focus, .form-field textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
          background: white;
        }
        .form-field textarea {
          min-height: 80px;
          resize: vertical;
        }
        .form-field .hint {
          font-size: 0.78rem;
          color: #94a3b8;
          margin-top: 4px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .save-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          transition: all 0.2s ease;
          margin-top: 8px;
        }
        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
      `}</style>

      <div className="settings-header">
        <h1>⚙️ Sistem Ayarları</h1>
        <p>Site genelinde kullanılan tüm ayarları buradan yönetebilirsiniz.</p>
      </div>

      <form action={saveSettings}>
        <div className="settings-grid">

          {/* SEO Ayarları */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="card-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>🚀</div>
              <div>
                <h2>Google SEO Ayarları</h2>
                <p>Arama motorlarında öne çıkmak için meta bilgilerini düzenleyin</p>
              </div>
            </div>
            <div className="form-field">
              <label>Sayfa Başlığı (Title Tag)</label>
              <input type="text" name="seo_title" defaultValue={settings.seo_title || ''} placeholder="Enter Sigorta — Sigorta Şubesi Olmak İçin Başvur" />
              <div className="hint">Google arama sonuçlarında görünecek başlık (50-60 karakter ideal)</div>
            </div>
            <div className="form-field">
              <label>Sayfa Açıklaması (Meta Description)</label>
              <textarea name="seo_description" defaultValue={settings.seo_description || ''} placeholder="Sigorta şubesi olmak için başvurun. 30+ sigorta şirketi ağıyla karşılaştırmalı teklif, hızlı destek ve kurulum sürecinde yanınızdayız."></textarea>
              <div className="hint">Arama sonuçlarında başlığın altında görünür (150-160 karakter ideal)</div>
            </div>
            <div className="form-field">
              <label>Anahtar Kelimeler (Keywords)</label>
              <input type="text" name="seo_keywords" defaultValue={settings.seo_keywords || ''} placeholder="sigorta şubesi başvurusu, sigorta şubesi, sigorta acentesi" />
              <div className="hint">Virgülle ayırın</div>
            </div>
          </div>

          {/* Sosyal Medya & WhatsApp */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="card-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>📱</div>
              <div>
                <h2>WhatsApp & Sosyal Medya</h2>
                <p>Sitedeki iletişim bağlantılarını güncelleyin</p>
              </div>
            </div>
            <div className="form-field">
              <label>WhatsApp Numarası</label>
              <input type="text" name="whatsapp_number" defaultValue={settings.whatsapp_number || ''} placeholder="903124260110" />
              <div className="hint">Ülke kodu dahil, boşluksuz yazın (Örn: 903124260110)</div>
            </div>
            <div className="form-field">
              <label>Instagram Kullanıcı Adı</label>
              <input type="text" name="instagram_handle" defaultValue={settings.instagram_handle || ''} placeholder="entersigorta" />
              <div className="hint">@ işareti olmadan yazın</div>
            </div>
          </div>

          {/* Şirket Bilgileri */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="card-icon" style={{ background: '#fce7f3', color: '#db2777' }}>🏢</div>
              <div>
                <h2>Şirket Bilgileri</h2>
                <p>Sitede görünen iletişim bilgilerini düzenleyin</p>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Telefon Numarası</label>
                <input type="text" name="company_phone" defaultValue={settings.company_phone || ''} placeholder="0 (312) 426 01 10" />
              </div>
              <div className="form-field">
                <label>E-posta Adresi</label>
                <input type="email" name="company_email" defaultValue={settings.company_email || ''} placeholder="info@entersigorta.com" />
              </div>
            </div>
            <div className="form-field">
              <label>Adres</label>
              <textarea name="company_address" defaultValue={settings.company_address || ''} placeholder="Çankaya Mah. Cinnah Cad. 75/8, Çankaya / ANKARA"></textarea>
            </div>
          </div>

          {/* SMTP Ayarları */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="card-icon" style={{ background: '#fef3c7', color: '#d97706' }}>📧</div>
              <div>
                <h2>SMTP E-posta Ayarları</h2>
                <p>Yeni başvuru geldiğinde otomatik e-posta bildirimi alın</p>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>SMTP Sunucu (Host)</label>
                <input type="text" name="smtp_host" defaultValue={settings.smtp_host || ''} placeholder="smtp.gmail.com" />
              </div>
              <div className="form-field">
                <label>SMTP Port</label>
                <input type="text" name="smtp_port" defaultValue={settings.smtp_port || ''} placeholder="587" />
              </div>
            </div>
            <div className="form-field">
              <label>SMTP Kullanıcı E-posta</label>
              <input type="email" name="smtp_user" defaultValue={settings.smtp_user || ''} placeholder="bildirim@entersigorta.com" />
            </div>
            <div className="form-field">
              <label>SMTP Şifre</label>
              <input type="password" name="smtp_pass" defaultValue={settings.smtp_pass || ''} placeholder="••••••••" />
              <div className="hint">Gmail kullanıyorsanız "Uygulama Şifresi" oluşturmanız gerekir</div>
            </div>
          </div>

          <button type="submit" className="save-btn">
            💾 Tüm Ayarları Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}
