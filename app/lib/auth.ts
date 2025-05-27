/**
 * Retrieves the access token from localStorage.
 * @returns The access token string, or null if not found.
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

/**
 * Stores the access token in localStorage.
 * @param token The access token string to store.
 */
export const setAccessToken = (token: string): void => {
  localStorage.setItem("accessToken", token);
};

/**
 * Retrieves the refresh token from localStorage.
 * @returns The refresh token string, or null if not found.
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

/**
 * Stores the refresh token in localStorage.
 * @param token The refresh token string to store.
 */
export const setRefreshToken = (token: string): void => {
  localStorage.setItem("refreshToken", token);
};

/**
 * Removes both the access token and refresh token from localStorage.
 */
export const clearTokens = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
