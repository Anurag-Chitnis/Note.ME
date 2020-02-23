const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const DeletedIdea = require('../model/deleteIdea');
const Idea = require('../model/Idea');

//@route  - /undoIdea
//@access - PRIVATE
//@method - POST
//@desc   - This is for undoing idea
router.post("/:id", auth.ensureAuthentication, (req,res) => {
    console.log(req.params.id);
    DeletedIdea.findOne({_id: req.params.id})
        .then(idea => {
            const newIdea = new Idea({
                user: idea.user,
                title: idea.title,
                description: idea.description,
                favIdea: idea.favIdea
            }).save()
            console.log(idea);
            DeletedIdea.deleteOne({_id: idea._id})
                .then(success => {
                    console.log("Deleted idea")
                    res.redirect("/dashboard")
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})

module.exports = router;