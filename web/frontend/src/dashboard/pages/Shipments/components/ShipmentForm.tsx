import {
  Stack,
  TextField,
  Autocomplete,
  FormControl,
  FormLabel,
  Box,
  Typography,
  Grid,
  InputAdornment,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Paper,
} from '@mui/material';
import { ShipmentFormData, CargoType, SecurityApproval, ShipmentStatus } from '../types';
import { turkishCities } from '../data/cities';
import { cargoTypes, securityApprovalOptions, statusOptions, allContentSuggestions, getContentSuggestionsByType } from '../data/contentOptions';

interface ShipmentFormProps {
  formData: ShipmentFormData;
  onChange: (data: ShipmentFormData) => void;
  errors?: Partial<Record<keyof ShipmentFormData, string>>;
}

export default function ShipmentForm({ formData, onChange, errors = {} }: ShipmentFormProps) {
  const handleChange = (field: keyof ShipmentFormData, value: any) => {
    // Kargo tipi değiştiğinde içerik adını temizle
    if (field === 'kargo_tipi' && value !== formData.kargo_tipi) {
      onChange({ ...formData, [field]: value, icerik_adi: '' });
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
                    checked={formData.gizlilik_durumu}
                    onChange={(e) => handleChange('gizlilik_durumu', e.target.checked)}
                    size="small"
                  />
                }
                label="Anonim Gönderici"
                sx={{ mt: 0.5 }}
              />
            </FormControl>
          </Grid>
          {!formData.gizlilik_durumu && (
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
              <FormLabel>İçerik Adı</FormLabel>
              <Autocomplete
                freeSolo
                size="small"
                options={formData.kargo_tipi ? getContentSuggestionsByType(formData.kargo_tipi) : allContentSuggestions}
                value={formData.icerik_adi}
                onChange={(_, newValue) => handleChange('icerik_adi', newValue || '')}
                onInputChange={(_, newInputValue) => handleChange('icerik_adi', newInputValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="İçerik adı"
                    error={!!errors.icerik_adi}
                    helperText={errors.icerik_adi}
                  />
                )}
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
              <FormLabel>Şehir</FormLabel>
              <Autocomplete
                options={turkishCities}
                size="small"
                getOptionLabel={(option) => option.name}
                value={turkishCities.find(city => city.name === formData.sehir) || null}
                onChange={(_, newValue) => handleChange('sehir', newValue?.name || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Şehir seçin"
                    error={!!errors.sehir}
                    helperText={errors.sehir}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option.name}
                  </Box>
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <FormLabel>Ağırlık/Hacim</FormLabel>
              <TextField
                value={formData.agirlik_hacim || ''}
                onChange={(e) => handleChange('agirlik_hacim', e.target.value || undefined)}
                fullWidth
                size="small"
                placeholder="Örn: 50 kg, 100 adet"
              />
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Görevli Bilgileri */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Görevli Bilgileri
        </Typography>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth required>
              <FormLabel>Toplama Gönüllüsü - Ad</FormLabel>
              <TextField
                value={formData.toplama_gonullusu_ad}
                onChange={(e) => handleChange('toplama_gonullusu_ad', e.target.value)}
                fullWidth
                size="small"
                error={!!errors.toplama_gonullusu_ad}
                helperText={errors.toplama_gonullusu_ad}
                placeholder="Ad"
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth required>
              <FormLabel>Toplama Gönüllüsü - Soyad</FormLabel>
              <TextField
                value={formData.toplama_gonullusu_soyad}
                onChange={(e) => handleChange('toplama_gonullusu_soyad', e.target.value)}
                fullWidth
                size="small"
                error={!!errors.toplama_gonullusu_soyad}
                helperText={errors.toplama_gonullusu_soyad}
                placeholder="Soyad"
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth required>
              <FormLabel>Gönüllü No</FormLabel>
              <TextField
                value={formData.toplama_gonullusu_no}
                onChange={(e) => handleChange('toplama_gonullusu_no', e.target.value)}
                fullWidth
                size="small"
                error={!!errors.toplama_gonullusu_no}
                helperText={errors.toplama_gonullusu_no}
                placeholder="GON001"
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <FormLabel>Taşıma Görevlisi - Ad</FormLabel>
              <TextField
                value={formData.tasima_gorevlisi_ad || ''}
                onChange={(e) => handleChange('tasima_gorevlisi_ad', e.target.value || undefined)}
                fullWidth
                size="small"
                placeholder="Ad"
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <FormLabel>Taşıma Görevlisi - Soyad</FormLabel>
              <TextField
                value={formData.tasima_gorevlisi_soyad || ''}
                onChange={(e) => handleChange('tasima_gorevlisi_soyad', e.target.value || undefined)}
                fullWidth
                size="small"
                placeholder="Soyad"
                disabled={!formData.tasima_gorevlisi_ad}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <FormLabel>Taşıma Gönüllü No</FormLabel>
              <TextField
                value={formData.tasima_gorevlisi_no || ''}
                onChange={(e) => handleChange('tasima_gorevlisi_no', e.target.value || undefined)}
                fullWidth
                size="small"
                placeholder="GON002"
                disabled={!formData.tasima_gorevlisi_ad}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <FormLabel>Dağıtım Görevlisi - Ad</FormLabel>
              <TextField
                value={formData.dagitim_gorevlisi_ad || ''}
                onChange={(e) => handleChange('dagitim_gorevlisi_ad', e.target.value || undefined)}
                fullWidth
                size="small"
                placeholder="Ad"
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <FormLabel>Dağıtım Görevlisi - Soyad</FormLabel>
              <TextField
                value={formData.dagitim_gorevlisi_soyad || ''}
                onChange={(e) => handleChange('dagitim_gorevlisi_soyad', e.target.value || undefined)}
                fullWidth
                size="small"
                placeholder="Soyad"
                disabled={!formData.dagitim_gorevlisi_ad}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <FormLabel>Dağıtım Gönüllü No</FormLabel>
              <TextField
                value={formData.dagitim_gorevlisi_no || ''}
                onChange={(e) => handleChange('dagitim_gorevlisi_no', e.target.value || undefined)}
                fullWidth
                size="small"
                placeholder="GON003"
                disabled={!formData.dagitim_gorevlisi_ad}
              />
            </FormControl>
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
                value={formData.kargo_durumu}
                onChange={(e) => handleChange('kargo_durumu', e.target.value as ShipmentStatus)}
                error={!!errors.kargo_durumu}
                size="small"
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <Typography color="text.secondary">Durum seçiniz</Typography>
                </MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            {/* Empty space for alignment */}
          </Grid>
        </Grid>
      </Paper>

      {/* Güvenlik ve Notlar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Güvenlik ve Notlar
        </Typography>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required>
              <FormLabel>Güvenlik Onayı</FormLabel>
              <Select
                value={formData.guvenlik_onayi}
                onChange={(e) => handleChange('guvenlik_onayi', e.target.value as SecurityApproval)}
                error={!!errors.guvenlik_onayi}
                size="small"
              >
                {securityApprovalOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            {/* Empty space for alignment */}
          </Grid>
          <Grid size={{ xs: 12 }}>
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
