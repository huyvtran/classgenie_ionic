var app = angular.module('starter');
app.controller('tabcontroller',function ($scope,$window,$location){        
	$scope.classroomid = Service_Store.getLocal('das_classid');// My broad cast message
});