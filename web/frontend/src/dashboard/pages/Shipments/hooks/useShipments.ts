import { useState, useEffect, useMemo, useCallback } from 'react';
import { Shipment, ShipmentFormData, ShipmentFilters } from '../types';
import { cargoApi } from '../data/apiService';

interface UseShipmentsReturn {
  shipments: Shipment[];
  filteredShipments: Shipment[];
  filters: ShipmentFilters;
  setFilters: (filters: ShipmentFilters) => void;
  addShipment: (formData: ShipmentFormData) => Promise<void>;
  updateShipment: (id: number, formData: ShipmentFormData) => Promise<void>;
  deleteShipment: (id: number) => Promise<void>;
  getShipmentById: (id: number) => Shipment | undefined;
  refreshShipments: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useShipments(): UseShipmentsReturn {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ShipmentFilters>({
    searchTerm: '',
    cargoTypeFilter: '',
    originCityFilter: '',
    destinationCityFilter: '',
    statusFilter: '',
  });

  // Load shipments from API
  const loadShipments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await cargoApi.getShipments();
      setShipments(data);
    } catch (err: any) {
      let errorMessage = 'Kargolar yüklenirken hata oluştu';
      
      if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Backend sunucusuna bağlanılamıyor. Lütfen sunucunun çalıştığından emin olun.';
      } else if (err.status === 404) {
        errorMessage = 'Kargo API endpoint\'i bulunamadı. URL yapılandırması kontrol edilmeli.';
      } else if (err.status === 403) {
        errorMessage = 'Kargo verilerine erişim izniniz yok. Giriş yapmanız gerekebilir.';
      } else if (err.status === 500) {
        errorMessage = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  // Add new shipment
  const addShipment = async (formData: ShipmentFormData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const newShipment = await cargoApi.createShipment(formData);
      setShipments(prev => [...prev, newShipment]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kargo eklenirken hata oluştu';
      setError(errorMessage);
      throw err; // Re-throw to allow component to handle
    } finally {
      setLoading(false);
    }
  };

  // Update existing shipment
  const updateShipment = async (id: number, formData: ShipmentFormData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedShipment = await cargoApi.updateShipment(id, formData);
      setShipments(prev => prev.map(shipment => 
        shipment.id === id ? updatedShipment : shipment
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kargo güncellenirken hata oluştu';
      setError(errorMessage);
      throw err; // Re-throw to allow component to handle
    } finally {
      setLoading(false);
    }
  };

  // Delete shipment
  const deleteShipment = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await cargoApi.deleteShipment(id);
      setShipments(prev => prev.filter(shipment => shipment.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kargo silinirken hata oluştu';
      setError(errorMessage);
      throw err; // Re-throw to allow component to handle
    } finally {
      setLoading(false);
    }
  };

  // Get shipment by ID
  const getShipmentById = (id: number): Shipment | undefined => {
    return shipments.find(shipment => shipment.id === id);
  };

  // Filter shipments based on current filters
  const filteredShipments = useMemo(() => {
    let filtered = [...shipments];

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(shipment => {
        const senderName = shipment.anonim_gonderici ? '' : `${shipment.gonderici_ad || ''} ${shipment.gonderici_soyad || ''}`;
        const volunteerName = shipment.toplama_gonullusu_detail?.full_name || '';
        
        return shipment.kargo_no.toLowerCase().includes(searchLower) ||
               volunteerName.toLowerCase().includes(searchLower) ||
               senderName.toLowerCase().includes(searchLower) ||
               shipment.icerik.toLowerCase().includes(searchLower);
      });
    }

    // Status filter
    if (filters.statusFilter) {
      filtered = filtered.filter(shipment => shipment.durum === filters.statusFilter);
    }

    // Origin city filter
    if (filters.originCityFilter) {
      filtered = filtered.filter(shipment => 
        shipment.cikis_yeri === filters.originCityFilter
      );
    }

    // Destination city filter
    if (filters.destinationCityFilter) {
      filtered = filtered.filter(shipment => 
        shipment.ulasacagi_yer === filters.destinationCityFilter
      );
    }

    // Cargo type filter
    if (filters.cargoTypeFilter) {
      filtered = filtered.filter(shipment => shipment.kargo_tipi === filters.cargoTypeFilter);
    }

    return filtered;
  }, [shipments, filters]);

  return {
    shipments,
    filteredShipments,
    filters,
    setFilters,
    addShipment,
    updateShipment,
    deleteShipment,
    getShipmentById,
    refreshShipments: loadShipments,
    loading,
    error,
  };
}
