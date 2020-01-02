module.exports = {
    ensureAuthentication: function(req,res,next) {
        if(req.isAuthenticated()) {
            return next();
        }else {
            res.redirect('/signIn');
        }
    }
}