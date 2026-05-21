import { LegalPage } from '@/components/LegalPage';

export default function ContactPage() {
  return (
    <LegalPage title="İletişim">
      <p className="text-base text-white">Bizimle İletişime Geçin</p>
      <p>
        Hookerra ile ilgili her türlü soru, öneri, iş birliği veya teknik destek talepleriniz için bize
        ulaşabilirsiniz. Ekibimiz en kısa sürede size dönüş yapacaktır.
      </p>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">1. E-Posta Adreslerimiz</h2>
        <p>
          Sorunuzun içeriğine göre aşağıdaki adreslerden bizimle doğrudan iletişime geçebilirsiniz:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Genel Sorular &amp; İş Birliği:</strong>{' '}
            <a
              href="mailto:hello@hookerra.com"
              className="text-[#FF0000] underline decoration-[#FF0000]/40 underline-offset-2 hover:text-white"
            >
              hello@hookerra.com
            </a>
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Müşteri Desteği &amp; Teknik Yardım:</strong>{' '}
            <a
              href="mailto:support@hookerra.com"
              className="text-[#FF0000] underline decoration-[#FF0000]/40 underline-offset-2 hover:text-white"
            >
              support@hookerra.com
            </a>
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Gizlilik &amp; Veri Talepleri:</strong>{' '}
            <a
              href="mailto:privacy@hookerra.com"
              className="text-[#FF0000] underline decoration-[#FF0000]/40 underline-offset-2 hover:text-white"
            >
              privacy@hookerra.com
            </a>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">2. Yanıt Süresi</h2>
        <p>
          Bize gönderdiğiniz tüm e-postalara en geç 24-48 saat içerisinde (iş günlerinde) geri dönüş
          yapmaya özen gösteriyoruz.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">3. Şirket Bilgileri</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Platform Adı:</strong> Hookerra SaaS
            Solutions
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Merkez:</strong> İstanbul, Türkiye
          </li>
        </ul>
      </section>
    </LegalPage>
  );
}
