import { useState, useEffect, useMemo } from 'react';
import { Shipment, ShipmentFormData, ShipmentFilters } from '../types';

interface UseShipmentsReturn {
  shipments: Shipment[];
  filteredShipments: Shipment[];
  filters: ShipmentFilters;
  setFilters: (filters: ShipmentFilters) => void;
  addShipment: (formData: ShipmentFormData) => void;
  updateShipment: (id: string, formData: ShipmentFormData) => void;
  deleteShipment: (id: string) => void;
  getShipmentById: (id: string) => Shipment | undefined;
  loading: boolean;
  error: string | null;
}

export function useShipments(initialShipments: Shipment[] = []): UseShipmentsReturn {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ShipmentFilters>({
    searchTerm: '',
    statusFilter: '',
    cargoTypeFilter: '',
    cityFilter: '',
    securityFilter: '',
  });

  // Update shipments when initialShipments changes
  useEffect(() => {
    setShipments(initialShipments);
  }, [initialShipments]);

  // Generate tracking number
  const generateTrackingNumber = (): string => {
    const year = new Date().getFullYear();
    const nextId = shipments.length + 1;
    return `AYK-${year}${String(nextId).padStart(3, '0')}`;
  };

  // Add new shipment
  const addShipment = (formData: ShipmentFormData) => {
    try {
      setLoading(true);
      setError(null);

      const currentDateTime = new Date().toISOString().replace('T', ' ').slice(0, 19);
      
      const newShipment: Shipment = {
        id: Date.now().toString(),
        takip_no: generateTrackingNumber(),
        kargo_durumu: 'hazırlanıyor',
        gonderim_tarihi: currentDateTime,
        son_guncelleme_tarihi: currentDateTime,
        
        gonderici: {
          ad: formData.gonderici_ad,
          soyad: formData.gonderici_soyad,
          telefon: formData.gonderici_telefon,
          email: formData.gonderici_email,
          gizlilik_durumu: formData.gizlilik_durumu
        },
        
        icerik: {
          icerik_adi: formData.icerik_adi,
          kargo_tipi: formData.kargo_tipi,
          agirlik_hacim: formData.agirlik_hacim
        },
        
        konum: {
          sehir: formData.sehir
        },
        
        gorevliler: {
          yardim_toplama_gonullusu: {
            ad: formData.toplama_gonullusu_ad,
            soyad: formData.toplama_gonullusu_soyad,
            gonulluluk_no: formData.toplama_gonullusu_no
          },
          yardim_tasima_gorevlisi: formData.tasima_gorevlisi_ad ? {
            ad: formData.tasima_gorevlisi_ad,
            soyad: formData.tasima_gorevlisi_soyad || '',
            gonulluluk_no: formData.tasima_gorevlisi_no || ''
          } : undefined,
          yardim_dagitim_gorevlisi: formData.dagitim_gorevlisi_ad ? {
            ad: formData.dagitim_gorevlisi_ad,
            soyad: formData.dagitim_gorevlisi_soyad || '',
            gonulluluk_no: formData.dagitim_gorevlisi_no || ''
          } : undefined
        },
        
        durum_gecmisi: [
          {
            tarih: currentDateTime,
            aciklama: 'Kargo kaydı oluşturuldu'
          }
        ],
        
        guvenlik_onayi: formData.guvenlik_onayi,
        ozel_not: formData.ozel_not
      };

      setShipments(prev => [...prev, newShipment]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kargo eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Update existing shipment
  const updateShipment = (id: string, formData: ShipmentFormData) => {
    try {
      setLoading(true);
      setError(null);

      const currentDateTime = new Date().toISOString().replace('T', ' ').slice(0, 19);

      setShipments(prev => prev.map(shipment => {
        if (shipment.id === id) {
          return {
            ...shipment,
            son_guncelleme_tarihi: currentDateTime,
            
            gonderici: {
              ad: formData.gonderici_ad,
              soyad: formData.gonderici_soyad,
              telefon: formData.gonderici_telefon,
              email: formData.gonderici_email,
              gizlilik_durumu: formData.gizlilik_durumu
            },
            
            icerik: {
              icerik_adi: formData.icerik_adi,
              kargo_tipi: formData.kargo_tipi,
              agirlik_hacim: formData.agirlik_hacim
            },
            
            konum: {
              sehir: formData.sehir
            },
            
            gorevliler: {
              yardim_toplama_gonullusu: {
                ad: formData.toplama_gonullusu_ad,
                soyad: formData.toplama_gonullusu_soyad,
                gonulluluk_no: formData.toplama_gonullusu_no
              },
              yardim_tasima_gorevlisi: formData.tasima_gorevlisi_ad ? {
                ad: formData.tasima_gorevlisi_ad,
                soyad: formData.tasima_gorevlisi_soyad || '',
                gonulluluk_no: formData.tasima_gorevlisi_no || ''
              } : undefined,
              yardim_dagitim_gorevlisi: formData.dagitim_gorevlisi_ad ? {
                ad: formData.dagitim_gorevlisi_ad,
                soyad: formData.dagitim_gorevlisi_soyad || '',
                gonulluluk_no: formData.dagitim_gorevlisi_no || ''
              } : undefined
            },
            
            guvenlik_onayi: formData.guvenlik_onayi,
            ozel_not: formData.ozel_not,
            
            durum_gecmisi: [
              ...shipment.durum_gecmisi,
              {
                tarih: currentDateTime,
                aciklama: 'Kargo bilgileri güncellendi'
              }
            ]
          };
        }
        return shipment;
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kargo güncellenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Delete shipment
  const deleteShipment = (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setShipments(prev => prev.filter(shipment => shipment.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kargo silinirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Get shipment by ID
  const getShipmentById = (id: string): Shipment | undefined => {
    return shipments.find(shipment => shipment.id === id);
  };

  // Filter shipments based on current filters
  const filteredShipments = useMemo(() => {
    let filtered = [...shipments];

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(shipment => {
        const senderName = shipment.gonderici.gizlilik_durumu ? '' : `${shipment.gonderici.ad} ${shipment.gonderici.soyad}`;
        const volunteerName = `${shipment.gorevliler.yardim_toplama_gonullusu.ad} ${shipment.gorevliler.yardim_toplama_gonullusu.soyad}`;
        
        return shipment.takip_no.toLowerCase().includes(searchLower) ||
               volunteerName.toLowerCase().includes(searchLower) ||
               senderName.toLowerCase().includes(searchLower) ||
               shipment.icerik.icerik_adi.toLowerCase().includes(searchLower);
      });
    }

    // Status filter
    if (filters.statusFilter) {
      filtered = filtered.filter(shipment => shipment.kargo_durumu === filters.statusFilter);
    }


    // City filter
    if (filters.cityFilter) {
      filtered = filtered.filter(shipment => shipment.konum.sehir === filters.cityFilter);
    }

    // Cargo type filter
    if (filters.cargoTypeFilter) {
      filtered = filtered.filter(shipment => shipment.icerik.kargo_tipi === filters.cargoTypeFilter);
    }

    // Security filter
    if (filters.securityFilter) {
      filtered = filtered.filter(shipment => shipment.guvenlik_onayi === filters.securityFilter);
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
    loading,
    error,
  };
}
