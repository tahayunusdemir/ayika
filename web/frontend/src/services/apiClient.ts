const API_BASE_URL = 'http://localhost:8000/api/v1';

// API response wrapper
interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  results?: T; // For paginated responses
  count?: number; // Total count for pagination
  next?: string; // Next page URL
  previous?: string; // Previous page URL
}

// Enhanced error types
interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

// HTTP client with enhanced error handling and admin authentication
class ApiClient {
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
      await fetch(`${API_BASE_URL}/volunteers/auth/status/`, {
        method: 'GET',
        credentials: 'include',
      });
    } catch (error) {
      console.warn('Failed to fetch CSRF token:', error);
    }
  }

  // Get headers with CSRF token and authentication
  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get headers with authentication
    const authHeaders = await this.getHeaders();

    const config: RequestInit = {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session authentication
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorData: any = {};
        
        try {
          errorData = await response.json();
        } catch (parseError) {
          // Failed to parse error response
        }
        
        // Handle specific error cases
        if (response.status === 403) {
          throw new Error('Bu işlem için yönetici yetkilerine sahip olmanız gerekiyor.');
        }
        
        if (response.status === 401) {
          throw new Error('Giriş yapmanız gerekiyor.');
        }

        // Enhanced error message with details
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        if (errorData) {
          if (typeof errorData === 'string') {
            errorMessage += ` - ${errorData}`;
          } else if (errorData.detail) {
            errorMessage += ` - ${errorData.detail}`;
          } else if (errorData.error) {
            errorMessage += ` - ${errorData.error}`;
          } else if (errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          } else {
            // Show field-specific errors
            const fieldErrors = [];
            for (const [field, errors] of Object.entries(errorData)) {
              if (Array.isArray(errors)) {
                fieldErrors.push(`${field}: ${errors.join(', ')}`);
              } else if (typeof errors === 'string') {
                fieldErrors.push(`${field}: ${errors}`);
              }
            }
            if (fieldErrors.length > 0) {
              errorMessage += ` - ${fieldErrors.join('; ')}`;
            }
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const networkError = new Error('Backend sunucusuna bağlanılamıyor. Sunucu çalışıyor mu kontrol edin.') as ApiError;
        networkError.code = 'NETWORK_ERROR';
        throw networkError;
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, ApiError };
export default apiClient;
