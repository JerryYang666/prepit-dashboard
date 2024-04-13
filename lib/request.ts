// request.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const localBackend =
  process.env.NEXT_PUBLIC_LOCAL_BACKEND?.toUpperCase() === 'TRUE';

// default values of the environment variables
const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;
const role = process.env.NEXT_PUBLIC_ROLE;
let baseURL = process.env.NEXT_PUBLIC_ONLINE_BASE_URL;
let environment = process.env.NEXT_PUBLIC_DEV_ENVIRONMENT;

if (process.env.NODE_ENV === 'development') {
  /*
  running in 'next dev' mode
  if the local backend is set to true, use the local backend.
  else use the online development backend
  sometimes frontend developers don't want / don't know how to run the backend locally
  */
  baseURL = localBackend
    ? process.env.NEXT_PUBLIC_LOCAL_BASE_URL
    : process.env.NEXT_PUBLIC_ONLINE_BASE_URL;
  environment = process.env.NEXT_PUBLIC_DEV_ENVIRONMENT;
} else if (process.env.NODE_ENV === 'production') {
  /*
  running in 'next build' mode
  there are two possible environments: preview and production
  in preview mode, the NEXT_PUBLIC_CURRENT_ENV is set to 'development'
  in production mode, the NEXT_PUBLIC_CURRENT_ENV is set to 'production'
  NEXT_PUBLIC_CURRENT_ENV is set in the Vercel configuration
  */
  baseURL = process.env.NEXT_PUBLIC_ONLINE_BASE_URL;
  environment =
    process.env.NEXT_PUBLIC_CURRENT_ENV === 'production'
      ? process.env.NEXT_PUBLIC_PROD_ENVIRONMENT
      : process.env.NEXT_PUBLIC_DEV_ENVIRONMENT;
} else {
  /*
  fail safe: all variables are set to default values
  the default is the online development backend
  */
  console.log('Unknown environment');
}

const apiUrl = `${baseURL}/${apiVersion}/${environment}/${role}`;
console.log('****', apiUrl);

const instance = axios.create({
  baseURL: apiUrl,
  timeout: 10000, // 10s
});

// Request interceptor
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // add token, cookie, etc here
    // config.headers.Authorization = `Bearer ${Token}`;
    return config as any;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return response.data.data;
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;
