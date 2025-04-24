import path from "path";
import multer from "multer";
import { v4 as uuid } from "uuid";

const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
    storage: multer.diskStorage({
        destination: "uploads/",
        filename: (_req, file, cb) => {
            const uniqueName = `${uuid()}${path.extname(file.originalname)}`;
            cb(null, uniqueName);
        },
    }),
    fileFilter: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
            cb(new Error(`Unsupported file type: ${ext}`), false);
            return;
        }
        cb(null, true);
    },
});

export default upload;
