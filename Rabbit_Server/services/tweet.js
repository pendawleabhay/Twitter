/**
 * Created by Abhay on 12-04-2016.
 */
var ejs = require("ejs");
var mongo = require('./mysql');
var mongoURL = "mongodb://localhost:27017/twitter";


function handleUserInfoRequest(msg,callback)
{
    var res = {};
    mongo.connect(mongoURL, function(){
        var coll = mongo.collection('user');
        var cursor =coll.find({Twitter_Handle : msg.Twitter_Handle});
        cursor.each(function(err,user){
            if(user!= null)
            {
                res = {following_count: user.following.length, followers_count: user.followers.length,First_Name : user.First_Name,Last_Name:user.Last_Name,Twitter_Handle:user.Twitter_Handle};
                var coll1 = mongo.collection('tweet');
                coll1.find({Twitter_Handle:  msg.Twitter_Handle}).toArray(function (err, doc) {
                    res.tweet_count = doc.length;
                    callback(null,res);

                });
            }
        });

    });
}

function handleOtherCommentsRequest(msg,callback)
{
    var res = {};
    fetchTweetss(msg.Other_Handle,function (feed) {
        res.feed = feed;
        callback(null, res);
    });
}

function handleRetweetRequest(msg,callback)
{
    mongo.connect(mongoURL, function() {
        var res = {};
        var coll = mongo.collection('tweet');
        coll.findOne({Tweet_Id : msg.Tweet_Id},function(err,tweet){
            if(!err)
            {
                var Comments = tweet.Comments;
                coll.insert({Twitter_Handle : msg.Twitter_Handle,Tweet_Id : msg.id,First_Name : msg.First_Name,Last_Name : msg.Last_Name,Comments: Comments,hash_value :[],Date_Added : new Date()},function(err,user){
                    if(!err)
                    {
                        fetchTweetss(msg.Twitter_Handle,function(feed) {
                            res.feed = feed;
                            callback(null, res);
                        });
                    }
                    else
                    {
                        console.log("Error While Inserting ReTweeted Comment");
                    }
                });
            }
        });
    })
}

function handleInsertTweetRequest(msg,callback)
{
    var res = {};
    mongo.connect(mongoURL, function(){
        var coll = mongo.collection('tweet');
        coll.insert({Twitter_Handle:msg.Twitter_Handle,Tweet_Id : msg.Tweet_Id,First_Name:msg.First_Name,Last_Name:msg.Last_Name,Comments:msg.Comments,hash_value:msg.hash_value,Date_Added:msg.Date_Added}, function(err, tweet){
            if (tweet)
            {
                fetchTweetss(msg.Twitter_Handle,function(feed){
                    res.feed = feed;
                    callback(null,res);
                });

            }
            else
            {
                console.log("returned false");
            }

        });
    })
}

function handleFetchTweetsRequest(msg,callback)
{
    var res = {};
    fetchTweetss(msg.Twitter_Handle,function (feed) {
        res.feed = feed;
        callback(null, res);
    });
}

function fetchTweetss(handle,callback) {
    mongo.connect(mongoURL, function(){
        var feed = [];
        var coll = mongo.collection('user');
        var cursor = mongo.collection("user").find({"Twitter_Handle": handle});
        cursor.each(function (err, doc) {
            if(doc!= null)
            {
                var followingCursor = mongo.collection("tweet").find({$or:[{Twitter_Handle :handle},{Twitter_Handle: {$in: doc.following}}]});
                followingCursor.each(function (err, tweets)
                {
                    if (tweets != null)
                    {
                        feed = feed.concat(tweets);
                    }
                    else
                    {
                        callback(feed);
                    }
                });

            }
        });
    });
}

exports.handleUserInfoRequest = handleUserInfoRequest;
exports.handleInsertTweetRequest = handleInsertTweetRequest;
exports.handleFetchTweetsRequest = handleFetchTweetsRequest;
exports.handleOtherCommentsRequest = handleOtherCommentsRequest;
exports.handleRetweetRequest = handleRetweetRequest;