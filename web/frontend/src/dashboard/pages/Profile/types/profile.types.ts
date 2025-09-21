import * as React from 'react';
import { Theme } from '@mui/material/styles';

// User Profile Types - Updated for Volunteer Backend
export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  volunteer_profile?: VolunteerProfile;
}

export interface VolunteerProfile {
  id: number;
  gonulluluk_no: string;
  ad: string;
  soyad: string;
  telefon: string;
  sehir: string;
  sehir_display: string;
  gonullu_tipi: string;
  gonullu_tipi_display: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  full_name: string;
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
