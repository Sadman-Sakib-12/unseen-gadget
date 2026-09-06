import type { Request, Response } from "express";
import { prisma } from "@unseen-gadget/database";
import { ApiResponseUtil } from "../utils/api-response";
import { NotFoundError, BadRequestError } from "../utils/errors";
import { asyncHandler } from "../utils/async-handler";
import { slugify } from "../utils/slug";
import type {
  cmsPostUpdateSchema,
  cmsJobSchema,
  cmsJobUpdateSchema,
  cmsPageUpdateSchema,
} from "../validations/ops.validations";
import type { z } from "zod";

type CmsPostUpdate = z.infer<typeof cmsPostUpdateSchema>;
type CmsJobCreate = z.infer<typeof cmsJobSchema>;
type CmsJobUpdate = z.infer<typeof cmsJobUpdateSchema>;
type CmsPageUpdate = z.infer<typeof cmsPageUpdateSchema>;

// ---------------- Blog posts (BlogPost model) ----------------

export const listPosts = asyncHandler(async (req: Request, res: Response) => {
  const wantAll = req.query.all === "true" || req.query.all === "1";
  const isAdmin = Boolean(req.adminUser);
  if (wantAll && !isAdmin) {
    throw new BadRequestError("Admin authentication required to list all posts");
  }
  const posts = await prisma.blogPost.findMany({
    where: wantAll && isAdmin ? {} : { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  ApiResponseUtil.success(res, posts);
});

export const getPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await prisma.blogPost.findFirst({
    where: {
      OR: [{ id: req.params.id }, { slug: req.params.id }],
    },
  });
  if (!post) throw new NotFoundError("Post not found");
  if (post.status !== "PUBLISHED" && !req.adminUser) {
    throw new NotFoundError("Post not found");
  }
  ApiResponseUtil.success(res, post);
});

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as CmsPostUpdate & { title: string };
  let slug = body.slug ? slugify(body.slug) : slugify(body.title);
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const post = await prisma.blogPost.create({
    data: {
      title: body.title,
      slug,
      excerpt: body.excerpt,
      category: body.category,
      tags: body.tags ?? [],
      author: body.author,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : body.status === "PUBLISHED" ? new Date() : null,
      featuredImage: body.featuredImage,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      status: body.status ?? "DRAFT",
      blocks: body.blocks ?? undefined,
    },
  });
  ApiResponseUtil.created(res, post, "Post created");
});

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const existing = await prisma.blogPost.findFirst({ where: { OR: [{ id }, { slug: id }] } });
  if (!existing) throw new NotFoundError("Post not found");
  const body = req.validated.body as CmsPostUpdate;

  const post = await prisma.blogPost.update({
    where: { id: existing.id },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.slug !== undefined ? { slug: slugify(body.slug) } : {}),
      ...(body.excerpt !== undefined ? { excerpt: body.excerpt } : {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.tags !== undefined ? { tags: body.tags } : {}),
      ...(body.author !== undefined ? { author: body.author } : {}),
      ...(body.publishedAt !== undefined
        ? { publishedAt: new Date(body.publishedAt) }
        : body.status === "PUBLISHED" && !existing.publishedAt
          ? { publishedAt: new Date() }
          : {}),
      ...(body.featuredImage !== undefined ? { featuredImage: body.featuredImage } : {}),
      ...(body.seoTitle !== undefined ? { seoTitle: body.seoTitle } : {}),
      ...(body.seoDescription !== undefined ? { seoDescription: body.seoDescription } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.blocks !== undefined ? { blocks: body.blocks as never } : {}),
    },
  });
  ApiResponseUtil.success(res, post, "Post updated");
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const existing = await prisma.blogPost.findFirst({ where: { OR: [{ id }, { slug: id }] } });
  if (!existing) throw new NotFoundError("Post not found");
  await prisma.blogPost.delete({ where: { id: existing.id } });
  ApiResponseUtil.success(res, { deleted: true }, "Post deleted");
});

// ---------------- Promotions (Promotion model) ----------------

