import 'package:ayika_mobil_uygulama/screens/NeedHelpRegistratino.dart';
import 'package:flutter/material.dart';
import 'package:ayika_mobil_uygulama/screens/LoginScreen.dart';
import 'HelperRegistrationScreen.dart';

class HomeScreen extends StatelessWidget {
  final bool isHelper; // Yardım eden mi yoksa alan mı olduğunu belirlemek için

  const HomeScreen({Key? key, required this.isHelper}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 30.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo veya Icon
                Container(
                  padding: EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.home_outlined,
                    size: 80,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 40),
                // Hoş Geldiniz Yazısı
                Text(
                  'Hoş Geldiniz',
                  style: TextStyle(
                    fontSize: 42,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: 1.5,
                    shadows: [
                      Shadow(
                        color: Colors.black26,
                        offset: Offset(2, 2),
                        blurRadius: 6,
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 10),
                Text(
                  'Hesabınıza giriş yapın veya yeni hesap oluşturun',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.white70,
                    letterSpacing: 0.5,
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 60),
                // Giriş Yap Butonu
                _buildButton(
                  context: context,
                  title: 'Giriş Yap',
                  icon: Icons.login_rounded,
                  color: Colors.white,
                  textColor: Color(0xFF2C3E50),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => LoginScreen()),
                    );
                  },
                ),
                SizedBox(height: 20),
                // Kayıt Ol Butonu
                _buildButton(
                  context: context,
                  title: 'Kayıt Ol',
                  icon: Icons.person_add_rounded,
                  color: Colors.transparent,
                  textColor: Colors.white,
                  isBordered: true,
                  onPressed: () {
                    if (isHelper) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => HelperRegistrationScreen()),
                      );
                    } else {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => NeedyRegistrationScreen()),
                      );
                    }
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildButton({
    required BuildContext context,
    required String title,
    required IconData icon,
    required Color color,
    required Color textColor,
    bool isBordered = false,
    required VoidCallback onPressed,
  }) {
    return Container(
      width: double.infinity,
      height: 56,
      decoration: BoxDecoration(
        boxShadow: isBordered
            ? []
            : [
          BoxShadow(
            color: Colors.black26,
            offset: Offset(0, 4),
            blurRadius: 5.0,
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          padding: EdgeInsets.symmetric(horizontal: 20),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
            side: isBordered
                ? BorderSide(color: Colors.white, width: 2)
                : BorderSide.none,
          ),
          elevation: 0,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: textColor,
              size: 24,
            ),
            SizedBox(width: 10),
            Text(
              title,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: textColor,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
