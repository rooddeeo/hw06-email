import { model, Schema } from "mongoose";
import Joi from "joi";

export const registerSchema = Joi.object({
	email: Joi.string().required(),
	password: Joi.string().min(3).required(),
}).options({ abortEarly: false });

export const verifyEmailSchema = Joi.object({
	email: Joi.string().required(),
});

export const loginSchema = Joi.object({
	email: Joi.string().required(),
	password: Joi.string().min(3).required(),
}).options({ abortEarly: false });

const userAuthSchema = new Schema({
	password: {
		type: String,
		required: [true, "Password is required"],
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
	},
	subscription: {
		type: String,
		enum: ["starter", "pro", "business"],
		default: "starter",
	},
	token: {
		type: String,
		default: null,
	},
	avatarURL: {
		type: String,
		required: true,
	},
	verify: {
		type: Boolean,
		default: false,
	},
	verificationCode: {
		type: String,
		default: "",
	},
});

const AuthUser = model("AuthUser", userAuthSchema);

export { AuthUser };
