import { LegalPage } from '@/components/LegalPage';

export default function RefundPage() {
  return (
    <LegalPage title="İade politikası">
      <p className="text-xs text-[#707070]">Son güncelleme: 18.05.2026</p>

      <p>
        Hookerra olarak yapay zekâ destekli araçlarımızdan memnun kalmanızı isteriz. Hizmetlerimizin
        dijital doğası gereği, iade süreçlerimiz aşağıda özetlenen kurallara tabidir.
      </p>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">1. Dijital içerik ve hizmetler</h2>
        <p>
          Hookerra üzerinden satın alınan abonelikler ve krediler, &quot;anında teslim edilen dijital
          içerik&quot; sayılır. İlgili tüketici mevzuatı kapsamında, halihazırda kullanılmış paketlerde
          (örneğin yapay zekâ ile üretilmiş hook&apos;lar veya diğer AI çıktıları) standart bir cayma
          hakkı bulunmamaktadır.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">2. İade koşulları</h2>
        <p>Aşağıdaki hallerde iade talebinde bulunabilirsiniz:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Teknik hatalar:</strong> Sistem
            kaynaklı bir nedenden hizmete erişememeniz ve bu sorunun 48 saat içinde
            giderilememesi.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Kullanılmamış abonelik:</strong>{' '}
            Talebin satın alımdan itibaren 24 saat içinde iletilmesi ve bu süre içinde sistemde hiç
            yapay zekâ üretiminin yapılmamış olması.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">3. İade süreci</h2>
        <p>
          İade taleplerinizi{' '}
          <a
            href="mailto:support@hookerra.com"
            className="font-medium text-white underline decoration-[#FF0000]/60 underline-offset-2 hover:decoration-[#FF0000]"
          >
            support@hookerra.com
          </a>{' '}
          adresine, hesap bilgileriniz ve faturanızla birlikte göndermelisiniz. Talebiniz
          incelendikten sonra en geç 7 iş günü içinde tarafınıza dönüş yapılır.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">4. Abonelik iptali</h2>
        <p>
          İade ile abonelik iptali farklıdır. Aboneliğinizi dilediğiniz zaman iptal edebilirsiniz.
          İptal halinde, yürürlükteki fatura dönemi için ücret iadesi yapılmaz; buna karşılık
          hizmetten o dönemin sonuna kadar yararlanmaya devam edersiniz.
        </p>
      </section>
    </LegalPage>
  );
}
