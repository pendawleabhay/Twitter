/**
 * Created by Abhay on 08-03-2016.
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var crypto = require('crypto');

function afterSignIn(req,res)
{

    var password = req.body.password;
    password = crypto.createHash("sha1").update(password).digest("HEX");
    console.log("------------"+password);
    var getUser="select * from user_information where Twitter_Handle='"+req.body.username+"' and password='" + password +"'";
    var handle = req.body.username;

    var data;

    mysql.fetchData(function(err,result){
        if(err)
        {
            throw err;
        }
        else
        {
            if(result.length > 0)
            {

                console.log("Successful Login");
                req.session.handle = handle;
                console.log("Session Initialized");
                data = {"statusCode" : 200};
                res.send(data);
            }
            else
            {
                data = {"statusCode" : 401};
                res.send(data);
            }
        }
    },getUser);
}

function logout(req,res){
    req.session.destroy();
    res.redirect('/');
}


exports.afterSignIn = afterSignIn;
exports.logout = logout;