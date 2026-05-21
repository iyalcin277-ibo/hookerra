import Link from 'next/link';
import { LegalPage } from '@/components/LegalPage';

export default function AboutPage() {
  return (
    <LegalPage title="Hakkımızda">
      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">Biz Kimiz?</h2>
        <p>
          Hookerra, dijital çağda içerik üreticilerinin, girişimcilerin ve markaların sosyal medyadaki
          sesini güçlendirmek için kurulmuş yenilikçi bir SaaS (Yazılım Hizmeti) platformudur. Günümüz
          dijital dünyasında dikkat çekmenin ve kalabalığın arasından sıyrılmanın ne kadar zor olduğunu
          biliyoruz. İşte bu yüzden, içeriklerinizin ilk saniyesinde fark yaratmanızı sağlayacak çözümler
          üretiyoruz.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">Misyonumuz</h2>
        <p>
          Sosyal medya dinamiklerini yapay zeka teknolojisiyle birleştirerek; zaman alan içerik bulma,
          dikkat çekici başlık yazma ve kanca (hook) oluşturma süreçlerini saniyeler süren zahmetsiz bir
          deneyime dönüştürmek. Amacımız, fikirlerinizi geniş kitlelere ulaştırırken odak noktanızı
          sadece &ldquo;üretmeye&rdquo; ayırmanızı sağlamaktır.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">Neden Hookerra?</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Hız ve Verimlilik:</strong> Gelişmiş
            yapay zeka modellerimiz sayesinde, kitlenizi elinde tutacak en etkili başlıkları ve giriş
            cümlelerini anında analiz edip üretiriz.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Minimalist ve Güçlü Deneyim:</strong>{' '}
            Karmaşık panellerle, kafa karıştırıcı ayarlarla vaktinizi çalmayız. Tamamen amaca yönelik,
            temiz ve hızlı bir arayüz sunarız.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Sürekli Gelişim:</strong> Sosyal medya
            trendlerini yakından takip ediyor ve algoritmalara en uygun içerik stratejilerini geliştirmek
            için altyapımızı her gün güncelliyoruz.
          </li>
        </ul>
      </section>

      <p>
        Geleceğin içerik stratejisini bugünden inşa etmek ve dijitaldeki potansiyelinizi maksimuma
        çıkarmak için buradayız.
      </p>

      <section className="space-y-3 border-l-4 border-[#FF0000] pl-4">
        <h2 className="text-base font-bold text-white">İletişim</h2>
        <p>
          Genel sorular ve iş birliği:{' '}
          <a
            href="mailto:hello@hookerra.com"
            className="text-[#FF0000] underline decoration-[#FF0000]/40 underline-offset-2 hover:text-white"
          >
            hello@hookerra.com
          </a>
        </p>
        <p>
          E-posta adresleri (destek, gizlilik), yanıt süreleri ve şirket bilgileri için{' '}
          <Link
            href="/contact"
            className="font-semibold text-[#FF0000] underline decoration-[#FF0000]/40 underline-offset-2 hover:text-white"
          >
            İletişim
          </Link>{' '}
          sayfamıza göz atabilirsiniz.
        </p>
      </section>
    </LegalPage>
  );
}
