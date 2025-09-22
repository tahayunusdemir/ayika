import { apiClient } from '../../../../services/apiClient';

export interface CargoStats {
  general: {
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
  };
  weightVolume: {
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
  };
  cities: {
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
  };
  volunteers: {
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
  };
  timeBased: {
    period_days: number;
    total_in_period: number;
    daily_average: number;
    daily_distribution: Array<{
      date: string;
      count: number;
    }>;
  };
}

export interface CargoStatusData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface CargoTypeData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface CityFlowData {
  city: string;
  outgoing: number;
  incoming: number;
}

export interface WeightVolumeData {
  metric: string;
  value: number;
  unit: string;
}

export interface VolunteerAssignmentData {
  type: string;
  assigned: number;
  total: number;
  percentage: number;
}

class CargoStatsService {
  private baseUrl = '/kargo';

  async getGeneralStats(): Promise<CargoStats['general']> {
    try {
      const response = await apiClient.get<{ success: boolean; data: CargoStats['general'] }>(`${this.baseUrl}/statistics/`);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching cargo general stats:', error);
      throw error;
    }
  }

  async getWeightVolumeStats(): Promise<CargoStats['weightVolume']> {
    try {
      const response = await apiClient.get<{ success: boolean; data: CargoStats['weightVolume'] }>(`${this.baseUrl}/weight-volume-stats/`);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching weight/volume stats:', error);
      throw error;
    }
  }

  async getCityStats(): Promise<CargoStats['cities']> {
    try {
      const response = await apiClient.get<{ success: boolean; data: CargoStats['cities'] }>(`${this.baseUrl}/city-stats/`);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching city stats:', error);
      throw error;
    }
  }

  async getVolunteerStats(): Promise<CargoStats['volunteers']> {
    try {
      const response = await apiClient.get<{ success: boolean; data: CargoStats['volunteers'] }>(`${this.baseUrl}/volunteer-stats/`);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching volunteer stats:', error);
      throw error;
    }
  }

  async getTimeBasedStats(days: number = 30): Promise<CargoStats['timeBased']> {
    try {
      const response = await apiClient.get<{ success: boolean; data: CargoStats['timeBased'] }>(`${this.baseUrl}/time-based-stats/?days=${days}`);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching time-based stats:', error);
      throw error;
    }
  }

  // Processed data methods for charts - Gönüllü tipleri ile uyumlu renkler
  getCargoStatusData(generalStats: CargoStats['general']): CargoStatusData[] {
    return [
      {
        name: 'Hazırlanıyor',
        value: generalStats.durum_hazirlaniyor.count,
        percentage: generalStats.durum_hazirlaniyor.percentage,
        color: '#1976d2' // Primary - Toplama gönüllüsü ile aynı
      },
      {
        name: 'Yolda',
        value: generalStats.durum_yolda.count,
        percentage: generalStats.durum_yolda.percentage,
        color: '#9c27b0' // Secondary - Taşıma gönüllüsü ile aynı
      },
      {
        name: 'Teslim Edildi',
        value: generalStats.durum_teslim_edildi.count,
        percentage: generalStats.durum_teslim_edildi.percentage,
        color: '#4caf50' // Success - Dağıtım gönüllüsü ile aynı
      },
      {
        name: 'İptal Edildi',
        value: generalStats.durum_iptal_edildi.count,
        percentage: generalStats.durum_iptal_edildi.percentage,
        color: '#f44336' // Error - değişmedi
      }
    ];
  }

  getCargoTypeData(generalStats: CargoStats['general']): CargoTypeData[] {
    return [
      {
        name: 'Gıda',
        value: generalStats.tip_gida.count,
        percentage: generalStats.tip_gida.percentage,
        color: '#4caf50'
      },
      {
        name: 'İlaç',
        value: generalStats.tip_ilac.count,
        percentage: generalStats.tip_ilac.percentage,
        color: '#f44336'
      },
      {
        name: 'Giyim',
        value: generalStats.tip_giyim.count,
        percentage: generalStats.tip_giyim.percentage,
        color: '#9c27b0'
      },
      {
        name: 'Karışık',
        value: generalStats.tip_karisik.count,
        percentage: generalStats.tip_karisik.percentage,
        color: '#ff9800'
      },
      {
        name: 'Diğer',
        value: generalStats.tip_diger.count,
        percentage: generalStats.tip_diger.percentage,
        color: '#607d8b'
      }
    ];
  }

  getCityFlowData(cityStats: CargoStats['cities']): CityFlowData[] {
    // Combine origin and destination data
    const cityMap = new Map<string, CityFlowData>();

    cityStats.top_origins.forEach(origin => {
      const existing = cityMap.get(origin.display_name) || { city: origin.display_name, outgoing: 0, incoming: 0 };
      existing.outgoing = origin.count;
      cityMap.set(origin.display_name, existing);
    });

    cityStats.top_destinations.forEach(dest => {
      const existing = cityMap.get(dest.display_name) || { city: dest.display_name, outgoing: 0, incoming: 0 };
      existing.incoming = dest.count;
      cityMap.set(dest.display_name, existing);
    });

    return Array.from(cityMap.values()).slice(0, 8);
  }

  getVolunteerAssignmentData(volunteerStats: CargoStats['volunteers']): VolunteerAssignmentData[] {
    const total = volunteerStats.toplama_atanmis + volunteerStats.tasima_atanmis + volunteerStats.dagitim_atanmis + volunteerStats.hic_atanmamis;
    
    return [
      {
        type: 'Toplama',
        assigned: volunteerStats.toplama_atanmis,
        total,
        percentage: (volunteerStats.toplama_atanmis / total) * 100
      },
      {
        type: 'Taşıma',
        assigned: volunteerStats.tasima_atanmis,
        total,
        percentage: (volunteerStats.tasima_atanmis / total) * 100
      },
      {
        type: 'Dağıtım',
        assigned: volunteerStats.dagitim_atanmis,
        total,
        percentage: (volunteerStats.dagitim_atanmis / total) * 100
      }
    ];
  }
}

export const cargoStatsService = new CargoStatsService();
