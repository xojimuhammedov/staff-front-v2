const authConfig = {
    meEndpoint: "/api/v2/employees/me",
    loginEndpoint: "/api/v1/auth/login",
    logOutEndpoint:"/api/v1/auth/logout",
    registerEndpoint: "/jwt/register",
    storageTokenKeyName: "accessToken",
    onTokenExpiration: "refreshToken" as "logout" | "refreshToken", // logout | refreshToken
  };
  
  export default authConfig;
  