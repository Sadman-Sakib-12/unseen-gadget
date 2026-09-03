import {
  signAccessToken as signAccess,
  signRefreshToken as signRefresh,
  verifyToken as verifyTok,
  type AccessTokenPayload,
  type RefreshTokenPayload,
} from "@unseen-gadget/auth";
import { env } from "../config/env";
import { ACCESS_TOKEN_TTL } from "../constants";

export { type AccessTokenPayload, type RefreshTokenPayload };

export function signAccessToken(sub: string, ver: number): string {
  return signAccess(sub, ver, env.JWT_SECRET, ACCESS_TOKEN_TTL);
}

export function signRefreshToken(sub: string, ver: number): string {
  return signRefresh(sub, ver, env.JWT_SECRET, env.JWT_EXPIRES_IN);
}

export function verifyToken<T extends AccessTokenPayload | RefreshTokenPayload>(
  token: string
): T | null {
  return verifyTok<T>(token, env.JWT_SECRET);
}

export const Jwt = {
  signAccessToken,
  signRefreshToken,
  verifyToken,
};

export default Jwt;