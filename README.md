"# AYIKA - Acil Yardım ve İhtiyaç Koordinasyon Ağı

![Ayika Logo](https://via.placeholder.com/200x100/2196F3/FFFFFF?text=AYIKA)

**Ayika**, afet durumlarında acil yardım ve ihtiyaç koordinasyonunu dijital platformlar üzerinden gerçekleştirmek amacıyla geliştirilmiş kapsamlı bir yazılım sistemidir. Proje, web tabanlı yönetim paneli ve mobil uygulama olmak üzere iki ana bileşenden oluşmaktadır.

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Teknoloji Stack](#-teknoloji-stack)
- [Özellikler](#-özellikler)
- [Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
  - [Web Uygulaması](#web-uygulaması)
  - [Mobil Uygulama](#mobil-uygulama)
- [Kullanım Rehberi](#-kullanım-rehberi)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)
- [İletişim](#-iletişim)

## 🎯 Proje Hakkında

Ayika projesi, modern web teknolojileri kullanılarak geliştirilmiş tam fonksiyonel bir afet yönetim sistemidir. Sistem şu ana bileşenleri içermektedir:

- **Web Uygulaması**: React 19.1.1 + TypeScript tabanlı yönetim paneli
- **Mobil Uygulama**: Flutter 3.9.2 ile geliştirilmiş cross-platform uygulama
- **Backend API**: Django 5.1.1 REST API
- **Veritabanı**: PostgreSQL 15 + Redis 7
- **Konteynerizasyon**: Docker ile tam yığın altyapı

### Proje Hedefleri

- Afet durumlarında hızlı koordinasyon sağlama
- Gönüllü yönetimi ve organizasyonu
- Kargo takibi ve lojistik yönetimi
- Şeffaf ve güvenilir iletişim kanalları
- Kullanıcı dostu arayüzler ile kolay erişim

## 🛠 Teknoloji Stack

### Frontend (Web)
- **React** 19.1.1 - Modern UI kütüphanesi
- **TypeScript** - Tip güvenliği
- **Material-UI** 7.3.2 - UI bileşen kütüphanesi
- **Vite** 7.1.2 - Hızlı geliştirme ortamı
- **React Router** 7.8.2 - SPA routing
- **Leaflet.js** - Interaktif harita entegrasyonu

### Backend
- **Django** 5.1.1 - Python web framework
- **Django REST Framework** - API geliştirme
- **PostgreSQL** 15 - Ana veritabanı
- **Redis** 7 - Önbellekleme ve oturum yönetimi
- **JWT** - Kimlik doğrulama

### Mobil (Flutter)
- **Flutter** 3.9.2 - Cross-platform framework
- **Material Design 3** - Modern tasarım sistemi
- **flutter_map** 8.2.2 - Harita entegrasyonu
- **geolocator** 13.0.1 - GPS konum servisleri
- **Google Fonts** 6.3.1 - Inter font ailesi

### DevOps
- **Docker** - Konteynerizasyon
- **Docker Compose** - Çoklu servis orkestrasyon
- **Nginx** - Production web server
- **GitHub** - Versiyon kontrolü

## ✨ Özellikler

### Web Uygulaması Özellikleri

#### 🏠 Marketing Sayfası
- Interaktif Türkiye haritası (81 il koordinatları)
- Destek verenler bölümü (tıklanabilir linkler)
- Özellikler ve öne çıkanlar açıklamaları
- Kargo takip sistemi (AYK formatı doğrulaması)
- Ekip bilgileri (GitHub, LinkedIn entegrasyonu)
- Sıkça sorulan sorular
- Footer iletişim bilgileri

#### 🔐 Kimlik Doğrulama
- E-posta ve şifre tabanlı giriş
- Güçlü şifre politikası (8+ karakter, büyük/küçük harf, rakam)
- Şifre sıfırlama sistemi (Docker e-posta servisi)
- Gönüllü kayıt formu (web ve mobil entegrasyonu)
- KVKK uyumluluk onayları

#### 📞 İletişim Sistemi
- Kapsamlı iletişim formu
- 8 farklı kategori seçimi
- Dosya yükleme (10 MB limit)
- Telefon format validasyonu (5XXXXXXXXX)
- Google Forms entegrasyonu hazırlığı

#### 📊 Dashboard
- Kullanıcı profil yönetimi
- Tema değiştirme (aydınlık/karanlık)
- Şifre değiştirme
- Hesap deaktivasyonu
- Gönüllü kartviziti indirme

#### 👨‍💼 Admin Yönetim
- Gönüllü listesi yönetimi (CRUD işlemleri)
- Arama ve filtreleme sistemi
- Kargo yönetimi (CRUD işlemleri)
- Gönüllü ataması
- Durum güncelleme
- Grafiksel analiz raporları

### Mobil Uygulama Özellikleri

#### 📱 Ana Özellikler
- 4 sayfalık onboarding sistemi (Hoş Geldiniz, Yardım Noktaları, Kargo Takibi, Hazırsınız)
- 3 sekmeli ana navigasyon (Ana Sayfa, Harita, Hakkında)
- Yan menü sistemi (Hakkında, Kargo Takibi, İletişim, Bildirim Ayarları)
- Material Design 3 tema sistemi (aydınlık/karanlık mod)
- Responsive tasarım (telefon/tablet uyumluluğu)

#### 🗺 Harita Özellikleri
- Interaktif Türkiye haritası (81 il yardım noktası)
- GPS konum servisleri (izin yönetimi, konum alma, en yakın nokta bulma)
- OpenStreetMap entegrasyonu (ücretsiz)
- Zoom kontrolleri ve navigasyon
- Yol tarifi entegrasyonu

#### 📦 Kargo Takip
- Kargo takip sistemi (numara girişi, durum sorgulama)
- AYK formatı doğrulaması
- Gerçek zamanlı durum güncellemeleri

#### 🔗 Entegrasyonlar
- Google Forms entegrasyonu (gönüllü kayıt, iletişim)
- Offline çalışma desteği (SharedPreferences)
- HTTP API entegrasyonu hazırlığı

## 🚀 Kurulum ve Çalıştırma

### Sistem Gereksinimleri

- **Node.js** >= 18.0.0
- **Python** >= 3.11.0
- **Docker** ve **Docker Compose**
- **Git**

### Web Uygulaması

#### 1. Projeyi Klonlayın

```bash
git clone https://github.com/tahayunusdemir/ayika.git
cd ayika/web
```

#### 2. Docker ile Hızlı Başlangıç

```bash
# Tüm servisleri başlat (PostgreSQL, Redis, Django, React)
npm run dev
```

#### 3. İlk Kurulum (Opsiyonel)

```bash
# Veritabanı migration'larını çalıştır
npm run migrate

# Admin kullanıcısı oluştur
npm run createsuperuser

# Test verileri oluştur
npm run create-test-volunteers
npm run create-sample-cargo
```

#### 4. Erişim URL'leri

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin

#### 5. Yararlı Komutlar

```bash
# Servisleri durdur
npm run dev:down

# Logları görüntüle
npm run logs

# Sistem durumu kontrol et
npm run health

# Backend shell'e erişim
npm run shell:backend

# Veritabanı sıfırlama
npm run reset
```

### Mobil Uygulama

#### 1. Flutter Kurulumu

```bash
# Flutter SDK'yı indirin ve kurun
# https://docs.flutter.dev/get-started/install

# Flutter kurulumunu doğrulayın
flutter doctor
```

#### 2. Proje Kurulumu

```bash
cd ayika/mobil/ayika

# Bağımlılıkları yükle
flutter pub get
```

#### 3. Çalıştırma

```bash
# Android emülatör veya cihazda çalıştır
flutter run

# iOS simülatör veya cihazda çalıştır (macOS gerekli)
flutter run

# Web'de çalıştır
flutter run -d web
```

#### 4. Build Alma

```bash
# Android APK
flutter build apk

# Android App Bundle (Play Store için)
flutter build appbundle

# iOS (macOS gerekli)
flutter build ios
```

## 📖 Kullanım Rehberi

### Web Uygulaması Kullanımı

#### 1. İlk Giriş
1. http://localhost:5173 adresine gidin
2. "Giriş Yap" butonuna tıklayın
3. Kayıt olmak için "Hesabınız yok mu? Kayıt olun" linkine tıklayın
4. Formu doldurun ve hesabınızı oluşturun

#### 2. Dashboard Kullanımı
1. Giriş yaptıktan sonra dashboard'a yönlendirileceksiniz
2. Sol menüden farklı bölümlere erişebilirsiniz
3. Sağ üst köşeden tema değiştirebilirsiniz
4. Profil sekmesinden bilgilerinizi güncelleyebilirsiniz

#### 3. Admin Özellikleri
1. Admin hesabı ile giriş yapın
2. Sol menüde admin seçenekleri görünecek
3. Gönüllüler sekmesinden gönüllü yönetimi yapabilirsiniz
4. Kargo sekmesinden kargo işlemlerini yönetebilirsiniz
5. Analizler sekmesinden raporları görüntüleyebilirsiniz

### Mobil Uygulama Kullanımı

#### 1. İlk Açılış
1. Uygulamayı açın
2. 4 sayfalık onboarding'i tamamlayın
3. Ana sayfaya yönlendirileceksiniz

#### 2. Harita Kullanımı
1. Alt menüden "Harita" sekmesine geçin
2. GPS butonuna basarak konumunuzu alın
3. Mavi marker'lara tıklayarak yardım noktalarını görün
4. "Yol Tarifi Al" ile navigasyon başlatın

#### 3. Kargo Takibi
1. Yan menüden "Kargo Takibi"ne gidin
2. AYK formatında kargo numaranızı girin
3. "Sorgula" butonuna basın
4. Kargo durumunu görüntüleyin

#### 4. Gönüllü Kayıt
1. Ana sayfada "Gönüllü Ol" butonuna basın
2. Google Forms sayfası açılacak
3. Formu doldurun ve gönderin

## 📚 API Dokümantasyonu

### Ana Endpoint'ler

#### Kimlik Doğrulama
```
POST /api/v1/auth/login/     # Giriş
POST /api/v1/auth/logout/    # Çıkış
GET  /api/v1/auth/status/    # Durum kontrolü
```

#### Gönüllüler
```
GET    /api/v1/volunteers/           # Gönüllü listesi
POST   /api/v1/volunteers/           # Yeni gönüllü
GET    /api/v1/volunteers/{id}/      # Gönüllü detayı
PUT    /api/v1/volunteers/{id}/      # Gönüllü güncelle
DELETE /api/v1/volunteers/{id}/      # Gönüllü sil
```

#### Kargo
```
GET    /api/v1/cargo/               # Kargo listesi
POST   /api/v1/cargo/               # Yeni kargo
GET    /api/v1/cargo/{id}/          # Kargo detayı
PUT    /api/v1/cargo/{id}/          # Kargo güncelle
GET    /api/v1/cargo/track/{no}/    # Kargo takibi
```

#### Sistem
```
GET /api/v1/health/          # Sistem durumu
GET /api/v1/                 # API kök
```

### Örnek API Kullanımı

```javascript
// Gönüllü listesi alma
fetch('http://localhost:8000/api/v1/volunteers/')
  .then(response => response.json())
  .then(data => console.log(data));

// Kargo takibi
fetch('http://localhost:8000/api/v1/cargo/track/AYK123456789')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

### Geliştirme Kuralları

- TypeScript kullanın
- ESLint kurallarına uyun
- Commit mesajlarını açıklayıcı yazın
- Test yazın
- Dokümantasyonu güncelleyin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- **Proje Yürütücüsü**: Taha Yunus DEMİR
- **GitHub**: https://github.com/tahayunusdemir/ayika
- **E-posta**: taha@ayika.org

---

**Ayika** - Afet durumlarında umut ışığı ✨" 
