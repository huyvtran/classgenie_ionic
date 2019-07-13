 var group = angular.module('starter');

group.controller('groupCtrl',['$scope','$location','$window','$ionicPopup','$ionicPopover','$ionicModal','$ionicLoading','$state','$cordovaToast',function($scope,$location,$window,$ionicPopup,$ionicModal,$ionicPopover,$ionicLoading,$state,$cordovaToast){
loader.dependency = $ionicLoading;
var stored_classId=Service_Store.getLocal('das_classid');
$scope.imagePath =global.config['file_url']+global.config['image_path'];
 var groupName="";
 var myPopup="";

 //Api Calling for  Load group data For the class  
 loadGroup = function(){
 ajaxloader.async = false;
 ajaxloader.load(global.config['api_url']+'/groupinfo?token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId,
  function(resp){
    ajaxloader.async = true;
  var res1=$.parseJSON(resp);
  if(res1.status == "Success")
    {
       var responseJson =res1.group_list;
       console.log(2222);
       console.log(responseJson);
       $scope.items = responseJson;
       
    }else if(res1.error_code==1){

        global._alert({template: res1.error_msg, dependency:$ionicPopup});

      }
      else
      {
        $scope.items = '';
      }
  });
}

//loadGroup();

//open group detail
$scope.openGroupDetail=function(){

   $scope.groupName=this.item.group_name;
   $scope.group_id=this.item.id;
  global.checkNetworkConnection($ionicPopup);
  ajaxloader.async=false;
  ajaxloader.load(global.config['api_url']+'/groupinfo/group_studentlist?token='+Service_Store.getLocal('app_token')+'&class_id='+stored_classId+'&group_id='+$scope.group_id,
    function(resp){
    ajaxloader.async=true;
    var res = JSON.parse(resp);
    console.log(res.group_list+'  nitin  '); 
    $scope.grp = res.group_list;
    if($scope.grp != '')
    {
      console.log('is blank');
    }else{
      console.log("not blank");
    }
    
   if(res['status'] == "Success"){
      var responseJson =res.student_info;
      Service_Store.setLocal("groupdata",JSON.stringify(responseJson));
      $scope.values = responseJson;
      }else if(res.error_code==1){

        global._alert({template: res.error_msg, dependency:$ionicPopup});

      }
  });
$ionicModal.fromTemplateUrl('templates/groupstudent.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal2 = modal;
    $scope.modal2.show();
  });
        
}



//add new group
$scope.openAddGroup=function(){

//   Service_Store.removeKey('studentlist');
//   Service_Store.removeKey('groupinfo');
//   $ionicModal.fromTemplateUrl('templates/add_group.html', {
//      scope: $scope,
//   animation: 'slide-in-up'
//   }).then(function(modal) {
//      $scope.modal1 = modal;
//      $scope.modal1.show();
//   });
//   $scope.close_addgroup=function(){
//   $scope.modal1.remove();
// }

$state.go('add_group');
}
$scope.closepopup = function()
{
  $scope.modal2.remove();
}


$scope.showAwardMessage = function(){
  //window.plugins.toast.show('Can not award indivisual in group', 'short', 'center');
  global._alert({template: 'Can not award individual in group', dependency:$ionicPopup});
  return;
}




//open student reward page
$scope.openStudentReward=function(multiple){
//myPopup1.close();
  var stored_classId=Service_Store.getLocal('das_classid');
  var memberNO= Service_Store.getLocal('das_member_no');
  if(multiple == undefined)
  {
  var studentId = this.item.id;
  var student_code = this.item.student_no;
  var url = '/points/student/update';
  }
  else
  {
  var studentId = multiple;
  var url = '/awardmultiple/class'
  }
  $scope.student = this.item.name;
  
  $ionicModal.fromTemplateUrl('templates/awardpopup.html',{
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });


 var stored_classId=Service_Store.getLocal('das_classid');

//getting skills list 
ajaxloader.async = false;
ajaxloader.load(global.config['api_url']+'/points/student?token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId,
  function(resp){
  var res1=$.parseJSON(resp);
  if(res1.status == "Success")
    {
      $scope.needwork = false;
      $scope.positive = true;
      var data1 = res1.user_list;
      $scope.award_items =data1; 
      $scope.needwork_items = res1.needwork;
      ajaxloader.async = true;
    }else if(res1.error_code==1){

       global._alert({template: res1.error_msg, dependency:$ionicPopup});

    }
 });

//close award popup
$scope.closeAwardPopUp=function(){
  $scope.modal.hide();
}

//give points to students
$scope.giveReward=function(){

if(url == '/points/student/update')
{ 
//api calling to update the points in student  
ajaxloader.loadURL(global.config['api_url']+url+'?token='+Service_Store.getLocal('app_token'),
{
  id:studentId,
  pointweight: this.item.pointweight,
  class_id:stored_classId,
  student_no:student_code,
  customize_skills_id:this.item.id
},function(resp){

if(resp['status'] == "Success"){
      loadGroup();
     }

});
$scope.modal.hide();// to hide the template
}
else if(url == '/awardmultiple/class')
{
 var data = {"id":studentId,"pointweight":this.item.pointweight,"class_id":stored_classId};
  data = JSON.stringify(data);
//api calling to update the points in student  
ajaxloader.loadURL(global.config['api_url']+url+'?token='+Service_Store.getLocal('app_token'),
{
  data : data
},function(resp){
  if(resp['status'] == "Success"){
    $scope.footer  = false;
    $scope.addmultiple = true;
    $scope.classroom   = false;
    $scope.addmultiplescreen = true;
    $scope.selectstudent = true;
    $scope.selectone = false;
    loadGroup();

     }

});
$scope.modal.hide(); 
  }
 }
}

$scope.positiveButton=function(){
  console.log(210);
  $scope.posbutton = "award_tab";
  $scope.needbutton = "";
  $scope.positive = true;
  $scope.needwork = false;
  }

  $scope.needButton = function(){
    console.log(120);
  $scope.posbutton = "";
  $scope.needbutton = "award_tab";
  $scope.needwork = true;
  $scope.positive = false;
  } 
// fuction for open group awrad 
//if(){
  //console.log("djshhdjsd");
$scope.openGroupReward=function(multiple){
  if($scope.grp != ''){
  var stored_classId=Service_Store.getLocal('das_classid');
  var memberNO= Service_Store.getLocal('das_member_no');
  if(multiple == undefined)
  {
   var url = '/groupinfo/pointweight';
  }
  else
  {
  var studentId = multiple
  var url = '/awardmultiple/class'
  }
  $scope.closepopup();
  
  $ionicModal.fromTemplateUrl('templates/awardpopup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });


 var stored_classId=Service_Store.getLocal('das_classid');

//getting skills list 
ajaxloader.async = false;
ajaxloader.load(global.config['api_url']+'/points/student?token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId,
  function(resp){
  var res1=$.parseJSON(resp);
  if(res1.status == "Success")
    {
      $scope.needwork = false;
      $scope.positive = true;
      var data1 = res1.user_list;
      $scope.award_items =data1; 
      $scope.needwork_items = res1.needwork;
      ajaxloader.async = true;
    }
 });

//close award popup
$scope.closeAwardPopUp=function(){
  $scope.modal.hide();
}

//give points to students
$scope.giveReward=function(){

if(url == '/groupinfo/pointweight')
{
  console.log(32);
//api calling to update the points in student  
ajaxloader.loadURL(global.config['api_url']+url+'?token='+Service_Store.getLocal('app_token'),
{
  
    group_name:groupName,
    pointweight: this.item.pointweight,
    class_id:stored_classId,
    group_id:$scope.group_id,
    customize_skills_id:this.item.id
 
},function(resp){


  if(resp['status'] == "Success"){
      loadGroup();
      $scope.modal2.remove();
       loadGroup();
    $scope.showclassscreen();
    $scope.showgroupscreen()
     }

});
$scope.modal.hide();// to hide the template
}
else if(url == '/awardmultiple/class')
{
 var data = {"id":studentId,"pointweight":this.item.pointweight,"class_id":stored_classId};
  data = JSON.stringify(data);
//api calling to update the points in student  
ajaxloader.loadURL(global.config['api_url']+url+'?token='+Service_Store.getLocal('app_token'),
{
  data : data
},function(resp){


  if(resp['status'] == "Success")
  {
    $scope.footer  = false;
    $scope.addmultiple = true;
    $scope.classroom   = false;
    $scope.addmultiplescreen = true;
    $scope.selectstudent = true;
    $scope.selectone = false;
    loadGroup();
  }

});
$scope.modal.hide(); 
  }
 }

}
else{
 global._alert({template: 'Please add some students in group to give them rewards', dependency:$ionicPopup});
  return;
}
}



$scope.selectmultiple = function(){

  $scope.footer = true;
  $scope.addmultiple = false;
  $scope.classroom = true;
  $scope.addmultiplescreen = false;
  $scope.selectstudent = false;
  $scope.studentselected = true;
  $scope.selectone = true;

  }
$scope.addgroup_close = function()
{
  
$scope.modal.remove();

}

$scope.opengroupmenu=function(){
$scope.popover_item=[{name:"Delete Group"},{name:"Edit Group"}];

  var template = '<div><ul class="list"><li class="item" on-tap="deletegroup()"><a>Delete Group</a></li><li class="item" on-tap="editgroup()"><a>Edit Group</a></li></ul></div>';

    myPopup = $ionicPopup.show({
      template: template,
      title: 'Group Settings',
      subTitle: '',
      scope: $scope,
      buttons: [{ 
                  text: 'Close',
                  type: 'button-default'
               }]
    });

}

$scope.deletegroup = function()
{
  console.log(1244);
ajaxloader.loadURL(global.config['api_url']+'/groupinfo/delete?token='+Service_Store.getLocal('app_token'),
{
  class_id:stored_classId,
  group_id:$scope.group_id
},function(resp){


  if(resp['status'] == "Success")
  { window.plugins.toast.show('Goup deleted', 'short', 'center');
    loadGroup();
    myPopup.close();
    $scope.showclassscreen();
    $scope.showgroupscreen()
    Service_Store.removeKey('groupinfo');
    Service_Store.removeKey('groupdata');
    loadGroup();
    $scope.closepopup();
    
    // group successfully deleted;
  }

});
  
}


$scope.editgroup = function()
{
  console.log(12);
myPopup.close();
$scope.closepopup();
$scope.openAddGroup();
$scope.groupinfo = [];
$scope.groupinfo.push({'groupName':$scope.groupName,'groupid':$scope.group_id});
Service_Store.setLocal('groupinfo',JSON.stringify($scope.groupinfo));
}

}]);

 