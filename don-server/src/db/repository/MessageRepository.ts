import { DBMessage } from '../models/Message';

async function getMessageByObjectId(messageId) {
  try {
    return DBMessage.findOne({ _id: messageId }).exec();
  } catch (error) {
    throw new Error(`Failed to get Message: ${error}`);
  }
}

async function createNewMessage(messageParams) {
  try {
    const newMessage = new DBMessage(messageParams);
    return newMessage.save();
  } catch (error) {
    throw new Error(`Failed to create new Message: ${error}`);
  }
}

export { getMessageByObjectId, createNewMessage };
