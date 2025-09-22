import type { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import type { Volunteer } from '../data/volunteers';

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
      await fetch(`${this.baseURL}/volunteers/auth/status/`, {
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

interface VolunteerListParams {
  page?: number;
  page_size?: number;
  search?: string;
  gonullu_tipi?: string;
  sehir?: string;
  is_active?: boolean;
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
}): VolunteerListParams {
  const params: VolunteerListParams = {
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
        case 'gonullu_tipi':
          params.gonullu_tipi = value;
          break;
        case 'sehir':
          params.sehir = value;
          break;
        case 'is_active':
          params.is_active = value;
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
}): Promise<{ items: Volunteer[]; itemCount: number }> {
  const params = convertDataGridParams({ paginationModel, sortModel, filterModel });
  
  const queryString = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const response = await apiClient.get<PaginatedResponse<Volunteer>>(
    `/volunteers/?${queryString}`
  );

  return {
    items: response.results,
    itemCount: response.count,
  };
}

export async function getOne(volunteerId: number): Promise<Volunteer> {
  return apiClient.get<Volunteer>(`/volunteers/${volunteerId}/`);
}

export async function createOne(data: Omit<Volunteer, 'id' | 'user' | 'updated_at'>): Promise<Volunteer> {
  return apiClient.post<Volunteer>('/volunteers/', data);
}

export async function updateOne(
  volunteerId: number, 
  data: Partial<Pick<Volunteer, 'is_active'>>
): Promise<Volunteer> {
  // Only allow updating is_active field
  const updateData = { is_active: data.is_active };
  return apiClient.patch<Volunteer>(`/volunteers/${volunteerId}/`, updateData);
}

// Analytics API Functions
export interface VolunteerStats {
  total: number;
  active: number;
  inactive: number;
  by_type: {
    toplama: number;
    tasima: number;
    dagitim: number;
    karma: number;
  };
  by_city: Array<{
    city: string;
    count: number;
  }>;
  monthly_registrations: Array<{
    month: string;
    count: number;
  }>;
}

export async function getVolunteerStats(): Promise<VolunteerStats> {
  return apiClient.get<VolunteerStats>('/volunteers/stats/');
}
