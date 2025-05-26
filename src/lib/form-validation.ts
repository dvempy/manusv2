import { z } from 'zod';

// Sanitize and validate URL parameters
export function sanitizeUrlParam(param: string | null): string {
  if (!param) return '';

  // Remove any potentially dangerous characters
  return param.replace(/[<>'"&]/g, '');
}

// Validate loan reason
export function validateLoanReason(reason: string): boolean {
  const validReasons = [
    'debt_consolidation',
    'credit_cards',
    'home_improvement',
    'major_purchase',
    'bills_rent',
    'medical',
    'car_purchase',
    'car_repair',
    'business',
    'moving',
    'family',
    'travel',
    'taxes',
    'wedding',
    'motorcycle',
    'baby',
    'cosmetic',
    'boat_rv',
    'engagement',
    'other',
  ];

  return validReasons.includes(reason);
}

// Validate loan amount
export function validateLoanAmount(amount: string): boolean {
  const value = parseInt(amount.replace(/\D/g, ''));
  return value >= 250 && value <= 100000;
}

// Validate income
export function validateIncome(income: string): boolean {
  const value = parseInt(income.replace(/\D/g, ''));
  return value >= 12000;
}

// Validate phone number
export function validatePhone(phone: string): boolean {
  return /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);
}

// Validate ZIP code
export function validateZip(zip: string): boolean {
  return /^\d{5}$/.test(zip);
}

// Validate email
export function validateEmail(email: string): boolean {
  return z.string().email().safeParse(email).success;
}

// Validate date of birth
export function validateDOB(month: string, day: string, year: string): boolean {
  const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18;
}
