//yourKidCtrl
var kids_list = angular.module('starter');

kids_list.controller('parent_kidCtrl',['$scope','$location','$window','$http','$state','$cordovaSocialSharing','$ionicPopup','$ionicLoading',function($scope,$location,$window,$http,$state,$cordovaSocialSharing,$ionicPopup,$ionicLoading){
      loader.dependency = $ionicLoading;
      $scope.status="";
      var jsonresponse=Service_Store.getLocal('parentdata');
      var deviceId=Service_Store.getLocal('das_device_id');
      
	 
	    var json= $.parseJSON(jsonresponse);
	    for (var i=0;i<json.length;i++)
	    { 
	     var id       =json[0].id;
	     var name     =json[0].name;
	     var userEmail=json[0].email;
	     var member_no=json[0].member_no;
	     var user_type=json[0].type;
	    }
	  
	    $scope.username=name; 
	    $scope.parent_ac_no=member_no;
	    $scope.imagePath = global.config['file_url']+global.config['image_path'];


loadData=function(){
	ajaxloader.async = false;
  global.checkNetworkConnection($ionicPopup);
  ajaxloader.load(global.config['api_url']+'/parent/kidslist?token='+Service_Store.getLocal('app_token')+"&parent_ac_no="+$scope.parent_ac_no,
  function(resp){
  var res1=$.parseJSON(resp);
  if(res1.status=="Success"){
      var jsonResponse=res1.student_list;
      $scope.items=res1.student_list;
      ajaxloader.async = true;
     }else if(res1.error_code==1){

        global._alert({template: res1.error_msg, dependency:$ionicPopup});

      }
    });
}

deviceRegister=function(){
    ajaxloader.async=false;
    global.checkNetworkConnection($ionicPopup);
    ajaxloader.loadURL(global.config['api_url']+'/save_deviceid?token='+Service_Store.getLocal('app_token'),
    {
      member_no:member_no,
      device_id:deviceId
    },function(resp){
     ajaxloader.async=true;
     
  
      });

    }

   deviceRegister();

$scope.open_class_story=function(){
$scope.status="student_story"
 Service_Store.setLocal('das_classid',this.item.class_id);
 Service_Store.setLocal('par_student_no',this.item.student_no);
 Service_Store.setLocal('das_member_no',this.item.parent_ac_no);
 Service_Store.setLocal('par_status',$scope.status);

 //$window.location.href = '#/home/class_story';

}

$scope.all_story=function(){
 $scope.status="all_story"
 
 Service_Store.setLocal('das_member_no',$scope.parent_ac_no);
 Service_Store.setLocal('par_status',$scope.status);

 $window.location.href='#/home/class_story';

}
 
 $scope.shareSocial=function(){

 	$cordovaSocialSharing.share("Classgenie", "Classgenie App", "img/logo.jpg", "https://www.xyz.com");
 }
 
loadData();

}]);

