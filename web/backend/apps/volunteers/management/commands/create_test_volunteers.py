"""
Django management command to create test volunteer data.
Usage: python manage.py create_test_volunteers
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta
from apps.volunteers.models import Volunteer
import random


class Command(BaseCommand):
    help = 'Create test volunteer data for development'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=20,
            help='Number of volunteers to create (default: 20)'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing volunteers before creating new ones'
        )

    def handle(self, *args, **options):
        count = options['count']
        clear = options['clear']

        if clear:
            self.stdout.write('Clearing existing volunteers...')
            Volunteer.objects.all().delete()
            User.objects.filter(username__startswith='volunteer_').delete()

        self.stdout.write(f'Creating {count} test volunteers...')

        # Test data
        first_names = [
            'Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Mustafa', 'Emine', 'Ali', 'Hatice',
            'Hüseyin', 'Zeynep', 'İbrahim', 'Elif', 'Yusuf', 'Özlem', 'Ömer', 'Merve',
            'Murat', 'Seda', 'Emre', 'Burcu', 'Kemal', 'Deniz', 'Serkan', 'Pınar',
            'Burak', 'Gizem', 'Tolga', 'Cansu', 'Onur', 'Esra'
        ]

        last_names = [
            'Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Yıldırım', 'Öztürk',
            'Aydin', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara',
            'Koç', 'Kurt', 'Özkan', 'Şimşek', 'Erdoğan', 'Güneş', 'Akın', 'Polat',
            'Bulut', 'Güler', 'Türk', 'Acar', 'Korkmaz', 'Tunç'
        ]

        cities = [
            'istanbul', 'ankara', 'izmir', 'bursa', 'antalya', 'adana', 'konya', 'gaziantep',
            'mersin', 'diyarbakir', 'kayseri', 'eskisehir', 'samsun', 'denizli', 'sanliurfa',
            'trabzon', 'batman', 'balikesir', 'malatya', 'erzurum', 'van', 'aydin',
            'mardin', 'manisa', 'bolu', 'afyonkarahisar', 'kocaeli', 'tekirdag', 'elazığ'
        ]

        volunteer_types = ['toplama', 'tasima', 'dagitim', 'karma']

        created_count = 0
        for i in range(count):
            try:
                # Create Django User
                username = f'volunteer_{i+1:03d}'
                first_name = random.choice(first_names)
                last_name = random.choice(last_names)
                email = f'{username}@ayika.org'

                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password='testpass123',
                    first_name=first_name,
                    last_name=last_name,
                    is_active=True
                )

                # Create Volunteer with current date (September 2025)
                
                # Eylül 2025 tarih aralığı (1-21 Eylül arası)
                base_date = datetime(2025, 9, 1, tzinfo=timezone.get_current_timezone())
                random_days = random.randint(0, 20)  # 1-21 Eylül arası
                random_hours = random.randint(0, 23)
                random_minutes = random.randint(0, 59)
                
                created_date = base_date + timedelta(
                    days=random_days, 
                    hours=random_hours, 
                    minutes=random_minutes
                )
                
                volunteer = Volunteer.objects.create(
                    user=user,
                    ad=first_name,
                    soyad=last_name,
                    telefon=f'5{random.randint(100000000, 999999999)}',  # 5XXXXXXXXX format
                    sehir=random.choice(cities),
                    gonullu_tipi=random.choice(volunteer_types),
                    is_active=random.choice([True, True, True, False])  # 75% active
                )
                
                # Manuel olarak created_at tarihini güncelle
                volunteer.created_at = created_date
                volunteer.save(update_fields=['created_at'])

                created_count += 1
                
                if created_count % 5 == 0:
                    self.stdout.write(f'Created {created_count}/{count} volunteers...')

            except Exception as e:
                self.stderr.write(f'Error creating volunteer {i+1}: {e}')

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} test volunteers!')
        )

        # Print summary
        total_volunteers = Volunteer.objects.count()
        active_volunteers = Volunteer.objects.filter(is_active=True).count()
        
        self.stdout.write('\n--- Summary ---')
        self.stdout.write(f'Total volunteers in database: {total_volunteers}')
        self.stdout.write(f'Active volunteers: {active_volunteers}')
        self.stdout.write(f'Inactive volunteers: {total_volunteers - active_volunteers}')
        
        # Print volunteer type distribution
        self.stdout.write('\n--- Volunteer Type Distribution ---')
        for vtype in volunteer_types:
            count = Volunteer.objects.filter(gonullu_tipi=vtype, is_active=True).count()
            display_name = dict(Volunteer.GONULLU_TIPI_CHOICES)[vtype]
            self.stdout.write(f'{display_name}: {count}')