function promotionData(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const key of [
    "name",
    "title",
    "badge",
    "description",
    "type",
    "discountType",
    "discountValue",
    "applicableTo",
    "status",
    "ctaLabel",
    "ctaHref",
    "icon",
    "gradient",
    "sortOrder",
    "active",
  ]) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (body.startDate !== undefined) data.startDate = body.startDate ? new Date(body.startDate as string) : null;
  if (body.endDate !== undefined) data.endDate = body.endDate ? new Date(body.endDate as string) : null;
  return data;
}

export const listPromotions = asyncHandler(async (req: Request, res: Response) => {
  const wantAll = req.query.all === "true" || req.query.all === "1";
  const isAdmin = Boolean(req.adminUser);
  if (wantAll && !isAdmin) {
    throw new BadRequestError("Admin authentication required to list all promotions");
  }
  const promotions = await prisma.promotion.findMany({
    where: wantAll && isAdmin ? {} : { active: true },
    orderBy: { sortOrder: "asc" },
  });
  ApiResponseUtil.success(res, promotions);
});

export const getPromotion = asyncHandler(async (req: Request, res: Response) => {
  const promotion = await prisma.promotion.findUnique({ where: { id: req.params.id } });
  if (!promotion) throw new NotFoundError("Promotion not found");
  ApiResponseUtil.success(res, promotion);
});

export const createPromotion = asyncHandler(async (req: Request, res: Response) => {
  const promotion = await prisma.promotion.create({
    data: promotionData(req.validated.body as Record<string, unknown>) as never,
  });
  ApiResponseUtil.created(res, promotion, "Promotion created");
});

export const updatePromotion = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.promotion.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError("Promotion not found");
  const promotion = await prisma.promotion.update({
    where: { id: existing.id },
    data: promotionData(req.validated.body as Record<string, unknown>) as never,
  });
  ApiResponseUtil.success(res, promotion, "Promotion updated");
});

export const deletePromotion = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.promotion.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError("Promotion not found");
  await prisma.promotion.delete({ where: { id: existing.id } });
  ApiResponseUtil.success(res, { deleted: true }, "Promotion deleted");
});

// ---------------- Jobs (JobOpening model) ----------------

export const listJobs = asyncHandler(async (req: Request, res: Response) => {
  const wantAll = req.query.all === "true" || req.query.all === "1";
  const isAdmin = Boolean(req.adminUser);
  if (wantAll && !isAdmin) {
    throw new BadRequestError("Admin authentication required to list all jobs");
  }
  const jobs = await prisma.jobOpening.findMany({
    where: wantAll && isAdmin ? {} : { active: true },
    include: isAdmin ? { _count: { select: { applications: true } } } : undefined,
    orderBy: { createdAt: "desc" },
  });
  ApiResponseUtil.success(res, jobs);
});

export const getJobApplications = asyncHandler(async (req: Request, res: Response) => {
  const job = await prisma.jobOpening.findUnique({ where: { id: req.params.id } });
  if (!job) throw new NotFoundError("Job not found");

  const applications = await prisma.jobApplication.findMany({
    where: { jobId: req.params.id },
    orderBy: { createdAt: "desc" },
  });
  ApiResponseUtil.success(res, applications);
});

export const getJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await prisma.jobOpening.findUnique({ where: { id: req.params.id } });
  if (!job || (!job.active && !req.adminUser)) throw new NotFoundError("Job not found");
  ApiResponseUtil.success(res, job);
});

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as CmsJobCreate;
  const job = await prisma.jobOpening.create({
    data: {
      title: body.title,
      department: body.department,
      type: body.type,
      location: body.location,
      description: body.description,
      responsibilities: body.responsibilities ?? [],
      requirements: body.requirements ?? [],
      active: body.active ?? true,
    },
  });
  ApiResponseUtil.created(res, job, "Job created");
});

