var notification = angular.module('starter');
notification.controller('notificationsCtrl', ['$scope','$base64', '$location', '$window', '$ionicModal', '$state', '$ionicPopup', '$ionicLoading', '$cordovaToast', '$cordovaFileTransfer', '$cordovaCamera', '$ionicPlatform', function ($scope,$base64, $location, $window, $ionicModal, $state, $ionicPopup, $ionicLoading, $cordovaToast, $cordovaFileTransfer, $cordovaCamera, $ionicPlatform) {
        loader.dependency = $ionicLoading;
        var stored_classId = Service_Store.getLocal('das_classid');
        var member_no = Service_Store.getLocal('das_member_no');
        var assignmentId = Service_Store.getLocal('assignmentId');       
        $scope.imagePath = global.config['file_url'] + global.config['image_path'];
        $scope.filename = "test.png";
        
        /*function for assignment list here.........................*/
        
        loadData = function (start) {     
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.load(global.config['api_url'] + '/assignment/studentlist?token=' + Service_Store.getLocal('app_token') + '&class_id=' + stored_classId, function (resp)
            {
                var resp = JSON.parse(resp);
                $scope.status_val = resp.status;
                if (resp.status == "Success")
                {
                    $scope.items = resp.details; 
                } else
                {
                    global._alert({template: "No teacher list now..", dependency: $ionicPopup});
                }
            });
        }

        loadData(); 

        /*function to send notifications*/

        $scope.send_notifications = function(){

            $window.location.href = "#notifications";

        } 


        $scope.send_notification_post = function(){
        var length_val =   $('input[name="student_no[]"]:enabled:checked').length;
        if(length_val == 0){
           global._alert({template: 'Select atleast one checkbox', dependency:$ionicPopup}); 
        }else{
        var checkedValues = $('input:checkbox[name="student_no[]"]:enabled:checked').map(function() {
            return this.value;
            }).get(); 
              var jSonData = $base64.encode(JSON.stringify(checkedValues));
              global.checkNetworkConnection($ionicPopup);
              ajaxloader.async=false;
              ajaxloader.loadURL(global.config['api_url']+'/assignment/sendnotification?token='+Service_Store.getLocal('app_token'),
              {
                  sender_ac_no:member_no,
                  student_no:jSonData,
                  assignment_id:assignmentId                 

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
            $window.location.href = '#/assignment_list';
        };

$scope.notify = function(val)
{
  console.log(val+'nitin');
}
    }]);