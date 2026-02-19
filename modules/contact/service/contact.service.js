import ContactMessage from "../model/contact.model.js";
import { ApiError } from "../../../utils/ApiError.js";

export const createContactMessage = async (data) => {
  const { name, email, phone, subject, message } = data;

  if (!name || !email || !phone || !subject || !message) {
    throw new ApiError(400, "All fields are required");
  }

  return await ContactMessage.create({
    name,
    email,
    phone,
    subject,
    message,
  });
};

export const getAllContactMessages = async () => {
  return await ContactMessage.find()
    .sort({ createdAt: -1 });
};

export const getContactMessageById = async (id) => {
  const message = await ContactMessage.findById(id);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  return message;
};

export const deleteContactMessage = async (id) => {
  const message = await ContactMessage.findById(id);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  await message.deleteOne();

  return true;
};