import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:latlong2/latlong.dart';
import '../widgets/app_drawer.dart';
import '../widgets/home_widgets.dart';
import '../widgets/map_widgets.dart';
import '../widgets/home_dialogs.dart';
import '../../services/location_service.dart';
import '../../../about/presentation/pages/about_page.dart';
import '../../../cargo/presentation/pages/cargo_tracking_page.dart';
import '../../../map/data/help_points.dart';

/// Ayika uygulamasının ana sayfası
/// Material Design 3 ve Inter font kullanır
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;
  final MapController _mapController = MapController();
  HelpPoint? _selectedHelpPoint;
  
  // Türkiye merkez koordinatları
  static const LatLng _turkeyCenter = LatLng(39.9334, 32.8597);
  
  // Konum değişkenleri
  LatLng? _currentLocation;
  bool _isLoadingLocation = false;

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Scaffold(
      backgroundColor: colorScheme.surface,
      drawer: const AppDrawer(),
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        scrolledUnderElevation: 0,
        automaticallyImplyLeading: true,
        title: Text(
          'Ayika',
          style: GoogleFonts.inter(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: Colors.blue,
          ),
        ),
        centerTitle: true,
      ),
      body: _getSelectedBody(context),
      
      // Bottom Navigation Bar
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: _onItemTapped,
        backgroundColor: colorScheme.surface,
        indicatorColor: colorScheme.primaryContainer,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        animationDuration: const Duration(milliseconds: 200),
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.home_outlined),
            selectedIcon: const Icon(Icons.home),
            label: 'Ana Sayfa',
          ),
          NavigationDestination(
            icon: const Icon(Icons.map_outlined),
            selectedIcon: const Icon(Icons.map),
            label: 'Harita',
          ),
        ],
      ),
    );
  }

  /// Seçili sekmeye göre body içeriğini döndürür
  Widget _getSelectedBody(BuildContext context) {
    switch (_selectedIndex) {
      case 0:
        return _buildHomeBody(context);
      case 1:
        return _buildMapBody(context);
      default:
        return _buildHomeBody(context);
    }
  }

  /// Ana sayfa içeriğini oluşturur
  Widget _buildHomeBody(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return SafeArea(
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hoş geldin mesajı
            Text(
              'Hoş Geldiniz',
              style: GoogleFonts.inter(
                fontSize: 28,
                fontWeight: FontWeight.w700,
                color: colorScheme.onSurface,
              ),
            ),
            
            const SizedBox(height: 8),
            
            Text(
              'Acil Yardım ve İhtiyaç Koordinasyon Ağı',
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w400,
                color: colorScheme.onSurfaceVariant,
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Gönüllü ol teşvik metni
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: colorScheme.primaryContainer.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: colorScheme.primary.withValues(alpha: 0.2),
                  width: 1,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Bir Fark Yaratın!',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: colorScheme.primary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Toplumunuza yardım edin, değerli deneyimler kazanın',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w400,
                      color: colorScheme.onSurface.withValues(alpha: 0.8),
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Gönüllü Ol butonu
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () => HomeDialogs.showVolunteerDialog(context),
                style: FilledButton.styleFrom(
                  backgroundColor: colorScheme.primary,
                  foregroundColor: colorScheme.onPrimary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text(
                  'Gönüllü Ol',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
            
            const SizedBox(height: 32),
            
            // Hızlı Erişim
            Text(
              'Hızlı Erişim',
              style: GoogleFonts.inter(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: colorScheme.onSurface,
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Hızlı Erişim Kartları - 3'lü Grid
            Row(
              children: [
                Expanded(
                  child: HomeWidgets.buildQuickAccessCard(
                    context,
                    Icons.info_outline,
                    'Ayika Nedir',
                    '',
                    colorScheme.primary,
                    () => _navigateToAbout(context),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: HomeWidgets.buildQuickAccessCard(
                    context,
                    Icons.location_on_outlined,
                    'Noktalar',
                    '',
                    colorScheme.secondary,
                    () => _switchToMapTab(),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: HomeWidgets.buildQuickAccessCard(
                    context,
                    Icons.local_shipping_outlined,
                    'Kargo Takibi',
                    '',
                    colorScheme.tertiary,
                    () => _navigateToCargo(context),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 32),
            
            // Duyurular
            Text(
              'Duyurular',
              style: GoogleFonts.inter(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: colorScheme.onSurface,
              ),
            ),
            
            const SizedBox(height: 16),
            
            HomeWidgets.buildAnnouncementCard(
              context,
              Icons.campaign,
              'Önemli Duyuru',
              'Yeni gönüllü eğitim programı başlıyor. Katılım için kayıt olun.',
              '1 gün önce',
              colorScheme.primary,
              true,
              () => HomeDialogs.showAnnouncementDialog(context, 'Önemli Duyuru', 'Yeni gönüllü eğitim programı başlıyor. Katılım için kayıt olun.'),
            ),
            
            const SizedBox(height: 12),
            
            HomeWidgets.buildAnnouncementCard(
              context,
              Icons.info_outline,
              'Sistem Güncellemesi',
              'Uygulama performans iyileştirmeleri yapıldı.',
              '3 gün önce',
              colorScheme.secondary,
              false,
              () => HomeDialogs.showAnnouncementDialog(context, 'Sistem Güncellemesi', 'Uygulama performans iyileştirmeleri yapıldı.'),
            ),
            
            const SizedBox(height: 12),
            
            HomeWidgets.buildAnnouncementCard(
              context,
              Icons.event,
              'Etkinlik Duyurusu',
              'Afet hazırlık semineri düzenlenecek. Detaylar için tıklayın.',
              '1 hafta önce',
              colorScheme.tertiary,
              false,
              () => HomeDialogs.showAnnouncementDialog(context, 'Etkinlik Duyurusu', 'Afet hazırlık semineri düzenlenecek. Detaylar için tıklayın.'),
            ),
            
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  /// Harita içeriğini oluşturur
  Widget _buildMapBody(BuildContext context) {
    return Column(
      children: [
        // Yardım Noktalarımız başlığı
        MapWidgets.buildMapHeader(context),
        
        // Harita alanı
        Expanded(
          child: Stack(
            children: [
              // Ana harita
              FlutterMap(
                mapController: _mapController,
                options: MapOptions(
                  initialCenter: _turkeyCenter,
                  initialZoom: 6.0,
                  minZoom: 5.0,
                  maxZoom: 18.0,
                  onTap: (tapPosition, point) {
                    setState(() {
                      _selectedHelpPoint = null;
                    });
                  },
                ),
                children: [
                  // OpenStreetMap tile layer
                  TileLayer(
                    urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    userAgentPackageName: 'com.ayika.app',
                    maxZoom: 19,
                  ),
                  
                  // Şehir marker'ları
                  MarkerLayer(
                    markers: MapWidgets.buildHelpPointMarkers(
                      onMarkerTap: (helpPoint) {
                        setState(() {
                          _selectedHelpPoint = helpPoint;
                        });
                        _mapController.move(helpPoint.coordinates, 10.0);
                      },
                    ),
                  ),
                  
                  // Kullanıcı konumu marker'ı
                  if (_currentLocation != null)
                    MarkerLayer(
                      markers: MapWidgets.buildUserLocationMarker(_currentLocation),
                    ),
                ],
              ),
              
              // Alt bilgi paneli
              if (_selectedHelpPoint != null)
                MapWidgets.buildHelpPointDetails(
                  context,
                  helpPoint: _selectedHelpPoint!,
                  onClose: () {
                    setState(() {
                      _selectedHelpPoint = null;
                    });
                  },
                  onGetDirections: () => LocationService.openDirections(context, _selectedHelpPoint!),
                ),
              
              // Sağ tarafta kontrol butonları
              MapWidgets.buildMapControls(
                context,
                onZoomIn: _zoomIn,
                onZoomOut: _zoomOut,
                onGetLocation: _getCurrentLocation,
                isLoadingLocation: _isLoadingLocation,
                currentLocation: _currentLocation,
              ),
            ],
          ),
        ),
      ],
    );
  }

  /// Ayika Nedir sayfasına yönlendir
  void _navigateToAbout(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => const AboutPage(),
      ),
    );
  }

  /// Harita sekmesine geç
  void _switchToMapTab() {
    setState(() {
      _selectedIndex = 1;
    });
  }

  /// Kargo Takibi sayfasına yönlendir
  void _navigateToCargo(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => const CargoTrackingPage(),
      ),
    );
  }

  /// Haritayı yakınlaştırır
  void _zoomIn() {
    final currentZoom = _mapController.camera.zoom;
    if (currentZoom < 18.0) {
      _mapController.move(_mapController.camera.center, currentZoom + 1);
    }
  }

  /// Haritayı uzaklaştırır
  void _zoomOut() {
    final currentZoom = _mapController.camera.zoom;
    if (currentZoom > 5.0) {
      _mapController.move(_mapController.camera.center, currentZoom - 1);
    }
  }

  /// Konum alma ve en yakın yardım noktasını bulma
  Future<void> _getCurrentLocation() async {
    if (_isLoadingLocation) return;

    setState(() {
      _isLoadingLocation = true;
    });

    try {
      final location = await LocationService.getCurrentLocation(context);
      if (location != null) {
        setState(() {
          _currentLocation = location;
        });

        // En yakın yardım noktasını bul
        final nearestPoint = LocationService.findNearestHelpPoint(location);
        final distance = LocationService.calculateDistance(location, nearestPoint.coordinates);

        // Haritayı konuma odakla
        _mapController.move(location, 12.0);

        // En yakın yardım noktası bilgisi ile başarı mesajı
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Konumunuz alındı!',
                    style: GoogleFonts.inter(
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'En yakın yardım noktası: ${nearestPoint.name}',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    'Mesafe: ${distance.toStringAsFixed(1)} km',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
              duration: const Duration(seconds: 4),
              backgroundColor: Colors.green,
              action: SnackBarAction(
                label: 'Yol Tarifi',
                textColor: Colors.white,
                onPressed: () => LocationService.openDirections(context, nearestPoint),
              ),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Konum alınamadı. Lütfen tekrar deneyin.',
              style: GoogleFonts.inter(),
            ),
            duration: const Duration(seconds: 3),
            backgroundColor: Colors.red,
            action: SnackBarAction(
              label: 'Tekrar Dene',
              textColor: Colors.white,
              onPressed: _getCurrentLocation,
            ),
          ),
        );
      }
    } finally {
      setState(() {
        _isLoadingLocation = false;
      });
    }
  }

}
