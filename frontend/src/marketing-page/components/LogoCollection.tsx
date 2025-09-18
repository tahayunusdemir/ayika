import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

// Local logos import
import tubitakLogo from '../../assets/sponsors/tubitak-logo.png';
import dpuLogo from '../../assets/sponsors/dpu-logo.png';

// Partner institutions and organizations supporting the project
const partnerLogos = [
  {
    src: tubitakLogo,
    alt: 'TÜBİTAK - Türkiye Bilimsel ve Teknolojik Araştırma Kurumu',
    description: 'Bilim, teknoloji ve yenilik alanlarında Türkiye\'nin önde gelen araştırma kurumu',
    url: 'https://www.tubitak.gov.tr' // TÜBİTAK web sitesi
  },
  {
    src: dpuLogo,
    alt: 'DPÜ - Kütahya Dumlupınar Üniversitesi',
    description: 'Akademik mükemmellik ve araştırma odaklı öğretim ile tanınan köklü üniversite',
    url: 'https://dpu.edu.tr' // DPÜ web sitesi
  }
];

const logoStyle = {
  height: 'auto',
  maxWidth: '300px',
  maxHeight: '150px',
  margin: '0 32px',
  opacity: 1,
};

export default function LogoCollection() {
  return (
    <Box id="logoCollection" sx={{ py: 4 }}>
      <Typography
        component="p"
        variant="subtitle2"
        align="center"
        sx={{ color: 'text.secondary' }}
      >
Ayika projesini destekleyen kurumlarımız
      </Typography>
      <Grid container sx={{ justifyContent: 'center', mt: 2 }}>
        {partnerLogos.map((partner, index) => (
          <Grid key={index} sx={{ textAlign: 'center' }}>
            <a
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              title={partner.alt}
              style={{ textDecoration: 'none' }}
            >
              <img
                src={partner.src}
                alt={partner.alt}
                style={{ ...logoStyle, objectFit: 'contain' }} // objectFit buraya taşındı
              />
            </a>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
