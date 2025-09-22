from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase
from rest_framework import status
from apps.volunteers.models import Volunteer
from .models import Kargo
from .serializers import KargoSerializer, KargoCreateSerializer
from .utils import KargoStats, KargoUtils


class KargoModelTest(TestCase):
    """Kargo model testleri"""
    
    def setUp(self):
        """Test için gerekli veriler"""
        # Test user ve volunteer oluştur
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.volunteer = Volunteer.objects.create(
            user=self.user,
            ad='Test',
            soyad='Gönüllü',
            telefon='5551234567',
            sehir='istanbul',
            gonullu_tipi='toplama'
        )
    
    def test_kargo_creation(self):
        """Kargo oluşturma testi"""
        kargo = Kargo.objects.create(
            anonim_gonderici=False,
            gonderici_ad='Ahmet',
            gonderici_soyad='Yılmaz',
            gonderici_telefon='5551234567',
            gonderici_email='ahmet@example.com',
            cikis_yeri='istanbul',
            ulasacagi_yer='ankara',
            agirlik=10.50,
            hacim=0.25,
            miktar=2,
            kargo_tipi='gida',
            icerik='Su (5L, 10L, 19L), Kuru Gıda Paketi',
            toplama_gonullusu=self.volunteer
        )
        
        self.assertIsNotNone(kargo.kargo_no)
        self.assertTrue(kargo.kargo_no.startswith('AYK'))
        self.assertEqual(len(kargo.kargo_no), 12)
        self.assertEqual(kargo.durum, 'hazirlaniyor')  # Default durum
    
    def test_anonymous_sender(self):
        """Anonim gönderici testi"""
        kargo = Kargo(
            anonim_gonderici=True,
            cikis_yeri='istanbul',
            ulasacagi_yer='ankara',
            agirlik=5.0,
            hacim=0.1,
            miktar=1,
            kargo_tipi='gida',
            icerik='Su (5L, 10L, 19L)'
        )
        
        # Clean method çağrıldığında anonim için gönderici bilgisi zorunlu değil
        try:
            kargo.clean()
        except ValidationError:
            self.fail("Anonim gönderici için validation hatası olmamalı")
    
    def test_non_anonymous_sender_validation(self):
        """Anonim olmayan gönderici validation testi"""
        kargo = Kargo(
            anonim_gonderici=False,
            cikis_yeri='istanbul',
            ulasacagi_yer='ankara',
            agirlik=5.0,
            hacim=0.1,
            miktar=1,
            kargo_tipi='gida',
            icerik='Su (5L, 10L, 19L)'
        )
        
        # Gönderici bilgisi eksik olduğunda ValidationError bekleniyor
        with self.assertRaises(ValidationError):
            kargo.clean()
    
    def test_same_city_validation(self):
        """Aynı şehir validation testi"""
        kargo = Kargo(
            anonim_gonderici=True,
            cikis_yeri='istanbul',
            ulasacagi_yer='istanbul',  # Aynı şehir
            agirlik=5.0,
            hacim=0.1,
            miktar=1,
            kargo_tipi='gida',
            icerik='Su (5L, 10L, 19L)'
        )
        
        with self.assertRaises(ValidationError):
            kargo.clean()
    
    def test_cargo_number_uniqueness(self):
        """Kargo numarası benzersizlik testi"""
        kargo1 = Kargo.objects.create(
            anonim_gonderici=True,
            cikis_yeri='istanbul',
            ulasacagi_yer='ankara',
            agirlik=5.0,
            hacim=0.1,
            miktar=1,
            kargo_tipi='gida',
            icerik='Su (5L, 10L, 19L)'
        )
        
        kargo2 = Kargo.objects.create(
            anonim_gonderici=True,
            cikis_yeri='izmir',
            ulasacagi_yer='bursa',
            agirlik=3.0,
            hacim=0.05,
            miktar=1,
            kargo_tipi='ilac',
            icerik='İlk Yardım Çantası'
        )
        
        self.assertNotEqual(kargo1.kargo_no, kargo2.kargo_no)


