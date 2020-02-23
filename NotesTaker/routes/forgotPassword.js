const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');

//@access - PUBLIC
//@method - GET
//@desc   - This is for Retrive Password Page
router.get('/', (req,res) => {
    res.render("forgotPassword")
})
//@route  - /forgot/password
//@access - PUBLIC
//@method - POST
//@desc   - This is for Retrive Password Page
router.post('/', (req,res) => {
    console.log(req.body);
    User.findOne({username: req.body.username})
        .then(user => {
            if(user) {
                if(req.body.password == req.body.confirm_password) {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(req.body.password, salt, (err,hash) => {
                            user.password = hash;
                            user
                                .save()
                                .then(success => {
                                    if(success) {
                                        res.redirect('/signIn');
                                    }
                                })
                                .catch(err => console.log(err))
                        })
                    })
                }else {
                    console.log("Incorrect Pass")
                }
            }
        })
        .catch(err => console.log(err))
})



module.exports = router;