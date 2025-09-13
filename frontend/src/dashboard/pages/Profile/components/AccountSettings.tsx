import * as React from 'react';
import { Box, Divider, Fade } from '@mui/material';
import SecuritySection from './SecuritySection';
import DangerZone from './DangerZone';

interface AccountSettingsProps {
  loading: boolean;
  onOpenPasswordReset: () => void;
  onOpenAccountDelete: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = React.memo(({
  loading,
  onOpenPasswordReset,
  onOpenAccountDelete
}) => {
  return (
    <Fade in timeout={300}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <SecuritySection 
          loading={loading}
          onOpenPasswordReset={onOpenPasswordReset}
        />

        <Divider />

        <DangerZone 
          loading={loading}
          onOpenAccountDelete={onOpenAccountDelete}
        />
      </Box>
    </Fade>
  );
});

export default AccountSettings;
