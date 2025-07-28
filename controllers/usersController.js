import Message from "../models/Message.js";
import User from "../models/User.js";
import { getUsersWithUnseenMessages } from "../utils/users.js";

export const getUsers = async (req, res) => {
  try {
    // find all users and filter me current user
    const userId = req.user._id;
    const { users, unseenMessages } = await getUsersWithUnseenMessages(userId);
    res.status(200).json({ users, unseenMessages });
  } catch (error) {
    console.log(`error from getUsers: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};
