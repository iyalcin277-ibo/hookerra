# Hookerra - Proje Mimari ve Tasarım Dökümanı

Bu döküman, Gemini API ve Supabase altyapısı kullanılarak geliştirilecek olan AI destekli içerik üretim platformunun teknik ve görsel rehberidir.

---

## 1. Görsel Kimlik & Renk Paleti (Aggressive Dark Mode)

Tasarım dili; hızlı, dikkat çekici ve güçlü bir duruş sergilemek üzere "Siyah - Kırmızı - Beyaz" üzerine kurulmuştur.

| Element | Renk Kodu | Açıklama |
| :--- | :--- | :--- |
| **Arka Plan (Deep Black)** | `#000000` | Saf siyah, derinlik hissi için. |
| **Yüzey (Carbon Grey)** | `#121212` | Kartlar ve input alanları için hafif ayrışan siyah. |
| **Ana Renk (Pulse Red)** | `#FF0000` | Butonlar, logolar ve kritik vurgular (Harekete geçirici). |
| **Metin (Pure White)** | `#FFFFFF` | Ana başlıklar ve okunabilirliği yüksek metinler. |
| **Yardımcı Metin (Silver)** | `#A0A0A0` | Açıklamalar ve footer linkleri için. |
| **Hata/Uyarı** | `#B91C1C` | Koyu kırmızı tonları. |

---

## 2. Sayfa Yapıları ve Bileşen Detayları

### A. Ana Sayfa (Landing Page)
1. **Navigasyon:** 
   - Sol: Hookerra Logosu (Kırmızı/Beyaz). 
   - Sağ: Giriş Yap (Beyaz), Hemen Başla (Kırmızı Buton).
2. **Hero Bölümü:** 
   - Başlık: "Sıradan İçerikleri **Durdurulamaz** Hooklara Dönüştür." (Durdurulamaz kelimesi kırmızı).
   - Alt Başlık: "Gemini API destekli yapay zeka ile kitleni saniyeler içinde yakala."
   - CTA: "Ücretsiz İlk Hook'unu Oluştur" (Kırmızı parlayan buton).
3. **Canlı Önizleme (Mockup):** 
   - Siyah bir terminal ekranı görünümünde Gemini'nin nasıl "input" alıp "output" verdiğini gösteren animasyon.

### B. Dashboard (Yönetim Paneli)
*Bu alan uygulamanın kalbidir ve tamamen karanlık modda tasarlanacaktır.*
1. **Sidebar:** 
   - İkonlar: `Oluştur (Kırmızı)`, `Arşiv`, `Analizler`, `Ayarlar`.
2. **Üretim Alanı (Merkez):** 
   - **Input:** "Konun nedir?" (Geniş siyah textarea, kırmızı border-focus).
   - **Seçenekler:** Ton (Agresif, Merak Uyandırıcı, Eğitici), Platform (X, LinkedIn).
   - **Generate Butonu:** Basıldığında kırmızı bir pulse efekti.
3. **Sonuç Listesi:** 
   - Her hook bir kart içinde. Kartların solunda kırmızı bir dikey çizgi (`border-left: 4px solid #FF0000`).
   - "Kopyala" butonu tıklandığında kısa süreliğine kırmızı "Kopyalandı!" yazısı.

### C. Fiyatlandırma Sayfası
1. **Starter (0₺):** Temel özellikler, 5 kredi.
2. **Elite (Pro):** Kırmızı çerçeve ile vurgulanmış "Popüler" etiketi. Sınırsız üretim.
3. **Enterprise:** Yıllık ödemede %20 indirim vurgusu.

---

## 3. Teknik Mimari (Tech Stack)

### Veritabanı & Backend (Supabase)
*   **Auth:** Google ve Email/Password girişi.
*   **Database (PostgreSQL):**
    *   `users`: Kullanıcı bilgileri ve `subscription_status`.
    *   `generations`: `user_id`, `input_text`, `ai_output`, `created_at`.
*   **Edge Functions:** Gemini API isteklerini güvenli bir şekilde yönetmek için (Deno/TypeScript).

### Yapay Zeka (Gemini API)
*   **Model:** `gemini-1.5-flash` (Hız için) veya `gemini-1.5-pro` (Yüksek kalite için).
*   **Prompt Stratejisi:** 
    - Kullanıcı girdisini al.
    - Sisteme "Sen bir viral içerik ustasısın" rolünü ata.
    - Çıktıyı JSON formatında (`{ "hooks": [ "...", "..." ] }`) iste.

---

## 4. Geliştirme Notları (Cursor İçin)
- **CSS:** Tailwind CSS kullanılarak `dark` sınıfı default olacak.
- **Efektler:** Kırmızı renklerde `drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]` kullanarak "Neon Red" havası verilecek.
- **Yazı Tipi:** Modern ve keskin bir font olan 'Inter' veya 'Geist Sans'.

---