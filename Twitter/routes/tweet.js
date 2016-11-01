/**
 * Created by Abhay on 12-03-2016.
 */

var ejs = require("ejs");
var mysql = require('./mysql');

function insertTweet(req,res)
{

    var status = 0;
    var pos = req.body.tweetValue.toString().indexOf("#");
    if(pos != -1) {
        var array = req.body.tweetValue.toString().split("#");
        for (i in array) {
            if ((array[i].charAt(0) != " ") && (array[i].charAt(0)!= "")) {
                status = 1;
            }
        }
    }
   var inserttweet = "insert into tweets ( Twitter_Handle,Comments,Contain_Hashtag,Date_Added,Retweet_User) VALUES ('" + req.session.handle + "','" + req.body.tweetValue + "'," + status + "," + "SYSDATE(),0);";


    mysql.fetchData(function(err,result){
        if(err)
        {
            throw err;
        }
        else
        {
            for (i in array) {

                if (i!= 0)
                {
                    puthash(array[i]);
                }
                }
            }
            var getTweet = "select First_Name, Last_Name,Comments,user_information.Twitter_Handle FROM twitter.user_information INNER join twitter.tweets ON user_information.Twitter_Handle = tweets.Twitter_handle WHERE user_information.Twitter_Handle = '"+req.session.handle+"' order by Date_Added DESC";

            mysql.fetchData(function(err,result){
                if(err)
                {
                    throw err;
                }
                else
                {

                    res.send(result);
                }
            },getTweet);

        },inserttweet);
}

function puthash(array)
{
  var gettweetid = "select max(tweet_id) as max from tweets;"
    mysql.fetchData(function(err,result) {
        if (err)
        {
            throw err;
        }

        else
        {
           // console.log("the last id inserted is " + array);
            if ((array != " ") && (array != "")) {
                var firstval = array.split(" ");
                if ((firstval[0].charAt(0) != " ") && (firstval[0].charAt(0) != ""))
                {
                    inserthash(result[0].max, firstval[0]);
                }
            }
        }
    },gettweetid);
}

function inserthash(tweetid,hashval)
{
    var puthashval = "insert into hashtags(hash_value,tweet_id) values (' " + hashval + "'," + tweetid + ");"

    mysql.fetchData(function(err,result) {
        if (err)
        {
            throw err;
        }

        else
        {


        }
    },puthashval);
}

function getMyInfo(req,res)
{
    var getMyTweet = "select First_Name,Last_Name,Email,Location,Birth_Date,user_information.Twitter_Handle FROM twitter.user_information WHERE user_information.Twitter_Handle = '"+req.session.handle+"'";
    console.log(getMyTweet);
    mysql.fetchData(function(err,result){

        if(err)
        {
            throw err;
        }
        else
        {

            res.send(result);
        }
    },getMyTweet);
}

function performRetweet(req,res)
{
    console.log("yoooo");
    var comments= req.body.tweetValue;
    var Original_Handle = req.body.tweet_owner;
    console.log(req.body.tweetValue);
    var status = 0;
    console.log(req.body.tweet_owner);
    var insertReTweet = "INSERT into tweets ( Twitter_Handle,Comments,Contain_Hashtag,Date_Added,Retweet_User) VALUES ('" + req.session.handle + "','" + comments + "'," + status + "," + "SYSDATE(),'"+Original_Handle+"');";
    console.log("In perform");
    console.log(insertReTweet);
    mysql.fetchData(function(err,result){

        if(err)
        {
            throw err;
        }
        else
        {
            var getTweet = "select First_Name, Last_Name,Comments,user_information.Twitter_Handle,Retweet_User,'"+req.session.handle+"' AS Original_Handle FROM twitter.user_information INNER join twitter.tweets ON user_information.Twitter_Handle = tweets.Twitter_handle WHERE user_information.Twitter_Handle IN (SELECT Following_Handle FROM follow where Follower_Handle = '"+req.session.handle+"')OR (user_information.Twitter_Handle = '"+req.session.handle+"') order by Date_Added DESC";

            mysql.fetchData(function(err,result){
                if(err)
                {
                    throw err;
                }
                else
                {

                    res.send(result);
                }
            },getTweet);
        }
    },insertReTweet);

}

function fetchTweets(req,res)
{
    var getTweet = "select First_Name, Last_Name,Comments,user_information.Twitter_Handle,Retweet_User,'"+req.session.handle+"' AS Original_Handle FROM twitter.user_information INNER join twitter.tweets ON user_information.Twitter_Handle = tweets.Twitter_handle WHERE user_information.Twitter_Handle IN (SELECT Following_Handle FROM follow where Follower_Handle = '"+req.session.handle+"')OR (user_information.Twitter_Handle = '"+req.session.handle+"') order by Date_Added DESC";
    console.log(getTweet);
    mysql.fetchData(function(err,result){

        if(err)
        {
            throw err;
        }
        else
        {

            res.send(result);
        }
    },getTweet);
}

