const { Router } = require("express");
const {handleUpdateProfile, handleUpdateAvatar} = require('../controllers/dataController/updateController');  
const {handleDeleteProfile} = require('../controllers/dataController/deleteController');
const multer =  require('multer');
const { handleUploadFile } = require("../controllers/dataController/createController");
const upload = multer({ dest: 'uploads/' });

const profileRouter = Router();

profileRouter.get('/', async (req, res, next ) => {

  res.json({profileData: req.user.profile });
});

profileRouter.post('/', async (req, res, next ) => {
  try {
    const updatedProfile = await handleUpdateProfile(req, res, next);
    return res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
}); 

profileRouter.post('/avatar', upload.single('avatar'), async (req, res, next ) => {
  try {
    const avatarUrl = await handleUploadFile(req, res, next);
    const updatedProfile = await handleUpdateAvatar(req, res, next, avatarUrl.url);
    return res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
});

profileRouter.delete('/', async (req, res, next ) => {
  try {
    await handleDeleteProfile(req, res, next);
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = {profileRouter};
