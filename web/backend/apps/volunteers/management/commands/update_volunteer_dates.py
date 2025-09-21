"""
Django management command to update volunteer created_at dates to September 2025
Usage: python manage.py update_volunteer_dates
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from apps.volunteers.models import Volunteer
import random


class Command(BaseCommand):
    help = 'Update volunteer created_at dates to September 2025'

    def add_arguments(self, parser):
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirm the update operation'
        )

    def handle(self, *args, **options):
        if not options['confirm']:
            self.stdout.write(
                self.style.WARNING(
                    'This will update ALL volunteer created_at dates to September 2025.\n'
                    'Use --confirm flag to proceed.'
                )
            )
            return

        self.stdout.write('Updating volunteer created_at dates to September 2025...')
        
        # Get all volunteers
        volunteers = Volunteer.objects.all()
        total_count = volunteers.count()
        
        if total_count == 0:
            self.stdout.write('No volunteers found in database.')
            return
        
        self.stdout.write(f'Found {total_count} volunteers to update.')
        
        # Eylül 2025 tarih aralığı (1-21 Eylül arası)
        base_date = datetime(2025, 9, 1, tzinfo=timezone.get_current_timezone())
        
        updated_count = 0
        for volunteer in volunteers:
            try:
                # Her gönüllü için rastgele bir tarih oluştur (1-21 Eylül arası)
                random_days = random.randint(0, 20)  # 1-21 Eylül arası
                random_hours = random.randint(0, 23)
                random_minutes = random.randint(0, 59)
                
                new_created_date = base_date + timedelta(
                    days=random_days, 
                    hours=random_hours, 
                    minutes=random_minutes
                )
                
                # Tarihi güncelle
                volunteer.created_at = new_created_date
                volunteer.save(update_fields=['created_at'])
                
                updated_count += 1
                
                if updated_count % 10 == 0:
                    self.stdout.write(f'Updated {updated_count}/{total_count} volunteers...')
                    
            except Exception as e:
                self.stderr.write(f'Error updating volunteer {volunteer.gonulluluk_no}: {e}')
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {updated_count} volunteers!')
        )
        
        # Verification
        self.stdout.write('\n--- Verification ---')
        september_volunteers = Volunteer.objects.filter(
            created_at__year=2025,
            created_at__month=9
        ).count()
        
        self.stdout.write(f'Volunteers with September 2025 dates: {september_volunteers}')
        
        # Show date range
        if Volunteer.objects.exists():
            earliest = Volunteer.objects.earliest('created_at')
            latest = Volunteer.objects.latest('created_at')
            
            self.stdout.write(f'Earliest volunteer date: {earliest.created_at}')
            self.stdout.write(f'Latest volunteer date: {latest.created_at}')
