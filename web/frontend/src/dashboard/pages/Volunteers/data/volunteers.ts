export type VolunteerType = 'toplama' | 'tasima' | 'dagitim' | 'karma';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

export interface Volunteer {
  id: number;
  user?: User; // Django User integration (optional for frontend)
  gonulluluk_no: string; // Auto-generated G + 10 digits
  ad: string; // First name (matches Django field)
  soyad: string; // Last name (matches Django field)
  full_name?: string; // Combined name from backend (read-only)
  email: string; // Email address (required for creation, read-only after)
  telefon: string; // Phone without leading 0 (5XXXXXXXXX)
  sehir: string; // City (lowercase, matches Django choices)
  sehir_display?: string; // City display name from backend (read-only)
  gonullu_tipi: VolunteerType; // Volunteer type (matches Django field)
  gonullu_tipi_display?: string; // Volunteer type display name from backend (read-only)
  is_active: boolean; // Active status
  created_at: string; // Creation date (matches Django field - auto-assigned)
  updated_at: string; // Update date (matches Django field)
}

// Legacy interface for backward compatibility during transition
export interface LegacyVolunteer {
  id: number;
  gonulluluk_no: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  city: string;
  joinDate: string;
  volunteerType: VolunteerType;
}

// Turkish cities matching Django SEHIR_CHOICES (lowercase)
export const TURKISH_CITIES = [
  'adana', 'adiyaman', 'afyonkarahisar', 'agri', 'amasya', 'ankara', 'antalya',
  'artvin', 'aydin', 'balikesir', 'bilecik', 'bingol', 'bitlis', 'bolu',
  'burdur', 'bursa', 'canakkale', 'cankiri', 'corum', 'denizli', 'diyarbakir',
  'edirne', 'elazig', 'erzincan', 'erzurum', 'eskisehir', 'gaziantep', 'giresun',
  'gumushane', 'hakkari', 'hatay', 'isparta', 'mersin', 'istanbul', 'izmir',
  'kars', 'kastamonu', 'kayseri', 'kirklareli', 'kirsehir', 'kocaeli', 'konya',
  'kutahya', 'malatya', 'manisa', 'kahramanmaras', 'mardin', 'mugla', 'mus',
  'nevsehir', 'nigde', 'ordu', 'rize', 'sakarya', 'samsun', 'siirt', 'sinop',
  'sivas', 'tekirdag', 'tokat', 'trabzon', 'tunceli', 'sanliurfa', 'usak',
  'van', 'yozgat', 'zonguldak', 'aksaray', 'bayburt', 'karaman', 'kirikkale',
  'batman', 'sirnak', 'bartin', 'ardahan', 'igdir', 'yalova', 'karabuk', 'kilis',
  'osmaniye', 'duzce'
];

// City display names (capitalized for UI)
export const CITY_DISPLAY_NAMES: Record<string, string> = {
  'adana': 'Adana', 'adiyaman': 'Adıyaman', 'afyonkarahisar': 'Afyonkarahisar', 
  'agri': 'Ağrı', 'amasya': 'Amasya', 'ankara': 'Ankara', 'antalya': 'Antalya',
  'artvin': 'Artvin', 'aydin': 'Aydın', 'balikesir': 'Balıkesir', 'bilecik': 'Bilecik',
  'bingol': 'Bingöl', 'bitlis': 'Bitlis', 'bolu': 'Bolu', 'burdur': 'Burdur',
  'bursa': 'Bursa', 'canakkale': 'Çanakkale', 'cankiri': 'Çankırı', 'corum': 'Çorum',
  'denizli': 'Denizli', 'diyarbakir': 'Diyarbakır', 'edirne': 'Edirne', 'elazig': 'Elazığ',
  'erzincan': 'Erzincan', 'erzurum': 'Erzurum', 'eskisehir': 'Eskişehir', 'gaziantep': 'Gaziantep',
  'giresun': 'Giresun', 'gumushane': 'Gümüşhane', 'hakkari': 'Hakkâri', 'hatay': 'Hatay',
  'isparta': 'Isparta', 'mersin': 'Mersin', 'istanbul': 'İstanbul', 'izmir': 'İzmir',
  'kars': 'Kars', 'kastamonu': 'Kastamonu', 'kayseri': 'Kayseri', 'kirklareli': 'Kırklareli',
  'kirsehir': 'Kırşehir', 'kocaeli': 'Kocaeli', 'konya': 'Konya', 'kutahya': 'Kütahya',
  'malatya': 'Malatya', 'manisa': 'Manisa', 'kahramanmaras': 'Kahramanmaraş', 'mardin': 'Mardin',
  'mugla': 'Muğla', 'mus': 'Muş', 'nevsehir': 'Nevşehir', 'nigde': 'Niğde',
  'ordu': 'Ordu', 'rize': 'Rize', 'sakarya': 'Sakarya', 'samsun': 'Samsun',
  'siirt': 'Siirt', 'sinop': 'Sinop', 'sivas': 'Sivas', 'tekirdag': 'Tekirdağ',
  'tokat': 'Tokat', 'trabzon': 'Trabzon', 'tunceli': 'Tunceli', 'sanliurfa': 'Şanlıurfa',
  'usak': 'Uşak', 'van': 'Van', 'yozgat': 'Yozgat', 'zonguldak': 'Zonguldak',
  'aksaray': 'Aksaray', 'bayburt': 'Bayburt', 'karaman': 'Karaman', 'kirikkale': 'Kırıkkale',
  'batman': 'Batman', 'sirnak': 'Şırnak', 'bartin': 'Bartın', 'ardahan': 'Ardahan',
  'igdir': 'Iğdır', 'yalova': 'Yalova', 'karabuk': 'Karabük', 'kilis': 'Kilis',
  'osmaniye': 'Osmaniye', 'duzce': 'Düzce'
};

