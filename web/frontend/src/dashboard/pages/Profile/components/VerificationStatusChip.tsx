import * as React from 'react';
import { Chip, Fade } from '@mui/material';
import { VerifiedUser, Cancel } from '@mui/icons-material';

interface VerificationStatusChipProps {
  isVerified: boolean;
}

const VerificationStatusChip: React.FC<VerificationStatusChipProps> = React.memo(({ isVerified }) => {
  return (
    <Fade in timeout={400}>
      <Chip
        icon={isVerified ? <VerifiedUser /> : <Cancel />}
        label={isVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
        color={isVerified ? 'success' : 'error'}
        variant="filled"
        size="small"
        sx={{
          fontWeight: 600,
          '& .MuiChip-icon': {
            fontSize: '16px'
          }
        }}
      />
    </Fade>
  );
});

export default VerificationStatusChip;
