import type { Request, Response } from "express";
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "@unseen-gadget/validations";
import { CUSTOMER_REFRESH_COOKIE_NAME, CART_SESSION_COOKIE_NAME } from "../constants";
import {
  clearCartSessionCookie,
  clearCustomerAuthCookies,
  setCustomerAuthCookies,
} from "../config/cookies";
import { ApiResponseUtil } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import { UnauthorizedError } from "../utils/errors";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import * as authService from "../services/auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validated.body as unknown as RegisterInput;
  const user = await authService.register(input);
  ApiResponseUtil.created(res, user, "Registration successful. You can now log in.");
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.validated.body as unknown as VerifyEmailInput;
  const user = await authService.verifyEmail(token);
  ApiResponseUtil.success(res, user, "Email verified successfully");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const validated = req.validated.body as unknown as { sessionId?: string } & LoginInput;
  const input = validated as LoginInput;

  // Guest cart session comes from the httpOnly cookie; explicit body
  // sessionId remains supported for backward compatibility.
  const sessionId =
    (req.cookies?.[CART_SESSION_COOKIE_NAME] as string | undefined) ?? validated.sessionId;

  const result = await authService.login(input, sessionId);

  if (result.requiresOtp) {
    return ApiResponseUtil.success(
      res,
      { requiresOtp: true, email: result.email },
      result.message,
    );
  }

  const { user } = result;
  const accessToken = signAccessToken(user.id, user.tokenVersion);
  const refreshToken = signRefreshToken(user.id, user.tokenVersion);
  setCustomerAuthCookies(res, accessToken, refreshToken);

  // The guest cart has been merged into the user's cart — retire the session.
  if (req.cookies?.[CART_SESSION_COOKIE_NAME]) {
    clearCartSessionCookie(res);
  }

  ApiResponseUtil.success(res, { ...user, accessToken, refreshToken }, "Login successful");
});

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validated.body as unknown as { email: string; password: string };
  const result = await authService.login({ email: input.email, password: input.password });
  ApiResponseUtil.success(
    res,
    { requiresOtp: true, email: input.email },
    result.requiresOtp ? result.message : "Verification code sent.",
  );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logout(req.user!.id);
  clearCustomerAuthCookies(res);
  ApiResponseUtil.noContent(res);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  ApiResponseUtil.success(res, user);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken =
    (req.cookies?.[CUSTOMER_REFRESH_COOKIE_NAME] as string | undefined) ||
    (req.body?.refreshToken as string | undefined) ||
    (req.body?.token as string | undefined);
  if (!refreshToken) throw new UnauthorizedError("Missing refresh token");

  const { user } = await authService.refresh(refreshToken);
  const accessToken = signAccessToken(user.id, user.tokenVersion);
  const rotatedRefreshToken = signRefreshToken(user.id, user.tokenVersion);
  setCustomerAuthCookies(res, accessToken, rotatedRefreshToken);
  ApiResponseUtil.success(res, { ...user, accessToken, refreshToken: rotatedRefreshToken }, "Session refreshed");
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.validated.body as unknown as ForgotPasswordInput;
  await authService.forgotPassword(email);
  ApiResponseUtil.success(res, undefined, "If that email exists, a reset link has been sent");
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.validated.body as unknown as ResetPasswordInput;
  await authService.resetPassword(token, password);
  ApiResponseUtil.success(res, undefined, "Password has been reset");
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.validated.body as unknown as ChangePasswordInput;
  await authService.changePassword(req.user!.id, currentPassword, newPassword);
  clearCustomerAuthCookies(res);
  ApiResponseUtil.success(res, undefined, "Password changed. Please log in again.");
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, email } = req.body as { name?: string; phone?: string; email?: string };
  const user = await authService.updateProfile(req.user!.id, { name, phone, email });
  ApiResponseUtil.success(res, user, "Profile updated successfully");
});

export const AuthController = {
  register,
  verifyEmail,
  login,
  logout,
  me,
  updateProfile,
  refresh,
  forgotPassword,
  resetPassword,
  changePassword,
};

export default AuthController;