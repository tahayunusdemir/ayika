import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CityFlowData } from '../api/cargoStats';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface CityFlowChartProps {
  data: CityFlowData[];
  loading?: boolean;
}

export default function CityFlowChart({ data, loading }: CityFlowChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
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
              {entry.name === 'outgoing' ? 'Giden' : 'Gelen'}: {entry.value} kargo
            </Typography>
          ))}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontWeight: 'bold' }}>
            Net: {payload[0]?.payload.outgoing - payload[1]?.payload.incoming} kargo
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
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Şehir Bazlı Kargo Akışı
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Şehirlere giden ve gelen kargo sayıları
      </Typography>
      
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="city" 
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
            iconType="rect"
            formatter={(value) => (
              <span style={{ fontSize: '12px' }}>
                {value === 'outgoing' ? 'Giden Kargolar' : 'Gelen Kargolar'}
              </span>
            )}
          />
          <Bar 
            dataKey="outgoing" 
            fill="#2196f3" 
            name="outgoing"
            radius={[2, 2, 0, 0]}
            maxBarSize={40}
          />
          <Bar 
            dataKey="incoming" 
            fill="#4caf50" 
            name="incoming"
            radius={[2, 2, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Flow Indicators */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArrowUpwardIcon sx={{ color: '#2196f3', fontSize: 16 }} />
          <Typography variant="caption" color="text.secondary">
            Giden Kargolar
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArrowDownwardIcon sx={{ color: '#4caf50', fontSize: 16 }} />
          <Typography variant="caption" color="text.secondary">
            Gelen Kargolar
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