export const updateJob = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as CmsJobUpdate;
  const existing = await prisma.jobOpening.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError("Job not found");
  const job = await prisma.jobOpening.update({
    where: { id: existing.id },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.department !== undefined ? { department: body.department } : {}),
      ...(body.type !== undefined ? { type: body.type } : {}),
      ...(body.location !== undefined ? { location: body.location } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.responsibilities !== undefined ? { responsibilities: body.responsibilities } : {}),
      ...(body.requirements !== undefined ? { requirements: body.requirements } : {}),
      ...(body.active !== undefined ? { active: body.active } : {}),
    },
  });
  ApiResponseUtil.success(res, job, "Job updated");
});

export const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.jobOpening.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError("Job not found");
  await prisma.jobOpening.delete({ where: { id: existing.id } });
  ApiResponseUtil.success(res, { deleted: true }, "Job deleted");
});

// ---------------- Pages (Page model) ----------------

export const listPages = asyncHandler(async (_req: Request, res: Response) => {
  const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });
  ApiResponseUtil.success(res, pages);
});

const initialPrivacyContent = {
  type: "privacy",
  lastUpdated: "01/08/2024",
  title: "Privacy Policy",
  intro:
    "Welcome to Unseen Gadget. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or use our services. By using our website or services, you agree to the practices outlined below.",
  sections: [
    {
      id: "interpretation-definitions",
      heading: "Interpretation and Definitions",
      subsections: [
        {
          title: "Interpretation",
          paragraph:
            "Words with initial capital letters have defined meanings below. These definitions apply regardless of whether they appear in singular or plural.",
        },
        {
          title: "Definitions",
          items: [
            { term: "Account", text: "A unique account created for you to access our services." },
            { term: "Affiliate", text: "An entity under common ownership or control with us." },
            { term: "Company", text: 'Refers to Unseen Gadget, also referred to as "we", "us", or "our" in this policy.' },
            { term: "Cookies", text: "Small files placed on your device to store data such as browsing history." },
            { term: "Country", text: "Refers to Bangladesh." },
            { term: "Device", text: "Any internet-connected device such as a mobile phone, tablet, or computer." },
            { term: "Personal Data", text: "Any information related to an identified or identifiable individual." },
            { term: "Service", text: "Refers to our website and related services." },
            { term: "Service Provider", text: "A third party who processes data on our behalf." },
            { term: "Third-party Social Media Service", text: "Platforms that allow users to log in or register, e.g., Facebook, Google." },
            { term: "Usage Data", text: "Automatically collected data such as IP address, browser type, and interaction with our website." },
            { term: "Website", text: "Refers to Unseen Gadget, accessible at www.unseengadget.com." },
            { term: "You", text: "The user accessing our service." },
          ],
        },
      ],
    },
    {
      id: "collecting-using-data",
      heading: "Collecting and Using Your Personal Data",
      subsections: [
        {
          title: "Types of Data Collected",
        },
        {
          title: "Personal Data",
          paragraph: "We may collect the following personal data to enhance our services:",
          items: [
            { text: "Name" },
            { text: "Email Address" },
            { text: "Phone number" },
            { text: "Shipping/Billing address" },
            { text: "Photos (optional)" },
            { text: "Usage Data" },
          ],
        },
        {
          title: "Image Information",
          paragraph:
            "If you upload photos for profile or content submissions, they may be stored securely on our servers. We do not share images with third parties. By uploading, you consent to our storing and using your images internally.",
          hasDividerAfter: true,
        },
        {
          title: "Facebook App Events",
          paragraph: "We use Facebook App Events to analyze app usage and performance. Meta Platforms, Inc. may collect:",
          items: [
            { text: "App activity (e.g., clicks, purchases)" },
            { text: "Device details (e.g., OS version)" },
            { text: "Advertising ID" },
            { text: "Crash and diagnostic data" },
          ],
        },
        {
          title: "How We Use This Data:",
          items: [
            { text: "Performance and engagement analytics." },
            { text: "Marketing and content personalization." },
            { text: "Bug tracking and app improvement." },
          ],
        },
        {
          title: "Data Sharing & Opt-out",
          paragraph: "Data Sharing: This data is shared with Facebook under their Data Policy.\n\nOpt-out Options:",
          items: [
            { text: "Change ad preferences in your Facebook account." },
            { text: "Disable ad tracking on your device settings." },
            { text: "Request data deletion by emailing us at contact@unseengadget.com" },
          ],
          hasDividerAfter: true,
        },
        {
          title: "Usage Data",
          paragraph: "Collected automatically during interaction with our services. This may include:",
          items: [
            { text: "IP address" },
            { text: "Browser and device type" },
            { text: "Time and date of visit" },
            { text: "Pages visited" },
            { text: "Diagnostic and performance data" },
          ],
          hasDividerAfter: true,
        },
        {
          title: "Social Media Logins",
          paragraph:
            "You may log in or register using Google, Facebook, or other platforms. We collect the data you permit via these services, including name, email, and profile photo.",
        },
        {
          title: "Tracking Technologies and Cookies",
          paragraph: "We use cookies and similar technologies to improve your browsing experience:",
          items: [
            { term: "Necessary Cookies", text: "For website functionality and secure login" },
            { term: "Preference Cookies", text: "To remember user settings like language" },
            { term: "Analytics Cookies", text: "To monitor website traffic and performance" },
            { term: "Marketing Cookies", text: "For relevant ads and promotions" },
          ],
          footerParagraph:
            "You can adjust your browser settings to refuse cookies. However, this may affect your ability to use some features.",
        },
      ],
    },
    {
      id: "how-we-use-data",
      heading: "How We Use Your Personal Data",
      subsections: [
        {
          paragraph: "We may use your data for:",
          items: [
            { text: "Account management" },
            { text: "Fulfilling orders" },
            { text: "Customer service and support" },
            { text: "Notifications and promotions" },
            { text: "Service improvements and feedback" },
            { text: "Security and fraud prevention" },
            { text: "Legal compliance" },
          ],
        },
      ],
    },
    {
      id: "data-sharing",
      heading: "Data Sharing",
      subsections: [
        {
          paragraph: "We may share your data in the following cases:",
          items: [
            { text: "With trusted service providers (e.g., payment gateways, logistics partners)" },
            { text: "During business transfers (e.g., mergers or acquisitions)" },
            { text: "With our affiliates under similar privacy protection" },
            { text: "With partners offering relevant services or promotions" },
            { text: "When legally required or with your explicit consent" },
          ],
          hasDividerAfter: true,
        },
      ],
    },
    {
      id: "your-privacy-rights",
      heading: "Your Privacy Rights",
      subsections: [
        {
          paragraph: "You have the right to:",
          items: [
            { text: "Access and correct your data" },
            { text: "Withdraw consent at any time" },
            { text: "Request deletion of your personal information" },
            { text: "Opt out of marketing communications" },
          ],
          footerParagraph: "To exercise these rights, contact us at contact@unseengadget.com",
        },
      ],
    },
    {
      id: "data-security",
      heading: "Data Security",
      subsections: [
        {
          paragraph:
            "We take appropriate technical and organizational measures to protect your data from unauthorized access, disclosure, or destruction.",
          hasDividerAfter: true,
        },
      ],
    },
    {
      id: "links-to-other-websites",
      heading: "Links to Other Websites",
      subsections: [
        {
          paragraph:
            "Our website may contain links to external sites. We are not responsible for the privacy practices or content of these sites. Please read their policies separately.",
          hasDividerAfter: true,
        },
      ],
    },
    {
      id: "changes-to-privacy-policy",
      heading: "Changes to This Privacy Policy",
      subsections: [
        {
          paragraph:
            "We may update our Privacy Policy from time to time. Changes will be posted on this page with the updated date. We recommend reviewing this page periodically for any updates.",
          hasDividerAfter: true,
        },
      ],
    },
    {
      id: "contact-us",
      heading: "Contact Us",
      subsections: [
        {
          paragraph: "If you have any questions about this Privacy Policy, please contact us:",
        },
      ],
    },
  ],
  contactInfo: {
    email: "contact@unseengadget.com",
    address: "Shop 50, Block C, Level 04, Bashundhara City Shopping Mall, Dhaka, Bangladesh",
  },
};

