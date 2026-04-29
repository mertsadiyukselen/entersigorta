import './globals.css';

export async function generateMetadata() {
  // Varsayılan değerler
  let title = "Timurlar Sigorta — Türkiye'nin En Büyük Sigorta Acentesi";
  let description = "Sigorta şubesi başvurusu, sigorta teklif alma ve tüm sigorta ürünlerinde avantajlı fiyatlarla hızlı çözüm. Her zaman yanınızdayız.";
  
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const titleSetting = await prisma.setting.findUnique({ where: { key: 'seo_title' } });
    const descSetting = await prisma.setting.findUnique({ where: { key: 'seo_description' } });
    if (titleSetting) title = titleSetting.value;
    if (descSetting) description = descSetting.value;
  } catch (error) {
    console.error("Meta data fetch error:", error);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ['/enter_sigorta.png'],
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <meta name="theme-color" content="#0a0e1a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
