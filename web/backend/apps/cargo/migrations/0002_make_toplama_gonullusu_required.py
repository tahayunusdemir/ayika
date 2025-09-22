# Generated migration to make toplama_gonullusu required

from django.db import migrations, models
import django.db.models.deletion


def assign_default_volunteer_to_existing_cargo(apps, schema_editor):
    """Assign a default volunteer to existing cargo records that don't have one"""
    Kargo = apps.get_model('cargo', 'Kargo')
    Volunteer = apps.get_model('volunteers', 'Volunteer')
    
    # Find cargo records without toplama_gonullusu
    cargo_without_volunteer = Kargo.objects.filter(toplama_gonullusu__isnull=True)
    
    if cargo_without_volunteer.exists():
        # Try to find a suitable volunteer (toplama or karma type, active)
        default_volunteer = Volunteer.objects.filter(
            gonullu_tipi__in=['toplama', 'karma'],
            is_active=True
        ).first()
        
        if default_volunteer:
            # Assign the default volunteer to all cargo without one
            cargo_without_volunteer.update(toplama_gonullusu=default_volunteer)
            print(f"Assigned volunteer {default_volunteer.gonulluluk_no} to {cargo_without_volunteer.count()} cargo records")
        else:
            # If no suitable volunteer exists, we need to create one or handle this case
            print("Warning: No suitable volunteer found to assign to existing cargo records")
            print("Please ensure there is at least one active volunteer with 'toplama' or 'karma' type")


def reverse_assign_default_volunteer(apps, schema_editor):
    """Reverse operation - set toplama_gonullusu to null for records that were auto-assigned"""
    # This is optional - we could leave the assignments as they are
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('cargo', '0001_initial'),
        ('volunteers', '0001_initial'),
    ]

    operations = [
        # First, assign default volunteers to existing cargo records
        migrations.RunPython(
            assign_default_volunteer_to_existing_cargo,
            reverse_assign_default_volunteer,
        ),
        # Then, make the field required
        migrations.AlterField(
            model_name='kargo',
            name='toplama_gonullusu',
            field=models.ForeignKey(
                help_text='Toplama gönüllüsü seçimi zorunludur',
                limit_choices_to={'gonullu_tipi__in': ['toplama', 'karma'], 'is_active': True},
                on_delete=django.db.models.deletion.PROTECT,
                related_name='toplama_kargolari',
                to='volunteers.volunteer',
                verbose_name='Toplama Gönüllüsü'
            ),
        ),
    ]