const initialTermsContent = {
  type: "terms",
  lastUpdated: "01/06/2025",
  title: "Terms and Conditions – Unseen Gadget",
  intro:
    "Welcome to Unseen Gadget. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.",
  sections: [
    {
      id: "acceptance-of-terms",
      heading: "Acceptance of Terms",
      paragraph:
        "By using Unseen Gadget, you confirm that you are at least 18 years old and legally capable of entering into binding contracts. If you do not agree to these terms, please refrain from using our services.",
    },
    {
      id: "account-registration",
      heading: "Account Registration and Security",
      items: [
        "You may need to create an account to access certain features.",
        "You are responsible for maintaining the confidentiality of your account information.",
        "Notify us immediately of any unauthorized use of your account.",
      ],
    },
    {
      id: "product-info",
      heading: "Product Information and Availability",
      items: [
        "All products are subject to availability.",
        "We strive to display accurate product information, but errors may occur.",
        "Prices and availability are subject to change without notice.",
      ],
    },
    {
      id: "orders-payments",
      heading: "Orders and Payments",
      items: [
        "Orders can be placed online or through direct communication.",
        "Accepted payment methods include cash on delivery (COD), mobile banking (bKash/Nagad), debit/credit cards, and bank transfers.",
        "An order confirmation will be sent upon successful placement.",
      ],
    },
    {
      id: "shipping-delivery",
      heading: "Shipping and Delivery",
      items: [
        "Delivery within Dhaka: 1-2 business days.",
        "Delivery outside Dhaka: 2-4 business days.",
        "Delivery times are estimates and may vary due to unforeseen circumstances.",
        "Shipping charges will be calculated at checkout.",
      ],
    },
    {
      id: "return-refund",
      heading: "Return and Refund Policy",
      items: [
        "Returns are accepted within 72 hours of delivery for defective or incorrect items.",
        "Items must be unused, in original packaging, and accompanied by proof of purchase.",
        "Refunds will be processed within 3-5 business days after inspection.",
        "To know more about the return policy, click here.",
      ],
    },
    {
      id: "warranty",
      heading: "Warranty",
      items: [
        "Products may come with a manufacturer's warranty; terms vary by product.",
        "Warranty claims require proof of purchase.",
      ],
    },
    {
      id: "user-conduct",
      heading: "User Conduct",
      items: [
        "You agree not to use the website for unlawful purposes.",
        "You shall not upload or transmit any harmful content.",
      ],
    },
    {
      id: "intellectual-property",
      heading: "Intellectual Property",
      items: [
        "All content on unseengadget.com is the property of Unseen Gadget or its licensors.",
        "Unauthorized use of any content is prohibited.",
      ],
    },
    {
      id: "limitation-liability",
      heading: "Limitation of Liability",
      paragraph:
        "Unseen Gadget is not liable for any indirect, incidental, or consequential damages arising from the use of our website or products.",
    },
    {
      id: "modifications",
      heading: "Modifications to Terms",
      paragraph:
        "We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated effective date.",
    },
    {
      id: "governing-law",
      heading: "Governing Law",
      paragraph:
        "These terms are governed by the laws of the People's Republic of Bangladesh. Any disputes shall be resolved in the courts of Dhaka.",
    },
  ],
  contactInfo: {
    companyName: "Unseen Gadget",
    address: "House 07, 3rd Floor, Block H, Main Road, Banasree, Dhaka 1219",
    phone: "+8801714039409",
    email: "contact@unseengadget.com",
    website: "https://unseengadget.com",
  },
};

