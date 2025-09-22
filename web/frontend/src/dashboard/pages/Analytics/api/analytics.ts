// Analytics API client for admin-only endpoints
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// HTTP Client with error handling and authentication
class AnalyticsApiClient {
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
}

const analyticsApiClient = new AnalyticsApiClient(API_BASE_URL);

// Volunteer Analytics
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
  return analyticsApiClient.get<VolunteerStats>('/volunteers/stats/');
}

// Cargo Analytics
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
  return analyticsApiClient.get<CargoStats>('/kargo/statistics/');
}

export interface WeightVolumeStats {
  toplam_agirlik: number;
  ortalama_agirlik: number;
  min_agirlik: number;
  max_agirlik: number;
  toplam_hacim: number;
  ortalama_hacim: number;
  min_hacim: number;
  max_hacim: number;
  toplam_miktar: number;
  ortalama_miktar: number;
}

export async function getWeightVolumeStats(): Promise<WeightVolumeStats> {
  return analyticsApiClient.get<WeightVolumeStats>('/kargo/weight-volume-stats/');
}

export interface CityStats {
  top_origins: Array<{
    cikis_yeri: string;
    display_name: string;
    count: number;
  }>;
  top_destinations: Array<{
    ulasacagi_yer: string;
    display_name: string;
    count: number;
  }>;
}

export async function getCityStats(): Promise<CityStats> {
  return analyticsApiClient.get<CityStats>('/kargo/city-stats/');
}

export interface VolunteerCargoStats {
  toplama_atanmis: number;
  tasima_atanmis: number;
  dagitim_atanmis: number;
  hic_atanmamis: number;
  top_toplama_gonulluleri: Array<{
    toplama_gonullusu__gonulluluk_no: string;
    toplama_gonullusu__ad: string;
    toplama_gonullusu__soyad: string;
    count: number;
  }>;
  top_tasima_gonulluleri: Array<{
    tasima_gonullusu__gonulluluk_no: string;
    tasima_gonullusu__ad: string;
    tasima_gonullusu__soyad: string;
    count: number;
  }>;
  top_dagitim_gonulluleri: Array<{
    dagitim_gonullusu__gonulluluk_no: string;
    dagitim_gonullusu__ad: string;
    dagitim_gonullusu__soyad: string;
    count: number;
  }>;
}

export async function getVolunteerCargoStats(): Promise<VolunteerCargoStats> {
  return analyticsApiClient.get<VolunteerCargoStats>('/kargo/volunteer-stats/');
}

export interface TimeBasedStats {
  period_days: number;
  total_in_period: number;
  daily_average: number;
  daily_distribution: Array<{
    date: string;
    count: number;
  }>;
}

export async function getTimeBasedStats(days: number = 30): Promise<TimeBasedStats> {
  return analyticsApiClient.get<TimeBasedStats>(`/kargo/time-based-stats/?days=${days}`);
}

// Combined analytics for dashboard overview
export interface DashboardStats {
  volunteers: VolunteerStats;
  cargo: CargoStats;
  weightVolume: WeightVolumeStats;
  cities: CityStats;
  volunteerCargo: VolunteerCargoStats;
  timeBased: TimeBasedStats;
}

export async function getDashboardStats(days: number = 30): Promise<DashboardStats> {
  try {
    const [volunteers, cargo, weightVolume, cities, volunteerCargo, timeBased] = await Promise.all([
      getVolunteerStats(),
      getCargoStats(),
      getWeightVolumeStats(),
      getCityStats(),
      getVolunteerCargoStats(),
      getTimeBasedStats(days),
    ]);

    return {
      volunteers,
      cargo,
      weightVolume,
      cities,
      volunteerCargo,
      timeBased,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}
