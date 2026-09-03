import fs from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";

export interface UploadResult {
  url: string;
  publicId: string | null;
}

function cloudinaryConfigured(): boolean {
  return Boolean(
    env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET,
  );
}

export async function uploadImage(
  buffer: Buffer,
  originalname: string,
): Promise<UploadResult> {
  if (cloudinaryConfigured()) {
    try {
      cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
      });

      const result = await new Promise<{ secure_url: string; public_id: string }>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "unseen-gadget/products", resource_type: "image" },
            (error, result) => {
              if (error || !result) {
                reject(error ?? new Error("Upload failed"));
                return;
              }
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
            },
          );
          stream.end(buffer);
        },
      );

      return { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
      console.warn("Cloudinary upload failed, falling back to local file storage:", error);
    }
  }

  const uploadsDir = path.resolve(process.cwd(), "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const ext = path.extname(originalname) || ".jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
  await fs.writeFile(path.join(uploadsDir, filename), buffer);

  return { url: `${env.API_URL}/uploads/${filename}`, publicId: null };
}

export const UploadService = { uploadImage };

export default UploadService;