export const requests = {
  auth: {
    login: `/service/auth/login`,
    register: `/service/auth/register`,
    refresh: `/service/auth/refresh`,
    logout: `/service/auth/logout`,
    logoutAll: `/service/auth/logout-all`,
  },
} as const;
