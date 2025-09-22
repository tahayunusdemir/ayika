// Authentication service for Ayika web application
const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_admin: boolean;
  volunteer_profile?: VolunteerProfile;
}

export interface VolunteerProfile {
  id: number;
  gonulluluk_no: string;
  ad: string;
  soyad: string;
  telefon: string;
  sehir: string;
  sehir_display: string;
  gonullu_tipi: string;
  gonullu_tipi_display: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  full_name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  ad: string;
  soyad: string;
  email: string;
  password: string;
  password_confirm: string;
  telefon: string;
  sehir: string;
  gonullu_tipi: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  errors?: Record<string, string[]>;
}

export interface AuthStatusResponse {
  authenticated: boolean;
  user: User | null;
}

class AuthService {
  private baseUrl = `${API_BASE_URL}/volunteers`;

  // Get CSRF token from cookie
  private getCsrfToken(): string | null {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // Fetch CSRF token from server
  private async fetchCsrfToken(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/auth/status/`, {
        method: 'GET',
        credentials: 'include',
      });
    } catch (error) {
      console.warn('Failed to fetch CSRF token:', error);
    }
  }

  // Get headers with CSRF token for POST requests
  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    let csrfToken = this.getCsrfToken();
    
    // If no CSRF token, try to fetch it
    if (!csrfToken) {
      await this.fetchCsrfToken();
      csrfToken = this.getCsrfToken();
    }

    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    return headers;
  }

  // Sign up new user
  async signUp(signUpData: SignUpData): Promise<AuthResponse> {
    try {
      // Use simple headers for registration (no CSRF token required)
      const response = await fetch(`${this.baseUrl}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify(signUpData),
      });

      const data: AuthResponse = await response.json();
      
      // Handle different response status codes
      if (!response.ok) {
        if (response.status === 400) {
          // Validation errors
          return data;
        } else if (response.status === 403) {
          return {
            success: false,
            message: 'Kayıt işlemi için yetki hatası. Lütfen tekrar deneyiniz.',
          };
        } else {
          return {
            success: false,
            message: 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyiniz.',
          };
        }
      }
      
      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        message: 'Kayıt sırasında bağlantı hatası oluştu. Lütfen tekrar deneyiniz.',
      };
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/auth/login/`, {
        method: 'POST',
        headers,
        credentials: 'include', // Include cookies for session
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse = await response.json();
      
      if (response.ok && data.success) {
        // Store user data in localStorage for persistence
        if (data.user) {
          localStorage.setItem('ayika_user', JSON.stringify(data.user));
        }
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Bağlantı hatası. Lütfen tekrar deneyiniz.',
      };
    }
  }

  // Logout user
  async logout(): Promise<AuthResponse> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/auth/logout/`, {
        method: 'POST',
        headers,
        credentials: 'include',
      });

      const data: AuthResponse = await response.json();
      
      if (response.ok && data.success) {
        // Clear stored user data
        localStorage.removeItem('ayika_user');
      }

      return data;
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, clear local storage
      localStorage.removeItem('ayika_user');
      return {
        success: true,
        message: 'Çıkış yapıldı.',
      };
    }
  }

  // Get current user info
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/user/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data: AuthResponse = await response.json();
      
      if (response.ok && data.success && data.user) {
        // Update stored user data
        localStorage.setItem('ayika_user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        message: 'Kullanıcı bilgileri alınamadı.',
      };
    }
  }

  // Check authentication status
  async checkAuthStatus(): Promise<AuthStatusResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/status/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data: AuthStatusResponse = await response.json();
      
      if (data.authenticated && data.user) {
        // Update stored user data
        localStorage.setItem('ayika_user', JSON.stringify(data.user));
      } else {
        // Clear stored user data if not authenticated
        localStorage.removeItem('ayika_user');
      }

      return data;
    } catch (error) {
      console.error('Check auth status error:', error);
      // Clear stored user data on error
      localStorage.removeItem('ayika_user');
      return {
        authenticated: false,
        user: null,
      };
    }
  }

  // Get stored user data
  getStoredUser(): User | null {
    try {
      const storedUser = localStorage.getItem('ayika_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('ayika_user');
      return null;
    }
  }

  // Check if user is authenticated (from localStorage)
  isAuthenticated(): boolean {
    return this.getStoredUser() !== null;
  }

  // Clear all authentication data
  clearAuthData(): void {
    localStorage.removeItem('ayika_user');
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/auth/change-password/`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Şifre değiştirme sırasında bir hata oluştu.',
      };
    }
  }

  // Deactivate account
  async deactivateAccount(): Promise<AuthResponse> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/auth/deactivate/`, {
        method: 'POST',
        headers,
        credentials: 'include',
      });

      const data: AuthResponse = await response.json();
      
      if (response.ok && data.success) {
        // Clear stored user data after deactivation
        localStorage.removeItem('ayika_user');
      }

      return data;
    } catch (error) {
      console.error('Deactivate account error:', error);
      return {
        success: false,
        message: 'Hesap deaktif etme sırasında bir hata oluştu.',
      };
    }
  }

  // Password reset request
  async passwordResetRequest(email: string): Promise<AuthResponse> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/auth/password-reset-request/`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        message: 'Şifre sıfırlama e-postası gönderilirken bir hata oluştu.',
      };
    }
  }

  // Password reset verify
  async passwordResetVerify(uidb64: string, token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/password-reset-verify/${uidb64}/${token}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Password reset verify error:', error);
      return {
        success: false,
        message: 'Token doğrulama sırasında bir hata oluştu.',
      };
    }
  }

  // Password reset confirm
  async passwordResetConfirm(uidb64: string, token: string, newPassword: string, confirmPassword: string): Promise<AuthResponse> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/auth/password-reset-confirm/${uidb64}/${token}/`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Password reset confirm error:', error);
      return {
        success: false,
        message: 'Şifre sıfırlama sırasında bir hata oluştu.',
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
