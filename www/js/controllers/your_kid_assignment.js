var kids_list = angular.module('starter');

kids_list.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];
      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key); 
              output.push(item);
          }
      });
      return output;
   };
});

kids_list.controller('yourKidassignmentCtrl',['$scope','$location','$window','$http','$state','$ionicHistory','$ionicModal','$ionicPopover','$ionicPopup','$ionicLoading','$timeout',function($scope,$location,$window,$http,$state,$ionicHistory,$ionicModal,$ionicPopover,$ionicPopup,$ionicLoading,$timeout){


loader.dependency = $ionicLoading;
var stored_memberNo= Service_Store.getLocal('das_member_no');
$scope.imagePath = global.config['file_url']+global.config['image_path'];
Service_Store.setLocal('datetoken','thismonth');

  loadData=function(){
	  ajaxloader.async = false;
    global.checkNetworkConnection($ionicPopup);
     ajaxloader.load(global.config['api_url']+'/parent/kidslist?token='+Service_Store.getLocal('app_token')+"&parent_ac_no="+stored_memberNo,
     function(resp){
     // console.log(resp);
           var res1=$.parseJSON(resp);
           var jsonResponse=res1.student_list;
           $scope.items=res1.student_list;
           ajaxloader.async = true;
      });
}


$scope.openSideMenuAssignment=function(name,class_name,class_id){
  console.log('classs....'+class_id+"name::"+name+"class_name"+class_name);
  var studentNo=this.item.student_no;
  $scope.std_memberNo= this.item.member_no;  
  $scope.std_parent_no=this.item.parent_ac_no ;
  Service_Store.setLocal("das_student_no", studentNo);
  Service_Store.setLocal("student_name",name);
  Service_Store.setLocal("class_name",class_name);
  Service_Store.setLocal("stud_classid_bkp",class_id);
  Service_Store.setLocal("parent_acno",$scope.std_parent_no);
  Service_Store.setLocal("student_name",name);
  Service_Store.setLocal("std_memberNo",$scope.std_memberNo);


  //$state.go('side_menu_assign');
  $window.location.href='#/side_menu_assignment';
}




$scope.addParentCode=function(){
    Service_Store.setLocal('key_back_status',"your_kid");
    $state.go('check_parent_code');
}

loader.init();
   $timeout(function(){
      loadData();
    },500);

// $scope.performance = function(item)
//   {
//     $state.go('childreview');
//     Service_Store.setLocal('report',JSON.stringify(item));
//   }
}]);
