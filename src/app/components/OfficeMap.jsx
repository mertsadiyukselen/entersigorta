'use client';

const DEFAULT_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3061.2720235284067!2d32.85501867664654!3d39.89056638753235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34f9a0cba5cd9%3A0x6b7724bc2f8ba29d!2sCinnah%20Cd.%20No%3A75%2C%2006690%20%C3%87ankaya%2FAnkara!5e0!3m2!1str!2str!4v1712760000000!5m2!1str!2str';

function directionUrl(formattedAddress) {
  const q = encodeURIComponent(formattedAddress);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=driving`;
}

function placeUrl(placeQuery) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeQuery)}`;
}

export default function OfficeMap({ address }) {
  const addr = address || 'Cinnah Cad. No:75 Çankaya, Ankara';
  const title = addr.split(',').slice(0, 2).join(',').trim() || 'Ofis Konumu';

  return (
    <div className="office-map-shell">
      <div className="office-map-strip">
        <div>
          <strong className="office-map-strip-title">{title}</strong>
          <p className="office-map-strip-sub">{addr}</p>
        </div>
        <div className="office-map-strip-actions">
          <a href={directionUrl(addr)} target="_blank" rel="noopener noreferrer" className="office-map-chip">
            ↗ Google ile yol tarifi
          </a>
          <a href={placeUrl(addr)} target="_blank" rel="noopener noreferrer" className="office-map-chip office-map-chip-muted">
            Haritada aç
          </a>
        </div>
      </div>

      <div className="office-map-frame">
        <iframe
          title="Enter Sigorta Ofis Konumu haritası"
          src={DEFAULT_EMBED}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <p className="office-map-note">Harita yükleme sırasında kısa bir gecikme olabilir. Tam ekranda görmek için “Haritada aç”a tıklayın.</p>
    </div>
  );
}
