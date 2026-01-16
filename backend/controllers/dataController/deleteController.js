// delete controller 
const prisma  = require("../../db/prismaClient.js");

async function handleDeleteUser(req, res, next) {
  try {
    const userId = parseInt(req.user.id, 10);

    // Delete associated profile first due to foreign key constraint
    await prisma.profile.deleteMany({
      where: { userId: userId },
    });

    // Delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    next(error);
  }
};

async function handleDeleteChatRoom(req, res, next) {
  try {
    const roomId = parseInt(req.params.roomId, 10);

    // Delete the chat room
    await prisma.chatRoom.delete({
      where: { id: roomId },
    });

    res.json({ message: "Chat room deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleDeleteUser, handleDeleteChatRoom };
