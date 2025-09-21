// Temel tipler
export interface City {
  id: string;
  name: string;
  plateCode: string;
}

export type ShipmentStatus = 'hazırlanıyor' | 'yolda' | 'teslim edildi' | 'iptal edildi';
export type CargoType = 'gıda' | 'ilaç' | 'giyim' | 'karışık' | 'diğer';
export type SecurityApproval = 'kontrol edildi' | 'kontrol edilmedi';

// Gönderici bilgileri
export interface Sender {
  ad: string;
  soyad: string;
  telefon?: string; // anonim değilse zorunlu
  email?: string;
  gizlilik_durumu: boolean; // anonim mi?
}

// İçerik bilgileri
export interface Content {
  icerik_adi: string; // emojisiz
  kargo_tipi: CargoType;
  agirlik_hacim?: string | number;
}

// Konum bilgileri
export interface Location {
  sehir: string;
}

// Görevli bilgileri
export interface Volunteer {
  ad: string;
  soyad: string;
  gonulluluk_no: string;
}

export interface Volunteers {
  yardim_toplama_gonullusu: Volunteer;
  yardim_tasima_gorevlisi?: Volunteer;
  yardim_dagitim_gorevlisi?: Volunteer;
}

// Durum geçmişi
export interface StatusHistory {
  tarih: string; // YYYY-MM-DD HH:MM:SS
  aciklama: string;
}

// Ana kargo interface'i
export interface Shipment {
  id: string;
  takip_no: string; // benzersiz kimlik numarası
  kargo_durumu: ShipmentStatus;
  gonderim_tarihi: string; // YYYY-MM-DD HH:MM:SS
  son_guncelleme_tarihi: string; // YYYY-MM-DD HH:MM:SS
  
  gonderici: Sender;
  icerik: Content;
  konum: Location;
  gorevliler: Volunteers;
  
  durum_gecmisi: StatusHistory[];
  guvenlik_onayi: SecurityApproval;
  ozel_not?: string;
}

// Form data interface'i
export interface ShipmentFormData {
  // Gönderici bilgileri
  gonderici_ad: string;
  gonderici_soyad: string;
  gonderici_telefon?: string;
  gonderici_email?: string;
  gizlilik_durumu: boolean;
  
  // İçerik bilgileri
  icerik_adi: string;
  kargo_tipi: CargoType;
  agirlik_hacim?: string;
  
  // Konum bilgileri
  sehir: string;
  
  // Görevli bilgileri
  toplama_gonullusu_ad: string;
  toplama_gonullusu_soyad: string;
  toplama_gonullusu_no: string;
  tasima_gorevlisi_ad?: string;
  tasima_gorevlisi_soyad?: string;
  tasima_gorevlisi_no?: string;
  dagitim_gorevlisi_ad?: string;
  dagitim_gorevlisi_soyad?: string;
  dagitim_gorevlisi_no?: string;
  
  // Kargo durumu
  kargo_durumu: ShipmentStatus;
  
  // Diğer
  guvenlik_onayi: SecurityApproval;
  ozel_not?: string;
}

// Filtre interface'i
export interface ShipmentFilters {
  searchTerm: string;
  statusFilter: string;
  cargoTypeFilter: string;
  cityFilter: string;
  securityFilter: string;
}
