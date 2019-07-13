var studentmenu = angular.module('starter');

studentmenu.controller('studentmenu_ctrl',['$scope','$location','$window','$ionicModal','$base64','$ionicPopup','$ionicLoading','$cordovaToast','$ionicSideMenuDelegate','$state','$ionicScrollDelegate',function($scope,$location,$window,$ionicModal,$base64,$ionicPopup,$ionicLoading,$cordovaToast,$ionicSideMenuDelegate,$state,$ionicScrollDelegate){
loader.dependency = $ionicLoading;
$scope.user_name=Service_Store.getLocal('das_username');

$scope.file = global.config['file_url'];
var memberNo=Service_Store.getLocal('das_student_no');
Service_Store.setLocal('das_username',$scope.username);
$scope.imagePath = global.config['file_url']+global.config['image_path'];
$scope.videoPath= global.config['video_path']+global.config['image_path'];

var studentcode=Service_Store.getLocal('studentcode');
var userImage=Service_Store.getLocal('das_userimage');
$scope.pagecount=1;
$scope.pendingShow=true;
$scope.storyShow=false;

loadData=function(){
 
// $state.go('student_menu.student_home');
ajaxloader.async = false;
ajaxloader.load(global.config['api_url']+'/student/studentlist?token='+Service_Store.getLocal('app_token')+"&student_ac_no="+memberNo,
  function(resp){
  var res1=$.parseJSON(resp);
  if(res1.status == "Success")
    { 
      ajaxloader.async = true;    
      $scope.mylist_data = res1.student_list;

      var _stud_classid = Service_Store.getLocal('stud_classid');
      var _stud_classname=Service_Store.getLocal('stud_classname');

      $scope.firstclass=res1.student_list[0].class_id;
     
      Service_Store.setLocal('stud_name_first',res1.student_list[0].name); 
 if(_stud_classname== '' || _stud_classname== null){
   Service_Store.setLocal('stud_classname',res1.student_list[0].class_name); 
 }else{
  
 }

      if(_stud_classid == '' || _stud_classid == null){
         Service_Store.setLocal('stud_name_first',res1.student_list[0].name);
         // Service_Store.setLocal('stud_classname',res1.student_list[0].class_name);
         Service_Store.setLocal('stud_classid',$scope.firstclass);
         $window.location.href="#/student_menu/"+$scope.firstclass+"/student_home";
      }
      else
      {
         $window.location.href="#/student_menu/"+_stud_classid+"/student_home";
      }



     
    }else if(res1.error_code==1){

        global._alert({template: res1.error_msg, dependency:$ionicPopup});

      }
      
   
 });
 
}


$scope.getclassid=function(){
	var classid = this.item.class_id;
  var student_code=this.item.student_no;
  var selected_classname=this.item.class_name;
  Service_Store.setLocal('studentcode',student_code);
	Service_Store.setLocal('stud_classid',classid);
  Service_Store.setLocal('stud_classname',selected_classname);
	$window.location.href="#/student_menu/"+classid+"/student_home";

}
  
  loadData();
  $scope.backstudent_das=function(){
   $window.location.href="#/st_home/tab_pending";


  }
 

}]);


