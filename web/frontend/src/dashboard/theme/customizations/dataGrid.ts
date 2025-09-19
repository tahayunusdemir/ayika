import type { Theme } from '@mui/material/styles';

export const dataGridCustomizations: Theme['components'] = {
  MuiDataGrid: {
    styleOverrides: {
      root: {
        border: 'none',
        '& .MuiDataGrid-cell': {
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
        },
        '& .MuiDataGrid-columnHeaders': {
          borderBottom: '2px solid',
          borderBottomColor: 'divider',
          backgroundColor: 'background.paper',
        },
        '& .MuiDataGrid-footerContainer': {
          borderTop: '1px solid',
          borderTopColor: 'divider',
        },
      },
    },
  },
};
