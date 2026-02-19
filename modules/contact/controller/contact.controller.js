import {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  deleteContactMessage
} from "../service/contact.service.js";

export const createContactMessageController = async (req, res, next) => {
  try {
    const message = await createContactMessage(req.body);
    res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllContactMessagesController = async (req, res, next) => {
  try {
    const messages = await getAllContactMessages();
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};

export const getContactMessageByIdController = async (req, res, next) => {
  try {
    const message = await getContactMessageById(req.params.id);
    res.status(200).json(message);
  } catch (err) {
    next(err);
  }
};

export const deleteContactMessageController = async (req, res, next) => {
  try {
    await deleteContactMessage(req.params.id);
    res.status(200).json({
      message: "Contact message deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};