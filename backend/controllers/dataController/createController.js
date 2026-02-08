// create controller 
const prisma  = require("../../db/prismaClient.js");
const { validationResult } = require("express-validator");
const { getCloudinaryObj } = require("../../config/cloud.js");

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

const { getAllData } = require("../viewController.js");

async function handleCreateChatRoom(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });

  }

  try {
    const { roomName } = req.body;
    console.log(roomName);
    const chatRoom = await prisma.chatRoom.create({
      data: {
        ownerId: 1, // parseInt(req.user.id, 10)
        name: roomName,
      }
   });

   const allData = await getAllData(req, res, next);

  return res.status(201).json({ message: "Chat Room Created Successfully", allData: allData, chatRoom: chatRoom });

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
    const userId = parseInt(req.body.userId, 10);
    const chatRoomId = parseInt(req.body.roomId, 10);
    const { content } = req.body;

    const newMessage = await prisma.chatMessage.create({
      data: {
        chatRoomId: chatRoomId,
        content: content,
        senderId: userId,
        chatRoomId: chatRoomId
      },
    });

    const updatedChatRoom = await prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: {
        messages: {
          include: {
            sender: true,
          },
        },
      },
    });
    res.status(201).json({ updatedChatRoom, message: "Message sent successfully", content: newMessage.content });
  } catch (error) {
    next(error);
  }
}

async function handleCreateMessageDirect(req, res, next) {
  try {
    const { content } = req.body;
    await prisma.messages.create({
      data: {
        receiverId: parseInt(req.params.friendId),
        senderId: parseInt(req.user.id),
        content: content,
      }
  });

  return res.status(201).json({ message: "Message Sent" });

  } catch (error) {
    return res.status(400).json({ errors:error });
  }
};

async function handleUploadFile(req, res, next) {

  if (req.file == undefined) {
    const err = new Error("No attached file");
    err.status = 400;
    return next(err);
  }

  const filePath = req.file.path;

  console.log(req.file);
  
  try {
    const cloudFileObj = await getCloudinaryObj(filePath);
    console.log(cloudFileObj);

    // ( 1/1/25 Format Formula Conversion)

   return { url: cloudFileObj.url, message: "Avatar uploaded successfully" };

    
  } catch (error) {
    console.error(error);
    // goes to error middleware
    next(error);
  }
};


module.exports = { handleCreateUser, handleCreateChatRoom, handleCreateChatMessage, handleCreateMessageDirect, handleUploadFile };