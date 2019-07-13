// var awardPoints = angular.module('starter');
// awardPoints.controller('awardPopUpCtrl',['$scope','$ionicModal','$ionicPopup','$ionicLoading',function($scope,$ionicModal,$ionicPopup,$ionicLoading){
// loader.dependency = $ionicLoading;
// var stored_classId=Service_Store.getLocal('das_classid');

// //getting class list 
// var data = $.param({

//     member_no:member_no,

// });

// var config = {
//     headers : {
//         'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//     }
// }
// ajaxloader.load(global.config['api_url']+'/points/student/?token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId,
//     function(resp){
//         //console.log("fdfdfdfdfdff");return;
//         var res1=$.parseJSON(resp);
//         if(res1.status == "Success")
//         {   
//             $scope.items    = res1.user_list;
            
//         }else if(res1.error_code==1){

//         global._alert({template: res1.error_msg, dependency:$ionicPopup});
        
//   }
//     });
// $scope.closeAwardPopUp=function(){
//     $scope.modal.hide();
// }

// }]);