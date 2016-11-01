/**
 * Created by Abhay on 18-03-2016.
 */



var app =  angular.module('profile',[]);
app.controller('follow',function($scope,$http){

    $http({

            method: "GET",
            url: "/getMyInfo"
        }).success(function (result) {
            $scope.result = result;
        });



    $scope.getFollowingList = function(){
        $http({

            method : "POST",
            data : {

                "infoCode" : 1
            },
            url : "/getList"
        }).success(function(data){
            $scope.data = data;
        });
    }

    $scope.getFollowersList = function(){
        $http({

            method : "POST",
            data : {

                "infoCode" : 2
            },
            url : "/getList"
        }).success(function(data){
            $scope.data = data;
        });
    }
});