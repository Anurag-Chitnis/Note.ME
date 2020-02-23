const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const Idea = require('../model/Idea');

//@route  - /editIdea/:id
//@access - PRIVATE
//@method - GET
//@desc   - This is for getting editing page
router.get('/:id', auth.ensureAuthentication, (req,res) => {
    Idea.findOne({_id: req.params.id})
        .then(idea => {
            if(idea) {
                res.render("editIdea", {user: req.user, idea: idea});
            }
        })
        .catch(err => console.log(err))
})
//@route  - /editIdea/:id
//@access - PRIVATE
//@method - PUT
//@desc   - This is for editing idea
router.put('/:id', auth.ensureAuthentication, (req,res) => {
    console.log(req.params.id);
    console.log(req.body);
    Idea.findOne({_id: req.params.id})
        .then(idea => {
            if(idea) {
                console.log(idea);
                idea.title = req.body.title;
                idea.description = req.body.description;
                idea
                    .save()
                    .then(success => {
                        if(success) {
                            console.log(success);
                            res.redirect('/dashboard');
                        }
                    })
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
})

module.exports = router;
