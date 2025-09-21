"""
Cargo views for Ayika project.
"""
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response


class CargoViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing cargo.
    """
    # queryset = Cargo.objects.all()
    # serializer_class = CargoSerializer
    
    def list(self, request):
        return Response({'message': 'Cargo list - Coming soon'})
    
    def create(self, request):
        return Response({'message': 'Create cargo - Coming soon'})
    
    def retrieve(self, request, pk=None):
        return Response({'message': f'Cargo {pk} details - Coming soon'})
    
    def update(self, request, pk=None):
        return Response({'message': f'Update cargo {pk} - Coming soon'})
    
    def destroy(self, request, pk=None):
        return Response({'message': f'Delete cargo {pk} - Coming soon'})


@api_view(['GET'])
def track_cargo(request, tracking_number):
    """
    Track cargo by tracking number.
    """
    return Response({
        'tracking_number': tracking_number,
        'status': 'Tracking functionality - Coming soon',
        'message': f'Tracking cargo: {tracking_number}'
    })
