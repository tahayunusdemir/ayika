import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class CustomPasswordValidator:
    """
    Şifre doğrulama kuralları:
    - Minimum 8 karakter
    - En az 1 büyük harf
    - En az 1 küçük harf
    - En az 1 özel karakter (!@#$%^&*)
    """
    
    def validate(self, password, user=None):
        if len(password) < 8:
            raise ValidationError(
                _('Şifre en az 8 karakter olmalıdır.'),
                code='password_too_short',
            )
        
        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                _('Şifre en az bir büyük harf içermelidir.'),
                code='password_no_upper',
            )
        
        if not re.search(r'[a-z]', password):
            raise ValidationError(
                _('Şifre en az bir küçük harf içermelidir.'),
                code='password_no_lower',
            )
        
        if not re.search(r'[!@#$%^&*]', password):
            raise ValidationError(
                _('Şifre en az bir özel karakter (!@#$%^&*) içermelidir.'),
                code='password_no_special',
            )

    def get_help_text(self):
        return _(
            'Şifreniz en az 8 karakter olmalı ve en az bir büyük harf, '
            'bir küçük harf ve bir özel karakter (!@#$%^&*) içermelidir.'
        )
