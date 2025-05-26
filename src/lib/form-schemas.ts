import { z } from 'zod';

// Common transformers
const currencyTransformer = z.string().transform((val) => parseInt(val.replace(/\D/g, '')));

// Base schemas
export const loanAmountSchema = z.object({
  loan_amount: currencyTransformer.refine((val) => val >= 250 && val <= 100000, {
    message: 'Amount must be between $250 and $100,000',
  }),
});

export const incomeSchema = z.object({
  income: currencyTransformer.refine((val) => val >= 12000, {
    message: 'Annual income must be at least $12,000',
  }),
});

export const phoneSchema = z.object({
  phone: z
    .string()
    .regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number')
    .transform((val) => {
      const digits = val.replace(/\D/g, '');
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }),
});

export const zipSchema = z.object({
  zip: z.string().regex(/^\d{5}$/, 'Please enter a valid 5-digit ZIP code'),
});

export const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
});

export const dobSchema = z
  .object({
    birth_month: z.string(),
    birth_day: z.string(),
    birth_year: z.string(),
  })
  .refine(
    ({ birth_month, birth_day, birth_year }) => {
      const birthDate = new Date(
        parseInt(birth_year),
        parseInt(birth_month) - 1,
        parseInt(birth_day)
      );
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age >= 18;
    },
    {
      message: 'You must be at least 18 years old',
    }
  );

// Combined form schema
export const formSchema = z.object({
  loan_reason: z.string(),
  loan_amount: loanAmountSchema.shape.loan_amount,
  housing: z.enum(['own_paid', 'own_mortgage', 'rent', 'other']),
  employment: z.enum(['full_time', 'part_time', 'self_employed', 'retired', 'unemployed', 'other']),
  income: incomeSchema.shape.income,
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  birth_month: z.string(),
  birth_day: z.string(),
  birth_year: z.string(),
  phone: phoneSchema.shape.phone,
  zip: zipSchema.shape.zip,
  email: emailSchema.shape.email,
});

export type FormData = z.infer<typeof formSchema>;
