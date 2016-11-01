/**
 * Created by Abhay on 17-03-2016.
 */
var ejs = require("ejs");

function goToHandleSearchPage(req,res){

    console.log("In usernamesearch");
    ejs.renderFile('./views/usernamesearch.ejs',function (err,result){
        if(!err){

            res.end(result);
        }
        else{
            res.end('An error Occurred');
            console.log(err);
        }
    });
}

exports.goToHandleSearchPage = goToHandleSearchPage;