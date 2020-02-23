const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const User = require('../model/User');
const Idea = require('../model/Idea');

//@route  - /dashboard
//@access - PRIVATE
//@method - GET
//@desc   - This is for Dashboard Page
router.get('/',auth.ensureAuthentication, (req,res) => {
    User.findOne({username: req.user.username})
        .then(user => {
            if(user.username !== "admin_12245") {
                Idea.find({user: req.user._id})
                    .then(ideas => {
                        if(ideas) {
                            res.render('dashboard', {user: req.user, ideas: ideas});
                        }
                    })
                    .catch(err => console.log(err))
                    console.log(req.user);
            }else {
                User.find({})
                    .then(allusers => {
                        res.render('dashboard', {user: req.user, allusers: allusers});
                    })
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
});

module.exports = router;