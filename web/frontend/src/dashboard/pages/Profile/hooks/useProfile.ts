import * as React from 'react';
import type { UserProfile, ProfileState } from '../types/profile.types';
import { useAuth } from '../../../../contexts/AuthContext';

export const useProfile = () => {
  const { user, refreshUser } = useAuth();
  
  const [state, setState] = React.useState<ProfileState>({
    profile: user || null,
    loading: false,
    error: null
  });

  // Update state when auth user changes
  React.useEffect(() => {
    setState(prev => ({
      ...prev,
      profile: user || null,
      loading: false
    }));
  }, [user]);

  // Fetch fresh profile data
  const fetchProfile = React.useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await refreshUser();
      setState(prev => ({
        ...prev,
        profile: user || null,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Profil bilgileri yüklenemedi',
        loading: false
      }));
    }
  }, [refreshUser, user]);

  // Memoize return value to prevent unnecessary re-renders
  const returnValue = React.useMemo(() => ({
    ...state,
    refetch: fetchProfile
  }), [state, fetchProfile]);

  return returnValue;
};
