import {
	listContacts,
	getContactById,
	addContact,
	removeContact,
	contactUpdate,
	updateContactStatus,
} from "../services/contactsServices.js";
import { createContactSchema, updateContactSchema, updateStatusContactSchema } from "../models/contactModel.js";
import { HttpError } from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
	try {
		const contacts = await listContacts(req);
		res.status(200).json(contacts);
	} catch (error) {
		console.log(error);
		const httpError = HttpError(500, "Internal Server Error");
		res.status(httpError.status).json({ error: httpError.message });
	}
};

export const getOneContact = async (req, res) => {
	try {
		const { id } = req.params;
		const { _id: owner } = req.user;
		const contact = await getContactById(id, owner);
		if (!contact) {
			return res.status(404).json({ messange: "Not Found" });
		}
		res.json(contact);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

export const createContact = async (req, res) => {
	try {
		const { value, error } = createContactSchema(req.body);
		if (error) {
			const httpError = HttpError(400, error.message);
			res.status(httpError.status).json({ error: httpError.message });
			return;
		}
		const { name, email, phone, favorite } = value;
		const { _id: owner } = req.user;
		const newContact = await addContact({ name, email, phone, favorite, owner });
		res.status(201).json(newContact);
	} catch (error) {
		const httpError = HttpError(500, error.message);
		res.status(httpError.status).json({ error: httpError.message });
	}
};

export const deleteContact = async (req, res) => {
	try {
		const { id } = req.params;
		const { _id: owner } = req.user;
		const deleteContact = await removeContact(id, owner);
		if (!deleteContact) {
			return res.status(404).json({ messange: "Not Found" });
		}
		res.json(deleteContact);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

export const updateContact = async (req, res) => {
	try {
		if (Object.keys(req.body).length === 0) {
			return res.status(400).json({ messange: "Body must have at least one field" });
		}
		const { error } = updateContactSchema(req.body);
		if (error) {
			throw HttpError(400, error.message);
		}
		const { id } = req.params;
		const { _id: owner } = req.user;
		const result = await contactUpdate(id, owner, req.body);
		res.status(200).json(result);
	} catch (error) {
		const httpError = HttpError(400, error.message);
		res.status(httpError.status).json({ error: httpError.message });
	}
};

export const updateStatusContact = async (req, res) => {
	try {
		const { error } = updateStatusContactSchema(req.body);
		if (error) {
			throw HttpError(400, error.message);
		}
		const { id } = req.params;
		const { _id: owner } = req.user;
		const result = await updateContactStatus(id, owner, req.body);
		if (Object.keys(req.body).length === 0) {
			return res.status(400).json({ messange: "Body must have at least one field" });
		}
		res.status(200).json(result);
	} catch (error) {
		const httpError = HttpError(400, error.message);
		res.status(httpError.status).json({ error: httpError.message });
	}
};
