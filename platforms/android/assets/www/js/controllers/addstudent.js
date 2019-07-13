var addStudent = angular.module('starter');


addStudent.controller('addStudentCtrl',['$scope','$window','$location','$ionicHistory','$ionicPopup','$state',function($scope,$window,$location,$ionicHistory,$ionicPopup,$state){

  var jsonObj;
  $scope.items=[];
  var jsonresponse=Service_Store.getLocal('parentdata');
  var classId= Service_Store.getLocal('das_classid');//get  local storage

  $scope.imagePath=global.config['file_url'];
  var json = $.parseJSON(jsonresponse);

  for (var i=0;i<json.length;i++)
  {

    var id       =json[i].id;
    var name     =json[i].name;
    var userEmail=json[i].email;
    var member_no=json[i].member_no;
    var user_type=json[i].type;
  }



studentlisting = function()
{
  var name =document.getElementById("student_name").value = "";

  global.checkNetworkConnection($ionicPopup);
  ajaxloader.async=false;
  ajaxloader.load(global.config['api_url']+"/classinfo/studentlist?"+'token='+Service_Store.getLocal('app_token')+"&class_id="+classId,
  function(resp){
  ajaxloader.async=true;
      var res1=$.parseJSON(resp);
      if(res1.status == "Success")
      {
        var class_studentlist =res1.class_details.student_list;
        
        $scope.items = class_studentlist;
      }
    });
}
 studentlisting();
//add student from angularjs
$scope.addStudent = function () {

  var studentName=$scope.student_name;
  global.checkNetworkConnection($ionicPopup);
  ajaxloader.async=false;
  ajaxloader.loadURL(global.config['api_url']+'/addstudent?token='+Service_Store.getLocal('app_token'),
  {
    name: studentName,
    class_id:classId

  },function(resp){
     ajaxloader.async=true;

    if(resp['status'] == "Success"){

      var responseJson =resp.user_list;
      var jsonObj = JSON.stringify(responseJson);
      Service_Store.setLocal('studentdata',jsonObj);
      // $scope.items = $.parseJSON(jsonObj);
       studentlisting();
       
        $state.go('addstudent', {}, { reload: true });
      }else if(resp.error_code==1){

        global._alert({template: resp.error_msg, dependency:$ionicPopup});
        }else{
          global._alert({template: "Name already exist.", dependency:$ionicPopup});
        }

  });

};



//list item click open invite parent page
$scope.openParentPage=function(){

$window.location.href = '#/inviteparent'; //load dashboard

}
}]);

  add_student_goBack=function()
  {
     var classId= Service_Store.getLocal('das_classid');
     var backValue=Service_Store.getLocal('das_classBack');
     if(backValue=="classback")
     {
     window.location.href ='#/tab/'+classId+'/classroom';
     }
      else{
      window.location.href ='#/dashboard';

     } 
    
  }