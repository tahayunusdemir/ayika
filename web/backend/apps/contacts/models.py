from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone
import os


class Contact(models.Model):
    """
    İletişim Formu Modeli
    Frontend Contact.tsx dosyasındaki form alanlarına karşılık gelir.
    """
    
    # Kategori seçenekleri (Contact.tsx'teki CONTACT_CATEGORIES ile aynı)
    CATEGORY_CHOICES = [
        ('genel', 'Genel Bilgi'),
        ('gonulluluk', 'Gönüllülük'),
        ('yardim', 'Yardım Talebi'),
        ('bagis', 'Bağış'),
        ('teknik', 'Teknik Destek'),
        ('medya', 'Medya ve Basın'),
        ('isbirligi', 'İş Birliği'),
        ('sikayet', 'Şikayet ve Öneri'),
    ]
    
    # Durum seçenekleri
    STATUS_CHOICES = [
        ('yeni', 'Yeni'),
        ('okundu', 'Okundu'),
        ('cevaplanıyor', 'Cevaplanıyor'),
        ('cevaplandi', 'Cevaplandı'),
        ('kapandi', 'Kapatıldı'),
    ]
    
    # Öncelik seçenekleri
    PRIORITY_CHOICES = [
        ('dusuk', 'Düşük'),
        ('normal', 'Normal'),
        ('yuksek', 'Yüksek'),
        ('acil', 'Acil'),
    ]
    
    # Telefon numarası validator (5XXXXXXXXX formatı)
    phone_validator = RegexValidator(
        regex=r'^5\d{9}$',
        message='Telefon numarası 5XXXXXXXXX formatında olmalıdır.'
    )
    
    # Kişisel Bilgiler
    ad = models.CharField(
        max_length=50,
        verbose_name='Ad',
        help_text='Gönderen kişinin adı'
    )
    
    soyad = models.CharField(
        max_length=50,
        verbose_name='Soyad',
        help_text='Gönderen kişinin soyadı'
    )
    
    telefon = models.CharField(
        max_length=10,
        validators=[phone_validator],
        verbose_name='Telefon Numarası',
        help_text='5XXXXXXXXX formatında'
    )
    
    email = models.EmailField(
        verbose_name='E-posta Adresi',
        help_text='Geçerli bir e-posta adresi'
    )
    
    sehir = models.CharField(
        max_length=50,
        verbose_name='Şehir',
        help_text='Gönderen kişinin şehri'
    )
    
    # İletişim İçeriği
    kategori = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        verbose_name='Kategori',
        help_text='Mesajın kategorisi'
    )
    
    konu = models.CharField(
        max_length=200,
        verbose_name='Konu',
        help_text='Mesajın konusu'
    )
    
    mesaj = models.TextField(
        verbose_name='Mesaj',
        help_text='Detaylı mesaj içeriği'
    )
    
    # Dosya Yükleme
    dosya = models.FileField(
        upload_to='contact_files/%Y/%m/',
        blank=True,
        null=True,
        verbose_name='Ek Dosya',
        help_text='İsteğe bağlı dosya eki (Max 10MB)'
    )
    
    # KVKK ve Onaylar
    kvkk_onayi = models.BooleanField(
        default=False,
        verbose_name='KVKK Onayı',
        help_text='Kişisel verilerin korunması politikası onayı'
    )
    
    # Yönetim Alanları
    durum = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='yeni',
        verbose_name='Durum',
        help_text='Mesajın işlem durumu'
    )
    
    oncelik = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='normal',
        verbose_name='Öncelik',
        help_text='Mesajın öncelik seviyesi'
    )
    
    # Sistem Alanları
    olusturulma_tarihi = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Oluşturulma Tarihi'
    )
    
    son_degisiklik = models.DateTimeField(
        auto_now=True,
        verbose_name='Son Değişiklik'
    )
    
    # Admin İşlemleri
    admin_notu = models.TextField(
        blank=True,
        null=True,
        verbose_name='Admin Notu',
        help_text='Yönetici tarafından eklenen notlar'
    )
    
    cevaplayan_admin = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='Cevaplayan Admin',
        help_text='Mesajı cevaplayan yönetici'
    )
    
    cevap_tarihi = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Cevap Tarihi',
        help_text='Mesajın cevaplanma tarihi'
    )
    
    # IP ve Güvenlik
    ip_adresi = models.GenericIPAddressField(
        blank=True,
        null=True,
        verbose_name='IP Adresi',
        help_text='Gönderen IP adresi'
    )
    
    user_agent = models.TextField(
        blank=True,
        null=True,
        verbose_name='User Agent',
        help_text='Tarayıcı bilgisi'
    )
    
    class Meta:
        verbose_name = 'İletişim Mesajı'
        verbose_name_plural = 'İletişim Mesajları'
        ordering = ['-olusturulma_tarihi']
        db_table = 'contact_messages'
        
    def __str__(self):
        return f"{self.ad} {self.soyad} - {self.konu} ({self.get_durum_display()})"
    
    def save(self, *args, **kwargs):
        # Cevap tarihi otomatik set etme
        if self.durum == 'cevaplandi' and not self.cevap_tarihi:
            self.cevap_tarihi = timezone.now()
        super().save(*args, **kwargs)
    
    @property
    def tam_ad(self):
        """Tam ad döndürür"""
        return f"{self.ad} {self.soyad}"
    
    @property
    def kategori_icon(self):
        """Kategori için ikon döndürür"""
        icons = {
            'genel': '📋',
            'gonulluluk': '🤝',
            'yardim': '🆘',
            'bagis': '💝',
            'teknik': '🔧',
            'medya': '📺',
            'isbirligi': '🤝',
            'sikayet': '📝',
        }
        return icons.get(self.kategori, '📋')
    
    @property
    def durum_color(self):
        """Durum için renk döndürür"""
        colors = {
            'yeni': 'red',
            'okundu': 'orange',
            'cevaplanıyor': 'blue',
            'cevaplandi': 'green',
            'kapandi': 'gray',
        }
        return colors.get(self.durum, 'gray')
    
    @property
    def oncelik_color(self):
        """Öncelik için renk döndürür"""
        colors = {
            'dusuk': 'green',
            'normal': 'blue',
            'yuksek': 'orange',
            'acil': 'red',
        }
        return colors.get(self.oncelik, 'blue')
    
    def get_dosya_boyutu(self):
        """Dosya boyutunu MB cinsinden döndürür"""
        if self.dosya:
            return round(self.dosya.size / (1024 * 1024), 2)
        return 0
    
    def get_dosya_uzantisi(self):
        """Dosya uzantısını döndürür"""
        if self.dosya:
            return os.path.splitext(self.dosya.name)[1].lower()
        return None
