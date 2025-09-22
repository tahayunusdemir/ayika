# KARGO VERİTABANI TASARIMI

## Django Model Yapısı

```python
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator, MinValueValidator
from django.core.exceptions import ValidationError
import random

class Kargo(models.Model):
    # Kargo Numarası - Otomatik oluşturulur
    kargo_no = models.CharField(
        max_length=12, 
        unique=True, 
        verbose_name="Kargo Numarası",
        help_text="AYK123456789 formatında otomatik oluşturulur"
    )
    
    # Gönderici Bilgileri (Anonim olabilir)
    anonim_gonderici = models.BooleanField(
        default=False,
        verbose_name="Anonim Gönderici"
    )
    gonderici_ad = models.CharField(
        max_length=50, 
        blank=True, 
        null=True,
        verbose_name="Gönderici Adı"
    )
    gonderici_soyad = models.CharField(
        max_length=50, 
        blank=True, 
        null=True,
        verbose_name="Gönderici Soyadı"
    )
    gonderici_telefon = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        validators=[RegexValidator(r'^5\d{9}$', 'Telefon 5XXXXXXXXX formatında olmalıdır')],
        verbose_name="Gönderici Telefon"
    )
    gonderici_email = models.EmailField(
        blank=True, 
        null=True,
        verbose_name="Gönderici E-posta"
    )
    
    # Konum Bilgileri
    SEHIR_CHOICES = [
        ('adana', 'Adana'), ('adiyaman', 'Adıyaman'), ('afyonkarahisar', 'Afyonkarahisar'),
        ('agri', 'Ağrı'), ('aksaray', 'Aksaray'), ('amasya', 'Amasya'), ('ankara', 'Ankara'),
        ('antalya', 'Antalya'), ('ardahan', 'Ardahan'), ('artvin', 'Artvin'), ('aydin', 'Aydın'),
        ('balikesir', 'Balıkesir'), ('bartin', 'Bartın'), ('batman', 'Batman'), ('bayburt', 'Bayburt'),
        ('bilecik', 'Bilecik'), ('bingol', 'Bingöl'), ('bitlis', 'Bitlis'), ('bolu', 'Bolu'),
        ('burdur', 'Burdur'), ('bursa', 'Bursa'), ('canakkale', 'Çanakkale'), ('cankiri', 'Çankırı'),
        ('corum', 'Çorum'), ('denizli', 'Denizli'), ('diyarbakir', 'Diyarbakır'), ('duzce', 'Düzce'),
        ('edirne', 'Edirne'), ('elazig', 'Elazığ'), ('erzincan', 'Erzincan'), ('erzurum', 'Erzurum'),
        ('eskisehir', 'Eskişehir'), ('gaziantep', 'Gaziantep'), ('giresun', 'Giresun'), ('gumushane', 'Gümüşhane'),
        ('hakkari', 'Hakkâri'), ('hatay', 'Hatay'), ('igdir', 'Iğdır'), ('isparta', 'Isparta'),
        ('istanbul', 'İstanbul'), ('izmir', 'İzmir'), ('kahramanmaras', 'Kahramanmaraş'), ('karabuk', 'Karabük'),
        ('karaman', 'Karaman'), ('kars', 'Kars'), ('kastamonu', 'Kastamonu'), ('kayseri', 'Kayseri'),
        ('kilis', 'Kilis'), ('kirikkale', 'Kırıkkale'), ('kirklareli', 'Kırklareli'), ('kirsehir', 'Kırşehir'),
        ('kocaeli', 'Kocaeli'), ('konya', 'Konya'), ('kutahya', 'Kütahya'), ('malatya', 'Malatya'),
        ('manisa', 'Manisa'), ('mardin', 'Mardin'), ('mersin', 'Mersin'), ('mugla', 'Muğla'),
        ('mus', 'Muş'), ('nevsehir', 'Nevşehir'), ('nigde', 'Niğde'), ('ordu', 'Ordu'),
        ('osmaniye', 'Osmaniye'), ('rize', 'Rize'), ('sakarya', 'Sakarya'), ('samsun', 'Samsun'),
        ('sanliurfa', 'Şanlıurfa'), ('siirt', 'Siirt'), ('sinop', 'Sinop'), ('sirnak', 'Şırnak'),
        ('sivas', 'Sivas'), ('tekirdag', 'Tekirdağ'), ('tokat', 'Tokat'), ('trabzon', 'Trabzon'),
        ('tunceli', 'Tunceli'), ('usak', 'Uşak'), ('van', 'Van'), ('yalova', 'Yalova'),
        ('yozgat', 'Yozgat'), ('zonguldak', 'Zonguldak')
    ]
    
    cikis_yeri = models.CharField(
        max_length=20,
        choices=SEHIR_CHOICES,
        verbose_name="Çıkış Yeri"
    )
    ulasacagi_yer = models.CharField(
        max_length=20,
        choices=SEHIR_CHOICES,
        verbose_name="Ulaşacağı Yer"
    )
    
    # Kargo Detayları
    agirlik = models.DecimalField(
        max_digits=8, 
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        verbose_name="Ağırlık (kg)",
        help_text="Minimum 0.01 kg"
    )
    hacim = models.DecimalField(
        max_digits=8, 
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        verbose_name="Hacim (m³)",
        help_text="Minimum 0.01 m³"
    )
    miktar = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        verbose_name="Miktar (Adet)",
        help_text="Minimum 1 adet"
    )
    
    # Durum
    DURUM_CHOICES = [
        ('hazirlaniyor', 'Hazırlanıyor'),
        ('yolda', 'Yolda'),
        ('teslim_edildi', 'Teslim Edildi'),
        ('iptal_edildi', 'İptal Edildi'),
    ]
    durum = models.CharField(
        max_length=15,
        choices=DURUM_CHOICES,
        default='hazirlaniyor',
        verbose_name="Durum"
    )
    
    # Kargo Tipi ve İçerik
    KARGO_TIPI_CHOICES = [
        ('gida', 'Gıda'),
        ('ilac', 'İlaç'),
        ('giyim', 'Giyim'),
        ('karisik', 'Karışık'),
        ('diger', 'Diğer'),
    ]
    kargo_tipi = models.CharField(
        max_length=10,
        choices=KARGO_TIPI_CHOICES,
        verbose_name="Kargo Tipi"
    )
    
    # İçerik Seçenekleri
    GIDA_CHOICES = [
        "Su (5L, 10L, 19L)", "Konserve Gıda (Et, Sebze, Meyve)", "Kuru Gıda Paketi",
        "Bebek Maması ve Besini", "Taze Meyve ve Sebze", "Ekmek ve Unlu Mamuller",
        "Pirinç (1kg, 5kg, 25kg)", "Makarna ve Bulgur", "Bakliyat (Mercimek, Fasulye, Nohut)",
        "Yağ ve Tereyağı", "Süt ve Süt Ürünleri", "Hazır Yemek Paketi",
        "Çay ve Kahve", "Şeker ve Bal", "Tuz ve Baharat",
        "Bisküvi ve Kraker", "Kuruyemiş ve Çekirdek", "Reçel ve Pekmez",
        "Çikolata ve Şeker", "Mama Biberon ve Emzik"
    ]
    
    ILAC_CHOICES = [
        "Reçeteli İlaç Paketi", "Ağrı Kesici (Parol, Aspirin)", "Ateş Düşürücü",
        "Soğuk Algınlığı İlacı", "Vitamin ve Mineral Takviyesi", "İlk Yardım Çantası",
        "Bandaj ve Sargı Malzemesi", "Antiseptik ve Dezenfektan", "Termometre",
        "Kan Basıncı Aleti", "Diyabet Test Kiti", "Maske ve Eldiven",
        "Serum Fizyolojik", "Pamuk ve Gazlı Bez", "Yara Bandı ve Flaster",
        "Öksürük Şurubu", "Mide İlacı", "Göz Damlası",
        "Kulak Damlası", "Merhem ve Krem", "Enjektör ve İğne",
        "Tansiyon İlacı", "Kalp İlacı", "Nefes Açıcı (Astım)",
        "İnsülin ve Diyabet Malzemeleri"
    ]
    
    GIYIM_CHOICES = [
        "Yetişkin Kış Kıyafeti", "Yetişkin Yaz Kıyafeti", "Çocuk Kıyafeti (0-2 Yaş)",
        "Çocuk Kıyafeti (3-12 Yaş)", "Genç Kıyafeti (13-18 Yaş)", "Ayakkabı (Erkek/Kadın/Çocuk)",
        "İç Çamaşırı Seti", "Battaniye ve Yorgan", "Uyku Tulumu",
        "Yastık ve Kılıf", "Çadır ve Kamp Malzemesi", "Mont ve Kaban",
        "Çorap ve Külotlu Çorap", "Eldiven ve Bere", "Atkı ve Şal",
        "Pijama ve Gecelik", "Hamile Kıyafeti", "Bebek Kıyafeti ve Zıbın",
        "İş Kıyafeti ve Önlük", "Spor Kıyafeti", "Terlik ve Sandalet",
        "Çizme ve Bot", "Kemer ve Aksesuar"
    ]
    
    KARISIK_CHOICES = [
        "Aile Yardım Paketi", "Acil Durum Paketi", "Bebek Bakım Paketi",
        "Okul Malzemeleri Paketi", "Hijyen Paketi", "Temizlik Malzemeleri Paketi",
        "Kışlık Hazırlık Paketi", "Yenidoğan Paketi", "Yaşlı Bakım Paketi",
        "Engelli Bakım Paketi", "Kadın Hijyen Paketi", "Erkek Bakım Paketi",
        "Çocuk Oyun Paketi", "Eğitim Destek Paketi", "Mutfak Eşyası Paketi",
        "Banyo Malzemeleri Paketi", "Kamp ve Barınma Paketi", "İletişim Paketi"
    ]
    
    DIGER_CHOICES = [
        "Elektronik Eşya (Telefon, Tablet)", "Ev Eşyası (Tencere, Tabak)", "Eğitim Malzemeleri",
        "Kitap ve Dergi", "Çocuk Oyuncakları", "Spor Malzemeleri",
        "Müzik Aletleri", "Bahçe ve Tarım Malzemeleri", "İnşaat Malzemeleri",
        "Araç Yedek Parça", "Yakıt ve Enerji", "Haberleşme Cihazları",
        "Temizlik Malzemeleri", "Kırtasiye Malzemeleri", "Mobilya ve Dekorasyon",
        "Mutfak Gereçleri", "Banyo Malzemeleri", "Aydınlatma Malzemeleri",
        "Güvenlik Malzemeleri", "Yangın Söndürme Malzemeleri", "Jeneratör ve Güç Kaynağı",
        "Su Arıtma Cihazları", "Isıtma ve Soğutma Cihazları", "Çanta ve Bavul",
        "Saatler ve Takılar", "Optik Malzemeler (Gözlük)", "Pet Malzemeleri",
        "Hobi Malzemeleri", "Sanat Malzemeleri", "Fotoğraf ve Video Ekipmanları"
    ]
    
    icerik = models.TextField(
        verbose_name="İçerik",
        help_text="Kargo tipine göre seçilecek içerik listesi"
    )
    
    # Gönüllü Bilgileri - Volunteer modeli ile ForeignKey ilişkisi
    toplama_gonullusu = models.ForeignKey(
        'volunteers.Volunteer',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='toplama_kargolari',
        limit_choices_to={'gonullu_tipi__in': ['toplama', 'karma'], 'is_active': True},
        verbose_name="Toplama Gönüllüsü"
    )
    
    tasima_gonullusu = models.ForeignKey(
        'volunteers.Volunteer',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='tasima_kargolari',
        limit_choices_to={'gonullu_tipi__in': ['tasima', 'karma'], 'is_active': True},
        verbose_name="Taşıma Gönüllüsü"
    )
    
    dagitim_gonullusu = models.ForeignKey(
        'volunteers.Volunteer',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='dagitim_kargolari',
        limit_choices_to={'gonullu_tipi__in': ['dagitim', 'karma'], 'is_active': True},
        verbose_name="Dağıtım Gönüllüsü"
    )
    
    # Özel Not
    ozel_not = models.TextField(
        blank=True,
        null=True,
        verbose_name="Özel Not"
    )
    
    # Tarih Bilgileri
    olusturulma_tarihi = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Oluşturulma Tarihi"
    )
    son_degisiklik = models.DateTimeField(
        auto_now=True,
        verbose_name="Son Değişiklik"
    )
    
    def save(self, *args, **kwargs):
        if not self.kargo_no:
            self.kargo_no = self.generate_kargo_no()
        super().save(*args, **kwargs)
    
    def generate_kargo_no(self):
        """AYK123456789 formatında kargo numarası oluşturur"""
        while True:
            number = ''.join([str(random.randint(0, 9)) for _ in range(9)])
            kargo_no = f"AYK{number}"
            if not Kargo.objects.filter(kargo_no=kargo_no).exists():
                return kargo_no
    
    def clean(self):
        """Model validation"""
        super().clean()
        
        # Anonim gönderici kontrolü
        if not self.anonim_gonderici:
            if not self.gonderici_ad:
                raise ValidationError({'gonderici_ad': 'Anonim olmayan gönderici için ad zorunludur.'})
            if not self.gonderici_soyad:
                raise ValidationError({'gonderici_soyad': 'Anonim olmayan gönderici için soyad zorunludur.'})
            if not self.gonderici_telefon:
                raise ValidationError({'gonderici_telefon': 'Anonim olmayan gönderici için telefon zorunludur.'})
        
        # Aynı şehir kontrolü
        if self.cikis_yeri == self.ulasacagi_yer:
            raise ValidationError({
                'ulasacagi_yer': 'Çıkış yeri ve ulaşacağı yer aynı olamaz.'
            })
        
        # İçerik ve kargo tipi uyumluluk kontrolü
        if self.icerik and self.kargo_tipi:
            content_categories = {
                'gida': self.GIDA_CHOICES,
                'ilac': self.ILAC_CHOICES,
                'giyim': self.GIYIM_CHOICES,
                'karisik': self.KARISIK_CHOICES,
                'diger': self.DIGER_CHOICES,
            }
            
            if self.kargo_tipi in content_categories:
                valid_contents = content_categories[self.kargo_tipi]
                content_items = [item.strip() for item in self.icerik.split(',')]
                
                for item in content_items:
                    if item and item not in valid_contents:
                        raise ValidationError({
                            'icerik': f'"{item}" seçilen kargo tipi için geçerli bir içerik değil.'
                        })
    
    def __str__(self):
        return f"{self.kargo_no} - {self.get_durum_display()}"
    
    class Meta:
        verbose_name = "Kargo"
        verbose_name_plural = "Kargolar"
        ordering = ['-olusturulma_tarihi']
        db_table = 'kargo'

# Django Admin Yapılandırması
from django.contrib import admin

@admin.register(Kargo)
class KargoAdmin(admin.ModelAdmin):
    list_display = [
        'kargo_no', 'durum', 'kargo_tipi', 'cikis_yeri', 
        'ulasacagi_yer', 'agirlik', 'olusturulma_tarihi'
    ]
    list_filter = [
        'durum', 'kargo_tipi', 'cikis_yeri', 'ulasacagi_yer', 
        'anonim_gonderici', 'olusturulma_tarihi'
    ]
    search_fields = [
        'kargo_no', 'gonderici_ad', 'gonderici_soyad', 
        'toplama_gonullusu__ad', 'tasima_gonullusu__ad', 'dagitim_gonullusu__ad'
    ]
    readonly_fields = ['kargo_no', 'olusturulma_tarihi', 'son_degisiklik']
    
    fieldsets = (
        ('Kargo Bilgileri', {
            'fields': ('kargo_no', 'durum', 'kargo_tipi', 'icerik')
        }),
        ('Gönderici Bilgileri', {
            'fields': ('anonim_gonderici', 'gonderici_ad', 'gonderici_soyad', 
                      'gonderici_telefon', 'gonderici_email')
        }),
        ('Konum Bilgileri', {
            'fields': ('cikis_yeri', 'ulasacagi_yer')
        }),
        ('Kargo Detayları', {
            'fields': ('agirlik', 'hacim', 'miktar')
        }),
        ('Gönüllü Atamaları', {
            'fields': ('toplama_gonullusu', 'tasima_gonullusu', 'dagitim_gonullusu'),
            'classes': ('collapse',)
        }),
        ('Notlar', {
            'fields': ('ozel_not',)
        }),
        ('Tarih Bilgileri', {
            'fields': ('olusturulma_tarihi', 'son_degisiklik'),
            'classes': ('collapse',)
        }),
    )

# Django REST Framework Serializer
from rest_framework import serializers

class KargoSerializer(serializers.ModelSerializer):
    durum_display = serializers.CharField(source='get_durum_display', read_only=True)
    kargo_tipi_display = serializers.CharField(source='get_kargo_tipi_display', read_only=True)
    cikis_yeri_display = serializers.CharField(source='get_cikis_yeri_display', read_only=True)
    ulasacagi_yer_display = serializers.CharField(source='get_ulasacagi_yer_display', read_only=True)
    
    class Meta:
        model = Kargo
        fields = '__all__'
        read_only_fields = ['kargo_no', 'olusturulma_tarihi', 'son_degisiklik']

# Kullanım Örnekleri
"""
# Gönüllü seçimi
from volunteers.models import Volunteer

toplama_gonullusu = Volunteer.objects.filter(
    gonullu_tipi__in=['toplama', 'karma'], 
    is_active=True,
    sehir='istanbul'
).first()

tasima_gonullusu = Volunteer.objects.filter(
    gonullu_tipi__in=['tasima', 'karma'], 
    is_active=True
).first()

# Yeni kargo oluşturma
kargo = Kargo.objects.create(
    anonim_gonderici=False,
    gonderici_ad="Ahmet",
    gonderici_soyad="Yılmaz",
    gonderici_telefon="5551234567",
    gonderici_email="ahmet@example.com",
    cikis_yeri="istanbul",
    ulasacagi_yer="ankara",
    agirlik=15.50,
    hacim=0.25,
    miktar=3,
    kargo_tipi="gida",
    icerik="Su (5L, 10L, 19L), Kuru Gıda Paketi",
    toplama_gonullusu=toplama_gonullusu,
    tasima_gonullusu=tasima_gonullusu
)

# Kargo durumu güncelleme
kargo.durum = 'yolda'
kargo.save()

# Kargo sorgulama
kargolar = Kargo.objects.filter(durum='yolda')
istanbul_kargolari = Kargo.objects.filter(cikis_yeri='istanbul')

# Gönüllü bazlı sorgulama
mehmet_toplama_kargolari = Kargo.objects.filter(toplama_gonullusu__ad='Mehmet')
aktif_gonullu_kargolari = Kargo.objects.filter(
    toplama_gonullusu__is_active=True
).select_related('toplama_gonullusu', 'tasima_gonullusu', 'dagitim_gonullusu')
"""
```

