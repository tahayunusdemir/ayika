import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SpeedIcon from '@mui/icons-material/Speed';
import ShieldIcon from '@mui/icons-material/Shield';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GroupsIcon from '@mui/icons-material/Groups';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

const items = [
  {
    icon: <SpeedIcon />,
    title: 'Hızlı Müdahale',
    description:
      'Afet anlarında kritik olan zamanı en verimli şekilde kullanarak yardım malzemelerinin hızlı dağıtımını sağlıyoruz.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Güvenli Sistem',
    description:
      'Kullanıcı verilerinin korunması ve güvenli iletişim için gelişmiş güvenlik sistemleri kullanıyoruz.',
  },
  {
    icon: <VisibilityIcon />,
    title: 'Şeffaf Süreç',
    description:
      'Yardım dağıtım sürecinin her aşaması şeffaf ve takip edilebilir. Hesap verebilirlik ilkesiyle hareket ediyoruz.',
  },
  {
    icon: <GroupsIcon />,
    title: 'Gönüllü Koordinasyonu',
    description:
      'Gönüllülerin yeteneklerine uygun görevlendirme ve etkili koordinasyon ile toplumsal dayanışmayı güçlendiriyoruz.',
  },
  {
    icon: <PhoneInTalkIcon />,
    title: 'Anlık İletişim',
    description:
      'Afetzedeler, gönüllüler ve yardım kuruluşları arasında kesintisiz iletişim ağı kuruyoruz.',
  },
  {
    icon: <PrecisionManufacturingIcon />,
    title: 'Akıllı Lojistik',
    description:
      'Akıllı rota planlama ve stok yönetimi sistemi ile en verimli yardım dağıtımını sağlıyoruz.',
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'text.primary',
        bgcolor: 'background.default',
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
            Neden Ayika?
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Ayika platformunun afet yönetiminde öne çıkan avantajlarını keşfedin: 
            hızlı müdahale, güvenli sistem, şeffaf süreç ve akıllı koordinasyon. 
            Türkiye'nin afet direncini artıran dijital çözüm.
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
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  '&:hover': {
                    boxShadow: 2,
                  },
                }}
              >
                <Box sx={{ color: 'primary.main' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
