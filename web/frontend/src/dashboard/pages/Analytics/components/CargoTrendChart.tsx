import { Paper, Typography, Box, CircularProgress, Chip } from '@mui/material';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { CargoStats } from '../api/cargoStats';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

interface CargoTrendChartProps {
  data: CargoStats['timeBased'];
  loading?: boolean;
}

export default function CargoTrendChart({ data, loading }: CargoTrendChartProps) {
  const chartData = data.daily_distribution.map(item => ({
    date: new Date(item.date).toLocaleDateString('tr-TR', { 
      month: 'short', 
      day: 'numeric' 
    }),
    count: item.count,
    fullDate: item.date
  }));

  // Calculate trend
  const getTrend = () => {
    if (chartData.length < 2) return 'flat';
    
    const firstWeek = chartData.slice(0, 7).reduce((sum, item) => sum + item.count, 0) / 7;
    const lastWeek = chartData.slice(-7).reduce((sum, item) => sum + item.count, 0) / 7;
    
    const change = ((lastWeek - firstWeek) / firstWeek) * 100;
    
    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'flat';
  };

  const trend = getTrend();
  const trendIcon = trend === 'up' ? TrendingUpIcon : trend === 'down' ? TrendingDownIcon : TrendingFlatIcon;
  const trendColor = trend === 'up' ? 'success' : trend === 'down' ? 'error' : 'default';
  const trendText = trend === 'up' ? 'Artış Trendi' : trend === 'down' ? 'Azalış Trendi' : 'Sabit Trend';

  const CustomTooltip = ({ active, payload }: any) => {
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
          <Typography variant="body2" fontWeight="bold">
            {new Date(data.fullDate).toLocaleDateString('tr-TR', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kargo Sayısı: {data.count}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Kargo Trend Analizi
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Son {data.period_days} günlük kargo oluşturma trendi
          </Typography>
        </Box>
        
        <Chip
          icon={React.createElement(trendIcon, { sx: { fontSize: 16 } })}
          label={trendText}
          color={trendColor as any}
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Stats Summary */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Toplam Kargo
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {data.total_in_period}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Günlük Ortalama
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {data.daily_average ? data.daily_average.toFixed(1) : '0.0'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            En Yüksek
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {Math.max(...chartData.map(item => item.count))}
          </Typography>
        </Box>
      </Box>
      
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2196f3" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2196f3" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#2196f3"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCount)"
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#2196f3"
            strokeWidth={2}
            dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#2196f3', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}

// React import for createElement
import React from 'react';
