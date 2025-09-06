import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface NotificationItemProps {
  id: string;
  message: string;
  timestamp: string;
  onClose: (id: string) => void;
}

export default function NotificationItem({ id, message, timestamp, onClose }: NotificationItemProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        mb: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      <Box>
        <Typography variant="body1">{message}</Typography>
        <Typography variant="caption" color="text.secondary">
          {timestamp}
        </Typography>
      </Box>
      <IconButton size="small" onClick={() => onClose(id)}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
