import * as React from 'react';
import { Box, Typography, Card, CardContent, Fade, Stack } from '@mui/material';
import { UserProfile } from '../types/profile.types';
import { dateUtils } from '../../../theme/customizations/dateUtils';
import VerificationStatusChip from './VerificationStatusChip';

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = React.memo(({ profile }) => {

  return (
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
                {profile.firstName} {profile.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Katılım Tarihi: {dateUtils.formatDateLong(profile.joinDate)}
              </Typography>
            </Box>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <VerificationStatusChip isVerified={profile.isVerified} />
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
});

export default ProfileHeader;
