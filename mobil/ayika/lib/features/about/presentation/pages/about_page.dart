import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

/// Ayika Nedir sayfası - Proje hakkında detaylı bilgi
/// Material Design 3 ve Inter font kullanır
class AboutPage extends StatefulWidget {
  const AboutPage({super.key});

  @override
  State<AboutPage> createState() => _AboutPageState();
}

class _AboutPageState extends State<AboutPage> with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late Animation<double> _fadeAnimation;
  
  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeInOut,
    ));
    
    _fadeController.forward();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Scaffold(
      backgroundColor: colorScheme.surface,
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          onPressed: () => Navigator.of(context).pop(),
          icon: Icon(
            Icons.arrow_back,
            color: colorScheme.onSurface,
          ),
        ),
        title: Text(
          'Ayika Nedir?',
          style: GoogleFonts.inter(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: colorScheme.onSurface,
          ),
        ),
        centerTitle: true,
      ),
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Hero Section
              _buildHeroSection(context),
              
              const SizedBox(height: 32),
              
              // Proje Amacı
              _buildProjectPurpose(context),
              
              const SizedBox(height: 32),
              
              // Hedefler
              _buildGoals(context),
              
              const SizedBox(height: 32),
              
              // Biz Kimiz
              _buildTeamSection(context),
              
              const SizedBox(height: 32),
              
              // Sıkça Sorulan Sorular
              _buildFAQ(context),
              
              const SizedBox(height: 32),
              
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  /// Hero bölümü - Ana başlık ve açıklama
  Widget _buildHeroSection(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24.0),
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerLow,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: colorScheme.outline.withValues(alpha: 0.1),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Logo ve başlık
          Text(
            'Ayika',
            style: GoogleFonts.inter(
              fontSize: 32,
              fontWeight: FontWeight.w700,
              color: colorScheme.primary,
            ),
          ),
          
          const SizedBox(height: 16),
          
          Text(
            'Acil Yardım ve İhtiyaç Koordinasyon Ağı',
            style: GoogleFonts.inter(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: colorScheme.onSurface,
            ),
          ),
          
          const SizedBox(height: 12),
          
          Text(
            'TÜBİTAK 2209A projesi kapsamında geliştirilen, afet anlarında yardım koordinasyonunu kolaylaştıran, gönüllüleri organize eden ve ihtiyaç sahiplerine hızlı ulaşım sağlayan ücretsiz dijital platform.',
            style: GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: colorScheme.onSurfaceVariant,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  /// Proje amacı bölümü
  Widget _buildProjectPurpose(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Proje Amacı',
          style: GoogleFonts.inter(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: colorScheme.onSurface,
          ),
        ),
        
        const SizedBox(height: 16),
        
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20.0),
          decoration: BoxDecoration(
            color: colorScheme.surfaceContainerLow,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: colorScheme.outline.withValues(alpha: 0.1),
              width: 1,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.flag,
                    color: colorScheme.primary,
                    size: 24,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Misyonumuz',
                    style: GoogleFonts.inter(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: colorScheme.onSurface,
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 12),
              
              Text(
                'Afet yönetiminde dijital dönüşümü sağlayarak, yardım koordinasyonunu kolaylaştıran ve toplumsal dayanışmayı güçlendiren güvenli bir platform oluşturmak.',
                style: GoogleFonts.inter(
                  fontSize: 15,
                  fontWeight: FontWeight.w400,
                  color: colorScheme.onSurfaceVariant,
                  height: 1.5,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  /// Hedefler bölümü
  Widget _buildGoals(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Hedeflerimiz',
          style: GoogleFonts.inter(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: colorScheme.onSurface,
          ),
        ),
        
        const SizedBox(height: 16),
        
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20.0),
          decoration: BoxDecoration(
            color: colorScheme.surfaceContainerLow,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: colorScheme.outline.withValues(alpha: 0.1),
              width: 1,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildGoalItem(context, Icons.track_changes, 'Hızlı ve etkili yardım koordinasyonu'),
              _buildGoalItem(context, Icons.people, 'Gönüllü ağının güçlendirilmesi'),
              _buildGoalItem(context, Icons.security, 'Güvenli ve şeffaf platform', isLast: true),
            ],
          ),
        ),
      ],
    );
  }

  /// Hedef öğesi oluşturur
  Widget _buildGoalItem(BuildContext context, IconData icon, String text, {bool isLast = false}) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Column(
      children: [
        Row(
          children: [
            Icon(
              icon,
              size: 20,
              color: colorScheme.primary,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                text,
                style: GoogleFonts.inter(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: colorScheme.onSurface,
                ),
              ),
            ),
          ],
        ),
        if (!isLast) const SizedBox(height: 12),
      ],
    );
  }

  /// SSS bölümü
  Widget _buildFAQ(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Sıkça Sorulan Sorular',
          style: GoogleFonts.inter(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: colorScheme.onSurface,
          ),
        ),
        
        const SizedBox(height: 16),
        
        _buildFAQItem(
          context,
          'Platform nasıl çalışır?',
          'Ayika, afet anlarında yardım koordinasyonunu kolaylaştıran bir platformdur. Kullanıcılar mobil uygulama veya web sitesi üzerinden yardım talebinde bulunabilir, gönüllü olarak kayıt olabilir ve yardım malzemelerinin dağıtımını takip edebilir.',
        ),
        
        _buildFAQItem(
          context,
          'Verilerim güvende mi?',
          'Evet, verileriniz tamamen güvende. Güvenli şifreleme yöntemleri ile korunan iletişim sağlanır. Çok katmanlı güvenlik sistemi kullanılır ve tüm kişisel veriler en yüksek güvenlik standartlarında korunur.',
        ),
        
        _buildFAQItem(
          context,
          'Hangi afet türlerinde kullanılabilir?',
          'Ayika platformu deprem, sel, yangın, heyelan gibi tüm doğal afetlerde kullanılabilir. Ayrıca büyük kazalar, salgın hastalıklar ve diğer acil durumlarda da yardım koordinasyonu için etkili bir şekilde kullanılabilir.',
        ),
        
        _buildFAQItem(
          context,
          'Kargo takibi nasıl çalışır?',
          'Kargo gönderirken aldığınız takip numarasını girerek kargonuzun anlık durumunu ve konumunu öğrenebilirsiniz. Takip numaranız genellikle "AYK" ile başlar ve size SMS ile gönderilir. Sistem gerçek zamanlı konum takibi sağlar.',
        ),
      ],
    );
  }

  /// SSS öğesi oluşturur
  Widget _buildFAQItem(BuildContext context, String question, String answer) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerLow,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: colorScheme.outline.withValues(alpha: 0.1),
          width: 1,
        ),
      ),
      child: ExpansionTile(
        title: Text(
          question,
          style: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: colorScheme.onSurface,
          ),
        ),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Text(
              answer,
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                color: colorScheme.onSurfaceVariant,
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Ekip bölümü
  Widget _buildTeamSection(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    final teamMembers = [
      {
        'name': 'Taha Yunus Demir',
        'role': 'Bilgisayar Mühendisliği - 4. Sınıf',
        'university': 'Kütahya Dumlupınar Üniversitesi',
        'linkedin': 'https://linkedin.com/in/taha-yunus-demir',
        'github': 'https://github.com/tahayunusdemir',
      },
      {
        'name': 'Harun Celen',
        'role': 'Bilgisayar Mühendisliği - 4. Sınıf',
        'university': 'Kırıkkale Üniversitesi',
        'linkedin': 'https://linkedin.com/in/harun-celen-566665258',
        'github': 'https://github.com/HarunCelen',
      },
      {
        'name': 'Hamza Erdal',
        'role': 'Bilgisayar Mühendisliği - 4. Sınıf',
        'university': 'Kütahya Dumlupınar Üniversitesi',
        'linkedin': 'https://linkedin.com/in/hamza-erdal-29b58519b',
        'github': 'https://github.com/Toruk-Makto-01',
      },
      {
        'name': 'Doç. Dr. Durmuş Özdemir',
        'role': 'Akademik Danışman',
        'university': 'Kütahya Dumlupınar Üniversitesi',
      },
    ];
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Biz Kimiz?',
          style: GoogleFonts.inter(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: colorScheme.onSurface,
          ),
        ),
        
        const SizedBox(height: 16),
        
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20.0),
          decoration: BoxDecoration(
            color: colorScheme.surfaceContainerLow,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: colorScheme.outline.withValues(alpha: 0.1),
              width: 1,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ...teamMembers.map((member) => _buildTeamMemberCard(context, member)),
            ],
          ),
        ),
      ],
    );
  }

  /// Ekip üyesi kartı oluşturur
  Widget _buildTeamMemberCard(BuildContext context, Map<String, String> member) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: colorScheme.outline.withValues(alpha: 0.2),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                member['name']!,
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: colorScheme.onSurface,
                ),
              ),
              
              const SizedBox(height: 4),
              
              Text(
                member['role']!,
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: colorScheme.primary,
                ),
              ),
              
              const SizedBox(height: 2),
              
              Text(
                member['university']!,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
          
          if (member.containsKey('linkedin') || member.containsKey('github')) ...[
            const SizedBox(height: 12),
            
            Row(
              children: [
                if (member.containsKey('linkedin')) ...[
                  GestureDetector(
                    onTap: () => _launchUrl(member['linkedin']!),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.link,
                          size: 16,
                          color: colorScheme.primary,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'LinkedIn',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: colorScheme.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
                
                if (member.containsKey('linkedin') && member.containsKey('github'))
                  const SizedBox(width: 16),
                
                if (member.containsKey('github')) ...[
                  GestureDetector(
                    onTap: () => _launchUrl(member['github']!),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.code,
                          size: 16,
                          color: colorScheme.secondary,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'GitHub',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: colorScheme.secondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ],
        ],
      ),
    );
  }

  /// URL'yi tarayıcıda açar
  Future<void> _launchUrl(String urlString) async {
    final Uri url = Uri.parse(urlString);
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      // Hata durumunda kullanıcıya bilgi verilebilir
      debugPrint('URL açılamadı: $urlString');
    }
  }
}
