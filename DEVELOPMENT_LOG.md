## Sonra Yapılacaklar
- [ ] KVKK metni hazırlanacak ve siteye eklenecek.
- [ ] Sosyal medya linkleri güncellenecek.
- [ ] Gerekli firma logoları bulunup siteye eklenecek ("LogoCollection" bölümü için).
- [ ] Site genelindeki görseller ve fotoğraflar projeye uygun olanlarla değiştirilecek.
- [ ] Site içeriği tamamen Türkçeleştirilecek ve metinler düzenlenecek.

## ✅ Yapılanlar

### Proje Durumu  
- GitHub repository: https://github.com/tahayunusdemir/ayika.git

### Git Kurulumu
- README.md oluşturuldu
- Git repository başlatıldı
- İlk commit yapıldı
- Ana branch `main` olarak ayarlandı
- GitHub remote bağlantısı kuruldu
- Kod GitHub'a push edildi
- DEVELOPMENT_LOG.md oluşturuldu

### MUI Template Kurulumu
- MUI Material-UI templateları indirildi
- Kaynak: https://github.com/mui/material-ui/tree/v7.3.2/docs/data/material/getting-started/templates
- Tüm .js dosyaları silindi (sadece .tsx dosyaları kullanılacak)

### Vite Template Kurulumu
- `npm create vite@latest vite-template -- --template react-ts` komutu ile Vite projesi oluşturuldu.

### Bağımlılıkların Kurulumu
- Gerekli `npm` paketleri yüklendi: `@mui/material @mui/icons-material @emotion/styled @emotion/react @mui/x-charts @mui/x-date-pickers @mui/x-data-grid @mui/x-tree-view @react-spring/web dayjs markdown-to-jsx react-router-dom`

### Hata Düzeltmeleri ve İyileştirmeler
- `tsconfig.app.json` dosyasında `"verbatimModuleSyntax": false` ayarı ile TypeScript tip hataları giderildi.
- `process.env.TEMPLATE_IMAGE_URL` kullanımından kaynaklanan hatalar düzeltildi.
- `App.css` ve `index.css` dosyalarında yapılan iyileştirmeler ile uygulamanın tam ekran görünmesi sağlandı.

### Navigasyon ve Yönlendirme
- "Kayıt ol" (Sign Up) ve "Giriş yap" (Sign In) butonlarına `react-router-dom` kullanılarak ilgili sayfalara yönlendirme eklendi. Rotalar (`/sign-in`, `/sign-up`) `App.tsx` içinde tanımlandı.

### UI Temizliği ve Düzenlemeler
- [x] **Footer'dan "Company" ve "Legal" bölümleri kaldırıldı.**
    - `Footer.tsx` bileşeninden "Company" ve "Legal" başlıkları altındaki tüm linkler ve ilgili `Box` elementleri silindi.
- [x] **Aydınlık/Karanlık mod değiştirme butonu toggle işlevine dönüştürüldü.**
    - `ColorModeIconDropdown.tsx` bileşeni, tıklandığında aydınlık ve karanlık mod arasında geçiş yapacak şekilde basitleştirildi. Menü kaldırıldı.
- [x] **Aydınlık/Karanlık mod değiştirme butonundaki "System" seçeneği kaldırıldı.**
    - `ColorModeSelect.tsx` ve `ColorModeIconDropdown.tsx` dosyalarından "System" seçeneği kaldırılarak sadece "Light" ve "Dark" modları bırakıldı.
- [x] **Sıkça Sorulan Sorular (FAQ) bölümündeki metinlerdeki satır atlamaları düzeltildi.**
    - `FAQ.tsx` bileşenindeki `Typography` elementlerine uygulanan `maxWidth` stil kısıtlaması kaldırılarak metinlerin gereksiz yere alt satıra kayması engellendi.
- [x] **"Join the newsletter" bölümü tamamen kaldırıldı.**
    - `Footer.tsx` bileşeninden bülten aboneliği ile ilgili `Typography`, `TextField` ve `Button` gibi tüm elementler silindi ve ilgili kodlar temizlendi.
- [x] **"Testimonials" bölümü tamamen kaldırıldı.**
    - `MarketingPage`, `AppAppBar` ve `Footer` bileşenlerinden "Testimonials" bölümü ve ilgili linkler kaldırıldı.
    - `frontend/src/marketing-page/components/Testimonials.tsx` dosyası `frontend/src/kullanılmayanlar/` dizinine taşındı.
- [x] **"Pricing" bölümü tamamen kaldırıldı.**
    - `MarketingPage`, `AppAppBar`, `Footer` ve `CustomizedTreeView` bileşenlerinden "Pricing" bölümü ve ilgili linkler/veriler kaldırıldı.
    - `frontend/src/marketing-page/components/Pricing.tsx` dosyası `frontend/src/kullanılmayanlar/` dizinine taşındı.
