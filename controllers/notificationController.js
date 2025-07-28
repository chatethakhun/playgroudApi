import Notification from "../models/Notification.js";

const getNotifications = async (req, res) => {
  const userId = req.user.id;

  const notifications = await Notification.find({ userId });
  res.status(200).json({ notifications });
};

const markReadNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: notificationId } = req.params;

    await Notification.updateOne(
      { _id: notificationId, userId },
      { $set: { read: true } },
    );

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export { getNotifications, markReadNotification };
