// Types
interface FloatingButtonOptions {
  formSelector: string;
  mainButtonSelector: string;
  containerClass?: string;
  visibleClass?: string;
  buttonText?: string;
}

// Default options
const defaultOptions: Partial<FloatingButtonOptions> = {
  containerClass: 'floating-button-container',
  visibleClass: 'visible',
  buttonText: 'Continue',
};

export function initFloatingButton(options: FloatingButtonOptions) {
  // Merge options with defaults
  const config = { ...defaultOptions, ...options };

  // Get DOM elements
  const form = document.querySelector(config.formSelector) as HTMLFormElement;
  const mainButton = document.querySelector(config.mainButtonSelector) as HTMLButtonElement;

  if (!form || !mainButton) {
    console.warn('Required elements not found');
    return;
  }

  // Create floating button container
  const floatingButtonContainer = document.createElement('div');
  floatingButtonContainer.className = config.containerClass;
  floatingButtonContainer.innerHTML = `
    <button type="submit" class="floating-button">
      <span class="button-text">${config.buttonText}</span>
      <img loading="lazy" src="https://api.iconify.design/material-symbols:arrow-forward.svg?color=black" alt="" role="presentation" width="20" height="20" />
    </button>
  `;

  // Add to DOM
  document.body.appendChild(floatingButtonContainer);

  // Create intersection observer for main button
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        updateFloatingButton();
      });
    },
    {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: '0px',
    }
  );

  // Start observing main button
  observer.observe(mainButton);

  // Function to check if form has valid selection
  function hasValidSelection(): boolean {
    // Get all form inputs
    const inputs = form.querySelectorAll('input[type="radio"], input[type="text"], select');

    // Check if any input has a value
    for (const input of inputs) {
      if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) {
        if (input.value) return true;
      }
    }

    return false;
  }

  // Function to check if main button is visible
  function isMainButtonVisible(): boolean {
    const rect = mainButton.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    return rect.top >= 0 && rect.bottom <= windowHeight && rect.width > 0 && rect.height > 0;
  }

  // Update floating button visibility
  function updateFloatingButton() {
    const shouldShow = hasValidSelection() && !isMainButtonVisible();

    requestAnimationFrame(() => {
      floatingButtonContainer.classList.toggle(config.visibleClass, shouldShow);
    });
  }

  // Handle form changes
  form.addEventListener('change', updateFloatingButton);

  // Handle scroll with throttling
  let scrollTimeout: number;
  window.addEventListener(
    'scroll',
    () => {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = window.requestAnimationFrame(updateFloatingButton);
    },
    { passive: true }
  );

  // Handle resize with throttling
  let resizeTimeout: number;
  window.addEventListener(
    'resize',
    () => {
      if (resizeTimeout) {
        window.cancelAnimationFrame(resizeTimeout);
      }
      resizeTimeout = window.requestAnimationFrame(updateFloatingButton);
    },
    { passive: true }
  );

  // Handle floating button click
  floatingButtonContainer.querySelector('button').addEventListener('click', (e) => {
    e.preventDefault();
    form.requestSubmit();
  });

  // Initial check
  updateFloatingButton();

  // Return cleanup function
  return () => {
    observer.disconnect();
    floatingButtonContainer.remove();
    window.removeEventListener('scroll', updateFloatingButton);
    window.removeEventListener('resize', updateFloatingButton);
  };
}