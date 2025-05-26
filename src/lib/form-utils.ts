import { z } from 'zod';
import { formSchema, type FormData } from './form-schemas';

export const formatCurrency = (value: string | number) => {
  const number = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);

  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

export const getYearRange = () => {
  const currentYear = new Date().getFullYear();
  return {
    minYear: currentYear - 100,
    maxYear: currentYear - 18,
  };
};

export const validateFormData = async (data: Partial<FormData>) => {
  try {
    const result = await formSchema.safeParseAsync(data);
    return {
      success: result.success,
      data: result.success ? result.data : undefined,
      errors: !result.success ? result.error.flatten().fieldErrors : undefined,
    };
  } catch (error) {
    return {
      success: false,
      errors: { _errors: ['An unexpected error occurred'] },
    };
  }
};
