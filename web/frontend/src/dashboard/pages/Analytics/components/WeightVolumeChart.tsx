import { Paper, Typography, Box, CircularProgress, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CargoStats } from '../api/cargoStats';
import ScaleIcon from '@mui/icons-material/Scale';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import InventoryIcon from '@mui/icons-material/Inventory';

interface WeightVolumeChartProps {
  data: CargoStats['weightVolume'];
  loading?: boolean;
}

export default function WeightVolumeChart({ data, loading }: WeightVolumeChartProps) {
  const chartData = [
    {
      metric: 'Ağırlık',
      ortalama: data.ortalama_agirlik,
      minimum: data.min_agirlik,
      maksimum: data.max_agirlik,
      unit: 'kg'
    },
    {
      metric: 'Hacim',
      ortalama: data.ortalama_hacim,
      minimum: data.min_hacim,
      maksimum: data.max_hacim,
      unit: 'm³'
    },
    {
      metric: 'Miktar',
      ortalama: data.ortalama_miktar,
      minimum: 1,
      maksimum: Math.max(data.ortalama_miktar * 2, 10),
      unit: 'adet'
    }
  ];

  const summaryStats = [
    {
      title: 'Toplam Ağırlık',
      value: `${data.toplam_agirlik.toLocaleString()} kg`,
      icon: ScaleIcon,
      color: '#2196f3'
    },
    {
      title: 'Toplam Hacim',
      value: `${data.toplam_hacim.toLocaleString()} m³`,
      icon: ViewInArIcon,
      color: '#4caf50'
    },
    {
      title: 'Toplam Miktar',
      value: `${data.toplam_miktar.toLocaleString()} adet`,
      icon: InventoryIcon,
      color: '#ff9800'
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 2
          }}
        >
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" color="text.secondary">
              {entry.name === 'ortalama' ? 'Ortalama' : 
               entry.name === 'minimum' ? 'Minimum' : 'Maksimum'}: {entry.value} {data.unit}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: 500 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Ağırlık & Hacim Analizi
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Kargo fiziksel özelliklerinin istatistikleri
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {summaryStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Grid key={index} size={{ xs: 12, sm: 4 }}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'grey.50',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '50%',
                    backgroundColor: stat.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconComponent sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      
      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="metric" 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="minimum" fill="#f44336" name="minimum" radius={[2, 2, 0, 0]} maxBarSize={30} />
          <Bar dataKey="ortalama" fill="#2196f3" name="ortalama" radius={[2, 2, 0, 0]} maxBarSize={30} />
          <Bar dataKey="maksimum" fill="#4caf50" name="maksimum" radius={[2, 2, 0, 0]} maxBarSize={30} />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#f44336', borderRadius: '50%' }} />
          <Typography variant="caption" color="text.secondary">Minimum</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#2196f3', borderRadius: '50%' }} />
          <Typography variant="caption" color="text.secondary">Ortalama</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#4caf50', borderRadius: '50%' }} />
          <Typography variant="caption" color="text.secondary">Maksimum</Typography>
        </Box>
      </Box>
    </Paper>
  );
}
