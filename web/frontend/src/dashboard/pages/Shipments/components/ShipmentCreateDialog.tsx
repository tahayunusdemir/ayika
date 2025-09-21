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
import { ShipmentFormData, CargoType } from '../types';
import ShipmentForm from './ShipmentForm';

interface ShipmentCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ShipmentFormData) => void;
  loading?: boolean;
}

const initialFormData: ShipmentFormData = {
  gonderici_ad: '',
  gonderici_soyad: '',
  gonderici_telefon: undefined,
  gonderici_email: undefined,
  gizlilik_durumu: false,
  icerik_adi: '',
  kargo_tipi: '' as CargoType,
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
};

export default function ShipmentCreateDialog({
  open,
  onClose,
  onSubmit,
  loading = false,
}: ShipmentCreateDialogProps) {
  const [formData, setFormData] = React.useState<ShipmentFormData>(initialFormData);
  const [errors, setErrors] = React.useState<Partial<Record<keyof ShipmentFormData, string>>>({});

  React.useEffect(() => {
    if (open) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShipmentFormData, string>> = {};

    if (!formData.gizlilik_durumu && !formData.gonderici_ad.trim()) {
      newErrors.gonderici_ad = 'Gönderici adı gereklidir';
    }

    if (!formData.gizlilik_durumu && !formData.gonderici_soyad.trim()) {
      newErrors.gonderici_soyad = 'Gönderici soyadı gereklidir';
    }

    if (!formData.gizlilik_durumu && !formData.gonderici_telefon?.trim()) {
      newErrors.gonderici_telefon = 'Telefon numarası gereklidir';
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

    if (!formData.kargo_tipi) {
      newErrors.kargo_tipi = 'Kargo tipi seçilmelidir';
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
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

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
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            Yeni Kargo Ekle
          </Typography>
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
          {loading ? 'Kaydediliyor...' : 'Kargo Ekle'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
