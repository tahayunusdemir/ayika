import * as React from 'react';
import { Theme } from '@mui/material/styles';

// User Profile Types
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  location: string;
  joinDate: string;
  isVerified: boolean;
}

// Component Props Extensions
export interface BaseComponentProps extends React.ComponentProps<'div'> {
  loading?: boolean;
  disabled?: boolean;
}

// Theme-aware styling types
export type ThemeStyleProps = {
  theme: Theme;
};

export type ComponentStyleProps = ThemeStyleProps & {
  variant?: 'default' | 'compact' | 'detailed';
};

// Profile State for useProfile hook
export interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

// Password Change Data
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Profile Form Errors
export interface ProfileFormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
}

// Event handler types following React 19 patterns
export type ProfileEventHandlers = {
  onProfileUpdate?: (profile: UserProfile) => Promise<void>;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
};

// Generic component props with theme support
export interface ProfileComponentProps<T = {}> extends BaseComponentProps {
  data?: T;
  variant?: 'default' | 'compact' | 'detailed';
  themeProps?: Partial<ThemeStyleProps>;
}
