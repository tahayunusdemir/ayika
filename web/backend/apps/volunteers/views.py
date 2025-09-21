"""
Volunteers views for Ayika project.
"""
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response


class VolunteerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing volunteers.
    """
    # queryset = Volunteer.objects.all()
    # serializer_class = VolunteerSerializer
    
    def list(self, request):
        return Response({'message': 'Volunteers list - Coming soon'})
    
    def create(self, request):
        return Response({'message': 'Create volunteer - Coming soon'})
    
    def retrieve(self, request, pk=None):
        return Response({'message': f'Volunteer {pk} details - Coming soon'})
    
    def update(self, request, pk=None):
        return Response({'message': f'Update volunteer {pk} - Coming soon'})
    
    def destroy(self, request, pk=None):
        return Response({'message': f'Delete volunteer {pk} - Coming soon'})
