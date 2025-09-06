import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';

const items = [
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: 'Uyarlanabilir performans',
    description:
      'Ürünümüz ihtiyaçlarınıza zahmetsizce uyum sağlayarak verimliliği artırır ve görevlerinizi basitleştirir.',
  },
  {
    icon: <ConstructionRoundedIcon />,
    title: 'Uzun ömürlü',
    description:
      'Kalıcı yatırımla eşsiz dayanıklılığı deneyimleyin.',
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: 'Harika kullanıcı deneyimi',
    description:
      'Sezgisel ve kullanımı kolay bir arayüzle ürünümüzü rutininize entegre edin.',
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: 'Yenilikçi işlevsellik',
    description:
      'Yeni standartlar belirleyen, gelişen ihtiyaçlarınızı diğerlerinden daha iyi karşılayan özelliklerle önde olun.',
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: 'Güvenilir destek',
    description:
      'Satın alma ötesine geçen destek sunan duyarlı müşteri desteğimize güvenin.',
  },
  {
    icon: <QueryStatsRoundedIcon />,
    title: 'Her ayrıntıda hassasiyet',
    description:
      'Küçük dokunuşların genel deneyiminiz üzerinde önemli bir etki yarattığı titizlikle hazırlanmış bir ürünün keyfini çıkarın.',
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: 'grey.900',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Öne Çıkanlar
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Ürünümüzün neden öne çıktığını keşfedin: uyarlanabilirlik, dayanıklılık,
            kullanıcı dostu tasarım ve yenilikçilik. Güvenilir müşteri desteği ve
            her ayrıntıda hassasiyetin keyfini çıkarın.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'grey.800',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
