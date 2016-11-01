var amqp = require('amqp')
, util = require('util');

var login = require('./services/login');
var signUp = require('./services/signUp');
var tweet = require('./services/tweet');
var search = require('./services/search');
var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening on login_queue");

	cnn.queue('auth_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){console.log("inside");
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			switch (message.req_queue)
			{
				case "login" :
					login.handleLoginRequest(message,function(err,res){
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});break;
				case "signUp" :
					signUp.handleSignUpRequest(message,function(err,res){
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
					break;
			}

		});
	});



	cnn.queue('tweet_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			switch (message.req_queue)
			{
				case "userInfo" : tweet.handleUserInfoRequest(message,function(err,res){
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
					break;
				case "insertTweet_queue" :tweet.handleInsertTweetRequest(message,function(err,res){
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
					break;
				case "fetchTweets_queue" :tweet.handleFetchTweetsRequest(message,function(err,res){
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
					break;

				case "otherComments_Queue" :tweet.handleOtherCommentsRequest(message,function(err,res){
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
					break;

				case "retweet_Queue" :tweet.handleRetweetRequest(message,function(err,res){
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
					break;
			}

		});
	});




	cnn.queue('search_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			switch (message.req_queue)
			{
				case "searchHash_Queue" :
					search.handleHashSearchRequest(message,function(err,res){
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "searchUser_Queue" :
					search.handleUserSearchRequest(message,function(err,res){
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "follow_Queue" :
					search.handleFollowRequest(message,function(err,res){
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "selfInfo_Queue" :
					search.handlesSelfInfoRequest(message,function(err,res){
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "list_Queue" :
					search.handleGetListRequest(message,function(err,res){
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
			}

		});
	});

});