- [x] **UI Temizliği ve Düzenlemeler**
    - [x] **"Sitemark" ikonu/yazısı yerine "Ayika" yazıldı.**
        - `SitemarkIcon.tsx` bileşeni, SVG ikonunu kaldırıp yerine "Ayika" metnini gösterecek şekilde güncellendi. Bu değişiklik, bu bileşeni kullanan tüm sayfalarda (örn. `MarketingPage`, `Blog`) geçerli oldu.

### Navigasyon ve Smooth Scroll İyileştirmeleri
- [x] **Navigasyondaki menülerin smooth scroll özelliği eklendi.**
    - `AppAppBar.tsx` bileşeninde Features, Highlights ve FAQ menülerine tıklandığında sayfa içindeki ilgili bölümlere yumuşak kayma (smooth scroll) özelliği eklendi.
    - `requestAnimationFrame` kullanılarak manuel smooth scroll implementasyonu yapıldı (800ms süre, easing fonksiyonu ile).
    - AppBar'ın fixed pozisyonu için 100px offset hesaplaması eklendi.
    - Hem desktop hem mobile menülerde çalışacak şekilde düzenlendi.
    - `index.css` dosyasına global `scroll-behavior: smooth` CSS kuralı da eklendi.

### Hero Bölümü İyileştirmeleri ve İçerik Güncellemeleri
- [x] **Hero bölümündeki başlık metni güncellendi.**
    - "Our latest products" yazısı "Acil Yardım ve İhtiyaç Koordinasyon Ağı" olarak değiştirildi.
    - "Acil Yardım ve" kısmı siyah, "İhtiyaç Koordinasyon Ağı" kısmı mavi renk olarak ayarlandı.
- [x] **Hero bölümündeki newsletter signup formu kaldırıldı.**
    - Email input alanı, "Start now" butonu ve "Terms & Conditions" metni tamamen kaldırıldı.
    - Kullanılmayan import'lar temizlendi.
- [x] **Blog footer'daki newsletter signup bölümü kaldırıldı.**
    - Blog sayfasının footer'ından newsletter aboneliği ile ilgili tüm elementler kaldırıldı.

### Gelişmiş Navigasyon ve Routing Sistemi
- [x] **Blog sayfası yönlendirmesi eklendi.**
    - Desktop ve mobile menülerindeki "Blog" butonlarına `/blog` sayfasına yönlendirme eklendi.
    - `App.tsx` dosyasına blog route'u eklendi.
- [x] **"Ayika" logo/yazısına ana sayfa yönlendirmesi eklendi.**
    - `SitemarkIcon.tsx` bileşeni Link component'i ile sarılarak ana sayfaya yönlendirme eklendi.
    - Hover efekti ve text decoration ayarları yapıldı.
- [x] **Cross-page navigasyon sistemi geliştirildi.**
    - Blog veya diğer sayfalardayken Features, Highlights, FAQ menülerine tıklandığında ana sayfaya yönlendirilip ilgili bölüme scroll etme özelliği eklendi.
    - `MarketingPage.tsx`'e hash-based scroll özelliği eklendi (URL'deki #hash değerlerine göre otomatik scroll).
    - Shared `AppAppBar.tsx` bileşeninde sayfa kontrolü ve yönlendirme mantığı implementasyonu yapıldı.

### Sign-In/Sign-Up Sayfaları Temizliği ve Optimizasyonu
- [x] **Google ve Facebook ile giriş yapma seçenekleri kaldırıldı.**
    - `SignIn.tsx` ve `SignUp.tsx` sayfalarından Google/Facebook giriş butonları, divider ve ilgili tüm kodlar kaldırıldı.
    - Sosyal medya icon import'ları temizlendi.
    - Sayfalar sadece email/şifre ile giriş yapacak şekilde basitleştirildi.
- [x] **CustomIcons.tsx dosyaları kullanılmayanlar klasörüne taşındı.**
    - `frontend/src/sign-in/components/CustomIcons.tsx` → `frontend/src/kullanılmayanlar/sign-in-components/CustomIcons.tsx`
    - `frontend/src/sign-up/components/CustomIcons.tsx` → `frontend/src/kullanılmayanlar/sign-up-components/CustomIcons.tsx`
- [x] **SitemarkIcon bileşenleri sign-in/sign-up sayfalarından kaldırıldı.**
    - Giriş ve kayıt sayfalarından logo/marka gösterimi kaldırılarak daha minimal tasarım sağlandı.
    - İlgili import'lar ve component kullanımları temizlendi.
- [x] **Tema seçici butonları kaldırıldı.**
    - `SignIn.tsx` ve `SignUp.tsx` sayfalarından `ColorModeSelect` butonları kaldırıldı.
    - `ColorModeSelect.tsx` dosyası `frontend/src/kullanılmayanlar/` dizinine taşındı.
    - Giriş ve kayıt sayfaları artık tema seçici olmadan daha temiz görünüyor.
