"""
Cargo app URLs for Ayika project.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router setup
router = DefaultRouter()
router.register(r'kargo', views.KargoViewSet, basename='kargo')
router.register(r'cargo', views.CargoLegacyViewSet, basename='cargo-legacy')  # Legacy API

urlpatterns = [
    path('', include(router.urls)),  # Root level access only
]

app_name = 'cargo'
