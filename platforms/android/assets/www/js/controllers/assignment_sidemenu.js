var studentmenu = angular.module('starter');

studentmenu.controller('assign_menuCtrl',['$scope','$location','$window','$ionicModal','$base64','$ionicPopup','$ionicLoading','$cordovaToast','$ionicSideMenuDelegate','$state','$ionicScrollDelegate',function($scope,$location,$window,$ionicModal,$base64,$ionicPopup,$ionicLoading,$cordovaToast,$ionicSideMenuDelegate,$state,$ionicScrollDelegate){
 
loader.dependency = $ionicLoading;
$scope.file = global.config['file_url'];
var member_no=Service_Store.getLocal('das_member_no');
Service_Store.setLocal('das_username',$scope.username);
$scope.imagePath = global.config['file_url']+global.config['image_path'];
$scope.student_no=Service_Store.getLocal("das_student_no");  
$scope.pagecount=1;
$scope.pendingShow=true;
$scope.storyShow=false;
$scope.class_id = Service_Store.getLocal("stud_classid_bkp");
 $scope.parent_no=Service_Store.getLocal("parent_acno");
 $scope.studentName= Service_Store.getLocal("student_name");

//$window.location.href="#/side_menu_assign/"+$scope.firstclass+"/assignment";
$scope.loadData=function(){
 //old api
http://localhost:3000/assignment/classlist?student_no=S0ASDXD0&token=aforetechnical@321!
ajaxloader.async = false;
ajaxloader.load(global.config['api_url']+'/assignment/classlist?token='+Service_Store.getLocal('app_token')+"&parent_ac_no="+$scope.parent_no+"&name="+$scope.studentName,
  function(resp){
   var res1=$.parseJSON(resp);
   //console.log(res1.class_list);
  if(res1.status == "Success")
    {     
       $scope.mylist_data = res1.class_list;

       $window.location.href="#/side_menu_assignment/"+$scope.class_id+"/side_menu_assignment_content"; 
    }else if(res1.error_code==1){

        global._alert({template: res1.error_msg, dependency:$ionicPopup});

      }
      
   
 });
 
}


$scope.getclassid_assignment=function(){
  var studentnumber = this.item.student_no;
	var classid = this.item.class_list.class_id;
  var class_name = this.item.class_list.class_name;
  Service_Store.setLocal('das_student_no',studentnumber);
	Service_Store.setLocal('stud_classid',classid);
  Service_Store.setLocal("class_name",class_name);
	$window.location.href="#/side_menu_assignment/"+classid+"/side_menu_assignment_content";
}




  $scope.loadData();

   $scope.backstudent_das=function(){    
      $window.location.href="#/home/your_kid_assignment";

    }
 

}]);


