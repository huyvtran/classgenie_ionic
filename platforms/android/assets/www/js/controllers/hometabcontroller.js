var app = angular.module('starter');
app.controller('hometabcontroller',['$scope','$ionicPopup','$ionicModal','$ionicPopover','$window','$ionicHistory','$state',function($scope,$ionicPopup,$ionicModal,$ionicPopover,$window,$ionicHistory,$state){

$scope.openSideMenu1=function($event){
    $scope.popover_items=[{name:"Remove student"},{name:"Account"}];
    var template = '<ion-popover-view class="dropdownsetting custom_drop"><ion-content>'
    +'<ul >'
    +'<li class="item" ng-click="removeStudent()"><a>Remove student </a></li>'
    +'<li class="item" ng-click="profile()"><a>Account</a></li>'
    +'</ul>'
    +'</ion-content></ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
    });

    $scope.popover.show($event);

   $scope.closePopover = function() {
     $scope.popover.hide();
   };

   $scope.$on('popover.hidden', function() {
     // Execute action
    });

   $scope.removeStudent=function(){
    $window.location.href='#/remove_student';
    $scope.closePopover();
   }
 $scope.profile = function(){
   $scope.closePopover();
   
   $state.go('parent_profile');

 }

}

  
}]);