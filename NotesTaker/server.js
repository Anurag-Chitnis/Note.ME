const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const expressLayouts = require('express-layouts');
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
//Middleware for ejs
app.set('view engine', 'ejs');
//Middlware for BodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//Express layouts
app.use(expressLayouts);
//Static Folder Config
app.use(express.static('public'));
app.use(express.static(__dirname + "\\" +'public' + "\\" + 'Images'))
app.use('/editIdea', express.static("public"))
app.use('/editIdea', express.static(__dirname + "\\" +'public' + "\\" + 'Images'))
app.use('/forgot', express.static('public'))

//Method Override
app.use(methodOverride('_method'))

require("./config/passport")(passport);
const auth = require('./auth/auth');

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

app.use(passport.initialize());
app.use(passport.session());

//Creating PORT variable 
const PORT = process.env.PORT || 3000;

//@route  - /
//@access - PUBLIC
//@method - GET
//@desc   - This is for home route
app.get('/', (req,res) => {
    res.redirect('/signIn')
});

// User Authentication (SignIn/ SignUp/ forgotPassword) 
const signIn = require('./routes/signIn');
const signUp = require('./routes/signUp');
const forgotPassword = require('./routes/forgotPassword');
//Middlewares
app.use('/signIn', signIn);
app.use('/signUp', signUp)
app.use('/forgot/password', forgotPassword);

// User Features (Including admin)
const dashboard = require('./routes/dashboard');
const addIdea = require('./routes/addIdea');
const editIdea = require('./routes/editIdea');
const deleteIdea = require('./routes/deleteIdea');
const trash = require('./routes/trash');
const undoIdea = require('./routes/undoIdea');
const favIdea = require('./routes/favIdea');
const unFavIdea = require('./routes/unFavIdea');
const editAvatar = require('./routes/editAvatar');
//Middlewares
app.use('/dashboard', dashboard);
app.use('/addIdea', addIdea);
app.use('/editIdea', editIdea);
app.use('/deleteIdea', deleteIdea);
app.use('/trash', trash);
app.use('/undoIdea', undoIdea);
app.use('/favIdea', favIdea);
app.use('/unFavIdea', unFavIdea);
app.use('/editAvatar', editAvatar);

// Admin Special Privilages
const adminDelete = require('./routes/adminDelete');
const adminDatabase = require('./routes/adminDatabase');
//Middlewares
app.use('/adminDelete', adminDelete);
app.use('/database', adminDatabase);


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