var app = angular.module('starter');
app.controller('studcontroller',['$scope','$ionicPopover','$window','$ionicModal','$ionicPopup','$ionicLoading','$cordovaToast','$state',function($scope,$ionicPopover,$window,$ionicModal,$ionicPopup,$ionicLoading,$cordovaToast,$state){
loader.dependency = $ionicLoading;

$scope.disconnected = true;
$scope.activated = true;
$scope.message = true;
var data = Service_Store.getLocal('parentdata');
var student_data = JSON.parse(data);
$scope.imagePath =global.config['file_url']+global.config['image_path'];
$scope.photo_image = (student_data[0]['image'] == "" ? global.config['file_url']+global.config['image_path']+'image/no_image.gif' : global.config['file_url']+global.config['image_path']+'profile_image/'+student_data[0]['image'])+'?'+Math.random(); 
$scope.student   = student_data[0];
//console.log('test');
//console.log($scope.student['status']);
$scope.username  = $scope.student['username'];
$scope.member_no = $scope.student['member_no'];
$scope.status = $scope.student['status'];
Service_Store.setLocal('das_student_no',$scope.member_no);
Service_Store.setLocal('das_username',$scope.username);
Service_Store.setLocal('stud_username',$scope.username);
Service_Store.setLocal('stud_status',$scope.status);

var deviceId=Service_Store.getLocal('das_device_id');
var member_no = Service_Store.setLocal('das_member_no');
/*
Function to fetch all studentsList class data
*/
  $scope.getData = function()
  { 
  $state.go('viewstudent_Report');
  }


  $scope.notification_setting = function(){
    $state.go('notification_setting_students');
  }

  $scope.addcode = function()
    {
    $('input .parent_box').css({"border":"2px solid #d62626"});
    }
 
$scope.getStudentClassList = function()
{
ajaxloader.load(global.config['api_url']+'/student/studentlist?token='+Service_Store.getLocal('app_token')+"&student_ac_no="+$scope.member_no,
  function(resp){
  var res1=$.parseJSON(resp);
  if(res1.status == "Success")
    {     
      $scope.mylist_data = res1.student_list;
      Service_Store.setLocal('studentNo',res1.student_list[0].student_no);
      
      ajaxloader.async = true;
      $scope.disconnected = true;
      if(res1.student_list.length >0)
      {
        if(Service_Store.getLocal('studentcode') === null)
        {
         Service_Store.setLocal('studentcode',res1.student_list[0].student_no);
         Service_Store.setLocal('parentcode',res1.student_list[0].parent_no);
         
        }
      }
      if(res1.student_list.length >0)
      {
        $scope.code = res1.student_list[0].student_no;
        $scope.parentcode = res1.student_list[0].parent_no;
        $scope.student_name = res1.student_list[0].name;
      }
    }
    if(res1.status == "Failure"){
      $scope.disconnected = false;
      Service_Store.removeKey('studentcode');
      Service_Store.removeKey('parentcode');
      //return;
    }
    else if(res1.error_code==1){

        global._alert({template: res1.error_msg, dependency:$ionicPopup});

      }
 });     // condition and code to check whether student has been activated ot not by parent
        if($scope.student['status'] == '0')
        {

           ajaxloader.load(global.config['api_url']+'/teacher/search?token='+Service_Store.getLocal('app_token')+"&member_no="+$scope.member_no,

        function(resp){
        var res1=$.parseJSON(resp);
        if(res1.status == "Success"){
        if(res1.user_list.status == 1){
            $scope.unverified = true;
            $scope.verified = false;
            $scope.student['status'] = '1';
            var newdata = JSON.stringify(student_data);
            Service_Store.setLocal('parentdata',newdata);
            var message  = 'You account has been activated by your parent';
            window.plugins.toast.show(message, 'short', 'center');

          }
          } else if(res1.error_code==1){

            global._alert({template: res1.error_msg, dependency:$ionicPopup});

          }
         }); 

        }
}

$scope.getStudentClassList();
// IF condition to check whther the student is activated by the parent or not

if($scope.student['status'] == '' || $scope.student['status'] == 0)
{ 
   $scope.unverified = false;
   $scope.verified = true;
   $scope.nograph = false;
   $scope.graph = true;
   $scope.stud_class = true;
   if(Service_Store.getLocal('studentcode') === undefined)
   { 
    global._alert({template: 'no class connected! add student code', dependency:$ionicPopup});
   }
   else
   {
    $scope.code = Service_Store.getLocal('studentcode');
    $scope.parentcode = Service_Store.getLocal('parentcode');
   }
   
  $scope.shownotice = function(){   // Function to send email request to parent for account activation 
   $scope.getStudentClassList();
   if(Service_Store.getLocal('studentcode') === undefined /*$scope.code == undefined || $scope.parentcode == undefined*/)
   { global._alert({template: 'no class connected! add student code', dependency:$ionicPopup});
     $('input .parent_box').css({"border":"2px solid #d62626"});
    //$scope.addcode();

   }else{
    var layout='<input type="email" ng-model="data.email" placeholder="parent email address">';
        $scope.data = {};
        $scope.myPopup = $ionicPopup.show({
        template: layout,
        title: 'Classgenie',
        subTitle: '<h4>Enter '+$scope.username+"'s "+'Parent Email address<h4>',
        scope: $scope,
        buttons: [{ 
        text: 'Close',
        type: 'button-default'
        },{text: 'Invite',
        type: 'button-positive',
         onTap: function(e) {
          if (!$scope.data.email) {
           e.preventDefault();
          } 
           else {
          $scope.parentemail = $scope.email;
                   global.checkNetworkConnection($ionicPopup);
                   ajaxloader.async=false;
                   ajaxloader.load(global.config['api_url']+'/sendmail?'+'token='+Service_Store.getLocal('app_token')+"&email="+ $scope.data.email+"&id=4"+"&student_name="
                     +$scope.student_name+"&student_no="+$scope.code+'&parent_no='+$scope.parentcode,
                   function(resp){
                   ajaxloader.async=true;
                   var res1=$.parseJSON(resp);
                   console.log(res1);
                   if(res1.mail_flage == "teacher")
                     {
                      global._alert({template: 'This email id already exists as a teacher id', dependency:$ionicPopup});
                      return;
                     }else{              
                   var message  = 'invitation sent successfully  to '+$scope.username+"'s"+'parent';
                    window.plugins.toast.show(message, 'short', 'center');
                   //$window.location.href = '#/st_home/studentinvite';
                   $scope.myPopup.close();
                   }
                   });
                  return $scope.parentemail;

                }
                                    
          }

        }]
    });
  }  
};

    if(Service_Store.getLocal('signup') == '1'){
        Service_Store.removeKey('signup');
        $scope.shownotice();
    }
}
else
{
   $scope.unverified = true;
   $scope.verified = false;
   $scope.nograph = true;
   $scope.graph = false;
   $scope.stud_class = false;
  $('#chart-container').show();
}

/**
// function to open up class slection popup in list view
***/


//$scope.getData(student);
/**
// function to open up side menu item 
***/
$scope.openSideMenu=function($event){
$scope.popover_items=[{name:"Account Settings"},{name:"School Story"}];
  var template = '<ion-popover-view class="dropdownsetting popover none1 ng-enter active ng-enter-active"><ion-content>'
  +'<ul class="list" >'
  +'<li class="item" on-tap="stdentsettting()"><a>Account Settings</a></li>'
  +'<li class="item" on-tap="school_story()"><a>School Story</a></li>'
  +'</ul>'
  +'</ion-content></ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });


  $scope.popover.show($event);

  $scope.closePopover = function() {
    $scope.popover.hide();
  };

  $scope.$on('popover.hidden', function() {
     // Execute action
   });

  $scope.openStudentList=function(){
      $scope.closePopover();
      $window.location.href = '#/editstudentlist';
    }

  $scope.stdentsettting=function(){
       $scope.closePopover();
       $window.location.href = '#/stud_account';
    }  

   $scope.school_story=function(){
    if($scope.status==1){
    $scope.closePopover();
    $window.location.href = '#/school_story_in_student';
  } else{
    $scope.closePopover();
    global._alert({template: 'Please get your account approval from your parents first!', dependency:$ionicPopup});
  }
   }
 


};

$scope.deviceRegister=function(){
  console.log($scope.member_no);
    global.checkNetworkConnection($ionicPopup);
    ajaxloader.async=false;
    ajaxloader.loadURL(global.config['api_url']+'/save_deviceid?token='+Service_Store.getLocal('app_token'),
    {
      member_no:$scope.member_no,
      device_id:deviceId
    },function(resp){
     ajaxloader.async=true;
     });
    }
$scope.deviceRegister();//calling function for register device id

/**
// function to open up change password wodel view popup screen
***/
$scope.changeStudentPassword = function()
{

$ionicModal.fromTemplateUrl('templates/changepassword.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
    });  
}

$scope.changePhoto = function(){

    $state.go('student_update_photo');
 }


/**
// function to open up add remove student class wodel view popup screen
***/


$scope.closeEditStudent = function()
{

$scope.closeStudent();

}

$scope.closecheckcode = function()
{ 
  $scope.close();
}
// student


$scope.removeStudent = function(item)
{     var confirmPopup = $ionicPopup.confirm({
     title: '<img src="img/alert.png" class="alert"/><b>Classgenie</b>',
     template: 'class '+item.class_name+' will be removed!'
   });

   confirmPopup.then(function(res) {
     if(res) {
       ajaxloader.async = false;
  ajaxloader.loadURL(global.config['api_url']+'/student/disconnect?token='+Service_Store.getLocal('app_token')+"&student_no="+item.student_no,
    {

    },$scope.removeResponse = function(resp){
            if(resp['status'] == "Success"){
               $scope.mylist_data = '';
               $scope.getStudentClassList();
              }
            else if(resp['status'] == "Failure")
            {  
              global._alert({template: 'can not remove student code', dependency:$ionicPopup});
            }
         }); 
     } else {
       return false;
     }
   });
  
}



$scope.addstudentcode = function()
{ var studentcode = $('#stu_code').val();
  ajaxloader.loadURL(global.config['api_url']+'/student/addstudentcode?token='+Service_Store.getLocal('app_token')+'&student_no='+studentcode+'&student_ac_no='+$scope.member_no,
      {
      },$scope.studentSignupResponse = function(resp){
          if(resp['status'] == "Success"){
             $scope.getStudentClassList();
             var message  = 'student code added successfully';
             window.plugins.toast.show(message, 'short', 'center');
          }
          else if(resp['status'] == "Failure")
          {  
            global._alert({template: 'Invalid student code', dependency:$ionicPopup});
          }
       });
}

$scope.curr_day = function() {
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var n = weekday[d.getDay()];
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

   today = mm+'/'+dd+'/'+yyyy;
   $scope.date = n + ' ' + today;
   var date = global.currenDate();
   var month = date.split("-");
   month = month[1];
   $scope.currday = n + ' , ' +  dd + ' ' + month

}
$scope.curr_day();
 $scope.logout = function()
   {

      try{
        var deviceId = Service_Store.getLocal('das_device_id');
        var app_token =  Service_Store.getLocal('app_token');
        Service_Store.clearAll();
        Service_Store.setLocal('das_device_id', deviceId);
        Service_Store.setLocal('app_token', app_token);
        $state.go('login');
        global._alert({template: 'Successfully logged Out!', dependency:$ionicPopup});
        classmessage_socket.disconnect();
        }
        catch(ex){}
   }

$scope.deleteaccount = function()
{

    var confirmPopup = $ionicPopup.confirm({
     title: '<img src="img/alert.png" class="alert"/><b>Classgenie</b>',
     template: 'Are you sure you want to delete your account '
   });

   confirmPopup.then(function(res) {
     if(res) {


ajaxloader.loadURL(global.config['api_url']+'/student/delete?token='+Service_Store.getLocal('app_token')+'&member_no='+$scope.member_no,
      {
      },$scope.studentDeleteResponse = function(resp){
          if(resp['status'] == "Success"){
            ajaxloader.async = true;
             $scope.logout();
             var message  = 'Account has been deleted';
             window.plugins.toast.show(message, 'short', 'center');
             //$state.go('login');
          }
          else if(resp['status'] == "Failure")
          {  
            window.plugins.toast.show(message, 'short', 'center');
          }
          else
          {
           global._alert({template: resp.error_msg, dependency:$ionicPopup});

          }
       });}
      else{
        return false;
        }
      });
 
 }

  $scope.openTerms = function()
    {
        $ionicModal.fromTemplateUrl('templates/terms.html', {
        scope: $scope,
        animation: 'slide-in-up'
        }).then(function(modal) {
        $scope.modal3 = modal;
        $scope.modal3.show();
        });
    };

    $scope.openNotification=function(){
    $state.go('notification_student_setting');
 }
    

  $scope.closePrivacy = function()
    {
        $scope.modal3.remove();
    }
 
    //function for open student story
   $scope.openStudentStory=function(){
    $scope.closePopover();
    $state.go('student_story');
   }

   //back button for student setting page
   $scope.backtodashboard=function(){
     $window.location.href = '#/st_home/studentinvite'
    }

}]);
/***STUDENT PERFORMANCE REPORT VIEW CONTROLLER*****/




