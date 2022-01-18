const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "dsdfde$dd";

// Route1: create user using: post "/api/auth/createuser". no logi
router.post('/createuser',[
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Please enter valid email only").isEmail(),
    body('password', "password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false
    // If there are errors , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    // check wether the user with this email exits already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  });

// Route2: Authenticate a user using: post "/api/auth/login". no login required
router.post('/login',[
    body('email', "Please enter valid email only").isEmail(),
  body('password', "Password can not be blank").exists(),
],async (req, res) => {
    // If there are errors , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email, password} = req.body;
    try {
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error: "Please try to login with valid credentials "});
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        let success = false
        return res.status(400).json({success, error: "Please try to login with valid credentials "});
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true
      res.json({success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  });

  // Route3: Get loggedin user details using: post "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }

})  
module.exports = router;
