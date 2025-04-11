import { useNuxtApp } from '#app';

/**
 * Composable for displaying application-wide toasts using nuxt-tailvue.
 */
export const useAppToast = () => {
  const { $toast } = useNuxtApp();

  /**
   * Shows a toast message.
   * @param {'success' | 'info' | 'warning' | 'danger' | 'error'} variant - The type of toast (maps to $toast methods).
   * @param {string} message - The main message to display.
   * @param {object} [options] - Optional configuration for the toast (e.g., link).
   * @param {string} [extraMessage] - An extra message (currently unused in the adapted logic, kept for signature compatibility).
   */
  const showToast = (variant, message, options, extraMessage) => {
    // Map variant to potential nuxt-tailvue methods (adjust if needed based on nuxt-tailvue API)
    // Common variants: success, info, warning, error/danger
    const toastMethod = $toast[variant] || $toast.show; // Fallback to generic 'show' if variant method doesn't exist

    if (typeof toastMethod !== 'function') {
      console.error(`useAppToast: Invalid toast variant or method '${variant}' not found on $toast.`);
      return;
    }

    try {
      // Construct the arguments for the toast method
      const toastArgs = {
        // Tailvue typically uses title/message properties
        title: variant.charAt(0).toUpperCase() + variant.slice(1), // Simple title from variant
        message: options && options.link ? `🔗 ${message}` : message,
        // Default Tailvue settings are usually sufficient, but can be overridden
        // timeout: 5, // Example: Tailvue uses seconds
        // position: 'top-right', // Example
        // ... other nuxt-tailvue specific options
      };

      // Add onClick handler if link options are provided
      if (options && options.link && options.link.root && options.link.path) {
        toastArgs.onClick = () => window.open(`${options.link.root}${options.link.path}`, '_blank');
      }

      // Call the appropriate toast method
      toastMethod(toastArgs);

    } catch (error) {
      console.error(`useAppToast: Error displaying toast:`, error);
    }
  };

  return {
    showToast,
  };
};