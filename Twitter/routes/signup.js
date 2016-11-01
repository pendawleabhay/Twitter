/**
 * Created by Abhay on 07-03-2016.
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var crypto = require('crypto');

function goToSignUpPage(req,res){
    ejs.renderFile('./views/SignUp.ejs',function (err,result){
        if(!err){
            res.end(result);
        }
        else{
            res.end('An error Occurred');
            console.log(err);
        }
    });
}

function afterSignUp(req,res)
{
    var password = req.body.password;
    console.log("------------"+password);
     password = crypto.createHash("sha1").update(password).digest("HEX");
    console.log(password);
    console.log("IN after Sign Up");
    var setUser = "Insert into user_information (First_Name,Last_Name,Email,Password,Gender,Birth_Date,Twitter_Handle,Location) VALUES('" + req.body.firstName + "','" + req.body.lastName + "'," +
        "'" + req.body.email + "','"+password+"','"+req.body.gender+"','"+req.body.dateOfBirth+"','"+req.body.handle+"','"+req.body.location+"');";
    console.log(setUser);
    var handle = req.body.handle;
    mysql.fetchData(function (err, result) {
        if(err)
        {
            console.log("Error ::"+err);
            var position = err.toString().search('PRIMARY')
            if(position!= -1)
            {
                data = {"statusCode" : 401};
                res.send(data);
            }
            else
            {
                data = {"statusCode" : 402};
                res.send(data);
            }

        }
        else
        {
            console.log("Record inserted Successfully");
            req.session.handle = handle;
            data = {"statusCode" : 200};
            res.send(data);
        }

    },setUser);
}

exports.goToSignUpPage = goToSignUpPage;
exports.afterSignUp = afterSignUp;
