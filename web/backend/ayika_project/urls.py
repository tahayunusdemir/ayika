"""
URL configuration for Ayika project.

Ayika - Acil Yardım ve İhtiyaç Koordinasyon Ağı
Emergency Aid and Needs Coordination Network
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('apps.core.urls')),
    path('api/v1/volunteers/', include('apps.volunteers.urls')),
    path('api/v1/', include('apps.cargo.urls')),  # Changed to include cargo directly under api/v1/
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
