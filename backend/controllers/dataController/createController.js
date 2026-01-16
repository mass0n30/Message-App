// create controller 
const prisma  = require("../../db/prismaClient.js");
const { validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");


async function handleCreateUser(req, res, next) {
  const errors = validationResult(req);
     if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  };

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({
      data: {
        email: req.body.username,
        fname: req.body.firstname,
        lname: req.body.lastname,
        alias: req.body.alias,
        password: hashedPassword,
      }
   });

   await prisma.profile.create({
    data: {
      userId: user.id
    }
   });
   
  return res.status(201).json({ message: "Account Created Successfully" });

  } catch (error) {
    return res.status(400).json({ errors:error });
  }
};

async function handleCreateMessage(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  };

  try {
    const { content } = req.body;
    await prisma.chatMessage.create({
      data: {
        content: content,
      }
   });
  return res.status(201).json({ content: req.body.content, message: "Message Created Successfully" });

  } catch (error) {
    return res.status(400).json({ errors:error });
  }
};

async function handleCreateChatRoom(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });

  }

  try {
    const { roomName } = req.body;
    console.log(roomName);
    await prisma.chatRoom.create({
      data: {
        ownerId: 1, // parseInt(req.user.id, 10)
        name: roomName,
      }
   });
  return res.status(201).json({ message: "Chat Room Created Successfully" });

  } catch (error) {
    return res.status(400).json({ errors:error });
  }
};

async function handleCreateChatMessage(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = 1 // parseInt(req.user.id, 10);
    const chatRoomId = parseInt(req.params.chatRoomId, 10);
    const { content } = req.body;

    const newMessage = await prisma.chatMessage.create({
      data: {
        content: content,
        senderId: userId,
        chatRoomId: chatRoomId
      },
    });

    res.status(201).json({ message: "Message sent successfully", content: newMessage.content });
  } catch (error) {
    next(error);
  }
}


module.exports = { handleCreateUser, handleCreateMessage, handleCreateChatRoom, handleCreateChatMessage };