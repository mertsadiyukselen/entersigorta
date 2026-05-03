const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const articles = [
  {
    slug: 'trafik-sigortasi-nedir',
    title: 'Trafik Sigortası Nedir?',
    excerpt: 'Zorunlu trafik sigortası, üçüncü şahıs zararlarını poliçe limitleri dahilinde karşılar.',
    category: 'Araç',
    sortOrder: 0,
    body: `Trafiğe çıkan her aracın yaptırmak zorunda olduğu **zorunlu sigorta** türüdür. Üçüncü şahıslara verilebilecek maddi ve bedeni zararları, poliçe limitleri dahilinde karşılar.

Trafik sigortası sizin aracınızdaki hasarları kapsamaz; bu nedenle **kasko** ile birlikte düşünülmesi gerekir.`,
  },
  {
    slug: 'kasko-ile-trafik-fark',
    title: 'Kasko ile Trafik Sigortası Arasındaki Fark',
    excerpt: 'Trafik karşı tarafı korur; kasko kendi aracınızdaki hasarları teminat altına alır.',
    category: 'Araç',
    sortOrder: 1,
    body: `**Trafik sigortası** zorunludur ve öncelikle karşı tarafa verebileceğiniz zararları teminat altına alır.

**Kasko** ise kendi aracınızdaki hasarları (çarpma, çalınma, doğal afet vb., poliçe kapsamına göre) güvenceye alır. İkisi birbirini tamamlar; biri diğerinin yerine geçmez.`,
  },
  {
    slug: 'tamamlayici-saglik-nedir',
    title: 'Tamamlayıcı Sağlık Sigortası Nedir?',
    excerpt: 'SGK kapsamına ek olarak özel hastanelerde fark ücretlerini hafifletir.',
    category: 'Sağlık',
    sortOrder: 2,
    body: `SGK’nın karşıladığı hizmetlere ek olarak **fark ücretlerini** teminat altına alır. Anlaşmalı özel hastanelerde çoğu zaman daha düşük maliyetle hizmet almanızı sağlar.

Kapsam ve limitler poliçeye göre değişir; teklif alırken **ağ (anlaşmalı kurum)** ve **yıllık tavan** bilgilerini karşılaştırmanız faydalıdır.`,
  },
  {
    slug: 'konut-sigortasi-neleri-kapsar',
    title: 'Konut Sigortası Neleri Kapsar?',
    excerpt: 'Konut, eşya ve komşuya verilebilecek zararlar gibi riskler poliçe şartlarına göre güvence altına alınır.',
    category: 'Konut',
    sortOrder: 3,
    body: `Konut sigortası; **yangın, su baskını, hırsızlık**, cam kırılması ve poliçede tanımlı diğer risklere karşı konutunuzu ve eşyalarınızı korur. Ayrıca üçüncü kişilere verebileceğiniz zararlar için **ferdi sorumluluk** teminatı eklenebilir.

Kapsam detayları poliçe şartnamesinde yer alır; teminatları netleştirmek için mutlaka okuyun.`,
  },
  {
    slug: 'dask-nedir',
    title: 'DASK (Zorunlu Deprem Sigortası)',
    excerpt: 'Deprem ve deprem kaynaklı bazı risklerin neden olduğu zararları belirli limitler dahilinde karşılayan zorunlu sigortadır.',
    category: 'Konut',
    sortOrder: 4,
    body: `**DASK**, deprem ve deprem sonucu meydana gelen yangın, infilak, yer kayması gibi risklerin binalarda oluşturacağı maddi zararları, yasal limitler çerçevesinde karşılayan **zorunlu** sigortadır.

Konut sigortasından farklıdır; DASK yalnızca deprem odaklıdır. Konut poliçenizle birlikte değerlendirmek en doğru yaklaşımdır.`,
  },
  {
    slug: 'sigorta-acentesinde-kariyer',
    title: 'Sigorta Acentesinde Kariyer: Neye Hazırlıklı Olmalısınız?',
    excerpt: 'Satış, müşteri ilişkileri ve regülasyon bilgisi sektörde öne çıkmanıza yardımcı olur.',
    category: 'Kariyer',
    sortOrder: 5,
    body: `Sigorta acenteliği; **müşteri danışmanlığı**, ürün bilgisi ve düzenli **eğitim** gerektiren dinamik bir alandır. SEGEM ve benzeri sertifikalar kariyer yolunuzda sıkça ön plana çıkar.

Yeni başlayanlar için öneriler:

- Temel **ürün gruplarını** (trafik, kasko, sağlık, konut) öğrenin.
- İletişim ve **çözüm odaklı** yaklaşım geliştirin.
- Şirket içi eğitim ve **mevzuat** güncellemelerini takip edin.

Enter Sigorta açık pozisyonları için [Kariyer sayfamızı](/kariyer) ziyaret edebilirsiniz.`,
  },
];

async function main() {
  const publishedAt = new Date('2025-01-15T12:00:00.000Z');
  let n = 0;
  for (const row of articles) {
    const existing = await prisma.guideArticle.findUnique({ where: { slug: row.slug } });
    if (!existing) {
      await prisma.guideArticle.create({
        data: {
          ...row,
          publishedAt,
          isActive: true,
        },
      });
      n += 1;
    }
  }
  console.log(`GuideArticle seed: ${n} ek kayıt (var olanlar atlandı)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
