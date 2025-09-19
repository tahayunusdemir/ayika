import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import tahaPhoto from '../../assets/team/taha.jpg';
import harunPhoto from '../../assets/team/harun.jpg';
import hamzaPhoto from '../../assets/team/hamza.jpg';
import durmusPhoto from '../../assets/team/durmus.jpg';

interface TeamMember {
  name: string;
  role: string;
  university: string;
  photo: string;
  linkedin?: string;
  github?: string;
  email: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Taha Yunus Demir',
    role: 'Bilgisayar Mühendisliği - 4. Sınıf',
    university: 'Kütahya Dumlupınar Üniversitesi',
    photo: tahaPhoto,
    linkedin: 'https://linkedin.com/in/taha-yunus-demir',
    github: 'https://github.com/tahayunusdemir',
    email: 'mailto:tahayunusdemir@gmail.com',
  },
  {
    name: 'Harun Celen',
    role: 'Bilgisayar Mühendisliği - 4. Sınıf',
    university: 'Kırıkkale Üniversitesi',
    photo: harunPhoto,
    linkedin: 'https://linkedin.com/in/harun-celen-566665258',
    github: 'https://github.com/HarunCelen',
    email: 'mailto:haruncelen89@gmail.com',
  },
  {
    name: 'Hamza Erdal',
    role: 'Bilgisayar Mühendisliği - 4. Sınıf',
    university: 'Kütahya Dumlupınar Üniversitesi',
    photo: hamzaPhoto,
    linkedin: 'https://linkedin.com/in/hamza-erdal-29b58519b',
    github: 'https://github.com/Toruk-Makto-01',
    email: 'mailto:hamzaerdal123@gmail.com',
  },
  {
    name: 'Doç. Dr. Durmuş Özdemir',
    role: 'Akademik Danışman',
    university: 'Kütahya Dumlupınar Üniversitesi',
    photo: durmusPhoto,
    email: 'mailto:durmus.ozdemir@dpu.edu.tr',
  },
];

export default function Team() {
  return (
    <Container
      id="team"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
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
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
          <Typography
            component="h2"
            variant="h4"
            sx={{
              color: 'text.primary',
              fontWeight: 'bold',
            }}
          >
            Ekibimiz
          </Typography>
        </Stack>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            mb: 4,
          }}
        >
          TÜBİTAK 2209-A desteğiyle Ayika projesini geliştiren multidisipliner ekibimizle tanışın. 
          Afet yönetimi alanında teknolojik çözümler üretmek için bir araya gelen deneyimli takımımız.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ maxWidth: '1200px' }}>
        {teamMembers.map((member) => (
          <Grid key={member.name} size={{ xs: 12, sm: 6, md: 3 }} columns={12}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3,
                textAlign: 'center',
              }}
            >
              <Avatar
                src={member.photo}
                alt={member.name}
                sx={{
                  width: 80,
                  height: 80,
                  mb: 2,
                }}
              />

              <CardContent sx={{ flexGrow: 1, p: 0, '&:last-child': { pb: 0 } }}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: 1,
                  }}
                >
                  {member.name}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 'medium',
                    mb: 0.5,
                  }}
                >
                  {member.role}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 2,
                    fontStyle: 'italic',
                  }}
                >
                  {member.university}
                </Typography>

                <Stack 
                  direction="row" 
                  spacing={1} 
                  justifyContent="center"
                  sx={{ color: 'text.secondary' }}
                >
                  {member.linkedin && (
                    <IconButton
                      component="a"
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      color="inherit"
                      sx={{ alignSelf: 'center' }}
                    >
                      <LinkedInIcon />
                    </IconButton>
                  )}

                  {member.github && (
                    <IconButton
                      component="a"
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      color="inherit"
                      sx={{ alignSelf: 'center' }}
                    >
                      <GitHubIcon />
                    </IconButton>
                  )}

                  <IconButton
                    component="a"
                    href={member.email}
                    size="small"
                    color="inherit"
                    sx={{ alignSelf: 'center' }}
                  >
                    <EmailIcon />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
