import jwt from "jsonwebtoken";
import { HttpError } from "./HttpError.js";
import dotenv from "dotenv";
import { AuthUser } from "../models/user.js";

dotenv.config({ path: "./dev.env" });

export const authenticate = async (req, res, next) => {
	const { authorization = "" } = req.headers;
	const [bearer, token] = authorization.split(" ");
	if (bearer !== "Bearer") {
		next(HttpError(401));
	}
	try {
		const { id } = jwt.verify(token, process.env.SECRET_KEY);
		const user = await AuthUser.findById(id);
		if (!user || !user.token || user.token !== token) {
			next(HttpError(204));
		}
		req.user = user;
	} catch {
		next(HttpError(401));
	}
	next();
};
