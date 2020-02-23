const express = require('express');
const router = express.Router();
const passport = require('passport');

//@route  - /signIn
//@access - PUBLIC
//@method - GET
//@desc   - This is for Login route
router.get('/', (req,res) => {
    res.render("signIn");
})
//@route  - /signIn
//@access - PUBLIC
//@method - GET
//@desc   - This is for Login route
router.post("/", (req,res,next) => {
    passport.authenticate('local', 
    {failureRedirect: '/signIn',
    successRedirect: '/dashboard',
    })(req,res,next);
})

module.exports = router;