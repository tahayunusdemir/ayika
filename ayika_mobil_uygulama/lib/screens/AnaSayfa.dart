import 'package:flutter/material.dart';
import 'home_screen.dart';

class Anasayfa extends StatefulWidget {
  const Anasayfa({super.key});

  @override
  State<Anasayfa> createState() => _AnaSayfaState();
}

class _AnaSayfaState extends State<Anasayfa> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF2C3E50),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('AYİKA', 
          style: TextStyle(
            color: Colors.white,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications, color: Colors.white),
            onPressed: () {
              // TODO: Bildirimler sayfasına yönlendir
            },
          ),
        ],
      ),
      drawer: _buildDrawer(),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF2C3E50),
              Color(0xFF3498DB),
            ],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildEmergencySection(),
                  const SizedBox(height: 24),
                  _buildMainButtons(context),
                  const SizedBox(height: 24),
                  _buildQuickAccessSection(),
                  const SizedBox(height: 24),
                  _buildStatusSection(),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDrawer() {
    return Drawer(
      child: Container(
        color: Color(0xFF2C3E50),
        child: ListView(
          children: [
            UserAccountsDrawerHeader(
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
              ),
              accountName: Text(
                "Admin",
                style: TextStyle(color: Colors.white, fontSize: 18),
              ),
              accountEmail: Text(
                "admin@",
                style: TextStyle(color: Colors.white70),
              ),
              currentAccountPicture: CircleAvatar(
                backgroundColor: Colors.white.withOpacity(0.1),
                child: Icon(Icons.person, color: Colors.white, size: 40),
              ),
            ),
            _buildDrawerItem(Icons.person, 'Profil'),
            _buildDrawerItem(Icons.history, 'Yardım Geçmişi'),
            _buildDrawerItem(Icons.settings, 'Ayarlar'),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawerItem(IconData icon, String title) {
    return ListTile(
      leading: Icon(icon, color: Colors.white70),
      title: Text(title, style: TextStyle(color: Colors.white)),
      onTap: () {
        Navigator.of(context).pop();
        // TODO: İlgili sayfaya yönlendir
      },
    );
  }

  Widget _buildEmergencySection() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.red.withOpacity(0.1),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(
          color: Colors.red.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Acil Durum Bildirisi',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Şu anda aktif bir acil durum bildirisi bulunmamaktadır.',
              style: TextStyle(
                fontSize: 16,
                color: Colors.white70,
              ),
            ),
            const SizedBox(height: 12),
            ElevatedButton.icon(
              icon: Icon(Icons.warning_amber_rounded),
              label: Text('Acil Durum Bilgileri'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () {
                // TODO: Acil durum sayfasına yönlendir
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMainButtons(BuildContext context) {
    return Column(
      children: [
        _buildButton(
          context,
          'Yardım Almak İstiyorum',
          Icons.help_outline,
          'Acil ihtiyaçlarınız için yardım talep edin',
          () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const HomeScreen(isHelper: false),
              ),
            );
          },
        ),
        const SizedBox(height: 16),
        _buildButton(
          context,
          'Yardım Etmek İstiyorum',
          Icons.volunteer_activism,
          'Gönüllü olun veya yardım gönderin',
          () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const HomeScreen(isHelper: true),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildQuickAccessSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Hızlı Erişim',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildQuickAccessItem(
              icon: Icons.location_on,
              label: 'Yardım\nMerkezleri',
              onTap: () {
                // TODO: Yardım merkezleri sayfasına yönlendir
              },
            ),
            _buildQuickAccessItem(
              icon: Icons.local_shipping,
              label: 'Kargo\nTakibi',
              onTap: () {
                // TODO: Kargo takip sayfasına yönlendir
              },
            ),
            _buildQuickAccessItem(
              icon: Icons.volunteer_activism,
              label: 'Gönüllü\nOl',
              onTap: () {
                // TODO: Gönüllü sayfasına yönlendir
              },
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatusSection() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(
          color: Colors.white.withOpacity(0.2),
          width: 1,
        ),
      ),
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Text(
            'Güncel Durum',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          SizedBox(height: 12),
          Text(
            'Aktif Yardım Kampanyaları: 0\n'
            'Toplam Gönüllü: 0\n'
            'Ulaştırılan Yardım: 0',
            style: TextStyle(
              fontSize: 16,
              color: Colors.white70,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildButton(BuildContext context, String text, IconData icon,
      String description, VoidCallback onPressed) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(
          color: Colors.white.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(15),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                Icon(icon, size: 48, color: Colors.white),
                const SizedBox(height: 8),
                Text(
                  text,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.white70,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildQuickAccessItem({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(15),
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              shape: BoxShape.circle,
              border: Border.all(
                color: Colors.white.withOpacity(0.2),
                width: 1,
              ),
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              color: Colors.white70,
            ),
          ),
        ],
      ),
    );
  }
}