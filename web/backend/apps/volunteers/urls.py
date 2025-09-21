"""
Volunteers app URLs for Ayika project.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'volunteers'

router = DefaultRouter()
router.register(r'', views.VolunteerViewSet, basename='volunteer')

urlpatterns = [
    path('', include(router.urls)),
]
