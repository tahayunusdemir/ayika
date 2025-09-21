# GÖNÜLLÜ VERİTABANI TASARIMI

## Django Model Yapısı

### Volunteer (Gönüllü) Modeli

```python
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
import random

class Volunteer(models.Model):
    # Kimlik ve Kullanıcı Bilgileri
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='volunteer_profile',
        help_text='Django User modeli ile bağlantı'
    )
    
    gonulluluk_no = models.CharField(
        max_length=12,
        unique=True,
        blank=True,
        help_text='Otomatik üretilen gönüllülük numarası (G0123456789)'
    )
    
    # Kişisel Bilgiler
    ad = models.CharField(
        max_length=50,
        verbose_name='Ad'
    )
    
    soyad = models.CharField(
        max_length=50,
        verbose_name='Soyad'
    )
    
    telefon = models.CharField(
        max_length=10,
        validators=[RegexValidator(
            regex=r'^[1-9][0-9]{9}$',
            message='Telefon numarası 10 haneli olmalı ve 0 ile başlamamalı (5XXXXXXXXX)'
        )],
        help_text='Başında 0 olmayan 10 haneli telefon numarası'
    )
    
    # Konum Bilgileri
    SEHIR_CHOICES = [
        ('adana', 'Adana'),
        ('adiyaman', 'Adıyaman'),
        ('afyonkarahisar', 'Afyonkarahisar'),
        ('agri', 'Ağrı'),
        ('amasya', 'Amasya'),
        ('ankara', 'Ankara'),
        ('antalya', 'Antalya'),
        ('artvin', 'Artvin'),
        ('aydin', 'Aydın'),
        ('balikesir', 'Balıkesir'),
        ('bilecik', 'Bilecik'),
        ('bingol', 'Bingöl'),
        ('bitlis', 'Bitlis'),
        ('bolu', 'Bolu'),
        ('burdur', 'Burdur'),
        ('bursa', 'Bursa'),
        ('canakkale', 'Çanakkale'),
        ('cankiri', 'Çankırı'),
        ('corum', 'Çorum'),
        ('denizli', 'Denizli'),
        ('diyarbakir', 'Diyarbakır'),
        ('edirne', 'Edirne'),
        ('elazig', 'Elazığ'),
        ('erzincan', 'Erzincan'),
        ('erzurum', 'Erzurum'),
        ('eskisehir', 'Eskişehir'),
        ('gaziantep', 'Gaziantep'),
        ('giresun', 'Giresun'),
        ('gumushane', 'Gümüşhane'),
        ('hakkari', 'Hakkâri'),
        ('hatay', 'Hatay'),
        ('isparta', 'Isparta'),
        ('mersin', 'Mersin'),
        ('istanbul', 'İstanbul'),
        ('izmir', 'İzmir'),
        ('kars', 'Kars'),
        ('kastamonu', 'Kastamonu'),
        ('kayseri', 'Kayseri'),
        ('kirklareli', 'Kırklareli'),
        ('kirsehir', 'Kırşehir'),
        ('kocaeli', 'Kocaeli'),
        ('konya', 'Konya'),
        ('kutahya', 'Kütahya'),
        ('malatya', 'Malatya'),
        ('manisa', 'Manisa'),
        ('kahramanmaras', 'Kahramanmaraş'),
        ('mardin', 'Mardin'),
        ('mugla', 'Muğla'),
        ('mus', 'Muş'),
        ('nevsehir', 'Nevşehir'),
        ('nigde', 'Niğde'),
        ('ordu', 'Ordu'),
        ('rize', 'Rize'),
        ('sakarya', 'Sakarya'),
        ('samsun', 'Samsun'),
        ('siirt', 'Siirt'),
        ('sinop', 'Sinop'),
        ('sivas', 'Sivas'),
        ('tekirdag', 'Tekirdağ'),
        ('tokat', 'Tokat'),
        ('trabzon', 'Trabzon'),
        ('tunceli', 'Tunceli'),
        ('sanliurfa', 'Şanlıurfa'),
        ('usak', 'Uşak'),
        ('van', 'Van'),
        ('yozgat', 'Yozgat'),
        ('zonguldak', 'Zonguldak'),
        ('aksaray', 'Aksaray'),
        ('bayburt', 'Bayburt'),
        ('karaman', 'Karaman'),
        ('kirikkale', 'Kırıkkale'),
        ('batman', 'Batman'),
        ('sirnak', 'Şırnak'),
        ('bartin', 'Bartın'),
        ('ardahan', 'Ardahan'),
        ('igdir', 'Iğdır'),
        ('yalova', 'Yalova'),
        ('karabuk', 'Karabük'),
        ('kilis', 'Kilis'),
        ('osmaniye', 'Osmaniye'),
        ('duzce', 'Düzce'),
    ]
    
    sehir = models.CharField(
        max_length=50,
        choices=SEHIR_CHOICES,
        verbose_name='Şehir'
    )
    
    # Gönüllülük Bilgileri
    GONULLU_TIPI_CHOICES = [
        ('toplama', 'Toplama Gönüllüsü'),
        ('tasima', 'Taşıma Gönüllüsü'),
        ('dagitim', 'Dağıtım Gönüllüsü'),
        ('karma', 'Karma Gönüllü (Tüm Görevler)'),
    ]
    
    gonullu_tipi = models.CharField(
        max_length=20,
        choices=GONULLU_TIPI_CHOICES,
        verbose_name='Gönüllü Tipi'
    )
    
    # Durum ve Tarih Bilgileri
    is_active = models.BooleanField(
        default=True,
        verbose_name='Aktif Durum',
        help_text='Gönüllünün aktif olup olmadığını belirtir'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Kayıt Tarihi'
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Son Güncelleme'
    )
    
    class Meta:
        verbose_name = 'Gönüllü'
        verbose_name_plural = 'Gönüllüler'
        ordering = ['-created_at']
        db_table = 'volunteers'
    
    def __str__(self):
        return f"{self.gonulluluk_no} - {self.ad} {self.soyad}"
    
    def save(self, *args, **kwargs):
        if not self.gonulluluk_no:
            # Otomatik gönüllülük numarası üretimi
            while True:
                number = f"G{random.randint(1000000000, 9999999999)}"
                if not Volunteer.objects.filter(gonulluluk_no=number).exists():
                    self.gonulluluk_no = number
                    break
        super().save(*args, **kwargs)
    
    @property
    def full_name(self):
        return f"{self.ad} {self.soyad}"
    
    @property
    def gonullu_tipi_display_with_icon(self):
        return self.get_gonullu_tipi_display()
```

