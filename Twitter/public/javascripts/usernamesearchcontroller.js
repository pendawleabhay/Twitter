/**
 * Created by Abhay on 17-03-2016.
 */

var app =  angular.module('getusernamesearch',[]);
app.controller('handleSearchPageCntr',function($scope,$http){

    $scope.visible = false;

    $http({
        method : "GET",
        url : "/fetchUsersToFollow"
    }).success( function (data) {
        alert(data[0].Twitter_Handle);
        $scope.data = data;
    });

    $scope.follow = function (handle){

        $http({

            method : "POST",
            data : {
                "followingHandle" : handle
            },
            url : "/performFollow"

        }).success( function (data) {
            $scope.visible = true;
            window.location.assign('/loggedin');
        });
    }


});
