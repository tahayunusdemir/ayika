import { CargoType, SecurityApproval } from '../types';

// Kargo tipleri - Detaylı kategorizasyon
export const cargoTypes: Array<{ value: CargoType; label: string; description: string }> = [
  { value: 'gıda', label: 'Gıda Ürünleri', description: 'Yiyecek, içecek ve beslenme malzemeleri' },
  { value: 'ilaç', label: 'Sağlık Malzemeleri', description: 'İlaç, tıbbi malzeme ve sağlık ürünleri' },
  { value: 'giyim', label: 'Giyim ve Tekstil', description: 'Kıyafet, ayakkabı, battaniye ve tekstil ürünleri' },
  { value: 'karışık', label: 'Karışık Paket', description: 'Farklı kategorilerden ürünler içeren paketler' },
  { value: 'diğer', label: 'Diğer Malzemeler', description: 'Elektronik, temizlik, eğitim, barınma malzemeleri vb.' },
];

// Durum seçenekleri
export const statusOptions = [
  { value: 'hazırlanıyor', label: 'Hazırlanıyor' },
  { value: 'yolda', label: 'Yolda' },
  { value: 'teslim edildi', label: 'Teslim Edildi' },
  { value: 'iptal edildi', label: 'İptal Edildi' },
];

// Güvenlik onayı seçenekleri
export const securityApprovalOptions: Array<{ value: SecurityApproval; label: string }> = [
  { value: 'kontrol edildi', label: 'Kontrol Edildi' },
  { value: 'kontrol edilmedi', label: 'Kontrol Edilmedi' },
];

// İçerik önerileri - Kategorilere göre düzenlenmiş
export const contentSuggestions = {
  'gıda': [
    'Su (5L, 10L, 19L)',
    'Konserve Gıda (Et, Sebze, Meyve)',
    'Kuru Gıda Paketi',
    'Bebek Maması ve Besini',
    'Taze Meyve ve Sebze',
    'Ekmek ve Unlu Mamuller',
    'Pirinç (1kg, 5kg, 25kg)',
    'Makarna ve Bulgur',
    'Bakliyat (Mercimek, Fasulye, Nohut)',
    'Yağ ve Tereyağı',
    'Süt ve Süt Ürünleri',
    'Hazır Yemek Paketi',
    'Çay ve Kahve',
    'Şeker ve Bal',
    'Tuz ve Baharat',
    'Bisküvi ve Kraker',
    'Kuruyemiş ve Çekirdek',
    'Reçel ve Pekmez',
    'Çikolata ve Şeker',
    'Mama Biberon ve Emzik'
  ],
  'ilaç': [
    'Reçeteli İlaç Paketi',
    'Ağrı Kesici (Parol, Aspirin)',
    'Ateş Düşürücü',
    'Soğuk Algınlığı İlacı',
    'Vitamin ve Mineral Takviyesi',
    'İlk Yardım Çantası',
    'Bandaj ve Sargı Malzemesi',
    'Antiseptik ve Dezenfektan',
    'Termometre',
    'Kan Basıncı Aleti',
    'Diyabet Test Kiti',
    'Maske ve Eldiven',
    'Serum Fizyolojik',
    'Pamuk ve Gazlı Bez',
    'Yara Bandı ve Flaster',
    'Öksürük Şurubu',
    'Mide İlacı',
    'Göz Damlası',
    'Kulak Damlası',
    'Merhem ve Krem',
    'Enjektör ve İğne',
    'Tansiyon İlacı',
    'Kalp İlacı',
    'Nefes Açıcı (Astım)',
    'İnsülin ve Diyabet Malzemeleri'
  ],
  'giyim': [
    'Yetişkin Kış Kıyafeti',
    'Yetişkin Yaz Kıyafeti',
    'Çocuk Kıyafeti (0-2 Yaş)',
    'Çocuk Kıyafeti (3-12 Yaş)',
    'Genç Kıyafeti (13-18 Yaş)',
    'Ayakkabı (Erkek/Kadın/Çocuk)',
    'İç Çamaşırı Seti',
    'Battaniye ve Yorgan',
    'Uyku Tulumu',
    'Yastık ve Kılıf',
    'Çadır ve Kamp Malzemesi',
    'Mont ve Kaban',
    'Çorap ve Külotlu Çorap',
    'Eldiven ve Bere',
    'Atkı ve Şal',
    'Pijama ve Gecelik',
    'Hamile Kıyafeti',
    'Bebek Kıyafeti ve Zıbın',
    'İş Kıyafeti ve Önlük',
    'Spor Kıyafeti',
    'Terlik ve Sandalet',
    'Çizme ve Bot',
    'Kemer ve Aksesuar'
  ],
  'karışık': [
    'Aile Yardım Paketi',
    'Acil Durum Paketi',
    'Bebek Bakım Paketi',
    'Okul Malzemeleri Paketi',
    'Hijyen Paketi',
    'Temizlik Malzemeleri Paketi',
    'Kışlık Hazırlık Paketi',
    'Yenidoğan Paketi',
    'Yaşlı Bakım Paketi',
    'Engelli Bakım Paketi',
    'Kadın Hijyen Paketi',
    'Erkek Bakım Paketi',
    'Çocuk Oyun Paketi',
    'Eğitim Destek Paketi',
    'Mutfak Eşyası Paketi',
    'Banyo Malzemeleri Paketi',
    'Kamp ve Barınma Paketi',
    'İletişim Paketi'
  ],
  'diğer': [
    'Elektronik Eşya (Telefon, Tablet)',
    'Ev Eşyası (Tencere, Tabak)',
    'Eğitim Malzemeleri',
    'Kitap ve Dergi',
    'Çocuk Oyuncakları',
    'Spor Malzemeleri',
    'Müzik Aletleri',
    'Bahçe ve Tarım Malzemeleri',
    'İnşaat Malzemeleri',
    'Araç Yedek Parça',
    'Yakıt ve Enerji',
    'Haberleşme Cihazları',
    'Temizlik Malzemeleri',
    'Kırtasiye Malzemeleri',
    'Mobilya ve Dekorasyon',
    'Mutfak Gereçleri',
    'Banyo Malzemeleri',
    'Aydınlatma Malzemeleri',
    'Güvenlik Malzemeleri',
    'Yangın Söndürme Malzemeleri',
    'Jeneratör ve Güç Kaynağı',
    'Su Arıtma Cihazları',
    'Isıtma ve Soğutma Cihazları',
    'Çanta ve Bavul',
    'Saatler ve Takılar',
    'Optik Malzemeler (Gözlük)',
    'Pet Malzemeleri',
    'Hobi Malzemeleri',
    'Sanat Malzemeleri',
    'Fotoğraf ve Video Ekipmanları'
  ]
};

