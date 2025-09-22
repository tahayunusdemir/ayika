import { Paper, Typography, Box, CircularProgress, LinearProgress } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { VolunteerAssignmentData } from '../api/cargoStats';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';

interface VolunteerAssignmentChartProps {
  data: VolunteerAssignmentData[];
  loading?: boolean;
}

const getVolunteerIcon = (type: string) => {
  switch (type) {
    case 'Toplama':
      return InventoryIcon;
    case 'Taşıma':
      return LocalShippingIcon;
    case 'Dağıtım':
      return DeliveryDiningIcon;
    default:
      return PersonIcon;
  }
};

const getVolunteerColor = (type: string) => {
  switch (type) {
    case 'Toplama':
      return '#2196f3';
    case 'Taşıma':
      return '#9c27b0';
    case 'Dağıtım':
      return '#4caf50';
    default:
      return '#607d8b';
  }
};

export default function VolunteerAssignmentChart({ data, loading }: VolunteerAssignmentChartProps) {
  const pieData = data.map(item => ({
    name: item.type,
    value: item.assigned,
    percentage: item.percentage,
    color: getVolunteerColor(item.type)
  }));

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
            {data.name} Gönüllüleri
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Atanmış: {data.value} kargo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Yüzde: %{data.percentage ? data.percentage.toFixed(1) : '0.0'}
          </Typography>
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
        Gönüllü Atama Analizi
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Kargolara atanan gönüllü türlerinin dağılımı
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: 380 }}>
        {/* Pie Chart */}
        <Box sx={{ flex: 1, minHeight: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: %${percentage ? percentage.toFixed(0) : '0'}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Assignment Details */}
        <Box sx={{ flex: 1, pl: { md: 2 }, pt: { xs: 2, md: 0 } }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Detaylı Atama Bilgileri
          </Typography>
          
          {data.map((item, index) => {
            const IconComponent = getVolunteerIcon(item.type);
            const color = getVolunteerColor(item.type);
            
            return (
              <Box key={index} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: '50%',
                      backgroundColor: color,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32
                    }}
                  >
                    <IconComponent sx={{ fontSize: 16 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.type} Gönüllüleri
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.assigned} kargo atanmış
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    %{item.percentage ? item.percentage.toFixed(1) : '0.0'}
                  </Typography>
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={item.percentage}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: color,
                      borderRadius: 3
                    }
                  }}
                />
              </Box>
            );
          })}

          {/* Total Summary */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: 'grey.50',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <GroupIcon sx={{ color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Toplam Atanmış Kargo
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {data.reduce((sum, item) => sum + item.assigned, 0).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
