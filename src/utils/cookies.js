export const setCookie = (name, value, days = 1) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;secure;samesite=strict`;
};

export const setTokenCookie = (token, days = 7) => {
  setCookie("token", token, days);
};

export const setUserCookie = (userId, days = 7) => {
  setCookie("user", userId, days);
};

export const getTokenFromCookie = () => {
  return getCookie("token");
};

export const getUserFromCookie = () => {
  return getCookie("user");
};

export const clearAuthCookies = () => {
  deleteCookie("token");
  deleteCookie("user");
  deleteCookie("rememberEmail");
  deleteCookie("rememberPassword");
};
