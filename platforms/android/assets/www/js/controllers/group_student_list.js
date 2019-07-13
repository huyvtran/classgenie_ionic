var addClass = angular.module('starter');

addClass.controller('groupListCtrl',['$scope','$location','$window','$ionicModal','$ionicPopup','$ionicLoading',function($scope,$location,$window,$ionicModal,$ionicPopup,$ionicLoading){
loader.dependency = $ionicLoading;
$scope.image="img/17_c_17.png";
$scope.nitin = true;
 var selected = [];
 var names=[];
 var nameList=[];

 $scope.imagePath=global.config['file_url'];
 var stored_classId=Service_Store.getLocal('das_classid');//get  local storage
 var group_name=Service_Store.getLocal('groupName');
 

  /**
   * getting student list according class id
   * api calling for classroom data
   */
//   $(document).ready(function(){$scope.getGroupStudents = function()

// });
  ajaxloader.async=false;
  ajaxloader.timeout = 5000;
  global.checkNetworkConnection($ionicPopup);
  ajaxloader.load(global.config['api_url']+"/classinfo/studentlist?"+'token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId,
  function(resp){
      var res1=$.parseJSON(resp);
      if(res1.status == "Success")
      {
        var class_studentlist = res1.class_details.student_list;
        $scope.items = class_studentlist;
        if(Service_Store.getLocal('studentlist') === null )
         {
            }
         else
         {
          var list = JSON.parse(Service_Store.getLocal('studentlist'));
          list.forEach(function(list){
           $('#stu_'+list.member_no).hide();
           $('#stu_'+list.member_no).addClass('addback');
          })
         }

      }else if(res1.error_code==1){

        global._alert({template: res1.error_msg, dependency:$ionicPopup});

      }
    });


var jsonresponse=Service_Store.getLocal('parentdata');
var json = $.parseJSON(jsonresponse);

for (var i=0;i<json.length;i++)
{
  var id       =json[i].id;
  var name     =json[i].name;
  var userEmail=json[i].email;
  var member_no=json[i].member_no;
  var user_type=json[i].type;
}
$scope.selected = [];
            $scope.select_student = function (member) {
             if($('#stu_'+member.student_no).prop("checked"))
             {
            $('#stu_'+member.student_no).prop("checked",false);
            $('#stu_'+member.student_no).css({"background-color":""});
              var pos = selected.indexOf(member.student_no);
             
               if(pos == -1)
               {
                 $scope.selected.splice(pos);
               }
             }
            else
            {
              $('#stu_'+member.student_no).prop("checked",true);
              $('#stu_'+member.student_no).css({"background-color":"#ccc"});
              $scope.selected.push({"member_no":member.student_no,"name":member.name ,"id":member.id , "pointweight":member.pointweight});
              
            }
            var item = $scope.selected;
            var list = '';
              $scope.selected.forEach(function(item){
              list += item.name+',';
              $scope.student_name = list.slice(0, -1);
              
              });
             }
$scope.addselected = function(id)
{
$scope.selected.push({"class_id":stored_classId,"group_name":group_name});  
Service_Store.setLocal('studentlist',JSON.stringify($scope.selected));
$scope.addstudent = undefined;
$scope.modal.remove();
$scope.getstudentlist();
$scope.addstudent = false;
}

$scope.group_list_goBack=function(){
   $scope.modal.remove(); 
  $scope.addstudent = undefined;
 
}
$scope.getGroupStudents = function()
{
  if(Service_Store.getLocal('studentlist') === null )
     {
      
     }
     else
     {
      var list = JSON.parse(Service_Store.getLocal('studentlist'));
      list.forEach(function(list){
     // list.member_no = 'addback';
       $('#stu_'+list.member_no).hide();
       //$('#stu_'+list.member_no).prop("checked",true);
       $('#stu_'+list.member_no).css({"background-color":"#ccc"});
      })
     }
 }
$scope.getGroupStudents();

}]);

 