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
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import InventoryIcon from '@mui/icons-material/Inventory';

interface CargoStatus {
  id: string;
  status: 'hazirlanıyor' | 'yolda' | 'teslim_edildi';
  currentLocation: string;
  destination: string;
  lastUpdate: string;
  description: string;
}

// Mock data for demonstration
const mockCargoData: Record<string, CargoStatus> = {
  'AYK-123456789': {
    id: 'AYK-123456789',
    status: 'yolda',
    currentLocation: 'Ankara Depo',
    destination: 'İstanbul Kadıköy',
    lastUpdate: '2024-01-15 14:30',
    description: 'Gıda kolisi - 15kg'
  },
  'AYK-987654321': {
    id: 'AYK-987654321',
    status: 'teslim_edildi',
    currentLocation: 'İzmir Karşıyaka',
    destination: 'İzmir Karşıyaka',
    lastUpdate: '2024-01-15 12:45',
    description: 'Hijyen malzemeleri'
  },
  'AYK-555666777': {
    id: 'AYK-555666777',
    status: 'hazirlanıyor',
    currentLocation: 'Bursa Merkez Depo',
    destination: 'Yalova Merkez',
    lastUpdate: '2024-01-15 16:15',
    description: 'Bebek maması ve bez'
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'hazirlanıyor':
      return 'warning';
    case 'yolda':
      return 'info';
    case 'teslim_edildi':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'hazirlanıyor':
      return <InventoryIcon />;
    case 'yolda':
      return <LocalShippingIcon />;
    case 'teslim_edildi':
      return <CheckCircleIcon />;
    default:
      return <PendingIcon />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'hazirlanıyor':
      return 'Hazırlanıyor';
    case 'yolda':
      return 'Yolda';
    case 'teslim_edildi':
      return 'Teslim Edildi';
    default:
      return 'Bilinmiyor';
  }
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

    if (!cargoNumber.match(/^AYK-\d{9}$/)) {
      setError('Kargo numarası AYK-123456789 formatında olmalıdır.');
      return;
    }

    setLoading(true);
    setError('');
    setCargoData(null);

    // Simulate API call
    setTimeout(() => {
      const data = mockCargoData[cargoNumber];
      if (data) {
        setCargoData(data);
      } else {
        setError('Kargo bulunamadı. Lütfen numaranızı kontrol ediniz.');
      }
      setLoading(false);
    }, 1000);
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
                  placeholder="AYK-123456789"
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
                Kargo numaranız AYK ile başlayıp 9 haneli sayı ile devam eder (örn: AYK-123456789)
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
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {cargoData.id}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(cargoData.status)}
                        label={getStatusText(cargoData.status)}
                        color={getStatusColor(cargoData.status) as any}
                        variant="filled"
                      />
                    </Box>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {cargoData.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2">
                        <strong>Mevcut Konum:</strong> {cargoData.currentLocation}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                      <Typography variant="body2">
                        <strong>Hedef:</strong> {cargoData.destination}
                      </Typography>
                    </Box>

                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Son güncelleme: {cargoData.lastUpdate}
                    </Typography>
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
