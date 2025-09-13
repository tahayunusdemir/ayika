import * as React from 'react';
import type { UserProfile, ProfileState } from '../types/profile.types';

// Mock data for demonstration - would be replaced with actual API calls
const MOCK_USER_DATA: UserProfile = {
  id: '1',
  firstName: 'Örnek',
  lastName: 'Kullanıcı',
  email: 'ornek@mail.com',
  phoneNumber: '+90 555 123 45 67',
  location: 'İstanbul, Türkiye',
  joinDate: '2023-01-15',
  isVerified: true
};

export const useProfile = () => {
  const [state, setState] = React.useState<ProfileState>({
    profile: MOCK_USER_DATA, // Initialize with mock data immediately
    loading: false,
    error: null
  });

  // Simulate API call to fetch profile data
  const fetchProfile = React.useCallback(async () => {
    setState((prev: ProfileState) => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate network delay - reduced for faster loading
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setState((prev: ProfileState) => ({
        ...prev,
        profile: MOCK_USER_DATA,
        loading: false
      }));
    } catch (error) {
      setState((prev: ProfileState) => ({
        ...prev,
        error: 'Profil bilgileri yüklenemedi',
        loading: false
      }));
    }
  }, []);

  // Load profile on mount
  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Memoize return value to prevent unnecessary re-renders
  const returnValue = React.useMemo(() => ({
    ...state,
    refetch: fetchProfile
  }), [state, fetchProfile]);

  return returnValue;
};
