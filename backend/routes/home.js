const { Router } = require("express");
const homeRouter = Router();
var jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const passport = require('passport');
const { getData } = require('../controllers/viewController');
require('../config/passport');
const { getAllData, getUserData } = require("../controllers/viewController");

homeRouter.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next ) => {

  const [allData, userData] = await Promise.all([
    getAllData(req, res, next),
    getUserData(req, res, next)
  ]);

  res.json({
    allData: allData,
    userData: userData
  });
});

homeRouter.get('/guest', async (req, res, next) => {

  const allData = await getAllData(req, res, next);
  const guest = true;

  res.json({
    allData: allData,
    guest: guest
  });
});



module.exports = {homeRouter}