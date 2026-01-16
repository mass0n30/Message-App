// viewController
const prisma  = require("../db/prismaClient.js");



async function getUserData(req, res, next) {

  try {
    const userId = parseInt(req.user.id, 10);
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        alias: true,
        fname: true,
        lname: true,
        email: true,
        profile: true,
        friendsOf: true,
        userFriendships: true,
    }
  });
    return userData;
  } catch (error) {
    next(error);
  }
};

async function getAllData(req, res, next) {
  try {
      const [users, chatRooms, userData] = await Promise.all([
        getUsers(req, res, next),
        getChatRooms(req, res, next),
        getUserData(req, res, next)
      ]);
      return { users, chatRooms, userData };
      
  } catch (error) {
    next(error);
  }
};

async function getUsers(req, res, next) {
  try {
  const users = await prisma.user.findMany({
    select: {
        id: true,
        alias: true,
        fname: true,
        lname: true,
        email: true,
        profile: true,
        friendsOf: true,
        userFriendships: true,
    },
  });

    return users;
  } catch (error) {
    next(error);
  }
};

async function getChatRooms(req, res, next) {
  try {
    const chatRooms = await prisma.chatRoom.findMany();
    return chatRooms;
  } catch (error) {
    next(error);
  }
};

async function getChatRoom(req, res,next) {
  try {
    const chatId = parseInt(req.params.chatRoomId);
    const chatRoom = await prisma.chatRoom.findUnique({
      where: {id: chatId},
      include: {
        messages: {
          include: {
            user: {
              select: {
                id: true,
                alias: true,
                fname: true,
    }}}}}});
    return chatRoom;
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllData, getUserData, getChatRooms, getUsers, getChatRoom };