## Django Admin Konfigürasyonu

```python
from django.contrib import admin
from .models import Volunteer

@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    # Tablo görünümü - sadece istenen alanlar
    list_display = [
        'gonulluluk_no',  # No
        'ad',             # Ad  
        'soyad',          # Soyad
        'sehir',          # Şehir
        'gonullu_tipi',   # Tipi
        'is_active',      # Aktiflik (editlenebilir)
        'created_at'      # Kayıt Tarihi
    ]
    
    # Filtreleme seçenekleri
    list_filter = [
        'gonullu_tipi', 
        'sehir', 
        'is_active', 
        'created_at'
    ]
    
    # Arama alanları
    search_fields = [
        'gonulluluk_no', 
        'ad', 
        'soyad'
    ]
    
    # Mevcut kayıtlarda sadece aktiflik durumu editlenebilir
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Mevcut kayıt düzenleniyorsa
            return [
                'user', 'gonulluluk_no', 'ad', 'soyad', 'telefon', 
                'sehir', 'gonullu_tipi', 'created_at', 'updated_at'
            ]
        else:  # Yeni kayıt ekleniyorsa
            return ['gonulluluk_no', 'created_at', 'updated_at']
    
    # Form alanları - yeni ekleme ve düzenleme için
    def get_fields(self, request, obj=None):
        if obj:  # Mevcut kayıt düzenleniyorsa
            return [
                'user', 'gonulluluk_no', 'ad', 'soyad', 'telefon', 
                'sehir', 'gonullu_tipi', 'is_active', 
                'created_at', 'updated_at'
            ]
        else:  # Yeni kayıt ekleniyorsa
            return [
                'user', 'ad', 'soyad', 'telefon', 
                'sehir', 'gonullu_tipi', 'is_active'
            ]
    
    # Liste sayfasında aktiflik durumunu hızlı değiştirme
    list_editable = ['is_active']
    
    def has_add_permission(self, request):
        # Yeni gönüllü eklemeye izin ver
        return True
    
    def has_delete_permission(self, request, obj=None):
        # Silmeyi engelle
        return False
```

## Önemli Notlar

