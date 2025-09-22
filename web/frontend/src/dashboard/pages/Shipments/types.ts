// Django backend ile uyumlu tipler
export type ShipmentStatus = 'hazirlaniyor' | 'yolda' | 'teslim_edildi' | 'iptal_edildi';
export type CargoType = 'gida' | 'ilac' | 'giyim' | 'karisik' | 'diger';

// Gönüllü detay bilgileri (backend'den gelen)
export interface VolunteerDetail {
  id: number;
  gonulluluk_no: string;
  full_name: string;
  telefon: string;
  sehir: string;
}

// Ana kargo interface'i - Django backend modeli ile uyumlu
export interface Shipment {
  id: number;
  kargo_no: string;
  
  // Gönderici bilgileri
  anonim_gonderici: boolean;
  gonderici_ad?: string;
  gonderici_soyad?: string;
  gonderici_telefon?: string;
  gonderici_email?: string;
  
  // Konum bilgileri
  cikis_yeri: string;
  cikis_yeri_display: string;
  ulasacagi_yer: string;
  ulasacagi_yer_display: string;
  
  // Kargo detayları
  agirlik: string; // DecimalField as string
  hacim: string; // DecimalField as string
  miktar: number;
  
  // Durum ve tip
  durum: ShipmentStatus;
  durum_display: string;
  kargo_tipi: CargoType;
  kargo_tipi_display: string;
  icerik: string;
  
  // Gönüllü bilgileri
  toplama_gonullusu?: number;
  toplama_gonullusu_detail?: VolunteerDetail;
  tasima_gonullusu?: number;
  tasima_gonullusu_detail?: VolunteerDetail;
  dagitim_gonullusu?: number;
  dagitim_gonullusu_detail?: VolunteerDetail;
  
  // Özel not
  ozel_not?: string;
  
  // Tarih bilgileri
  olusturulma_tarihi: string;
  son_degisiklik: string;
}

// Form data interface'i - Django backend ile uyumlu
export interface ShipmentFormData {
  // Gönderici bilgileri
  anonim_gonderici: boolean;
  gonderici_ad?: string;
  gonderici_soyad?: string;
  gonderici_telefon?: string;
  gonderici_email?: string;
  
  // Konum bilgileri
  cikis_yeri: string;
  ulasacagi_yer: string;
  
  // Kargo detayları
  agirlik: string;
  hacim: string;
  miktar: number;
  
  // Durum ve tip
  durum: ShipmentStatus;
  kargo_tipi: CargoType;
  icerik: string;
  
  // Gönüllü bilgileri (ID'ler) - Backend ForeignKey ile uyumlu
  toplama_gonullusu: number; // Toplama gönüllüsü zorunlu
  tasima_gonullusu?: number;
  dagitim_gonullusu?: number;
  
  // Özel not
  ozel_not?: string;
}

// Filtre interface'i
export interface ShipmentFilters {
  searchTerm: string;
  cargoTypeFilter: string;
  originCityFilter: string;
  destinationCityFilter: string;
  statusFilter: string;
}

