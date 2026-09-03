import jwt, { type SignOptions } from "jsonwebtoken";
import type { AccessTokenPayload, RefreshTokenPayload } from "./types";

export function signAccessToken(
  sub: string,
  ver: number,
  secret: string,
  expiresIn: string | number = "15m",
  extra?: Partial<AccessTokenPayload>
): string {
  const payload: AccessTokenPayload = { sub, ver, type: "access", ...extra };
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}

export function signRefreshToken(
  sub: string,
  ver: number,
  secret: string,
  expiresIn: string | number = "7d"
): string {
  const payload: RefreshTokenPayload = { sub, ver, type: "refresh" };
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}

export function verifyToken<T extends AccessTokenPayload | RefreshTokenPayload>(
  token: string,
  secret: string
): T | null {
  try {
    return jwt.verify(token, secret) as T;
  } catch {
    return null;
  }
}

export const Jwt = {
  signAccessToken,
  signRefreshToken,
  verifyToken,
};

export default Jwt;
