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
    email = serializers.EmailField(source='user.email', read_only=True)
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
            'email',
            'telefon',
            'sehir',
            'sehir_display',
            'gonullu_tipi',
            'gonullu_tipi_display',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['gonulluluk_no', 'email', 'created_at', 'updated_at']


class VolunteerCreateSerializer(serializers.ModelSerializer):
    """Volunteer creation serializer with email and password support"""
    email = serializers.EmailField(write_only=True, required=True)
    password = serializers.CharField(
        write_only=True, 
        required=True,
        min_length=8,
        style={'input_type': 'password'},
        help_text='Şifre en az 8 karakter olmalıdır.'
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text='Şifre tekrarı'
    )
    
    class Meta:
        model = Volunteer
        fields = [
            'ad',
            'soyad', 
            'email',
            'password',
            'password_confirm',
            'telefon',
            'sehir',
            'gonullu_tipi',
            'is_active'
        ]
    
    def validate_email(self, value):
        """Validate email uniqueness"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Bu e-posta adresi zaten kullanılıyor.")
        return value
    
    def validate_password(self, value):
        """Validate password strength"""
        import re
        
        if len(value) < 8:
            raise serializers.ValidationError("Şifre en az 8 karakter olmalıdır.")
        
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Şifre en az bir küçük harf içermelidir.")
        
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Şifre en az bir büyük harf içermelidir.")
        
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Şifre en az bir rakam içermelidir.")
        
        if not re.search(r'[@$!%*?&]', value):
            raise serializers.ValidationError("Şifre en az bir özel işaret (@$!%*?&) içermelidir.")
        
        return value
    
    def validate(self, attrs):
        """Validate password confirmation"""
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')
        
        if password and password_confirm and password != password_confirm:
            raise serializers.ValidationError({
                'password_confirm': 'Şifreler eşleşmiyor.'
            })
        
        return attrs


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
    is_admin = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email', 
            'first_name', 
            'last_name', 
            'is_active',
            'is_staff',
            'is_superuser',
            'is_admin',
            'volunteer_profile'
        ]
        read_only_fields = ['id', 'username', 'is_active', 'is_staff', 'is_superuser']
    
    def get_is_admin(self, obj):
        """Check if user is admin (staff or superuser)"""
        return obj.is_staff or obj.is_superuser
