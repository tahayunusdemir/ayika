import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:latlong2/latlong.dart';
import '../../../map/data/help_points.dart';

/// Harita için widget'lar
class MapWidgets {
  /// Harita kontrol butonları
  static Widget buildMapControls(
    BuildContext context, {
    required VoidCallback onZoomIn,
    required VoidCallback onZoomOut,
    required VoidCallback onGetLocation,
    required bool isLoadingLocation,
    required LatLng? currentLocation,
  }) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Positioned(
      top: 16,
      right: 16,
      child: Column(
        children: [
          // Zoom In butonu
          FloatingActionButton.small(
            heroTag: "zoom_in",
            onPressed: onZoomIn,
            backgroundColor: colorScheme.surface,
            child: Icon(
              Icons.add,
              color: colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 8),
          // Zoom Out butonu
          FloatingActionButton.small(
            heroTag: "zoom_out",
            onPressed: onZoomOut,
            backgroundColor: colorScheme.surface,
            child: Icon(
              Icons.remove,
              color: colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 8),
          // Kullanıcı konumunu al butonu
          FloatingActionButton.small(
            heroTag: "get_location",
            onPressed: isLoadingLocation ? null : onGetLocation,
            backgroundColor: currentLocation != null 
                ? Colors.green 
                : colorScheme.secondary,
            child: isLoadingLocation
                ? SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        colorScheme.onSecondary,
                      ),
                    ),
                  )
                : Icon(
                    currentLocation != null 
                        ? Icons.gps_fixed 
                        : Icons.gps_not_fixed,
                    color: currentLocation != null 
                        ? Colors.white 
                        : colorScheme.onSecondary,
                  ),
          ),
        ],
      ),
    );
  }

  /// Yardım noktası marker'ları
  static List<Marker> buildHelpPointMarkers({
    required Function(HelpPoint) onMarkerTap,
  }) {
    return HelpPointsData.turkeyHelpPoints.map((helpPoint) {
      return Marker(
        point: helpPoint.coordinates,
        width: 24,
        height: 24,
        child: GestureDetector(
          onTap: () => onMarkerTap(helpPoint),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.blue,
              shape: BoxShape.circle,
              border: Border.all(
                color: Colors.white,
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.2),
                  blurRadius: 3,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
            child: const Center(
              child: Icon(
                Icons.location_on,
                color: Colors.white,
                size: 14,
              ),
            ),
          ),
        ),
      );
    }).toList();
  }

  /// Kullanıcı konumu marker'ı
  static List<Marker> buildUserLocationMarker(LatLng? currentLocation) {
    if (currentLocation == null) return [];
    
    return [
      Marker(
        point: currentLocation,
        width: 40,
        height: 40,
        child: Container(
          decoration: BoxDecoration(
            color: Colors.green,
            shape: BoxShape.circle,
            border: Border.all(
              color: Colors.white,
              width: 3,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.3),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: const Center(
            child: Icon(
              Icons.person_pin_circle,
              color: Colors.white,
              size: 20,
            ),
          ),
        ),
      ),
    ];
  }

  /// Yardım noktası detay paneli
  static Widget buildHelpPointDetails(
    BuildContext context, {
    required HelpPoint helpPoint,
    required VoidCallback onClose,
    required VoidCallback onGetDirections,
  }) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        margin: const EdgeInsets.all(16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 8,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Başlık satırı
            Row(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: const BoxDecoration(
                    color: Colors.blue,
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.location_on,
                      color: Colors.white,
                      size: 18,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    helpPoint.name,
                    style: GoogleFonts.inter(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: colorScheme.onSurface,
                    ),
                  ),
                ),
                IconButton(
                  onPressed: onClose,
                  icon: Icon(
                    Icons.close,
                    color: colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 16),
            
            // Yol tarifi butonu
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: onGetDirections,
                icon: const Icon(Icons.directions, size: 18),
                label: Text(
                  'Yol Tarifi Al',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: colorScheme.primary,
                  foregroundColor: colorScheme.onPrimary,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Harita başlığı
  static Widget buildMapHeader(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        border: Border(
          bottom: BorderSide(
            color: colorScheme.outline.withValues(alpha: 0.2),
            width: 1,
          ),
        ),
      ),
      child: Text(
        'Yardım Noktalarımız',
        style: GoogleFonts.inter(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: colorScheme.onSurface,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }
}
