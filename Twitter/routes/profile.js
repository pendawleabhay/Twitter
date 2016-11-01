/**
 * Created by Abhay on 17-03-2016.
 */
var ejs = require("ejs");
var mysql = require('./mysql');

function goToSuccessPage(req,res){

    ejs.renderFile('./views/profile.ejs',function (err,result){
        if(!err){

            res.end(result);
        }
        else{
            res.end('An error Occurred');
            console.log(err);
        }
    });
}

function getList(req,res){

    var code = req.body.infoCode;
    console.log("Code is :"+code);
    if(code == 1)
    {
        var query = "SELECT First_Name,Last_Name,Twitter_Handle FROM user_information WHERE Twitter_Handle IN(SElECT Following_Handle FROM follow WHERE Follower_Handle = '"+req.session.handle+"')";
    }
    else
    {
        var query = "SELECT First_Name,Last_Name,Twitter_Handle FROM user_information WHERE Twitter_Handle IN(SElECT Follower_Handle FROM follow WHERE Following_Handle = '"+req.session.handle+"')";

    }
    mysql.fetchData(function(err,result){
            if(err)
            {
                throw err;
            }
            else
            {
                console.log(result[0].First_Name);
                res.send(result);
            }

    },query);
}

exports.goToSuccessPage = goToSuccessPage;
exports.getList = getList;