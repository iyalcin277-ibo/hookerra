import { LegalPage } from '@/components/LegalPage';

export default function PrivacyPage() {
  return (
    <LegalPage title="Gizlilik politikası">
      <p className="text-xs text-[#707070]">Son güncelleme: 18 Mayıs 2026</p>

      <p>
        Hookerra olarak, bize emanet ettiğiniz bilgilerin gizliliğini ve güvenliğini ciddiye
        alıyoruz. Bu politika, hizmetlerimizi kullandığınızda hangi verilerin ne amaçla işlendiğini
        açıklar.
      </p>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">1. Toplanan bilgiler</h2>
        <p>
          Hizmet kalitemizi artırmak ve size özel içerikler sunabilmek adına aşağıdaki bilgileri
          topluyoruz:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Hesap bilgileri:</strong> Kayıt sırasında
            paylaştığınız e-posta adresi ve temel profil detayları.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">İçerik verileri:</strong> Platform
            üzerinde içerik oluşturmak amacıyla girdiğiniz metinler ve sistem tarafından üretilen
            sonuçlar.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Teknik veriler:</strong> Siteye erişim
            sağladığınız cihaz, tarayıcı türü ve kullanım alışkanlıklarınıza dair anonim istatistikler.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">2. Bilgilerin kullanım amacı</h2>
        <p>Toplanan veriler yalnızca aşağıdaki amaçlar doğrultusunda kullanılır:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Kullanıcı oturumlarının yönetilmesi ve güvenli giriş süreçlerinin işletilmesi.</li>
          <li>Yapay zekâ destekli içerik üretim hizmetinin sunulması.</li>
          <li>Kullanıcı deneyiminin iyileştirilmesi ve teknik sorunların çözülmesi.</li>
          <li>Abonelik haklarının takibi ve üyelik süreçlerinin yönetimi.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">3. Veri güvenliği ve saklama</h2>
        <p>
          Verileriniz, endüstri standartlarında şifreleme yöntemleri ve katı güvenlik protokolleri ile
          korunmaktadır. Yetkisiz erişimi engellemek adına dijital altyapımız sürekli
          denetlenmektedir. Verileriniz, hesabınız aktif olduğu sürece veya hizmet sunumu için yasal
          olarak gerekli olan süre boyunca saklanır.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">4. Veri paylaşımı</h2>
        <p>
          Verileriniz, temel hizmetin sunulabilmesi için gerekli olan teknik iş ortakları dışında
          (ödeme sistemleri veya bulut altyapı hizmetleri gibi) üçüncü şahıslarla asla
          paylaşılmaz ve ticari amaçlarla satılmaz. Tüm iş ortaklarımız, verilerinizi en az bizim kadar
          sıkı korumakla yükümlüdür.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">5. Kullanıcı hakları</h2>
        <p>Kullanıcı olarak aşağıdaki haklara sahipsiniz:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Hakkınızda tutulan verilerin bir kopyasını talep etmek.</li>
          <li>Hatalı veya eksik bilgilerin düzeltilmesini istemek.</li>
          <li>
            Hesabınızı ve buna bağlı tüm verilerin sistemlerimizden kalıcı olarak silinmesini talep
            etmek.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">6. Çerezler</h2>
        <p>
          Sitemiz, oturumunuzu açık tutmak ve tercihlerinizi hatırlamak için temel çerezler kullanır.
          Bu çerezler kişisel verilerinizi reklam amaçlı takip etmez.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">7. İletişim</h2>
        <p>
          Gizlilik uygulamalarımız hakkındaki sorularınız veya veri silme talepleriniz için bizimle
          iletişime geçebilirsiniz:{' '}
          <a
            href="mailto:privacy@hookerra.com"
            className="font-medium text-white underline decoration-[#FF0000]/60 underline-offset-2 hover:decoration-[#FF0000]"
          >
            privacy@hookerra.com
          </a>
        </p>
      </section>

      <section className="space-y-3 border-t border-[#121212] pt-8">
        <h2 className="text-base font-bold text-white">Privacy Policy (English summary)</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Data collection:</strong> We collect
            email addresses and the text inputs you provide to generate content.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Usage:</strong> Data is used strictly to
            provide the AI content generation service and manage your account.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Security:</strong> We employ
            industry-standard encryption to help keep your data safe.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Your rights:</strong> You can request to
            view, edit, or delete your data at any time by contacting us.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Third parties:</strong> We do not sell
            your data. Information is only shared with essential infrastructure providers as needed for
            the service to work.
          </li>
        </ul>
      </section>
    </LegalPage>
  );
}
