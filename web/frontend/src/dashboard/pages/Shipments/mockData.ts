import { Shipment } from './types';

export const mockShipments: Shipment[] = [
  {
    id: "1",
    takip_no: "AYK-123456789",
    kargo_durumu: "yolda",
    gonderim_tarihi: "2025-09-20 08:30:00",
    son_guncelleme_tarihi: "2025-09-20 14:15:00",
    
    gonderici: {
      ad: "Mehmet",
      soyad: "Demir",
      telefon: "532 123 45 67",
      email: "mehmet@example.com",
      gizlilik_durumu: false
    },
    
    icerik: {
      icerik_adi: "Su",
      kargo_tipi: "gıda",
      agirlik_hacim: "50 kg"
    },
    
    konum: {
      sehir: "Ankara"
    },
    
    gorevliler: {
      yardim_toplama_gonullusu: {
        ad: "Kemal",
        soyad: "Özdemir",
        gonulluluk_no: "G0123456789"
      },
      yardim_tasima_gorevlisi: {
        ad: "Serkan",
        soyad: "Acar",
        gonulluluk_no: "G0123456790"
      }
    },
    
    durum_gecmisi: [
      {
        tarih: "2025-09-20 08:30:00",
        aciklama: "Kargo hazırlandı"
      },
      {
        tarih: "2025-09-20 10:00:00",
        aciklama: "Yola çıktı"
      }
    ],
    
    guvenlik_onayi: "kontrol edildi",
    ozel_not: "Acil gönderim"
  },
  
  {
    id: "2",
    takip_no: "AYK-123456791",
    kargo_durumu: "yolda",
    gonderim_tarihi: "2025-09-18 09:00:00",
    son_guncelleme_tarihi: "2025-09-18 16:30:00",
    
    gonderici: {
      ad: "Ayşe",
      soyad: "Koç",
      telefon: "505 987 65 43",
      email: "ayse@example.com",
      gizlilik_durumu: false
    },
    
    icerik: {
      icerik_adi: "Battaniye",
      kargo_tipi: "giyim",
      agirlik_hacim: "100 adet"
    },
    
    konum: {
      sehir: "İzmir"
    },
    
    gorevliler: {
      yardim_toplama_gonullusu: {
        ad: "Zehra",
        soyad: "Kılıç",
        gonulluluk_no: "G0123456792"
      },
      yardim_dagitim_gorevlisi: {
        ad: "Hüseyin",
        soyad: "Arslan",
        gonulluluk_no: "G0123456793"
      }
    },
    
    durum_gecmisi: [
      {
        tarih: "2025-09-18 09:00:00",
        aciklama: "Kargo hazırlandı"
      },
      {
        tarih: "2025-09-18 14:30:00",
        aciklama: "Yola çıktı"
      }
    ],
    
    guvenlik_onayi: "kontrol edilmedi"
  },
  
  {
    id: "3",
    takip_no: "AYK-123456794",
    kargo_durumu: "teslim edildi",
    gonderim_tarihi: "2025-09-15 07:45:00",
    son_guncelleme_tarihi: "2025-09-17 11:20:00",
    
    gonderici: {
      ad: "Zeynep",
      soyad: "Aktaş",
      telefon: "542 111 22 33",
      email: "zeynep@example.com",
      gizlilik_durumu: false
    },
    
    icerik: {
      icerik_adi: "Konserve Gıda",
      kargo_tipi: "gıda",
      agirlik_hacim: "200 kg"
    },
    
    konum: {
      sehir: "İstanbul"
    },
    
    gorevliler: {
      yardim_toplama_gonullusu: {
        ad: "Osman",
        soyad: "Çelik",
        gonulluluk_no: "G0123456795"
      },
      yardim_tasima_gorevlisi: {
        ad: "Mustafa",
        soyad: "Kara",
        gonulluluk_no: "G0123456796"
      },
      yardim_dagitim_gorevlisi: {
        ad: "Elif",
        soyad: "Yıldız",
        gonulluluk_no: "G0123456797"
      }
    },
    
    durum_gecmisi: [
      {
        tarih: "2025-09-15 07:45:00",
        aciklama: "Kargo hazırlandı"
      },
      {
        tarih: "2025-09-15 12:00:00",
        aciklama: "Yola çıktı"
      },
      {
        tarih: "2025-09-17 11:20:00",
        aciklama: "Teslim edildi"
      }
    ],
    
    guvenlik_onayi: "kontrol edildi",
    ozel_not: "Soğuk zincir gerekli"
  },
  
  {
    id: "4",
    takip_no: "AYK-123456798",
    kargo_durumu: "teslim edildi",
    gonderim_tarihi: "2025-09-10 10:15:00",
    son_guncelleme_tarihi: "2025-09-12 15:45:00",
    
    gonderici: {
      ad: "Can",
      soyad: "Polat",
      telefon: "533 444 55 66",
      email: "can@example.com",
      gizlilik_durumu: false
    },
    
    icerik: {
      icerik_adi: "Reçeteli İlaç",
      kargo_tipi: "ilaç",
      agirlik_hacim: "30 kutu"
    },
    
    konum: {
      sehir: "Bursa"
    },
    
    gorevliler: {
      yardim_toplama_gonullusu: {
        ad: "Selin",
        soyad: "Demir",
        gonulluluk_no: "G0123456799"
      },
      yardim_tasima_gorevlisi: {
        ad: "Oğuz",
        soyad: "Şahin",
        gonulluluk_no: "G0123456800"
      },
      yardim_dagitim_gorevlisi: {
        ad: "Aylin",
        soyad: "Çelik",
        gonulluluk_no: "G0123456801"
      }
    },
    
    durum_gecmisi: [
      {
        tarih: "2025-09-10 10:15:00",
        aciklama: "Kargo hazırlandı"
      },
      {
        tarih: "2025-09-10 14:30:00",
        aciklama: "Yola çıktı"
      },
      {
        tarih: "2025-09-12 15:45:00",
        aciklama: "Teslim edildi"
      }
    ],
    
    guvenlik_onayi: "kontrol edildi",
    ozel_not: "Reçeteli ilaçlar - soğuk muhafaza"
  },
  
  {
    id: "5",
    takip_no: "AYK-123456802",
    kargo_durumu: "yolda",
    gonderim_tarihi: "2025-09-19 11:20:00",
    son_guncelleme_tarihi: "2025-09-20 09:15:00",
    
    gonderici: {
      ad: "Anonim",
      soyad: "Gönderici",
      gizlilik_durumu: true
    },
    
    icerik: {
      icerik_adi: "Çocuk Kıyafeti",
      kargo_tipi: "giyim",
      agirlik_hacim: "150 parça"
    },
    
    konum: {
      sehir: "Antalya"
    },
    
    gorevliler: {
      yardim_toplama_gonullusu: {
        ad: "Emre",
        soyad: "Yıldırım",
        gonulluluk_no: "G0123456803"
      },
      yardim_tasima_gorevlisi: {
        ad: "Burak",
        soyad: "Öztürk",
        gonulluluk_no: "G0123456804"
      }
    },
    
    durum_gecmisi: [
      {
        tarih: "2025-09-19 11:20:00",
        aciklama: "Kargo hazırlandı"
      },
      {
        tarih: "2025-09-19 15:00:00",
        aciklama: "Yola çıktı"
      }
    ],
    
    guvenlik_onayi: "kontrol edildi",
    ozel_not: "Çocuk kıyafetleri - temiz ve ütülü"
  },
  
  {
    id: "6",
    takip_no: "AYK-123456805",
    kargo_durumu: "hazırlanıyor",
    gonderim_tarihi: "2025-09-17 13:45:00",
    son_guncelleme_tarihi: "2025-09-17 13:45:00",
    
    gonderici: {
      ad: "Hasan",
      soyad: "Kılıç",
      telefon: "555 333 44 55",
      email: "hasan@example.com",
      gizlilik_durumu: false
    },
    
    icerik: {
      icerik_adi: "Su",
      kargo_tipi: "gıda",
      agirlik_hacim: "75 kg"
    },
    
    konum: {
      sehir: "Gaziantep"
    },
    
    gorevliler: {
      yardim_toplama_gonullusu: {
        ad: "Ayşe",
        soyad: "Güler",
        gonulluluk_no: "G0123456806"
      }
    },
    
    durum_gecmisi: [
      {
        tarih: "2025-09-17 13:45:00",
        aciklama: "Kargo hazırlandı"
      }
    ],
    
    guvenlik_onayi: "kontrol edilmedi"
  },
  
  // Sadece toplama gönüllüsü - hazırlanıyor
  {
    id: "7",
    takip_no: "AYK-123456808",
    kargo_durumu: "hazırlanıyor",
    gonderim_tarihi: "2025-09-21 10:00:00",
    son_guncelleme_tarihi: "2025-09-21 10:00:00",
    
    gonderici: {
      ad: "Fatma",
      soyad: "Yıldırım",
      telefon: "534 567 89 01",
      email: "fatma@example.com",
      gizlilik_durumu: false
    },
    
    icerik: {
      icerik_adi: "Bebek Maması",
      kargo_tipi: "gıda",
      agirlik_hacim: "25 kg"
    },
    
    konum: {
      sehir: "Adana"
    },
    
    gorevliler: {
      yardim_toplama_gonullusu: {
        ad: "Cemil",
        soyad: "Başaran",
        gonulluluk_no: "G0123456808"
      }
    },
    
    durum_gecmisi: [
      {
        tarih: "2025-09-21 10:00:00",
        aciklama: "Kargo hazırlandı"
      }
    ],
    
    guvenlik_onayi: "kontrol edilmedi"
  },
  
  // Toplama + taşıma gönüllüsü - yolda
  {
    id: "8",
    takip_no: "AYK-123456809",
    kargo_durumu: "yolda",
    gonderim_tarihi: "2025-09-20 14:30:00",
    son_guncelleme_tarihi: "2025-09-21 08:15:00",
    
    gonderici: {
      ad: "Anonim",
      soyad: "Bağışçı",
      gizlilik_durumu: true
    },
    
    icerik: {
      icerik_adi: "Kışlık Mont",
      kargo_tipi: "giyim",
      agirlik_hacim: "50 adet"
    },
    
    konum: {
      sehir: "Trabzon"
    },
    
    gorevliler: {
      yardim_toplama_gonullusu: {
        ad: "Deniz",
        soyad: "Korkmaz",
        gonulluluk_no: "G0123456809"
      },
      yardim_tasima_gorevlisi: {
        ad: "Mert",
        soyad: "Özgür",
        gonulluluk_no: "G0123456810"
      }
    },
    
    durum_gecmisi: [
      {
        tarih: "2025-09-20 14:30:00",
        aciklama: "Kargo hazırlandı"
      },
      {
        tarih: "2025-09-21 08:15:00",
        aciklama: "Yola çıktı"
      }
    ],
    
    guvenlik_onayi: "kontrol edildi"
  }
];
