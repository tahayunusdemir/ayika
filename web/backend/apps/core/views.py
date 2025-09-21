"""
Core views for Ayika project.
"""
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse


@api_view(['GET'])
def api_root(request):
    """
    Ayika API root endpoint.
    """
    return Response({
        'message': 'Ayika API - Acil Yardım ve İhtiyaç Koordinasyon Ağı',
        'version': '1.0.0',
        'endpoints': {
            'volunteers': '/api/v1/volunteers/',
            'cargo': '/api/v1/cargo/',
            'health': '/api/v1/health/',
            'admin': '/admin/',
        }
    })


@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint for monitoring.
    """
    return Response({
        'status': 'healthy',
        'message': 'Ayika Backend is running successfully',
        'timestamp': request.build_absolute_uri(),
    }, status=status.HTTP_200_OK)
