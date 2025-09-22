import type { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import type { Shipment } from '../types';

// API Base URL - Django backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// HTTP Client with error handling and authentication
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

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
      await fetch(`${this.baseURL}/kargo/health/`, {
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
    const url = `${this.baseURL}${endpoint}`;
    
    // Get headers with authentication
    const authHeaders = await this.getHeaders();
    
    const config: RequestInit = {
      headers: {
        ...authHeaders,
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session authentication
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle specific error cases
        if (response.status === 403) {
          throw new Error('Bu işlem için yönetici yetkilerine sahip olmanız gerekiyor.');
        }
        
        if (response.status === 401) {
          throw new Error('Giriş yapmanız gerekiyor.');
        }
        
        throw new Error(
          errorData.message || 
          errorData.detail || 
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
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

const apiClient = new ApiClient(API_BASE_URL);

// API Response Types
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface ShipmentListParams {
  page?: number;
  page_size?: number;
  search?: string;
  durum?: string;
  kargo_tipi?: string;
  cikis_yeri?: string;
  ulasacagi_yer?: string;
  anonim_gonderici?: boolean;
  ordering?: string;
}

// Convert MUI DataGrid params to Django API params
function convertDataGridParams({
  paginationModel,
  sortModel,
  filterModel,
}: {
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  filterModel: GridFilterModel;
}): ShipmentListParams {
  const params: ShipmentListParams = {
    page: paginationModel.page + 1, // Django uses 1-based pagination
    page_size: paginationModel.pageSize,
  };

  // Handle sorting
  if (sortModel.length > 0) {
    const { field, sort } = sortModel[0];
    params.ordering = sort === 'desc' ? `-${field}` : field;
  }

  // Handle filtering
  if (filterModel.items.length > 0) {
    filterModel.items.forEach(({ field, value, operator }) => {
      if (!field || value == null) return;

      switch (field) {
        case 'durum':
          params.durum = value;
          break;
        case 'kargo_tipi':
          params.kargo_tipi = value;
          break;
        case 'cikis_yeri':
          params.cikis_yeri = value;
          break;
        case 'ulasacagi_yer':
          params.ulasacagi_yer = value;
          break;
        case 'anonim_gonderici':
          params.anonim_gonderici = value;
          break;
        default:
          // For text fields, use search
          if (operator === 'contains' && typeof value === 'string') {
            params.search = value;
          }
      }
    });
  }

  return params;
}

// API Functions
export async function getMany({
  paginationModel,
  sortModel,
  filterModel,
}: {
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  filterModel: GridFilterModel;
}): Promise<{ items: Shipment[]; itemCount: number }> {
  const params = convertDataGridParams({ paginationModel, sortModel, filterModel });
  
  const queryString = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const response = await apiClient.get<PaginatedResponse<Shipment>>(
    `/kargo/?${queryString}`
  );

  return {
    items: response.results,
    itemCount: response.count,
  };
}

export async function getOne(shipmentId: number): Promise<Shipment> {
  return apiClient.get<Shipment>(`/kargo/${shipmentId}/`);
}

export async function createOne(data: Omit<Shipment, 'id' | 'olusturulma_tarihi' | 'son_degisiklik'>): Promise<Shipment> {
  return apiClient.post<Shipment>('/kargo/', data);
}

export async function updateOne(
  shipmentId: number, 
  data: Partial<Shipment>
): Promise<Shipment> {
  return apiClient.patch<Shipment>(`/kargo/${shipmentId}/`, data);
}

export async function deleteOne(shipmentId: number): Promise<void> {
  return apiClient.delete<void>(`/kargo/${shipmentId}/`);
}

// Cargo tracking API (public endpoint)
export async function trackCargo(cargoNumber: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/kargo/track/?kargo_no=${cargoNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Kargo takibi sırasında hata oluştu');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

// Analytics API Functions
export interface CargoStats {
  toplam_kargo: number;
  anonim_gonderici: number;
  gonderici_bilgili: number;
  durum_hazirlaniyor: { count: number; percentage: number; name: string };
  durum_yolda: { count: number; percentage: number; name: string };
  durum_teslim_edildi: { count: number; percentage: number; name: string };
  durum_iptal_edildi: { count: number; percentage: number; name: string };
  tip_gida: { count: number; percentage: number; name: string };
  tip_ilac: { count: number; percentage: number; name: string };
  tip_giyim: { count: number; percentage: number; name: string };
  tip_karisik: { count: number; percentage: number; name: string };
  tip_diger: { count: number; percentage: number; name: string };
}

export async function getCargoStats(): Promise<CargoStats> {
  return apiClient.get<CargoStats>('/kargo/statistics/');
}

export async function getWeightVolumeStats(): Promise<any> {
  return apiClient.get<any>('/kargo/weight-volume-stats/');
}

export async function getCityStats(): Promise<any> {
  return apiClient.get<any>('/kargo/city-stats/');
}

export async function getVolunteerStats(): Promise<any> {
  return apiClient.get<any>('/kargo/volunteer-stats/');
}

export async function getTimeBasedStats(days: number = 30): Promise<any> {
  return apiClient.get<any>(`/kargo/time-based-stats/?days=${days}`);
}
