   var notification = angular.module('starter');
   /**
    *Notification controller
    */
    notification.controller('notification_parent_settingCtrl',['$scope','$ionicPopup','$location','$window', '$ionicLoading','$cordovaPush','$cordovaDevice', function($scope,$ionicPopup,$location,$window,$ionicLoading,$cordovaPush,$cordovaDevice){
           loader.dependency = $ionicLoading;
           $scope.Notification_Settings = {};
           $scope.member_no = $.trim(Service_Store.getLocal('das_member_no'));
           console.log($scope.member_no);
           global.checkNetworkConnection($ionicPopup);           
           $scope.device_id = Service_Store.getLocal('das_device_id');  
           ajaxloader.async = false;
           ajaxloader.load(global.config['api_url']+'/save_deviceid/getdata?token='+Service_Store.getLocal('app_token')+'&member_no='+$scope.member_no+'&device_id='+$scope.device_id, function(resp){
               ajaxloader.async = true;
               var resp = $.parseJSON(resp);
               if(resp.status == "Success")
               { 
                  $scope.Notification_Settings.checked = (resp.device_list[0].status == '1' ? true : false);
                
               }
               else
               {
                  global._alert({template: resp.error_msg, dependency:$ionicPopup});
               }
           });

           $scope.Notification_Settings_Change = function(){ 
                   global.checkNetworkConnection($ionicPopup);
                   ajaxloader.loadURL(global.config['api_url']+'/getnotification?token='+Service_Store.getLocal('app_token'), {
                        
                        member_no: $scope.member_no,

                        status: $scope.Notification_Settings.checked ? 1 : 0
                     }, function(resp){
                      if(resp.error_code==1){
                         $scope.Notification_Settings.checked = !$scope.Notification_Settings.checked;
                         global._alert({template: resp.error_msg, dependency:$ionicPopup});
                      }
                 });

           };
           
    }]);