const initialDeliveryReturnContent = {
  type: "delivery-return",
  heroTitle: "Delivery & Return",
  heroSubtitle:
    "Free delivery available on orders over 3500 TK. Choose a specific delivery date & time that suits you with no extra charge.",
  overviewHeading: "Delivery Options Overview",
  overviewDescription:
    "Unseen Gadget offers reliable and convenient shipping options across Bangladesh. We primarily ship via Pathao Courier for fast and secure delivery. For select areas, we may use other trusted delivery partners to ensure timely service. Alternatively, you can also pick up your order from our retail shop at Bashundhara City Shopping Mall. Below is an overview of our available shipping methods.",
  processSteps: [
    {
      step: "1",
      title: "1. Order the Product and Specify the Delivery Method",
      icon: "cart",
    },
    {
      step: "2",
      title: "2. You Will Receive an Order Confirmation Message",
      icon: "phone",
    },
    {
      step: "3",
      title: "3. Wait for Your Order to Arrive",
      icon: "truck",
    },
    {
      step: "4",
      title: "4. Pick up Your Order at The Checkout Area",
      icon: "store",
    },
  ],
  chargeTables: {
    standard: {
      header: "Standard delivery Get it in 1-3 working days",
      rows: [
        { label: "Orders over 3500 TK: Country wide delivery", value: "FREE" },
        { label: "Orders under 3500: Inside Dhaka City", value: "60 TK" },
        { label: "Orders under 3500: Outside Dhaka City", value: "150 TK" },
      ],
    },
    sameDay: {
      header: "Same day delivery Get it in 3-4 hours",
      rows: [
        {
          label: "Order Between 11am-7 pm and Get it on the same day",
          value: "from 200 TK",
        },
      ],
    },
  },
  lastUpdated: "01/06/2025",
  returnHeading: "Exchange or Return of Goods",
  returnIntro:
    "At Unseen Gadget, we prioritize customer satisfaction and strive to ensure a seamless shopping experience. If you are not entirely satisfied with your purchase, we're here to help.",
  returnSections: [
    {
      id: "eligibility",
      heading: "Eligibility for Return",
      items: [
        { term: "Return Window", text: "You may initiate a return within 72 hours of receiving the product." },
        { term: "Condition", text: "The item must be unused, in its original packaging, and in the same condition that you received it." },
        { term: "Proof of Purchase", text: "A valid receipt or proof of purchase is required for all returns." },
      ],
    },
    {
      id: "non-returnable",
      heading: "Non-Returnable Items",
      intro: "Certain items are non-returnable:",
      items: [
        { term: "Perishable Goods", text: "Such as food, flowers, newspapers, or magazines." },
        { term: "Personal Care Items", text: "Including cosmetics, underwear, and sanitary goods." },
        { term: "Customized Products", text: "Items that have been personalized or made to your specifications." },
        { term: "Digital Goods", text: "Downloadable software products." },
        { term: "Health and Safety Items", text: "Hazardous materials or flammable liquids and gases." },
      ],
    },
    {
      id: "return-process",
      heading: "Return Process",
      intro: "To initiate a return:",
      isNumbered: true,
      items: [
        { term: "Contact Us", text: "Reach out to our customer service team at +8801714039409 within 72 hours of receiving the product." },
        { term: "Provide Details", text: "Share your order number, reason for return, and any supporting images if applicable." },
        { term: "Return Authorization", text: "Once approved, you'll receive instructions on how to return the item." },
        { term: "Shipping", text: "You are responsible for paying the shipping costs for returning the item." },
      ],
    },
    {
      id: "refunds",
      heading: "Refunds",
      items: [
        { term: "Inspection", text: "Upon receiving your returned item, we will inspect it and notify you of the approval or rejection of your refund." },
        { term: "Processing Time", text: "If approved, your refund will be processed within 7-10 business days." },
        { term: "Method", text: "Refunds will be credited to your original method of payment." },
      ],
    },
    {
      id: "late-refunds",
      heading: "Late or Missing Refunds",
      intro: "If you haven't received a refund:",
      isNumbered: true,
      items: [
        { term: "Check Account", text: "Verify your bank account or payment method." },
        { term: "Contact Provider", text: "Reach out to your credit card company or bank; it may take some time before your refund is officially posted." },
        { term: "Contact Us", text: "If you've done all of this and still have not received your refund, please contact us at +8801714039409." },
      ],
    },
    {
      id: "exchanges",
      heading: "Exchanges",
      intro: "We only replace items if they are defective or damaged. If you need to exchange it for the same item, contact us at +8801714039409.",
    },
  ],
  shippingReturnAddress: {
    companyName: "Unseen Gadget",
    address: "Shop: 84, Block: C, Level: 05, Bashundhara City Shopping Mall, Dhaka",
    phone: "+8801714039409",
    email: "contact@unseengadget.com",
  },
  faqs: [
    {
      q: "My order hasn't arrived yet. Where is it?",
      a: "You can track your order using the consignment ID sent via SMS or check your account dashboard. For live assistance, reach our hotline at +8801714039409.",
    },
    {
      q: "Do you deliver on public holidays?",
      a: "Yes, our delivery partners operate on most public holidays and weekends to ensure timely delivery.",
    },
    {
      q: "Do you deliver to my postcode?",
      a: "We deliver to all 64 districts across Bangladesh via Pathao Courier and RedX priority delivery.",
    },
    {
      q: "Is next-day delivery available on all orders?",
      a: "Next-day delivery is available for all orders placed inside Dhaka and major divisional city centers.",
    },
    {
      q: "Do I need to be there to sign for delivery?",
      a: "Yes, or an authorized representative can receive and inspect the package upon verifying the order OTP or signing the invoice.",
    },
  ],
};

