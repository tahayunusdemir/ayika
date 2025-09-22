import React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

interface VolunteerActivityChartProps {
  totalVolunteers: number;
  activeVolunteers: number;
  loading?: boolean;
}

function getCurrentMonthDays() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based month (0 = January, 8 = September)
  const date = new Date(year, month + 1, 0); // Last day of current month
  
  // Manuel Türkçe ay isimleri
  const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const monthName = monthNames[month];
  
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

export default function VolunteerActivityChart({ 
  totalVolunteers, 
  activeVolunteers, 
  loading 
}: VolunteerActivityChartProps) {
  const theme = useTheme();
  
  // Force fresh data generation on each render
  const data = React.useMemo(() => getCurrentMonthDays(), []);

  const colorPalette = [
    theme.palette.success.light,
    theme.palette.success.main,
    theme.palette.success.dark,
  ];

  // Generate realistic activity data based on actual volunteer counts
  const generateActivityData = (baseCount: number, variation: number = 0.1) => {
    return data.map(() => {
      const variance = Math.random() * variation * 2 - variation; // -variation to +variation
      return Math.max(0, Math.round(baseCount * (1 + variance)));
    });
  };

  if (loading) {
    return (
      <Card variant="outlined" sx={{ width: '100%' }}>
        <CardContent>
          <Typography component="h2" variant="subtitle2" gutterBottom>
            Gönüllü Aktivitesi
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Veriler yükleniyor...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const activityPercentage = totalVolunteers > 0 ? Math.round((activeVolunteers / totalVolunteers) * 100) : 0;

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Gönüllü Aktivitesi
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
              {activeVolunteers.toLocaleString('tr-TR')}
            </Typography>
            <Chip 
              size="small" 
              color="success" 
              label={`%${activityPercentage}`} 
            />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Bu ay aktif gönüllü sayısı
          </Typography>
        </Stack>
        <LineChart
          key={`chart-${new Date().getMonth()}-${data.length}`}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data,
              tickInterval: (_, i) => (i + 1) % 5 === 0,
              height: 24,
            },
          ]}
          yAxis={[{ width: 50 }]}
          series={[
            {
              id: 'active',
              label: 'Aktif',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: generateActivityData(activeVolunteers * 0.4, 0.15),
            },
            {
              id: 'participating',
              label: 'Katılımcı',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: generateActivityData(activeVolunteers * 0.35, 0.12),
            },
            {
              id: 'standby',
              label: 'Hazır',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              stackOrder: 'ascending',
              data: generateActivityData(activeVolunteers * 0.25, 0.1),
              area: true,
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
