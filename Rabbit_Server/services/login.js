var ejs = require("ejs");
var mongo = require('./mysql');
var mongoURL = "mongodb://localhost:27017/twitter";

function handleLoginRequest(msg, callback){

	var res = {};
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('user');
		coll.findOne({Twitter_Handle: msg.Twitter_Handle, Password: msg.Password}, function (err, user) {
			if (user) {
				res.user = user;
			}
			else {
				res.code = "401";
			}
			callback(null, res);
		});
	});
}

exports.handleLoginRequest = handleLoginRequest;