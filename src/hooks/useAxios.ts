import { useState } from 'react';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

type UseAxiosResult<T> = {
  loading: boolean;
  error: string | null;
  data: T | null;
  sendRequest: (overrideConfig?: AxiosRequestConfig) => Promise<AxiosResponse<T> | void>;
};

export function useAxios<T = any>(
  config: AxiosRequestConfig
): UseAxiosResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const sendRequest = async (overrideConfig?: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios<T>({ ...config, ...overrideConfig });
      setData(response.data);
      return response;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Request failed');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, sendRequest };
}
