var app = angular.module('starter')
app.controller('changepassword',['$scope','$ionicModal','$ionicPopup','$state','$ionicLoading',function($scope, $ionicModal ,$ionicPopup,$state,$ionicLoading){
loader.dependency = $ionicLoading;
$scope.popup_title = 'Change password';
var data = JSON.parse(Service_Store.getLocal('parentdata'));
$scope.member_no = data[0].member_no;

 $scope.updatepassword = function(){
     global.checkNetworkConnection($ionicPopup);
     ajaxloader.loadURL(global.config['api_url']+'/changepassword/update?token='+Service_Store.getLocal('app_token'),
    		{
    			  password: $scope.currpass,
               newpassword: $scope.newpass,
           confirmpassword: $scope.confirmpass,
                 member_no: $scope.member_no
                 
    		},$scope.updateResponse = function(resp){
               if(resp['status'] == 'Failure'){
                   global._alert({template: resp['comments'], dependency:$ionicPopup}); 
               }
               else
               {
                  global._alert({template: "Password Successfully Updated", dependency:$ionicPopup});
                  $scope.modal.hide();
               }
          });
  };

 $scope.backButton = function(){
    $scope.modal.hide();
 }

}]);