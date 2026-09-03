import type { Request, Response } from "express";
import { prisma } from "@unseen-gadget/database";
import { ApiResponseUtil } from "../utils/api-response";
import { BadRequestError, ConflictError } from "../utils/errors";
import { asyncHandler } from "../utils/async-handler";

export const subscribeNewsletter = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new BadRequestError("Invalid email format");
  }

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  });

  if (existing) {
    if (existing.active) {
      throw new ConflictError("This email is already subscribed to the newsletter");
    }
    const subscriber = await prisma.newsletterSubscriber.update({
      where: { email },
      data: { active: true },
    });
    ApiResponseUtil.success(res, {
      id: subscriber.id,
      email: subscriber.email,
      active: subscriber.active,
      createdAt: subscriber.createdAt,
    });
    return;
  }

  const subscriber = await prisma.newsletterSubscriber.create({
    data: {
      email,
      active: true,
    },
  });

  ApiResponseUtil.success(res, {
    id: subscriber.id,
    email: subscriber.email,
    active: subscriber.active,
    createdAt: subscriber.createdAt,
  });
});

export const unsubscribeNewsletter = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Email is required");
  }

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  });

  if (!existing) {
    throw new BadRequestError("Email not found in subscribers");
  }

  await prisma.newsletterSubscriber.update({
    where: { email },
    data: { active: false },
  });

  ApiResponseUtil.success(res, { message: "Unsubscribed successfully" });
});

export const NewsletterController = {
  subscribeNewsletter,
  unsubscribeNewsletter,
};

export default NewsletterController;
