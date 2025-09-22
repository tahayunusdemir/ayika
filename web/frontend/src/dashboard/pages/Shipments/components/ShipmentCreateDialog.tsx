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

// Form data interface for creation (allows undefined for toplama_gonullusu initially)
interface CreateFormData extends Omit<ShipmentFormData, 'toplama_gonullusu'> {
  toplama_gonullusu?: number;
}

const initialFormData: CreateFormData = {
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
};

export default function ShipmentCreateDialog({
  open,
  onClose,
  onSubmit,
  loading = false,
}: ShipmentCreateDialogProps) {
  const [formData, setFormData] = React.useState<CreateFormData>(initialFormData);
  const [errors, setErrors] = React.useState<Partial<Record<keyof ShipmentFormData, string>>>({});

  React.useEffect(() => {
    if (open) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [open]);

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

    // Toplama gönüllüsü zorunlu
    if (!formData.toplama_gonullusu) {
      newErrors.toplama_gonullusu = 'Toplama gönüllüsü seçilmelidir';
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
    if (validateForm() && formData.toplama_gonullusu) {
      // Convert form data to proper ShipmentFormData type
      const submitData: ShipmentFormData = {
        ...formData,
        toplama_gonullusu: formData.toplama_gonullusu,
      };
      onSubmit(submitData);
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
            formData={formData as ShipmentFormData}
            onChange={(data) => setFormData(data as CreateFormData)}
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
