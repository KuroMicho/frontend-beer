// src/lib/auth.ts
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

export const removeTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
            mutation RefreshToken($refreshInput: RefreshTokenInput!) {
              refreshToken(refreshInput: $refreshInput) {
                accessToken
                refreshToken
              }
            }
          `,
        variables: {
          refreshInput: {
            refreshToken: refreshToken,
          },
        },
      }),
    });

    const { data } = await response.json();
    if (data?.refreshToken) {
      setAccessToken(data.refreshToken.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken.refreshToken);
      return data.refreshToken.accessToken;
    }
    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};