## Özellikler

### ✅ Kargo Numarası
- **Otomatik Oluşturma**: AYK + 9 haneli sayı (AYK123456789)
- **Benzersizlik**: Unique constraint ile tekrar kontrolü

### ✅ Gönderici Bilgileri
- **Anonim Seçenek**: Gönderici bilgileri opsiyonel
- **Telefon Validasyonu**: 5XXXXXXXXX formatı zorunlu
- **E-posta Validasyonu**: Django EmailField ile otomatik

### ✅ Konum Yönetimi
- **81 Türk Şehri**: Tam liste ile dropdown seçim
- **Çıkış/Varış**: Ayrı şehir seçimleri

### ✅ Kargo Detayları
- **Ağırlık/Hacim**: Decimal field ile hassas ölçüm
- **Miktar**: Pozitif integer ile adet kontrolü

### ✅ İçerik Kategorileri
- **5 Ana Kategori**: Gıda, İlaç, Giyim, Karışık, Diğer
- **Detaylı Seçenekler**: Her kategori için özel liste
- **Esnek Yapı**: TextField ile çoklu seçim desteği

### ✅ Gönüllü Yönetimi
- **Foreign Key İlişkisi**: Volunteer modeli ile bağlantılı
- **3 Görev Türü**: Toplama, Taşıma, Dağıtım gönüllüleri
- **Akıllı Filtreleme**: Sadece uygun tip ve aktif gönüllüler seçilebilir
- **Karma Gönüllü Desteği**: Karma tipi gönüllüler tüm görevlerde kullanılabilir
- **Güvenli Silme**: Gönüllü silinirse kargo kaydı korunur (SET_NULL)
- **Related Names**: Her gönüllünün hangi kargolarda görev aldığı takip edilebilir

