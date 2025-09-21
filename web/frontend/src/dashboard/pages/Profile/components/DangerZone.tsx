import * as React from 'react';
import { Button, Typography, Box, Card, CardContent, CardHeader, Fade } from '@mui/material';
import { PauseCircle as PauseIcon } from '@mui/icons-material';

interface DangerZoneProps {
  loading: boolean;
  onOpenAccountDelete: () => void;
}

const DangerZone: React.FC<DangerZoneProps> = React.memo(({
  loading,
  onOpenAccountDelete
}) => {
  return (
    <Fade in timeout={400}>
      <Card variant="outlined" sx={{ borderColor: 'warning.main', backgroundColor: 'warning.50' }}>
        <CardHeader
          avatar={<PauseIcon color="warning" />}
          title={
            <Typography variant="h6" color="warning.main" sx={{ fontWeight: 600 }}>
              Hesap Yönetimi
            </Typography>
          }
          sx={{ pb: 1 }}
        />
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hesabınızı geçici olarak deaktif etmek istiyorsanız bu işlemi gerçekleştirebilirsiniz.
            Verileriniz korunur ve istediğiniz zaman hesabınızı yeniden aktif edebilirsiniz.
          </Typography>

          <Button
            variant="outlined"
            color="warning"
            onClick={onOpenAccountDelete}
            startIcon={<PauseIcon />}
            disabled={loading}
            size="medium"
            sx={{
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'warning.main',
                color: 'white',
                borderColor: 'warning.main'
              }
            }}
          >
            Hesabı Deaktif Et
          </Button>
        </CardContent>
      </Card>
    </Fade>
  );
});

export default DangerZone;
