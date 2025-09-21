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
  List,
  ListItem,
  ListItemText,
  Stack,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Shipment } from '../types';
import { getStatusLabel, getCargoTypeLabel, getSecurityApprovalLabel } from '../data/contentOptions';

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
              {shipment.takip_no}
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
          <Grid size={4}>
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
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {getStatusLabel(shipment.kargo_durumu)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      İçerik
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {shipment.icerik.icerik_adi}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getCargoTypeLabel(shipment.icerik.kargo_tipi)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Konum
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {shipment.konum.sehir}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Ağırlık/Hacim
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {shipment.icerik.agirlik_hacim || 'Belirtilmemiş'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Güvenlik Onayı
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }} color={shipment.guvenlik_onayi === 'kontrol edildi' ? 'success.main' : 'error.main'}>
                      {getSecurityApprovalLabel(shipment.guvenlik_onayi)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Durum Geçmişi */}
          <Grid size={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Durum Geçmişi
                </Typography>
                <List dense sx={{ mt: 1 }}>
                  {shipment.durum_gecmisi.map((history, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                      <ListItemText
                        primary={`${index + 1}. ${history.aciklama}`}
                        secondary={formatDate(history.tarih)}
                        primaryTypographyProps={{ variant: 'body2', fontSize: '0.875rem' }}
                        secondaryTypographyProps={{ variant: 'caption', fontSize: '0.75rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Zaman Bilgisi */}
          <Grid size={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Zaman Bilgisi
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Gönderim Tarihi
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {formatDate(shipment.gonderim_tarihi)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Son Güncelleme
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {formatDate(shipment.son_guncelleme_tarihi)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Sender Info with Location */}
          <Grid size={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gönderici Bilgileri
                </Typography>
                {shipment.gonderici.gizlilik_durumu ? (
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
                    <Grid size={4}>
                      <Typography variant="body2" color="text.secondary">
                        Ad Soyad
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5 }}>
                        {shipment.gonderici.ad} {shipment.gonderici.soyad}
                      </Typography>
                    </Grid>
                    <Grid size={4}>
                      {shipment.gonderici.telefon && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Telefon
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {shipment.gonderici.telefon}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    <Grid size={4}>
                      {shipment.gonderici.email && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            E-posta
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {shipment.gonderici.email}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Volunteers Info */}
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
                    <Box>
                      <Typography variant="body1">
                        {shipment.gorevliler.yardim_toplama_gonullusu.ad} {shipment.gorevliler.yardim_toplama_gonullusu.soyad}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {shipment.gorevliler.yardim_toplama_gonullusu.gonulluluk_no}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={4}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Taşıma Gönüllüsü
                    </Typography>
                    {shipment.gorevliler.yardim_tasima_gorevlisi ? (
                      <Box>
                        <Typography variant="body1">
                          {shipment.gorevliler.yardim_tasima_gorevlisi.ad} {shipment.gorevliler.yardim_tasima_gorevlisi.soyad}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shipment.gorevliler.yardim_tasima_gorevlisi.gonulluluk_no}
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
                    {shipment.gorevliler.yardim_dagitim_gorevlisi ? (
                      <Box>
                        <Typography variant="body1">
                          {shipment.gorevliler.yardim_dagitim_gorevlisi.ad} {shipment.gorevliler.yardim_dagitim_gorevlisi.soyad}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shipment.gorevliler.yardim_dagitim_gorevlisi.gonulluluk_no}
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

          {/* Special Notes */}
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
