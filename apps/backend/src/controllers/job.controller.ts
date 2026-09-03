import type { Request, Response } from "express";
import { prisma } from "@unseen-gadget/database";
import { ApiResponseUtil } from "../utils/api-response";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { asyncHandler } from "../utils/async-handler";

export const listJobOpenings = asyncHandler(async (_req: Request, res: Response) => {
  const jobs = await prisma.jobOpening.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  ApiResponseUtil.success(res, jobs);
});

export const getJobBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const job = await prisma.jobOpening.findFirst({
    where: { active: true, title: slug },
  });

  if (!job) {
    throw new NotFoundError("Job opening not found");
  }

  ApiResponseUtil.success(res, job);
});

export const applyForJob = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, coverLetter, resume } = req.body;

  if (!name || !email || !phone) {
    throw new BadRequestError("Name, email, and phone are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new BadRequestError("Invalid email format");
  }

  const job = await prisma.jobOpening.findFirst({
    where: { id, active: true },
  });

  if (!job) {
    throw new NotFoundError("Job opening not found or closed");
  }

  const application = await prisma.jobApplication.create({
    data: {
      jobId: id,
      name,
      email,
      phone,
      coverLetter: coverLetter || undefined,
      resume: resume || undefined,
      status: "pending",
    },
  });

  ApiResponseUtil.success(res, {
    id: application.id,
    jobId: application.jobId,
    name,
    email,
    phone,
    status: application.status,
    createdAt: application.createdAt,
  }, "Application submitted successfully");
});

export const JobController = {
  listJobOpenings,
  getJobBySlug,
  applyForJob,
};

export default JobController;
