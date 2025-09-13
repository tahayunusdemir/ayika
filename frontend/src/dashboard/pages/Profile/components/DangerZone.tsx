import * as React from 'react';
import { Button, Typography, Box, Card, CardContent, CardHeader, Fade } from '@mui/material';
import { DeleteForever as DeleteForeverIcon } from '@mui/icons-material';

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
      <Card variant="outlined" sx={{ borderColor: 'error.main', backgroundColor: 'error.50' }}>
        <CardHeader
          avatar={<DeleteForeverIcon color="error" />}
          title={
            <Typography variant="h6" color="error.main" sx={{ fontWeight: 600 }}>
              Tehlikeli Alan
            </Typography>
          }
          sx={{ pb: 1 }}
        />
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hesabınızı kalıcı olarak silmek istiyorsanız bu işlemi gerçekleştirebilirsiniz.
            Bu işlem geri alınamaz ve tüm verileriniz silinir.
          </Typography>

          <Button
            variant="outlined"
            color="error"
            onClick={onOpenAccountDelete}
            startIcon={<DeleteForeverIcon />}
            disabled={loading}
            size="medium"
            sx={{
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'error.main',
                color: 'white',
                borderColor: 'error.main'
              }
            }}
          >
            Hesabı Kalıcı Olarak Sil
          </Button>
        </CardContent>
      </Card>
    </Fade>
  );
});

export default DangerZone;