const initialContactContent = {
  type: "contact",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848809462529!2d90.38874607604562!3d23.752766388686156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8bd55555555%3A0x2f607c39050d2cfb!2sBashundhara%20City%20Shopping%20Complex!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd",
  heading: "Visit Our Unseen Gadget Shops in Dhaka, Bashundhara City",
  paragraphs: [
    "Unseen Gadget is Dhaka's most trusted Apple accessories and gadget shop. Visit our showrooms at Bashundhara City Shopping Complex for the best iPhone prices in Bangladesh, genuine MacBooks, iPads, AirPods, Apple Watch and premium accessories — all with official warranty.",
    "Our Bashundhara City gadget shop has two convenient locations — Shop 84 (Block C, Level 4) and Shop 115 (Block D, Level 6), Bashundhara City Shopping Complex, Panthapath, Dhaka. Both showrooms are open 7 days a week.",
    "For corporate/bulk orders and business deals, contact our corporate office at Rampura Banasree, Dhaka. Prefer to shop online? Visit unseengadget.com for fast nationwide delivery across Bangladesh. For support call +8801714039409 or email contact@unseengadget.com",
  ],
  bengaliNote:
    "আমাদের আউটলেটে এসে সরাসরি দেখে শুনে পণ্য কিনতে পারেন — অথবা ঘরে বসেই অনলাইনে অর্ডার করে ক্যাশ অন ডেলিভারিতে দ্রুততম সময়ে পার্সেল রিসিভ করতে পারেন।",
  hotline: {
    phone: "+8801714039409",
    details: "Shipping, Order Status & General Query: contact@unseengadget.com",
  },
  showrooms: [
    {
      name: "Showroom 1 (Main Branch)",
      address: "Shop 84, Block: C, Level: 04, Bashundhara City Shopping Mall, Dhaka",
    },
    {
      name: "Showroom 02",
      address: "Shop 115, Block: D, Level: 06, Bashundhara City Shopping Mall, Dhaka",
    },
  ],
  corporateHq: {
    name: "Corporate HQ",
    address: "House 07, Main Road, Block: H, Banasree, Dhaka",
  },
};

