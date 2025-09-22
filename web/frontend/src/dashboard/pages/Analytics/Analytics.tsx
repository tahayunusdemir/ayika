import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import DashboardPageLayout from '../../components/DashboardPageLayout';
import StatCard from '../../components/StatCard';
import VolunteerRegistrationChart from './components/VolunteerRegistrationChart';
import { 
  Box, 
  Typography, 
  Grid, 
  Fade,
  Paper,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react';
import { getVolunteerStats, type VolunteerStats } from '../Volunteers/api/volunteers';
import { cargoStatsService, type CargoStats } from './api/cargoStats';
import CargoStatCards from './components/CargoStatCards';
import CargoStatusChart from './components/CargoStatusChart';
import CargoTypeChart from './components/CargoTypeChart';
import CityFlowChart from './components/CityFlowChart';
import WeightVolumeChart from './components/WeightVolumeChart';
import VolunteerAssignmentChart from './components/VolunteerAssignmentChart';
import CargoTrendChart from './components/CargoTrendChart';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Analytics() {
  const [tabValue, setTabValue] = useState(0);
  const [volunteerStats, setVolunteerStats] = useState<VolunteerStats | null>(null);
  const [cargoStats, setCargoStats] = useState<{
    general: CargoStats['general'] | null;
    weightVolume: CargoStats['weightVolume'] | null;
    cities: CargoStats['cities'] | null;
    volunteers: CargoStats['volunteers'] | null;
    timeBased: CargoStats['timeBased'] | null;
  }>({ general: null, weightVolume: null, cities: null, volunteers: null, timeBased: null });
  const [loading, setLoading] = useState(true);
  const [cargoLoading, setCargoLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cargoError, setCargoError] = useState<string | null>(null);

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

  // Kargo istatistiklerini yükle
  useEffect(() => {
    const loadCargoStats = async () => {
      try {
        setCargoLoading(true);
        setCargoError(null);
        
        // Her endpoint'i ayrı ayrı dene, hata olursa o kısmı null bırak
        const results = await Promise.allSettled([
          cargoStatsService.getGeneralStats(),
          cargoStatsService.getWeightVolumeStats(),
          cargoStatsService.getCityStats(),
          cargoStatsService.getVolunteerStats(),
          cargoStatsService.getTimeBasedStats(30)
        ]);
        
        setCargoStats({
          general: results[0].status === 'fulfilled' ? results[0].value : null,
          weightVolume: results[1].status === 'fulfilled' ? results[1].value : null,
          cities: results[2].status === 'fulfilled' ? results[2].value : null,
          volunteers: results[3].status === 'fulfilled' ? results[3].value : null,
          timeBased: results[4].status === 'fulfilled' ? results[4].value : null
        });
        
        // Tüm endpoint'ler başarısız olduysa hata göster
        const allFailed = results.every(result => result.status === 'rejected');
        if (allFailed) {
          setCargoError('Kargo API endpointleri bulunamadı. Backend sunucusu çalışıyor mu kontrol edin.');
        }
      } catch (err) {
        console.error('Kargo istatistikleri yüklenirken hata:', err);
        setCargoError('Kargo istatistikleri yüklenirken beklenmeyen bir hata oluştu');
      } finally {
        setCargoLoading(false);
      }
    };

    loadCargoStats();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
              <Tab label="Kargo Analizleri" />
              <Tab label="Gönüllü Analizleri" />
            </Tabs>
          </Box>

          {/* Kargo Analytics Tab */}
          <TabPanel value={tabValue} index={0}>
            {cargoError ? (
              <Alert severity="error" sx={{ mb: 4 }}>
                {cargoError}
              </Alert>
            ) : (
              <>
                {/* Kargo İstatistik Kartları */}
                {(cargoStats.general || cargoStats.weightVolume) && (
                  <>
                    <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Kargo Özet İstatistikleri
                    </Typography>
                    <Box sx={{ mb: 4 }}>
                      <CargoStatCards 
                        generalStats={cargoStats.general}
                        weightVolumeStats={cargoStats.weightVolume}
                        loading={cargoLoading}
                      />
                    </Box>
                  </>
                )}

                {/* Veri yoksa mesaj göster */}
                {!cargoLoading && !cargoStats.general && !cargoStats.weightVolume && !cargoStats.cities && !cargoStats.volunteers && !cargoStats.timeBased && (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      Kargo Verileri Bulunamadı
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Backend API endpoint'leri henüz hazır değil. Lütfen daha sonra tekrar deneyin.
                    </Typography>
                  </Box>
                )}

                {/* Kargo Durum ve Tip Analizleri */}
                {cargoStats.general && (
                  <>
                    <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Kargo Durum & Tip Analizleri
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid size={{ xs: 12, lg: 6 }}>
                        <CargoStatusChart 
                          data={cargoStatsService.getCargoStatusData(cargoStats.general)}
                          loading={cargoLoading}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, lg: 6 }}>
                        <CargoTypeChart 
                          data={cargoStatsService.getCargoTypeData(cargoStats.general)}
                          loading={cargoLoading}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}

                {/* Şehir Akışı ve Ağırlık Analizi */}
                {(cargoStats.cities || cargoStats.weightVolume) && (
                  <>
                    <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Coğrafi & Fiziksel Analizler
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      {cargoStats.cities && (
                        <Grid size={{ xs: 12, lg: 6 }}>
                          <CityFlowChart 
                            data={cargoStatsService.getCityFlowData(cargoStats.cities)}
                            loading={cargoLoading}
                          />
                        </Grid>
                      )}
                      {cargoStats.weightVolume && (
                        <Grid size={{ xs: 12, lg: 6 }}>
                          <WeightVolumeChart 
                            data={cargoStats.weightVolume}
                            loading={cargoLoading}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </>
                )}

                {/* Gönüllü Atama ve Trend Analizi */}
                {(cargoStats.volunteers || cargoStats.timeBased) && (
                  <>
                    <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Gönüllü Atama & Trend Analizleri
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      {cargoStats.volunteers && (
                        <Grid size={{ xs: 12, lg: 6 }}>
                          <VolunteerAssignmentChart 
                            data={cargoStatsService.getVolunteerAssignmentData(cargoStats.volunteers)}
                            loading={cargoLoading}
                          />
                        </Grid>
                      )}
                      {cargoStats.timeBased && (
                        <Grid size={{ xs: 12, lg: 6 }}>
                          <CargoTrendChart 
                            data={cargoStats.timeBased}
                            loading={cargoLoading}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </>
                )}
              </>
            )}
          </TabPanel>

          {/* Gönüllü Analytics Tab */}
          <TabPanel value={tabValue} index={1}>
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
                        <Bar dataKey="count" fill="#2196f3" radius={[4, 4, 0, 0]} />
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
              <Grid size={{ xs: 12, md: 6 }}>
                <VolunteerRegistrationChart 
                  data={volunteerStats?.monthly_registrations || []} 
                  loading={loading}
                />
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </Fade>
    </DashboardPageLayout>
  );
}
