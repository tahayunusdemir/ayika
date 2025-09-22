import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Autocomplete,
  FormControlLabel,
  Switch,
  Paper,
  ListItemIcon,
  ListItemText,
  Stack,
  InputAdornment,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { ShipmentFormData, CargoType, ShipmentStatus, SEHIR_CHOICES, DURUM_CHOICES } from '../types';
import { cargoTypes, allContentSuggestions, getContentSuggestionsByType } from '../data/contentOptions';
import { volunteersApi } from '../data/apiService';
import VolunteerSearchAutocomplete from './VolunteerSearchAutocomplete';

interface ShipmentFormProps {
  formData: ShipmentFormData;
  onChange: (data: ShipmentFormData) => void;
  errors?: Partial<Record<keyof ShipmentFormData, string>>;
}

export default function ShipmentForm({ formData, onChange, errors = {} }: ShipmentFormProps) {
  const [volunteers, setVolunteers] = React.useState<any[]>([]);
  const [loadingVolunteers, setLoadingVolunteers] = React.useState(false);

  // Gönüllüleri yükle
  React.useEffect(() => {
    const loadVolunteers = async () => {
      setLoadingVolunteers(true);
      try {
        const activeVolunteers = await volunteersApi.getActiveVolunteers();
        setVolunteers(activeVolunteers || []);
      } catch (apiError) {
        console.error('Gönüllü verileri yüklenirken hata:', apiError);
        setVolunteers([]);
      } finally {
        setLoadingVolunteers(false);
      }
    };

    loadVolunteers();
  }, []);

  const handleChange = (field: keyof ShipmentFormData, value: any) => {
    // Kargo tipi değiştiğinde içeriği temizle
    if (field === 'kargo_tipi' && value !== formData.kargo_tipi) {
      onChange({ ...formData, [field]: value, icerik: '' });
    } else {
      onChange({ ...formData, [field]: value });
    }
  };

  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
  };

  return (
    <Stack spacing={2}>
      {/* Gönderici Bilgileri */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Gönderici Bilgileri
        </Typography>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <FormControl fullWidth>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.anonim_gonderici}
                    onChange={(e) => handleChange('anonim_gonderici', e.target.checked)}
                    size="small"
                  />
                }
                label="Anonim Gönderici"
                sx={{ mt: 0.5 }}
              />
            </FormControl>
          </Grid>
          {!formData.anonim_gonderici && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <FormLabel>Ad</FormLabel>
                  <TextField
                    value={formData.gonderici_ad}
                    onChange={(e) => handleChange('gonderici_ad', e.target.value)}
                    fullWidth
                    size="small"
                    error={!!errors.gonderici_ad}
                    helperText={errors.gonderici_ad}
                    placeholder="Ad"
                  />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <FormLabel>Soyad</FormLabel>
                  <TextField
                    value={formData.gonderici_soyad}
                    onChange={(e) => handleChange('gonderici_soyad', e.target.value)}
                    fullWidth
                    size="small"
                    error={!!errors.gonderici_soyad}
                    helperText={errors.gonderici_soyad}
                    placeholder="Soyad"
                  />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <FormLabel>Telefon</FormLabel>
                  <TextField
                    value={formData.gonderici_telefon || ''}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      handleChange('gonderici_telefon', formatted || undefined);
                    }}
                    fullWidth
                    size="small"
                    error={!!errors.gonderici_telefon}
                    helperText={errors.gonderici_telefon}
                    placeholder="5XX XXX XX XX"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">+90</InputAdornment>,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <FormLabel>E-posta</FormLabel>
                  <TextField
                    type="email"
                    value={formData.gonderici_email || ''}
                    onChange={(e) => handleChange('gonderici_email', e.target.value || undefined)}
                    fullWidth
                    size="small"
                    error={!!errors.gonderici_email}
                    helperText={errors.gonderici_email}
                    placeholder="ornek@email.com"
                  />
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* İçerik Bilgileri */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          İçerik Bilgileri
        </Typography>
        <Grid container spacing={1.5}>
          {/* Üst satır: Kargo Tipi ve İçerik Adı */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required>
              <FormLabel>Kargo Tipi</FormLabel>
              <Select
                value={formData.kargo_tipi}
                onChange={(e) => handleChange('kargo_tipi', e.target.value as CargoType)}
                error={!!errors.kargo_tipi}
                size="small"
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <Typography color="text.secondary">Kargo tipi seçiniz</Typography>
                </MenuItem>
                {cargoTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {type.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {type.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required>
              <FormLabel>İçerik</FormLabel>
              <Autocomplete
                freeSolo
                size="small"
                options={formData.kargo_tipi ? getContentSuggestionsByType(formData.kargo_tipi) : allContentSuggestions}
                value={formData.icerik}
                onChange={(_, newValue) => handleChange('icerik', newValue || '')}
                onInputChange={(_, newInputValue) => handleChange('icerik', newInputValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={formData.kargo_tipi ? 
                      `${formData.kargo_tipi} kategorisinden seçin veya yazın...` : 
                      "İçerik açıklaması yazın veya seçin..."
                    }
                    error={!!errors.icerik}
                    helperText={errors.icerik || (formData.kargo_tipi ? 
                      `${getContentSuggestionsByType(formData.kargo_tipi).length} öneri mevcut` : 
                      "Önce kargo tipi seçin"
                    )}
                  />
                )}
                noOptionsText="Bu kategoride öneri bulunamadı"
                clearText="Temizle"
                closeText="Kapat"
                openText="Aç"
              />
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Konum ve Ağırlık Bilgileri */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Konum ve Ağırlık Bilgileri
        </Typography>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required>
              <FormLabel>Çıkış Yeri</FormLabel>
              <Autocomplete
                options={SEHIR_CHOICES}
                size="small"
                getOptionLabel={(option) => option.label}
                value={SEHIR_CHOICES.find(city => city.value === formData.cikis_yeri) || null}
                onChange={(_, newValue) => handleChange('cikis_yeri', newValue?.value || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Çıkış şehri seçin"
                    error={!!errors.cikis_yeri}
                    helperText={errors.cikis_yeri}
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box component="li" key={key} {...otherProps}>
                      {option.label}
                    </Box>
                  );
                }}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required>
              <FormLabel>Varış Yeri</FormLabel>
              <Autocomplete
                options={SEHIR_CHOICES}
                size="small"
                getOptionLabel={(option) => option.label}
                value={SEHIR_CHOICES.find(city => city.value === formData.ulasacagi_yer) || null}
                onChange={(_, newValue) => handleChange('ulasacagi_yer', newValue?.value || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Varış şehri seçin"
                    error={!!errors.ulasacagi_yer}
                    helperText={errors.ulasacagi_yer}
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box component="li" key={key} {...otherProps}>
                      {option.label}
                    </Box>
                  );
                }}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth required>
              <FormLabel>Ağırlık (kg)</FormLabel>
              <TextField
                value={formData.agirlik}
                onChange={(e) => handleChange('agirlik', e.target.value)}
                fullWidth
                size="small"
                type="number"
                inputProps={{ min: 0.01, step: 0.01 }}
                placeholder="0.00"
                error={!!errors.agirlik}
                helperText={errors.agirlik}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth required>
              <FormLabel>Hacim (m³)</FormLabel>
              <TextField
                value={formData.hacim}
                onChange={(e) => handleChange('hacim', e.target.value)}
                fullWidth
                size="small"
                type="number"
                inputProps={{ min: 0.01, step: 0.01 }}
                placeholder="0.00"
                error={!!errors.hacim}
                helperText={errors.hacim}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth required>
              <FormLabel>Miktar (Adet)</FormLabel>
              <TextField
                value={formData.miktar}
                onChange={(e) => handleChange('miktar', parseInt(e.target.value) || 1)}
                fullWidth
                size="small"
                type="number"
                inputProps={{ min: 1, step: 1 }}
                placeholder="1"
                error={!!errors.miktar}
                helperText={errors.miktar}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Gönüllü Bilgileri */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Gönüllü Bilgileri
        </Typography>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <VolunteerSearchAutocomplete
              label="Toplama Gönüllüsü"
              volunteerType="toplama"
              volunteers={volunteers}
              value={formData.toplama_gonullusu}
              onChange={(volunteerId) => handleChange('toplama_gonullusu', volunteerId)}
              error={errors.toplama_gonullusu}
              loading={loadingVolunteers}
              disabled={loadingVolunteers}
              required={true}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <VolunteerSearchAutocomplete
              label="Taşıma Gönüllüsü"
              volunteerType="tasima"
              volunteers={volunteers}
              value={formData.tasima_gonullusu}
              onChange={(volunteerId) => handleChange('tasima_gonullusu', volunteerId)}
              error={errors.tasima_gonullusu}
              loading={loadingVolunteers}
              disabled={loadingVolunteers}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <VolunteerSearchAutocomplete
              label="Dağıtım Gönüllüsü"
              volunteerType="dagitim"
              volunteers={volunteers}
              value={formData.dagitim_gonullusu}
              onChange={(volunteerId) => handleChange('dagitim_gonullusu', volunteerId)}
              error={errors.dagitim_gonullusu}
              loading={loadingVolunteers}
              disabled={loadingVolunteers}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Kargo Durumu */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Kargo Durumu
        </Typography>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required>
              <FormLabel>Durum</FormLabel>
              <Select
                value={formData.durum}
                onChange={(e) => handleChange('durum', e.target.value as ShipmentStatus)}
                error={!!errors.durum}
                size="small"
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <Typography color="text.secondary">Durum seçiniz</Typography>
                </MenuItem>
                {DURUM_CHOICES.map((status) => {
                  const getStatusIcon = (value: string) => {
                    switch (value) {
                      case 'hazirlaniyor':
                        return <InventoryIcon sx={{ fontSize: 18 }} />;
                      case 'yolda':
                        return <LocalShippingIcon sx={{ fontSize: 18 }} />;
                      case 'teslim_edildi':
                        return <CheckCircleIcon sx={{ fontSize: 18 }} />;
                      case 'iptal_edildi':
                        return <CancelIcon sx={{ fontSize: 18 }} />;
                      default:
                        return <InventoryIcon sx={{ fontSize: 18 }} />;
                    }
                  };
                  
                  return (
                    <MenuItem key={status.value} value={status.value}>
                      <ListItemIcon>
                        {getStatusIcon(status.value)}
                      </ListItemIcon>
                      <ListItemText primary={status.label} />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <FormLabel>Özel Not</FormLabel>
              <TextField
                value={formData.ozel_not || ''}
                onChange={(e) => handleChange('ozel_not', e.target.value || undefined)}
                multiline
                rows={2}
                fullWidth
                size="small"
                placeholder="Kargo ile ilgili özel notlar..."
              />
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
}
