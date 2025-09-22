import { Grid, Box, Typography, Paper, CircularProgress } from '@mui/material';
import { CargoStats } from '../api/cargoStats';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import ScaleIcon from '@mui/icons-material/Scale';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

interface CargoStatCardsProps {
  generalStats: CargoStats['general'] | null;
  weightVolumeStats: CargoStats['weightVolume'] | null;
  loading?: boolean;
}

export default function CargoStatCards({ generalStats, weightVolumeStats, loading }: CargoStatCardsProps) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!generalStats || !weightVolumeStats) {
    return null;
  }

  const statCards = [
    {
      title: 'Toplam Kargo',
      value: generalStats.toplam_kargo.toLocaleString(),
      subtitle: 'Sistemde kayıtlı',
      icon: InventoryIcon,
      color: '#2196f3',
      trend: 'up' as const
    },
    {
      title: 'Yolda',
      value: generalStats.durum_yolda.count.toLocaleString(),
      subtitle: `%${generalStats.durum_yolda.percentage ? generalStats.durum_yolda.percentage.toFixed(1) : '0.0'} oranında`,
      icon: LocalShippingIcon,
      color: '#9c27b0', // Secondary color - Taşıma gönüllüsü ile aynı
      trend: 'up' as const
    },
    {
      title: 'Teslim Edildi',
      value: generalStats.durum_teslim_edildi.count.toLocaleString(),
      subtitle: `%${generalStats.durum_teslim_edildi.percentage ? generalStats.durum_teslim_edildi.percentage.toFixed(1) : '0.0'} başarı oranı`,
      icon: CheckCircleIcon,
      color: '#4caf50',
      trend: 'up' as const
    },
    {
      title: 'Anonim Gönderici',
      value: generalStats.anonim_gonderici.toLocaleString(),
      subtitle: `${generalStats.toplam_kargo > 0 ? ((generalStats.anonim_gonderici / generalStats.toplam_kargo) * 100).toFixed(1) : '0.0'}% anonim`,
      icon: PersonOffIcon,
      color: '#9c27b0',
      trend: 'up' as const
    },
    {
      title: 'Toplam Ağırlık',
      value: `${weightVolumeStats.toplam_agirlik.toLocaleString()} kg`,
      subtitle: `Ort: ${weightVolumeStats.ortalama_agirlik ? weightVolumeStats.ortalama_agirlik.toFixed(1) : '0.0'} kg`,
      icon: ScaleIcon,
      color: '#607d8b',
      trend: 'up' as const
    },
    {
      title: 'Toplam Hacim',
      value: `${weightVolumeStats.toplam_hacim.toLocaleString()} m³`,
      subtitle: `Ort: ${weightVolumeStats.ortalama_hacim ? weightVolumeStats.ortalama_hacim.toFixed(1) : '0.0'} m³`,
      icon: ViewInArIcon,
      color: '#795548',
      trend: 'up' as const
    }
  ];

  return (
    <Grid container spacing={2}>
      {statCards.map((card, index) => {
        const IconComponent = card.icon;
        
        return (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              {/* Background Icon */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  opacity: 0.1,
                  transform: 'rotate(15deg)'
                }}
              >
                <IconComponent sx={{ fontSize: 80, color: card.color }} />
              </Box>

              {/* Content */}
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: card.color,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconComponent sx={{ fontSize: 24 }} />
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: card.color }}>
                      {card.value}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="caption" color="text.secondary">
                  {card.subtitle}
                </Typography>

                {/* Trend Indicator */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: card.trend === 'up' ? '#4caf50' : card.trend === 'down' ? '#f44336' : '#ff9800'
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
