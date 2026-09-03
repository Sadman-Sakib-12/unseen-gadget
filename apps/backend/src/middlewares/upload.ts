import multer from "multer";
import { BadRequestError } from "../utils/errors";

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export const uploadImageMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new BadRequestError("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

export default uploadImageMiddleware;