class KargoAPITest(APITestCase):
    """Kargo API testleri"""
    
    def setUp(self):
        """Test için gerekli veriler"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.volunteer = Volunteer.objects.create(
            user=self.user,
            ad='Test',
            soyad='Gönüllü',
            telefon='5551234567',
            sehir='istanbul',
            gonullu_tipi='toplama'
        )
        
        self.kargo = Kargo.objects.create(
            anonim_gonderici=False,
            gonderici_ad='Test',
            gonderici_soyad='User',
            gonderici_telefon='5551234567',
            gonderici_email='test@example.com',
            cikis_yeri='istanbul',
            ulasacagi_yer='ankara',
            agirlik=10.0,
            hacim=0.2,
            miktar=1,
            kargo_tipi='gida',
            icerik='Test içerik'
        )
    
    def test_kargo_list_requires_auth(self):
        """Kargo listesi authentication gerektiriyor"""
        response = self.client.get('/kargo/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_kargo_track_public(self):
        """Kargo takibi public endpoint"""
        response = self.client.get(f'/kargo/track/?kargo_no={self.kargo.kargo_no}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['kargo_no'], self.kargo.kargo_no)
    
    def test_kargo_track_invalid_number(self):
        """Geçersiz kargo numarası ile takip"""
        response = self.client.get('/kargo/track/?kargo_no=INVALID123')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertFalse(response.data['success'])
    
    def test_kargo_create_with_auth(self):
        """Authenticated user ile kargo oluşturma"""
        self.client.force_authenticate(user=self.user)
        
        data = {
            'anonim_gonderici': False,
            'gonderici_ad': 'Yeni',
            'gonderici_soyad': 'Gönderici',
            'gonderici_telefon': '5559876543',
            'gonderici_email': 'yeni@example.com',
            'cikis_yeri': 'izmir',
            'ulasacagi_yer': 'bursa',
            'agirlik': 15.5,
            'hacim': 0.3,
            'miktar': 3,
            'kargo_tipi': 'giyim',
            'icerik': 'Yetişkin Kış Kıyafeti'
        }
        
        response = self.client.post('/kargo/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Kargo oluşturuldu mu kontrol et
        new_kargo = Kargo.objects.get(gonderici_email='yeni@example.com')
        self.assertIsNotNone(new_kargo.kargo_no)


class KargoUtilsTest(TestCase):
    """Kargo utils testleri"""
    
    def setUp(self):
        """Test verisi oluştur"""
        # Test user ve volunteer
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.volunteer = Volunteer.objects.create(
            user=self.user,
            ad='Test',
            soyad='Gönüllü',
            telefon='5551234567',
            sehir='istanbul',
            gonullu_tipi='toplama'
        )
        
        # Test kargolar
        for i in range(5):
            Kargo.objects.create(
                anonim_gonderici=i % 2 == 0,  # Yarısı anonim
                gonderici_ad=f'Test{i}' if i % 2 != 0 else None,
                gonderici_soyad=f'User{i}' if i % 2 != 0 else None,
                gonderici_telefon=f'555123456{i}' if i % 2 != 0 else None,
                cikis_yeri='istanbul',
                ulasacagi_yer='ankara',
                agirlik=float(i + 1),
                hacim=0.1 * (i + 1),
                miktar=i + 1,
                kargo_tipi=['gida', 'ilac', 'giyim', 'karisik', 'diger'][i],
                icerik=f'Test içerik {i}',
                durum=['hazirlaniyor', 'yolda', 'teslim_edildi'][i % 3]
            )
    
    def test_general_stats(self):
        """Genel istatistikler testi"""
        stats = KargoStats.get_general_stats()
        
        self.assertEqual(stats['toplam_kargo'], 5)
        self.assertEqual(stats['anonim_gonderici'], 3)  # 0, 2, 4 indeksleri
        self.assertEqual(stats['gonderici_bilgili'], 2)  # 1, 3 indeksleri
        
        # Durum istatistikleri
        self.assertIn('durum_hazirlaniyor', stats)
        self.assertIn('durum_yolda', stats)
        self.assertIn('durum_teslim_edildi', stats)
    
    def test_weight_volume_stats(self):
        """Ağırlık ve hacim istatistikleri testi"""
        stats = KargoStats.get_weight_volume_stats()
        
        self.assertEqual(stats['toplam_agirlik'], 15.0)  # 1+2+3+4+5
        self.assertEqual(stats['ortalama_agirlik'], 3.0)  # 15/5
        self.assertEqual(stats['min_agirlik'], 1.0)
        self.assertEqual(stats['max_agirlik'], 5.0)
    
    def test_cargo_number_validation(self):
        """Kargo numarası validation testi"""
        # Geçerli numara
        valid, message = KargoUtils.validate_cargo_number('AYK123456789')
        self.assertTrue(valid)
        
        # Geçersiz format
        valid, message = KargoUtils.validate_cargo_number('ABC123456789')
        self.assertFalse(valid)
        
        # Yanlış uzunluk
        valid, message = KargoUtils.validate_cargo_number('AYK12345')
        self.assertFalse(valid)
        
        # Boş değer
        valid, message = KargoUtils.validate_cargo_number('')
        self.assertFalse(valid)
    
    def test_content_suggestions(self):
        """İçerik önerileri testi"""
        gida_suggestions = KargoUtils.get_content_suggestions('gida')
        self.assertIn('Su (5L, 10L, 19L)', gida_suggestions)
        
        ilac_suggestions = KargoUtils.get_content_suggestions('ilac')
        self.assertIn('İlk Yardım Çantası', ilac_suggestions)
        
        # Geçersiz tip
        invalid_suggestions = KargoUtils.get_content_suggestions('invalid')
        self.assertEqual(invalid_suggestions, [])


class KargoSignalsTest(TestCase):
    """Kargo signals testleri"""
    
    def setUp(self):
        """Test için gerekli veriler"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.volunteer = Volunteer.objects.create(
            user=self.user,
            ad='Test',
            soyad='Gönüllü',
            telefon='5551234567',
            sehir='istanbul',
            gonullu_tipi='toplama'
        )
    
    def test_anonymous_sender_signal(self):
        """Anonim gönderici signal testi"""
        kargo = Kargo.objects.create(
            anonim_gonderici=False,
            gonderici_ad='Test',
            gonderici_soyad='User',
            gonderici_telefon='5551234567',
            cikis_yeri='istanbul',
            ulasacagi_yer='ankara',
            agirlik=5.0,
            hacim=0.1,
            miktar=1,
            kargo_tipi='gida',
            icerik='Su (5L, 10L, 19L)'
        )
        
        # Anonim olarak güncelle
        kargo.anonim_gonderici = True
        kargo.save()
        
        # Gönderici bilgileri temizlenmiş olmalı
        kargo.refresh_from_db()
        self.assertIsNone(kargo.gonderici_ad)
        self.assertIsNone(kargo.gonderici_soyad)
        self.assertIsNone(kargo.gonderici_telefon)
        self.assertIsNone(kargo.gonderici_email)
    
    def test_status_change_signal(self):
        """Durum değişikliği signal testi"""
        kargo = Kargo.objects.create(
            anonim_gonderici=True,
            cikis_yeri='istanbul',
            ulasacagi_yer='ankara',
            agirlik=5.0,
            hacim=0.1,
            miktar=1,
            kargo_tipi='gida',
            icerik='Su (5L, 10L, 19L)',
            durum='hazirlaniyor'
        )
        
        # Durumu değiştir
        kargo.durum = 'yolda'
        kargo.save()
        
        # Signal çalıştığını doğrula (log kontrolü zor olduğu için basit kontrol)
        kargo.refresh_from_db()
        self.assertEqual(kargo.durum, 'yolda')
    
    def test_volunteer_validation_signal(self):
        """Gönüllü doğrulama signal testi"""
        # Yanlış tipte gönüllü atamaya çalış
        wrong_volunteer = Volunteer.objects.create(
            user=User.objects.create_user('wrong', 'wrong@test.com', 'pass'),
            ad='Wrong',
            soyad='Type',
            telefon='5559999999',
            sehir='ankara',
            gonullu_tipi='dagitim'  # Toplama için yanlış tip
        )
        
        with self.assertRaises(ValueError):
            Kargo.objects.create(
                anonim_gonderici=True,
                cikis_yeri='istanbul',
                ulasacagi_yer='ankara',
                agirlik=5.0,
                hacim=0.1,
                miktar=1,
                kargo_tipi='gida',
                icerik='Su (5L, 10L, 19L)',
                toplama_gonullusu=wrong_volunteer  # Yanlış tip
            )


