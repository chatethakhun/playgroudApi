import WS_EVENT from "../constant/wsEvent.js";
import cloudinary from "../libs/cloudinary.js";
import Message from "../models/Message.js";
import { io, userSocketMap } from "../server.js";
import { getUsersWithUnseenMessages } from "../utils/users.js";
// get all Messages for a user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user.id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true },
    );

    res.status(200).json({ messages });
  } catch (error) {
    console.log(`error from getMessage ${error}`);
    res.status(500).json({ message: "Error getting messages" });
  }
};

// mark message as seen
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findOneAndUpdate(id, { seen: true });

    res.status(200).json({ message: "Message marked as seen" });
  } catch (error) {
    console.log(`error from markMessageAsSeen ${error}`);
    res.status(500).json({ message: "Error marking message as seen" });
  }
};

// send message to selected User
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const senderId = req.user.id;
    const receiverId = req.params.id;

    let imageUrl;
    if (!!image) {
      const uploadImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadImage.secure_url;
    }

    const message = await Message.create({
      text,
      senderId,
      receiverId,
      image: imageUrl,
    });

    // // emit message to receiver
    const recieverSocketId = userSocketMap[receiverId];
    if (recieverSocketId)
      io.to(recieverSocketId).emit(WS_EVENT.NEW_MESSAGE, message);

    // emit message to user in socket for update chat list
    Object.values(userSocketMap).forEach(async (socketId) => {
      const userId = Object.keys(userSocketMap).find(
        (key) => userSocketMap[key] === socketId,
      );

      const { users, unseenMessages } =
        await getUsersWithUnseenMessages(userId);

      io.to(socketId).emit(WS_EVENT.CHAT_LIST_UPDATE, {
        users,
        unseenMessages,
      });
    });

    res.status(200).json({ message: "Message sent", message });
  } catch (error) {
    console.log(`error from sendMessage ${error}`);
    res.status(500).json({ message: "Error sending message" });
  }
};