// Yardım malzemesi kategorileri - Acil durum ve afet yardımı için
export const emergencyCategories = {
  'acil_gida': [
    'Acil Su (1.5L, 5L)',
    'Enerji Barı',
    'Konserve Açacağı',
    'Plastik Bardak ve Tabak',
    'Çatal Kaşık Bıçak Seti'
  ],
  'acil_barinma': [
    'Acil Barınma Çadırı',
    'Branda ve Naylon',
    'İp ve Bağlama Malzemesi',
    'Şişme Yatak',
    'Uyku Tulumu (-10°C)',
    'Yalıtım Malzemesi'
  ],
  'acil_iletisim': [
    'El Feneri (Pilli/Şarjlı)',
    'Pil (AA, AAA, 9V)',
    'Powerbank ve Şarj Kablosu',
    'Radyo (Pilli)',
    'Düdük ve İşaret Fişeği',
    'Ayna (İşaret için)'
  ],
  'acil_saglik': [
    'Acil İlk Yardım Çantası',
    'Turnike',
    'Acil Kan Durdurucu',
    'Serum Fizyolojik (Büyük)',
    'Acil Ağrı Kesici',
    'Antibiyotik Merhem'
  ]
};

// Tüm önerileri tek listede topla
export const allContentSuggestions = [
  ...Object.values(contentSuggestions).flat(),
  ...Object.values(emergencyCategories).flat()
];

export const getCargoTypeLabel = (value: CargoType): string => {
  const option = cargoTypes.find(option => option.value === value);
  return option ? option.label : value;
};

export const getCargoTypeDescription = (value: CargoType): string => {
  const option = cargoTypes.find(option => option.value === value);
  return option ? option.description : '';
};

export const getContentSuggestionsByType = (cargoType: CargoType): string[] => {
  return contentSuggestions[cargoType] || [];
};

export const getEmergencyContentSuggestions = (): string[] => {
  return Object.values(emergencyCategories).flat();
};

export const getStatusLabel = (value: string): string => {
  const option = statusOptions.find(option => option.value === value);
  return option ? option.label : value;
};

export const getSecurityApprovalLabel = (value: SecurityApproval): string => {
  const option = securityApprovalOptions.find(option => option.value === value);
  return option ? option.label : value;
};
