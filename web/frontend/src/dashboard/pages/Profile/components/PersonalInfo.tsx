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
              id="firstName"
              name="firstName"
              label="Ad"
              value={profile.firstName}
              loading={loading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <ReadOnlyFormField
              id="lastName"
              name="lastName"
              label="Soyad"
              value={profile.lastName}
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
              id="phoneNumber"
              name="phoneNumber"
              label="Telefon"
              value={profile.phoneNumber}
              placeholder="+90 5XX XXX XX XX"
              loading={loading}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <ReadOnlyFormField
              id="location"
              name="location"
              label="Konum"
              value={profile.location}
              placeholder="Şehir, İlçe"
              loading={loading}
            />
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
});

export default PersonalInfo;
