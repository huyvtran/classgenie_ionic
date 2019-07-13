var app = angular.module('starter');
/**
 *Singup controller
 */
app.controller('SingupController',function($scope){
    $scope.signup_title = 'Signup As';
    $scope.signup_content_class = 'sign-as';
    $scope.signup_content = 'Sign up for ClassGenie as a...';
    $scope.show_content = true;
});