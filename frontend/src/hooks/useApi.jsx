import { useState, useCallback, useRef } from 'react';
import { auth } from '../config/firebase'; // Import your Firebase auth

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const abortControllers = useRef(new Map());

  // Get Firebase token
  const getFirebaseToken = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn('⚠️ No authenticated Firebase user found');
        return null;
      }
      
      const token = await user.getIdToken();
      console.log('🔑 Firebase token obtained');
      return token;
    } catch (error) {
      console.error('❌ Failed to get Firebase token:', error);
      return null;
    }
  }, []);

  // Base API request function with Firebase auth
  const request = useCallback(async (url, options = {}) => {
    const controller = new AbortController();
    const requestId = url + JSON.stringify(options);
    
    abortControllers.current.set(requestId, controller);

    try {
      setLoading(true);
      setErrors(null);

      // Get Firebase token for this request
      const token = await getFirebaseToken();
      
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers
        },
        signal: controller.signal
      };

      // Ensure URL is absolute
      const fullUrl = url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}${url}`;
      
      console.log('📡 API Request:', { 
        url: fullUrl, 
        method: options.method,
        hasToken: !!token 
      });

      const response = await fetch(fullUrl, {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers
        }
      });

      abortControllers.current.delete(requestId);

      // Handle authentication errors
      if (response.status === 401) {
        console.log('🔄 401 Unauthorized - token might be expired, refreshing...');
        
        // Force token refresh and retry once
        const user = auth.currentUser;
        if (user) {
          const newToken = await user.getIdToken(true); // Force refresh
          console.log('🔄 Retrying with refreshed token');
          
          const retryResponse = await fetch(fullUrl, {
            ...defaultOptions,
            ...options,
            headers: {
              ...defaultOptions.headers,
              'Authorization': `Bearer ${newToken}`,
              ...options.headers
            }
          });
          
          if (!retryResponse.ok) {
            const errorData = await retryResponse.text();
            console.error('❌ API Error Response after token refresh:', {
              status: retryResponse.status,
              statusText: retryResponse.statusText,
              data: errorData
            });
            
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          
          const data = await retryResponse.json();
          console.log('✅ API Success Response after token refresh:', data);
          
          return {
            success: true,
            data,
            status: retryResponse.status,
            headers: retryResponse.headers
          };
        }
      }

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || 2;
        console.warn(`⏳ Rate limited, retrying after ${retryAfter} seconds...`);
        
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        
        const retryResponse = await fetch(fullUrl, {
          ...defaultOptions,
          ...options,
          headers: {
            ...defaultOptions.headers,
            ...options.headers
          }
        });
        
        if (!retryResponse.ok) {
          const errorData = await retryResponse.text();
          console.error('❌ API Error Response after retry:', {
            status: retryResponse.status,
            statusText: retryResponse.statusText,
            data: errorData
          });
          
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }
        
        const data = await retryResponse.json();
        console.log('✅ API Success Response after retry:', data);
        
        return {
          success: true,
          data,
          status: retryResponse.status,
          headers: retryResponse.headers
        };
      }

      if (!response.ok) {
        let errorText;
        let parsedError;
        
        try {
          // Get the raw response text first
          errorText = await response.text();
          console.log('🔍 Raw error response text:', errorText);
          
          // Try to parse as JSON
          try {
            parsedError = JSON.parse(errorText);
            console.log('🔍 Parsed error JSON:', parsedError);
          } catch (jsonError) {
            // If JSON parsing fails, use the text as error message
            console.log('🔍 JSON parsing failed, using raw text');
            parsedError = { 
              error: errorText, 
              raw: errorText,
              message: errorText
            };
          }
        } catch (textError) {
          console.log('🔍 Unable to read error response');
          errorText = 'Unable to read error response';
          parsedError = { 
            error: errorText, 
            message: errorText 
          };
        }

        console.error('❌ API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: parsedError,
          fullError: errorText
        });
        
        // Create a detailed error with all available information
        const errorMessage = parsedError.error || parsedError.message || `HTTP error! status: ${response.status}`;
        const detailedError = new Error(errorMessage);
        detailedError.status = response.status;
        detailedError.details = parsedError.details || parsedError;
        detailedError.fullResponse = parsedError;
        detailedError.rawResponse = errorText;
        
        throw detailedError;
      }

      const data = await response.json();
      console.log('✅ API Success Response:', data);
      
      return {
        success: true,
        data,
        status: response.status,
        headers: response.headers
      };
    } catch (error) {
      abortControllers.current.delete(requestId);

      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        return { success: false, aborted: true };
      }

      // Use the detailed error information
      let errorMessage = error.message || 'An error occurred';
      
      // Include details in the error message if available
      if (error.details) {
        if (typeof error.details === 'object') {
          errorMessage += ` - Details: ${JSON.stringify(error.details)}`;
        } else {
          errorMessage += ` - Details: ${error.details}`;
        }
      }
      
      console.error('❌ API Request Failed:', {
        message: error.message,
        status: error.status,
        details: error.details,
        fullResponse: error.fullResponse,
        rawResponse: error.rawResponse,
        fullError: error
      });
      
      setErrors(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        status: error.status,
        details: error.details,
        fullResponse: error.fullResponse,
        rawResponse: error.rawResponse
      };
    } finally {
      setLoading(false);
    }
  }, [getFirebaseToken]);

  // HTTP methods with enhanced error handling
  const get = useCallback(async (url, options = {}) => {
    return request(url, {
      method: 'GET',
      ...options
    });
  }, [request]);

  const post = useCallback(async (url, data, options = {}) => {
    console.log('📦 POST data being sent:', data);
    return request(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }, [request]);

  const put = useCallback(async (url, data, options = {}) => {
    console.log('📦 PUT data being sent:', data);
    return request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }, [request]);

  const patch = useCallback(async (url, data, options = {}) => {
    console.log('📦 PATCH data being sent:', data);
    return request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options
    });
  }, [request]);

  const del = useCallback(async (url, options = {}) => {
    return request(url, {
      method: 'DELETE',
      ...options
    });
  }, [request]);

  const upload = useCallback(async (url, file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);

    return request(url, {
      method: 'POST',
      body: formData,
      headers: {
        ...(options.headers || {})
      },
      ...options
    });
  }, [request]);

  const uploadMultiple = useCallback(async (url, files, options = {}) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    return request(url, {
      method: 'POST',
      body: formData,
      headers: {
        ...(options.headers || {})
      },
      ...options
    });
  }, [request]);

  const abortRequest = useCallback((url, options = {}) => {
    const requestId = url + JSON.stringify(options);
    const controller = abortControllers.current.get(requestId);
    
    if (controller) {
      controller.abort();
      abortControllers.current.delete(requestId);
    }
  }, []);

  const abortAllRequests = useCallback(() => {
    abortControllers.current.forEach(controller => {
      controller.abort();
    });
    abortControllers.current.clear();
  }, []);

  const clearErrors = useCallback(() => {
    setErrors(null);
  }, []);

  return {
    loading,
    errors,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    uploadMultiple,
    abortRequest,
    abortAllRequests,
    clearErrors,
    hasErrors: !!errors
  };
};

export default useApi;