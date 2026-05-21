import { LegalPage } from '@/components/LegalPage';

export default function TermsPage() {
  return (
    <LegalPage title="Kullanım şartları">
      <p className="text-xs text-[#707070]">Son güncelleme: 18 Mayıs 2026</p>

      <p>
        Hookerra&apos;ya hoş geldiniz! Bu web sitesini kullanarak aşağıdaki şartları kabul etmiş
        sayılırsınız. Lütfen dikkatlice okuyunuz.
      </p>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">1. Hizmetin tanımı</h2>
        <p>
          Hookerra, kullanıcılara yapay zekâ (AI) teknolojilerini kullanarak sosyal medya içerikleri ve
          başlıkları (&quot;hook&quot;) oluşturma imkânı sağlayan bir yazılım hizmetidir (SaaS).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">2. Hesap kaydı ve güvenliği</h2>
        <p>Hizmetten yararlanmak için bir hesap oluşturmanız gerekmektedir.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Kayıt sırasında verdiğiniz bilgilerin (e-posta vb.) doğruluğundan siz sorumlusunuz.
          </li>
          <li>
            Hesabınızın yetkisiz kişilerce kullanılmasından doğacak sorumluluk kullanıcıya aittir.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">3. Kullanım kısıtlamaları</h2>
        <p>
          Hookerra&apos;yı kullanırken şunları yapmamayı kabul edersiniz:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Yasa dışı, nefret söylemi içeren veya genel ahlaka aykırı içerikler üretmek.
          </li>
          <li>
            Sistemi aşırı yükleyecek otomatik araçlar (bot, scraper vb.) kullanmak.
          </li>
          <li>
            Platformun güvenliğini tehdit edecek faaliyetlerde bulunmak.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">4. Yapay zekâ tarafından üretilen içerikler</h2>
        <p>
          Hookerra, içerik üretimi için gelişmiş yapay zekâ modelleri kullanır. Üretilen içeriklerin %
          100 doğru, güncel veya özgün olduğu garanti edilemez.
        </p>
        <p>
          Üretilen içeriklerin kullanımından doğacak yasal ve ticari sorumluluk tamamen kullanıcıya
          aittir.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">5. Ödemeler ve abonelik</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Ücretli planlar:</strong> Hookerra,
            ücretsiz ve ücretli (Starter, Elite vb.) üyelik seçenekleri sunar.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Otomatik yenileme:</strong> Abonelikler,
            aksi iptal edilmediği sürece her dönem sonunda otomatik olarak yenilenir.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Fiyat değişikliği:</strong> Hookerra,
            abonelik ücretlerinde değişiklik yapma hakkını saklı tutar; değişiklikler bir sonraki fatura
            döneminden itibaren geçerli olur.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">6. Sorumluluk sınırı</h2>
        <p>
          Hookerra, hizmetin kesintiye uğramasından, veri kaybından veya yapay zekâ tarafından
          üretilen metinlerin yol açabileceği dolaylı zararlardan sorumlu tutulamaz. Hizmet
          &quot;olduğu gibi&quot; sunulmaktadır.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">7. Değişiklikler</h2>
        <p>
          Bu kullanım şartları zaman zaman güncellenebilir. Güncellemeler sitede yayınlandığı andan
          itibaren geçerlilik kazanır.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">8. İletişim</h2>
        <p>
          Sorularınız için:{' '}
          <a
            href="mailto:support@hookerra.com"
            className="font-medium text-white underline decoration-[#FF0000]/60 underline-offset-2 hover:decoration-[#FF0000]"
          >
            support@hookerra.com
          </a>
        </p>
      </section>

      <section className="space-y-3 border-t border-[#121212] pt-8">
        <h2 className="text-base font-bold text-white">Terms of Service (English summary)</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Service:</strong> Hookerra provides
            AI-powered content generation tools.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Responsibility:</strong> Users are
            responsible for their accounts and the content they generate.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Prohibited use:</strong> Illegal or harmful
            activities and automated scraping are strictly prohibited.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">AI disclaimer:</strong> We do not guarantee
            100% accuracy or uniqueness of AI-generated content. Use at your own risk.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Billing:</strong> Subscriptions renew
            automatically unless cancelled.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Liability:</strong> Hookerra is not liable
            for indirect damages or service interruptions.
          </li>
        </ul>
      </section>
    </LegalPage>
  );
}
