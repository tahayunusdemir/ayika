import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import DashboardPageLayout from '../../components/DashboardPageLayout';
import StatCard from '../../components/StatCard';
import SessionsChart from '../../components/SessionsChart';
import PageViewsBarChart from '../../components/PageViewsBarChart';
import CustomizedDataGrid from '../../components/CustomizedDataGrid';
import { 
  Box, 
  Typography, 
  Grid, 
  Fade
} from '@mui/material';

export default function Analytics() {

  // Admin odaklı detaylı metrikler
  const adminStats = [
    {
      title: 'Sistem Performansı',
      value: '98.7%',
      interval: 'Son 30 gün uptime',
      trend: 'up' as const,
      data: [95, 96, 97, 98, 97, 98, 99, 98, 99, 99, 98, 99, 99, 98, 99, 99, 98, 99, 99, 98, 99, 99, 98, 99, 99, 98, 99, 99, 98, 99]
    },
    {
      title: 'API Yanıt Süresi',
      value: '127ms',
      interval: 'Ortalama yanıt süresi',
      trend: 'down' as const,
      data: [150, 145, 140, 135, 130, 128, 125, 127, 124, 122, 125, 123, 121, 124, 126, 125, 127, 125, 128, 126, 127, 125, 128, 127, 126, 127, 125, 126, 127, 125]
    },
    {
      title: 'Aktif Kullanıcılar',
      value: '2,847',
      interval: 'Son 24 saat',
      trend: 'up' as const,
      data: [2200, 2250, 2300, 2350, 2400, 2450, 2500, 2520, 2540, 2560, 2580, 2600, 2620, 2640, 2660, 2680, 2700, 2720, 2740, 2760, 2780, 2800, 2810, 2820, 2830, 2835, 2840, 2845, 2847, 2847]
    },
    {
      title: 'Veri İşleme Hacmi',
      value: '45.2GB',
      interval: 'Günlük veri işleme',
      trend: 'up' as const,
      data: [30, 32, 34, 36, 38, 40, 41, 42, 43, 44, 44.5, 45, 45.1, 45.2, 45.2, 45.1, 45.2, 45.2, 45.1, 45.2, 45.2, 45.1, 45.2, 45.2, 45.1, 45.2, 45.2, 45.1, 45.2, 45.2]
    }
  ];


  return (
    <DashboardPageLayout
      title="Sistem Analizleri"
      description="Sistem yöneticileri için detaylı performans metrikleri, sistem sağlığı ve operasyonel analizler."
      icon={AnalyticsRoundedIcon}
    >
      <Fade in timeout={300}>
        <Box>
          {/* Sistem Performans Metrikleri */}
          <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Sistem Performans Metrikleri
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {adminStats.map((stat, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                <StatCard {...stat} />
              </Grid>
            ))}
          </Grid>

          {/* Kullanıcı Davranış Analizleri */}
          <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Kullanıcı Davranış Analizleri
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <SessionsChart />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <PageViewsBarChart />
            </Grid>
          </Grid>

          {/* Operasyonel Performans Metrikleri */}
          <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Operasyonel Performans Metrikleri
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <CustomizedDataGrid />
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </DashboardPageLayout>
  );
}
