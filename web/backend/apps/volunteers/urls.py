"""
Volunteers app URLs for Ayika project.
"""
from django.urls import path, include
from . import views

app_name = 'volunteers'

urlpatterns = [
    # Volunteer endpoints
    path('', views.volunteer_list, name='volunteer-list'),
    path('register/', views.volunteer_register, name='volunteer-register'),  # Public registration
    path('stats/', views.volunteer_stats, name='volunteer-stats'),
    path('<int:pk>/', views.volunteer_detail, name='volunteer-detail'),
    
    # Authentication endpoints
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/user/', views.user_info, name='user-info'),
    path('auth/status/', views.auth_status, name='auth-status'),
    path('auth/change-password/', views.change_password, name='change-password'),
    path('auth/deactivate/', views.deactivate_account, name='deactivate-account'),
    
    # Password reset endpoints
    path('auth/password-reset-request/', views.password_reset_request, name='password-reset-request'),
    path('auth/password-reset-verify/<str:uidb64>/<str:token>/', views.password_reset_verify, name='password-reset-verify'),
    path('auth/password-reset-confirm/<str:uidb64>/<str:token>/', views.password_reset_confirm, name='password-reset-confirm'),
]