- [x] **Sign-up sayfası tamamen kaldırılıp Google Forms'a yönlendirme eklendi.**
    - `sign-up` klasörü ve tüm içeriği (`SignUp.tsx`, `README.md`) `frontend/src/kullanılmayanlar/` dizinine taşındı.
    - `App.tsx` dosyasından sign-up import'u ve route tanımı kaldırıldı.
    - `AppAppBar.tsx` dosyasındaki hem desktop hem mobile menülerdeki "Sign up" butonları Google Forms linki (https://forms.gle/VRahDyBZUA3cojZa6) açacak şekilde güncellendi.
    - `SignIn.tsx` sayfasındaki "Don't have an account? Sign up" linki de Google Forms'a yönlendirildi.
    - Artık sign-up butonlarına tıklandığında Ayika Gönüllülük Formu yeni sekmede açılıyor.
- [x] **Navigasyon butonları ve giriş sayfası tamamen Türkçeleştirildi.**
    - `AppAppBar.tsx` dosyasında "Sign in" → "Giriş yap" ve "Sign up" → "Gönüllü ol 💙" olarak değiştirildi.
    - Hem desktop hem mobile menülerde güncellemeler yapıldı.
    - `SignIn.tsx` sayfası tamamen Türkçeleştirildi:
        - Başlık: "Sign in" → "Giriş Yap"
        - Form alanları: "Email" → "E-posta", "Password" → "Şifre"
        - Placeholder: "your@email.com" → "e-postanız@örnek.com"
        - "Remember me" → "Beni hatırla"
        - Buton: "Sign in" → "Giriş yap"
        - "Forgot your password?" → "Şifrenizi mi unuttunuz?"
        - "Don't have an account? Sign up" → "Hesabınız yok mu? Gönüllü ol 💙"
        - Hata mesajları Türkçeleştirildi
    - `ForgotPassword.tsx` bileşeni Türkçeleştirildi:
        - "Reset password" → "Şifre sıfırla"
        - Açıklama metni Türkçeleştirildi
        - "Email address" → "E-posta adresi"
        - "Cancel" → "İptal", "Continue" → "Devam et"
    - Gönüllü ol butonlarının yanına mavi kalp emojisi (💙) eklendi.
- [x] **Footer ve AppAppBar tamamen Türkçeleştirildi.**
    - `AppAppBar.tsx` dosyasında navigasyon menüsü Türkçeleştirildi:
        - "Features" → "Özellikler" (hem desktop hem mobile menüde)
        - "Highlights" → "Öne Çıkanlar" (hem desktop hem mobile menüde)
        - "FAQ" → "S.S.S" (hem desktop hem mobile menüde)
        - "Blog" aynı kaldı
    - `shared-theme/components/Footer.tsx` dosyası tamamen Türkçeleştirildi:
        - "Product" → "Sayfa"
        - "Features" → "Özellikler"
        - "Highlights" → "Öne Çıkanlar"
        - "FAQ" → "S.S.S"
        - "Privacy Policy" → "Gizlilik Politikası"
        - "Terms of Service" → "Kullanım Şartları"
    - Footer'daki tüm linkler güncellendi:
        - Navigasyon linkleri doğru sayfa/bölümlere yönlendirildi (/#features, /#highlights, /#faq, /blog)
        - Sosyal medya linkleri anasayfaya (/) yönlendirildi
        - Copyright'taki Ayika linki anasayfaya yönlendirildi
        - Gizlilik ve kullanım şartları linkleri geçici olarak anasayfaya yönlendirildi

### Kullanıcı Deneyimi (UX) İyileştirmeleri
- [x] **"Ayika" logosuna tıklandığında sayfanın en üstüne kaydırma özelliği eklendi.**
    - `AppAppBar.tsx` bileşenindeki logoya tıklandığında, sayfanın en üstüne yumuşak bir şekilde kaydırma (smooth scroll) işlevi eklendi.

### Dashboard Routing
- [x] **Dashboard sayfa yönlendirmesi eklendi.**
    - `App.tsx` dosyasına `/dashboard` route'u eklendi.
    - Dashboard bileşeni import edildi ve Routes içerisine tanımlandı.
    - Artık http://localhost:5173/dashboard URL'i ile dashboard sayfasına erişim sağlanabiliyor.

### Dashboard Temizliği
- [x] **Dashboard Header'dan Arama ve Takvim bileşenleri kaldırıldı.**
    - `Header.tsx` bileşeninden `Search` ve `CustomDatePicker` component'leri ve ilgili import'lar kaldırıldı.
    - Artık kullanılmayan `CustomDatePicker.tsx` dosyası projeden silindi.