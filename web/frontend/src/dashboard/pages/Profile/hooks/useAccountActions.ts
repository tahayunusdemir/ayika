import * as React from 'react';
import type { PasswordChangeData, ProfileFormErrors } from '../types/profile.types';
import { authService } from '../../../../services/authService';

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

      // Call backend API
      const response = await authService.changePassword(data.currentPassword, data.newPassword);
      
      if (!response.success) {
        if (response.errors) {
          setState(prev => ({
            ...prev,
            formErrors: {
              currentPassword: response.errors?.current_password?.[0],
              newPassword: response.errors?.new_password?.[0]
            },
            loading: false
          }));
        } else {
          setState(prev => ({
            ...prev,
            error: response.message || 'Şifre değiştirilemedi',
            loading: false
          }));
        }
        return Promise.reject(new Error(response.message));
      }
      
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


  // Deactivate account
  const deactivateAccount = React.useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authService.deactivateAccount();
      
      if (!response.success) {
        setState(prev => ({
          ...prev,
          error: response.message || 'Hesap deaktif edilemedi',
          loading: false
        }));
        return Promise.reject(new Error(response.message));
      }
      
      setState(prev => ({ ...prev, loading: false }));
      return Promise.resolve();
      
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Hesap deaktif edilemedi',
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
    deactivateAccount,
    clearError
  };
};
