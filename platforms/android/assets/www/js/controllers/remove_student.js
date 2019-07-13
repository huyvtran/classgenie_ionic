//yourKidCtrl
var kids_list = angular.module('starter');

kids_list.controller('remove_kidCtrl',['$scope','$location','$window','$http','$state','$ionicHistory','$ionicPopup','$ionicLoading','$cordovaToast',function($scope,$location,$window,$http,$state,$ionicHistory,$ionicPopup,$ionicLoading,$cordovaToast){
      loader.dependency = $ionicLoading;
      $scope.status="";
      var jsonresponse=Service_Store.getLocal('parentdata');
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
       var jsonResponse=res1.student_list;
       $scope.items=res1.student_list;
       ajaxloader.async = true;
       if(res1.student_list.length < 1){
        $scope.message = "No students connected";
       }else{
        $scope.message = '';
       } 
       });


   }  

   loadData();

$scope.removeStudent=function(){
	
	var studentNO =this.item.student_no;
ajaxloader.loadURL(global.config['api_url']+'/parent/kidremove?token='+Service_Store.getLocal('app_token'),
{
  student_no:studentNO
},$scope.removeResponse);
};




/**
*Response from ajax
*@params resp
*/
$scope.removeResponse = function(resp){
  
  if(resp['status'] == "Success")
  {
    loadData();
    window.plugins.toast.show('successfully removed', 'short', 'center');
   // $window.location.href = '#/home/class_story'; //load dashboard
  }
  else if(resp.error_code==1){

     global._alert({template: resp.error_msg, dependency:$ionicPopup});

  }
  else
  {
    global._alert({template: resp['comments'], dependency:$ionicPopup});
  }
}

$scope.backRemove=function(){
	$ionicHistory.goBack();
}


}]);

