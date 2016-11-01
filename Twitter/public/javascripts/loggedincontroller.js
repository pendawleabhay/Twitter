

var app =  angular.module('homePage',[]);
app.controller('HomePageCntr',function($scope,$http){

    $http({

        method : "GET",
        url : "/fetchTweets"
    }).success(function (data) {
        $scope.data = data;
    });

    $scope.goToOtherProfile = function(first,last,handle){
        alert(first);
        alert(last);
        $http({

            method : "POST",
            data : {
                "first_Name" : first,
                "Last_Name" : last,
                "other_Handle" : handle
            },
            url : "/setUserForOtherProfile"
        }).success(function (data){
            if(data.statusCode == 200)
            {
                window.location.assign("/goToOtherProfile");
            }
        });

    }

    $scope.insertTweet =function () {
        var tweetValue = $scope.tweetValue;

        $http({

            method: "POST",
            data: {
                "tweetValue": tweetValue
            },
            url: '/insertTweet'
        }).success(function (data) {
            $scope.data = data;
        });
    }

    $scope.retweetdata = function(comments,handle) {

        $http({
            method : "POST",
            data : {
                "tweetValue" : comments,
                "tweet_owner" : handle
            },
            url : "/performRetweet"

        }).success(function(data){
            $scope.data = data;
            // $scope.visible = true;
        });
    }
});

app.controller('profile',function($scope,$http){

    $http({

        method : "GET",
        url : "/fetchUserInfo"
    }).success(function (result) {
        $scope.result = result[0];
    });
});

app.controller('searchCntr',function($scope,$http) {

    $scope.searchHash =function () {
        $http({
            method: "POST",
            data: {
                "search": $scope.search
            },
            url: "/setHash"
        }).success(function (data) {
            alert("Hash value set");
            if(data.statusCode == 1)
            {
                window.location.assign('/gethashsearchpage');
            }
            else if(data.statusCode == 2 || data.statusCode == 3)
            {
                alert("Hiiii");
                window.location.assign('/getusernamesearch');
            }
        });
    }
});
