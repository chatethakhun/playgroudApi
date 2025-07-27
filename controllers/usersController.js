import Message from "../models/Message.js";
import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    // find all users and filter me current user
    console.log({ req: req });
    const userId = req.user._id;
    const unseenMessages = {};
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
    res.status(200).json({ users, unseenMessages });
  } catch (error) {
    console.log(`error from getUsers: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};
