import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../onboarding/presentation/pages/onboarding_page.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    _checkOnboardingStatus();
  }

  // Her açılışta onboarding göster
  Future<void> _checkOnboardingStatus() async {
    // Splash ekranını 2 saniye göster
    await Future.delayed(const Duration(seconds: 2));
    
    if (!mounted) return;
    
    // Her zaman onboarding sayfasına git
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (context) => const OnboardingPage()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Scaffold(
      backgroundColor: colorScheme.surface,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Uygulama adı - Büyük ve dikkat çekici
              Text(
                'Ayika',
                style: GoogleFonts.inter(
                  fontSize: 64,
                  fontWeight: FontWeight.w800,
                  color: colorScheme.primary,
                  letterSpacing: -1.5,
                ),
                textAlign: TextAlign.center,
              ),
              
              const SizedBox(height: 24),
              
              // Alt başlık - Daha büyük ve okunabilir
              Text(
                'Acil Yardım ve İhtiyaç\nKoordinasyon Ağı',
                style: GoogleFonts.inter(
                  fontSize: 20,
                  fontWeight: FontWeight.w500,
                  color: colorScheme.onSurface.withValues(alpha: 0.8),
                  height: 1.3,
                  letterSpacing: 0.2,
                ),
                textAlign: TextAlign.center,
              ),
              
              const SizedBox(height: 64),
              
              // Yükleme göstergesi - Daha büyük
              SizedBox(
                width: 32,
                height: 32,
                child: CircularProgressIndicator(
                  color: colorScheme.primary,
                  strokeWidth: 3,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
