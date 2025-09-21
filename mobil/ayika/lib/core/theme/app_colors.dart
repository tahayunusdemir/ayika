import 'package:flutter/material.dart';

/// Ayika uygulaması için renk paleti
/// rules.md dosyasındaki kurallara uygun olarak tasarlanmıştır
class AppColors {
  // Private constructor to prevent instantiation
  AppColors._();

  // Ana Renk Paleti (Brand Colors) - Koordinasyon
  static const Color brandLight400 = Color(0xFF2196F3); // Ana primary renk
  static const Color brandLight200 = Color(0xFF90CAF9); // Açık primary
  static const Color brandLight700 = Color(0xFF1565C0); // Koyu primary

  // Acil Yardım Renkleri
  static const Color emergencyPrimary = Color(0xFFD32F2F); // Acil durum ana
  static const Color emergencySecondary = Color(0xFFEF5350); // Acil durum ikincil

  // Sistem Durumu Renkleri
  // Success - Yeşil tonları (Başarılı işlemler)
  static const Color successLight400 = Color(0xFF9CCC65); // Başarı ana rengi
  static const Color successLight500 = Color(0xFF689F38); // Başarı koyu tonu

  // Warning - Turuncu tonları (Uyarılar)
  static const Color warningLight400 = Color(0xFFFFCA28); // Uyarı ana rengi
  static const Color warningLight500 = Color(0xFFFFB300); // Uyarı koyu tonu

  // Error - Kırmızı tonları (Hatalar)
  static const Color errorLight400 = Color(0xFFEF5350); // Hata ana rengi
  static const Color errorLight500 = Color(0xFFF44336); // Hata koyu tonu

  // Nötr Renkler (Gray Scale)
  // Text Colors - Light Theme
  static const Color textPrimaryLight = Color(0xFF424242); // Ana metin (açık tema)
  static const Color textSecondaryLight = Color(0xFF757575); // İkincil metin (açık tema)
  
  // Text Colors - Dark Theme
  static const Color textPrimaryDark = Color(0xFFFFFFFF); // Ana metin (koyu tema)
  static const Color textSecondaryDark = Color(0xFFBDBDBD); // İkincil metin (koyu tema)

  // Background Colors
  static const Color backgroundLight = Color(0xFFFCFCFC); // Ana arka plan (açık)
  static const Color surfaceLight = Color(0xFFFAFAFA); // Yüzey rengi (açık)
  static const Color backgroundDark = Color(0xFF212121); // Ana arka plan (koyu)
  static const Color surfaceDark = Color(0xFF0F1419); // Yüzey rengi (koyu)

  // Özellik Bazlı Renkler
  static const Map<String, Color> featureColors = {
    'volunteer': Color(0xFF2196F3), // Gönüllü işlemleri - Mavi
    'logistics': Color(0xFF4CAF50), // Lojistik takip - Yeşil
    'inventory': Color(0xFFFF9800), // Stok yönetimi - Turuncu
    'emergency': Color(0xFFD32F2F), // Acil durumlar - Kırmızı
    'location': Color(0xFF9C27B0), // Konum servisleri - Mor
    'help': Color(0xFF009688), // Yardım talepleri - Teal
  };

  /// Material Design 3 ColorScheme oluşturur (Açık tema)
  static ColorScheme get lightColorScheme => ColorScheme.fromSeed(
        seedColor: brandLight400,
        brightness: Brightness.light,
        primary: brandLight400,
        onPrimary: Colors.white,
        primaryContainer: brandLight200,
        onPrimaryContainer: brandLight700,
        secondary: successLight400,
        onSecondary: Colors.white,
        error: errorLight400,
        onError: Colors.white,
        surface: surfaceLight,
        onSurface: textPrimaryLight,
      );

  /// Material Design 3 ColorScheme oluşturur (Koyu tema)
  static ColorScheme get darkColorScheme => ColorScheme.fromSeed(
        seedColor: brandLight400,
        brightness: Brightness.dark,
        primary: brandLight200,
        onPrimary: brandLight700,
        primaryContainer: brandLight700,
        onPrimaryContainer: brandLight200,
        secondary: successLight400,
        onSecondary: Colors.black,
        error: errorLight400,
        onError: Colors.white,
        surface: surfaceDark,
        onSurface: textPrimaryDark,
      );
}
