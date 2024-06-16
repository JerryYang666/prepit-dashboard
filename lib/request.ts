// request.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const localBackend =
  process.env.NEXT_PUBLIC_LOCAL_BACKEND?.toUpperCase() === "TRUE";

// default values of the environment variables
const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;
const role = process.env.NEXT_PUBLIC_ROLE;
let baseURL = process.env.NEXT_PUBLIC_ONLINE_BASE_URL;
let environment = process.env.NEXT_PUBLIC_DEV_ENVIRONMENT;

if (process.env.NODE_ENV === "development") {
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
} else if (process.env.NODE_ENV === "production") {
  /*
  running in 'next build' mode
  there are two possible environments: preview and production
  in preview mode, the NEXT_PUBLIC_CURRENT_ENV is set to 'development'
  in production mode, the NEXT_PUBLIC_CURRENT_ENV is set to 'production'
  NEXT_PUBLIC_CURRENT_ENV is set in the Vercel configuration
  */
  baseURL = process.env.NEXT_PUBLIC_ONLINE_BASE_URL;
  environment =
    process.env.NEXT_PUBLIC_CURRENT_ENV === "production"
      ? process.env.NEXT_PUBLIC_PROD_ENVIRONMENT
      : process.env.NEXT_PUBLIC_DEV_ENVIRONMENT;
} else {
  /*
  fail safe: all variables are set to default values
  the default is the online development backend
  */
  console.log("Unknown environment");
}

const apiUrl = `${baseURL}/${apiVersion}/${environment}/${role}`;

const instance = axios.create({
  baseURL: apiUrl,
  timeout: 10000, // 10s
});

// Request interceptor
instance.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const access_token = Cookies.get("access_token");
    const refresh_token = Cookies.get("refresh_token");
    if (access_token && access_token !== "" && access_token !== "undefined") {
      // if access token is present, add it to the headers
      if (config.headers) {
        config.headers.Authorization = `Bearer access=${access_token}`;
      }
      return config as any;
    } else if (
      refresh_token &&
      refresh_token !== "" &&
      refresh_token !== "undefined"
    ) {
      // if access token is not present but refresh token is present, do a token refresh
      try {
        const response = await axios.get(`${apiUrl}/generate_access_token`, {
          headers: {
            Authorization: `Bearer refresh=${refresh_token}`,
          },
        });
        const new_access_token = response.data.data.access_token;
        const firstLevelDomain =
          "." + window.location.hostname.split(".").slice(-2).join(".");
        Cookies.set("access_token", new_access_token, {
          expires: 1 / 48,
          domain: firstLevelDomain,
        });
        window.dispatchEvent(new Event("accessTokenAutoRefreshed"));
        if (config.headers) {
          config.headers.Authorization = `Bearer access=${new_access_token}`;
        }
        return config as any;
      } catch (error) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        window.location.href = "/auth/signin";
      }
    }
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
      toast.error("An error occurred. Please try again later.");
      return Promise.reject(response);
    }
  },
  (error) => {
    if (error.response?.status === 422) {
      toast.error(
        "Missing required data. Please check the fields. Make sure you select a casebook for the case.",
      );
    } else {
      if (error.response.data.detail) {
        toast.error("An error occurred: " + error.response.data.detail);
      } else if (error.response.data.message) {
        toast.error("An error occurred: " + error.response.data.message);
      } else {
        toast.error("An error occurred");
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
