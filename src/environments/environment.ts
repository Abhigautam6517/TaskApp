/**
 * Development environment.
 * API base URL: when using proxy (ng serve with --proxy-config proxy.conf.json), use '' so requests go to /api.
 * Without proxy, set apiUrl to your backend URL (e.g. https://localhost:7095).
 */
export const environment = {
  production: false,
  apiUrl: '', // Use '' with proxy; or 'https://localhost:7095' to call backend directly (CORS must be enabled).
};
