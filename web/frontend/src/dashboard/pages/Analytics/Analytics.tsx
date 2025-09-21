import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import DashboardPageLayout from '../../components/DashboardPageLayout';
import StatCard from '../../components/StatCard';
import VolunteerActivityChart from '../../components/VolunteerActivityChart';
import PageViewsBarChart from '../../components/PageViewsBarChart';
import CustomizedDataGrid from '../../components/CustomizedDataGrid';
import VolunteerRegistrationChart from '../../components/VolunteerRegistrationChart';
import { 
  Box, 
  Typography, 
  Grid, 
  Fade,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react';
import { getVolunteerStats, type VolunteerStats } from '../Volunteers/api/volunteers';

export default function Analytics() {
  const [volunteerStats, setVolunteerStats] = useState<VolunteerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gönüllü istatistiklerini yükle
  useEffect(() => {
    const loadVolunteerStats = async () => {
      try {
        setLoading(true);
        const stats = await getVolunteerStats();
        setVolunteerStats(stats);
        setError(null);
      } catch (err) {
        console.error('Gönüllü istatistikleri yüklenirken hata:', err);
        setError('Gönüllü istatistikleri yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    loadVolunteerStats();
  }, []);

  // Pie chart için renk paleti
  const COLORS = {
    active: '#4caf50',
    inactive: '#f44336', // Pasif gönüllüler kırmızı
    toplama: '#2196f3',
    tasima: '#9c27b0',
    dagitim: '#ff9800',
    karma: '#607d8b'
  };

  // Gönüllü tipi verileri
  const typeData = volunteerStats ? [
    { name: 'Toplama', value: volunteerStats.by_type.toplama, color: COLORS.toplama },
    { name: 'Taşıma', value: volunteerStats.by_type.tasima, color: COLORS.tasima },
    { name: 'Dağıtım', value: volunteerStats.by_type.dagitim, color: COLORS.dagitim },
    { name: 'Karma', value: volunteerStats.by_type.karma, color: COLORS.karma }
  ] : [];

  // Şehir verileri (en fazla 5 şehir)
  const cityData = volunteerStats ? 
    volunteerStats.by_city
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(item => ({ name: item.city, count: item.count }))
    : [];

  // Gönüllü istatistik kartları
  const volunteerStatCards = volunteerStats ? [
    {
      title: 'Toplam Gönüllü',
      value: volunteerStats.total.toString(),
      interval: 'Kayıtlı gönüllü sayısı',
      trend: 'up' as const,
      data: Array(30).fill(volunteerStats.total).map((val) => val + Math.floor(Math.random() * 3) - 1)
    },
    {
      title: 'Aktif Gönüllüler',
      value: volunteerStats.active.toString(),
      interval: 'Şu anda aktif',
      trend: 'up' as const,
      data: Array(30).fill(volunteerStats.active).map((val) => val + Math.floor(Math.random() * 2) - 1)
    },
    {
      title: 'Pasif Gönüllüler',
      value: volunteerStats.inactive.toString(),
      interval: 'Deaktif durumda',
      trend: volunteerStats.inactive > volunteerStats.active ? 'down' as const : 'up' as const,
      data: Array(30).fill(volunteerStats.inactive).map((val) => val + Math.floor(Math.random() * 2) - 1)
    }
  ] : [];



  return (
    <DashboardPageLayout
      title="Sistem Analizleri"
      description="Sistem yöneticileri için detaylı performans metrikleri, sistem sağlığı ve operasyonel analizler."
      icon={AnalyticsRoundedIcon}
    >
      <Fade in timeout={300}>
        <Box>
          {/* Gönüllü İstatistik Kartları */}
          {volunteerStats && (
            <>
              <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Gönüllü Özet İstatistikleri
              </Typography>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {volunteerStatCards.map((stat, index) => (
                  <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard {...stat} />
                  </Grid>
                ))}
              </Grid>
            </>
          )}


          {/* Gönüllü İstatistikleri */}
          <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Gönüllü İstatistikleri
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          ) : volunteerStats ? (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Gönüllü Tipi Dağılımı */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3, height: 400 }}>
                  <Typography variant="h6" gutterBottom>
                    Gönüllü Tipi Dağılımı
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }: { name: string; value: number; percent: number }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Şehirlere Göre Dağılım */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3, height: 400 }}>
                  <Typography variant="h6" gutterBottom>
                    Şehirlere Göre Gönüllü Dağılımı (İlk 5 Şehir)
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2196f3" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          ) : null}

          {/* Kullanıcı Davranış Analizleri */}
          <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Kullanıcı Davranış Analizleri
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <VolunteerActivityChart 
                key={`volunteer-activity-${new Date().getMonth()}`}
                totalVolunteers={volunteerStats?.total || 0}
                activeVolunteers={volunteerStats?.active || 0}
                loading={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <PageViewsBarChart />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <VolunteerRegistrationChart 
                data={volunteerStats?.monthly_registrations || []} 
                loading={loading}
              />
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
