/**
 * Theme System Module
 * Handles dark/light mode switching with localStorage persistence
 */

const ThemeModule = (() => {
  const STORAGE_KEY = 'dashboard-theme';
  const LIGHT_CLASS = 'light';
  
  /**
   * Initialize theme system
   */
  function init() {
    const savedTheme = localStorage.getItem(STORAGE_KEY) || 'dark';
    applyTheme(savedTheme);
    setupToggleButton();
  }

  /**
   * Apply theme to document
   * @param {string} theme - 'dark' or 'light'
   */
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add(LIGHT_CLASS);
    } else {
      document.body.classList.remove(LIGHT_CLASS);
    }
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleIcon(theme);
  }

  /**
   * Setup theme toggle button
   */
  function setupToggleButton() {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = localStorage.getItem(STORAGE_KEY) || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    }
  }

  /**
   * Update toggle button icon
   * @param {string} theme - Current theme
   */
  function updateToggleIcon(theme) {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === 'dark' 
        ? '<i class="ri-sun-line"></i>' 
        : '<i class="ri-moon-line"></i>';
    }
  }

  /**
   * Get current theme
   * @returns {string} Current theme ('dark' or 'light')
   */
  function getCurrentTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'dark';
  }

  return {
    init,
    applyTheme,
    getCurrentTheme
  };
})();

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
  ThemeModule.init();
});
