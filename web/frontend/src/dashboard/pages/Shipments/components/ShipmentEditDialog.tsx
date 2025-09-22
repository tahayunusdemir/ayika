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
import { Shipment, ShipmentFormData, CargoType } from '../types';
import ShipmentForm from './ShipmentForm';

interface ShipmentEditDialogProps {
  open: boolean;
  shipment: Shipment | null;
  onClose: () => void;
  onSubmit: (id: number, data: ShipmentFormData) => void;
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
    anonim_gonderici: false,
    gonderici_ad: '',
    gonderici_soyad: '',
    gonderici_telefon: '',
    gonderici_email: '',
    cikis_yeri: '',
    ulasacagi_yer: '',
    agirlik: '',
    hacim: '',
    miktar: 1,
    durum: 'hazirlaniyor',
    kargo_tipi: '' as CargoType,
    icerik: '',
    toplama_gonullusu: undefined,
    tasima_gonullusu: undefined,
    dagitim_gonullusu: undefined,
    ozel_not: '',
  });
  const [errors, setErrors] = React.useState<Partial<Record<keyof ShipmentFormData, string>>>({});

  React.useEffect(() => {
    if (open && shipment) {
      setFormData({
        anonim_gonderici: shipment.anonim_gonderici,
        gonderici_ad: shipment.gonderici_ad || '',
        gonderici_soyad: shipment.gonderici_soyad || '',
        gonderici_telefon: shipment.gonderici_telefon || '',
        gonderici_email: shipment.gonderici_email || '',
        cikis_yeri: shipment.cikis_yeri,
        ulasacagi_yer: shipment.ulasacagi_yer,
        agirlik: shipment.agirlik,
        hacim: shipment.hacim,
        miktar: shipment.miktar,
        durum: shipment.durum,
        kargo_tipi: shipment.kargo_tipi,
        icerik: shipment.icerik,
        toplama_gonullusu: shipment.toplama_gonullusu,
        tasima_gonullusu: shipment.tasima_gonullusu,
        dagitim_gonullusu: shipment.dagitim_gonullusu,
        ozel_not: shipment.ozel_not || '',
      });
      setErrors({});
    }
  }, [open, shipment]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShipmentFormData, string>> = {};

    if (!formData.anonim_gonderici && !formData.gonderici_ad?.trim()) {
      newErrors.gonderici_ad = 'Gönderici adı gereklidir';
    }

    if (!formData.anonim_gonderici && !formData.gonderici_soyad?.trim()) {
      newErrors.gonderici_soyad = 'Gönderici soyadı gereklidir';
    }

    if (!formData.cikis_yeri.trim()) {
      newErrors.cikis_yeri = 'Çıkış yeri seçilmelidir';
    }

    if (!formData.ulasacagi_yer.trim()) {
      newErrors.ulasacagi_yer = 'Varış yeri seçilmelidir';
    }

    if (!formData.icerik.trim()) {
      newErrors.icerik = 'İçerik açıklaması gereklidir';
    }

    if (!formData.agirlik.trim()) {
      newErrors.agirlik = 'Ağırlık gereklidir';
    }

    if (!formData.hacim.trim()) {
      newErrors.hacim = 'Hacim gereklidir';
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
              {shipment.kargo_no} - {shipment.durum_display}
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
