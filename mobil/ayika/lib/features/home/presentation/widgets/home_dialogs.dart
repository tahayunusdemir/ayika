import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

/// Ana sayfa için dialog'lar
class HomeDialogs {
  /// Gönüllü ol dialog'unu gösterir
  static void showVolunteerDialog(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(
            'Gönüllü Ol',
            style: GoogleFonts.inter(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: colorScheme.onSurface,
            ),
          ),
          content: Text(
            'Gönüllü olmak için kayıt formunu doldurun. Birlikte daha güçlüyüz!',
            style: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: colorScheme.onSurface,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text(
                'İptal',
                style: GoogleFonts.inter(fontWeight: FontWeight.w500),
              ),
            ),
            FilledButton(
              onPressed: () {
                Navigator.of(context).pop();
                _launchVolunteerForm();
              },
              child: Text(
                'Kayıt Ol',
                style: GoogleFonts.inter(fontWeight: FontWeight.w500),
              ),
            ),
          ],
        );
      },
    );
  }

  /// Duyuru detay dialog'unu gösterir
  static void showAnnouncementDialog(BuildContext context, String title, String description) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          icon: Icon(
            Icons.campaign,
            color: colorScheme.primary,
            size: 32,
          ),
          title: Text(
            title,
            style: GoogleFonts.inter(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: colorScheme.onSurface,
            ),
          ),
          content: Text(
            description,
            style: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: colorScheme.onSurface,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text(
                'Kapat',
                style: GoogleFonts.inter(fontWeight: FontWeight.w500),
              ),
            ),
          ],
        );
      },
    );
  }

  /// Gönüllü kayıt formunu açar
  static Future<void> _launchVolunteerForm() async {
    final Uri url = Uri.parse('https://forms.gle/USDXE4Azwezh3BVUA');
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      // Hata durumunda kullanıcıya bilgi ver
      debugPrint('Gönüllü kayıt formu açılamadı: $url');
    }
  }
}
