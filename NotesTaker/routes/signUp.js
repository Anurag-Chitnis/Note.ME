const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../model/User');
const bcrypt = require('bcryptjs');

//@route  - /signUp
//@access - PUBLIC
//@method - GET
//@desc   - This is for Login route
router.get('/', (req,res) => {
    res.render("signUp");
});

//@route  - /signUp
//@access - PUBLIC
//@method - POST
//@desc   - This is for Registration
router.post('/', (req,res) => {
    const {username, email, password, confirm_password} = req.body;
    const err = [];
    User.findOne({username: username})
        .then(user => {
            if(user) {
                return res.json({err: 'User Already Exists'});
            }else {
                
                //All fiedls are empty
                if(username == "" || email == "" || password == "" || confirm_password == "") {
                    err.push("Please enter all the fields");
                }
                //Password Length Too Small
                if(password.length < 8) {
                    err.push("Password length too small");
                }
                //Passwords Do Not Match
                if(password !== confirm_password) {
                    err.push("Passwords Do Not Match");
                }
                //If data is validated then
                if(err.length !== 0) {
                    console.log(err);
                    return res.json({err: "There are some errors"});
                }else {
                    const newUser = new User({
                        username,
                        email,
                        password,
                        confirm_password,
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        if(err) throw err;
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(success => {
                                    res.redirect("signIn")
                                })
                                .catch(err => console.log(err))
                        })
                    })
                }

            }
        })
        .catch(err => console.log(err))
});

module.exports = router;