import type { FormState } from './form-state';
import {
  validateLoanAmount,
  validateIncome,
  validatePhone,
  validateZip,
  validateEmail,
  validateDOB,
} from './form-validation';
import { formatCurrency, formatPhoneNumber } from './form-utils';

/**
 * Initializes form handling for client-side validation.
 * Allows native submission to Netlify after successful validation.
 */
export function initFormHandler(options: { formSelector: string }) {
  const form = document.querySelector(options.formSelector) as HTMLFormElement;
  if (!form) return;

  // Input formatting (no changes)
  form
    .querySelectorAll('input[type="text"], input[type="tel"], input[type="email"]')
    .forEach((input) => {
      if (!(input instanceof HTMLInputElement)) return;
      input.addEventListener('input', () => {
        const name = input.name;
        let value = input.value;
        if (name.includes('amount') || name === 'income') {
          value = formatCurrency(value);
        } else if (name === 'phone') {
          value = formatPhoneNumber(value);
        }
        input.value = value;
        input.setCustomValidity('');
      });
    });

  // Validate on submit, block only on errors
  form.addEventListener('submit', (e) => {
    const formData = new FormData(form);
    const state: FormState = {};

    // Validate fields
    for (const [key, value] of formData.entries()) {
      if (typeof value !== 'string') continue;

      // Run validations
      let valid = true;
      if (key.includes('amount')) {
        valid = validateLoanAmount(value);
      } else if (key === 'income') {
        valid = validateIncome(value);
      } else if (key === 'phone') {
        valid = validatePhone(value);
      } else if (key === 'zip') {
        valid = validateZip(value);
      } else if (key === 'email') {
        valid = validateEmail(value);
      }

      if (!valid) {
        e.preventDefault();    // stop submission on error
        showError(form, key, `Please enter a valid ${key.replace('_', ' ')}`);
        return;
      }
      state[key] = value;
    }

    // Save form state for later steps (if needed)
    sessionStorage.setItem('form-state', JSON.stringify(state));

    // No e.preventDefault() here: allow native form POST to proceed
    // Netlify will capture the submission and redirect to action="/thank-you"
  });
}

function showError(form: HTMLFormElement, field: string, message: string) {
  const input = form.querySelector(`[name="${field}"]`) as HTMLInputElement;
  if (input) {
    input.setCustomValidity(message);
    input.reportValidity();
  }
}
