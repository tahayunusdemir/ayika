from django.contrib import admin
from .models import Kargo


@admin.register(Kargo)
class KargoAdmin(admin.ModelAdmin):
    list_display = [
        'kargo_no', 'durum', 'kargo_tipi', 'cikis_yeri', 
        'ulasacagi_yer', 'agirlik', 'get_sender_info', 'get_volunteer_count', 'olusturulma_tarihi'
    ]
    list_filter = [
        'durum', 'kargo_tipi', 'cikis_yeri', 'ulasacagi_yer', 
        'anonim_gonderici', 'olusturulma_tarihi'
    ]
    search_fields = [
        'kargo_no', 'gonderici_ad', 'gonderici_soyad', 'gonderici_telefon', 'gonderici_email',
        'toplama_gonullusu__ad', 'toplama_gonullusu__soyad', 'toplama_gonullusu__gonulluluk_no',
        'tasima_gonullusu__ad', 'tasima_gonullusu__soyad', 'tasima_gonullusu__gonulluluk_no',
        'dagitim_gonullusu__ad', 'dagitim_gonullusu__soyad', 'dagitim_gonullusu__gonulluluk_no',
        'icerik', 'ozel_not'
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
    
    # Admin panel için özel metodlar
    def get_sender_info(self, obj):
        """Gönderici bilgisi gösterimi"""
        if obj.anonim_gonderici:
            return "Anonim"
        elif obj.gonderici_ad and obj.gonderici_soyad:
            return f"{obj.gonderici_ad} {obj.gonderici_soyad}"
        else:
            return "Bilgi Eksik"
    get_sender_info.short_description = "Gönderici"
    
    def get_volunteer_count(self, obj):
        """Atanmış gönüllü sayısı"""
        count = 0
        if obj.toplama_gonullusu:
            count += 1
        if obj.tasima_gonullusu:
            count += 1
        if obj.dagitim_gonullusu:
            count += 1
        
        if count == 0:
            return "Atanmamış"
        elif count == 3:
            return f"Tam ({count}/3)"
        else:
            return f"Kısmi ({count}/3)"
    get_volunteer_count.short_description = "Gönüllü Durumu"
    
    # Durum bazlı renklendirme
    def get_queryset(self, request):
        """Optimized queryset with select_related"""
        return super().get_queryset(request).select_related(
            'toplama_gonullusu', 'tasima_gonullusu', 'dagitim_gonullusu'
        )
    
    # Toplu işlemler
    actions = ['mark_as_yolda', 'mark_as_teslim_edildi', 'assign_volunteers']
    
    def mark_as_yolda(self, request, queryset):
        """Seçili kargoları 'Yolda' olarak işaretle"""
        updated = queryset.update(durum='yolda')
        self.message_user(request, f'{updated} kargo "Yolda" olarak işaretlendi.')
    mark_as_yolda.short_description = "Seçili kargoları 'Yolda' olarak işaretle"
    
    def mark_as_teslim_edildi(self, request, queryset):
        """Seçili kargoları 'Teslim Edildi' olarak işaretle"""
        updated = queryset.update(durum='teslim_edildi')
        self.message_user(request, f'{updated} kargo "Teslim Edildi" olarak işaretlendi.')
    mark_as_teslim_edildi.short_description = "Seçili kargoları 'Teslim Edildi' olarak işaretle"
