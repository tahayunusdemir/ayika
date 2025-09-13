import * as React from 'react';
import { Box, Typography, Stack, Card, CardContent, Fade } from '@mui/material';
import { UserProfile } from '../types/profile.types';
import VerificationStatusChip from './VerificationStatusChip';

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = React.memo(({ profile }) => {
  const formatJoinDate = React.useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const formattedDate = React.useMemo(() => 
    formatJoinDate(profile.joinDate), 
    [formatJoinDate, profile.joinDate]
  );

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
                Katılım Tarihi: {formattedDate}
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
