import * as nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { EMAIL_PASS, EMAIL_USER, TO_USER } = process.env;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const emailConfig = {
	host: "smtp.meta.ua",
	port: 465,
	secure: true,
	auth: {
		user: EMAIL_USER,
		pass: EMAIL_PASS,
	},
};

const transport = nodemailer.createTransport(emailConfig);

const email = {
	to: TO_USER,
	from: EMAIL_USER,
	subject: "Test email",
	html: "<h1>Hello!</h1>",
};

export const sendEmail = async data => {
	const email = { ...data, from: EMAIL_USER };
	await transport.sendMail(email);
	return true;
};
