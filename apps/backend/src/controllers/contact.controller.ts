import type { Request, Response } from "express";
import { prisma } from "@unseen-gadget/database";
import { ApiResponseUtil } from "../utils/api-response";
import { BadRequestError } from "../utils/errors";
import { asyncHandler } from "../utils/async-handler";

export const createContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    throw new BadRequestError("Name, email, and message are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new BadRequestError("Invalid email format");
  }

  const contactMessage = await prisma.contactMessage.create({
    data: {
      name,
      email,
      phone: phone || undefined,
      subject: subject || undefined,
      message,
      read: false,
    },
  });

  ApiResponseUtil.success(res, {
    id: contactMessage.id,
    name,
    email,
    subject,
    createdAt: contactMessage.createdAt,
  }, "Message sent successfully");
});

export const getContactMessages = asyncHandler(async (_req: Request, res: Response) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    where: { read: false },
  });

  ApiResponseUtil.success(res, messages);
});

export const ContactController = {
  createContactMessage,
  getContactMessages,
};

export default ContactController;