// Şehir seçenekleri - Django backend ile uyumlu
export const SEHIR_CHOICES = [
  { value: 'adana', label: 'Adana' },
  { value: 'adiyaman', label: 'Adıyaman' },
  { value: 'afyonkarahisar', label: 'Afyonkarahisar' },
  { value: 'agri', label: 'Ağrı' },
  { value: 'aksaray', label: 'Aksaray' },
  { value: 'amasya', label: 'Amasya' },
  { value: 'ankara', label: 'Ankara' },
  { value: 'antalya', label: 'Antalya' },
  { value: 'ardahan', label: 'Ardahan' },
  { value: 'artvin', label: 'Artvin' },
  { value: 'aydin', label: 'Aydın' },
  { value: 'balikesir', label: 'Balıkesir' },
  { value: 'bartin', label: 'Bartın' },
  { value: 'batman', label: 'Batman' },
  { value: 'bayburt', label: 'Bayburt' },
  { value: 'bilecik', label: 'Bilecik' },
  { value: 'bingol', label: 'Bingöl' },
  { value: 'bitlis', label: 'Bitlis' },
  { value: 'bolu', label: 'Bolu' },
  { value: 'burdur', label: 'Burdur' },
  { value: 'bursa', label: 'Bursa' },
  { value: 'canakkale', label: 'Çanakkale' },
  { value: 'cankiri', label: 'Çankırı' },
  { value: 'corum', label: 'Çorum' },
  { value: 'denizli', label: 'Denizli' },
  { value: 'diyarbakir', label: 'Diyarbakır' },
  { value: 'duzce', label: 'Düzce' },
  { value: 'edirne', label: 'Edirne' },
  { value: 'elazig', label: 'Elazığ' },
  { value: 'erzincan', label: 'Erzincan' },
  { value: 'erzurum', label: 'Erzurum' },
  { value: 'eskisehir', label: 'Eskişehir' },
  { value: 'gaziantep', label: 'Gaziantep' },
  { value: 'giresun', label: 'Giresun' },
  { value: 'gumushane', label: 'Gümüşhane' },
  { value: 'hakkari', label: 'Hakkâri' },
  { value: 'hatay', label: 'Hatay' },
  { value: 'igdir', label: 'Iğdır' },
  { value: 'isparta', label: 'Isparta' },
  { value: 'istanbul', label: 'İstanbul' },
  { value: 'izmir', label: 'İzmir' },
  { value: 'kahramanmaras', label: 'Kahramanmaraş' },
  { value: 'karabuk', label: 'Karabük' },
  { value: 'karaman', label: 'Karaman' },
  { value: 'kars', label: 'Kars' },
  { value: 'kastamonu', label: 'Kastamonu' },
  { value: 'kayseri', label: 'Kayseri' },
  { value: 'kilis', label: 'Kilis' },
  { value: 'kirikkale', label: 'Kırıkkale' },
  { value: 'kirklareli', label: 'Kırklareli' },
  { value: 'kirsehir', label: 'Kırşehir' },
  { value: 'kocaeli', label: 'Kocaeli' },
  { value: 'konya', label: 'Konya' },
  { value: 'kutahya', label: 'Kütahya' },
  { value: 'malatya', label: 'Malatya' },
  { value: 'manisa', label: 'Manisa' },
  { value: 'mardin', label: 'Mardin' },
  { value: 'mersin', label: 'Mersin' },
  { value: 'mugla', label: 'Muğla' },
  { value: 'mus', label: 'Muş' },
  { value: 'nevsehir', label: 'Nevşehir' },
  { value: 'nigde', label: 'Niğde' },
  { value: 'ordu', label: 'Ordu' },
  { value: 'osmaniye', label: 'Osmaniye' },
  { value: 'rize', label: 'Rize' },
  { value: 'sakarya', label: 'Sakarya' },
  { value: 'samsun', label: 'Samsun' },
  { value: 'sanliurfa', label: 'Şanlıurfa' },
  { value: 'siirt', label: 'Siirt' },
  { value: 'sinop', label: 'Sinop' },
  { value: 'sirnak', label: 'Şırnak' },
  { value: 'sivas', label: 'Sivas' },
  { value: 'tekirdag', label: 'Tekirdağ' },
  { value: 'tokat', label: 'Tokat' },
  { value: 'trabzon', label: 'Trabzon' },
  { value: 'tunceli', label: 'Tunceli' },
  { value: 'usak', label: 'Uşak' },
  { value: 'van', label: 'Van' },
  { value: 'yalova', label: 'Yalova' },
  { value: 'yozgat', label: 'Yozgat' },
  { value: 'zonguldak', label: 'Zonguldak' }
];

// Kargo tipi seçenekleri
export const KARGO_TIPI_CHOICES = [
  { value: 'gida', label: 'Gıda' },
  { value: 'ilac', label: 'İlaç' },
  { value: 'giyim', label: 'Giyim' },
  { value: 'karisik', label: 'Karışık' },
  { value: 'diger', label: 'Diğer' }
];

// Durum seçenekleri - Gönüllü tipleri ile uyumlu renkler
export const DURUM_CHOICES = [
  { value: 'hazirlaniyor', label: 'Hazırlanıyor', color: 'primary' }, // Toplama gönüllüsü ile aynı
  { value: 'yolda', label: 'Yolda', color: 'secondary' }, // Taşıma gönüllüsü ile aynı
  { value: 'teslim_edildi', label: 'Teslim Edildi', color: 'success' }, // Dağıtım gönüllüsü ile aynı
  { value: 'iptal_edildi', label: 'İptal Edildi', color: 'error' }
];
