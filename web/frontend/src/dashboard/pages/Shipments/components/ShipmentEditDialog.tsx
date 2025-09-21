import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Shipment, ShipmentFormData } from '../types';
import ShipmentForm from './ShipmentForm';

interface ShipmentEditDialogProps {
  open: boolean;
  shipment: Shipment | null;
  onClose: () => void;
  onSubmit: (id: string, data: ShipmentFormData) => void;
  loading?: boolean;
}

export default function ShipmentEditDialog({
  open,
  shipment,
  onClose,
  onSubmit,
  loading = false,
}: ShipmentEditDialogProps) {
  const [formData, setFormData] = React.useState<ShipmentFormData>({
    gonderici_ad: '',
    gonderici_soyad: '',
    gonderici_telefon: undefined,
    gonderici_email: undefined,
    gizlilik_durumu: false,
    icerik_adi: '',
    kargo_tipi: 'gıda',
    agirlik_hacim: undefined,
    sehir: '',
    toplama_gonullusu_ad: '',
    toplama_gonullusu_soyad: '',
    toplama_gonullusu_no: '',
    tasima_gorevlisi_ad: undefined,
    tasima_gorevlisi_soyad: undefined,
    tasima_gorevlisi_no: undefined,
    dagitim_gorevlisi_ad: undefined,
    dagitim_gorevlisi_soyad: undefined,
    dagitim_gorevlisi_no: undefined,
    kargo_durumu: 'hazırlanıyor',
    guvenlik_onayi: 'kontrol edilmedi',
    ozel_not: undefined,
  });
  const [errors, setErrors] = React.useState<Partial<Record<keyof ShipmentFormData, string>>>({});

  React.useEffect(() => {
    if (open && shipment) {
      setFormData({
        gonderici_ad: shipment.gonderici.ad,
        gonderici_soyad: shipment.gonderici.soyad,
        gonderici_telefon: shipment.gonderici.telefon,
        gonderici_email: shipment.gonderici.email,
        gizlilik_durumu: shipment.gonderici.gizlilik_durumu,
        icerik_adi: shipment.icerik.icerik_adi,
        kargo_tipi: shipment.icerik.kargo_tipi,
        agirlik_hacim: shipment.icerik.agirlik_hacim?.toString(),
        sehir: shipment.konum.sehir,
        toplama_gonullusu_ad: shipment.gorevliler.yardim_toplama_gonullusu.ad,
        toplama_gonullusu_soyad: shipment.gorevliler.yardim_toplama_gonullusu.soyad,
        toplama_gonullusu_no: shipment.gorevliler.yardim_toplama_gonullusu.gonulluluk_no,
        tasima_gorevlisi_ad: shipment.gorevliler.yardim_tasima_gorevlisi?.ad,
        tasima_gorevlisi_soyad: shipment.gorevliler.yardim_tasima_gorevlisi?.soyad,
        tasima_gorevlisi_no: shipment.gorevliler.yardim_tasima_gorevlisi?.gonulluluk_no,
        dagitim_gorevlisi_ad: shipment.gorevliler.yardim_dagitim_gorevlisi?.ad,
        dagitim_gorevlisi_soyad: shipment.gorevliler.yardim_dagitim_gorevlisi?.soyad,
        dagitim_gorevlisi_no: shipment.gorevliler.yardim_dagitim_gorevlisi?.gonulluluk_no,
        kargo_durumu: shipment.kargo_durumu,
        guvenlik_onayi: shipment.guvenlik_onayi,
        ozel_not: shipment.ozel_not,
      });
      setErrors({});
    }
  }, [open, shipment]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShipmentFormData, string>> = {};

    if (!formData.gizlilik_durumu && !formData.gonderici_ad.trim()) {
      newErrors.gonderici_ad = 'Gönderici adı gereklidir';
    }

    if (!formData.gizlilik_durumu && !formData.gonderici_soyad.trim()) {
      newErrors.gonderici_soyad = 'Gönderici soyadı gereklidir';
    }

    if (!formData.toplama_gonullusu_ad.trim()) {
      newErrors.toplama_gonullusu_ad = 'Toplama gönüllüsü adı gereklidir';
    }

    if (!formData.toplama_gonullusu_soyad.trim()) {
      newErrors.toplama_gonullusu_soyad = 'Toplama gönüllüsü soyadı gereklidir';
    }

    if (!formData.toplama_gonullusu_no.trim()) {
      newErrors.toplama_gonullusu_no = 'Gönüllülük numarası gereklidir';
    }

    if (!formData.sehir.trim()) {
      newErrors.sehir = 'Şehir seçilmelidir';
    }

    if (!formData.icerik_adi.trim()) {
      newErrors.icerik_adi = 'İçerik adı gereklidir';
    }

    // Email validation if provided
    if (formData.gonderici_email && formData.gonderici_email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.gonderici_email)) {
        newErrors.gonderici_email = 'Geçerli bir e-posta adresi giriniz';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (shipment && validateForm()) {
      onSubmit(shipment.id, formData);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!shipment) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
              Kargo Düzenle
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
              {shipment.takip_no} - {shipment.kargo_durumu}
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            disabled={loading}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ mt: 1 }}>
          <ShipmentForm
            formData={formData}
            onChange={setFormData}
            errors={errors}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          size="large"
        >
          İptal
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          size="large"
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
