"""
Management command to create admin user for Ayika project.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction
from apps.volunteers.models import Volunteer


class Command(BaseCommand):
    help = 'Create admin user with volunteer profile for Ayika project'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            default='admin@ayika.org',
            help='Admin user email (default: admin@ayika.org)'
        )
        parser.add_argument(
            '--password',
            type=str,
            default='admin123',
            help='Admin user password (default: admin123)'
        )
        parser.add_argument(
            '--first-name',
            type=str,
            default='Admin',
            help='Admin user first name (default: Admin)'
        )
        parser.add_argument(
            '--last-name',
            type=str,
            default='User',
            help='Admin user last name (default: User)'
        )

    def handle(self, *args, **options):
        email = options['email']
        password = options['password']
        first_name = options['first_name']
        last_name = options['last_name']

        try:
            with transaction.atomic():
                # Check if admin user already exists
                if User.objects.filter(email=email).exists():
                    self.stdout.write(
                        self.style.WARNING(f'Admin user with email {email} already exists!')
                    )
                    return

                # Create admin user
                admin_user = User.objects.create_user(
                    username=f'admin_{email.split("@")[0]}',
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name,
                    is_staff=True,
                    is_superuser=True,
                    is_active=True
                )

                # Create volunteer profile for admin
                volunteer = Volunteer.objects.create(
                    user=admin_user,
                    ad=first_name,
                    soyad=last_name,
                    telefon='5551234567',  # Default admin phone
                    sehir='istanbul',
                    gonullu_tipi='karma',  # Admin can do all volunteer types
                    is_active=True
                )

                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Admin user created successfully!\n'
                        f'📧 Email: {email}\n'
                        f'🔑 Password: {password}\n'
                        f'👤 Name: {first_name} {last_name}\n'
                        f'🆔 Volunteer ID: {volunteer.gonulluluk_no}\n'
                        f'🏢 Admin Status: Staff & Superuser\n'
                        f'📍 City: İstanbul\n'
                        f'🎯 Volunteer Type: Karma (All types)\n'
                        f'\n'
                        f'You can now login to the admin panel at:\n'
                        f'🌐 http://localhost:8000/admin/\n'
                        f'🖥️  Frontend Dashboard: http://localhost:5173/\n'
                    )
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error creating admin user: {str(e)}')
            )
            raise
