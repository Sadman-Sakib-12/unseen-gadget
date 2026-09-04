import type { Response } from "express";
import { isProduction } from "./env";
import {
  ACCESS_TOKEN_TTL_MS,
  ADMIN_AUTH_COOKIE_NAME,
  ADMIN_REFRESH_COOKIE_NAME,
  CART_SESSION_COOKIE_NAME,
  COOKIE_MAX_AGE_MS,
  CUSTOMER_AUTH_COOKIE_NAME,
  CUSTOMER_REFRESH_COOKIE_NAME,
} from "../constants";

export interface AuthCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge: number;
}

function baseOptions(maxAge: number): AuthCookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge,
  };
}

export const accessCookieOptions = (): AuthCookieOptions =>
  baseOptions(ACCESS_TOKEN_TTL_MS);

export const refreshCookieOptions = (): AuthCookieOptions =>
  baseOptions(COOKIE_MAX_AGE_MS);

export const clearCookieOptions = (): Omit<AuthCookieOptions, "maxAge"> => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
});

export function setCustomerAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
): void {
  res.cookie(CUSTOMER_AUTH_COOKIE_NAME, accessToken, accessCookieOptions());
  res.cookie(CUSTOMER_REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions());
}

export function clearCustomerAuthCookies(res: Response): void {
  res.clearCookie(CUSTOMER_AUTH_COOKIE_NAME, clearCookieOptions());
  res.clearCookie(CUSTOMER_REFRESH_COOKIE_NAME, clearCookieOptions());
}

export function setAdminAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
): void {
  res.cookie(ADMIN_AUTH_COOKIE_NAME, accessToken, accessCookieOptions());
  res.cookie(ADMIN_REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions());
}

export function clearAdminAuthCookies(res: Response): void {
  res.clearCookie(ADMIN_AUTH_COOKIE_NAME, clearCookieOptions());
  res.clearCookie(ADMIN_REFRESH_COOKIE_NAME, clearCookieOptions());
}

const CART_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function setCartSessionCookie(res: Response, sessionId: string): void {
  res.cookie(CART_SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: CART_SESSION_TTL_MS,
  });
}

export function clearCartSessionCookie(res: Response): void {
  res.clearCookie(CART_SESSION_COOKIE_NAME, clearCookieOptions());
}