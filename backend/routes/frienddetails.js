const friendDetailsRouter = require('express').Router();
const {getSelectedUserData} = require('../controllers/viewController');
const { handleAddFriend} = require('../controllers/dataController/updateController');  
const {handleCreateMessageDirect} = require('../controllers/dataController/createController');
// viewing user details + friendship status (view users info if friend)
friendDetailsRouter.get('/:friendId', async (req, res, next) => {
  try {
    const friendData = await getSelectedUserData(req, res, next);
    return res.json(friendData);
  } catch (error) {
    next(error);
  }
});

friendDetailsRouter.post('/:friendId', async (req, res, next) => {
  try {
   const friendshipStatus = await handleAddFriend(req, res, next);
    if (!(friendshipStatus)) {
     return res.status(201).json({message: "removed from friends"});
    } else {
     return res.status(201).json({message: "added to friends"});   
    }

  } catch (error) {
    next(error);
  }
}); 

/* websocket implementation needed for realtime chatting */
friendDetailsRouter.post('/chats/private/:friendId', async (req, res, next) => {
  try {
    const updatedMessages = await handleCreateMessageDirect(req, res, next);
    return updatedMessages;
  } catch (error) {
    next(error);
  }
});

const {handleUpdateMessageStatus} = require('../controllers/dataController/updateController.js');

friendDetailsRouter.put('/chats/read/:friendId', async (req, res, next) => {
  try {
    const updatedMessages = await handleUpdateMessageStatus(req, res, next);
    return res.json(updatedMessages);
  } catch (error) {
    next(error);
  }
});

module.exports = {friendDetailsRouter};