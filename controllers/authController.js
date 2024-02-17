import { AuthUser } from "../models/user.js";
import { HttpError } from "../helpers/HttpError.js";
import { sendEmail } from "../helpers/SendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Jimp from "jimp";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { BASE_URL } = process.env;

dotenv.config({ path: "./dev.env" });
const avatarDir = path.join(__dirname, "../", "public", "avatars");

export const register = async (req, res) => {
	try {
		const { email, password } = req.body;
		const hashPassword = await bcrypt.hash(password, 10);
		const avatarURL = gravatar.url(req.body.email);
		const verificationCode = nanoid();
		const newUser = await AuthUser.create({ ...req.body, password: hashPassword, avatarURL, verificationCode });
		const verifyEmail = {
			to: email,
			subject: "Veryfy email",
			html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationCode}">Click verify email</a>`,
		};
		await sendEmail(verifyEmail);
		res.status(201).json({
			user: {
				email: newUser.email,
				subscription: newUser.subscription,
			},
		});
	} catch (error) {
		console.log("error:", error);
		const httpError = HttpError(409, error.message);
		res.status(httpError.status).json({ error: "Email is use" });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await AuthUser.findOne({ email });
		if (!user) {
			throw HttpError(401, "Email or password invalid");
		}

		const passwordCompare = await bcrypt.compare(password, user.password);
		if (!passwordCompare) {
			throw HttpError(401, "Email or password invalid");
		}

		const payload = {
			id: user._id,
		};
		const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "23h" });
		await AuthUser.findByIdAndUpdate(user._id, { token });
		res.json({
			token,
			user: {
				email: user.email,
				subscription: user.subscription,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
	}
};

export const getCurrent = async (req, res) => {
	const { email, subscription } = req.user;

	res.json({
		email,
		subscription,
	});
};

export const logout = async (req, res) => {
	const { _id } = req.user;
	await AuthUser.findByIdAndUpdate(_id, { token: null });

	res.status(204).end();
};

export const updateAvatar = async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: "Please provide a file" });
	}
	const { _id } = req.user;
	const { path: tempUpload, originalname } = req.file;

	const image = await Jimp.read(tempUpload);
	image.resize(250, 250).write(tempUpload);

	const fileName = `${_id}_${originalname}`;
	const resultUpload = path.join(avatarDir, fileName);

	await fs.rename(tempUpload, resultUpload);
	const avatarURL = path.join("avatars", fileName);

	await AuthUser.findByIdAndUpdate(_id, { avatarURL });

	res.json({
		avatarURL,
	});
};
