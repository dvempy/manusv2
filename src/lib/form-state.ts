export interface FormState {
  loan_reason?: string;
  loan_amount?: string;
  housing?: string;
  employment?: string;
  income?: string;
  first_name?: string;
  last_name?: string;
  birth_month?: string;
  birth_day?: string;
  birth_year?: string;
  phone?: string;
  zip?: string;
  email?: string;
}

export const saveFormState = (data: Partial<FormState>) => {
  const currentState = getFormState();
  const newState = { ...currentState, ...data };
  sessionStorage.setItem('form-state', JSON.stringify(newState));
};

export const getFormState = (): FormState => {
  try {
    return JSON.parse(sessionStorage.getItem('form-state') || '{}');
  } catch {
    return {};
  }
};

export const clearFormState = () => {
  sessionStorage.removeItem('form-state');
};

export const getFormValue = (key: keyof FormState): string => {
  const state = getFormState();
  return state[key] || '';
};
