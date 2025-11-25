import { useState, useCallback } from 'react';

export const useForm = (options = {}) => {
  const {
    initialValues = {},
    validate,
    onSubmit,
    validateOnChange = true,
    validateOnBlur = true
  } = options;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validate form fields
  const validateForm = useCallback((valuesToValidate = values) => {
    if (!validate) {
      setErrors({});
      setIsValid(true);
      return true;
    }

    const validationErrors = validate(valuesToValidate);
    setErrors(validationErrors || {});
    
    const formIsValid = Object.keys(validationErrors || {}).length === 0;
    setIsValid(formIsValid);
    
    return formIsValid;
  }, [validate, values]);

  // Handle field change
  const handleChange = useCallback((event) => {
    const { name, value, type, checked, files } = event.target;
    
    let fieldValue;

    if (type === 'checkbox') {
      fieldValue = checked;
    } else if (type === 'file') {
      fieldValue = files ? Array.from(files) : [];
    } else if (type === 'number' || type === 'range') {
      fieldValue = value === '' ? '' : Number(value);
    } else {
      fieldValue = value;
    }

    // Handle nested fields (e.g., 'user.name')
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setValues(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: fieldValue
        }
      }));
    } else {
      setValues(prev => ({
        ...prev,
        [name]: fieldValue
      }));
    }

    // Validate on change if enabled
    if (validateOnChange) {
      const newValues = { ...values, [name]: fieldValue };
      validateForm(newValues);
    }
  }, [validateOnChange, validateForm, values]);

  // Handle field blur
  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur if enabled
    if (validateOnBlur) {
      validateForm();
    }
  }, [validateOnBlur, validateForm]);

  // Set field value programmatically
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    if (validateOnChange) {
      const newValues = { ...values, [name]: value };
      validateForm(newValues);
    }
  }, [validateOnChange, validateForm, values]);

  // Set multiple values at once
  const setValuesMultiple = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));

    if (validateOnChange) {
      const updatedValues = { ...values, ...newValues };
      validateForm(updatedValues);
    }
  }, [validateOnChange, validateForm, values]);

  // Set field error
  const setError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  // Set multiple errors
  const setErrorsMultiple = useCallback((newErrors) => {
    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));
  }, []);

  // Clear specific field error
  const clearError = useCallback((name) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Mark field as touched
  const setTouchedField = useCallback((name, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched
    }));
  }, []);

  // Mark multiple fields as touched
  const setTouchedMultiple = useCallback((fields) => {
    setTouched(prev => ({
      ...prev,
      ...fields
    }));
  }, []);

  // Reset form to initial values
  const resetForm = useCallback((newInitialValues = null) => {
    const resetValues = newInitialValues || initialValues;
    setValues(resetValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    validateForm(resetValues);
  }, [initialValues, validateForm]);

  // Submit form
  const handleSubmit = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
      event.persist();
    }

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate form
    const formIsValid = validateForm();

    if (!formIsValid) {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
        if (errorElement) {
          errorElement.focus();
        }
      }
      return;
    }

    // Submit form
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        // Handle submission error (e.g., set server errors)
        if (error.errors) {
          setErrors(error.errors);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, errors, onSubmit, validateForm]);

  // Get field props for input components
  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] || '',
    onChange: handleChange,
    onBlur: handleBlur,
    error: errors[name],
    touched: touched[name]
  }), [values, errors, touched, handleChange, handleBlur]);

  // Check if field has error and is touched
  const hasError = useCallback((name) => {
    return !!(errors[name] && touched[name]);
  }, [errors, touched]);

  // Check if form has errors
  const hasErrors = useCallback(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  // Check if any field is touched
  const isTouched = useCallback(() => {
    return Object.keys(touched).length > 0;
  }, [touched]);

  // Check if form is pristine (no changes from initial values)
  const isPristine = useCallback(() => {
    return JSON.stringify(values) === JSON.stringify(initialValues);
  }, [values, initialValues]);

  // Check if form is dirty (has changes from initial values)
  const isDirty = useCallback(() => {
    return !isPristine();
  }, [isPristine]);

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    
    // Actions
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    setValues: setValuesMultiple,
    setError,
    setErrors: setErrorsMultiple,
    clearError,
    clearErrors,
    setTouched: setTouchedField,
    setTouchedMultiple,
    resetForm,
    
    // Helpers
    getFieldProps,
    hasError,
    hasErrors,
    isTouched,
    isPristine,
    isDirty,
    
    // Utility
    canSubmit: isValid && !isSubmitting && isTouched(),
    isModified: isDirty()
  };
};

// Hook for field array (for dynamic forms)
export const useFieldArray = (name, initialValues = []) => {
  const [fields, setFields] = useState(initialValues);

  const append = useCallback((value) => {
    setFields(prev => [...prev, value]);
  }, []);

  const prepend = useCallback((value) => {
    setFields(prev => [value, ...prev]);
  }, []);

  const insert = useCallback((index, value) => {
    setFields(prev => {
      const newFields = [...prev];
      newFields.splice(index, 0, value);
      return newFields;
    });
  }, []);

  const remove = useCallback((index) => {
    setFields(prev => {
      const newFields = [...prev];
      newFields.splice(index, 1);
      return newFields;
    });
  }, []);

  const update = useCallback((index, value) => {
    setFields(prev => {
      const newFields = [...prev];
      newFields[index] = value;
      return newFields;
    });
  }, []);

  const move = useCallback((fromIndex, toIndex) => {
    setFields(prev => {
      const newFields = [...prev];
      const [movedItem] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, movedItem);
      return newFields;
    });
  }, []);

  const swap = useCallback((indexA, indexB) => {
    setFields(prev => {
      const newFields = [...prev];
      [newFields[indexA], newFields[indexB]] = [newFields[indexB], newFields[indexA]];
      return newFields;
    });
  }, []);

  const replace = useCallback((newFields) => {
    setFields(newFields);
  }, []);

  const clear = useCallback(() => {
    setFields([]);
  }, []);

  return {
    fields,
    append,
    prepend,
    insert,
    remove,
    update,
    move,
    swap,
    replace,
    clear,
    length: fields.length
  };
};

export default useForm;