### ✅ Durum Takibi
- **4 Durum**: Hazırlanıyor, Yolda, Teslim Edildi, İptal Edildi
- **Otomatik Tarihler**: Oluşturma ve güncelleme tarihleri
- **Durum Geçmişi**: Son değişiklik takibi

### ✅ Admin Panel
- **Gelişmiş Filtreleme**: Durum, tip, şehir bazlı
- **Arama**: Kargo no, gönderici, gönüllü adlarında
- **Gruplu Alanlar**: Collapse ile düzenli görünüm
- **Salt Okunur**: Otomatik alanlar korumalı

## 🔗 Gönüllü İlişkisi Avantajları

### ✅ **Veri Tutarlılığı**
- Gönüllü bilgileri tek yerden yönetilir
- Gönüllü bilgisi değiştiğinde tüm kargolarda otomatik güncellenir
- Veri tekrarı önlenir

### ✅ **Akıllı Seçim**
- **limit_choices_to** ile sadece uygun gönüllüler gösterilir:
  - Toplama: sadece 'toplama' ve 'karma' tipli gönüllüler
  - Taşıma: sadece 'tasima' ve 'karma' tipli gönüllüler  
  - Dağıtım: sadece 'dagitim' ve 'karma' tipli gönüllüler
- Sadece aktif gönüllüler seçilebilir

