import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import SitemarkIcon from '../../shared-theme/components/SitemarkIcon';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Telif Hakkı © '}
      <Link color="text.secondary" href="/">
        Ayika
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: { xs: '100%', sm: '60%' },
            alignItems: { xs: 'center', sm: 'flex-start' },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
            <SitemarkIcon />
          </Box>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ color: 'text.secondary' }}
          >
            <IconButton
              color="inherit"
              size="small"
              href="https://github.com/tahayunusdemir/ayika"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              color="inherit"
              size="small"
              href="mailto:ayikadestek@gmail.com"
              aria-label="E-posta"
            >
              <EmailIcon />
            </IconButton>
          </Stack>
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Link color="text.secondary" variant="body2" href="/">
              Gizlilik Politikası
            </Link>
            <Copyright />
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Ana Sayfa
          </Typography>
          <Link color="text.secondary" variant="body2" href="/#features">
            Özellikler
          </Link>
          <Link color="text.secondary" variant="body2" href="/#highlights">
            Öne Çıkanlar
          </Link>
          <Link color="text.secondary" variant="body2" href="/#team">
            Ekibimiz
          </Link>
          <Link color="text.secondary" variant="body2" href="/#contact">
            İletişim
          </Link>
          <Link color="text.secondary" variant="body2" href="/#faq">
            S.S.S
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
