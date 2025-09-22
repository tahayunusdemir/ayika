import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InventoryIcon from '@mui/icons-material/Inventory';

// Kargo durumu interface'i - backend ile uyumlu
interface CargoStatus {
  kargo_no: string;
  durum: 'hazirlaniyor' | 'yolda' | 'teslim_edildi' | 'iptal_edildi';
  durum_display: string;
  anonim_gonderici: boolean;
  gonderici_ad?: string;
  gonderici_soyad?: string;
  cikis_yeri: string;
  cikis_yeri_display: string;
  ulasacagi_yer: string;
  ulasacagi_yer_display: string;
  icerik: string;
  kargo_tipi: string;
  kargo_tipi_display: string;
  son_degisiklik: string;
  olusturulma_tarihi: string;
}

// API base URL
const API_BASE_URL = 'http://localhost:8000/api/v1';

const getStatusColor = (durum: string) => {
  switch (durum) {
    case 'hazirlaniyor':
      return 'warning';
    case 'yolda':
      return 'info';
    case 'teslim_edildi':
      return 'success';
    case 'iptal_edildi':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusIcon = (durum: string) => {
  switch (durum) {
    case 'hazirlaniyor':
      return <InventoryIcon />;
    case 'yolda':
      return <LocalShippingIcon />;
    case 'teslim_edildi':
      return <CheckCircleIcon />;
    case 'iptal_edildi':
      return <CancelIcon />;
    default:
      return <PendingIcon />;
  }
};

// Tarih formatı için yardımcı fonksiyon
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function CargoTracking() {
  const [cargoNumber, setCargoNumber] = React.useState('');
  const [cargoData, setCargoData] = React.useState<CargoStatus | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSearch = async () => {
    if (!cargoNumber.trim()) {
      setError('Lütfen kargo numarası giriniz.');
      return;
    }

    if (!cargoNumber.match(/^AYK\d{9}$/)) {
      setError('Kargo numarası AYK123456789 formatında olmalıdır.');
      return;
    }

    setLoading(true);
    setError('');
    setCargoData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/kargo/track/?kargo_no=${cargoNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setCargoData(result.data);
        } else {
          setError(result.error || 'Kargo bulunamadı.');
        }
      } else if (response.status === 404) {
        setError('Kargo bulunamadı. Lütfen numaranızı kontrol ediniz.');
      } else {
        setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
      }
    } catch (error) {
      console.error('Kargo sorgulama hatası:', error);
      setError('Bağlantı hatası. Lütfen internet bağlantınızı kontrol ediniz.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container
      id="cargo-tracking"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography
          component="h2"
          variant="h4"
          sx={{
            color: 'text.primary',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 2,
          }}
        >
          Kargo Takip
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            mb: 4,
          }}
        >
          Yardım kargonuzun durumunu ve konumunu anında öğrenin. 
          Kargo numaranızı girerek sevkiyatınızı takip edebilirsiniz.
        </Typography>
      </Box>

      <Card
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: 600,
          p: 3,
        }}
      >
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
                Kargo Numarası Giriniz
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  placeholder="AYK123456789"
                  value={cargoNumber}
                  onChange={(e) => setCargoNumber(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  error={!!error}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  disabled={loading}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Sorgula'}
                </Button>
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                Kargo numaranız AYK ile başlayıp 9 haneli sayı ile devam eder (örn: AYK123456789)
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {cargoData && (
              <Card variant="outlined" sx={{ mt: 3 }}>
                <CardContent>
                  <Stack spacing={3}>
                    {/* Başlık ve Durum */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {cargoData.kargo_no}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(cargoData.durum)}
                        label={cargoData.durum_display}
                        color={getStatusColor(cargoData.durum) as any}
                        variant="filled"
                        size="medium"
                      />
                    </Box>

                    <Divider />

                    {/* Ana Bilgiler Grid */}
                    <Grid container spacing={3}>
                      {/* Sol Kolon */}
                      <Grid size={6}>
                        <Stack spacing={2}>
                          {/* Gönderici Bilgileri */}
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                              <PersonIcon sx={{ mr: 1, fontSize: 18 }} />
                              Gönderici
                            </Typography>
                            {!cargoData.anonim_gonderici && cargoData.gonderici_ad && cargoData.gonderici_soyad ? (
                              <Typography variant="body2" sx={{ color: 'text.secondary', ml: 3 }}>
                                {cargoData.gonderici_ad} {cargoData.gonderici_soyad}
                              </Typography>
                            ) : (
                              <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', ml: 3 }}>
                                Anonim Gönderici
                              </Typography>
                            )}
                          </Box>

                          {/* Kargo Tipi */}
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              Kargo Tipi
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', ml: 2 }}>
                              {cargoData.kargo_tipi_display}
                            </Typography>
                          </Box>

                          {/* İçerik */}
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              İçerik
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', ml: 2 }}>
                              {cargoData.icerik}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      {/* Sağ Kolon */}
                      <Grid size={6}>
                        <Stack spacing={2}>
                          {/* Konum Bilgileri */}
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                              <LocationOnIcon sx={{ mr: 1, fontSize: 18 }} />
                              Güzergah
                            </Typography>
                            <Box sx={{ ml: 3 }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                <strong>Çıkış:</strong> {cargoData.cikis_yeri_display}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                <strong>Varış:</strong> {cargoData.ulasacagi_yer_display}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Tarih Bilgileri */}
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon sx={{ mr: 1, fontSize: 18 }} />
                              Tarih Bilgileri
                            </Typography>
                            <Box sx={{ ml: 3 }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                <strong>Oluşturulma:</strong> {formatDate(cargoData.olusturulma_tarihi)}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                <strong>Son Güncelleme:</strong> {formatDate(cargoData.son_degisiklik)}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
