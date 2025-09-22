from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from django_filters.rest_framework import DjangoFilterBackend
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Q, Count, Sum, Avg, Min, Max
from django.core.exceptions import ValidationError
from datetime import datetime, timedelta
import json
import logging

# Logger setup
logger = logging.getLogger(__name__)


class IsStaffOrSuperuser(BasePermission):
    """
    Custom permission to only allow staff or superuser access.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)


class IsAdminOrReadOnlyForTracking(BasePermission):
    """
    Custom permission for cargo tracking - allow public read for tracking, admin for everything else.
    """
    def has_permission(self, request, view):
        # Allow public access for tracking endpoint
        if hasattr(view, 'action') and view.action == 'track':
            return True
        
        # For all other operations, require admin access
        return request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)


from .models import Kargo
from .serializers import KargoSerializer, KargoCreateSerializer, KargoTrackingSerializer


class KargoViewSet(viewsets.ModelViewSet):
    """
    Kargo işlemleri için ViewSet
    """
    queryset = Kargo.objects.all()
    serializer_class = KargoSerializer
    permission_classes = [IsAdminOrReadOnlyForTracking]  # Admin access required except for tracking
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['durum', 'kargo_tipi', 'cikis_yeri', 'ulasacagi_yer', 'anonim_gonderici']
    search_fields = ['kargo_no', 'gonderici_ad', 'gonderici_soyad', 'icerik']
    ordering_fields = ['olusturulma_tarihi', 'son_degisiklik', 'agirlik']
    ordering = ['-olusturulma_tarihi']
    
    def get_serializer_class(self):
        """Aksiyona göre serializer seç"""
        if self.action == 'create':
            return KargoCreateSerializer
        elif self.action == 'track':
            return KargoTrackingSerializer
        return KargoSerializer
    
    def create(self, request, *args, **kwargs):
        """Override create to return full details with volunteer info"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        
        # Return full details using KargoSerializer
        full_serializer = KargoSerializer(instance)
        return Response(full_serializer.data, status=status.HTTP_201_CREATED)
    
    def get_queryset(self):
        """Optimized queryset with select_related"""
        return Kargo.objects.select_related(
            'toplama_gonullusu', 
            'tasima_gonullusu', 
            'dagitim_gonullusu'
        )
    
    @action(detail=False, methods=['get'], permission_classes=[])
    def track(self, request):
        """Kargo takibi - Public endpoint"""
        kargo_no = request.query_params.get('kargo_no')
        
        if not kargo_no:
            logger.warning("Kargo takibi: Kargo numarası eksik")
            return Response({
                'success': False,
                'error': 'Kargo numarası gereklidir',
                'code': 'MISSING_CARGO_NUMBER'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Kargo numarası format kontrolü
        from .utils import KargoUtils
        is_valid, message = KargoUtils.validate_cargo_number(kargo_no)
        if not is_valid:
            logger.warning(f"Kargo takibi: Geçersiz format - {kargo_no}")
            return Response({
                'success': False,
                'error': f'Geçersiz kargo numarası formatı: {message}',
                'code': 'INVALID_CARGO_FORMAT'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            kargo = Kargo.objects.get(kargo_no=kargo_no)
            serializer = KargoTrackingSerializer(kargo)
            logger.info(f"Kargo takibi başarılı: {kargo_no}")
            return Response({
                'success': True,
                'data': serializer.data
            })
        except Kargo.DoesNotExist:
            logger.warning(f"Kargo takibi: Kargo bulunamadı - {kargo_no}")
            return Response({
                'success': False,
                'error': 'Kargo bulunamadı',
                'code': 'CARGO_NOT_FOUND'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Kargo takibi hatası: {str(e)}")
            return Response({
                'success': False,
                'error': 'Sistem hatası oluştu',
                'code': 'SYSTEM_ERROR'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Kargo durumunu güncelle"""
        kargo = get_object_or_404(Kargo, pk=pk)
        new_status = request.data.get('durum')
        
        if new_status not in dict(Kargo.DURUM_CHOICES):
            return Response({
                'error': 'Geçersiz durum'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        old_status = kargo.durum
        kargo.durum = new_status
        kargo.save()
        
        return Response({
            'success': True,
            'message': f'Kargo durumu {old_status} -> {new_status} olarak güncellendi',
            'data': {
                'kargo_no': kargo.kargo_no,
                'old_status': old_status,
                'new_status': new_status
            }
        })
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Detaylı kargo istatistikleri"""
        try:
            total_cargo = Kargo.objects.count()
            
            if total_cargo == 0:
                return Response({
                    'success': True,
                    'data': {
                        'toplam_kargo': 0,
                        'anonim_gonderici': 0,
                        'gonderici_bilgili': 0,
                        'durum_hazirlaniyor': {'count': 0, 'percentage': 0, 'name': 'Hazırlanıyor'},
                        'durum_yolda': {'count': 0, 'percentage': 0, 'name': 'Yolda'},
                        'durum_teslim_edildi': {'count': 0, 'percentage': 0, 'name': 'Teslim Edildi'},
                        'durum_iptal_edildi': {'count': 0, 'percentage': 0, 'name': 'İptal Edildi'},
                        'tip_gida': {'count': 0, 'percentage': 0, 'name': 'Gıda'},
                        'tip_ilac': {'count': 0, 'percentage': 0, 'name': 'İlaç'},
                        'tip_giyim': {'count': 0, 'percentage': 0, 'name': 'Giyim'},
                        'tip_karisik': {'count': 0, 'percentage': 0, 'name': 'Karışık'},
                        'tip_diger': {'count': 0, 'percentage': 0, 'name': 'Diğer'}
                    }
                })
            
            stats = {}
            
            # Genel istatistikler
            stats['toplam_kargo'] = total_cargo
            stats['anonim_gonderici'] = Kargo.objects.filter(anonim_gonderici=True).count()
            stats['gonderici_bilgili'] = total_cargo - stats['anonim_gonderici']
            
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
            
            return Response({
                'success': True,
                'data': stats
            })
        except Exception as e:
            logger.error(f"Statistics error: {str(e)}")
            return Response({
                'success': False,
                'error': 'İstatistikler yüklenirken hata oluştu'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='weight-volume-stats')
    def weight_volume_stats(self, request):
        """Ağırlık ve hacim istatistikleri"""
        try:
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
            
            return Response({
                'success': True,
                'data': stats
            })
        except Exception as e:
            logger.error(f"Weight/Volume stats error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Ağırlık/hacim istatistikleri yüklenirken hata oluştu'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='city-stats')
    def city_stats(self, request):
        """Şehir bazlı istatistikler"""
        try:
            # Türk şehir isimleri mapping
            CITY_NAMES = {
                'adana': 'Adana', 'adiyaman': 'Adıyaman', 'afyonkarahisar': 'Afyonkarahisar',
                'agri': 'Ağrı', 'amasya': 'Amasya', 'ankara': 'Ankara', 'antalya': 'Antalya',
                'artvin': 'Artvin', 'aydin': 'Aydın', 'balikesir': 'Balıkesir', 'bilecik': 'Bilecik',
                'bingol': 'Bingöl', 'bitlis': 'Bitlis', 'bolu': 'Bolu', 'burdur': 'Burdur',
                'bursa': 'Bursa', 'canakkale': 'Çanakkale', 'cankiri': 'Çankırı', 'corum': 'Çorum',
                'denizli': 'Denizli', 'diyarbakir': 'Diyarbakır', 'edirne': 'Edirne', 'elazig': 'Elazığ',
                'erzincan': 'Erzincan', 'erzurum': 'Erzurum', 'eskisehir': 'Eskişehir', 'gaziantep': 'Gaziantep',
                'giresun': 'Giresun', 'gumushane': 'Gümüşhane', 'hakkari': 'Hakkari', 'hatay': 'Hatay',
                'isparta': 'Isparta', 'mersin': 'Mersin', 'istanbul': 'İstanbul', 'izmir': 'İzmir',
                'kars': 'Kars', 'kastamonu': 'Kastamonu', 'kayseri': 'Kayseri', 'kirklareli': 'Kırklareli',
                'kirsehir': 'Kırşehir', 'kocaeli': 'Kocaeli', 'konya': 'Konya', 'kutahya': 'Kütahya',
                'malatya': 'Malatya', 'manisa': 'Manisa', 'kahramanmaras': 'Kahramanmaraş', 'mardin': 'Mardin',
                'mugla': 'Muğla', 'mus': 'Muş', 'nevsehir': 'Nevşehir', 'nigde': 'Niğde',
                'ordu': 'Ordu', 'rize': 'Rize', 'sakarya': 'Sakarya', 'samsun': 'Samsun',
                'siirt': 'Siirt', 'sinop': 'Sinop', 'sivas': 'Sivas', 'tekirdag': 'Tekirdağ',
                'tokat': 'Tokat', 'trabzon': 'Trabzon', 'tunceli': 'Tunceli', 'sanliurfa': 'Şanlıurfa',
                'usak': 'Uşak', 'van': 'Van', 'yozgat': 'Yozgat', 'zonguldak': 'Zonguldak',
                'aksaray': 'Aksaray', 'bayburt': 'Bayburt', 'karaman': 'Karaman', 'kirikkale': 'Kırıkkale',
                'batman': 'Batman', 'sirnak': 'Şırnak', 'bartin': 'Bartın', 'ardahan': 'Ardahan',
                'igdir': 'Iğdır', 'yalova': 'Yalova', 'karabuk': 'Karabük', 'kilis': 'Kilis',
                'osmaniye': 'Osmaniye', 'duzce': 'Düzce'
            }
            
            # En çok çıkış yapılan şehirler
            top_origins = Kargo.objects.values('cikis_yeri').annotate(
                count=Count('id')
            ).order_by('-count')[:10]
            
            # En çok varış yapılan şehirler
            top_destinations = Kargo.objects.values('ulasacagi_yer').annotate(
                count=Count('id')
            ).order_by('-count')[:10]
            
            # Display name'leri ekle
            for item in top_origins:
                item['display_name'] = CITY_NAMES.get(item['cikis_yeri'], item['cikis_yeri'].title())
            
            for item in top_destinations:
                item['display_name'] = CITY_NAMES.get(item['ulasacagi_yer'], item['ulasacagi_yer'].title())
            
            return Response({
                'success': True,
                'data': {
                    'top_origins': list(top_origins),
                    'top_destinations': list(top_destinations)
                }
            })
        except Exception as e:
            logger.error(f"City stats error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Şehir istatistikleri yüklenirken hata oluştu'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='volunteer-stats')
    def volunteer_stats(self, request):
        """Gönüllü atama istatistikleri"""
        try:
            total_cargo = Kargo.objects.count()
            
            # Gönüllü atama sayıları
            toplama_atanmis = Kargo.objects.filter(toplama_gonullusu__isnull=False).count()
            tasima_atanmis = Kargo.objects.filter(tasima_gonullusu__isnull=False).count()
            dagitim_atanmis = Kargo.objects.filter(dagitim_gonullusu__isnull=False).count()
            hic_atanmamis = Kargo.objects.filter(
                toplama_gonullusu__isnull=True,
                tasima_gonullusu__isnull=True,
                dagitim_gonullusu__isnull=True
            ).count()
            
            # En aktif gönüllüler
            top_toplama = Kargo.objects.filter(
                toplama_gonullusu__isnull=False
            ).values(
                'toplama_gonullusu__gonulluluk_no',
                'toplama_gonullusu__ad',
                'toplama_gonullusu__soyad'
            ).annotate(count=Count('id')).order_by('-count')[:5]
            
            top_tasima = Kargo.objects.filter(
                tasima_gonullusu__isnull=False
            ).values(
                'tasima_gonullusu__gonulluluk_no',
                'tasima_gonullusu__ad',
                'tasima_gonullusu__soyad'
            ).annotate(count=Count('id')).order_by('-count')[:5]
            
            top_dagitim = Kargo.objects.filter(
                dagitim_gonullusu__isnull=False
            ).values(
                'dagitim_gonullusu__gonulluluk_no',
                'dagitim_gonullusu__ad',
                'dagitim_gonullusu__soyad'
            ).annotate(count=Count('id')).order_by('-count')[:5]
            
            return Response({
                'success': True,
                'data': {
                    'toplama_atanmis': toplama_atanmis,
                    'tasima_atanmis': tasima_atanmis,
                    'dagitim_atanmis': dagitim_atanmis,
                    'hic_atanmamis': hic_atanmamis,
                    'top_toplama_gonulluleri': list(top_toplama),
                    'top_tasima_gonulluleri': list(top_tasima),
                    'top_dagitim_gonulluleri': list(top_dagitim)
                }
            })
        except Exception as e:
            logger.error(f"Volunteer stats error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Gönüllü istatistikleri yüklenirken hata oluştu'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='time-based-stats')
    def time_based_stats(self, request):
        """Zaman bazlı istatistikler"""
        try:
            days = int(request.query_params.get('days', 30))
            end_date = timezone.now().date()
            start_date = end_date - timedelta(days=days)
            
            # Belirtilen dönemdeki kargolar
            period_cargo = Kargo.objects.filter(
                olusturulma_tarihi__date__gte=start_date,
                olusturulma_tarihi__date__lte=end_date
            )
            
            total_in_period = period_cargo.count()
            daily_average = total_in_period / days if days > 0 else 0
            
            # Günlük dağılım
            daily_distribution = []
            current_date = start_date
            while current_date <= end_date:
                count = period_cargo.filter(olusturulma_tarihi__date=current_date).count()
                daily_distribution.append({
                    'date': current_date.strftime('%Y-%m-%d'),
                    'count': count
                })
                current_date += timedelta(days=1)
            
            return Response({
                'success': True,
                'data': {
                    'period_days': days,
                    'total_in_period': total_in_period,
                    'daily_average': round(daily_average, 2),
                    'daily_distribution': daily_distribution
                }
            })
        except Exception as e:
            logger.error(f"Time-based stats error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Zaman bazlı istatistikler yüklenirken hata oluştu'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def by_volunteer(self, request):
        """Gönüllü bazlı kargo listesi"""
        volunteer_id = request.query_params.get('volunteer_id')
        
        if not volunteer_id:
            return Response({
                'error': 'Gönüllü ID gereklidir'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        kargolar = Kargo.objects.filter(
            Q(toplama_gonullusu_id=volunteer_id) |
            Q(tasima_gonullusu_id=volunteer_id) |
            Q(dagitim_gonullusu_id=volunteer_id)
        ).select_related('toplama_gonullusu', 'tasima_gonullusu', 'dagitim_gonullusu')
        
        serializer = KargoSerializer(kargolar, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'], permission_classes=[])
    def health(self, request):
        """API health check endpoint"""
        try:
            # Test database connection
            cargo_count = Kargo.objects.count()
            
            return Response({
                'success': True,
                'message': 'Cargo API is healthy',
                'data': {
                    'status': 'healthy',
                    'timestamp': timezone.now().isoformat(),
                    'database': 'connected',
                    'cargo_count': cargo_count,
                    'endpoints': {
                        'list': '/api/v1/kargo/',
                        'create': '/api/v1/kargo/',
                        'detail': '/api/v1/kargo/{id}/',
                        'track': '/api/v1/kargo/track/?kargo_no={cargo_no}',
                        'statistics': '/api/v1/kargo/statistics/',
                        'health': '/api/v1/kargo/health/'
                    }
                }
            })
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            return Response({
                'success': False,
                'message': 'Cargo API health check failed',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Backward compatibility için basit ViewSet
class CargoLegacyViewSet(viewsets.ViewSet):
    """
    Basit kargo işlemleri için ViewSet (Legacy API - Backward compatibility)
    Bu ViewSet eski API formatını destekler, yeni projeler KargoViewSet kullanmalı
    """
    
    def list(self, request):
        """Kargo listesi"""
        kargolar = Kargo.objects.all()[:10]  # İlk 10 kargo
        serializer = KargoSerializer(kargolar, many=True)
        return Response({
            'message': 'Kargo listesi',
            'data': serializer.data
        })
    
    def create(self, request):
        """Yeni kargo oluştur"""
        serializer = KargoCreateSerializer(data=request.data)
        if serializer.is_valid():
            kargo = serializer.save()
            # Fetch with volunteer details
            kargo_with_details = Kargo.objects.select_related(
                'toplama_gonullusu', 
                'tasima_gonullusu', 
                'dagitim_gonullusu'
            ).get(pk=kargo.pk)
            return Response({
                'message': 'Kargo başarıyla oluşturuldu',
                'data': KargoSerializer(kargo_with_details).data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'message': 'Kargo oluşturulamadı',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def track(self, request, pk=None):
        """Kargo takibi"""
        try:
            kargo = Kargo.objects.get(kargo_no=pk)
            serializer = KargoTrackingSerializer(kargo)
            return Response({
                'message': f'Kargo {pk} takip bilgileri',
                'data': serializer.data
            })
        except Kargo.DoesNotExist:
            return Response({
                'message': 'Kargo bulunamadı',
                'error': 'Kargo numarası geçersiz'
            }, status=status.HTTP_404_NOT_FOUND)
    
    def retrieve(self, request, pk=None):
        """Kargo detayını getir"""
        try:
            kargo = Kargo.objects.get(pk=pk)
            serializer = KargoSerializer(kargo)
            return Response({
                'message': 'Kargo detayları',
                'data': serializer.data
            })
        except Kargo.DoesNotExist:
            return Response({
                'message': 'Kargo bulunamadı'
            }, status=status.HTTP_404_NOT_FOUND)
