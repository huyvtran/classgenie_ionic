var event_notifications = angular.module('starter');
event_notifications.controller('event_notifications', ['$scope','$base64', '$location', '$window', '$ionicModal', '$state', '$ionicPopup', '$ionicLoading', '$cordovaToast', '$cordovaFileTransfer', '$cordovaCamera', '$ionicPlatform', function ($scope,$base64, $location, $window, $ionicModal, $state, $ionicPopup, $ionicLoading, $cordovaToast, $cordovaFileTransfer, $cordovaCamera, $ionicPlatform) {
        loader.dependency = $ionicLoading;
        var member_no = Service_Store.getLocal('das_member_no');
        $scope.pagecount = 1;
        var school_id = Service_Store.getLocal('event_school_id');
        var searchItem12 =Service_Store.getLocal('searchItem12');
        /*function for assignment list here.........................*/
        loadData = function (start) {     
            global.checkNetworkConnection($ionicPopup);
           ajaxloader.load(global.config['api_url'] + '/schools/teacherlistlimit?token=' + Service_Store.getLocal('app_token') + '&school_id=' + school_id + '&page_number=' + $scope.pagecount, function (resp){
                var resp = JSON.parse(resp);
                $scope.status_val = resp.status;
                if (resp.status == "Success")
                {
                  $scope.items = resp.Teacher_list;
                } else
                {
                    global._alert({template: "No teacher list now..", dependency: $ionicPopup});
                }
            });
        }
        loadData();
        /*function to send notifications*/
        $scope.send_notifications = function(){
            $window.location.href = "#event_notifications";

        }
        $scope.send_notification_post = function(){
        var length_val =   $('input[name="member_no[]"]:checked').length;
        if(length_val == 0){
           global._alert({template: 'Select atleast one checkbox', dependency:$ionicPopup}); 
        }else{
        var checkedValues = $('input:checkbox[name="member_no[]"]:checked').map(function() {
            return this.value;
            }).get(); 

              var jSonData = $base64.encode(JSON.stringify(checkedValues));
              global.checkNetworkConnection($ionicPopup);
              ajaxloader.async=false;
              ajaxloader.loadURL(global.config['api_url']+'/assignment/sendnotification?token='+Service_Store.getLocal('app_token'),
              {
                  sender_ac_no:member_no,
                  member_no:jSonData                 

              },function(resp){    
                 ajaxloader.async=true;
                 if(resp['status'] == "Success"){
                  global._alert({template: 'Notification sent', dependency:$ionicPopup});
                    }else if(resp.error_code==1){
                    global._alert({template: resp.error_msg, dependency:$ionicPopup});
                  }
                });
            }            
        }
        $scope.backPage = function () {
            $window.location.href = '#/eventlist';
        };

    }]);