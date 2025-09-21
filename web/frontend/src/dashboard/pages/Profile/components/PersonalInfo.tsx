import * as React from 'react';
import { Grid, Box, Fade } from '@mui/material';
import { UserProfile } from '../types/profile.types.ts';
import ProfileHeader from './ProfileHeader';
import ReadOnlyFormField from './ReadOnlyFormField';

interface PersonalInfoProps {
  profile: UserProfile;
  loading: boolean;
}

const PersonalInfo: React.FC<PersonalInfoProps> = React.memo(({ 
  profile, 
  loading
}) => {
  return (
    <Fade in timeout={300}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <ProfileHeader profile={profile} />
        
        {/* Profile Form */}
        <Grid container spacing={3} columns={12}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ReadOnlyFormField
              id="gonulluluk_no"
              name="gonulluluk_no"
              label="Gönüllülük No"
              value={profile.volunteer_profile?.gonulluluk_no || 'Henüz atanmadı'}
              loading={loading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <ReadOnlyFormField
              id="email"
              name="email"
              label="E-posta"
              value={profile.email}
              loading={loading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <ReadOnlyFormField
              id="ad"
              name="ad"
              label="Ad"
              value={profile.volunteer_profile?.ad || profile.first_name || '-'}
              loading={loading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <ReadOnlyFormField
              id="soyad"
              name="soyad"
              label="Soyad"
              value={profile.volunteer_profile?.soyad || profile.last_name || '-'}
              loading={loading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <ReadOnlyFormField
              id="telefon"
              name="telefon"
              label="Telefon"
              value={profile.volunteer_profile?.telefon || 'Henüz girilmedi'}
              placeholder="5XXXXXXXXX"
              loading={loading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <ReadOnlyFormField
              id="sehir"
              name="sehir"
              label="Şehir"
              value={profile.volunteer_profile?.sehir_display || 'Henüz seçilmedi'}
              loading={loading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <ReadOnlyFormField
              id="gonullu_tipi"
              name="gonullu_tipi"
              label="Gönüllü Tipi"
              value={profile.volunteer_profile?.gonullu_tipi_display || 'Henüz atanmadı'}
              loading={loading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <ReadOnlyFormField
              id="created_at"
              name="created_at"
              label="Kayıt Tarihi"
              value={profile.volunteer_profile?.created_at ? new Date(profile.volunteer_profile.created_at).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
              loading={loading}
            />
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
});

export default PersonalInfo;
