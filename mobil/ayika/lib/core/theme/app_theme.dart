import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'app_colors.dart';
import 'app_typography.dart';

/// Ayika uygulaması için Material Design 3 tema sistemi
/// rules.md dosyasındaki kurallara uygun olarak tasarlanmıştır
class AppTheme {
  // Private constructor to prevent instantiation
  AppTheme._();

  /// Açık tema (Light Theme)
  static ThemeData get lightTheme => ThemeData(
    // Material Design 3 aktif
    useMaterial3: true,
    
    // Renk şeması
    colorScheme: AppColors.lightColorScheme,
    
    // Tipografi sistemi
    textTheme: AppTypography.textTheme,
    
    // AppBar tema
    appBarTheme: AppBarTheme(
      backgroundColor: AppColors.lightColorScheme.surface,
      foregroundColor: AppColors.lightColorScheme.onSurface,
      elevation: 0,
      scrolledUnderElevation: 1,
      titleTextStyle: AppTypography.appBarTitle.copyWith(
        color: AppColors.lightColorScheme.onSurface,
      ),
      systemOverlayStyle: SystemUiOverlayStyle.dark,
      centerTitle: true,
    ),
    
    // Card tema
    cardTheme: CardThemeData(
      color: AppColors.lightColorScheme.surface,
      surfaceTintColor: AppColors.lightColorScheme.surfaceTint,
      elevation: 1,
      shadowColor: Colors.black.withValues(alpha: 0.1),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      margin: const EdgeInsets.all(8),
    ),
    
    // FloatingActionButton tema
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: AppColors.emergencyPrimary,
      foregroundColor: Colors.white,
      elevation: 6,
      focusElevation: 8,
      hoverElevation: 8,
      highlightElevation: 12,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
    ),
    
    // ElevatedButton tema
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        textStyle: AppTypography.buttonText,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        elevation: 2,
      ),
    ),
    
    // OutlinedButton tema
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        textStyle: AppTypography.buttonText,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
    
    // TextButton tema
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        textStyle: AppTypography.buttonText,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
    
    // Chip tema
    chipTheme: ChipThemeData(
      backgroundColor: AppColors.lightColorScheme.surfaceContainerHighest,
      labelStyle: AppTypography.chipText,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
    ),
    
    // ListTile tema
    listTileTheme: ListTileThemeData(
      titleTextStyle: AppTypography.listItemTitle.copyWith(
        color: AppColors.lightColorScheme.onSurface,
      ),
      subtitleTextStyle: AppTypography.listItemSubtitle.copyWith(
        color: AppColors.lightColorScheme.onSurfaceVariant,
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
    ),
    
    // SnackBar tema
    snackBarTheme: SnackBarThemeData(
      backgroundColor: AppColors.lightColorScheme.inverseSurface,
      contentTextStyle: AppTypography.textTheme.bodyMedium?.copyWith(
        color: AppColors.lightColorScheme.onInverseSurface,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      behavior: SnackBarBehavior.floating,
    ),
    
    // NavigationBar tema
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: AppColors.lightColorScheme.surface,
      indicatorColor: AppColors.lightColorScheme.secondaryContainer,
      labelTextStyle: WidgetStateProperty.all(
        AppTypography.textTheme.labelMedium?.copyWith(
          color: AppColors.lightColorScheme.onSurface,
        ),
      ),
      height: 80,
    ),
    
    // Divider tema
    dividerTheme: DividerThemeData(
      color: AppColors.lightColorScheme.outlineVariant,
      thickness: 1,
      space: 1,
    ),
  );

  /// Koyu tema (Dark Theme)
  static ThemeData get darkTheme => ThemeData(
    // Material Design 3 aktif
    useMaterial3: true,
    
    // Renk şeması
    colorScheme: AppColors.darkColorScheme,
    
    // Tipografi sistemi
    textTheme: AppTypography.textTheme,
    
    // AppBar tema
    appBarTheme: AppBarTheme(
      backgroundColor: AppColors.darkColorScheme.surface,
      foregroundColor: AppColors.darkColorScheme.onSurface,
      elevation: 0,
      scrolledUnderElevation: 1,
      titleTextStyle: AppTypography.appBarTitle.copyWith(
        color: AppColors.darkColorScheme.onSurface,
      ),
      systemOverlayStyle: SystemUiOverlayStyle.light,
      centerTitle: true,
    ),
    
    // Card tema
    cardTheme: CardThemeData(
      color: AppColors.darkColorScheme.surface,
      surfaceTintColor: AppColors.darkColorScheme.surfaceTint,
      elevation: 1,
      shadowColor: Colors.black.withValues(alpha: 0.3),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      margin: const EdgeInsets.all(8),
    ),
    
    // FloatingActionButton tema
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: AppColors.emergencyPrimary,
      foregroundColor: Colors.white,
      elevation: 6,
      focusElevation: 8,
      hoverElevation: 8,
      highlightElevation: 12,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
    ),
    
    // ElevatedButton tema
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        textStyle: AppTypography.buttonText,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        elevation: 2,
      ),
    ),
    
    // OutlinedButton tema
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        textStyle: AppTypography.buttonText,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
    
    // TextButton tema
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        textStyle: AppTypography.buttonText,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
    
    // Chip tema
    chipTheme: ChipThemeData(
      backgroundColor: AppColors.darkColorScheme.surfaceContainerHighest,
      labelStyle: AppTypography.chipText,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
    ),
    
    // ListTile tema
    listTileTheme: ListTileThemeData(
      titleTextStyle: AppTypography.listItemTitle.copyWith(
        color: AppColors.darkColorScheme.onSurface,
      ),
      subtitleTextStyle: AppTypography.listItemSubtitle.copyWith(
        color: AppColors.darkColorScheme.onSurfaceVariant,
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
    ),
    
    // SnackBar tema
    snackBarTheme: SnackBarThemeData(
      backgroundColor: AppColors.darkColorScheme.inverseSurface,
      contentTextStyle: AppTypography.textTheme.bodyMedium?.copyWith(
        color: AppColors.darkColorScheme.onInverseSurface,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      behavior: SnackBarBehavior.floating,
    ),
    
    // NavigationBar tema
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: AppColors.darkColorScheme.surface,
      indicatorColor: AppColors.darkColorScheme.secondaryContainer,
      labelTextStyle: WidgetStateProperty.all(
        AppTypography.textTheme.labelMedium?.copyWith(
          color: AppColors.darkColorScheme.onSurface,
        ),
      ),
      height: 80,
    ),
    
    // Divider tema
    dividerTheme: DividerThemeData(
      color: AppColors.darkColorScheme.outlineVariant,
      thickness: 1,
      space: 1,
    ),
  );
}