export const getPageBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  let page = await prisma.page.findUnique({ where: { slug } });
  if (!page) {
    const titles: Record<string, string> = {
      warranty: "Warranty Policy",
      shipping: "Shipping & Delivery",
      "delivery-return": "Delivery & Return",
      contact: "Contact Us",
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
      "about-us": "About Us",
      faq: "Frequently Asked Questions",
      shop: "Shop Page",
    };
    const title = titles[slug] || (slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "));
    const initialContent =
      slug === "privacy"
        ? initialPrivacyContent
        : slug === "terms"
        ? initialTermsContent
        : slug === "delivery-return"
        ? initialDeliveryReturnContent
        : slug === "contact"
        ? initialContactContent
        : { type: slug };
    page = await prisma.page.create({
      data: {
        slug,
        title,
        status: "PUBLISHED",
        lastUpdated: new Date(),
        seo: { metaTitle: title, metaDescription: `${title} - Unseen Gadget`, ogImage: "" } as any,
        content: initialContent as any,
        blocks: [],
      },
    });
  } else {
    // Seed initial content if empty or missing sections
    if (slug === "privacy" && (!page.content || !(page.content as any).sections || (page.content as any).sections.length === 0)) {
      page = await prisma.page.update({
        where: { slug: "privacy" },
        data: {
          content: initialPrivacyContent as any,
          lastUpdated: new Date("2024-08-01"),
        },
      });
    } else if (slug === "terms" && (!page.content || !(page.content as any).sections || (page.content as any).sections.length === 0)) {
      page = await prisma.page.update({
        where: { slug: "terms" },
        data: {
          content: initialTermsContent as any,
          lastUpdated: new Date("2025-06-01"),
        },
      });
    } else if (slug === "delivery-return" && (!page.content || !(page.content as any).returnSections || (page.content as any).returnSections.length === 0)) {
      page = await prisma.page.update({
        where: { slug: "delivery-return" },
        data: {
          content: initialDeliveryReturnContent as any,
          lastUpdated: new Date("2025-06-01"),
        },
      });
    } else if (slug === "contact" && (!page.content || !(page.content as any).showrooms || (page.content as any).showrooms.length === 0)) {
      page = await prisma.page.update({
        where: { slug: "contact" },
        data: {
          content: initialContactContent as any,
        },
      });
    }
  }
  if (page.status !== "PUBLISHED" && !req.adminUser) throw new NotFoundError("Page not found");
  ApiResponseUtil.success(res, page);
});

