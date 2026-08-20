import axios, {
  type InternalAxiosRequestConfig,
} from "axios";

/* ==================================================
 * AXIOS INSTANCE
 * ================================================== */

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 10000,

  /*
   * Send cookies by default.
   *
   * Example:
   * refreshToken=...
   */
  withCredentials: true,
});

/* ==================================================
 * PUBLIC AUTH ROUTES
 *
 * These routes DON'T need cookies.
 * ================================================== */

const PUBLIC_AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/create-password",
];

/* ==================================================
 * NORMALIZE URL
 * ================================================== */

const normalizePath = (url: string) => {
  /*
   * Remove query parameters.
   *
   * /login?email=test@gmail.com
   *       ↓
   * /login
   */
  const pathname = url.split("?")[0];

  /*
   * Remove trailing slash.
   *
   * /login/
   *       ↓
   * /login
   */
  return pathname.replace(/\/+$/, "") || "/";
};

/* ==================================================
 * CHECK PUBLIC AUTH ROUTE
 * ================================================== */

const isPublicAuthRoute = (
  url: string
): boolean => {
  const pathname = normalizePath(url);

  return PUBLIC_AUTH_ROUTES.some(
    (route) => {
      const normalizedRoute =
        normalizePath(route);

      /*
       * Handles:
       *
       * /login
       * /auth/login
       * /api/v1/auth/login
       */
      return (
        pathname === normalizedRoute ||
        pathname.endsWith(
          normalizedRoute
        )
      );
    }
  );
};

/* ==================================================
 * REQUEST INTERCEPTOR
 * ================================================== */

api.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig
  ) => {
    const url = config.url || "";

    const isPublic =
      isPublicAuthRoute(url);

    /*
     * PUBLIC AUTH APIs
     *
     * No cookies.
     */
    if (isPublic) {
      config.withCredentials = false;
    }

    /*
     * ALL OTHER APIs
     *
     * Send cookies.
     */
    else {
      config.withCredentials = true;
    }

    /* ----------------------------------------------
     * DEBUG
     * ---------------------------------------------- */

    console.log("[API REQUEST]", {
      url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL || ""}${url}`,
      isPublic,
      withCredentials:
        config.withCredentials,
    });

    return config;
  },

  (error) => {
    console.error(
      "[API REQUEST ERROR]",
      error
    );

    return Promise.reject(error);
  }
);

/* ==================================================
 * RESPONSE INTERCEPTOR
 * ================================================== */

api.interceptors.response.use(
  (response) => {
    console.log(
      "[API RESPONSE]",
      response.config.url,
      response.status
    );

    return response;
  },

  (error) => {
    console.error(
      "[API RESPONSE ERROR]",
      {
        url:
          error?.config?.url,
        status:
          error?.response?.status,
        data:
          error?.response?.data,
      }
    );

    return Promise.reject(error);
  }
);

/* ==================================================
 * EXPORT
 * ================================================== */

export default api;







// import axios from "axios";


// const api = axios.create({

//   baseURL:
//     process.env.NEXT_PUBLIC_API_URL ,
    

//   headers: {
//     "Content-Type": "application/json",
//   },

//   timeout: 10000,

// });


// export default api;