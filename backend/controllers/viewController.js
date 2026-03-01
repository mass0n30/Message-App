// viewController
const prisma  = require("../db/prismaClient.js");



// userFriendships select for message directs and friends list
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

        userFriendships: {
          select: {
            id: true,
            friendId: true,
            friendsOf: {
              select: {
                id: true,
                alias: true,
                fname: true,
                lname: true,
                email: true,
                profile: true,
                sentMessages: {
                  where: {
                    receiverId: userId
                  },
                  select: {
                    id: true,
                    content: true,
                    timestamp: true,
                    read: true,
                    sender: {
                      select: {
                        id: true,
                        alias: true,
                        fname: true,
                        lname: true,
                        email: true,
                        profile: true,
                      }
                    },
                  }
                },
              }
            }
          }
        },
        receivedMessages: {
          select: {
            id: true,
            content: true,
            timestamp: true,
            read: true,
            sender: {
              select: {
                id: true,
                alias: true,
                fname: true,
                lname: true,
                email: true,
                profile: true,
              }
            }
          }
        }
      }
  });
    return userData;
  } catch (error) {
    next(error);
  }
};

const {checkFriendshipStatus} =  require('../db/queries.js');

async function getSelectedUserData(req, res, next) {
  try {
    const userId = parseInt(req.params.friendId, 10);
    const friendshipStatus = await checkFriendshipStatus(req.user.id, userId);
    const friendData = await prisma.user.findUnique({
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
    return { friendData, friendshipStatus };
  } catch (error) {
    next(error);
  }
}

async function getAllData(req, res, next) {
  try {
      const [users, chatRooms ] = await Promise.all([
        getUsers(req, res, next),
        getChatRooms(req, res, next),
      ]);
      return { users, chatRooms };
      
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
    const chatRooms = await prisma.chatRoom.findMany({
        include: {
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  alias: true,
                  fname: true,
                  lname: true,
                  profile: true,
                }
              }
            }
          }
        }
      }
    );
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
            sender: {
              select: {
                id: true,
                alias: true,
                fname: true,
                lname: true,
                profile: true,
              }
            }
          }
        }
      }
    });
    return chatRoom;
  } catch (error) {
    next(error);
  }
};

async function getDirectMessageChatMessages(req, res, next, friendId) {

  try {
    const userId = parseInt(req.user.id, 10);
    const directMessageChats = await prisma.messages.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: parseInt(friendId, 10)
          },
          {
            senderId: parseInt(friendId, 10),
            receiverId: userId
          }
        ],
      },
      select: {
        id: true,
        content: true,
        timestamp: true,
        read: true,
        sender: {
          select: {
            id: true,
            alias: true,
            profile: true,
          }
        },
        receiver: {
          select: {
            id: true,
            alias: true,
            profile: true,
          }
        }
      },
      orderBy: {
        timestamp: 'asc'
      },
    });
    return directMessageChats;
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllData, getUserData, getSelectedUserData ,getChatRooms, getUsers, getChatRoom, getDirectMessageChatMessages };
