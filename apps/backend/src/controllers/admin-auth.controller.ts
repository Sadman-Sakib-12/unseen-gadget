import type { Request, Response } from "express";
import type {
  AdminLoginInput,
  AdminRegisterInput,
  ChangePasswordInput,
} from "@unseen-gadget/validations";
import { ADMIN_REFRESH_COOKIE_NAME } from "../constants";
import { clearAdminAuthCookies, setAdminAuthCookies } from "../config/cookies";
import { ApiResponseUtil } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import { UnauthorizedError } from "../utils/errors";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import * as adminAuthService from "../services/admin-auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validated.body as unknown as AdminRegisterInput;
  const { admin } = await adminAuthService.register(input);
  const accessToken = signAccessToken(admin.id, admin.tokenVersion);
  const refreshToken = signRefreshToken(admin.id, admin.tokenVersion);
  setAdminAuthCookies(res, accessToken, refreshToken);
  ApiResponseUtil.created(res, admin, "Admin registered successfully");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validated.body as unknown as AdminLoginInput;
  const { admin } = await adminAuthService.login(input);
  const accessToken = signAccessToken(admin.id, admin.tokenVersion);
  const refreshToken = signRefreshToken(admin.id, admin.tokenVersion);
  setAdminAuthCookies(res, accessToken, refreshToken);
  ApiResponseUtil.success(res, admin, "Login successful");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await adminAuthService.logout(req.adminUser!.id);
  clearAdminAuthCookies(res);
  ApiResponseUtil.noContent(res);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const admin = await adminAuthService.getMe(req.adminUser!.id);
  ApiResponseUtil.success(res, admin);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[ADMIN_REFRESH_COOKIE_NAME] as string | undefined;
  if (!refreshToken) throw new UnauthorizedError("Missing refresh token");

  const { admin } = await adminAuthService.refresh(refreshToken);
  const accessToken = signAccessToken(admin.id, admin.tokenVersion);
  const rotatedRefreshToken = signRefreshToken(admin.id, admin.tokenVersion);
  setAdminAuthCookies(res, accessToken, rotatedRefreshToken);
  ApiResponseUtil.success(res, admin, "Session refreshed");
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.validated.body as unknown as ChangePasswordInput;
  await adminAuthService.changePassword(req.adminUser!.id, currentPassword, newPassword);
  clearAdminAuthCookies(res);
  ApiResponseUtil.success(res, undefined, "Password changed. Please log in again.");
});

export const AdminAuthController = {
  register,
  login,
  logout,
  me,
  refresh,
  changePassword,
};

export default AdminAuthController;