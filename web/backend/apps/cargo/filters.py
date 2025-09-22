import django_filters
from django.db.models import Q
from .models import Kargo


class KargoFilter(django_filters.FilterSet):
    """Kargo filtreleme için özel filter sınıfı"""
    
    # Tarih aralığı filtreleri
    olusturulma_tarihi_start = django_filters.DateFilter(
        field_name='olusturulma_tarihi', 
        lookup_expr='gte',
        label='Başlangıç Tarihi'
    )
    olusturulma_tarihi_end = django_filters.DateFilter(
        field_name='olusturulma_tarihi', 
        lookup_expr='lte',
        label='Bitiş Tarihi'
    )
    
    # Ağırlık aralığı filtreleri
    agirlik_min = django_filters.NumberFilter(
        field_name='agirlik', 
        lookup_expr='gte',
        label='Minimum Ağırlık'
    )
    agirlik_max = django_filters.NumberFilter(
        field_name='agirlik', 
        lookup_expr='lte',
        label='Maksimum Ağırlık'
    )
    
    # Hacim aralığı filtreleri
    hacim_min = django_filters.NumberFilter(
        field_name='hacim', 
        lookup_expr='gte',
        label='Minimum Hacim'
    )
    hacim_max = django_filters.NumberFilter(
        field_name='hacim', 
        lookup_expr='lte',
        label='Maksimum Hacim'
    )
    
    # Gönderici arama
    gonderici_search = django_filters.CharFilter(
        method='filter_gonderici',
        label='Gönderici Ara'
    )
    
    # Gönüllü arama
    gonullu_search = django_filters.CharFilter(
        method='filter_gonullu',
        label='Gönüllü Ara'
    )
    
    # Rota filtresi (çıkış-varış)
    rota = django_filters.CharFilter(
        method='filter_rota',
        label='Rota (çıkış-varış)'
    )
    
    # Aktif gönüllülü kargolar
    aktif_gonullu = django_filters.BooleanFilter(
        method='filter_aktif_gonullu',
        label='Aktif Gönüllülü Kargolar'
    )
    
    class Meta:
        model = Kargo
        fields = {
            'durum': ['exact', 'in'],
            'kargo_tipi': ['exact', 'in'],
            'cikis_yeri': ['exact', 'in'],
            'ulasacagi_yer': ['exact', 'in'],
            'anonim_gonderici': ['exact'],
            'olusturulma_tarihi': ['exact', 'gte', 'lte'],
            'agirlik': ['exact', 'gte', 'lte'],
            'hacim': ['exact', 'gte', 'lte'],
            'miktar': ['exact', 'gte', 'lte'],
        }
    
    def filter_gonderici(self, queryset, name, value):
        """Gönderici ad/soyad/telefon/email arama"""
        if not value or not isinstance(value, str):
            return queryset
        
        # Minimum 2 karakter kontrolü
        value = value.strip()
        if len(value) < 2:
            return queryset
        
        # SQL injection koruması için özel karakterleri temizle
        import re
        value = re.sub(r'[^\w\s@.-]', '', value)
        
        return queryset.filter(
            Q(gonderici_ad__icontains=value) |
            Q(gonderici_soyad__icontains=value) |
            Q(gonderici_telefon__icontains=value) |
            Q(gonderici_email__icontains=value)
        )
    
    def filter_gonullu(self, queryset, name, value):
        """Gönüllü ad/soyad/gonulluluk_no arama"""
        if not value or not isinstance(value, str):
            return queryset
        
        # Minimum 2 karakter kontrolü
        value = value.strip()
        if len(value) < 2:
            return queryset
        
        # Gönüllülük numarası formatı kontrolü (G ile başlıyorsa)
        if value.upper().startswith('G') and len(value) >= 3:
            # Sadece gönüllülük numarasında ara
            return queryset.filter(
                Q(toplama_gonullusu__gonulluluk_no__icontains=value) |
                Q(tasima_gonullusu__gonulluluk_no__icontains=value) |
                Q(dagitim_gonullusu__gonulluluk_no__icontains=value)
            )
        
        # SQL injection koruması
        import re
        value = re.sub(r'[^\w\s]', '', value)
        
        return queryset.filter(
            Q(toplama_gonullusu__ad__icontains=value) |
            Q(toplama_gonullusu__soyad__icontains=value) |
            Q(toplama_gonullusu__gonulluluk_no__icontains=value) |
            Q(tasima_gonullusu__ad__icontains=value) |
            Q(tasima_gonullusu__soyad__icontains=value) |
            Q(tasima_gonullusu__gonulluluk_no__icontains=value) |
            Q(dagitim_gonullusu__ad__icontains=value) |
            Q(dagitim_gonullusu__soyad__icontains=value) |
            Q(dagitim_gonullusu__gonulluluk_no__icontains=value)
        )
    
    def filter_rota(self, queryset, name, value):
        """Rota filtresi: 'istanbul-ankara' formatında"""
        if not value:
            return queryset
            
        # Input validation
        if not isinstance(value, str):
            return queryset
            
        if '-' not in value:
            # Tek şehir girildiyse hem çıkış hem varış olarak ara
            city = value.strip().lower()
            if city:
                return queryset.filter(
                    Q(cikis_yeri__icontains=city) | 
                    Q(ulasacagi_yer__icontains=city)
                )
            return queryset
        
        try:
            parts = value.split('-')
            if len(parts) != 2:
                return queryset
                
            cikis, varis = parts[0].strip().lower(), parts[1].strip().lower()
            
            # Boş değer kontrolü
            if not cikis and not varis:
                return queryset
            elif not cikis:
                return queryset.filter(ulasacagi_yer__icontains=varis)
            elif not varis:
                return queryset.filter(cikis_yeri__icontains=cikis)
            else:
                return queryset.filter(
                    cikis_yeri__icontains=cikis,
                    ulasacagi_yer__icontains=varis
                )
        except (ValueError, AttributeError):
            return queryset
    
    def filter_aktif_gonullu(self, queryset, name, value):
        """Aktif gönüllülü kargolar"""
        if value is None:
            return queryset
        
        if value:
            return queryset.filter(
                Q(toplama_gonullusu__is_active=True) |
                Q(tasima_gonullusu__is_active=True) |
                Q(dagitim_gonullusu__is_active=True)
            )
        else:
            return queryset.filter(
                Q(toplama_gonullusu__isnull=True) &
                Q(tasima_gonullusu__isnull=True) &
                Q(dagitim_gonullusu__isnull=True)
            )