export const updatePage = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as CmsPageUpdate;
  const slug = req.params.slug;
  const page = await prisma.page.upsert({
    where: { slug },
    create: {
      slug,
      title: body.title || slug,
      description: body.description || null,
      status: (body.status || "PUBLISHED") as any,
      seo: (body.seo || { metaTitle: body.title || slug, metaDescription: "", ogImage: "" }) as any,
      blocks: (body.blocks || []) as any,
      content: (body.content || { type: slug }) as any,
      lastUpdated: body.lastUpdated ? new Date(body.lastUpdated) : new Date(),
    },
    update: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.status !== undefined ? { status: body.status as any } : {}),
      ...(body.seo !== undefined ? { seo: body.seo as any } : {}),
      ...(body.blocks !== undefined ? { blocks: body.blocks as any } : {}),
      ...(body.content !== undefined ? { content: body.content as any } : {}),
      lastUpdated: body.lastUpdated ? new Date(body.lastUpdated) : new Date(),
    },
  });
  ApiResponseUtil.success(res, page, "Page updated");
});

// ---------------- Setting-backed CMS areas ----------------

async function readSetting(key: string): Promise<unknown> {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value ?? null;
}

export const getCmsSetting = (key: string) =>
  asyncHandler(async (_req: Request, res: Response) => {
    const value = await readSetting(key);
    ApiResponseUtil.success(res, value);
  });

export const putCmsSetting = (key: string) =>
  asyncHandler(async (req: Request, res: Response) => {
    const raw = req.validated?.body ?? req.body;
    const value =
      raw && typeof raw === "object" && "value" in (raw as Record<string, unknown>)
        ? (raw as { value: unknown }).value
        : raw;
    if (value === undefined) throw new BadRequestError("value is required");
    const saved = await prisma.setting.upsert({
      where: { key },
      update: { value: value as never },
      create: { key, value: value as never },
    });
    ApiResponseUtil.success(res, saved.value, "Saved");
  });

export const CmsController = {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  listPromotions,
  getPromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
  listJobs,
  getJob,
  getJobApplications,
  createJob,
  updateJob,
  deleteJob,
  listPages,
  getPageBySlug,
  updatePage,
};

export default CmsController;
