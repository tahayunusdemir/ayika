import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Ayika uygulaması için tipografi sistemi
/// rules.md dosyasındaki kurallara uygun olarak Inter font ailesi kullanır
class AppTypography {
  // Private constructor to prevent instantiation
  AppTypography._();

  /// Material Design 3 Typography Scale - Inter font ailesi ile
  /// Web frontend ile uyumlu font ağırlıkları kullanır
  static TextTheme get textTheme => TextTheme(
    // Ana başlık - 48px, FontWeight.w600
    displayLarge: GoogleFonts.inter(
      fontSize: 48,
      fontWeight: FontWeight.w600,
      height: 1.2,
    ),
    
    // İkincil başlık - 36px, FontWeight.w600
    displayMedium: GoogleFonts.inter(
      fontSize: 36,
      fontWeight: FontWeight.w600,
      height: 1.2,
    ),
    
    // Üçüncül başlık - 30px, FontWeight.w400
    displaySmall: GoogleFonts.inter(
      fontSize: 30,
      fontWeight: FontWeight.w400,
      height: 1.3,
    ),
    
    // Kart başlıkları - 24px, FontWeight.w600
    headlineLarge: GoogleFonts.inter(
      fontSize: 24,
      fontWeight: FontWeight.w600,
      height: 1.3,
    ),
    
    // Liste başlıkları - 20px, FontWeight.w600
    headlineMedium: GoogleFonts.inter(
      fontSize: 20,
      fontWeight: FontWeight.w600,
      height: 1.4,
    ),
    
    // Alt başlıklar - 18px, FontWeight.w600
    headlineSmall: GoogleFonts.inter(
      fontSize: 18,
      fontWeight: FontWeight.w600,
      height: 1.4,
    ),
    
    // Ana alt başlık - 18px, FontWeight.w400
    titleLarge: GoogleFonts.inter(
      fontSize: 18,
      fontWeight: FontWeight.w400,
      height: 1.4,
    ),
    
    // Orta başlık - 16px, FontWeight.w500
    titleMedium: GoogleFonts.inter(
      fontSize: 16,
      fontWeight: FontWeight.w500,
      height: 1.4,
    ),
    
    // İkincil alt başlık - 14px, FontWeight.w500
    titleSmall: GoogleFonts.inter(
      fontSize: 14,
      fontWeight: FontWeight.w500,
      height: 1.4,
    ),
    
    // Ana metin - 16px, FontWeight.w400
    bodyLarge: GoogleFonts.inter(
      fontSize: 16,
      fontWeight: FontWeight.w400,
      height: 1.5,
    ),
    
    // İkincil metin - 14px, FontWeight.w400
    bodyMedium: GoogleFonts.inter(
      fontSize: 14,
      fontWeight: FontWeight.w400,
      height: 1.5,
    ),
    
    // Küçük metin - 12px, FontWeight.w400
    bodySmall: GoogleFonts.inter(
      fontSize: 12,
      fontWeight: FontWeight.w400,
      height: 1.4,
    ),
    
    // Etiket metni - 11px, FontWeight.w500
    labelLarge: GoogleFonts.inter(
      fontSize: 14,
      fontWeight: FontWeight.w500,
      height: 1.4,
    ),
    
    // Orta etiket - 12px, FontWeight.w500
    labelMedium: GoogleFonts.inter(
      fontSize: 12,
      fontWeight: FontWeight.w500,
      height: 1.3,
    ),
    
    // Küçük etiket - 11px, FontWeight.w500
    labelSmall: GoogleFonts.inter(
      fontSize: 11,
      fontWeight: FontWeight.w500,
      height: 1.3,
    ),
  );

  /// Buton metinleri için özel stil - FontWeight.w500
  static TextStyle get buttonText => GoogleFonts.inter(
    fontSize: 14,
    fontWeight: FontWeight.w500,
    height: 1.4,
  );

  /// Chip metinleri için özel stil - FontWeight.w500
  static TextStyle get chipText => GoogleFonts.inter(
    fontSize: 12,
    fontWeight: FontWeight.w500,
    height: 1.3,
  );

  /// Vurgu metinleri için özel stil - FontWeight.w500
  static TextStyle get emphasisText => GoogleFonts.inter(
    fontSize: 14,
    fontWeight: FontWeight.w500,
    height: 1.4,
  );

  /// AppBar başlık stili - FontWeight.w600
  static TextStyle get appBarTitle => GoogleFonts.inter(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    height: 1.2,
  );

  /// Kart başlık stili - FontWeight.w600
  static TextStyle get cardTitle => GoogleFonts.inter(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    height: 1.3,
  );

  /// Liste öğesi başlık stili - FontWeight.w500
  static TextStyle get listItemTitle => GoogleFonts.inter(
    fontSize: 16,
    fontWeight: FontWeight.w500,
    height: 1.4,
  );

  /// Liste öğesi alt başlık stili - FontWeight.w400
  static TextStyle get listItemSubtitle => GoogleFonts.inter(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 1.4,
  );
}
