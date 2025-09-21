from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Volunteer


class UserSerializer(serializers.ModelSerializer):
    """User serializer for authentication responses"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active']
        read_only_fields = ['id', 'username', 'is_active']


class VolunteerSerializer(serializers.ModelSerializer):
    """Volunteer serializer with user information"""
    user = UserSerializer(read_only=True)
    full_name = serializers.ReadOnlyField()
    gonullu_tipi_display = serializers.CharField(source='get_gonullu_tipi_display', read_only=True)
    sehir_display = serializers.CharField(source='get_sehir_display', read_only=True)
    
    class Meta:
        model = Volunteer
        fields = [
            'id',
            'user',
            'gonulluluk_no',
            'ad',
            'soyad', 
            'full_name',
            'telefon',
            'sehir',
            'sehir_display',
            'gonullu_tipi',
            'gonullu_tipi_display',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['gonulluluk_no', 'created_at', 'updated_at']


class VolunteerCreateSerializer(serializers.ModelSerializer):
    """Volunteer creation serializer"""
    
    class Meta:
        model = Volunteer
        fields = [
            'user',
            'ad',
            'soyad', 
            'telefon',
            'sehir',
            'gonullu_tipi',
            'is_active'
        ]


class LoginSerializer(serializers.Serializer):
    """Login request serializer"""
    email = serializers.EmailField(
        error_messages={
            'required': 'E-posta adresi gereklidir.',
            'invalid': 'Geçerli bir e-posta adresi giriniz.'
        }
    )
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={
            'required': 'Şifre gereklidir.',
            'min_length': 'Şifre en az 8 karakter olmalıdır.'
        }
    )


class AuthUserSerializer(serializers.ModelSerializer):
    """Authenticated user with volunteer profile"""
    volunteer_profile = VolunteerSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email', 
            'first_name', 
            'last_name', 
            'is_active',
            'volunteer_profile'
        ]
        read_only_fields = ['id', 'username', 'is_active']
