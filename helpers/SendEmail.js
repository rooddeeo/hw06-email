import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { META_PASS, META_USER, TO_USER } = process.env;
console.log("META_USER:", META_USER);

const emailConfig = {
	host: "smtp.meta.ua",
	port: 465,
	secure: true,
	auth: {
		user: META_USER,
		pass: META_PASS,
	},
};

const transport = nodemailer.createTransport(emailConfig);

const email = {
	to: TO_USER,
	from: META_USER,
	subject: "Test email",
	html: "<h1>Hello!</h1>",
};

export const sendEmail = transport
	.sendMail(email)
	.then(() => console.log("Email send success"))
	.catch(error => console.log(error.messange));
