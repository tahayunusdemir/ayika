from rest_framework import serializers
from .models import Kargo


class KargoSerializer(serializers.ModelSerializer):
    durum_display = serializers.CharField(source='get_durum_display', read_only=True)
    kargo_tipi_display = serializers.CharField(source='get_kargo_tipi_display', read_only=True)
    cikis_yeri_display = serializers.CharField(source='get_cikis_yeri_display', read_only=True)
    ulasacagi_yer_display = serializers.CharField(source='get_ulasacagi_yer_display', read_only=True)
    
    # Gönüllü bilgilerini nested olarak göster
    toplama_gonullusu_detail = serializers.SerializerMethodField()
    tasima_gonullusu_detail = serializers.SerializerMethodField()
    dagitim_gonullusu_detail = serializers.SerializerMethodField()
    
    class Meta:
        model = Kargo
        fields = '__all__'
        read_only_fields = ['kargo_no', 'olusturulma_tarihi', 'son_degisiklik']
    
    def get_toplama_gonullusu_detail(self, obj):
        if obj.toplama_gonullusu:
            return {
                'id': obj.toplama_gonullusu.id,
                'gonulluluk_no': obj.toplama_gonullusu.gonulluluk_no,
                'full_name': obj.toplama_gonullusu.full_name,
                'telefon': obj.toplama_gonullusu.telefon,
                'sehir': obj.toplama_gonullusu.get_sehir_display()
            }
        return None
    
    def get_tasima_gonullusu_detail(self, obj):
        if obj.tasima_gonullusu:
            return {
                'id': obj.tasima_gonullusu.id,
                'gonulluluk_no': obj.tasima_gonullusu.gonulluluk_no,
                'full_name': obj.tasima_gonullusu.full_name,
                'telefon': obj.tasima_gonullusu.telefon,
                'sehir': obj.tasima_gonullusu.get_sehir_display()
            }
        return None
    
    def get_dagitim_gonullusu_detail(self, obj):
        if obj.dagitim_gonullusu:
            return {
                'id': obj.dagitim_gonullusu.id,
                'gonulluluk_no': obj.dagitim_gonullusu.gonulluluk_no,
                'full_name': obj.dagitim_gonullusu.full_name,
                'telefon': obj.dagitim_gonullusu.telefon,
                'sehir': obj.dagitim_gonullusu.get_sehir_display()
            }
        return None


class KargoCreateSerializer(serializers.ModelSerializer):
    """Kargo oluşturma için özel serializer"""
    
    class Meta:
        model = Kargo
        exclude = ['kargo_no', 'olusturulma_tarihi', 'son_degisiklik']
    
    def validate(self, data):
        """Custom validation"""
        # Anonim gönderici kontrolü
        if not data.get('anonim_gonderici', False):
            required_fields = ['gonderici_ad', 'gonderici_soyad', 'gonderici_telefon']
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError({
                        field: f'Anonim olmayan gönderici için {field} zorunludur.'
                    })
        
        # Aynı şehir kontrolü
        if data.get('cikis_yeri') == data.get('ulasacagi_yer'):
            raise serializers.ValidationError({
                'ulasacagi_yer': 'Çıkış yeri ve ulaşacağı yer aynı olamaz.'
            })
        
        # İçerik validasyonunu esnetle - sadece boş olmamasını kontrol et
        if data.get('icerik'):
            icerik = data.get('icerik', '').strip()
            if not icerik:
                raise serializers.ValidationError({
                    'icerik': 'İçerik boş olamaz.'
                })
            # Çok uzun içerik kontrolü
            if len(icerik) > 500:
                raise serializers.ValidationError({
                    'icerik': 'İçerik açıklaması 500 karakterden uzun olamaz.'
                })
        
        # Gönüllü atama doğrulaması
        self._validate_volunteer_assignments(data)
        
        return data
    
    def _validate_volunteer_assignments(self, data):
        """Gönüllü atamalarını doğrula"""
        # Toplama gönüllüsü zorunlu
        if not data.get('toplama_gonullusu'):
            raise serializers.ValidationError({
                'toplama_gonullusu': 'Toplama gönüllüsü seçilmelidir.'
            })
        
        # Toplama gönüllüsü kontrolü
        if data.get('toplama_gonullusu'):
            volunteer = data['toplama_gonullusu']
            if volunteer.gonullu_tipi not in ['toplama', 'karma']:
                raise serializers.ValidationError({
                    'toplama_gonullusu': 'Toplama gönüllüsü sadece "toplama" veya "karma" tipli olabilir.'
                })
            if not volunteer.is_active:
                raise serializers.ValidationError({
                    'toplama_gonullusu': 'Seçilen toplama gönüllüsü aktif değil.'
                })
        
        # Taşıma gönüllüsü kontrolü
        if data.get('tasima_gonullusu'):
            volunteer = data['tasima_gonullusu']
            if volunteer.gonullu_tipi not in ['tasima', 'karma']:
                raise serializers.ValidationError({
                    'tasima_gonullusu': 'Taşıma gönüllüsü sadece "tasima" veya "karma" tipli olabilir.'
                })
            if not volunteer.is_active:
                raise serializers.ValidationError({
                    'tasima_gonullusu': 'Seçilen taşıma gönüllüsü aktif değil.'
                })
        
        # Dağıtım gönüllüsü kontrolü
        if data.get('dagitim_gonullusu'):
            volunteer = data['dagitim_gonullusu']
            if volunteer.gonullu_tipi not in ['dagitim', 'karma']:
                raise serializers.ValidationError({
                    'dagitim_gonullusu': 'Dağıtım gönüllüsü sadece "dagitim" veya "karma" tipli olabilir.'
                })
            if not volunteer.is_active:
                raise serializers.ValidationError({
                    'dagitim_gonullusu': 'Seçilen dağıtım gönüllüsü aktif değil.'
                })


class KargoTrackingSerializer(serializers.ModelSerializer):
    """Kargo takibi için genişletilmiş serializer - tüm gerekli bilgiler"""
    durum_display = serializers.CharField(source='get_durum_display', read_only=True)
    kargo_tipi_display = serializers.CharField(source='get_kargo_tipi_display', read_only=True)
    cikis_yeri_display = serializers.CharField(source='get_cikis_yeri_display', read_only=True)
    ulasacagi_yer_display = serializers.CharField(source='get_ulasacagi_yer_display', read_only=True)
    
    class Meta:
        model = Kargo
        fields = [
            'kargo_no', 'durum', 'durum_display',
            'anonim_gonderici', 'gonderici_ad', 'gonderici_soyad',
            'cikis_yeri', 'cikis_yeri_display', 
            'ulasacagi_yer', 'ulasacagi_yer_display',
            'icerik', 'kargo_tipi', 'kargo_tipi_display',
            'olusturulma_tarihi', 'son_degisiklik'
        ]
