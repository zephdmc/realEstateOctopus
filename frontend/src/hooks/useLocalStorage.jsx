import { useState, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      // Remove from local storage
      window.localStorage.removeItem(key);
      // Reset state to initial value
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// Hook for managing multiple localStorage items
export const useLocalStorageManager = () => {
  const getItem = useCallback((key, defaultValue = null) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  }, []);

  const setItem = useCallback((key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      return false;
    }
  }, []);

  const removeItem = useCallback((key) => {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  }, []);

  const clear = useCallback(() => {
    try {
      window.localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }, []);

  const getAllKeys = useCallback(() => {
    try {
      return Object.keys(window.localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  }, []);

  const hasItem = useCallback((key) => {
    try {
      return window.localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error checking localStorage key "${key}":`, error);
      return false;
    }
  }, []);

  const getSize = useCallback(() => {
    try {
      let total = 0;
      for (let key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
          total += (window.localStorage[key].length + key.length) * 2;
        }
      }
      return total; // Size in bytes
    } catch (error) {
      console.error('Error calculating localStorage size:', error);
      return 0;
    }
  }, []);

  return {
    getItem,
    setItem,
    removeItem,
    clear,
    getAllKeys,
    hasItem,
    getSize
  };
};

// Hook for storing array in localStorage with helper methods
export const useLocalStorageArray = (key, initialValue = []) => {
  const [array, setArray, removeArray] = useLocalStorage(key, initialValue);

  const push = useCallback((item) => {
    setArray(prev => [...prev, item]);
  }, [setArray]);

  const pop = useCallback(() => {
    setArray(prev => {
      const newArray = [...prev];
      newArray.pop();
      return newArray;
    });
  }, [setArray]);

  const unshift = useCallback((item) => {
    setArray(prev => [item, ...prev]);
  }, [setArray]);

  const shift = useCallback(() => {
    setArray(prev => {
      const newArray = [...prev];
      newArray.shift();
      return newArray;
    });
  }, [setArray]);

  const remove = useCallback((index) => {
    setArray(prev => {
      const newArray = [...prev];
      newArray.splice(index, 1);
      return newArray;
    });
  }, [setArray]);

  const update = useCallback((index, item) => {
    setArray(prev => {
      const newArray = [...prev];
      newArray[index] = item;
      return newArray;
    });
  }, [setArray]);

  const clear = useCallback(() => {
    setArray([]);
  }, [setArray]);

  const find = useCallback((predicate) => {
    return array.find(predicate);
  }, [array]);

  const filter = useCallback((predicate) => {
    return array.filter(predicate);
  }, [array]);

  const includes = useCallback((item) => {
    return array.includes(item);
  }, [array]);

  return {
    array,
    setArray,
    removeArray,
    push,
    pop,
    unshift,
    shift,
    remove,
    update,
    clear,
    find,
    filter,
    includes,
    length: array.length
  };
};

// Hook for storing object in localStorage with helper methods
export const useLocalStorageObject = (key, initialValue = {}) => {
  const [object, setObject, removeObject] = useLocalStorage(key, initialValue);

  const setProperty = useCallback((property, value) => {
    setObject(prev => ({
      ...prev,
      [property]: value
    }));
  }, [setObject]);

  const removeProperty = useCallback((property) => {
    setObject(prev => {
      const newObject = { ...prev };
      delete newObject[property];
      return newObject;
    });
  }, [setObject]);

  const getProperty = useCallback((property, defaultValue = null) => {
    return object[property] !== undefined ? object[property] : defaultValue;
  }, [object]);

  const hasProperty = useCallback((property) => {
    return object.hasOwnProperty(property);
  }, [object]);

  const clear = useCallback(() => {
    setObject({});
  }, [setObject]);

  return {
    object,
    setObject,
    removeObject,
    setProperty,
    removeProperty,
    getProperty,
    hasProperty,
    clear,
    keys: Object.keys(object)
  };
};

export default useLocalStorage;