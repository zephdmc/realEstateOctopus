import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { safeLocalStorage } from '../utils/helpers';

// Action types
const ACTION_TYPES = {
  SET_THEME: 'SET_THEME',
  SET_COLOR_SCHEME: 'SET_COLOR_SCHEME',
  SET_FONT_SIZE: 'SET_FONT_SIZE',
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  RESET_SETTINGS: 'RESET_SETTINGS',
};

// Available themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
};

// Available color schemes
export const COLOR_SCHEMES = {
  BLUE: 'blue',
  GREEN: 'green',
  PURPLE: 'purple',
  ORANGE: 'orange',
  PINK: 'pink',
};

// Font sizes
export const FONT_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

// Initial state
const initialState = {
  theme: safeLocalStorage.get('theme', THEMES.LIGHT),
  colorScheme: safeLocalStorage.get('colorScheme', COLOR_SCHEMES.BLUE),
  fontSize: safeLocalStorage.get('fontSize', FONT_SIZES.MEDIUM),
  darkMode: safeLocalStorage.get('darkMode', false),
};

// Reducer function
const themeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_THEME:
      safeLocalStorage.set('theme', action.payload);
      return {
        ...state,
        theme: action.payload,
      };

    case ACTION_TYPES.SET_COLOR_SCHEME:
      safeLocalStorage.set('colorScheme', action.payload);
      return {
        ...state,
        colorScheme: action.payload,
      };

    case ACTION_TYPES.SET_FONT_SIZE:
      safeLocalStorage.set('fontSize', action.payload);
      return {
        ...state,
        fontSize: action.payload,
      };

    case ACTION_TYPES.TOGGLE_DARK_MODE:
      const darkMode = action.payload ?? !state.darkMode;
      safeLocalStorage.set('darkMode', darkMode);
      return {
        ...state,
        darkMode,
      };

    case ACTION_TYPES.RESET_SETTINGS:
      safeLocalStorage.remove('theme');
      safeLocalStorage.remove('colorScheme');
      safeLocalStorage.remove('fontSize');
      safeLocalStorage.remove('darkMode');
      return initialState;

    default:
      return state;
  }
};

// Create context
const ThemeContext = createContext();

