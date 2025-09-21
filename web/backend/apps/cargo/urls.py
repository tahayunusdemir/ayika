"""
Cargo app URLs for Ayika project.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'cargo'

router = DefaultRouter()
router.register(r'', views.CargoViewSet, basename='cargo')

urlpatterns = [
    path('', include(router.urls)),
    path('track/<str:tracking_number>/', views.track_cargo, name='track-cargo'),
]
