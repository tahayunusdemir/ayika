# Ayika Backend

**Acil Yardım ve İhtiyaç Koordinasyon Ağı - Django Backend**

Emergency Aid and Needs Coordination Network - Django Backend

## 🚀 Özellikler

- **Django 5.1** - Modern Python web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Production database
- **Redis** - Caching and Celery backend
- **Docker** - Containerization
- **CORS** - Frontend entegrasyonu

## 📦 Teknoloji Stack'i

- Python 3.11
- Django 5.1.1
- Django REST Framework 3.16.1
- PostgreSQL 15
- Redis 7
- Docker & Docker Compose

## 🏗️ Proje Yapısı

```
backend/
├── ayika_project/          # Django proje ayarları
├── apps/                   # Django uygulamaları
│   ├── core/              # Temel API endpoints
│   ├── volunteers/        # Gönüllü yönetimi
│   └── cargo/             # Kargo takip sistemi
├── requirements/          # Python bağımlılıkları
├── docker/               # Docker konfigürasyonları
├── docs/                 # Dokümantasyon
├── manage.py             # Django yönetim scripti
├── Dockerfile            # Docker build dosyası
└── docker-compose.yml    # Docker Compose konfigürasyonu
```

## 🛠️ Kurulum

### 1. Repository'yi Klonlayın
```bash
git clone https://github.com/tahayunusdemir/ayika.git
cd ayika/web/backend
```

### 2. Virtual Environment Oluşturun
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

### 3. Bağımlılıkları Yükleyin
```bash
pip install -r requirements/development.txt
```

### 4. Environment Variables
```bash
cp .env.example .env
# .env dosyasını düzenleyin
```

### 5. Database Migration
```bash
python manage.py migrate
```

### 6. Superuser Oluşturun
```bash
python manage.py createsuperuser
```

### 7. Development Server
```bash
python manage.py runserver
```

## 🐳 Docker ile Çalıştırma

### Development Ortamı
```bash
# Backend + PostgreSQL + Redis
npm run docker:dev

# Logları görüntüle
npm run docker:logs

# Container'ı durdur
npm run docker:dev:down
```

### Production Ortamı
```bash
npm run docker:prod
npm run docker:prod:down
```

### Docker Komutları
```bash
# Migration çalıştır
npm run docker:migrate

# Superuser oluştur
npm run docker:createsuperuser

# Django shell
npm run docker:shell

# Static files collect
npm run docker:collectstatic
```

## 📋 API Endpoints

### Core Endpoints
- `GET /api/v1/` - API root
- `GET /api/v1/health/` - Health check

### Volunteers
- `GET /api/v1/volunteers/` - Gönüllü listesi
- `POST /api/v1/volunteers/` - Yeni gönüllü
- `GET /api/v1/volunteers/{id}/` - Gönüllü detayı
- `PUT /api/v1/volunteers/{id}/` - Gönüllü güncelle
- `DELETE /api/v1/volunteers/{id}/` - Gönüllü sil

### Cargo
- `GET /api/v1/cargo/` - Kargo listesi
- `POST /api/v1/cargo/` - Yeni kargo
- `GET /api/v1/cargo/{id}/` - Kargo detayı
- `GET /api/v1/cargo/track/{tracking_number}/` - Kargo takip

### Admin Panel
- `GET /admin/` - Django admin panel

## 🔧 Environment Variables

```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Redis
REDIS_URL=redis://localhost:6379/0

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## 🧪 Testing

```bash
# Testleri çalıştır
python manage.py test

# Coverage ile
coverage run --source='.' manage.py test
coverage report
```

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:8000/api/v1/health/
```

### Container Health
```bash
docker ps
npm run docker:logs
```

## 🚀 Production Deployment

### 1. Environment Variables
```bash
DEBUG=False
SECRET_KEY=production-secret-key
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### 2. Static Files
```bash
python manage.py collectstatic --noinput
```

### 3. Database Migration
```bash
python manage.py migrate
```

### 4. Gunicorn Server
```bash
gunicorn --bind 0.0.0.0:8000 ayika_project.wsgi:application
```

## 🔐 Güvenlik

- CORS konfigürasyonu
- CSRF protection
- SQL injection koruması
- XSS koruması
- Secure headers

## 📝 Geliştirme Notları

- Models henüz oluşturulmadı (gelecek sürümde)
- Authentication sistemi eklenecek
- Celery task queue entegrasyonu
- API documentation (Swagger/OpenAPI)
- Unit testler yazılacak

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Ekip

- **Ayika Team** - Acil Yardım ve İhtiyaç Koordinasyon Ağı

## 📞 İletişim

- GitHub: https://github.com/tahayunusdemir/ayika
- Issues: https://github.com/tahayunusdemir/ayika/issues
