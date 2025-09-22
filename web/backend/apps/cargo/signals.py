from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import Kargo


@receiver(pre_save, sender=Kargo)
def clear_sender_info_if_anonymous(sender, instance, **kwargs):
    """Anonim gönderici seçildiğinde gönderici bilgilerini temizle"""
    if instance.anonim_gonderici:
        instance.gonderici_ad = None
        instance.gonderici_soyad = None
        instance.gonderici_telefon = None
        instance.gonderici_email = None


@receiver(pre_save, sender=Kargo)
def store_old_status(sender, instance, **kwargs):
    """Eski durumu sakla (durum değişikliği takibi için)"""
    if instance.pk:
        try:
            old_instance = Kargo.objects.get(pk=instance.pk)
            instance._old_durum = old_instance.durum
            instance._old_anonim_gonderici = old_instance.anonim_gonderici
        except Kargo.DoesNotExist:
            instance._old_durum = None
            instance._old_anonim_gonderici = None


@receiver(post_save, sender=Kargo)
def log_status_change(sender, instance, created, **kwargs):
    """Durum değişikliklerini logla"""
    if not created and hasattr(instance, '_old_durum'):
        # Durum değişikliği kontrolü
        if instance._old_durum and instance._old_durum != instance.durum:
            print(f"Kargo {instance.kargo_no} durumu değişti: {instance._old_durum} -> {instance.durum}")
        
        # Anonim gönderici değişikliği kontrolü
        if hasattr(instance, '_old_anonim_gonderici') and instance._old_anonim_gonderici != instance.anonim_gonderici:
            status = "anonim" if instance.anonim_gonderici else "gönderici bilgili"
            print(f"Kargo {instance.kargo_no} gönderici durumu değişti: {status}")
    elif created:
        print(f"Yeni kargo oluşturuldu: {instance.kargo_no} - {instance.get_durum_display()}")


@receiver(pre_save, sender=Kargo)
def validate_volunteer_assignments(sender, instance, **kwargs):
    """Gönüllü atamalarını doğrula"""
    # Toplama gönüllüsü kontrolü
    if instance.toplama_gonullusu:
        if instance.toplama_gonullusu.gonullu_tipi not in ['toplama', 'karma']:
            raise ValueError("Toplama gönüllüsü sadece 'toplama' veya 'karma' tipli olabilir")
        if not instance.toplama_gonullusu.is_active:
            raise ValueError("Seçilen toplama gönüllüsü aktif değil")
    
    # Taşıma gönüllüsü kontrolü
    if instance.tasima_gonullusu:
        if instance.tasima_gonullusu.gonullu_tipi not in ['tasima', 'karma']:
            raise ValueError("Taşıma gönüllüsü sadece 'tasima' veya 'karma' tipli olabilir")
        if not instance.tasima_gonullusu.is_active:
            raise ValueError("Seçilen taşıma gönüllüsü aktif değil")
    
    # Dağıtım gönüllüsü kontrolü
    if instance.dagitim_gonullusu:
        if instance.dagitim_gonullusu.gonullu_tipi not in ['dagitim', 'karma']:
            raise ValueError("Dağıtım gönüllüsü sadece 'dagitim' veya 'karma' tipli olabilir")
        if not instance.dagitim_gonullusu.is_active:
            raise ValueError("Seçilen dağıtım gönüllüsü aktif değil")
