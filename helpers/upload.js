import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tempDir = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
	destination: tempDir,
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

export const upload = multer({
	storage: multerConfig,
});