function fetchUserInfo(req,res)
{
   var getUserInfo ="SELECT( SELECT COUNT(*) FROM user_information u INNER JOIN tweets t ON u.Twitter_Handle = t.Twitter_Handle  where u.Twitter_Handle = '"+req.session.handle+"') AS tweet_count,(SELECT First_Name FROM user_information WHERE Twitter_Handle = '"+req.session.handle+"') AS First_Name,(SELECT Last_Name FROM user_information WHERE Twitter_Handle = '"+req.session.handle+"') AS Last_Name,(SELECT COUNT(*) FROM follow where Follower_Handle = '"+req.session.handle+"') AS following_count,(SELECT COUNT(*) FROM follow where Following_Handle = '"+req.session.handle+"') AS followers_count FROM  dual;";
    console.log("Fetch User-------------"+getUserInfo);
        mysql.fetchData(function(err,result){

        if(err)
        {
            console.log("cannot be retrieved");
            throw err;
        }
        else
        {

            res.send(result);
        }
    },getUserInfo);
}

function fetchHashes(req,res)
{
    console.log("Value in session is :"+ req.session.searchValue);
    var hashValue =  req.session.searchValue;
    var getHashTweets = "SELECT Comments,hash_value,First_Name,Last_Name,user_information.Twitter_Handle FROM twitter.user_information INNER JOIN twitter.tweets on twitter.user_information.Twitter_Handle = twitter.tweets.Twitter_Handle INNER JOIN twitter.hashtags on twitter.tweets.Tweet_Id = twitter.hashtags.tweet_Id WHERE hash_value = ' "+hashValue+"'";

    mysql.fetchData(function(err,result){
        if(err)
        {
            throw err;
        }
        else
        {

            res.send(result);
        }
    },getHashTweets);

}
function fetchUsersToFollow(req,res)
{
    console.log("Value in session is :"+ req.session.searchValue);
    var userValue =  req.session.searchValue;
    var getUsersToFollow = "SELECT First_Name,Last_Name,Twitter_Handle FROM user_information WHERE Twitter_Handle = '"+userValue+"'"+" AND Twitter_Handle NOT IN (select Following_Handle from follow where Follower_Handle ='"+req.session.handle+"')";
    console.log(getUsersToFollow);
    //console.log("Query--------------"+getHashTweets);
    mysql.fetchData(function(err,result){
        if(err)
        {
            throw err;
        }
        else
        {
            //  console.log("Hash tag successful");
            res.send(result);
        }
    },getUsersToFollow);

}
function setHash(req,res)
{
    console.log("In set Hash");
    var data;
    var str = req.body.search;
    if(str.toString().charAt(0) == '#')
    {
        str = str.substr(1);
        req.session.searchValue = str;
        data = {"statusCode" : 1};
    }
    else if(str.toString().charAt(0) == '@')
    {
        str = str.substr(1);
        req.session.searchValue = str;
        data = {"statusCode" : 2};
    }
    else
    {
        req.session.searchValue = str;
        data = {"statusCode" : 3};
    }

    res.send(data);
}


function performFollow(req,res){
    var followingHandle = req.body.followingHandle;
    var query = "INSERT INTO follow (Follower_Handle,Following_Handle) VALUES('"+req.session.handle+"','"+followingHandle+"')";
    console.log(query);
    //console.log("Query--------------"+getHashTweets);
    mysql.fetchData(function(err,result){
        if(err)
        {
            throw err;
        }
        else
        {
            //  console.log("Hash tag successful");
            res.send(result);
        }
    },query);
}

function getOtherUserComments(req,res)
{
    var query = "select First_Name, Last_Name,Comments,user_information.Twitter_Handle FROM twitter.user_information INNER join twitter.tweets ON user_information.Twitter_Handle = tweets.Twitter_handle WHERE user_information.Twitter_Handle ='"+req.session.other_Handle+"' order by Date_Added DESC";
    console.log(query);
    mysql.fetchData(function(err,result){
        if(err)
        {
            throw err;
        }
        else
        {
            //  console.log("Hash tag successful");
            res.send(result);
        }
    },query);
}

function setUserForOtherProfile(req,res)
{
    var data;
    req.session.first_Name = req.body.first_Name;
    req.session.last_Name = req.body.Last_Name;
    req.session.other_Handle = req.body.other_Handle;
    console.log("********"+req.session.first_Name);
    console.log("********"+req.session.last_Name);
    console.log("********"+req.session.other_Handle);
    data = {"statusCode" : 200};
    res.send(data);
}

exports.fetchTweets = fetchTweets;
exports.puthash = puthash;
exports.insertTweet = insertTweet;
exports.fetchUserInfo = fetchUserInfo;
exports.fetchHashes = fetchHashes;
exports.setHash = setHash;
exports.fetchUsersToFollow = fetchUsersToFollow;
exports.performFollow = performFollow;
exports.getMyInfo = getMyInfo;
exports.performRetweet = performRetweet;
exports.setUserForOtherProfile=setUserForOtherProfile;
exports.getOtherUserComments=getOtherUserComments;