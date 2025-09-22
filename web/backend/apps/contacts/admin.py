from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.urls import reverse
from django.http import HttpResponse
import csv
from .models import Contact


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    """
    İletişim Mesajları Admin Paneli
    Gelişmiş filtreleme, arama ve toplu işlemler ile
    """
    
    # Liste görünümü
    list_display = [
        'id',
        'colored_status',
        'colored_priority', 
        'tam_ad',
        'kategori_with_icon',
        'konu_short',
        'sehir',
        'telefon',
        'email',
        'olusturulma_tarihi',
        'dosya_info',
        'kvkk_onayi'
    ]
    
    # Filtreleme seçenekleri
    list_filter = [
        'durum',
        'oncelik', 
        'kategori',
        'kvkk_onayi',
        'olusturulma_tarihi',
        'cevap_tarihi',
        'sehir'
    ]
    
    # Arama alanları
    search_fields = [
        'ad',
        'soyad', 
        'email',
        'telefon',
        'konu',
        'mesaj',
        'sehir'
    ]
    
    # Sıralama
    ordering = ['-olusturulma_tarihi']
    
    # Sayfa başına kayıt sayısı
    list_per_page = 25
    
    # Hızlı düzenleme alanları (bu alanlar list_display'de de olmalı)
    # list_editable = ['durum', 'oncelik']  # Şimdilik kapatıyoruz
    
    # Detay görünümü alanları
    fieldsets = (
        ('📋 Kişisel Bilgiler', {
            'fields': ('ad', 'soyad', 'telefon', 'email', 'sehir'),
            'classes': ('wide',)
        }),
        ('📝 İletişim İçeriği', {
            'fields': ('kategori', 'konu', 'mesaj', 'dosya'),
            'classes': ('wide',)
        }),
        ('⚙️ Yönetim', {
            'fields': ('durum', 'oncelik', 'admin_notu', 'cevaplayan_admin', 'cevap_tarihi'),
            'classes': ('wide',)
        }),
        ('✅ Onaylar ve Güvenlik', {
            'fields': ('kvkk_onayi', 'ip_adresi', 'user_agent'),
            'classes': ('collapse',)
        }),
        ('🕐 Tarihler', {
            'fields': ('olusturulma_tarihi', 'son_degisiklik'),
            'classes': ('collapse',)
        })
    )
    
    # Salt okunur alanlar
    readonly_fields = [
        'olusturulma_tarihi', 
        'son_degisiklik',
        'ip_adresi',
        'user_agent'
    ]
    
    # Toplu işlemler
    actions = [
        'mark_as_read',
        'mark_as_answered', 
        'mark_as_closed',
        'export_to_csv',
        'set_high_priority',
        'set_normal_priority'
    ]
    
    def colored_status(self, obj):
        """Renkli durum gösterimi"""
        color = obj.durum_color
        return format_html(
            '<span style="color: {}; font-weight: bold;">● {}</span>',
            color,
            obj.get_durum_display()
        )
    colored_status.short_description = 'Durum'
    colored_status.admin_order_field = 'durum'
    
    def colored_priority(self, obj):
        """Renkli öncelik gösterimi"""
        color = obj.oncelik_color
        return format_html(
            '<span style="color: {}; font-weight: bold;">⚡ {}</span>',
            color,
            obj.get_oncelik_display()
        )
    colored_priority.short_description = 'Öncelik'
    colored_priority.admin_order_field = 'oncelik'
    
    def kategori_with_icon(self, obj):
        """İkonlu kategori gösterimi"""
        return format_html(
            '{} {}',
            obj.kategori_icon,
            obj.get_kategori_display()
        )
    kategori_with_icon.short_description = 'Kategori'
    kategori_with_icon.admin_order_field = 'kategori'
    
    def konu_short(self, obj):
        """Kısaltılmış konu"""
        if len(obj.konu) > 50:
            return obj.konu[:50] + '...'
        return obj.konu
    konu_short.short_description = 'Konu'
    konu_short.admin_order_field = 'konu'
    
    def dosya_info(self, obj):
        """Dosya bilgisi"""
        if obj.dosya:
            return format_html(
                '<a href="{}" target="_blank">📎 {} ({} MB)</a>',
                obj.dosya.url,
                obj.dosya.name.split('/')[-1],
                obj.get_dosya_boyutu()
            )
        return '❌ Dosya yok'
    dosya_info.short_description = 'Dosya'
    
    # Toplu işlem metodları
    def mark_as_read(self, request, queryset):
        """Okundu olarak işaretle"""
        updated = queryset.update(durum='okundu')
        self.message_user(request, f'{updated} mesaj okundu olarak işaretlendi.')
    mark_as_read.short_description = "Seçili mesajları okundu olarak işaretle"
    
    def mark_as_answered(self, request, queryset):
        """Cevaplandı olarak işaretle"""
        updated = queryset.update(
            durum='cevaplandi',
            cevaplayan_admin=request.user.username
        )
        self.message_user(request, f'{updated} mesaj cevaplandı olarak işaretlendi.')
    mark_as_answered.short_description = "Seçili mesajları cevaplandı olarak işaretle"
    
    def mark_as_closed(self, request, queryset):
        """Kapatıldı olarak işaretle"""
        updated = queryset.update(durum='kapandi')
        self.message_user(request, f'{updated} mesaj kapatıldı.')
    mark_as_closed.short_description = "Seçili mesajları kapat"
    
    def set_high_priority(self, request, queryset):
        """Yüksek öncelik olarak işaretle"""
        updated = queryset.update(oncelik='yuksek')
        self.message_user(request, f'{updated} mesaj yüksek öncelikli olarak işaretlendi.')
    set_high_priority.short_description = "Yüksek öncelik olarak işaretle"
    
    def set_normal_priority(self, request, queryset):
        """Normal öncelik olarak işaretle"""
        updated = queryset.update(oncelik='normal')
        self.message_user(request, f'{updated} mesaj normal öncelikli olarak işaretlendi.')
    set_normal_priority.short_description = "Normal öncelik olarak işaretle"
    
    def export_to_csv(self, request, queryset):
        """CSV olarak dışa aktar"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="iletisim_mesajlari.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Ad', 'Soyad', 'Telefon', 'Email', 'Şehir',
            'Kategori', 'Konu', 'Mesaj', 'Durum', 'Öncelik',
            'KVKK Onayı', 'Oluşturulma Tarihi'
        ])
        
        for contact in queryset:
            writer.writerow([
                contact.id,
                contact.ad,
                contact.soyad, 
                contact.telefon,
                contact.email,
                contact.sehir,
                contact.get_kategori_display(),
                contact.konu,
                contact.mesaj,
                contact.get_durum_display(),
                contact.get_oncelik_display(),
                'Evet' if contact.kvkk_onayi else 'Hayır',
                contact.olusturulma_tarihi.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response
    export_to_csv.short_description = "Seçili mesajları CSV olarak dışa aktar"
    
    def get_queryset(self, request):
        """Sorgu optimizasyonu"""
        return super().get_queryset(request).select_related()
    
    def save_model(self, request, obj, form, change):
        """Model kaydetme işlemi"""
        if change and obj.durum == 'cevaplandi' and not obj.cevaplayan_admin:
            obj.cevaplayan_admin = request.user.username
        super().save_model(request, obj, form, change)
