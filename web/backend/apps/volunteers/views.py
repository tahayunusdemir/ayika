"""
Volunteers views for Ayika project.
"""
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, BasePermission
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


class IsAdminOrReadOnly(BasePermission):
    """
    Custom permission to only allow admin users to edit objects.
    Regular users can only read.
    """
    def has_permission(self, request, view):
        # Read permissions are allowed to any authenticated user
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user and request.user.is_authenticated
        
        # Write permissions are only allowed to admin users
        return request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)


class IsStaffOrSuperuser(BasePermission):
    """
    Custom permission to only allow staff or superuser access.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)


from rest_framework.pagination import PageNumberPagination
from django.core.paginator import Paginator
from django.db.models import Q, Count
from rest_framework import serializers
import re
from .models import Volunteer
from .serializers import (
    VolunteerSerializer, 
    VolunteerCreateSerializer,
    LoginSerializer, 
    AuthUserSerializer,
    UserSerializer
)

# Create your views here.

@api_view(['GET', 'POST'])
@permission_classes([IsStaffOrSuperuser])  # Only admin users can access volunteer list
def volunteer_list(request):
    """
    List all volunteers with pagination, filtering, and search.
    Admin-only volunteer creation.
    """
    if request.method == 'POST':
        return create_volunteer(request)
    
    # GET method - existing list logic
    # Get query parameters
    page = int(request.GET.get('page', 1))
    page_size = int(request.GET.get('page_size', 25))
    search = request.GET.get('search', '')
    gonullu_tipi = request.GET.get('gonullu_tipi', '')
    sehir = request.GET.get('sehir', '')
    is_active_param = request.GET.get('is_active', '')
    ordering = request.GET.get('ordering', '-created_at')
    
    # Start with base queryset (show all volunteers)
    queryset = Volunteer.objects.all()
    
    # Apply is_active filter only if specified
    if is_active_param:
        is_active = is_active_param.lower() == 'true'
        queryset = queryset.filter(is_active=is_active)
    
    # Apply search filter
    if search:
        queryset = queryset.filter(
            Q(ad__icontains=search) |
            Q(soyad__icontains=search) |
            Q(gonulluluk_no__icontains=search) |
            Q(telefon__icontains=search)
        )
    
    # Apply filters
    if gonullu_tipi:
        queryset = queryset.filter(gonullu_tipi=gonullu_tipi)
    
    if sehir:
        queryset = queryset.filter(sehir=sehir)
    
    # Apply ordering
    if ordering:
        # Handle negative ordering (descending)
        if ordering.startswith('-'):
            field = ordering[1:]
            if hasattr(Volunteer, field):
                queryset = queryset.order_by(ordering)
        else:
            if hasattr(Volunteer, ordering):
                queryset = queryset.order_by(ordering)
    
    # Pagination
    paginator = Paginator(queryset, page_size)
    page_obj = paginator.get_page(page)
    
    # Serialize data
    serializer = VolunteerSerializer(page_obj.object_list, many=True)
    
    # Build pagination URLs
    request_url = request.build_absolute_uri().split('?')[0]
    next_url = None
    previous_url = None
    
    if page_obj.has_next():
        next_params = request.GET.copy()
        next_params['page'] = page_obj.next_page_number()
        next_url = f"{request_url}?{next_params.urlencode()}"
    
    if page_obj.has_previous():
        prev_params = request.GET.copy()
        prev_params['page'] = page_obj.previous_page_number()
        previous_url = f"{request_url}?{prev_params.urlencode()}"
    
    return Response({
        'count': paginator.count,
        'next': next_url,
        'previous': previous_url,
        'results': serializer.data
    })


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to register as volunteer
def volunteer_register(request):
    """
    Public volunteer registration endpoint.
    Anyone can register as a volunteer without authentication.
    """
    return create_volunteer(request)


def create_volunteer(request):
    """
    Create a new volunteer with associated Django User and password.
    """
    try:
        # Use the serializer for validation
        serializer = VolunteerCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            # Extract validated data
            validated_data = serializer.validated_data
            email = validated_data.pop('email')
            password = validated_data.pop('password')
            validated_data.pop('password_confirm')  # Remove password_confirm, not needed for creation
            
            # Generate unique username from name and phone
            ad = validated_data['ad']
            soyad = validated_data['soyad']
            telefon = validated_data['telefon']
            
            base_username = f"{ad.lower()}{soyad.lower()}{telefon[-4:]}"
            username = base_username
            counter = 1
            
            # Ensure username is unique
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            # Create Django User with email and password
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,  # This will hash the password automatically
                first_name=ad,
                last_name=soyad,
                is_active=True
            )
            
            # Create volunteer and link to user
            volunteer = Volunteer.objects.create(
                user=user,
                **validated_data
            )
            
            return Response({
                'success': True,
                'message': 'Gönüllü kaydınız başarıyla tamamlandı! Artık giriş yapabilirsiniz.',
                'volunteer': VolunteerSerializer(volunteer).data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'success': False,
                'message': 'Kayıt bilgilerinde hata var.',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            'success': False,
            'message': 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyiniz.',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PATCH'])
@permission_classes([IsStaffOrSuperuser])  # Only admin users can access volunteer details
def volunteer_detail(request, pk):
    """
    Retrieve, update or delete a volunteer instance.
    """
    try:
        volunteer = Volunteer.objects.get(pk=pk)
    except Volunteer.DoesNotExist:
        return Response({
            'error': 'Gönüllü bulunamadı.'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = VolunteerSerializer(volunteer)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        # Only allow updating is_active field
        allowed_fields = {'is_active'}
        update_data = {k: v for k, v in request.data.items() if k in allowed_fields}
        
        if not update_data:
            return Response({
                'error': 'Sadece is_active alanı güncellenebilir.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = VolunteerSerializer(volunteer, data=update_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsStaffOrSuperuser])  # Only admin users can access volunteer stats
def volunteer_stats(request):
    """
    Get volunteer statistics for analytics dashboard.
    """
    try:
        # Total counts
        total_volunteers = Volunteer.objects.count()
        active_volunteers = Volunteer.objects.filter(is_active=True).count()
        inactive_volunteers = total_volunteers - active_volunteers
        
        # Count by volunteer type
        type_stats = Volunteer.objects.values('gonullu_tipi').annotate(
            count=Count('gonullu_tipi')
        ).order_by('gonullu_tipi')
        
        by_type = {
            'toplama': 0,
            'tasima': 0,
            'dagitim': 0,
            'karma': 0
        }
        
        for stat in type_stats:
            if stat['gonullu_tipi'] in by_type:
                by_type[stat['gonullu_tipi']] = stat['count']
        
        # Count by city (top cities)
        city_stats = Volunteer.objects.values('sehir').annotate(
            count=Count('sehir')
        ).order_by('-count')[:15]  # Top 15 cities
        
        by_city = [
            {
                'city': stat['sehir'],
                'count': stat['count']
            }
            for stat in city_stats
        ]
        
        # Monthly registration trends (last 12 months)
        from django.db.models.functions import TruncMonth
        from datetime import datetime, timedelta
        
        # Get last 12 months
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        
        monthly_stats = Volunteer.objects.filter(
            created_at__gte=start_date,
            created_at__lte=end_date
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            count=Count('id')
        ).order_by('month')
        
        # Create monthly data with Turkish month names
        monthly_data = []
        month_names = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
        
        # Generate last 12 months
        for i in range(12):
            date = end_date - timedelta(days=30*i)
            month_name = f"{month_names[date.month-1]} {date.year}"
            
            # Find count for this month
            count = 0
            for stat in monthly_stats:
                if stat['month'] and stat['month'].year == date.year and stat['month'].month == date.month:
                    count = stat['count']
                    break
            
            monthly_data.insert(0, {
                'month': month_name,
                'count': count
            })
        
        return Response({
            'total': total_volunteers,
            'active': active_volunteers,
            'inactive': inactive_volunteers,
            'by_type': by_type,
            'by_city': by_city,
            'monthly_registrations': monthly_data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'İstatistikler alınırken hata oluştu.',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Authentication Views

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    User login endpoint
    """
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Geçersiz veri.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    
    try:
        # Find user by email
        user = User.objects.get(email=email, is_active=True)
        
        # Authenticate with username (Django default)
        authenticated_user = authenticate(
            request, 
            username=user.username, 
            password=password
        )
        
        if authenticated_user:
            login(request, authenticated_user)
            
            # Get user with volunteer profile
            user_serializer = AuthUserSerializer(authenticated_user)
            
            return Response({
                'success': True,
                'message': 'Giriş başarılı.',
                'user': user_serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': 'E-posta veya şifre hatalı.'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.'
        }, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({
            'success': False,
            'message': 'Giriş sırasında bir hata oluştu.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    User logout endpoint
    """
    try:
        logout(request)
        return Response({
            'success': True,
            'message': 'Çıkış başarılı.'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'success': False,
            'message': 'Çıkış sırasında bir hata oluştu.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    """
    Get current authenticated user information
    """
    try:
        user_serializer = AuthUserSerializer(request.user)
        return Response({
            'success': True,
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'success': False,
            'message': 'Kullanıcı bilgileri alınırken hata oluştu.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def auth_status(request):
    """
    Check authentication status
    """
    if request.user.is_authenticated:
        user_serializer = AuthUserSerializer(request.user)
        return Response({
            'authenticated': True,
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'authenticated': False,
            'user': None
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Change user password endpoint
    """
    try:
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not current_password or not new_password:
            return Response({
                'success': False,
                'message': 'Mevcut şifre ve yeni şifre gereklidir.',
                'errors': {
                    'current_password': ['Mevcut şifre gereklidir.'] if not current_password else [],
                    'new_password': ['Yeni şifre gereklidir.'] if not new_password else []
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check current password
        if not request.user.check_password(current_password):
            return Response({
                'success': False,
                'message': 'Mevcut şifre yanlış.',
                'errors': {
                    'current_password': ['Mevcut şifre yanlış.']
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        request.user.set_password(new_password)
        request.user.save()
        
        return Response({
            'success': True,
            'message': 'Şifre başarıyla değiştirildi.'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': 'Şifre değiştirme sırasında bir hata oluştu.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deactivate_account(request):
    """
    Deactivate user account endpoint
    """
    try:
        # Deactivate user account
        request.user.is_active = False
        request.user.save()
        
        # Deactivate volunteer profile if exists
        if hasattr(request.user, 'volunteer_profile'):
            request.user.volunteer_profile.is_active = False
            request.user.volunteer_profile.save()
        
        return Response({
            'success': True,
            'message': 'Hesap başarıyla deaktif edildi.'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': 'Hesap deaktif etme sırasında bir hata oluştu.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Password Reset Views

# Password validation is now handled by VolunteerCreateSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    """
    Send password reset email to user
    """
    try:
        email = request.data.get('email', '').strip().lower()
        
        if not email:
            return Response({
                'success': False,
                'message': 'E-posta adresi gereklidir.',
                'errors': {
                    'email': ['E-posta adresi gereklidir.']
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate email format
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            return Response({
                'success': False,
                'message': 'Geçerli bir e-posta adresi giriniz.',
                'errors': {
                    'email': ['Geçerli bir e-posta adresi giriniz.']
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email, is_active=True)
        except User.DoesNotExist:
            # For security, don't reveal if email exists or not
            return Response({
                'success': True,
                'message': 'Eğer bu e-posta adresi sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.'
            }, status=status.HTTP_200_OK)
        
        # Generate password reset token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Create reset URL
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        reset_url = f"{frontend_url}/password-reset/{uid}/{token}/"
        
        # Prepare email content
        context = {
            'user': user,
            'reset_url': reset_url,
            'site_name': 'Ayika',
        }
        
        # Send email
        subject = 'Ayika - Şifre Sıfırlama'
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #1976d2;">Ayika - Şifre Sıfırlama</h2>
                <p>Merhaba {user.first_name or user.username},</p>
                <p>Hesabınız için şifre sıfırlama talebinde bulundunuz. Yeni şifrenizi oluşturmak için aşağıdaki bağlantıya tıklayın:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_url}" style="background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Şifremi Sıfırla</a>
                </div>
                <p>Bu bağlantı 24 saat boyunca geçerlidir. Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
                <p>Güvenliğiniz için, bu bağlantıyı kimseyle paylaşmayın.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="font-size: 12px; color: #666;">Bu e-posta Ayika sistemi tarafından otomatik olarak gönderilmiştir.</p>
            </div>
        </body>
        </html>
        """
        
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject=subject,
            message=plain_message,
            html_message=html_message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@ayika.org'),
            recipient_list=[email],
            fail_silently=False,
        )
        
        return Response({
            'success': True,
            'message': 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Password reset request error: {e}")
        return Response({
            'success': False,
            'message': 'Şifre sıfırlama e-postası gönderilirken bir hata oluştu.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def password_reset_verify(request, uidb64, token):
    """
    Verify password reset token
    """
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid, is_active=True)
        
        if default_token_generator.check_token(user, token):
            return Response({
                'success': True,
                'message': 'Token geçerli.',
                'user_email': user.email
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': 'Geçersiz veya süresi dolmuş bağlantı.'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({
            'success': False,
            'message': 'Geçersiz bağlantı.'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'success': False,
            'message': 'Token doğrulama sırasında bir hata oluştu.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request, uidb64, token):
    """
    Confirm password reset with new password
    """
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid, is_active=True)
        
        if not default_token_generator.check_token(user, token):
            return Response({
                'success': False,
                'message': 'Geçersiz veya süresi dolmuş bağlantı.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        new_password = request.data.get('new_password', '')
        confirm_password = request.data.get('confirm_password', '')
        
        if not new_password or not confirm_password:
            return Response({
                'success': False,
                'message': 'Yeni şifre ve şifre tekrarı gereklidir.',
                'errors': {
                    'new_password': ['Yeni şifre gereklidir.'] if not new_password else [],
                    'confirm_password': ['Şifre tekrarı gereklidir.'] if not confirm_password else []
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if new_password != confirm_password:
            return Response({
                'success': False,
                'message': 'Şifreler eşleşmiyor.',
                'errors': {
                    'confirm_password': ['Şifreler eşleşmiyor.']
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate password strength using serializer logic
        from .serializers import VolunteerCreateSerializer
        temp_serializer = VolunteerCreateSerializer()
        try:
            temp_serializer.validate_password(new_password)
        except serializers.ValidationError as e:
            return Response({
                'success': False,
                'message': 'Şifre güvenlik gereksinimlerini karşılamıyor.',
                'errors': {
                    'new_password': [str(e)]
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        return Response({
            'success': True,
            'message': 'Şifreniz başarıyla değiştirildi. Artık yeni şifrenizle giriş yapabilirsiniz.'
        }, status=status.HTTP_200_OK)
        
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({
            'success': False,
            'message': 'Geçersiz bağlantı.'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"Password reset confirm error: {e}")
        return Response({
            'success': False,
            'message': 'Şifre sıfırlama sırasında bir hata oluştu.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
