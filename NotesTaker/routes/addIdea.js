const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const Idea = require('../model/Idea');

//@route  - /addIdea
//@access - PRIVATE
//@method - GET
//@desc   - This is for Idea Page
router.get('/',auth.ensureAuthentication, (req,res) => {
    res.render('addIdea', {user: req.user});
})

//@route  - /addIdea
//@access - PRIVATE
//@method - POST
//@desc   - This is for Idea Page
router.post('/', auth.ensureAuthentication, (req,res) => {
    console.log(req.body);
    Idea.findOne({title: req.body.title})
        .then(idea => {
            if(idea) {
                return res.json({message: 'Idea Exists'});
            }else {
                const newIdea = new Idea({
                    user: req.user._id,
                    title: req.body.title,
                    description: req.body.description
                })
                newIdea
                    .save()
                    .then(success => {
                        if(success) {
                            console.log("idea added");
                            res.redirect('/addIdea');
                        }
                    })
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
});

module.exports = router;