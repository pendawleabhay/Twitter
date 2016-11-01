var request = require('request')
    , express = require('express')
    ,assert = require("assert")
    ,http = require("http");

describe('http tests', function(){

    it('should return the login if the url is correct', function(done){
        http.get('http://localhost:3000/', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('should not return the home page if the url is wrong', function(done){
        http.get('http://localhost:3000/invalidrequest', function(res) {
            assert.equal(404, res.statusCode);
            done();
        })
    });

    it('should login', function(done) {
        request.post(
            'http://localhost:3000/login',
            { form: { username: 'abhay@gmail.com',password:'a' } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    it('should register', function(done) {
        request.post(
            'http://localhost:3000/signup',
            { form: { first_name: 'mocha',last_name:'test',email:'abhay@gmail.com',password:'a',userhandle:'mochatest'}},
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    it('should fetch tweets', function(done) {
        request.post(
            'http://localhost:3000/fetchtweets',
            { form: { username:'abhay@gmail.com'}},
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });
});