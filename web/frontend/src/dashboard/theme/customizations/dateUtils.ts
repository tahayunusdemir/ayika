/**
 * Date utility functions for formatting dates in Turkish locale
 * Updated with dayjs support for DatePicker components
 */
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/tr';

// Set Turkish locale
dayjs.locale('tr');

export const dateUtils = {
  /**
   * Format date in long format (e.g., "15 Ocak 2024")
   */
  formatDateLong: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(dateObj);
  },

  /**
   * Format date in short format (e.g., "15.01.2024")
   */
  formatDateShort: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  },

  /**
   * Format date with time (e.g., "15 Ocak 2024, 14:30")
   */
  formatDateTime: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  },

  /**
   * Format relative time (e.g., "2 gün önce")
   */
  formatRelativeTime: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Bugün';
    } else if (diffInDays === 1) {
      return 'Dün';
    } else if (diffInDays < 7) {
      return `${diffInDays} gün önce`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} hafta önce`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} ay önce`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years} yıl önce`;
    }
  },

  /**
   * Check if date is valid
   */
  isValidDate: (date: string | Date): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  },

  /**
   * Convert date to dayjs object
   */
  toDayjs: (date: string | Date | null | undefined): Dayjs | null => {
    if (!date) return null;
    return dayjs(date);
  },

  /**
   * Get current date as dayjs object
   */
  now: (): Dayjs => {
    return dayjs();
  },

  /**
   * Check if first date is after second date
   */
  isAfter: (date1: Dayjs, date2: Dayjs): boolean => {
    return date1.isAfter(date2);
  },

  /**
   * Check if first date is before second date
   */
  isBefore: (date1: Dayjs, date2: string | Date | Dayjs): boolean => {
    const date2Dayjs = typeof date2 === 'string' || date2 instanceof Date ? dayjs(date2) : date2;
    return date1.isBefore(date2Dayjs);
  },

  /**
   * Get DatePicker props for Turkish localization
   */
  getDatePickerProps: () => ({
    format: 'DD/MM/YYYY',
    slotProps: {
      textField: {
        placeholder: 'GG/AA/YYYY',
      },
    },
  })
};
