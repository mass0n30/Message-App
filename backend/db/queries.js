const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

async function checkEmail(value) {

  const user = await prisma.user.findUnique({
    where: {
      email: value,
    },
  });

  if (user) {
    return true;
  } else {
    return false;
  }
};

async function checkUser(id) {
  
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (user) {
    return user;
  } else {
    throw new Error("No found user.");
  }
};

async function checkUserByEmail(value) {

  const user = await prisma.user.findUnique({
    where: {
      email: value,
    },
  });

  if (user) {
    return user;
  } else {
    throw new Error("No found user.");
  }
};

async function checkFriendshipStatus(userId, friendId) {
  const friendship = await prisma.friendship.findFirst({
    where: {
      userId: userId,
      friendId: friendId,
    },
  });

  if (friendship) {
    return true;
  } else {
    return false;
  }
};


module.exports = {
  checkEmail,
  checkUser,
  checkUserByEmail,
  checkFriendshipStatus
}