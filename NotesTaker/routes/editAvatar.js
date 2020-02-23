const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const User = require('../model/User');

//@route  - /editIdea
//@access - PRIVATE
//@method - GET
//@desc   - This is for changing the avatar
router.get('/', auth.ensureAuthentication, (req,res) => {
    res.render("editAvatar", {user: req.user});
})

router.post('/:source', auth.ensureAuthentication, (req,res) => {
    console.log(req.params.source);
    User.findOne({_id: req.user._id})
        .then(user => {
            if(user) {
                user.avatar_url = req.params.source
                user.save()
                    .then(success => {
                        console.log(1);
                        res.redirect("/")
                    })
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
});

module.exports = router;