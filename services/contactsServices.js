import { Contact } from "../models/contactModel.js";

export const listContacts = async req => {
	const { _id: owner } = req.user;
	const { page = 1, limit = 10 } = req.query;
	const skip = (page - 1) * limit;
	const readFileContacts = await Contact.find({ owner })
		.skip(skip)
		.limit(limit)
		.populate("owner", "-_id email subscription");

	return readFileContacts;
};

export const getContactById = async (contactId, owner) => {
	const readFileContacts = await Contact.findOne({ _id: contactId, owner });
	return readFileContacts;
};

export const addContact = async data => {
	const readFileContacts = await Contact.create(data);
	return readFileContacts;
};

export const removeContact = async (contactId, owner) => {
	const readFileContacts = await Contact.findOneAndDelete({ _id: contactId, owner });
	return readFileContacts;
};

export const contactUpdate = async (contactId, owner, data) => {
	const readFileContacts = await Contact.findOneAndUpdate({ _id: contactId, owner }, data, { new: true });
	return readFileContacts;
};

export const updateContactStatus = async (contactId, owner, data) => {
	const readFileContacts = await Contact.findOneAndUpdate({ _id: contactId, owner }, data, { new: true });
	return readFileContacts;
};
