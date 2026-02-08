const Router = require("express");
const chatRouter = Router();
const passport = require("passport");
const {validateCreateChatRoom, validateCreateMessage} = require('../controllers/validation'); 

const {handleCreateChatRoom, handleCreateChatMessage } = require('../controllers/dataController/createController');
const {getChatRoom, getChatMessages} = require('../controllers/viewController');

chatRouter.post('/', passport.authenticate('jwt', { session: false }), validateCreateChatRoom(), handleCreateChatRoom);

chatRouter.get('/:chatRoomId', async (req, res, next ) => {

  try {
    const chatRoomData = await getChatRoom(req, res, next);
    return res.json(chatRoomData);
  } catch (error) {
    res.status(400).json({ errors:error });
  }
});

chatRouter.post('/:chatRoomId/message', passport.authenticate('jwt', { session: false }), validateCreateMessage(), handleCreateChatMessage);

module.exports = {chatRouter};