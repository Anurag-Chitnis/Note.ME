const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const DeletedIdea = require('../model/deleteIdea');

//@route  - /trash
//@access - PRIVATE
//@method - GET
//@desc   - This is for Deleted Idea
router.get('/', auth.ensureAuthentication, (req,res) => {
    DeletedIdea.find({user: req.user._id})
        .then(deletedIdeas => {
            if(deletedIdeas) {
                res.render("trash", {user: req.user, deletedIdeas: deletedIdeas})
            }
        })
        .catch(err => console.log(err))
})

//@route  - /trash
//@access - PRIVATE
//@method - DELETE
//@desc   - This is for Deleted Idea
router.delete('/:id', auth.ensureAuthentication, (req,res) => {
    DeletedIdea.deleteOne({_id: req.params.id})
        .then(idea => {
            console.log("Idea deleted");
            res.redirect("/trash")
        })
        .catch(err => console.log(err))
})

module.exports = router;