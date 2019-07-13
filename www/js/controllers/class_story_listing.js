var class_story_listing = angular.module('starter');

class_story_listing.controller('student_list_Ctrl',['$scope','$location','$window','$state','$ionicModal','$ionicPopup','$ionicLoading','$timeout',function($scope,$location,$window,$state,$ionicModal,$ionicPopup,$ionicLoading,$timeout){
loader.dependency = $ionicLoading;
var stored_classId=Service_Store.getLocal('das_classid');
var stored_memberNo= Service_Store.getLocal('das_member_no');
$scope.class_name= Service_Store.getLocal('das_classname');
$scope.classImage=Service_Store.getLocal('das_classImage');
$scope.imagePath=global.config['file_url'];


$scope.loadData=function(){

            ajaxloader.async = false;
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.load(global.config['api_url']+'/studentmessagelist?token='+Service_Store.getLocal('app_token')+'&class_id='+stored_classId+'&sort_by=A', function(resp){
                 var resp = $.parseJSON(resp);

                $('#lnk_all_parents').show();

                 $scope.user_list = resp['user_list'];
                 ajaxloader.async = true;
                 if(resp.error_code==1){

                  global._alert({template: resp.error_msg, dependency:$ionicPopup});

                }
            });
        }


loader.init();
$timeout(function(){
      $scope.loadData();
    },500);

// pull for refresh the page
$scope.doRefresh = function() {
       $scope.loadData();
       
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     
  };


$scope.openClassStory=function(){

    Service_Store.setLocal('classStory_st_no',this.item.student_no);
    Service_Store.setLocal('classStory_pt_no',this.item.parent_ac_no);
    Service_Store.setLocal('classStory_status',"0");
 
var checkstatus=this.item.parent_ac_no;
if(checkstatus!=0){
    $state.go('classstory');
  }else{
      $state.go('inviteparent');
    }


}

$scope.all_story=function(){
     $state.go('classstory');
	//$window.location.href ='#/classstory';
	Service_Store.setLocal('classStory_status',"all");
}
$scope.inviteParent = function()
{

$state.go('inviteparent');

}


}]);
goTo_DashBoard=function(){

  window.location.href = '#dashboard';

}