import 'package:flutter/material.dart';

class HelperRegistrationScreen extends StatefulWidget {
  @override
  _HelperRegistrationScreenState createState() => _HelperRegistrationScreenState();
}

class _HelperRegistrationScreenState extends State<HelperRegistrationScreen> {
  bool _isIndividual = true;
  final _formKeyIndividual = GlobalKey<FormState>();
  final _formKeyCorporate = GlobalKey<FormState>();

  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();

  final _companyNameController = TextEditingController();
  final _companyEmailController = TextEditingController();
  final _companyPhoneController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF2C3E50),
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
          child: Container(
            height: MediaQuery.of(context).size.height,
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Geri butonu ve başlık
                    Row(
                      children: [
                        IconButton(
                          icon: Icon(Icons.arrow_back_ios, color: Colors.white),
                          onPressed: () => Navigator.pop(context),
                        ),
                        Text(
                          'Yardım Eden Kayıt',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 40),
                    // Logo
                    Center(
                      child: Container(
                        padding: EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.handshake_outlined,
                          size: 80,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    SizedBox(height: 40),
                    // Seçim butonları
                    Container(
                      padding: EdgeInsets.all(5),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: _buildSelectionButton(
                              'Bireysel',
                              Icons.person_outline,
                              true,
                            ),
                          ),
                          Expanded(
                            child: _buildSelectionButton(
                              'Kurumsal',
                              Icons.business_outlined,
                              false,
                            ),
                          ),
                        ],
                      ),
                    ),
                    SizedBox(height: 30),
                    // Form Container
                    Container(
                      padding: EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: Colors.white.withOpacity(0.2),
                          width: 1,
                        ),
                      ),
                      child: AnimatedSwitcher(
                        duration: Duration(milliseconds: 300),
                        child: _isIndividual
                            ? _buildIndividualForm()
                            : _buildCorporateForm(),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSelectionButton(String label, IconData icon, bool isIndividual) {
    final isSelected = _isIndividual == isIndividual;
    return GestureDetector(
      onTap: () => setState(() => _isIndividual = isIndividual),
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: isSelected ? Color(0xFF2C3E50) : Colors.white,
            ),
            SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? Color(0xFF2C3E50) : Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIndividualForm() {
    return Form(
      key: _formKeyIndividual,
      child: Column(
        children: [
          _buildTextField(
            controller: _nameController,
            label: 'Ad Soyad',
            hint: 'Adınızı ve soyadınızı girin',
            icon: Icons.person,
          ),
          SizedBox(height: 20),
          _buildTextField(
            controller: _emailController,
            label: 'Email',
            hint: 'Email adresinizi girin',
            icon: Icons.email,
          ),
          SizedBox(height: 20),
          _buildTextField(
            controller: _phoneController,
            label: 'Telefon',
            hint: 'Telefon numaranızı girin',
            icon: Icons.phone,
          ),
          SizedBox(height: 30),
          _buildButton(
            title: 'Bireysel Kayıt Ol',
            icon: Icons.person_add,
            onPressed: () {
              if (_formKeyIndividual.currentState!.validate()) {
                // Kayıt işlemleri
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildCorporateForm() {
    return Form(
      key: _formKeyCorporate,
      child: Column(
        children: [
          _buildTextField(
            controller: _companyNameController,
            label: 'Firma Adı',
            hint: 'Firma adını girin',
            icon: Icons.business,
          ),
          SizedBox(height: 20),
          _buildTextField(
            controller: _companyEmailController,
            label: 'Firma Email',
            hint: 'Firma email adresini girin',
            icon: Icons.email,
          ),
          SizedBox(height: 20),
          _buildTextField(
            controller: _companyPhoneController,
            label: 'Firma Telefon',
            hint: 'Firma telefon numarasını girin',
            icon: Icons.phone,
          ),
          SizedBox(height: 30),
          _buildButton(
            title: 'Kurumsal Kayıt Ol',
            icon: Icons.business_center,
            onPressed: () {
              if (_formKeyCorporate.currentState!.validate()) {
                // Kayıt işlemleri
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
  }) {
    return TextFormField(
      controller: controller,
      style: TextStyle(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: Colors.white70),
        hintText: hint,
        hintStyle: TextStyle(color: Colors.white60),
        prefixIcon: Icon(icon, color: Colors.white70),
        filled: true,
        fillColor: Colors.white.withOpacity(0.1),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.white.withOpacity(0.3)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.white.withOpacity(0.3)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.white, width: 2),
        ),
      ),
      validator: (value) {
        if (value == null || value.isEmpty) {
          return '$label boş bırakılamaz';
        }
        if (label.contains('Email') && 
            !RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
          return 'Geçerli bir email adresi girin';
        }
        if (label.contains('Telefon') && 
            !RegExp(r'^\d{10,11}$').hasMatch(value)) {
          return 'Geçerli bir telefon numarası girin';
        }
        return null;
      },
    );
  }

  Widget _buildButton({
    required String title,
    required IconData icon,
    required VoidCallback onPressed,
  }) {
    return Container(
      width: double.infinity,
      height: 56,
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: Color(0xFF2C3E50).withOpacity(0.3),
            offset: Offset(0, 4),
            blurRadius: 5.0,
          ),
        ],
      ),
      child: ElevatedButton.icon(
        icon: Icon(icon, color: Colors.white),
        label: Text(
          title,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: Color(0xFF2C3E50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          elevation: 0,
        ),
        onPressed: onPressed,
      ),
    );
  }
}