// Re-export API functions from the API module
export {
  getMany,
  getOne,
  createOne,
  updateOne,
} from '../api/volunteers';

// Validation follows the Standard Schema pattern
type ValidationResult = { issues: { message: string; path: (keyof Volunteer)[] }[] };

export function validate(volunteer: Partial<Volunteer>): ValidationResult {
  let issues: ValidationResult['issues'] = [];

  // Gönüllülük numarası oluşturma sırasında otomatik atanır, düzenleme sırasında kontrol edilir
  if (volunteer.gonulluluk_no !== undefined) {
    if (!volunteer.gonulluluk_no) {
      issues = [...issues, { message: 'Gönüllülük numarası zorunludur', path: ['gonulluluk_no'] }];
    } else if (!/^G\d{10}$/.test(volunteer.gonulluluk_no)) {
      issues = [...issues, { message: 'Gönüllülük numarası G ile başlamalı ve 10 haneli olmalıdır (örn: G0123456789)', path: ['gonulluluk_no'] }];
    }
  }

  if (!volunteer.ad) {
    issues = [...issues, { message: 'Ad alanı zorunludur', path: ['ad'] }];
  }

  if (!volunteer.soyad) {
    issues = [...issues, { message: 'Soyad alanı zorunludur', path: ['soyad'] }];
  }

  if (!volunteer.email) {
    issues = [...issues, { message: 'E-posta adresi zorunludur', path: ['email'] }];
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(volunteer.email)) {
    issues = [...issues, { message: 'Geçerli bir e-posta adresi giriniz', path: ['email'] }];
  }

  if (!volunteer.telefon) {
    issues = [...issues, { message: 'Telefon alanı zorunludur', path: ['telefon'] }];
  } else if (!/^[1-9][0-9]{9}$/.test(volunteer.telefon)) {
    issues = [...issues, { message: 'Telefon numarası 10 haneli olmalı ve 0 ile başlamamalı (5XXXXXXXXX)', path: ['telefon'] }];
  }

  if (!volunteer.sehir) {
    issues = [...issues, { message: 'Şehir alanı zorunludur', path: ['sehir'] }];
  }

  if (!volunteer.gonullu_tipi) {
    issues = [...issues, { message: 'Gönüllü tipi zorunludur', path: ['gonullu_tipi'] }];
  }

  return { issues };
}

// Helper functions for UI components
export function getDisplayName(volunteer: Volunteer): string {
  return `${volunteer.ad} ${volunteer.soyad}`;
}

export function getCityDisplayName(cityKey: string): string {
  return CITY_DISPLAY_NAMES[cityKey] || cityKey;
}

export function getVolunteerTypeDisplayName(type: VolunteerType): string {
  switch (type) {
    case 'toplama':
      return 'Toplama Gönüllüsü';
    case 'tasima':
      return 'Taşıma Gönüllüsü';
    case 'dagitim':
      return 'Dağıtım Gönüllüsü';
    case 'karma':
      return 'Karma Gönüllü (Tüm Görevler)';
    default:
      return type;
  }
}
