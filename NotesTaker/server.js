const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const expressLayouts = require('express-layouts');
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override');
const sweetAlert = require('sweetalert');
const moment = require('moment')

//Middleware for ejs
app.set('view engine', 'ejs');
//Middlware for BodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//Express layouts
app.use(expressLayouts);
//Static Folder Config
app.use(express.static('public'));
app.use('/editIdea', express.static("public"))
app.use('/forgot', express.static('public'))
//Method Override
app.use(methodOverride('_method'))

require("./config/passport")(passport);
const auth = require('./auth/auth');


//Schema Import
const User = require('./model/User');
const Idea = require('./model/Idea');
const DeletedIdea = require('./model/deleteIdea');
//Connection
mongoose.connect('mongodb://localhost/jaipur', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(success => console.log("Connected Successfully"))
    .catch(err => console.log(err))


//Express Session
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
}))
//Passport Intialize
app.use(passport.initialize());
app.use(passport.session());


//Creating PORT variable 
const PORT = process.env.PORT || 3000;

//@route  - /
//@access - PUBLIC
//@method - GET
//@desc   - This is for home route
app.get('/', (req,res) => {
    res.send("Hello this is home page");
});

//@route  - /signIn
//@access - PUBLIC
//@method - GET
//@desc   - This is for Login route
app.get('/signIn', (req,res) => {
    res.render("signIn");
})
//@route  - /signIn
//@access - PUBLIC
//@method - GET
//@desc   - This is for Login route
app.post("/signIn", (req,res,next) => {
    passport.authenticate('local', 
    {failureRedirect: '/signIn',
    successRedirect: '/dashboard',
    })(req,res,next)
})

//@route  - /signUp
//@access - PUBLIC
//@method - GET
//@desc   - This is for Login route
app.get('/signUp', (req,res) => {
    res.render("signUp");
});

//@route  - /signUp
//@access - PUBLIC
//@method - POST
//@desc   - This is for Registration
app.post('/signUp', (req,res) => {
    const {username, email, password, confirm_password} = req.body;
    const err = [];
    User.findOne({username: username})
        .then(user => {
            if(user) {
                return res.json({err: 'User Already Exists'});
            }else {
                
                //All fiedls are empty
                if(username == "" || email == "" || password == "" || confirm_password == "") {
                    err.push("Please enter all the fields");
                }
                //Password Length Too Small
                if(password.length < 8) {
                    err.push("Password length too small");
                }
                //Passwords Do Not Match
                if(password !== confirm_password) {
                    err.push("Passwords Do Not Match");
                }
                //If data is validated then
                if(err.length !== 0) {
                    console.log(err);
                    return res.json({err: "There are some errors"});
                }else {
                    const newUser = new User({
                        username,
                        email,
                        password,
                        confirm_password,
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        if(err) throw err;
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(success => {
                                    res.redirect("signIn")
                                })
                                .catch(err => console.log(err))
                        })
                    })
                }

            }
        })
        .catch(err => console.log(err))
})
//@route  - /forgot/password
//@access - PUBLIC
//@method - GET
//@desc   - This is for Retrive Password Page
app.get('/forgot/password', (req,res) => {
    res.render("forgotPassword")
})
//@route  - /forgot/password
//@access - PUBLIC
//@method - POST
//@desc   - This is for Retrive Password Page
app.post('/forgot/password', (req,res) => {
    console.log(req.body);
    User.findOne({username: req.body.username})
        .then(user => {
            if(user) {
                if(req.body.password == req.body.confirm_password) {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(req.body.password, salt, (err,hash) => {
                            user.password = hash;
                            user
                                .save()
                                .then(success => {
                                    if(success) {
                                        res.redirect('/signIn');
                                    }
                                })
                                .catch(err => console.log(err))
                        })
                    })
                }else {
                    console.log("Incorrect Pass")
                }
            }
        })
        .catch(err => console.log(err))
})
//@route  - /adminDelete/:id
//@access - PRIVATE
//@method - DELETE
//@desc   - Admin can delete user and delete all its data
app.delete('/adminDelete/:id', auth.ensureAuthentication, (req,res) => {
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


//@route  - /dashboard
//@access - PRIVATE
//@method - GET
//@desc   - This is for Dashboard Page
app.get('/dashboard',auth.ensureAuthentication, (req,res) => {
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


//@route  - /addIdea
//@access - PRIVATE
//@method - GET
//@desc   - This is for Idea Page
app.get('/addIdea',auth.ensureAuthentication, (req,res) => {
    res.render('addIdea', {user: req.user});
})

//@route  - /addIdea
//@access - PRIVATE
//@method - POST
//@desc   - This is for Idea Page
app.post('/addIdea', auth.ensureAuthentication, (req,res) => {
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
//@route  - /editIdea/:id
//@access - PRIVATE
//@method - GET
//@desc   - This is for getting editing page
app.get('/editIdea/:id', auth.ensureAuthentication, (req,res) => {
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
app.put('/editIdea/:id', auth.ensureAuthentication, (req,res) => {
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

//@route  - /editIdea
//@access - PRIVATE
//@method - DELETE
//@desc   - This is for delete route
app.delete('/deleteIdea/:id', auth.ensureAuthentication, (req,res) => {
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
})
//@route  - /trash
//@access - PRIVATE
//@method - GET
//@desc   - This is for Deleted Idea
app.get('/trash', auth.ensureAuthentication, (req,res) => {
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
app.delete('/trash/:id', auth.ensureAuthentication, (req,res) => {
    DeletedIdea.deleteOne({_id: req.params.id})
        .then(idea => {
            console.log("Idea deleted");
            res.redirect("/trash")
        })
        .catch(err => console.log(err))
})
//@route  - /undoIdea
//@access - PRIVATE
//@method - POST
//@desc   - This is for undoing idea
app.post("/undoIdea/:id", auth.ensureAuthentication, (req,res) => {
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


//@route  - /favIdea/:id
//@access - PRIVATE
//@method - GET
//@desc   - This is for Favorite Idea
app.get('/favIdea/:id', auth.ensureAuthentication, (req,res) => {
    console.log(req.params.id);
    Idea.findOne({_id: req.params.id})
        .then(idea => {
            if(idea) {
                idea.favIdea = true;
                idea
                    .save()
                    .then(success => {
                        if(success) {
                            res.redirect('/dashboard');
                        }
                    })
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
})
//@route  - /unFavIdea/:id
//@access - PRIVATE
//@method - GET
//@desc   - This is for Favorite Idea
app.get('/unFavIdea/:id', auth.ensureAuthentication, (req,res) => {
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

//@route  - /editIdea
//@access - PRIVATE
//@method - GET
//@desc   - This is for changing the avatar
app.get('/editAvatar', auth.ensureAuthentication, (req,res) => {
    res.render("editAvatar", {user: req.user});
})

app.post('/editAvatar/:source', auth.ensureAuthentication, (req,res) => {
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
})

//@route  - /database
//@access - PRIVATE
//@method - GET
//@desc   - This is for viewing entire user base and their data
app.get("/database", auth.ensureAuthentication, (req,res) => {
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

//@route  - /logout
//@access - PRIVATE
//@method - GET
//@desc   - This is for Logout route
app.get('/logout', auth.ensureAuthentication, (req,res) => {
    req.logout();
    res.redirect('/signIn');
})

//@route  - *
//@access - PUBLIC
//@method - GET
//@desc   - This 404 Page
app.get('*', (req,res) => {
    res.send("Sorry Page not Found");
})


app.listen(PORT, () => console.log("Server running at port " + PORT));