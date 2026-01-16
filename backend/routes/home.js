const { Router } = require("express");
const homeRouter = Router();
var jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const passport = require('passport');
const { getData } = require('../controllers/viewController');
require('../config/passport');
const { getAllData } = require("../controllers/viewController");

homeRouter.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next ) => {

  const allData = await getAllData(req, res, next);

  // req.user from passport callback authentication
  res.json({
    allData: allData,
   // data: orderedData
  });
});



module.exports = {homeRouter}