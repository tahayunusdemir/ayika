import * as React from 'react';
import { FormControl, FormLabel, TextField, Fade } from '@mui/material';

interface ReadOnlyFormFieldProps {
  id: string;
  name: string;
  label: string;
  value: string | undefined;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  fullWidth?: boolean;
}

const ReadOnlyFormField: React.FC<ReadOnlyFormFieldProps> = React.memo(({
  id,
  name,
  label,
  value,
  placeholder,
  disabled = false,
  loading = false,
  required = false,
  fullWidth = true
}) => {
  const isDisabled = disabled || loading;

  return (
    <Fade in timeout={300}>
      <FormControl fullWidth={fullWidth} variant="outlined" sx={{ mb: 1 }}>
        <FormLabel 
          htmlFor={id} 
          sx={{ 
            mb: 1, 
            fontWeight: 600,
            color: isDisabled ? 'text.secondary' : 'text.primary'
          }}
        >
          {label}{required && ' *'}
        </FormLabel>
        <TextField
          id={id}
          name={name}
          value={value || ''}
          placeholder={placeholder}
          variant="outlined"
          size="medium"
          aria-label={label}
          aria-readonly="true"
          aria-busy={loading}
          InputProps={{
            readOnly: true,
          }}
          disabled={isDisabled}
          sx={{
            '& .MuiInputBase-input': {
              backgroundColor: 'transparent',
              cursor: 'default',
              color: isDisabled ? 'text.disabled' : 'text.primary'
            },
            '& .MuiOutlinedInput-root': {
              backgroundColor: isDisabled ? 'action.disabledBackground' : 'background.paper',
              '&:hover': {
                backgroundColor: isDisabled ? 'action.disabledBackground' : 'background.paper',
              },
              '&.Mui-focused': {
                backgroundColor: isDisabled ? 'action.disabledBackground' : 'background.paper',
              }
            }
          }}
        />
      </FormControl>
    </Fade>
  );
});

export default ReadOnlyFormField;
