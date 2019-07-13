var studentmenu = angular.module('starter');

studentmenu.controller('performance_menuCtrl',['$scope','$location','$window','$ionicModal','$base64','$ionicPopup','$ionicLoading','$cordovaToast','$ionicSideMenuDelegate','$state','$ionicScrollDelegate',function($scope,$location,$window,$ionicModal,$base64,$ionicPopup,$ionicLoading,$cordovaToast,$ionicSideMenuDelegate,$state,$ionicScrollDelegate){
 
loader.dependency = $ionicLoading;
$scope.file = global.config['file_url'];
var member_no=Service_Store.getLocal('das_member_no');
Service_Store.setLocal('das_username',$scope.username);
$scope.imagePath = global.config['file_url']+global.config['image_path'];
 
$scope.pagecount=1;
$scope.pendingShow=true;
$scope.storyShow=false;
var data= JSON.parse(Service_Store.getLocal('report'));
 
if(data.class11 == 'all'){
$scope.class_id = 'all';
$scope.class_name= 'All class';
}else{ 
$scope.class_id = data.class_id;
}

//$scope.parent_no=data.parent_ac_no;
$scope.studentName= data.name;
//$scope.class_name= data.class_name;
$scope.student_no=data.student_no; 
$scope.parent_no=Service_Store.getLocal("parent_acno");
$scope.loadData=function(){
ajaxloader.async = false;
ajaxloader.load(global.config['api_url']+'/assignment/classlist?token='+Service_Store.getLocal('app_token')+"&parent_ac_no="+$scope.parent_no+"&name="+$scope.studentName,
  function(resp){
   var res1=$.parseJSON(resp);
   //console.log("Data in new api::"+res1);
  if(res1.status == "Success")
    {     
       $scope.mylist_data = res1.class_list;

      // console.log($scope.mylist_data);
         var data = Array();
        angular.forEach($scope.mylist_data, function(value, key){ 
         data.push(value.class_id);

   });

        if(data.length > 0){
          var classesData = data.toString();
          Service_Store.setLocal('classesData',classesData);
        }
        



       //console.log($scope.mylist_data);

       $window.location.href="#/side_menu_performance/"+$scope.class_id+"/side_menu_performance_content";
       //console.log("call from side menu page");
       ajaxloader.async = true;
     
    }else if(res1.error_code==1){

        global._alert({template: res1.error_msg, dependency:$ionicPopup});

      }
      
   
 });
 
}

$scope.getclassid_performance=function(item){
  var classid = this.item.class_list.class_id;
  var class_name = this.item.class_list.class_name;
  $scope.class_name =  class_name;
	Service_Store.setLocal('stud_classid',classid);
  Service_Store.setLocal("class_name",class_name);
  var data = {
              "name":item.name,
              "class_name":class_name,
              "member_no":item.member_no,
              "parent_ac_no":item.parent_no,
              "student_no":item.student_no,
              "class_id":classid,
              "class11":'single'
          };   
  Service_Store.setLocal('report',JSON.stringify(data));  
  if(Service_Store.getLocal('datetoken')){
  $scope.datetokenview = Service_Store.getLocal('datetoken').toUpperCase();
}
  $scope.tokenDta = Service_Store.getLocal('range_date_class');
	$window.location.href="#/side_menu_performance/"+classid+"/side_menu_performance_content";
} 
  $scope.loadData();

   $scope.backstudent_das=function(){    
      $window.location.href="#/home/your_kid";

    }
 

}]);


