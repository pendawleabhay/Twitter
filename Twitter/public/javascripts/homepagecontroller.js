/**
 * Created by Abhay on 07-03-2016.
 */

var app =  angular.module('homeLogin',[]);
app.controller('control',function($scope,$http){
    $scope.cred = true;

    $scope.clickLogin =function (){
        var name = $scope.name;
        var password = $scope.password;
        $http({
            method : "POST",
            data :{
                "username" : name,
                "password" : password
            },
            url : '/afterSignIn'
        }).success(function (data) {

            if(data.statusCode == 200)
            {
                window.location.assign("/loggedin");
            }
            else
            {
                $scope.cred = false;
            }
        });
    }

});

