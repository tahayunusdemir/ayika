import 'package:flutter/material.dart';
import 'core/theme/app_theme.dart';
import 'features/splash/presentation/pages/splash_page.dart';

void main() {
  runApp(const AyikaApp());
}

class AyikaApp extends StatelessWidget {
  const AyikaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ayika - Acil Yardım ve İhtiyaç Koordinasyon Ağı',
      debugShowCheckedModeBanner: false,
      
      // tema sistemi
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      
      // Splash screen - onboarding kontrolü yapacak
      home: const SplashPage(),
    );
  }
}
