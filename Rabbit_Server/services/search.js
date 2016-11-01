/**
 * Created by Abhay on 12-04-2016.
 */
var ejs = require("ejs");
var mongo = require('./mysql');
var mongoURL = "mongodb://localhost:27017/twitter";

// #search
function handleHashSearchRequest(msg,callback)
{
    var res = {};
    var feed = [];
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection('tweet');
        var cursor =coll.find({hash_value :{$all :[msg.searchValue]}});
        cursor.each(function(err,doc){
            if(doc!=null)
            {
                feed = feed.concat(doc);
            }
            else
            {
                res.feed = feed;
                callback(null,res);
            }
        });
    });
}

//@search
function handleUserSearchRequest(msg,callback)
{
    var res = {};
    var feed = [];
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection('user');
        var cursor =coll.find({Twitter_Handle :msg.searchValue});
        cursor.each(function(err,doc){
            if(doc!=null)
            {
                feed = feed.concat(doc);
            }
            else
            {
                res.feed = feed;
                callback(null,res);
            }
        });
    })
}

function handlesSelfInfoRequest(msg,callback)
{
    var res= {};
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection('user');
        coll.findOne({Twitter_Handle :msg.Twitter_Handle},function(err,doc){
            if(!err)
            {
                res.doc = doc;
                callback(null,res);
            }
            else
            {
                console.log("Error While retrieving user's Information");
            }
        });
    })
}

//get followers, following list
function handleGetListRequest(msg,callback)
{
    var res = {};
    var feed = [];
    if(msg.code == 1)
    {
        mongo.connect(mongoURL, function() {
            var coll = mongo.collection('user');
            coll.findOne({Twitter_Handle : msg.Twitter_Handle},function(err,doc){
                if(!err)
                {
                    var cursor = coll.find({Twitter_Handle : {$in: doc.following}});
                    cursor.each(function(err,user){
                        if(user!=null)
                        {
                            feed = feed.concat(user);
                        }
                        else
                        {
                            res.feed = feed;
                            callback(null,res);
                        }
                    });
                }
            });
        });
    }
    else
    {
        if(msg.code == 2)
        {
            mongo.connect(mongoURL, function() {
                var coll = mongo.collection('user');
                coll.findOne({Twitter_Handle :msg.Twitter_Handle},function(err,doc){
                    if(!err)
                    {
                        var cursor = coll.find({Twitter_Handle : {$in: doc.followers}});
                        cursor.each(function(err,user){
                            if(user!=null)
                            {
                                feed = feed.concat(user);
                            }
                            else
                            {
                                res.feed = feed;
                                callback(null,res);
                            }
                        });
                    }
                });
            });
        }
    }
}

//enter folow
function handleFollowRequest(msg,callback)
{
    var json;
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection('user');
        coll.update({Twitter_Handle:msg.Twitter_Handle},{$push :{following : msg.followingHandle}},function(err,user){
            if(!err)
            {
                coll.update({Twitter_Handle: msg.followingHandle},{$push :{followers : msg.Twitter_Handle}},function(err,user){
                    if(!err)
                    {
                        json = {"statusCode":200};
                        console.log("Done following");
                        callback(null,json);
                    }
                });
            }
        });
    });
}
exports.handleHashSearchRequest = handleHashSearchRequest;
exports.handleUserSearchRequest = handleUserSearchRequest;
exports.handleFollowRequest = handleFollowRequest;
exports.handlesSelfInfoRequest = handlesSelfInfoRequest;
exports.handleGetListRequest = handleGetListRequest;