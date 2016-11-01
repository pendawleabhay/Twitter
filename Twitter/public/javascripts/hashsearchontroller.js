/**
 * Created by Abhay on 12-03-2016.
 */


var app =  angular.module('hashapp',[]);
app.controller('hashcontroller',function($scope,$http){

    $http({

        method : "GET",
        url : "/fetchHashes"
    }).success( function (data) {
       $scope.data = data;
    });


});



