const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const Idea = require('../model/Idea')
//@route  - /unFavIdea/:id
//@access - PRIVATE
//@method - GET
//@desc   - This is for Favorite Idea
router.get('/:id', auth.ensureAuthentication, (req,res) => {
    Idea.findOne({_id: req.params.id})
        .then(idea => {
            if(idea) {
                idea.favIdea = false;
                idea
                    .save()
                    .then(success => {
                        if(success) {
                            res.redirect('/dashboard')
                        }
                    })
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
})

module.exports = router;