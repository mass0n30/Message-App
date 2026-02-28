// update controller 
const prisma  = require("../../db/prismaClient.js");


async function handleUpdateProfile(req, res, next) {
  try {
    const userId = Number(req.user.id);
    const { alias, email, status, bio } = req.body;


    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        alias,
        email,
        profile: {
          upsert: {
            update: { status: status, bio },
            create: { status: status, bio },
          },
        },
      },
      select: {
        id: true,
        email: true,
        alias: true,
        profile: {
          select: {
            status: true,
            bio: true,
            avatarUrl: true,
          },
        },
      },
    });

    return updatedUser;
  } catch (err) {
    return next(err);
  }
};

const {getUserData} = require('../../controllers/viewController.js');

async function handleUpdateAvatar(req, res, next, url) {
  try {
    const userId = Number(req.user.id);
    await prisma.profile.update({
      where: { userId: userId },
      data: { avatarUrl: url }
    });

    const updatedProfile = await getUserData(req, res, next);

    return updatedProfile;
  } catch (err) {
    return next(err);
  }
};

async function handleAddFriend(req, res, next) {
  try {
    const userId = parseInt(req.user.id, 10);
    const friendId = parseInt(req.params.friendId, 10);

    // Check if the friendship already exists
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });


    // if the friendship exists, unfriend
    if (existingFriendship) {
      await prisma.friendship.delete({
        where: { id: existingFriendship.id },
      });
      return false;
    }

    // Create the friendship
    await prisma.friendship.create({
      data: {
        userId: userId,
        friendId: friendId,
      },
    });

    return true;
  } catch (error) {
    console.log(error, "prisma err");
    next(error);
  }
};

const { getDirectMessageChatMessages } = require('../../controllers/viewController.js');

async function handleUpdateMessageStatus(req, res, next) {
  try {
    const friendId  = req.params.friendId;
    console.log(friendId, "friendId in update message status");
    const userId = parseInt(req.user.id, 10);

    await prisma.messages.updateMany({
      where: {
        senderId: parseInt(friendId, 10),
        receiverId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    const updatedUser = await getUserData(req, res, next);

    const currentViewedMessages = await getDirectMessageChatMessages(req, res, next, friendId);

    return {
      updatedFriends: updatedUser.userFriendships,
      updatedMessages: updatedUser.receivedMessages,
      currentViewedMessages
    };
  } catch (err) {
    return next(err);
  }
}

module.exports = { handleUpdateProfile, handleAddFriend, handleUpdateAvatar, handleUpdateMessageStatus };

