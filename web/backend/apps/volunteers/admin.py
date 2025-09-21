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
        'soyad',
        'user__email'
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
