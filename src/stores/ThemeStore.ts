import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface ThemeSetting {
  theme: Theme;
  system: boolean;
}

const getDefaultTheme = (): Theme => {
  if (typeof window === 'undefined') return Theme.DARK;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
};

const STORAGE_KEY = 'color-theme';

const getStoredTheme = (): ThemeSetting => {
  if (typeof window === 'undefined') {
    return { theme: Theme.DARK, system: false };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Object.values(Theme).includes(parsed.value)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored theme:', e);
  }

  return { theme: getDefaultTheme(), system: true };
};

export const useThemeStore = defineStore('theme', () => {
  const themeSetting = ref<ThemeSetting>(getStoredTheme());

  const theme = computed(() => themeSetting.value.theme);
  const isDark = computed(() => theme.value === Theme.DARK);
  const isSystem = computed(() => themeSetting.value.system);

  const applyTheme = (theme: ThemeSetting) => {
    themeSetting.value = theme;

    document.documentElement.classList.toggle('dark', theme.theme === Theme.DARK);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  };

  const update = (value: Theme | 'system') => {
    const theme: ThemeSetting = value === 'system'
      ? { system: true, theme: getDefaultTheme() }
      : { system: false, theme: value };

    applyTheme(theme);
  };

  const setTheme = (theme: Theme) => {
    update(theme);
  };

  const setSystem = (system: boolean) => {
    update(system ? 'system' : getDefaultTheme());
  };

  const toggleTheme = () => {
    update(theme.value === Theme.DARK ? Theme.LIGHT : Theme.DARK);
  };

  const initializeThemeListener = () => {
    applyTheme(themeSetting.value);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleThemeChange = () => {
      if (isSystem.value) {
        update('system');
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);

    // Return cleanup function for when component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  };

  return {
    // State
    themeSetting,

    // Computed
    theme,
    isDark,
    isSystem,

    // Methods
    setTheme,
    setSystem,
    toggleTheme,
    initializeThemeListener,
  };
});

