const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const User = require('../model/User');
const Idea = require('../model/Idea');

//@route  - /adminDelete/:id
//@access - PRIVATE
//@method - DELETE
//@desc   - Admin can delete user and delete all its data
router.delete('/:id', auth.ensureAuthentication, (req,res) => {
    console.log(req.params.id);
    User.deleteOne({_id: req.params.id})
        .then(user => {
            console.log("Deleted user" + user.username);
            Idea.deleteMany({user: req.params.id})
                .then(idea => {
                    console.log("Ideas deleted of that user" + user.username)
                    res.redirect('/dashboard');
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})

module.exports = router;