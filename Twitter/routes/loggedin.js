                    /**
 * Created by Abhay on 10-03-2016.
 */
var ejs = require("ejs");

function goToHomePageAfterLogin(req,res){


    console.log(req.session.handle);
    if(req.session.handle)
    {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("loggedin",{handle:req.session.handle});
    }
    else
    {
        res.redirect('/');
    }
}

exports.goToHomePageAfterLogin = goToHomePageAfterLogin;