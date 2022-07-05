import * as Cookies from 'cookies';

const TOKEN_COOKIE_NAME = "ssat";

export const setCookie = (cookies: Cookies, name: string, value: string, opts?: Cookies.SetOption) => {
  cookies.set(name, value, opts);
};

export const getCookie = (cookies: Cookies, name: string, opts?: Cookies.GetOption): string | undefined => {
  return cookies.get(name, opts);
};

export const setTokenCookie = (cookies: Cookies, token: string) => {
  //cookies.set(TOKEN_COOKIE_NAME, token, { httpOnly: true, secure: true, domain: "", path: "" });
  cookies.set(TOKEN_COOKIE_NAME, token, { httpOnly: true });
};

export const clearTokenCookie = (cookies: Cookies) => {
  setTokenCookie(cookies, TOKEN_COOKIE_NAME);
};

export const getTokenCookie = (cookies: Cookies): string | undefined => {
  return cookies.get(TOKEN_COOKIE_NAME);
};
