# Ayika Frontend Docker Kurulum ve Kullanım Rehberi

Bu dokümantasyon, Ayika frontend uygulamasını Docker ile çalıştırmak için gerekli tüm adımları içermektedir.

## 🛠️ Gereksinimler

- Docker Desktop (Windows/Mac) veya Docker Engine (Linux)
- Docker Compose
- Git

## 📦 Proje Yapısı

```
frontend/
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Docker Compose konfigürasyonu
├── nginx.conf              # Production Nginx konfigürasyonu
├── .dockerignore           # Docker ignore dosyası
├── .env.example            # Environment variables örneği
└── DOCKER.md              # Bu dokümantasyon
```

## 🚀 Hızlı Başlangıç

### 1. Repository'yi Klonlayın
```bash
git clone https://github.com/tahayunusdemir/ayika.git
cd ayika/web/frontend
```

### 2. Environment Variables Ayarlayın
```bash
cp .env.example .env
# .env dosyasını düzenleyin
```

### 3. Development Ortamını Başlatın
```bash
npm run docker:dev
```

Uygulama http://localhost:5173 adresinde çalışacaktır.

## 📋 Kullanılabilir Komutlar

### Development (Geliştirme) Ortamı
```bash
# Development container'ı başlat
npm run docker:dev

# Development container'ı durdur
npm run docker:dev:down

# Development image'ı build et
npm run docker:build:dev
```

### Production (Üretim) Ortamı
```bash
# Production container'ı başlat
npm run docker:prod

# Production container'ı durdur
npm run docker:prod:down

# Production image'ı build et
npm run docker:build:prod
```

### Docker Temizliği
```bash
# Kullanılmayan Docker kaynaklarını temizle
npm run docker:clean
```

### Manuel Docker Komutları
```bash
# Development için
docker-compose --profile dev up --build

# Production için
docker-compose --profile prod up --build

# Container'ları durdur
docker-compose down

# Logları görüntüle
docker-compose logs -f
```

## 🔧 Konfigürasyon Detayları

### Dockerfile Aşamaları

1. **Builder Stage**: Uygulamayı build eder
2. **Production Stage**: Nginx ile production serve eder
3. **Development Stage**: Hot reload ile development server çalıştırır

### Port Konfigürasyonu

- **Development**: 5173 (Vite dev server)
- **Production**: 80 (Nginx)

### Volume Mounting

Development ortamında kaynak kod volume olarak mount edilir:
```yaml
volumes:
  - .:/app
  - /app/node_modules
```

## 🌐 Environment Variables

### Temel Değişkenler
```env
VITE_API_URL=http://localhost:3000    # Backend API URL
NODE_ENV=development                   # Ortam modu
PORT=5173                             # Development port
```

### MUI ve React Konfigürasyonu
Proje şu teknolojileri kullanmaktadır:
- React 19.1.1
- Material-UI v7.3.2
- TypeScript
- Vite 7.1.2
- React Router DOM v7.8.2

## 🔍 Troubleshooting

### Yaygın Sorunlar ve Çözümleri

1. **Port zaten kullanımda**
   ```bash
   # Çalışan container'ları kontrol et
   docker ps
   
   # Container'ı durdur
   docker stop ayika-frontend-dev
   ```

2. **Volume mount sorunları**
   ```bash
   # Container'ı yeniden başlat
   docker-compose down
   docker-compose --profile dev up --build
   ```

3. **Node modules sorunları**
   ```bash
   # Docker cache'i temizle
   docker system prune -f
   npm run docker:clean
   ```

4. **Hot reload çalışmıyor**
   - `vite.config.ts` dosyasında `usePolling: true` ayarı kontrol edin
   - Windows/Mac'te Docker Desktop'ta file sharing aktif olmalı

### Log Kontrolü
```bash
# Container loglarını görüntüle
docker-compose logs -f ayika-frontend-dev

# Specific container logs
docker logs ayika-frontend-dev
```

## 📊 Performance Optimizasyonları

### Production Build
- Gzip compression aktif
- Static asset caching
- Code splitting (vendor, mui, router chunks)
- Sourcemap devre dışı

### Development
- Hot Module Replacement (HMR)
- File watching with polling
- Volume mounting for instant updates

## 🔐 Güvenlik

### Nginx Security Headers
```nginx
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### Docker Security
- Non-root user kullanımı
- Multi-stage build ile minimal production image
- .dockerignore ile sensitive dosyaların exclusion'ı

## 🚀 Production Deployment

### Docker Hub'a Push
```bash
# Image'ı tag'le
docker tag ayika-frontend:prod your-registry/ayika-frontend:latest

# Push et
docker push your-registry/ayika-frontend:latest
```

### Server'da Çalıştırma
```bash
# Production container'ı çalıştır
docker run -d -p 80:80 --name ayika-frontend your-registry/ayika-frontend:latest
```

## 📞 Destek

Sorunlarla karşılaştığınızda:
1. Bu dokümantasyondaki troubleshooting bölümünü kontrol edin
2. GitHub Issues'da benzer sorunları arayın
3. Yeni issue oluşturun

## 📝 Notlar

- Development ortamında değişiklikler otomatik olarak yansır
- Production build optimize edilmiş ve minify edilmiştir
- Nginx konfigürasyonu React Router için SPA routing destekler
- Environment variables `.env` dosyasından yüklenir
