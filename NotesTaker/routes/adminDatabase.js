const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const User = require('../model/User');
const Idea = require('../model/Idea');

//@route  - /database
//@access - PRIVATE
//@method - GET
//@desc   - This is for viewing entire user base and their data
router.get("/", auth.ensureAuthentication, (req,res) => {
    let bigArray = [];
    let finalArray = [];
    let favIdeaCounter = 0;
    User.find({})
        .then(users => {
            users.forEach((user,index) => {
                let newuser = new Object();
                newuser['useradd'] = user._id;
                newuser['username'] = user.username;
                Idea.find({})
                    .then(ideas => {
                        let ideasArray = [];
                        ideas.forEach(idea => {
                            if (idea.user == newuser.useradd) { 
                                if (idea.favIdea == true) {
                                    favIdeaCounter += 1;
                                }
                                ideasArray.push(idea);   
                            }
                        })
                        newuser['ideas'] = ideasArray;
                        bigArray.push(newuser)
                        if (index == users.length - 1) {
                            finalArray = bigArray;
                            console.log(finalArray)
                            res.render("database", {user: req.user, ideas: finalArray, length: ideas.length, favIdeaCounter: favIdeaCounter})
                        }
                    })
            })
            
        })
        .catch(err => console.log(err))
})

module.exports = router;