### ✅ **İlişkisel Sorgulama**
```python
# Gönüllünün tüm kargolarını görme
gonullu = Volunteer.objects.get(gonulluluk_no='G1234567890')
toplama_kargolari = gonullu.toplama_kargolari.all()
tasima_kargolari = gonullu.tasima_kargolari.all()

# Kargo ile gönüllü bilgilerine erişim
kargo = Kargo.objects.select_related('toplama_gonullusu').get(kargo_no='AYK123456789')
print(f"Toplama Gönüllüsü: {kargo.toplama_gonullusu.full_name}")
print(f"Telefon: {kargo.toplama_gonullusu.telefon}")
```

### ✅ **Güvenli Veri Yönetimi**
- **on_delete=models.SET_NULL**: Gönüllü silinirse kargo kaydı korunur
- **blank=True, null=True**: Gönüllü ataması opsiyonel
- **related_name**: Her gönüllünün kargo geçmişi takip edilebilir

Bu yapı Django için optimize edilmiş, ilişkisel ve tutarlı bir kargo yönetim sistemi sağlar.

## Django Signals (signals.py)

```python
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import Kargo

@receiver(pre_save, sender=Kargo)
def clear_sender_info_if_anonymous(sender, instance, **kwargs):
    """Anonim gönderici seçildiğinde gönderici bilgilerini temizle"""
    if instance.anonim_gonderici:
        instance.gonderici_ad = None
        instance.gonderici_soyad = None
        instance.gonderici_telefon = None
        instance.gonderici_email = None

@receiver(post_save, sender=Kargo)
def log_status_change(sender, instance, created, **kwargs):
    """Durum değişikliklerini logla"""
    if not created:
        # Durum değişikliği için log tutma
        old_instance = Kargo.objects.get(pk=instance.pk)
        if old_instance.durum != instance.durum:
            # Burada log sistemi entegrasyonu yapılabilir
            print(f"Kargo {instance.kargo_no} durumu {old_instance.durum} -> {instance.durum} olarak değişti")
```

