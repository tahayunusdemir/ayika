import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

/// Ayika uygulamasının ana sayfası
/// rules.md kurallarına uygun Material Design 3 bileşenleri kullanır
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Scaffold(
      backgroundColor: colorScheme.surface,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Üst boşluk
              const SizedBox(height: 40),
              
              // Ana başlık ve logo alanı
              Center(
                child: Column(
                  children: [
                    // Uygulama ikonu/logo alanı
                    Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        color: colorScheme.primary,
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: colorScheme.primary.withValues(alpha: 0.3),
                            blurRadius: 20,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.volunteer_activism,
                        size: 60,
                        color: Colors.white,
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Uygulama adı
                    Text(
                      'Ayika',
                      style: theme.textTheme.displayMedium?.copyWith(
                        color: colorScheme.onSurface,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    
                    const SizedBox(height: 8),
                    
                    // Alt başlık
                    Text(
                      'Acil Yardım ve İhtiyaç Koordinasyon Ağı',
                      style: theme.textTheme.titleLarge?.copyWith(
                        color: colorScheme.onSurfaceVariant,
                        fontWeight: FontWeight.w400,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 48),
              
              // Açıklama kartı
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.info_outline,
                            color: colorScheme.primary,
                            size: 24,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            'Uygulama Hakkında',
                            style: theme.textTheme.headlineSmall?.copyWith(
                              color: colorScheme.onSurface,
                            ),
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 16),
                      
                      Text(
                        'Ayika, afet durumlarında acil yardım ve ihtiyaç koordinasyonunu sağlayan modern bir mobil uygulamadır. Gönüllüler, yardım kuruluşları ve afetzedeler arasında etkili iletişim kurarak yardım süreçlerini hızlandırır.',
                        style: theme.textTheme.bodyLarge?.copyWith(
                          color: colorScheme.onSurface,
                          height: 1.6,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              
              const SizedBox(height: 24),
              
              // Özellikler kartı
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.featured_play_list_outlined,
                            color: colorScheme.primary,
                            size: 24,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            'Ana Özellikler',
                            style: theme.textTheme.headlineSmall?.copyWith(
                              color: colorScheme.onSurface,
                            ),
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 20),
                      
                      // Özellik listesi
                      _buildFeatureItem(
                        context,
                        Icons.people_outline,
                        'Gönüllü Yönetimi',
                        'Gönüllü kayıt ve koordinasyon sistemi',
                        AppColors.featureColors['volunteer']!,
                      ),
                      
                      const SizedBox(height: 16),
                      
                      _buildFeatureItem(
                        context,
                        Icons.local_shipping_outlined,
                        'Lojistik Takip',
                        'Araç ve malzeme takip sistemi',
                        AppColors.featureColors['logistics']!,
                      ),
                      
                      const SizedBox(height: 16),
                      
                      _buildFeatureItem(
                        context,
                        Icons.inventory_2_outlined,
                        'Stok Yönetimi',
                        'Yardım malzemesi stok kontrolü',
                        AppColors.featureColors['inventory']!,
                      ),
                      
                      const SizedBox(height: 16),
                      
                      _buildFeatureItem(
                        context,
                        Icons.location_on_outlined,
                        'Konum Servisleri',
                        'Gerçek zamanlı konum takibi',
                        AppColors.featureColors['location']!,
                      ),
                      
                      const SizedBox(height: 16),
                      
                      _buildFeatureItem(
                        context,
                        Icons.help_outline,
                        'Yardım Talepleri',
                        'İhtiyaç bildirimi ve koordinasyon',
                        AppColors.featureColors['help']!,
                      ),
                    ],
                  ),
                ),
              ),
              
              const SizedBox(height: 32),
              
              // Alt bilgi
              Center(
                child: Column(
                  children: [
                    Text(
                      'Sürüm 1.0.0',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: colorScheme.onSurfaceVariant,
                      ),
                    ),
                    
                    const SizedBox(height: 8),
                    
                    Text(
                      '2025 • Material Design 3',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
      
      // Acil yardım butonu (FloatingActionButton)
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // Acil yardım çağrısı fonksiyonu
          _showEmergencyDialog(context);
        },
        backgroundColor: AppColors.emergencyPrimary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.emergency),
        label: const Text('Acil Yardım'),
      ),
    );
  }

  /// Özellik öğesi widget'ı oluşturur
  Widget _buildFeatureItem(
    BuildContext context,
    IconData icon,
    String title,
    String description,
    Color color,
  ) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            color: color,
            size: 20,
          ),
        ),
        
        const SizedBox(width: 16),
        
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: theme.textTheme.titleMedium?.copyWith(
                  color: colorScheme.onSurface,
                ),
              ),
              
              const SizedBox(height: 4),
              
              Text(
                description,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  /// Acil yardım dialog'unu gösterir
  void _showEmergencyDialog(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          icon: Icon(
            Icons.emergency,
            color: AppColors.emergencyPrimary,
            size: 32,
          ),
          title: Text(
            'Acil Yardım',
            style: theme.textTheme.headlineSmall?.copyWith(
              color: colorScheme.onSurface,
            ),
          ),
          content: Text(
            'Acil yardım çağrısı özelliği yakında aktif olacaktır. Bu özellik ile anında yardım talebinde bulunabileceksiniz.',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: colorScheme.onSurface,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Tamam'),
            ),
          ],
        );
      },
    );
  }
}
