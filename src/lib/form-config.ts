export const formSteps = [
  { id: 'loan-reason', title: 'Loan Purpose' },
  { id: 'loan-amount', title: 'Loan Amount' },
  { id: 'housing', title: 'Housing' },
  { id: 'employment', title: 'Employment' },
  { id: 'income', title: 'Income' },
  { id: 'name', title: 'Personal Info' },
  { id: 'dob', title: 'Date of Birth' },
  { id: 'phone', title: 'Phone' },
  { id: 'zip', title: 'Location' },
  { id: 'email', title: 'Email' },
];

export const getStepInfo = (currentStep: string) => {
  const stepIndex = formSteps.findIndex((step) => step.id === currentStep);
  return {
    currentStep: stepIndex + 1,
    totalSteps: formSteps.length,
    progress: ((stepIndex + 1) / formSteps.length) * 100,
    prevStep: stepIndex > 0 ? formSteps[stepIndex - 1].id : null,
    nextStep: stepIndex < formSteps.length - 1 ? formSteps[stepIndex + 1].id : null,
  };
};
