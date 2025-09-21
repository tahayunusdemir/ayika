import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { useTheme } from '@mui/material/styles';

interface VolunteerRegistrationData {
  month: string;
  count: number;
}

interface VolunteerRegistrationChartProps {
  data: VolunteerRegistrationData[];
  loading?: boolean;
}

export default function VolunteerRegistrationChart({ data, loading }: VolunteerRegistrationChartProps) {
  const theme = useTheme();
  
  // Calculate total registrations and trend
  const totalRegistrations = data.reduce((sum, item) => sum + item.count, 0);
  const lastMonthCount = data[data.length - 1]?.count || 0;
  const previousMonthCount = data[data.length - 2]?.count || 0;
  const trend = lastMonthCount - previousMonthCount;
  const trendPercentage = previousMonthCount > 0 ? Math.round((trend / previousMonthCount) * 100) : 0;
  
  const colorPalette = [
    theme.palette.success.main,
  ];

  if (loading) {
    return (
      <Card variant="outlined" sx={{ width: '100%' }}>
        <CardContent>
          <Typography component="h2" variant="subtitle2" gutterBottom>
            Gönüllü Kayıtları
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Veriler yükleniyor...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Gönüllü Kayıtları
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {totalRegistrations.toLocaleString('tr-TR')}
            </Typography>
            {trendPercentage !== 0 && (
              <Chip 
                size="small" 
                color={trendPercentage > 0 ? "success" : "error"} 
                label={`${trendPercentage > 0 ? '+' : ''}${trendPercentage}%`} 
              />
            )}
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Son 12 ay için aylık gönüllü kayıtları
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data: data.map(item => item.month),
              tickInterval: (_, i) => (i + 1) % 2 === 0, // Show every 2nd month
              height: 24,
            },
          ]}
          yAxis={[{ width: 50 }]}
          series={[
            {
              id: 'registrations',
              label: 'Kayıtlar',
              showMark: true,
              curve: 'linear',
              data: data.map(item => item.count),
            },
          ]}
          height={250}
          margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          hideLegend
        />
      </CardContent>
    </Card>
  );
}