### Admin Panel Kısıtlamaları
- **Yeni Ekleme İzinli**: Yeni gönüllü eklenebilir ve tüm alanlar zorunlu
- **Mevcut Kayıtlarda Sadece Aktiflik Editlenebilir**: Var olan gönüllülerde sadece `is_active` değiştirilebilir
- **Tablo Görünümü**: No, Ad, Soyad, Şehir, Tipi, Aktiflik, Kayıt Tarihi
- **Tüm Alanlar Zorunlu**: Yeni ekleme sırasında tüm alanlar doldurulmalı
- **Silme Yasak**: `has_delete_permission = False` ile silme işlemi engellendi
- **Hızlı Düzenleme**: Liste sayfasında aktiflik durumu checkbox ile hızlıca değiştirilebilir

### Güvenlik ve Kimlik Doğrulama
- **Django User Modeli**: Şifre, email, username gibi temel kimlik bilgileri
- **OneToOne İlişki**: Her gönüllü bir Django kullanıcısına bağlı
- **Otomatik Gönüllülük No**: G + 10 haneli rastgele sayı formatında

### Login Requirements
- **Email + Password**: Giriş için sadece email ve şifre yeterli
- **Password Policy**: 
  - Minimum 8 karakter
  - En az 1 büyük harf
  - En az 1 küçük harf
  - En az 1 özel karakter (!@#$%^&*)
- **Validation**: Django'nun built-in password validators kullanılacak

```python
# settings.py - Password validation configuration
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
    # Custom validator for uppercase, lowercase, and special characters
    {
        'NAME': 'myapp.validators.CustomPasswordValidator',
    },
]

# Custom validator example (myapp/validators.py)
import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class CustomPasswordValidator:
    def validate(self, password, user=None):
        if not re.search(r'[A-Z]', password):
            raise ValidationError(_('Password must contain at least one uppercase letter.'))
        if not re.search(r'[a-z]', password):
            raise ValidationError(_('Password must contain at least one lowercase letter.'))
        if not re.search(r'[!@#$%^&*]', password):
            raise ValidationError(_('Password must contain at least one special character (!@#$%^&*).'))

    def get_help_text(self):
        return _('Your password must contain at least one uppercase letter, one lowercase letter, and one special character (!@#$%^&*).')
```


### Telefon Numarası Formatı
- **Format**: `5XXXXXXXXX` (10 hane, 0 ile başlamaz)
- **Validasyon**: RegexValidator ile otomatik kontrol
- **Örnek**: `5551234567`

### Şehir Seçimi
- **81 İl**: Tüm Türkiye şehirleri choices olarak tanımlı
- **Küçük Harf**: Database'de küçük harfle saklanır
- **Görüntüleme**: Admin panelde büyük harfle görünür

### Gönüllü Tipleri (Volunteer Types)
- **Toplama**: Yardım malzemelerini toplama
- **Taşıma**: Malzemeleri bir yerden başka yere taşıma  
- **Dağıtım**: Son kullanıcıya malzeme dağıtımı
- **Karma**: Tüm görevleri yapabilir

### Durum Yönetimi
- **is_active**: Soft delete için kullanılır
- **created_at**: Kayıt tarihi (otomatik)
- **updated_at**: Son güncelleme (otomatik)

---

## Django Serializer Örneği

```python
from rest_framework import serializers
from .models import Volunteer

class VolunteerSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    gonullu_tipi_display = serializers.CharField(source='get_gonullu_tipi_display', read_only=True)
    sehir_display = serializers.CharField(source='get_sehir_display', read_only=True)
    
    class Meta:
        model = Volunteer
        fields = [
            'id',
            'gonulluluk_no',
            'ad',
            'soyad', 
            'full_name',
            'telefon',
            'sehir',
            'sehir_display',
            'gonullu_tipi',
            'gonullu_tipi_display',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['gonulluluk_no', 'created_at', 'updated_at']
```

## Migration Örneği

```python
# Generated migration file
from django.db import migrations, models
import django.core.validators
import django.db.models.deletion
from django.conf import settings

class Migration(migrations.Migration):
    initial = True
    
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]
    
    operations = [
        migrations.CreateModel(
            name='Volunteer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gonulluluk_no', models.CharField(blank=True, help_text='Otomatik üretilen gönüllülük numarası (G0123456789)', max_length=12, unique=True)),
                ('ad', models.CharField(max_length=50, verbose_name='Ad')),
                ('soyad', models.CharField(max_length=50, verbose_name='Soyad')),
                ('telefon', models.CharField(help_text='Başında 0 olmayan 10 haneli telefon numarası', max_length=10, validators=[django.core.validators.RegexValidator(message='Telefon numarası 10 haneli olmalı ve 0 ile başlamamalı (5XXXXXXXXX)', regex='^[1-9][0-9]{9}$')])),
                ('sehir', models.CharField(choices=[('adana', 'Adana'), ('adiyaman', 'Adıyaman'), ('afyonkarahisar', 'Afyonkarahisar'), ('agri', 'Ağrı'), ('amasya', 'Amasya'), ('ankara', 'Ankara'), ('antalya', 'Antalya'), ('artvin', 'Artvin'), ('aydin', 'Aydın'), ('balikesir', 'Balıkesir'), ('bilecik', 'Bilecik'), ('bingol', 'Bingöl'), ('bitlis', 'Bitlis'), ('bolu', 'Bolu'), ('burdur', 'Burdur'), ('bursa', 'Bursa'), ('canakkale', 'Çanakkale'), ('cankiri', 'Çankırı'), ('corum', 'Çorum'), ('denizli', 'Denizli'), ('diyarbakir', 'Diyarbakır'), ('edirne', 'Edirne'), ('elazig', 'Elazığ'), ('erzincan', 'Erzincan'), ('erzurum', 'Erzurum'), ('eskisehir', 'Eskişehir'), ('gaziantep', 'Gaziantep'), ('giresun', 'Giresun'), ('gumushane', 'Gümüşhane'), ('hakkari', 'Hakkâri'), ('hatay', 'Hatay'), ('isparta', 'Isparta'), ('mersin', 'Mersin'), ('istanbul', 'İstanbul'), ('izmir', 'İzmir'), ('kars', 'Kars'), ('kastamonu', 'Kastamonu'), ('kayseri', 'Kayseri'), ('kirklareli', 'Kırklareli'), ('kirsehir', 'Kırşehir'), ('kocaeli', 'Kocaeli'), ('konya', 'Konya'), ('kutahya', 'Kütahya'), ('malatya', 'Malatya'), ('manisa', 'Manisa'), ('kahramanmaras', 'Kahramanmaraş'), ('mardin', 'Mardin'), ('mugla', 'Muğla'), ('mus', 'Muş'), ('nevsehir', 'Nevşehir'), ('nigde', 'Niğde'), ('ordu', 'Ordu'), ('rize', 'Rize'), ('sakarya', 'Sakarya'), ('samsun', 'Samsun'), ('siirt', 'Siirt'), ('sinop', 'Sinop'), ('sivas', 'Sivas'), ('tekirdag', 'Tekirdağ'), ('tokat', 'Tokat'), ('trabzon', 'Trabzon'), ('tunceli', 'Tunceli'), ('sanliurfa', 'Şanlıurfa'), ('usak', 'Uşak'), ('van', 'Van'), ('yozgat', 'Yozgat'), ('zonguldak', 'Zonguldak'), ('aksaray', 'Aksaray'), ('bayburt', 'Bayburt'), ('karaman', 'Karaman'), ('kirikkale', 'Kırıkkale'), ('batman', 'Batman'), ('sirnak', 'Şırnak'), ('bartin', 'Bartın'), ('ardahan', 'Ardahan'), ('igdir', 'Iğdır'), ('yalova', 'Yalova'), ('karabuk', 'Karabük'), ('kilis', 'Kilis'), ('osmaniye', 'Osmaniye'), ('duzce', 'Düzce')], max_length=50, verbose_name='Şehir')),
                ('gonullu_tipi', models.CharField(choices=[('toplama', 'Toplama Gönüllüsü'), ('tasima', 'Taşıma Gönüllüsü'), ('dagitim', 'Dağıtım Gönüllüsü'), ('karma', 'Karma Gönüllü (Tüm Görevler)')], max_length=20, verbose_name='Gönüllü Tipi')),
                ('is_active', models.BooleanField(default=True, help_text='Gönüllünün aktif olup olmadığını belirtir', verbose_name='Aktif Durum')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Kayıt Tarihi')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Son Güncelleme')),
                ('user', models.OneToOneField(help_text='Django User modeli ile bağlantı', on_delete=django.db.models.deletion.CASCADE, related_name='volunteer_profile', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Gönüllü',
                'verbose_name_plural': 'Gönüllüler',
                'db_table': 'volunteers',
                'ordering': ['-created_at'],
            },
        ),
    ]
```
