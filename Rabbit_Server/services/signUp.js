/**
 * Created by Abhay on 07-03-2016.
 */
var ejs = require("ejs");
var mongo = require('./mysql');
var mongoURL = "mongodb://localhost:27017/twitter";


function handleSignUpRequest(msg,callback)
{
    var res = {};
    mongo.connect(mongoURL, function(){
        var coll = mongo.collection('user');

         coll.insert({Twitter_Handle: msg.Twitter_Handle, Password:msg.Password,First_Name:msg.First_Name,Last_Name:msg.Last_Name,Email:msg.Email,Birth_Date:msg.Birth_Date,Location:msg.Location,following:msg.following,followers:msg.followers}, function(err, user){
            if (user) {
                res = {"statusCode" : 200};
            }
            else {
                console.log("returned false");
                res = {"statusCode" : 401};
            }
             callback(null,res);
        });
    });
}

exports.handleSignUpRequest = handleSignUpRequest;