## Django Migration Örneği

```python
# Generated by Django 5.1.1 on 2024-01-01 12:00

from django.db import migrations, models
import django.core.validators
import django.db.models.deletion

class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('volunteers', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Kargo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('kargo_no', models.CharField(help_text='AYK123456789 formatında otomatik oluşturulur', max_length=12, unique=True, verbose_name='Kargo Numarası')),
                ('anonim_gonderici', models.BooleanField(default=False, verbose_name='Anonim Gönderici')),
                ('gonderici_ad', models.CharField(blank=True, max_length=50, null=True, verbose_name='Gönderici Adı')),
                ('gonderici_soyad', models.CharField(blank=True, max_length=50, null=True, verbose_name='Gönderici Soyadı')),
                ('gonderici_telefon', models.CharField(blank=True, max_length=10, null=True, validators=[django.core.validators.RegexValidator('^5\\d{9}$', 'Telefon 5XXXXXXXXX formatında olmalıdır')], verbose_name='Gönderici Telefon')),
                ('gonderici_email', models.EmailField(blank=True, max_length=254, null=True, verbose_name='Gönderici E-posta')),
                ('cikis_yeri', models.CharField(choices=[('adana', 'Adana'), ('adiyaman', 'Adıyaman'), ('afyonkarahisar', 'Afyonkarahisar'), ('agri', 'Ağrı'), ('aksaray', 'Aksaray'), ('amasya', 'Amasya'), ('ankara', 'Ankara'), ('antalya', 'Antalya'), ('ardahan', 'Ardahan'), ('artvin', 'Artvin'), ('aydin', 'Aydın'), ('balikesir', 'Balıkesir'), ('bartin', 'Bartın'), ('batman', 'Batman'), ('bayburt', 'Bayburt'), ('bilecik', 'Bilecik'), ('bingol', 'Bingöl'), ('bitlis', 'Bitlis'), ('bolu', 'Bolu'), ('burdur', 'Burdur'), ('bursa', 'Bursa'), ('canakkale', 'Çanakkale'), ('cankiri', 'Çankırı'), ('corum', 'Çorum'), ('denizli', 'Denizli'), ('diyarbakir', 'Diyarbakır'), ('duzce', 'Düzce'), ('edirne', 'Edirne'), ('elazig', 'Elazığ'), ('erzincan', 'Erzincan'), ('erzurum', 'Erzurum'), ('eskisehir', 'Eskişehir'), ('gaziantep', 'Gaziantep'), ('giresun', 'Giresun'), ('gumushane', 'Gümüşhane'), ('hakkari', 'Hakkâri'), ('hatay', 'Hatay'), ('igdir', 'Iğdır'), ('isparta', 'Isparta'), ('istanbul', 'İstanbul'), ('izmir', 'İzmir'), ('kahramanmaras', 'Kahramanmaraş'), ('karabuk', 'Karabük'), ('karaman', 'Karaman'), ('kars', 'Kars'), ('kastamonu', 'Kastamonu'), ('kayseri', 'Kayseri'), ('kilis', 'Kilis'), ('kirikkale', 'Kırıkkale'), ('kirklareli', 'Kırklareli'), ('kirsehir', 'Kırşehir'), ('kocaeli', 'Kocaeli'), ('konya', 'Konya'), ('kutahya', 'Kütahya'), ('malatya', 'Malatya'), ('manisa', 'Manisa'), ('mardin', 'Mardin'), ('mersin', 'Mersin'), ('mugla', 'Muğla'), ('mus', 'Muş'), ('nevsehir', 'Nevşehir'), ('nigde', 'Niğde'), ('ordu', 'Ordu'), ('osmaniye', 'Osmaniye'), ('rize', 'Rize'), ('sakarya', 'Sakarya'), ('samsun', 'Samsun'), ('sanliurfa', 'Şanlıurfa'), ('siirt', 'Siirt'), ('sinop', 'Sinop'), ('sirnak', 'Şırnak'), ('sivas', 'Sivas'), ('tekirdag', 'Tekirdağ'), ('tokat', 'Tokat'), ('trabzon', 'Trabzon'), ('tunceli', 'Tunceli'), ('usak', 'Uşak'), ('van', 'Van'), ('yalova', 'Yalova'), ('yozgat', 'Yozgat'), ('zonguldak', 'Zonguldak')], max_length=20, verbose_name='Çıkış Yeri')),
                ('ulasacagi_yer', models.CharField(choices=[('adana', 'Adana'), ('adiyaman', 'Adıyaman'), ('afyonkarahisar', 'Afyonkarahisar'), ('agri', 'Ağrı'), ('aksaray', 'Aksaray'), ('amasya', 'Amasya'), ('ankara', 'Ankara'), ('antalya', 'Antalya'), ('ardahan', 'Ardahan'), ('artvin', 'Artvin'), ('aydin', 'Aydın'), ('balikesir', 'Balıkesir'), ('bartin', 'Bartın'), ('batman', 'Batman'), ('bayburt', 'Bayburt'), ('bilecik', 'Bilecik'), ('bingol', 'Bingöl'), ('bitlis', 'Bitlis'), ('bolu', 'Bolu'), ('burdur', 'Burdur'), ('bursa', 'Bursa'), ('canakkale', 'Çanakkale'), ('cankiri', 'Çankırı'), ('corum', 'Çorum'), ('denizli', 'Denizli'), ('diyarbakir', 'Diyarbakır'), ('duzce', 'Düzce'), ('edirne', 'Edirne'), ('elazig', 'Elazığ'), ('erzincan', 'Erzincan'), ('erzurum', 'Erzurum'), ('eskisehir', 'Eskişehir'), ('gaziantep', 'Gaziantep'), ('giresun', 'Giresun'), ('gumushane', 'Gümüşhane'), ('hakkari', 'Hakkâri'), ('hatay', 'Hatay'), ('igdir', 'Iğdır'), ('isparta', 'Isparta'), ('istanbul', 'İstanbul'), ('izmir', 'İzmir'), ('kahramanmaras', 'Kahramanmaraş'), ('karabuk', 'Karabük'), ('karaman', 'Karaman'), ('kars', 'Kars'), ('kastamonu', 'Kastamonu'), ('kayseri', 'Kayseri'), ('kilis', 'Kilis'), ('kirikkale', 'Kırıkkale'), ('kirklareli', 'Kırklareli'), ('kirsehir', 'Kırşehir'), ('kocaeli', 'Kocaeli'), ('konya', 'Konya'), ('kutahya', 'Kütahya'), ('malatya', 'Malatya'), ('manisa', 'Manisa'), ('mardin', 'Mardin'), ('mersin', 'Mersin'), ('mugla', 'Muğla'), ('mus', 'Muş'), ('nevsehir', 'Nevşehir'), ('nigde', 'Niğde'), ('ordu', 'Ordu'), ('osmaniye', 'Osmaniye'), ('rize', 'Rize'), ('sakarya', 'Sakarya'), ('samsun', 'Samsun'), ('sanliurfa', 'Şanlıurfa'), ('siirt', 'Siirt'), ('sinop', 'Sinop'), ('sirnak', 'Şırnak'), ('sivas', 'Sivas'), ('tekirdag', 'Tekirdağ'), ('tokat', 'Tokat'), ('trabzon', 'Trabzon'), ('tunceli', 'Tunceli'), ('usak', 'Uşak'), ('van', 'Van'), ('yalova', 'Yalova'), ('yozgat', 'Yozgat'), ('zonguldak', 'Zonguldak')], max_length=20, verbose_name='Ulaşacağı Yer')),
                ('agirlik', models.DecimalField(decimal_places=2, help_text='Minimum 0.01 kg', max_digits=8, validators=[django.core.validators.MinValueValidator(0.01)], verbose_name='Ağırlık (kg)')),
                ('hacim', models.DecimalField(decimal_places=2, help_text='Minimum 0.01 m³', max_digits=8, validators=[django.core.validators.MinValueValidator(0.01)], verbose_name='Hacim (m³)')),
                ('miktar', models.PositiveIntegerField(help_text='Minimum 1 adet', validators=[django.core.validators.MinValueValidator(1)], verbose_name='Miktar (Adet)')),
                ('durum', models.CharField(choices=[('hazirlaniyor', 'Hazırlanıyor'), ('yolda', 'Yolda'), ('teslim_edildi', 'Teslim Edildi'), ('iptal_edildi', 'İptal Edildi')], default='hazirlaniyor', max_length=15, verbose_name='Durum')),
                ('kargo_tipi', models.CharField(choices=[('gida', 'Gıda'), ('ilac', 'İlaç'), ('giyim', 'Giyim'), ('karisik', 'Karışık'), ('diger', 'Diğer')], max_length=10, verbose_name='Kargo Tipi')),
                ('icerik', models.TextField(help_text='Kargo tipine göre seçilecek içerik listesi', verbose_name='İçerik')),
                ('ozel_not', models.TextField(blank=True, null=True, verbose_name='Özel Not')),
                ('olusturulma_tarihi', models.DateTimeField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')),
                ('son_degisiklik', models.DateTimeField(auto_now=True, verbose_name='Son Değişiklik')),
                ('dagitim_gonullusu', models.ForeignKey(blank=True, limit_choices_to={'gonullu_tipi__in': ['dagitim', 'karma'], 'is_active': True}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='dagitim_kargolari', to='volunteers.volunteer', verbose_name='Dağıtım Gönüllüsü')),
                ('tasima_gonullusu', models.ForeignKey(blank=True, limit_choices_to={'gonullu_tipi__in': ['tasima', 'karma'], 'is_active': True}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='tasima_kargolari', to='volunteers.volunteer', verbose_name='Taşıma Gönüllüsü')),
                ('toplama_gonullusu', models.ForeignKey(blank=True, limit_choices_to={'gonullu_tipi__in': ['toplama', 'karma'], 'is_active': True}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='toplama_kargolari', to='volunteers.volunteer', verbose_name='Toplama Gönüllüsü')),
            ],
            options={
                'verbose_name': 'Kargo',
                'verbose_name_plural': 'Kargolar',
                'db_table': 'kargo',
                'ordering': ['-olusturulma_tarihi'],
            },
        ),
    ]
```

## Apps.py Konfigürasyonu

```python
# apps/cargo/apps.py
from django.apps import AppConfig

class CargoConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.cargo'
    verbose_name = 'Kargo Yönetimi'
    
    def ready(self):
        import apps.cargo.signals  # Signals'ları import et
```

## Settings.py Eklentileri

```python
# Django settings.py içine eklenecek
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    
    # Local apps
    'apps.core',
    'apps.volunteers',
    'apps.cargo',  # Kargo app'i
]

# REST Framework ayarları
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}
```

## Gerekli Paketler (requirements.txt)

```txt
Django==5.1.1
djangorestframework==3.16.1
django-cors-headers==4.4.0
django-filter==24.3
psycopg2-binary==2.9.9
redis==5.1.1
celery==5.4.0
python-decouple==3.8
dj-database-url==2.2.0
```
