import Message from "../models/Message.js";
import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { password, userId } = req.body;

    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(400).json({ error: "Please login" });
    }

    if (currentUser.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true },
    );

    res
      .status(200)
      .json({ message: "Password changed successfully", user: updatedUser });
  } catch (error) {
    console.log(`error from changePassword: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(`error from getUser: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};
