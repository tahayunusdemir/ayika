import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Stack,
  IconButton,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Shipment } from '../types';
import { getCargoTypeLabel } from '../data/contentOptions';

interface ShipmentDetailDialogProps {
  open: boolean;
  shipment: Shipment | null;
  onClose: () => void;
  onEdit?: (shipment: Shipment) => void;
}

export default function ShipmentDetailDialog({
  open,
  shipment,
  onClose,
  onEdit,
}: ShipmentDetailDialogProps) {
  if (!shipment) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(shipment);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'hazirlaniyor':
        return {
          color: 'primary' as const,
          icon: <InventoryIcon sx={{ fontSize: 18 }} />,
          label: 'Hazırlanıyor'
        };
      case 'yolda':
        return {
          color: 'secondary' as const,
          icon: <LocalShippingIcon sx={{ fontSize: 18 }} />,
          label: 'Yolda'
        };
      case 'teslim_edildi':
        return {
          color: 'success' as const,
          icon: <CheckCircleIcon sx={{ fontSize: 18 }} />,
          label: 'Teslim Edildi'
        };
      case 'iptal_edildi':
        return {
          color: 'error' as const,
          icon: <CancelIcon sx={{ fontSize: 18 }} />,
          label: 'İptal Edildi'
        };
      default:
        return {
          color: 'default' as const,
          icon: <InventoryIcon sx={{ fontSize: 18 }} />,
          label: 'Bilinmiyor'
        };
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '70vh',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" component="div">
              Kargo Detayları
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {shipment.kargo_no}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Temel Bilgiler */}
          <Grid size={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Temel Bilgiler
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Durum
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      {(() => {
                        const config = getStatusConfig(shipment.durum);
                        return (
                          <Chip 
                            icon={config.icon}
                            label={config.label}
                            color={config.color}
                            size="small"
                            variant="filled"
                            sx={{
                              fontWeight: 500,
                              '& .MuiChip-icon': {
                                marginLeft: '4px',
                                marginRight: '-2px'
                              }
                            }}
                          />
                        );
                      })()}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      İçerik
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {shipment.icerik}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getCargoTypeLabel(shipment.kargo_tipi)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Rota
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {shipment.cikis_yeri_display} → {shipment.ulasacagi_yer_display}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Ağırlık / Hacim / Miktar
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {shipment.agirlik} kg / {shipment.hacim} m³ / {shipment.miktar} adet
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Zaman Bilgisi */}
          <Grid size={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Zaman Bilgisi
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Oluşturulma Tarihi
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {formatDate(shipment.olusturulma_tarihi)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Son Güncelleme
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {formatDate(shipment.son_degisiklik)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Gönderici Bilgileri */}
          <Grid size={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gönderici Bilgileri
                </Typography>
                {shipment.anonim_gonderici ? (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 2,
                    backgroundColor: 'grey.50',
                    borderRadius: 1,
                    border: '1px dashed',
                    borderColor: 'grey.300'
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Gönderici bilgileri anonim olarak işlenmiştir
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    <Grid size={3}>
                      <Typography variant="body2" color="text.secondary">
                        Ad Soyad
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5 }}>
                        {shipment.gonderici_ad} {shipment.gonderici_soyad}
                      </Typography>
                    </Grid>
                    <Grid size={3}>
                      {shipment.gonderici_telefon && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Telefon
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {shipment.gonderici_telefon}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    <Grid size={6}>
                      {shipment.gonderici_email && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            E-posta
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {shipment.gonderici_email}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Gönüllü Bilgileri */}
          <Grid size={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gönüllü Bilgileri
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={4}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Toplama Gönüllüsü
                    </Typography>
                    {shipment.toplama_gonullusu_detail ? (
                      <Box>
                        <Typography variant="body1">
                          {shipment.toplama_gonullusu_detail.full_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shipment.toplama_gonullusu_detail.gonulluluk_no}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {shipment.toplama_gonullusu_detail.sehir}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Atanmamış
                      </Typography>
                    )}
                  </Grid>
                  <Grid size={4}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Taşıma Gönüllüsü
                    </Typography>
                    {shipment.tasima_gonullusu_detail ? (
                      <Box>
                        <Typography variant="body1">
                          {shipment.tasima_gonullusu_detail.full_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shipment.tasima_gonullusu_detail.gonulluluk_no}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {shipment.tasima_gonullusu_detail.sehir}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Atanmamış
                      </Typography>
                    )}
                  </Grid>
                  <Grid size={4}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Dağıtım Gönüllüsü
                    </Typography>
                    {shipment.dagitim_gonullusu_detail ? (
                      <Box>
                        <Typography variant="body1">
                          {shipment.dagitim_gonullusu_detail.full_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shipment.dagitim_gonullusu_detail.gonulluluk_no}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {shipment.dagitim_gonullusu_detail.sehir}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Atanmamış
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Özel Notlar */}
          {shipment.ozel_not && (
            <Grid size={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Özel Notlar
                  </Typography>
                  <Typography variant="body1">
                    {shipment.ozel_not}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'flex-end' }}>
        {onEdit && (
          <Button
            variant="contained"
            onClick={handleEdit}
          >
            Düzenle
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
