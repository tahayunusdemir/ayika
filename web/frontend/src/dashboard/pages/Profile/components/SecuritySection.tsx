import * as React from 'react';
import { Stack, Button, Typography, Box, Card, CardContent, CardHeader, Fade } from '@mui/material';
import { LockReset as LockResetIcon, Security as SecurityIcon } from '@mui/icons-material';

interface SecuritySectionProps {
  loading: boolean;
  onOpenPasswordReset: () => void;
}

const SecuritySection: React.FC<SecuritySectionProps> = React.memo(({
  loading,
  onOpenPasswordReset
}) => {
  return (
    <Fade in timeout={300}>
      <Card variant="outlined">
        <CardHeader
          avatar={<SecurityIcon color="primary" />}
          title={
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Güvenlik Ayarları
            </Typography>
          }
          sx={{ pb: 1 }}
        />
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hesabınızın güvenliği için şifrenizi düzenli olarak değiştirin ve güçlü bir şifre kullanın.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={onOpenPasswordReset}
            startIcon={<LockResetIcon />}
            disabled={loading}
            size="medium"
            sx={{
              fontWeight: 500
            }}
          >
            Şifre Değiştir
          </Button>
        </CardContent>
      </Card>
    </Fade>
  );
});

export default SecuritySection;
