const Message = require('../models/Message');

async function getMessageByObjectId(messageId) {
  try {
    return Message.findOne({ _id: messageId });
  } catch (error) {
    throw new Error(`Failed to get Message: ${error}`);
  }
}

async function createNewMessage(messageParams) {
  try {
    const newMessage = new Message(messageParams);
    await newMessage.save();
    return newMessage;
  } catch (error) {
    throw new Error(`Failed to create new Message: ${error}`);
  }
}

module.exports = {
  getMessageByObjectId,
  createNewMessage,
};
