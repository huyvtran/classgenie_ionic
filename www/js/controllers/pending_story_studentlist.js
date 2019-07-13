var student_list = angular.module('starter');

student_list.controller('studentlistCtrl',['$scope','$location','$window','$ionicModal','$state','$ionicPopup','$ionicLoading','$cordovaToast','$ionicHistory',function($scope,$location,$window,$ionicModal,$state,$ionicPopup,$ionicLoading,$cordovaToast,$ionicHistory){
loader.dependency = $ionicLoading;
 $scope.className=Service_Store.getLocal('das_classname');
 $scope.classImage=Service_Store.getLocal('das_classImage');
  var stored_classId=Service_Store.getLocal('das_classid');
  $scope.imagePath =global.config['file_url']+global.config['image_path'];


/*
api calling for classroom student list
*/
  loadstudent = function(){
  global.checkNetworkConnection($ionicPopup);
  ajaxloader.async=false;
  ajaxloader.load(global.config['api_url']+"/classinfo/studentlist?"+'token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId,
    function(resp){
  ajaxloader.async=true;
  var res1=$.parseJSON(resp);
    if(res1.status == "Success")

      { 
        var class_studentlist =res1.class_details.student_list;
        $scope.className=res1.class_details.class_name;
        $scope.classImage=res1.class_details.image;
        $scope.items = class_studentlist;
        $scope.classId=res1.class_details.class_id;
        var classgrade =res1.class_details.grade;
        
      }else if(res1.error_code==1){

        global._alert({template: res1.error_msg, dependency:$ionicPopup});
        }
    });
}
  
   loadstudent();

   $scope.doRefresh = function() {
       loadstudent();
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
       
     };

   $scope.open_pending_story=function(){

   var student_code=this.item.student_no;
   var classID=this.classId;
   Service_Store.setLocal("st_code",student_code);
   $state.go("pending_story_list");
   Service_Store.setLocal("allstoryPennding","single");

   }


   $scope.student_listback=function(){

   	 //$ionicHistory.goBack();
      $window.location.href = '#tab/'+stored_classId+'/classroom';
   }


 //function for whole class pending story
   $scope.all_pending_story=function(){
    Service_Store.setLocal("allstoryPennding","allpendingstory");
    $state.go("pending_story_list");
      
    }


 }]);