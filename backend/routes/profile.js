const { Router } = require("express");
const {handleUpdateProfile} = require('../controllers/dataController/updateController');  
const {handleDeleteProfile} = require('../controllers/dataController/deleteController');


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

// route for avatar ?


profileRouter.delete('/', async (req, res, next ) => {
  try {
    await handleDeleteProfile(req, res, next);
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = {profileRouter};
