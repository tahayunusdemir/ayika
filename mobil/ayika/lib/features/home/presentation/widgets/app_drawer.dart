import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../about/presentation/pages/about_page.dart';
import '../../../cargo/presentation/pages/cargo_tracking_page.dart';

/// Ayika uygulamasının sol açılır menüsü (Drawer)
/// Material Design 3 ve Inter font kullanır
class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Drawer(
      backgroundColor: colorScheme.surface,
      child: SafeArea(
        child: Column(
          children: [
            // Kompakt Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: colorScheme.primaryContainer,
              ),
              child: Row(
                children: [
                  // App Name
                  Text(
                    'Ayika',
                    style: GoogleFonts.inter(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: colorScheme.onPrimaryContainer,
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 8),
            
            // Menu Items
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                children: [
                  _buildDrawerItem(
                    context,
                    Icons.info_outline,
                    'Ayika Nedir',
                    () => _navigateToPage(context, 'about'),
                  ),
                  
                  _buildDrawerItem(
                    context,
                    Icons.local_shipping_outlined,
                    'Kargo Takibi',
                    () => _navigateToPage(context, 'cargo'),
                  ),
                  
                  _buildDrawerItem(
                    context,
                    Icons.contact_support_outlined,
                    'İletişim',
                    () => _navigateToPage(context, 'contact'),
                  ),
                ],
              ),
            ),
            
            // Footer
            Container(
              padding: const EdgeInsets.all(16),
              child: Text(
                'Sürüm 1.0.0',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: colorScheme.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Drawer menü öğesi oluşturur
  Widget _buildDrawerItem(
    BuildContext context,
    IconData icon,
    String title,
    VoidCallback onTap,
  ) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return ListTile(
      onTap: onTap,
      leading: Icon(
        icon,
        color: colorScheme.onSurfaceVariant,
        size: 24,
      ),
      title: Text(
        title,
        style: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: colorScheme.onSurface,
        ),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
    );
  }

  /// Sayfa navigasyonu
  void _navigateToPage(BuildContext context, String pageType) {
    Navigator.of(context).pop(); // Drawer'ı kapat
    
    switch (pageType) {
      case 'about':
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => const AboutPage(),
          ),
        );
        break;
      case 'contact':
        _launchContactForm();
        break;
      case 'cargo':
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => const CargoTrackingPage(),
          ),
        );
        break;
      default:
        // TODO: Diğer sayfa navigasyonları buraya eklenecek
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              '$pageType sayfası henüz tasarlanmadı',
              style: GoogleFonts.inter(),
            ),
            duration: const Duration(seconds: 2),
          ),
        );
    }
  }

  /// İletişim formunu açar
  Future<void> _launchContactForm() async {
    final Uri url = Uri.parse('https://forms.gle/USDXE4Azwezh3BVUA');
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      // Hata durumunda kullanıcıya bilgi ver
      debugPrint('İletişim formu açılamadı: $url');
    }
  }

}
