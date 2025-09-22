from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.db import transaction


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
        help_text='Otomatik üretilen gönüllülük numarası (G000000000)'
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
            # Sequential gönüllülük numarası üretimi (G000000000 formatında)
            with transaction.atomic():
                # Son gönüllü numarasını bul
                last_volunteer = Volunteer.objects.filter(
                    gonulluluk_no__startswith='G'
                ).order_by('gonulluluk_no').last()
                
                if last_volunteer and last_volunteer.gonulluluk_no:
                    # Son numaradan sonraki numarayı al
                    last_number = int(last_volunteer.gonulluluk_no[1:])  # G'yi çıkar
                    next_number = last_number + 1
                else:
                    # İlk gönüllü
                    next_number = 0
                
                # G000000000 formatında oluştur (9 haneli, sıfırlarla doldur)
                self.gonulluluk_no = f"G{next_number:09d}"
        super().save(*args, **kwargs)
    
    @property
    def full_name(self):
        return f"{self.ad} {self.soyad}"
    
    @property
    def gonullu_tipi_display_with_icon(self):
        return self.get_gonullu_tipi_display()
