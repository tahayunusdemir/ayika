import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


const items = [
  {
    title: 'Akıllı Lojistik Yönetimi',
    description:
      'Yardım malzemelerinin depolanması, dağıtımı ve takibi için gelişmiş algoritmaları kullanarak en verimli rotaları belirler ve kaynak optimizasyonu sağlar.',
  },
  {
    title: 'Gönüllü Koordinasyonu',
    description:
      'Gönüllülerin yeteneklerine göre görevlendirilmesi, kayıt sistemi ve güvenlik doğrulaması ile etkili yardım organizasyonu.',
  },
  {
    title: 'Güvenli Veri Yönetimi',
    description:
      'Kullanıcı verileriniz güvenli sistemlerde korunur. Kimlik doğrulama ve veri şifreleme teknolojileri ile maksimum güvenlik sağlanır.',
  },
];


export default function Features() {

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Platform Özellikleri
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 } }}
        >
          Ayika platformunun afet yardım koordinasyonunda öne çıkan temel özellikleri. 
          Gelişmiş sistemler ile güvenli, hızlı ve etkili yardım dağıtımı sağlıyoruz.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          flexWrap: 'wrap',
          mt: 4,
        }}
      >
        {items.map(({ title, description }, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              width: { xs: '100%', sm: 300 },
              height: 250,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {description}
            </Typography>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