// Context provider
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Actions
  const actions = {
    setTheme: (theme) => 
      dispatch({ type: ACTION_TYPES.SET_THEME, payload: theme }),

    setColorScheme: (colorScheme) => 
      dispatch({ type: ACTION_TYPES.SET_COLOR_SCHEME, payload: colorScheme }),

    setFontSize: (fontSize) => 
      dispatch({ type: ACTION_TYPES.SET_FONT_SIZE, payload: fontSize }),

    toggleDarkMode: (enabled) => 
      dispatch({ type: ACTION_TYPES.TOGGLE_DARK_MODE, payload: enabled }),

    resetSettings: () => 
      dispatch({ type: ACTION_TYPES.RESET_SETTINGS }),

    // Complex actions
    toggleTheme: () => {
      const newTheme = state.theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
      actions.setTheme(newTheme);
    },

    cycleColorScheme: () => {
      const schemes = Object.values(COLOR_SCHEMES);
      const currentIndex = schemes.indexOf(state.colorScheme);
      const nextIndex = (currentIndex + 1) % schemes.length;
      actions.setColorScheme(schemes[nextIndex]);
    },

    increaseFontSize: () => {
      const sizes = Object.values(FONT_SIZES);
      const currentIndex = sizes.indexOf(state.fontSize);
      if (currentIndex < sizes.length - 1) {
        actions.setFontSize(sizes[currentIndex + 1]);
      }
    },

    decreaseFontSize: () => {
      const sizes = Object.values(FONT_SIZES);
      const currentIndex = sizes.indexOf(state.fontSize);
      if (currentIndex > 0) {
        actions.setFontSize(sizes[currentIndex - 1]);
      }
    },
  };

  // Apply theme to document
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      // Remove all theme classes
      root.classList.remove('theme-light', 'theme-dark', 'theme-auto');
      Object.values(COLOR_SCHEMES).forEach(scheme => {
        root.classList.remove(`color-scheme-${scheme}`);
      });
      Object.values(FONT_SIZES).forEach(size => {
        root.classList.remove(`font-size-${size}`);
      });
      
      // Add current theme classes
      root.classList.add(`theme-${state.theme}`);
      root.classList.add(`color-scheme-${state.colorScheme}`);
      root.classList.add(`font-size-${state.fontSize}`);
      
      // Set data attributes for CSS
      root.setAttribute('data-theme', state.theme);
      root.setAttribute('data-color-scheme', state.colorScheme);
      root.setAttribute('data-font-size', state.fontSize);
      root.setAttribute('data-dark-mode', state.darkMode.toString());
    };

    applyTheme();
  }, [state.theme, state.colorScheme, state.fontSize, state.darkMode]);

  // Handle system preference changes
  useEffect(() => {
    if (state.theme !== THEMES.AUTO) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const root = document.documentElement;
      if (e.matches) {
        root.classList.add('system-dark');
        root.classList.remove('system-light');
      } else {
        root.classList.add('system-light');
        root.classList.remove('system-dark');
      }
    };

    // Set initial value
    handleChange(mediaQuery);
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.theme]);

  // Generate CSS variables based on color scheme
  const getColorVariables = () => {
    const colorSchemes = {
      [COLOR_SCHEMES.BLUE]: {
        '--primary': '59 130 246',
        '--primary-foreground': '255 255 255',
        '--secondary': '100 116 139',
        '--secondary-foreground': '255 255 255',
      },
      [COLOR_SCHEMES.GREEN]: {
        '--primary': '34 197 94',
        '--primary-foreground': '255 255 255',
        '--secondary': '100 116 139',
        '--secondary-foreground': '255 255 255',
      },
      [COLOR_SCHEMES.PURPLE]: {
        '--primary': '168 85 247',
        '--primary-foreground': '255 255 255',
        '--secondary': '100 116 139',
        '--secondary-foreground': '255 255 255',
      },
      [COLOR_SCHEMES.ORANGE]: {
        '--primary': '249 115 22',
        '--primary-foreground': '255 255 255',
        '--secondary': '100 116 139',
        '--secondary-foreground': '255 255 255',
      },
      [COLOR_SCHEMES.PINK]: {
        '--primary': '236 72 153',
        '--primary-foreground': '255 255 255',
        '--secondary': '100 116 139',
        '--secondary-foreground': '255 255 255',
      },
    };

    return colorSchemes[state.colorScheme] || colorSchemes[COLOR_SCHEMES.BLUE];
  };

  // Generate font size variables
  const getFontSizeVariables = () => {
    const fontSizes = {
      [FONT_SIZES.SMALL]: {
        '--text-xs': '0.75rem',
        '--text-sm': '0.875rem',
        '--text-base': '1rem',
        '--text-lg': '1.125rem',
        '--text-xl': '1.25rem',
        '--text-2xl': '1.5rem',
      },
      [FONT_SIZES.MEDIUM]: {
        '--text-xs': '0.8rem',
        '--text-sm': '0.9rem',
        '--text-base': '1rem',
        '--text-lg': '1.125rem',
        '--text-xl': '1.25rem',
        '--text-2xl': '1.5rem',
      },
      [FONT_SIZES.LARGE]: {
        '--text-xs': '0.875rem',
        '--text-sm': '1rem',
        '--text-base': '1.125rem',
        '--text-lg': '1.25rem',
        '--text-xl': '1.5rem',
        '--text-2xl': '1.75rem',
      },
    };

    return fontSizes[state.fontSize] || fontSizes[FONT_SIZES.MEDIUM];
  };

  // Apply CSS variables to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply color variables
    const colorVariables = getColorVariables();
    Object.entries(colorVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    // Apply font size variables
    const fontSizeVariables = getFontSizeVariables();
    Object.entries(fontSizeVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [state.colorScheme, state.fontSize]);

  const value = {
    // State
    ...state,
    
    // Actions
    ...actions,
    
    // Constants
    themes: THEMES,
    colorSchemes: COLOR_SCHEMES,
    fontSizes: FONT_SIZES,
    
    // Utility methods
    isDark: state.theme === THEMES.DARK || (state.theme === THEMES.AUTO && window.matchMedia('(prefers-color-scheme: dark)').matches),
    isLight: state.theme === THEMES.LIGHT || (state.theme === THEMES.AUTO && !window.matchMedia('(prefers-color-scheme: dark)').matches),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;