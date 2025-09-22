import { Shipment, ShipmentFormData } from '../types';

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
      await fetch(`${API_BASE_URL}/kargo/health/`, {
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

const apiClient = new ApiClient();

// Enhanced cargo API functions with better error handling
export const cargoApi = {
  // Get all cargo shipments
  async getShipments(): Promise<Shipment[]> {
    try {
      const response = await apiClient.get<ApiResponse<Shipment[]>>('/kargo/');
      
      // Handle different response formats
      if (Array.isArray(response)) {
        // Direct array response
        return response;
      } else if (response.data && Array.isArray(response.data)) {
        // Wrapped response
        return response.data;
      } else if (response.results && Array.isArray(response.results)) {
        // Paginated response
        return response.results;
      } else {
        // Unexpected response format
        return [];
      }
    } catch (error: any) {
      
      // Provide user-friendly error messages
      if (error.status === 404) {
        throw new Error('Kargo API endpoint\'i bulunamadı. Backend sunucusu çalışıyor mu kontrol edin.');
      } else if (error.status === 403) {
        throw new Error('Kargo listesine erişim izniniz yok. Giriş yapmanız gerekebilir.');
      } else if (error.code === 'NETWORK_ERROR') {
        throw error; // Pass through network errors as-is
      } else {
        throw new Error(`Kargo listesi yüklenirken hata oluştu: ${error.message}`);
      }
    }
  },

  // Get shipment by ID
  async getShipment(id: number): Promise<Shipment> {
    const response = await apiClient.get<ApiResponse<Shipment>>(`/kargo/${id}/`);
    if (!response.data) {
      throw new Error('Kargo bulunamadı');
    }
    return response.data;
  },

  // Create new shipment
  async createShipment(formData: ShipmentFormData): Promise<Shipment> {
    const response = await apiClient.post<Shipment>('/kargo/', formData);
    return response;
  },

  // Update shipment
  async updateShipment(id: number, formData: ShipmentFormData): Promise<Shipment> {
    const response = await apiClient.put<Shipment>(`/kargo/${id}/`, formData);
    // Handle direct response (not wrapped in ApiResponse)
    return response;
  },

  // Delete shipment
  async deleteShipment(id: number): Promise<void> {
    await apiClient.delete(`/kargo/${id}/`);
  },

  // Update shipment status
  async updateShipmentStatus(id: number, status: string): Promise<Shipment> {
    const response = await apiClient.patch<ApiResponse<Shipment>>(
      `/kargo/${id}/update_status/`,
      { durum: status }
    );
    if (!response.data) {
      throw new Error('Kargo durumu güncellenemedi');
    }
    return response.data;
  },

  // Track shipment by cargo number
  async trackShipment(cargoNo: string): Promise<Shipment> {
    const response = await apiClient.get<ApiResponse<Shipment>>(
      `/kargo/track/?kargo_no=${cargoNo}`
    );
    if (!response.data) {
      throw new Error('Kargo bulunamadı');
    }
    return response.data;
  },

  // Get cargo statistics
  async getStatistics(): Promise<Record<string, number>> {
    const response = await apiClient.get<ApiResponse<Record<string, number>>>(
      '/kargo/statistics/'
    );
    return response.data || {};
  },

  // Get shipments by volunteer
  async getShipmentsByVolunteer(volunteerId: number): Promise<Shipment[]> {
    const response = await apiClient.get<ApiResponse<Shipment[]>>(
      `/kargo/by_volunteer/?volunteer_id=${volunteerId}`
    );
    return response.data || [];
  },

  // Search and filter shipments
  async searchShipments(params: {
    search?: string;
    durum?: string;
    kargo_tipi?: string;
    cikis_yeri?: string;
    ulasacagi_yer?: string;
    anonim_gonderici?: boolean;
    ordering?: string;
  }): Promise<Shipment[]> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/kargo/?${queryString}` : '/kargo/';
    
    const response = await apiClient.get<ApiResponse<Shipment[]>>(endpoint);
    return response.data || [];
  },

  // API Health check
  async healthCheck(): Promise<any> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/kargo/health/');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Volunteers API functions (for dropdowns)
export const volunteersApi = {
  // Get active volunteers by type
  async getVolunteersByType(type: 'toplama' | 'tasima' | 'dagitim' | 'karma'): Promise<any[]> {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>(`/volunteers/?gonullu_tipi=${type}&is_active=true`);
      return response.data || response.results || [];
    } catch (error: any) {
      if (error.message.includes('yönetici yetkilerine sahip olmanız gerekiyor')) {
        // Return empty array for non-admin users instead of throwing error
        console.warn('Admin access required for volunteers API');
        return [];
      }
      throw error;
    }
  },

  // Get all active volunteers
  async getActiveVolunteers(): Promise<any[]> {
    try {
      const response = await apiClient.get<any>('/volunteers/?is_active=true');
      
      // Handle different response structures
      if (Array.isArray(response)) {
        return response;
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.results && Array.isArray(response.results)) {
        return response.results;
      } else {
        return [];
      }
    } catch (error: any) {
      if (error.message.includes('yönetici yetkilerine sahip olmanız gerekiyor')) {
        // Return empty array for non-admin users instead of throwing error
        console.warn('Admin access required for volunteers API');
        return [];
      }
      throw error;
    }
  },

  // Get volunteer by ID
  async getVolunteerById(id: number): Promise<any> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/volunteers/${id}/`);
      return response.data;
    } catch (error: any) {
      if (error.message.includes('yönetici yetkilerine sahip olmanız gerekiyor')) {
        console.warn('Admin access required for volunteers API');
        return null;
      }
      throw error;
    }
  },

  // Search volunteers by volunteer number or name
  async searchVolunteers(query: string): Promise<any[]> {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>(`/volunteers/?search=${encodeURIComponent(query)}`);
      return response.data || response.results || [];
    } catch (error: any) {
      if (error.message.includes('yönetici yetkilerine sahip olmanız gerekiyor')) {
        console.warn('Admin access required for volunteers API');
        return [];
      }
      return [];
    }
  },

  // Search volunteers by volunteer number specifically
  async searchByVolunteerNumber(volunteerNumber: string): Promise<any[]> {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>(`/volunteers/?gonulluluk_no=${encodeURIComponent(volunteerNumber)}`);
      return response.data || response.results || [];
    } catch (error: any) {
      if (error.message.includes('yönetici yetkilerine sahip olmanız gerekiyor')) {
        console.warn('Admin access required for volunteers API');
        return [];
      }
      return [];
    }
  }
};

export default apiClient;
