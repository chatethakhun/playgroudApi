import User from "../models/User.js";
import Message from "../models/Message.js";

const unseenMessages = {};
export const getUsersWithUnseenMessages = async (userId) => {
  const users = await User.find({ _id: { $ne: userId } }).select("-password");
  const promise = users.map(async (user) => {
    const messages = await Message.find({
      senderId: user._id,
      receiverId: userId,
      seen: false,
    }).sort({ createdAt: -1 });
    if (messages.length > 0) {
      unseenMessages[user._id] = {
        unreadMessages: messages.length,
        lastMessage: messages[0],
      };
    }
  });

  await Promise.all(promise);
  return { users, unseenMessages };
};
