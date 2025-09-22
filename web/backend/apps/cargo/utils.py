"""
Cargo app utility functions
"""
from django.db.models import Count, Q, Avg, Sum
from django.utils import timezone
from datetime import timedelta
from .models import Kargo


class KargoStats:
    """Kargo istatistikleri için utility sınıfı"""
    
    @staticmethod
    def get_general_stats():
        """Genel kargo istatistikleri"""
        total_cargo = Kargo.objects.count()
        
        stats = {
            'toplam_kargo': total_cargo,
            'anonim_gonderici': Kargo.objects.filter(anonim_gonderici=True).count(),
            'gonderici_bilgili': Kargo.objects.filter(anonim_gonderici=False).count(),
        }
        
        # Durum bazlı istatistikler
        for status_code, status_name in Kargo.DURUM_CHOICES:
            count = Kargo.objects.filter(durum=status_code).count()
            percentage = (count / total_cargo * 100) if total_cargo > 0 else 0
            stats[f'durum_{status_code}'] = {
                'count': count,
                'percentage': round(percentage, 2),
                'name': status_name
            }
        
        # Kargo tipi bazlı istatistikler
        for type_code, type_name in Kargo.KARGO_TIPI_CHOICES:
            count = Kargo.objects.filter(kargo_tipi=type_code).count()
            percentage = (count / total_cargo * 100) if total_cargo > 0 else 0
            stats[f'tip_{type_code}'] = {
                'count': count,
                'percentage': round(percentage, 2),
                'name': type_name
            }
        
        return stats
    
    @staticmethod
    def get_weight_volume_stats():
        """Ağırlık ve hacim istatistikleri"""
        from django.db.models import Avg, Sum, Min, Max
        
        stats = Kargo.objects.aggregate(
            toplam_agirlik=Sum('agirlik'),
            ortalama_agirlik=Avg('agirlik'),
            min_agirlik=Min('agirlik'),
            max_agirlik=Max('agirlik'),
            toplam_hacim=Sum('hacim'),
            ortalama_hacim=Avg('hacim'),
            min_hacim=Min('hacim'),
            max_hacim=Max('hacim'),
            toplam_miktar=Sum('miktar'),
            ortalama_miktar=Avg('miktar')
        )
        
        # None değerleri 0 ile değiştir
        for key, value in stats.items():
            if value is None:
                stats[key] = 0
            elif isinstance(value, float):
                stats[key] = round(value, 2)
        
        return stats
    
    @staticmethod
    def get_city_stats():
        """Şehir bazlı istatistikler"""
        # En çok çıkış yapılan şehirler
        top_origins = Kargo.objects.values('cikis_yeri').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        # En çok varış yapılan şehirler
        top_destinations = Kargo.objects.values('ulasacagi_yer').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        # Şehir display name'lerini ekle
        city_dict = dict(Kargo.SEHIR_CHOICES)
        
        for item in top_origins:
            item['display_name'] = city_dict.get(item['cikis_yeri'], item['cikis_yeri'])
        
        for item in top_destinations:
            item['display_name'] = city_dict.get(item['ulasacagi_yer'], item['ulasacagi_yer'])
        
        return {
            'top_origins': list(top_origins),
            'top_destinations': list(top_destinations)
        }
    
    @staticmethod
    def get_volunteer_stats():
        """Gönüllü bazlı istatistikler"""
        stats = {
            'toplama_atanmis': Kargo.objects.filter(toplama_gonullusu__isnull=False).count(),
            'tasima_atanmis': Kargo.objects.filter(tasima_gonullusu__isnull=False).count(),
            'dagitim_atanmis': Kargo.objects.filter(dagitim_gonullusu__isnull=False).count(),
            'hic_atanmamis': Kargo.objects.filter(
                toplama_gonullusu__isnull=True,
                tasima_gonullusu__isnull=True,
                dagitim_gonullusu__isnull=True
            ).count()
        }
        
        # En aktif gönüllüler
        from django.db.models import F
        
        # Toplama gönüllüleri
        top_toplama = Kargo.objects.filter(
            toplama_gonullusu__isnull=False
        ).values(
            'toplama_gonullusu__gonulluluk_no',
            'toplama_gonullusu__ad',
            'toplama_gonullusu__soyad'
        ).annotate(
            count=Count('id')
        ).order_by('-count')[:5]
        
        # Taşıma gönüllüleri
        top_tasima = Kargo.objects.filter(
            tasima_gonullusu__isnull=False
        ).values(
            'tasima_gonullusu__gonulluluk_no',
            'tasima_gonullusu__ad',
            'tasima_gonullusu__soyad'
        ).annotate(
            count=Count('id')
        ).order_by('-count')[:5]
        
        # Dağıtım gönüllüleri
        top_dagitim = Kargo.objects.filter(
            dagitim_gonullusu__isnull=False
        ).values(
            'dagitim_gonullusu__gonulluluk_no',
            'dagitim_gonullusu__ad',
            'dagitim_gonullusu__soyad'
        ).annotate(
            count=Count('id')
        ).order_by('-count')[:5]
        
        stats.update({
            'top_toplama_gonulluleri': list(top_toplama),
            'top_tasima_gonulluleri': list(top_tasima),
            'top_dagitim_gonulluleri': list(top_dagitim)
        })
        
        return stats
    
    @staticmethod
    def get_time_based_stats(days=30):
        """Zaman bazlı istatistikler"""
        end_date = timezone.now()
        start_date = end_date - timedelta(days=days)
        
        recent_cargo = Kargo.objects.filter(
            olusturulma_tarihi__gte=start_date
        )
        
        stats = {
            'period_days': days,
            'total_in_period': recent_cargo.count(),
            'daily_average': round(recent_cargo.count() / days, 2)
        }
        
        # Günlük dağılım
        from django.db.models import Count
        from django.db.models.functions import TruncDate
        
        daily_stats = recent_cargo.annotate(
            date=TruncDate('olusturulma_tarihi')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')
        
        stats['daily_distribution'] = list(daily_stats)
        
        return stats


class KargoUtils:
    """Kargo utility fonksiyonları"""
    
    @staticmethod
    def generate_report_data(filters=None):
        """Rapor verisi oluştur"""
        queryset = Kargo.objects.all()
        
        if filters:
            # Filtreleri uygula
            if 'durum' in filters:
                queryset = queryset.filter(durum=filters['durum'])
            if 'kargo_tipi' in filters:
                queryset = queryset.filter(kargo_tipi=filters['kargo_tipi'])
            if 'date_from' in filters:
                queryset = queryset.filter(olusturulma_tarihi__gte=filters['date_from'])
            if 'date_to' in filters:
                queryset = queryset.filter(olusturulma_tarihi__lte=filters['date_to'])
        
        return queryset.select_related(
            'toplama_gonullusu',
            'tasima_gonullusu', 
            'dagitim_gonullusu'
        )
    
    @staticmethod
    def get_content_suggestions(kargo_tipi):
        """Kargo tipine göre içerik önerileri"""
        content_map = {
            'gida': Kargo.GIDA_CHOICES,
            'ilac': Kargo.ILAC_CHOICES,
            'giyim': Kargo.GIYIM_CHOICES,
            'karisik': Kargo.KARISIK_CHOICES,
            'diger': Kargo.DIGER_CHOICES,
        }
        
        return content_map.get(kargo_tipi, [])
    
    @staticmethod
    def validate_cargo_number(kargo_no):
        """Kargo numarası format kontrolü"""
        if not kargo_no:
            return False, "Kargo numarası boş olamaz"
        
        if not kargo_no.startswith('AYK'):
            return False, "Kargo numarası 'AYK' ile başlamalıdır"
        
        if len(kargo_no) != 12:
            return False, "Kargo numarası 12 karakter olmalıdır (AYK + 9 rakam)"
        
        number_part = kargo_no[3:]
        if not number_part.isdigit():
            return False, "Kargo numarasının son 9 karakteri rakam olmalıdır"
        
        return True, "Geçerli kargo numarası"
    
    @staticmethod
    def get_route_distance_estimate(cikis_yeri, ulasacagi_yer):
        """Rota mesafe tahmini (basit implementasyon)"""
        # Bu gerçek bir mesafe hesaplama değil, sadece örnek
        # Gerçek uygulamada Google Maps API veya benzer servis kullanılabilir
        
        # Türkiye'nin büyük şehirleri için koordinatlar
        city_coordinates = {
            'istanbul': (41.0082, 28.9784),
            'ankara': (39.9334, 32.8597),
            'izmir': (38.4192, 27.1287),
            'bursa': (40.1826, 29.0665),
            'antalya': (36.8969, 30.7133),
            'adana': (37.0000, 35.3213),
            'gaziantep': (37.0662, 37.3833),
            'konya': (37.8667, 32.4833),
            'mersin': (36.8000, 34.6333),
            'diyarbakir': (37.9144, 40.2306),
            'kayseri': (38.7312, 35.4787),
            'eskisehir': (39.7767, 30.5206),
            'urfa': (37.1591, 38.7969),
            'malatya': (38.3552, 38.3095),
            'erzurum': (39.9000, 41.2700),
            'van': (38.4891, 43.4089),
            'batman': (37.8812, 41.1351),
            'elazig': (38.6810, 39.2264),
            'erzincan': (39.7500, 39.5000),
            'tokat': (40.3167, 36.5500),
            'sivas': (39.7477, 37.0179),
            'rize': (41.0201, 40.5234),
            'ordu': (40.9839, 37.8764),
            'giresun': (40.9128, 38.3895),
            'trabzon': (41.0015, 39.7178),
            'samsun': (41.2928, 36.3313),
            'sinop': (42.0231, 35.1531),
            'zonguldak': (41.4564, 31.7987),
            'karabuk': (41.2061, 32.6204),
            'kastamonu': (41.3887, 33.7827),
            'corum': (40.5506, 34.9556),
            'amasya': (40.6499, 35.8353),
            # Diğer şehirler için Google Maps API kullanılabilir
        }
        
        if cikis_yeri in city_coordinates and ulasacagi_yer in city_coordinates:
            # Basit Euclidean mesafe hesaplama
            import math
            
            lat1, lon1 = city_coordinates[cikis_yeri]
            lat2, lon2 = city_coordinates[ulasacagi_yer]
            
            # Haversine formülü (yaklaşık)
            dlat = math.radians(lat2 - lat1)
            dlon = math.radians(lon2 - lon1)
            a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
            c = 2 * math.asin(math.sqrt(a))
            distance = 6371 * c  # Dünya yarıçapı km cinsinden
            
            return round(distance, 2)
        
        return None  # Koordinat bulunamadı
