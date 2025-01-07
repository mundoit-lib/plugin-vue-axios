import axios from 'axios';
import { z } from 'zod';

export let axiosInstance: axios.AxiosInstance;

const AxiosConfig = z.object({
  baseURL: z.string(),
  db: z.string(),
  clientID: z.string(),
  clientSecret: z.string(),
  fixURL: z.string(),
  updateToken: z.function().optional(),
  onError: z.function().optional(),
});

export type AxiosConfig = z.infer<typeof AxiosConfig>;

export const getAxiosInstance = () => {
  if (!axiosInstance) {
    throw new Error('Axios instance is not initialized');
  }
  return axiosInstance;
}

export const initializeAxios = (config: AxiosConfig) => {
  const validatedConfig = AxiosConfig.safeParse(config);
  if (!validatedConfig.success) {
    console.error(validatedConfig.error);
    throw new Error('Invalid Axios configuration');
  }
  axiosInstance = axios.create({
    baseURL: validatedConfig.data.baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { status } = error.response;
      if (status === 401) {
        const originalRequest = error.config;
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const requestToken = await updateToken(validatedConfig.data.fixURL, validatedConfig.data.clientID, validatedConfig.data.clientSecret);
            originalRequest.headers['Authorization'] = `Bearer ${requestToken.access_token}`;
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${requestToken.access_token}`;
            if (validatedConfig.data.updateToken) {
              validatedConfig.data.updateToken(requestToken);
            }
            return axiosInstance(originalRequest);
          } catch (error) {
            console.error('Error al actualizar token', error);
            validatedConfig.data.onError && validatedConfig.data.onError();
            return Promise.reject(error);
          }
        }
        validatedConfig.data.onError && validatedConfig.data.onError();
        return Promise.reject(error);
      }
      validatedConfig.data.onError && validatedConfig.data.onError();
      return Promise.reject(error);
    },
  );

}


const updateToken = async (fixURL: string, client: string, secret: string) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const { data } = await axios.post(`${fixURL}/token`, {
      grant_type: 'refresh_token',
      client_id: client,
      client_secret: secret,
      refresh_token: refreshToken,
      notification_token: null,
    });
    if (data.error || data.error_description) {
      throw new Error(data.error);
    }
    const expires = data.expires_in;
    const now = new Date().getTime();
    const nuevaFechaExpiracion = now + expires * 1000;
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    localStorage.setItem('tokenExpireDate', nuevaFechaExpiracion + '');
    return {...data, nuevaFechaExpiracion};
  } catch (error) {
    throw error;
  }
}