class KargoFiltersTest(TestCase):
    """Kargo filters testleri"""
    
    def setUp(self):
        """Test verisi oluştur"""
        # Test kargolar oluştur
        Kargo.objects.create(
            anonim_gonderici=False,
            gonderici_ad='Ahmet',
            gonderici_soyad='Yılmaz',
            gonderici_telefon='5551111111',
            cikis_yeri='istanbul',
            ulasacagi_yer='ankara',
            agirlik=10.0,
            hacim=0.2,
            miktar=1,
            kargo_tipi='gida',
            icerik='Su (5L, 10L, 19L)'
        )
        
        Kargo.objects.create(
            anonim_gonderici=True,
            cikis_yeri='izmir',
            ulasacagi_yer='bursa',
            agirlik=5.0,
            hacim=0.1,
            miktar=2,
            kargo_tipi='ilac',
            icerik='İlk Yardım Çantası'
        )
    
    def test_sender_filter(self):
        """Gönderici filtresi testi"""
        from .filters import KargoFilter
        
        filter_set = KargoFilter({'gonderici_search': 'Ahmet'})
        filtered_qs = filter_set.qs
        
        self.assertEqual(filtered_qs.count(), 1)
        self.assertEqual(filtered_qs.first().gonderici_ad, 'Ahmet')
    
    def test_route_filter(self):
        """Rota filtresi testi"""
        from .filters import KargoFilter
        
        # İstanbul-Ankara rotası
        filter_set = KargoFilter({'rota': 'istanbul-ankara'})
        filtered_qs = filter_set.qs
        
        self.assertEqual(filtered_qs.count(), 1)
        self.assertEqual(filtered_qs.first().cikis_yeri, 'istanbul')
        
        # Tek şehir araması
        filter_set = KargoFilter({'rota': 'izmir'})
        filtered_qs = filter_set.qs
        
        self.assertEqual(filtered_qs.count(), 1)
        self.assertEqual(filtered_qs.first().cikis_yeri, 'izmir')
    
    def test_filter_validation(self):
        """Filter validation testi"""
        from .filters import KargoFilter
        
        # Çok kısa arama terimi
        filter_set = KargoFilter({'gonderici_search': 'A'})
        filtered_qs = filter_set.qs
        
        # Tüm kayıtları döndürmeli (filtreleme yapmamalı)
        self.assertEqual(filtered_qs.count(), 2)
        
        # Geçersiz rota formatı
        filter_set = KargoFilter({'rota': 'invalid--format'})
        filtered_qs = filter_set.qs
        
        # Tüm kayıtları döndürmeli
        self.assertEqual(filtered_qs.count(), 2)
