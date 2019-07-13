var addGroup = angular.module('starter');

addGroup.controller('addGroupCtrl',['$scope','$location','$window','$ionicModal','$base64','$ionicPopup','$ionicLoading','$cordovaToast','$state',function($scope,$location,$window,$ionicModal,$base64,$ionicPopup,$ionicLoading,$cordovaToast,$state){
 loader.dependency = $ionicLoading;
var stored_classId=Service_Store.getLocal('das_classid');
var data1 = JSON.parse(Service_Store.getLocal('groupdata'));//groupdata
console.log(JSON.parse(Service_Store.getLocal('groupdata')));
console.log(data1);
$scope.imagePath = global.config['file_url'];
$scope.selected = [];
 var message='';
$('#name').hide();
ajaxloader.load(global.config['api_url']+"/classinfo/studentlist?"+'token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId,
  function(resp){
    console.log(resp);
       var res1=$.parseJSON(resp);
       if(res1.status == "Success")
        {
      if((Service_Store.getLocal('groupdata')) == null)
        { 
          $scope.items = res1.class_details.student_list;
        }
      else
       { 
        $scope.checkedStudent(res1.class_details.student_list, data1);
       }
      }
     else if(res1.error_code==1){
       global._alert({template: res1.error_msg, dependency:$ionicPopup});
      }
    });

 
/**
Function to get the names of students present in the group
**/ 
$scope.checkedStudent = function(listStudent, selectedStudent){

    if(Service_Store.getLocal('groupinfo') != '')
    {console.log(100);
      var groupinfo = JSON.parse(Service_Store.getLocal('groupinfo'));
      if(groupinfo == null){
        console.log(102);
        Service_Store.removeKey('groupdata');
      }
       if(groupinfo){
       var group_name = groupinfo[0].groupName;
       $('#groupname').val(group_name);
       $scope.group_id = groupinfo[0].groupid;
     }
    }
              
    $scope.student_name = '';
    $scope.student_no = '';
    if(Service_Store.getLocal('groupinfo')){
    listStudent.forEach(function(list_student, index){
       selectedStudent.forEach(function(selected_student, index1){
           if(list_student.student_no == selected_student.student_no){
              list_student.selected = 1;
              $scope.student_name += list_student.name+',';
              $scope.student_no += list_student.student_no+',';
              $scope.selected.push({"member_no":list_student.student_no,"name":list_student.name ,"id":list_student.id , "pointweight":list_student.pointweight});
              
             // $('#groupname').val()
           }
       });
    });
  }
    $scope.items = listStudent;
    if($scope.student_name != '')
      $scope.student_name = $scope.student_name.substring(0, $scope.student_name.length-1);
    if($scope.student_no != '')
      $scope.student_no = $scope.student_no.substring(0, $scope.student_no.length-1);
    if(Service_Store.getLocal('groupinfo')){
    $('#student_list').val($scope.student_name);
  }
}

/**
Function to select the students on tap for adding them to group
**/ 

$scope.select_student = function(item){
    $scope.student_name = '';
    $scope.student_no = '';
   if($('#stu_'+item.student_no).css("background-color") == '#ccc' || $('#stu_'+item.student_no).css("background-color") == 'rgb(204, 204, 204)'){
       //console.log(8888);
      $('#stu_'+item.student_no).css("background-color","");
      var pos = $scope.selected.indexOf(item.student_no);

      angular.forEach($scope.selected, function(value, key){
      if(value.member_no == item.student_no){
       $scope.selected.splice(key,1);
      }
         
   }); 
   }
   else
   {
     console.log(9999);
       $('#stu_'+item.student_no).css("background-color","#ccc");
       $scope.selected.push({"member_no":item.student_no,"name":item.name ,"id":item.id , "pointweight":item.pointweight});

   }
   $('#studentlist_collection ion-item').each(function(index, ionItem){
      if(ionItem.style.backgroundColor == '#ccc' || ionItem.style.backgroundColor == 'rgb(204, 204, 204)'){
          $scope.student_name += $('#stuname_'+$(ionItem).data('uniqueid')).val()+',';
          $scope.student_no += $('#stuid_'+$(ionItem).data('uniqueid')).val()+',';
      }
   });
    if($scope.student_name != '')
       $scope.student_name = $scope.student_name.substring(0, $scope.student_name.length-1);
    if($scope.student_no != '')
       $scope.student_no = $scope.student_no.substring(0, $scope.student_no.length-1);
     $('#student_list').val($scope.student_name);
     //console.log(36);
     console.log($scope.selected);
}

/**
Function to validate Group Name
**/
  $scope.varify = function()
    {
        if($('#groupname').val().length < 1)
        {

        $('#groupname').css({"border":"2px solid #F83434"});
        $('#name').show();
        return false;

        }else
        $('#groupname').css({"border":""});
        $('#name').hide();
        return true;
    }


/**
Function to Create Group
**/

  var groupdata = [];
  $scope.createGroup=function()
  {console.log(12);
    console.log(Service_Store.getLocal('groupdata'));
    var data = $scope.selected; 
    console.log(90);
    console.log(data);
    if(data.length >  1 && $scope.varify()){
    if(Service_Store.getLocal('groupdata') == null)
    {
   // var message='';
   groupdata = [];
   console.log('in if');
    for(i=0;i<data.length;i++)
      {  
        groupdata.push({'class_id':stored_classId,'student_no':data[i]['member_no'],'group_name':$('#groupname').val()});
      }
      console.log(JSON.stringify(groupdata));
        var lists_value = $base64.encode(JSON.stringify(groupdata));
        global.checkNetworkConnection($ionicPopup);
        ajaxloader.async=false;
        ajaxloader.loadURL(global.config['api_url']+'/groupinfo/addgroup?token='+Service_Store.getLocal('app_token'),
        {
          group:lists_value
        },function(resp){
          console.log(resp);
           if(resp.message=="Failure"){
            global._alert({template: 'Group Name already exists!', dependency:$ionicPopup});
             return;
           }
           else{
            global._alert({template: 'Group Created Successfully!', dependency:$ionicPopup});
            $scope.close_addgroup();
           }
          // return;
        },
        $scope.addResponse

        );
        // ajaxloader.async=true;
        //  message = 'Group created';
        //  window.plugins.toast.show(message, 'short', 'center');
    }
else
    {

 console.log('in else');
  var data = $scope.selected;
  
  for(i=0;i<data.length;i++)
  {  
  groupdata.push({'class_id':stored_classId,'student_no':data[i]['member_no'],'group_name':$('#groupname').val(),'group_id':$scope.group_id});
  }
  var lists_value = $base64.encode(JSON.stringify(groupdata));
  global.checkNetworkConnection($ionicPopup);
  ajaxloader.async=false;
  ajaxloader.loadURL(global.config['api_url']+'/groupinfo/update?token='+Service_Store.getLocal('app_token'),
  {
    group:lists_value
  },$scope.addResponse);
  ajaxloader.async=true;
    groupdata = [];
    //Service_Store.removeKey('groupdata');
    Service_Store.removeKey('groupinfo');
    message = 'group updated successfully';
    }
  }    else
      { 
        if(data.length <  2)
        {
        global._alert({template: 'Add more than one students to the group', dependency:$ionicPopup})
        }
       if($('#groupname').val() == '')
         {
          $('#groupname').css({"border":"2px solid #F83434"});
         }
      }
}


$scope.addResponse = function(resp)
{
  console.log(78);
  console.log(resp);
    if(resp['status'] == "Success")
    { Service_Store.setLocal('grpscreen',1);
      $scope.close_addgroup();
      window.plugins.toast.show(message, 'short', 'center');
    }else if(resp.error_code==1){
     global._alert({template: resp.error_msg, dependency:$ionicPopup});
    }
    else{
      global._alert({template: 'Group Name already exists!', dependency:$ionicPopup});
          
    }
}

$scope.close_addgroup = function()
{
  $window.location.href = '#/tab/'+stored_classId+'/classroom';
  
}
 }]);
