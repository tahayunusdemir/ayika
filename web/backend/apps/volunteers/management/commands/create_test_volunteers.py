"""
Django management command to create test volunteer data.
Usage: python manage.py create_test_volunteers
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction
from apps.volunteers.models import Volunteer
import random
import uuid


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

        # Clear existing data if requested
        if clear:
            self.stdout.write('Clearing existing volunteers...')
            with transaction.atomic():
                Volunteer.objects.all().delete()
                User.objects.filter(username__startswith='volunteer_').delete()
            self.stdout.write(self.style.SUCCESS('Cleared existing volunteers.'))

        # Check how many volunteers already exist
        existing_count = Volunteer.objects.count()
        if existing_count > 0 and not clear:
            self.stdout.write(f'Found {existing_count} existing volunteers in database.')
            self.stdout.write('Skipping volunteer creation as data already exists.')
            return

        self.stdout.write(f'Creating up to {count} test volunteers...')

        # Test data
        first_names = [
            'Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Mustafa', 'Emine', 'Ali', 'Hatice',
            'Hüseyin', 'Zeynep', 'İbrahim', 'Elif', 'Yusuf', 'Özlem', 'Ömer', 'Merve',
            'Murat', 'Seda', 'Emre', 'Burcu', 'Kemal', 'Deniz', 'Serkan', 'Pınar',
            'Burak', 'Gizem', 'Tolga', 'Cansu', 'Onur', 'Esra', 'Caner', 'Selin',
            'Kaan', 'Ece', 'Barış', 'Duygu', 'Cem', 'Nihan', 'Tuncay', 'Sibel'
        ]

        last_names = [
            'Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Yıldırım', 'Öztürk',
            'Aydin', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara',
            'Koç', 'Kurt', 'Özkan', 'Şimşek', 'Erdoğan', 'Güneş', 'Akın', 'Polat',
            'Bulut', 'Güler', 'Türk', 'Acar', 'Korkmaz', 'Tunç', 'Başak', 'Çakır',
            'Eryılmaz', 'Gündoğdu', 'Kaplan', 'Özgür', 'Soylu', 'Tekin'
        ]

        cities = [
            'istanbul', 'ankara', 'izmir', 'bursa', 'antalya', 'adana', 'konya', 'gaziantep',
            'mersin', 'diyarbakir', 'kayseri', 'eskisehir', 'samsun', 'denizli', 'sanliurfa',
            'trabzon', 'batman', 'balikesir', 'malatya', 'erzurum', 'van', 'aydin',
            'mardin', 'manisa', 'bolu', 'afyonkarahisar', 'kocaeli', 'tekirdag', 'elazığ',
            'sakarya', 'hatay', 'mugla', 'canakkale', 'rize'
        ]

        volunteer_types = ['toplama', 'tasima', 'dagitim', 'karma']

        created_count = 0
        skipped_count = 0
        error_count = 0

        for i in range(count):
            try:
                # Generate unique username
                username = self._generate_unique_username(i + 1)
                
                # Check if user already exists
                if User.objects.filter(username=username).exists():
                    skipped_count += 1
                    continue

                first_name = random.choice(first_names)
                last_name = random.choice(last_names)
                email = f'{username}@ayika.org'

                # Create user and volunteer in a transaction
                with transaction.atomic():
                    # Create Django User with email
                    user = User.objects.create_user(
                        username=username,
                        email=email,
                        first_name=first_name,
                        last_name=last_name,
                        is_active=True
                    )

                    # Create Volunteer
                    volunteer = Volunteer.objects.create(
                        user=user,
                        ad=first_name,
                        soyad=last_name,
                        telefon=f'{random.randint(5000000000, 5999999999)}',  # 5XXXXXXXXX format
                        sehir=random.choice(cities),
                        gonullu_tipi=random.choice(volunteer_types),
                        is_active=random.choice([True, True, True, False])  # 75% active
                    )

                created_count += 1
                
                if created_count % 5 == 0:
                    self.stdout.write(f'Created {created_count} volunteers...')

            except Exception as e:
                error_count += 1
                self.stderr.write(f'Error creating volunteer {i+1}: {e}')

        # Print results
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} test volunteers!')
        )
        
        if skipped_count > 0:
            self.stdout.write(f'Skipped {skipped_count} existing volunteers.')
        
        if error_count > 0:
            self.stdout.write(
                self.style.WARNING(f'Failed to create {error_count} volunteers.')
            )

        # Print summary
        total_volunteers = Volunteer.objects.count()
        active_volunteers = Volunteer.objects.filter(is_active=True).count()
        
        self.stdout.write('\n--- Summary ---')
        self.stdout.write(f'Total volunteers in database: {total_volunteers}')
        self.stdout.write(f'Active volunteers: {active_volunteers}')
        self.stdout.write(f'Inactive volunteers: {total_volunteers - active_volunteers}')

    def _generate_unique_username(self, index):
        """Generate a unique username for a volunteer."""
        base_username = f'volunteer_{index:03d}'
        
        # If username doesn't exist, return it
        if not User.objects.filter(username=base_username).exists():
            return base_username
        
        # Find the next available username
        counter = 1
        while True:
            username = f'volunteer_{index:03d}_{counter}'
            if not User.objects.filter(username=username).exists():
                return username
            counter += 1
            
            # Prevent infinite loop
            if counter > 1000:
                return f'volunteer_{uuid.uuid4().hex[:8]}'
