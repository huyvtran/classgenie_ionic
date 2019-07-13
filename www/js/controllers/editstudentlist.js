var addStudent = angular.module('starter');

addStudent.controller('editStudentCtrl',['$scope','$window','$location','$ionicPopup','$ionicLoading','$state',function($scope,$window,$location,$ionicPopup,$ionicLoading,$state){var jsonObj;
  loader.dependency = $ionicLoading; 
  $scope.items=[];
  var jsonresponse=Service_Store.getLocal('parentdata');
  $scope.imagePath=global.config['file_url'];
  var json= $.parseJSON(jsonresponse);
  for (var i=0;i<json.length;i++)
  {
    
   var id       =json[i].id;
   var name     =json[i].name;
   var userEmail=json[i].email;
   var member_no=json[i].member_no;
   var user_type=json[i].type;
   }
   var stored_classId=Service_Store.getLocal('das_classid');//get  local storage


  /**
   * getting student list according class id
   * api calling for classroom data
   */
   loadData=function(){
  global.checkNetworkConnection($ionicPopup);
  ajaxloader.async=false;
  ajaxloader.load(global.config['api_url']+"/classinfo/studentlist?"+'token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId,
  function(resp){
  ajaxloader.async=true;
      var res1=$.parseJSON(resp);
      if(res1.status == "Success")
      {
        var class_studentlist =res1.class_details.student_list;
        
        $scope.items = class_studentlist;
      }else if(res1.error_code==1){

        global._alert({template: res1.error_msg, dependency:$ionicPopup});

      }
    });

}
  
loadData();
  /*add student from angularjs*/
  $scope.editStudent = function () {
  
  var studentName=$scope.student_name;
  if(studentName==""||studentName==null){
  }else{
  global.checkNetworkConnection($ionicPopup);
  ajaxloader.async=false;
  ajaxloader.loadURL(global.config['api_url']+'/addstudent?token='+Service_Store.getLocal('app_token'),
  {
    name: studentName,
    parent_ac_no: member_no,
    class_id:stored_classId

  },function(resp){
     ajaxloader.async=true;
       if(resp['status'] == "Success")
        {

         var responseJson =resp.user_list;
         var jsonObj = JSON.stringify(responseJson);
         $scope.items = $.parseJSON(jsonObj);
         $scope.student_name="";

        }else{global._alert({template: "Name already exist.", dependency:$ionicPopup});}

      });
    }
 }
   //list item click open edit student page
   $scope.editStudentPage=function()
   {
    var studentName=this.item.name;
    var studentId = this.item.id;
    var student_imageName=this.item.image;
    
    Service_Store.setLocal('stud_name',studentName);
    Service_Store.setLocal('stud_id',studentId);
    Service_Store.setLocal('stud_imageName',student_imageName);


     $window.location.href = '#/editstudent'; //load editstudent page

   }

   //back button 

}]);


goBack=function()
 {
  window.location.href = '#/tab/'+Service_Store.getLocal('das_classid')+'/classroom'
 }