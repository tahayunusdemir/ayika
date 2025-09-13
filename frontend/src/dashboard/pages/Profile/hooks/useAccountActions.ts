import * as React from 'react';
import type { PasswordChangeData, ProfileFormErrors } from '../types/profile.types';

interface AccountActionsState {
  loading: boolean;
  error: string | null;
  formErrors: ProfileFormErrors;
}

export const useAccountActions = () => {
  const [state, setState] = React.useState<AccountActionsState>({
    loading: false,
    error: null,
    formErrors: {}
  });

  // Password validation
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Şifre en az 8 karakter olmalıdır';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Şifre en az bir küçük harf içermelidir';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Şifre en az bir büyük harf içermelidir';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Şifre en az bir rakam içermelidir';
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return 'Şifre en az bir özel karakter içermelidir (@$!%*?&)';
    }
    return null;
  };

  // Change password
  const changePassword = React.useCallback(async (data: PasswordChangeData) => {
    setState(prev => ({ ...prev, loading: true, error: null, formErrors: {} }));
    
    try {
      // Validate form data
      const errors: ProfileFormErrors = {};
      
      if (!data.currentPassword) {
        errors.currentPassword = 'Mevcut şifre gereklidir';
      }
      
      if (!data.newPassword) {
        errors.newPassword = 'Yeni şifre gereklidir';
      } else {
        const passwordError = validatePassword(data.newPassword);
        if (passwordError) {
          errors.newPassword = passwordError;
        }
      }
      
      if (!data.confirmNewPassword) {
        errors.confirmNewPassword = 'Şifre tekrarı gereklidir';
      } else if (data.newPassword !== data.confirmNewPassword) {
        errors.confirmNewPassword = 'Şifreler uyuşmuyor';
      }
      
      if (data.currentPassword === data.newPassword) {
        errors.newPassword = 'Yeni şifre eski şifreden farklı olmalıdır';
      }
      
      if (Object.keys(errors).length > 0) {
        setState(prev => ({
          ...prev,
          formErrors: errors,
          loading: false
        }));
        return Promise.reject(new Error('Validation failed'));
      }

      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate wrong current password error
          if (data.currentPassword !== 'dummyPassword') {
            reject(new Error('Mevcut şifre yanlış'));
            return;
          }
          resolve(true);
        }, 2000);
      });
      
      setState(prev => ({ ...prev, loading: false }));
      
      return Promise.resolve();
      
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Şifre değiştirilemedi',
        loading: false
      }));
      return Promise.reject(error);
    }
  }, []);


  // Clear errors
  const clearError = React.useCallback(() => {
    setState(prev => ({ ...prev, error: null, formErrors: {} }));
  }, []);

  return {
    ...state,
    changePassword,
    clearError
  };
};
