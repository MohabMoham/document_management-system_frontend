import { useState } from 'react';
import { ApiCallOptions } from '../types';

export function useApi(setError: (msg: string) => void) {
  const apiCall = async <T = any>(url: string, options: ApiCallOptions = {}): Promise<T> => {
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.text();
          errorMessage += ` - ${errorData}`;
        } catch {}
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`API Error: ${errorMessage}`);
      throw error;
    }
  };

  return { apiCall };
}