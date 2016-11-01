/**
 * Created by Abhay on 10-03-2016.
 */

var app =  angular.module('signUpApp',[]);
app.controller('signUpController',function($scope,$http){
console.log("inside signp controller");
    $scope.credentials = true;
    $scope.emailCredentials = true;
    $scope.clickSignUp =function (){
        console.log("Hiiii");
        var fname = $scope.fname;
        var lname = $scope.lname;
        var email = $scope.email;
        var password = $scope.password;
        var date = $scope.date;
        var handle = $scope.handle;
        var location = $scope.location;
        if(document.getElementById("genderMale").checked)
        {
             var gender = document.getElementById('genderMale').value;
        }
        else
        {
            var gender = document.getElementById('genderMale').value;
        }
        console.log(fname+ " "+lname+ " "+email+ " "+password+ " "+date+ " "+handle+ " "+gender);
        $http({
            method : "POST",
            data :{
                "firstName" : fname,
                "lastName" : lname,
                "email" : email,
                "password" : password,
                "dateOfBirth" : date,
                "handle" : handle,
                "gender" :gender,
                "location" : location
            },
            url : "/afterSignUp"
        }).success(function (data) {
            if(data.statusCode == 200)
            {
                window.location.assign("/loggedin");
            }
            else if(data.statusCode ==401)
            {
                $scope.credentials = false;
            }
            else
            {
                $scope.credentials = true;
                $scope.emailCredentials = false;
            }
        });
    }

});
