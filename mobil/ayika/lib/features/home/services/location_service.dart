import 'dart:io';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:latlong2/latlong.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../map/data/help_points.dart';

/// Konum servisleri ve dialog'ları
class LocationService {
  /// Kullanıcının mevcut konumunu alır
  static Future<LatLng?> getCurrentLocation(BuildContext context) async {
    try {
      // Konum servisi kontrolü
      if (!await Geolocator.isLocationServiceEnabled()) {
        _showLocationServiceDialog(context);
        return null;
      }

      // İzin kontrolü
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          _showPermissionDeniedDialog(context);
          return null;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        _showPermissionDeniedForeverDialog(context);
        return null;
      }

      // Konum alma
      Position position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 10),
        ),
      );

      return LatLng(position.latitude, position.longitude);

    } catch (e) {
      debugPrint('Konum alma hatası: $e');
      return null;
    }
  }

  /// En yakın yardım noktasını bulur
  static HelpPoint findNearestHelpPoint(LatLng userLocation) {
    HelpPoint nearest = HelpPointsData.turkeyHelpPoints.first;
    double minDistance = calculateDistance(userLocation, nearest.coordinates);

    for (final point in HelpPointsData.turkeyHelpPoints) {
      final distance = calculateDistance(userLocation, point.coordinates);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = point;
      }
    }

    return nearest;
  }

  /// İki koordinat arasındaki mesafeyi hesaplar (km cinsinden)
  static double calculateDistance(LatLng point1, LatLng point2) {
    return Geolocator.distanceBetween(
      point1.latitude,
      point1.longitude,
      point2.latitude,
      point2.longitude,
    ) / 1000; // metreyi kilometreye çevir
  }

  /// Yol tarifi açar - iOS ve Android uyumlu
  static void openDirections(BuildContext context, HelpPoint helpPoint) async {
    final lat = helpPoint.coordinates.latitude;
    final lng = helpPoint.coordinates.longitude;
    final cityName = Uri.encodeComponent(helpPoint.name);
    
    // Platform bazlı URL'ler
    final appleMapsUrl = 'http://maps.apple.com/?daddr=$lat,$lng&dirflg=d';
    final googleMapsUrl = 'https://www.google.com/maps/dir/?api=1&destination=$lat,$lng';
    final googleMapsAppUrl = 'comgooglemaps://?daddr=$lat,$lng&directionsmode=driving';
    
    List<String> urlsToTry = [];
    
    // Platform bazlı öncelik sıralaması
    if (Platform.isIOS) {
      urlsToTry = [
        appleMapsUrl,           // iOS'ta önce Apple Maps
        googleMapsAppUrl,       // Sonra Google Maps app
        googleMapsUrl,          // Sonra Google Maps web
      ];
    } else {
      urlsToTry = [
        googleMapsAppUrl,       // Android'de önce Google Maps app
        googleMapsUrl,          // Sonra Google Maps web
        appleMapsUrl,           // Son olarak Apple Maps (nadiren çalışır)
      ];
    }
    
    // URL'leri sırayla dene
    for (String url in urlsToTry) {
      try {
        if (await canLaunchUrl(Uri.parse(url))) {
          await launchUrl(
            Uri.parse(url), 
            mode: LaunchMode.externalApplication
          );
          
          // Başarılı olursa kullanıcıya bilgi ver
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  '${helpPoint.name} için yol tarifi açılıyor...',
                  style: GoogleFonts.inter(),
                ),
                duration: const Duration(seconds: 2),
                backgroundColor: Colors.green,
              ),
            );
          }
          return;
        }
      } catch (e) {
        debugPrint('URL açılamadı ($url): $e');
        continue;
      }
    }
    
    // Hiçbiri çalışmazsa genel web URL'i dene
    final fallbackUrl = 'https://maps.google.com/maps?q=$lat,$lng($cityName)';
    try {
      if (await canLaunchUrl(Uri.parse(fallbackUrl))) {
        await launchUrl(
          Uri.parse(fallbackUrl), 
          mode: LaunchMode.externalApplication
        );
        
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Harita web sayfasında açılıyor...',
                style: GoogleFonts.inter(),
              ),
              duration: const Duration(seconds: 2),
            ),
          );
        }
        return;
      }
    } catch (e) {
      debugPrint('Fallback URL açılamadı: $e');
    }
    
    // Hiçbiri çalışmazsa hata mesajı
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Harita uygulaması bulunamadı.\n${Platform.isIOS ? "Apple Maps veya Google Maps" : "Google Maps"} yükleyin.',
            style: GoogleFonts.inter(),
          ),
          duration: const Duration(seconds: 4),
          backgroundColor: Colors.red,
          action: SnackBarAction(
            label: 'Tamam',
            textColor: Colors.white,
            onPressed: () {
              ScaffoldMessenger.of(context).hideCurrentSnackBar();
            },
          ),
        ),
      );
    }
  }

  /// Konum servisi kapalı dialog'u
  static void _showLocationServiceDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          icon: Icon(
            Icons.location_off,
            color: Colors.orange,
            size: 32,
          ),
          title: Text(
            'Konum Servisi Kapalı',
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          content: Text(
            'Konumunuzu alabilmek için lütfen cihazınızın konum servisini açın.',
            style: GoogleFonts.inter(fontSize: 14),
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
                Geolocator.openLocationSettings();
              },
              child: Text(
                'Ayarları Aç',
                style: GoogleFonts.inter(fontWeight: FontWeight.w500),
              ),
            ),
          ],
        );
      },
    );
  }

  /// Konum izni reddedildi dialog'u
  static void _showPermissionDeniedDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          icon: Icon(
            Icons.location_disabled,
            color: Colors.red,
            size: 32,
          ),
          title: Text(
            'Konum İzni Gerekli',
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          content: Text(
            'Size en yakın yardım noktalarını gösterebilmek için konum izni gereklidir.',
            style: GoogleFonts.inter(fontSize: 14),
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
                // Tekrar konum alma işlemini başlat
              },
              child: Text(
                'Tekrar Dene',
                style: GoogleFonts.inter(fontWeight: FontWeight.w500),
              ),
            ),
          ],
        );
      },
    );
  }

  /// Konum izni kalıcı olarak reddedildi dialog'u
  static void _showPermissionDeniedForeverDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          icon: Icon(
            Icons.settings,
            color: Colors.orange,
            size: 32,
          ),
          title: Text(
            'Konum İzni Ayarları',
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          content: Text(
            'Konum izni kalıcı olarak reddedildi. Lütfen uygulama ayarlarından konum iznini manuel olarak açın.',
            style: GoogleFonts.inter(fontSize: 14),
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
                openAppSettings();
              },
              child: Text(
                'Ayarları Aç',
                style: GoogleFonts.inter(fontWeight: FontWeight.w500),
              ),
            ),
          ],
        );
      },
    );
  }
}
