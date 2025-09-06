import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LockResetIcon from '@mui/icons-material/LockReset';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

export default function Profile() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '900px' } }}>
      {/* Profil Başlık */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccountCircleRoundedIcon color="primary" />
            <Typography variant="h4" component="h1">
              Profil
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Kişisel bilgilerinizi ve hesap ayarlarınızı yönetin.
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        {/* Kişisel Bilgiler */}
        <Card>
          <CardContent sx={{ py: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontSize: '1.1rem' }}>
              <PersonIcon color="primary" sx={{ fontSize: 20 }} />
              Kişisel Bilgiler
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PersonIcon sx={{ fontSize: 18, color: 'text.secondary', minWidth: 18 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                    Ad Soyad
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    Ornek Kullanıcı
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon sx={{ fontSize: 18, color: 'text.secondary', minWidth: 18 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                    Email
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    ornek@example.com
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary', minWidth: 18 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                    Konum
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    İstanbul, Türkiye
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary', minWidth: 18 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                    Kayıt Tarihi
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    15 Ocak 2024
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Hesap Yönetimi */}
        <Card>
          <CardContent sx={{ py: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontSize: '1.1rem' }}>
              <LockResetIcon color="primary" sx={{ fontSize: 20 }} />
              Hesap Yönetimi
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/* Şifre Değiştirme */}
              <ListItemButton 
                sx={{ 
                  border: 1, 
                  borderColor: 'divider',
                  borderRadius: 1,
                  py: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'primary.50',
                    borderColor: 'primary.main',
                    transform: 'translateY(-1px)',
                    boxShadow: 1,
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LockResetIcon color="primary" sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                      Şifre Değiştir
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Hesap güvenliği için şifrenizi güncelleyin
                    </Typography>
                  }
                />
              </ListItemButton>

              {/* Hesap Silme */}
              <ListItemButton 
                sx={{ 
                  border: 1, 
                  borderColor: 'error.main',
                  borderRadius: 1,
                  py: 1.5,
                  color: 'error.main',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'error.main',
                    color: 'error.contrastText',
                    transform: 'translateY(-1px)',
                    boxShadow: 1,
                    '& .MuiListItemIcon-root': {
                      color: 'error.contrastText',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <DeleteIcon color="error" sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                      Hesabı Sil
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                      Bu işlem geri alınamaz
                    </Typography>
                  }
                />
              </ListItemButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
