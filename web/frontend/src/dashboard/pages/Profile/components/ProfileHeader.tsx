import * as React from 'react';
import { Box, Typography, Card, CardContent, Fade, Stack, Button } from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { UserProfile } from '../types/profile.types';
import VerificationStatusChip from './VerificationStatusChip';
import VolunteerBusinessCard from '../../Volunteers/components/VolunteerBusinessCard';

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = React.memo(({ profile }) => {
  const [businessCardOpen, setBusinessCardOpen] = React.useState(false);

  // Convert UserProfile to Volunteer format for business card
  const volunteerData = React.useMemo(() => {
    if (!profile.volunteer_profile) return null;
    
    return {
      id: profile.volunteer_profile.id,
      gonulluluk_no: profile.volunteer_profile.gonulluluk_no,
      ad: profile.volunteer_profile.ad,
      soyad: profile.volunteer_profile.soyad,
      email: profile.email, // Add email field from user profile
      telefon: profile.volunteer_profile.telefon,
      sehir: profile.volunteer_profile.sehir,
      gonullu_tipi: profile.volunteer_profile.gonullu_tipi as any,
      is_active: profile.volunteer_profile.is_active,
      created_at: profile.volunteer_profile.created_at,
      updated_at: profile.volunteer_profile.updated_at,
      user: {
        id: profile.id,
        username: profile.email, // Use email as username fallback
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        is_active: profile.is_active
      }
    };
  }, [profile]);

  return (
    <>
      <Fade in timeout={200}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              justifyContent: 'space-between', 
              flexWrap: 'wrap', 
              gap: 2
            }}>
              <Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                  {profile.volunteer_profile?.full_name || `${profile.first_name} ${profile.last_name}` || profile.email}
                </Typography>
                
                {/* Doğrulanmış chip - Test User altında */}
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <VerificationStatusChip isVerified={profile.is_active} />
                </Stack>
                
                {profile.volunteer_profile?.gonulluluk_no && (
                  <Typography variant="body2" color="text.secondary">
                    Gönüllülük No: {profile.volunteer_profile.gonulluluk_no}
                  </Typography>
                )}
              </Box>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-end">
                
                {/* Business Card Button - Only show if volunteer profile exists */}
                {profile.volunteer_profile && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<QrCodeIcon />}
                    onClick={() => setBusinessCardOpen(true)}
                    sx={{ minWidth: 'auto' }}
                  >
                    Gönüllü Kartı Oluştur
                  </Button>
                )}
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Fade>

      {/* Business Card Dialog */}
      {volunteerData && (
        <VolunteerBusinessCard
          open={businessCardOpen}
          volunteer={volunteerData}
          onClose={() => setBusinessCardOpen(false)}
        />
      )}
    </>
  );
});

export default ProfileHeader;
