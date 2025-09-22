from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator, MinValueValidator
from django.core.exceptions import ValidationError
from django.db import transaction


class Kargo(models.Model):
    # Kargo Numarası - Otomatik oluşturulur
    kargo_no = models.CharField(
        max_length=12, 
        unique=True, 
        verbose_name="Kargo Numarası",
        help_text="AYK000000000 formatında otomatik oluşturulur"
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
    
    # Konum Bilgileri - Volunteers app ile uyumlu şehir listesi
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
        on_delete=models.PROTECT,
        related_name='toplama_kargolari',
        limit_choices_to={'gonullu_tipi__in': ['toplama', 'karma'], 'is_active': True},
        verbose_name="Toplama Gönüllüsü",
        help_text="Toplama gönüllüsü seçimi zorunludur"
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
        """AYK000000000 formatında sequential kargo numarası oluşturur"""
        with transaction.atomic():
            # Son kargo numarasını bul
            last_kargo = Kargo.objects.filter(
                kargo_no__startswith='AYK'
            ).order_by('kargo_no').last()
            
            if last_kargo and last_kargo.kargo_no:
                # Son numaradan sonraki numarayı al
                last_number = int(last_kargo.kargo_no[3:])  # AYK'yı çıkar
                next_number = last_number + 1
            else:
                # İlk kargo
                next_number = 0
            
            # AYK000000000 formatında oluştur (9 haneli, sıfırlarla doldur)
            return f"AYK{next_number:09d}"
    
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
        
        # İçerik kontrolü - sadece boş olmamasını kontrol et
        if self.icerik is not None:
            icerik = self.icerik.strip()
            if not icerik:
                raise ValidationError({
                    'icerik': 'İçerik boş olamaz.'
                })
            # Çok uzun içerik kontrolü
            if len(icerik) > 500:
                raise ValidationError({
                    'icerik': 'İçerik açıklaması 500 karakterden uzun olamaz.'
                })
    
    def __str__(self):
        return f"{self.kargo_no} - {self.get_durum_display()}"
    
    class Meta:
        verbose_name = "Kargo"
        verbose_name_plural = "Kargolar"
        ordering = ['-olusturulma_tarihi']
        db_table = 'kargo'
