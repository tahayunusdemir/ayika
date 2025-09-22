from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from apps.cargo.models import Kargo
from apps.volunteers.models import Volunteer
import random


class Command(BaseCommand):
    help = 'Create sample cargo data for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=20,
            help='Number of sample cargo to create'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing cargo before creating new ones'
        )
        parser.add_argument(
            '--skip-existing',
            action='store_true',
            help='Skip creating if data already exists'
        )
        parser.add_argument(
            '--anonymous-ratio',
            type=float,
            default=0.3,
            help='Ratio of anonymous senders (0.0-1.0)'
        )
        parser.add_argument(
            '--volunteer-ratio',
            type=float,
            default=0.7,
            help='Ratio of cargo with assigned volunteers (0.0-1.0)'
        )

    def handle(self, *args, **options):
        count = options['count']
        clear_existing = options['clear']
        skip_existing = options['skip_existing']
        anonymous_ratio = options['anonymous_ratio']
        volunteer_ratio = options['volunteer_ratio']
        
        # Parametre validasyonu
        if not 0 <= anonymous_ratio <= 1:
            self.stdout.write(self.style.ERROR('Anonymous ratio must be between 0.0 and 1.0'))
            return
        
        if not 0 <= volunteer_ratio <= 1:
            self.stdout.write(self.style.ERROR('Volunteer ratio must be between 0.0 and 1.0'))
            return
        
        # Skip if data already exists
        if skip_existing:
            existing_count = Kargo.objects.count()
            if existing_count > 0:
                self.stdout.write(
                    self.style.WARNING(f'{existing_count} adet mevcut kargo var, yeni kargo oluşturulmayacak.')
                )
                return
        
        # Mevcut kargoları temizle
        if clear_existing:
            existing_count = Kargo.objects.count()
            if existing_count > 0:
                Kargo.objects.all().delete()
                self.stdout.write(
                    self.style.WARNING(f'{existing_count} adet mevcut kargo silindi.')
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'{count} adet örnek kargo oluşturuluyor...\n'
                f'   Anonim oran: %{anonymous_ratio*100:.0f}\n'
                f'   Gönüllü oran: %{volunteer_ratio*100:.0f}\n'
            )
        )
        
        # Örnek gönderici isimleri
        sender_names = [
            ('Ahmet', 'Yılmaz'), ('Mehmet', 'Kaya'), ('Fatma', 'Demir'),
            ('Ayşe', 'Çelik'), ('Mustafa', 'Şahin'), ('Zeynep', 'Yıldız'),
            ('Ali', 'Özkan'), ('Elif', 'Arslan'), ('Hasan', 'Doğan'),
            ('Merve', 'Koç'), ('İbrahim', 'Kurt'), ('Seda', 'Aydın'),
            ('Osman', 'Güneş'), ('Büşra', 'Polat'), ('Emre', 'Çakır')
        ]
        
        # Türkiye'nin 81 şehri (SEHIR_CHOICES ile uyumlu)
        cities = [
            'adana', 'adiyaman', 'afyonkarahisar', 'agri', 'amasya', 'ankara', 'antalya', 'artvin',
            'aydin', 'balikesir', 'bilecik', 'bingol', 'bitlis', 'bolu', 'burdur', 'bursa',
            'canakkale', 'cankiri', 'corum', 'denizli', 'diyarbakir', 'edirne', 'elazig', 'erzincan',
            'erzurum', 'eskisehir', 'gaziantep', 'giresun', 'gumushane', 'hakkari', 'hatay', 'isparta',
            'mersin', 'istanbul', 'izmir', 'kars', 'kastamonu', 'kayseri', 'kirklareli', 'kirsehir',
            'kocaeli', 'konya', 'kutahya', 'malatya', 'manisa', 'kahramanmaras', 'mardin', 'mugla',
            'mus', 'nevsehir', 'nigde', 'ordu', 'rize', 'sakarya', 'samsun', 'siirt',
            'sinop', 'sivas', 'tekirdag', 'tokat', 'trabzon', 'tunceli', 'sanliurfa', 'usak',
            'van', 'yozgat', 'zonguldak', 'aksaray', 'bayburt', 'karaman', 'kirikkale', 'batman',
            'sirnak', 'bartin', 'ardahan', 'igdir', 'yalova', 'karabuk', 'kilis', 'osmaniye', 'duzce'
        ]
        
        # Örnek içerikler
        sample_contents = {
            'gida': [
                'Su (5L, 10L, 19L), Kuru Gıda Paketi',
                'Bebek Maması ve Besini, Süt ve Süt Ürünleri',
                'Pirinç (1kg, 5kg, 25kg), Makarna ve Bulgur',
                'Konserve Gıda (Et, Sebze, Meyve), Hazır Yemek Paketi'
            ],
            'ilac': [
                'İlk Yardım Çantası, Bandaj ve Sargı Malzemesi',
                'Ağrı Kesici (Parol, Aspirin), Ateş Düşürücü',
                'Vitamin ve Mineral Takviyesi, Antiseptik ve Dezenfektan',
                'Maske ve Eldiven, Termometre'
            ],
            'giyim': [
                'Yetişkin Kış Kıyafeti, Mont ve Kaban',
                'Çocuk Kıyafeti (0-2 Yaş), Bebek Kıyafeti ve Zıbın',
                'Battaniye ve Yorgan, Uyku Tulumu',
                'Ayakkabı (Erkek/Kadın/Çocuk), İç Çamaşırı Seti'
            ],
            'karisik': [
                'Aile Yardım Paketi, Hijyen Paketi',
                'Bebek Bakım Paketi, Temizlik Malzemeleri Paketi',
                'Okul Malzemeleri Paketi, Eğitim Destek Paketi',
                'Acil Durum Paketi, Kışlık Hazırlık Paketi'
            ],
            'diger': [
                'Elektronik Eşya (Telefon, Tablet), Ev Eşyası (Tencere, Tabak)',
                'Kitap ve Dergi, Çocuk Oyuncakları',
                'Temizlik Malzemeleri, Kırtasiye Malzemeleri',
                'Mutfak Gereçleri, Banyo Malzemeleri'
            ]
        }
        
        # Aktif gönüllüleri al
        volunteers = list(Volunteer.objects.filter(is_active=True))
        
        created_count = 0
        
        for i in range(count):
            # Anonim ratio'ya göre gönderici seç
            is_anonymous = random.random() < anonymous_ratio
            
            if is_anonymous:
                sender_name = None
                sender_surname = None
                sender_phone = None
                sender_email = None
            else:
                sender_name, sender_surname = random.choice(sender_names)
                sender_phone = f"5{random.randint(100000000, 999999999)}"
                sender_email = f"{sender_name.lower()}.{sender_surname.lower()}@example.com"
            
            # Rastgele şehirler seç
            origin_city = random.choice(cities)
            destination_city = random.choice([c for c in cities if c != origin_city])
            
            # Rastgele kargo tipi ve içerik seç
            cargo_type = random.choice(list(sample_contents.keys()))
            content = random.choice(sample_contents[cargo_type])
            
            # Volunteer ratio'ya göre gönüllü ata
            assign_volunteers = random.random() < volunteer_ratio
            
            toplama_volunteers = [v for v in volunteers if v.gonullu_tipi in ['toplama', 'karma']]
            tasima_volunteers = [v for v in volunteers if v.gonullu_tipi in ['tasima', 'karma']]
            dagitim_volunteers = [v for v in volunteers if v.gonullu_tipi in ['dagitim', 'karma']]
            
            if assign_volunteers:
                toplama_gonullusu = random.choice(toplama_volunteers) if toplama_volunteers else None
                tasima_gonullusu = random.choice(tasima_volunteers) if tasima_volunteers else None
                dagitim_gonullusu = random.choice(dagitim_volunteers) if dagitim_volunteers else None
            else:
                toplama_gonullusu = None
                tasima_gonullusu = None
                dagitim_gonullusu = None
            
            try:
                kargo = Kargo.objects.create(
                    anonim_gonderici=is_anonymous,
                    gonderici_ad=sender_name,
                    gonderici_soyad=sender_surname,
                    gonderici_telefon=sender_phone,
                    gonderici_email=sender_email,
                    cikis_yeri=origin_city,
                    ulasacagi_yer=destination_city,
                    agirlik=round(random.uniform(0.5, 50.0), 2),
                    hacim=round(random.uniform(0.01, 2.0), 2),
                    miktar=random.randint(1, 10),
                    durum=random.choice(['hazirlaniyor', 'yolda', 'teslim_edildi']),
                    kargo_tipi=cargo_type,
                    icerik=content,
                    toplama_gonullusu=toplama_gonullusu,
                    tasima_gonullusu=tasima_gonullusu,
                    dagitim_gonullusu=dagitim_gonullusu,
                    ozel_not=f"Test kargo #{i+1}" if random.choice([True, False]) else None
                )
                created_count += 1
                
                # Detaylı başarı mesajı
                volunteer_info = []
                try:
                    if kargo.toplama_gonullusu:
                        volunteer_info.append(f"T:{kargo.toplama_gonullusu.gonulluluk_no}")
                except:
                    pass
                try:
                    if kargo.tasima_gonullusu:
                        volunteer_info.append(f"Ta:{kargo.tasima_gonullusu.gonulluluk_no}")
                except:
                    pass
                try:
                    if kargo.dagitim_gonullusu:
                        volunteer_info.append(f"D:{kargo.dagitim_gonullusu.gonulluluk_no}")
                except:
                    pass
                
                volunteer_str = f" [{', '.join(volunteer_info)}]" if volunteer_info else " [Gönüllüsüz]"
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Yeni kargo oluşturuldu: {kargo.kargo_no} - {kargo.get_durum_display()}'
                    )
                )
                self.stdout.write(
                    self.style.SUCCESS(
                        f'{kargo.kargo_no}: {origin_city}->{destination_city} '
                        f'({cargo_type}, {kargo.agirlik}kg){volunteer_str}'
                    )
                )
                
            except ValueError as e:
                self.stdout.write(
                    self.style.ERROR(f'Validation hatası #{i+1}: {str(e)}')
                )
            except Exception as e:
                error_type = type(e).__name__
                self.stdout.write(
                    self.style.ERROR(f'{error_type} #{i+1}: {str(e)}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\nToplam {created_count} adet örnek kargo başarıyla oluşturuldu!'
            )
        )
        
        # İstatistikleri göster
        total_cargo = Kargo.objects.count()
        self.stdout.write(f'\nToplam kargo sayısı: {total_cargo}')
        
        for status_code, status_name in Kargo.DURUM_CHOICES:
            count = Kargo.objects.filter(durum=status_code).count()
            self.stdout.write(f'   {status_name}: {count}')
        
        self.stdout.write(f'\nKargo Tipleri:')
        for type_code, type_name in Kargo.KARGO_TIPI_CHOICES:
            count = Kargo.objects.filter(kargo_tipi=type_code).count()
            self.stdout.write(f'   {type_name}: {count}')
