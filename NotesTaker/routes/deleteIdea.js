const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const Idea = require('../model/Idea');
const DeletedIdea = require('../model/deleteIdea');

//@route  - /editIdea
//@access - PRIVATE
//@method - DELETE
//@desc   - This is for delete route
router.delete('/:id', auth.ensureAuthentication,(req,res) => {
    Idea.findOne({_id: req.params.id})
        .then(idea => {
            const newDeletedIdea = new DeletedIdea({
                user: idea.user,
                title: idea.title,
                description: idea.description,
                favIdea: idea.favIdea,
                deletedIdea: true
            })
            newDeletedIdea
                .save()
                .then(res => console.log("Successfully added to trash"))
                .catch(err => console.log(err))

            Idea.deleteOne({_id: idea._id})
                .then(idea => {
                    if(idea) {
                        console.log("Idea deleted");
                        res.redirect('/dashboard');
                    }else {
                        console.log("some bloody Error");
                    }
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
});

module.exports = router;