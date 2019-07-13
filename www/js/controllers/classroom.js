var classroom = angular.module('starter');

/**
 *Define classroom controller
 */
classroom.controller('classroomCtrl',['$scope','$window','$location','$state','$ionicPopup','$ionicModal','$ionicHistory','$ionicLoading','$ionicPopover','$ionicLoading','$cordovaToast','$timeout',function($scope,$window,$location,$state,$ionicPopup,$ionicModal,$ionicHistory,$ionicLoading,$ionicPopover,$ionicLoading,$cordovaToast,$timeout){
      loader.dependency = $ionicLoading;
      $scope.footer = false;
      $scope.addmultiple = true;
      $scope.classroom = false;
      $scope.addmultiplescreen = true;
      $scope.selectstudent = true;
      $scope.selectone = false;
      $scope.selectallcheck = true;
      $scope.selectall   = true;
      $scope.wholeclass  = false;
      $scope.showstudent = false;
      $scope.showgroup   = true;
      $scope.posbutton   = "award_tab";
      $scope.needbutton  = "";
      $scope.disablegroup = false;
      $scope.positive = true; 
      $scope.studbutton = false;
      $scope.groupbutton = false;
      Service_Store.removeKey('groupdata');
      Service_Store.removeKey('groupinfo');
      var stored_classId=Service_Store.getLocal('das_classid');
      Service_Store.setLocal('datetoken','today');
      $scope.imagePath =global.config['file_url']+global.config['image_path'];

     /**
      *api calling loader for classroom data
      */  
      $scope.show = function() {
          $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner>'
          }).then(function(){
          });
      };

      $scope.hide = function(){
          $ionicLoading.hide().then(function(){
          });
      };

 /**
  *api calling for classroom data
  */  
  loadstudent = function(){
        global.checkNetworkConnection($ionicPopup);
        ajaxloader.async=false;
        ajaxloader.load(global.config['api_url']+"/classinfo/studentlist?"+'token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId,
          function(resp){
        ajaxloader.async=true;
        var res1=$.parseJSON(resp);
        if(res1.status == "Success")

          { 
            var class_studentlist =res1.class_details.student_list;
            $scope.className=res1.class_details.class_name;
            $scope.classImage=res1.class_details.image;
            $scope.classPoints=res1.class_details.pointweight;
            $scope.items = class_studentlist;
            var classgrade =res1.class_details.grade;
            //store data in local storage
            Service_Store.setLocal('das_classname', $scope.className);
            Service_Store.setLocal('das_classImage', $scope.classImage);
            Service_Store.setLocal('das_classGrade', classgrade);
          }else if(res1.error_code==1){

            global._alert({template: res1.error_msg, dependency:$ionicPopup});
            }
         });
   }
   

    $scope.doRefresh = function() {
         loadstudent();
         //Stop the ion-refresher from spinning
         $scope.$broadcast('scroll.refreshComplete');
    };

    //open popup right side menu
    $scope.openSideMenu=function($event){

        $scope.popover_items=[{name:"Edit Skill"},{name:"Edit Student"},{name:"Edit Classname"},
        {name:"Invite Parents"},{name:"Pending Stories"}];


        var template = '<ion-popover-view class="dropdownsetting classroom_pouup"><ion-content>'
        +'<ul class="list">'
        +'<li class="item" on-tap="openEditClass()"><a>Edit/Remove class</a></li>'
        +'<li class="item" on-tap="openStudentList()"><a>Edit students</a></li>'
        +'<li class="item" on-tap="openEditskill()"><a>Edit skills</a></li>'
        +'<li class="item" on-tap="inviteparent()"><a>Invite Parents</a></li>'
        +'<li class="item" on-tap="pending_story()"><a>Pending Stories</a></li>'
        +'<li class="item" on-tap="assignment_list()"><a>Assignment List</a></li>'
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
            $scope.popover.hide();
            $window.location.href = '#/editstudentlist';
        }

        $scope.openEditskill=function(){
             $scope.popover.hide();
             $window.location.href = '#/editskills';
        }

        $scope.openEditClass=function(){
             $scope.popover.hide();
             $window.location.href = '#/editclass_name';
        }

        $scope.inviteparent = function()
        {
          $state.go('inviteparent');
          $scope.closePopover();
        }
   }

  //open student reward popup
  $scope.openStudentReward=function(multiple){
        var stored_classId=Service_Store.getLocal('das_classid');
        var memberNO= Service_Store.getLocal('das_member_no');
        if(multiple == undefined){
            var studentId = this.item.id;
            var studentNo=this.item.student_no;
            var url = '/points/student/update';
        }
        else
        {
            var studentId = multiple
            var url = '/awardmultiple/class'
        }
        $scope.student = this.item.name;
        $scope.positiveButton();
        $ionicModal.fromTemplateUrl('templates/awardpopup.html', {
          scope: $scope
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });

        var stored_classId=Service_Store.getLocal('das_classid');
        global.checkNetworkConnection($ionicPopup);
        ajaxloader.async = false;
        ajaxloader.load(global.config['api_url']+'/points/student?token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId,
        function(resp){
            var res1=$.parseJSON(resp);
            if(res1.status == "Success"){
                $scope.needwork = false;
                $scope.positive = true;
                var data1 = res1.user_list;
                $scope.award_items = data1; 
                $scope.needwork_items = res1.needwork;
                ajaxloader.async = true;
              }
              else if(res1.error_code==1){
                 global._alert({template: res1.error_msg, dependency:$ionicPopup});
              }
       });

        //close award popup
        $scope.closeAwardPopUp=function(){
            $scope.modal.hide();
        }

        //give points to students
        $scope.giveReward=function(){
         if(url == '/points/student/update'){
              //api calling to update the points in student 
              global.checkNetworkConnection($ionicPopup); 
              ajaxloader.loadURL(global.config['api_url']+url+'?token='+Service_Store.getLocal('app_token'),
              {
                id:studentId,
                pointweight: this.item.pointweight,
                customize_skills_id:this.item.id,
                class_id:stored_classId,
                student_no:studentNo
              },function(resp){


                if(resp['status'] == "Success"){
                     loadstudent();
                   }else if(resp.error_code==1){

                    global._alert({template: resp.error_msg, dependency:$ionicPopup});
                    }

              });
              $scope.modal.hide();// to hide the template
        }
        else if(url == '/awardmultiple/class')
        {
                 var data = {"id":studentId,"pointweight":this.item.pointweight,"class_id":stored_classId,"customize_skills_id":this.item.id};
                  data = JSON.stringify(data);
                 //api calling to update the points in student 
                 global.checkNetworkConnection($ionicPopup); 
                 ajaxloader.loadURL(global.config['api_url']+url+'?token='+Service_Store.getLocal('app_token'),
                 {
                    data : data
                 },function(resp){
                    if(resp['status'] == "Success"){
                                   $scope.footer = false;
                              $scope.addmultiple = true;
                                $scope.classroom = false;
                         $scope.addmultiplescreen = true;
                            $scope.selectstudent = true;
                                $scope.selectone = false;
                              $state.go('tab.classroom', {}, { reload: true });
                     }
                     else if(resp.error_code==1){
                         global._alert({template: resp.error_msg, dependency:$ionicPopup});
                      }
                });
                $scope.modal.hide(); 
          }
      }
  }

 //give points to whole class
  $scope.openClassReward=function(){
        $scope.positiveButton();
        var stored_classId=Service_Store.getLocal('das_classid');
        ajaxloader.load(global.config['api_url']+'/points/class/?token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId,
        function(resp){
              var res1=$.parseJSON(resp);
              if(res1.status == "Success"){ 
                  $scope.positive = true;
                  $scope.needwork = false;
                  $scope.class_award_items = res1.user_list; 
                  $scope.needwork_items = res1.needwork;
                  ajaxloader.async = true;
              }else if(res1.error_code==1){
                  global._alert({template: res1.error_msg, dependency:$ionicPopup});
              }
              $scope.close_classreward = function(){
                  $('#posit').addClass('posbutton');
                  $scope.modal.remove();
              }
          });

        $ionicModal.fromTemplateUrl('templates/class_award_popup.html', {
              scope: $scope
            }).then(function(modal){
             $scope.modal = modal;
             $scope.modal.show();
         });
  }

 //Update the whole class points
    $scope.wholeClassReward=function(){
        //update the points in student
        global.checkNetworkConnection($ionicPopup);
        ajaxloader.loadURL(global.config['api_url']+'/points/class/update?token='+Service_Store.getLocal('app_token'),
        {
          pointweight:this.item.pointweight,
          customize_skills_id:this.item.id,
          class_id:stored_classId

        },function(resp){
            if(resp['status'] == "Success"){
                $scope.doRefresh();
            }
        });
        $scope.modal.hide();// to hide the template
   }

  //add student in current class
  $scope.addStudent=function(){
      $window.location.href = '#/addstudent';
      Service_Store.setLocal('das_classBack',"classback");
  }

  //close class popup
  $scope.closeClassPopup=function(){
      $scope.modal.hide();
  }

  $scope.goBack = function() {
     $state.go('dashboard'); //load dashboard
  };

  $scope.positiveButton=function(){
      $scope.posbutton = "award_tab";
      $scope.needbutton = "";
      $scope.positive = true;
      $scope.needwork = false;
  }

  $scope.needButton = function(){
      $scope.posbutton = "";
      $scope.needbutton = "award_tab";
      $scope.needwork = true;
      $scope.positive = false;
  }

  //open add group page
  $scope.openAddGroup=function(){
     $window.location.href ='#/add_group';
  };

  $scope.selectmultiple = function(){
      $scope.studbutton = true;
      $scope.groupbutton = true;
      $scope.disablegroup = true;
      $scope.footer = true;
      $scope.feedback_tab = true;
      $scope.addmultiple = false;
      $scope.classroom = true;
      $scope.addmultiplescreen = false;
      $scope.selectstudent = false;
      $scope.studentselected = true;
      $scope.selectone = true;
      $scope.selectallcheck = false;
      $scope.check = "Select All";
      $scope.wholeclass = true;
  };

  $scope.closeawardmultiple = function(){  
       $('#selectall').prop("checked",false);
       $scope.selected(1);
       $scope.studbutton = false;
       $scope.groupbutton = false;
       $scope.disablegroup = false;
       $scope.footer = false;
       $scope.feedback_tab = false;
       $scope.addmultiple = true;
       $scope.classroom = false;
       $scope.addmultiplescreen = true;
       $scope.selectstudent = true;
       $scope.studentselected = false;
       $scope.selectone = false;
       $scope.selectallcheck = true;
       $scope.check = "";
       $scope.wholeclass = false;
  }

  $scope.addpoint = [];
  $scope.selected = function(item){ 
    $scope.item = {};
    if(item == 1){ 
         if($('#selectall').prop("checked")){  
              $scope.check = "Deselect All";
              $scope.items.forEach(function(entry) {
                 $('#item_'+entry['id']).prop("checked",true);
                 $("#check_"+entry['id']).css({"background-color":"#ccc"});
                 var pos = $scope.addpoint.indexOf(entry['id']);
                 if(pos == 1){
                    $scope.addpoint.splice(pos);
                 }
                 $scope.addpoint.push(entry['id']);
                 var pos1 = $scope.addpoint.indexOf(entry['id'])
              });
              $scope.studentselected = false;
              $('#multiple').css({"background-color":"rgb(40, 90, 69)","color":"#fff"});
}
       else
       {    
             $scope.check = "Select All";
             $scope.items.forEach(function(entry) {
                 $('#item_'+entry['id']).prop("checked",false);
                 $("#check_"+entry['id']).css({"background-color":""});
                 $scope.addpoint = [];
             });
             $scope.studentselected = true;
             $('#multiple').css({"background-color":"#fff","color":"#000"});
       } 
  }
  else
  {
        $('#selectall').prop("checked",false);
        if($('#item_'+item).prop("checked"))
        {
          $("#check_"+item).css({"background-color":"#ccc"})
          $scope.addpoint.push(item);
          $scope.studentselected = false;
           $('#multiple').css({"background-color":"rgb(40, 90, 69)","color":"#fff"});
        }
        else
        {
          $("#check_"+item).css({"background-color":""})
          var index = $scope.addpoint.indexOf(item);
          if(index > -1)
          {
            $scope.addpoint.splice(index,1);
            if($scope.addpoint.length < 1)
            {
              $scope.studentselected = true;
               $('#multiple').css({"background-color":"#fff","color":"#000"});
            } 
          }
        }
    }
    var length   = $scope.items.length;
    $scope.count = length;
    $scope.count = $scope.addpoint.length;
 }

//give points in group
  $scope.awardmultiplestudents = function(){
     var data = $scope.addpoint;
     var id = data;
     if(id.length > 0){
         JSON.stringify(id);
         $scope.openStudentReward(data);
      }
      else if(id.length < 1)
      {
          window.plugins.toast.show('select students to award points', 'short', 'center');
      }
  }

  $scope.checkitem = function(item){
     if($('#item_'+item).prop("checked")){
         $('#item_'+item).prop("checked",false);
         $("#check_"+item).css({"background-color":""})
     }
     else
     {
        $('#item_'+item).prop("checked",true);
        $("#check_"+item).css({"background-color":"#ccc"})
     }
     $scope.selected(item);
 }

$scope.selectAlldiv = function(){
      if(!$('#selectall').prop("checked")){
         $('#selectall').prop("checked",true);
         $scope.selected(1);
      }
      else
      {
         $('#selectall').prop("checked",false);
         $scope.selected(1);
      }
}

$scope.showclassscreen = function(){
    loader.init();
    $timeout(function(){
      loadstudent();
     }, 500);
    $scope.showstudent = false;
    $scope.showgroup   = true;
    $scope.showstud    = "award_tab";
    $scope.showgrp     = "";
    $scope.footer = false;
    $scope.giveaward = false;
}

$scope.showgroupscreen = function(){
    $scope.showstudent = true;
    $scope.showgroup   = false;
    $scope.showstud    = "";
    $scope.showgrp     = "award_tab";
    $scope.footer = true;
    $scope.giveaward = true;
    loader.init();
    $timeout(function(){
       loadGroup();
    }, 500);
}

$scope.showclassscreen();

$scope.takeAttendance=function(){
  $window.location.href='#/attendance_list';
}

$scope.ViewReport = function()
{
  $state.go('viewReport');
}
//pending stories of students
$scope.pending_story=function(){
   $scope.popover.hide();
    $state.go('pending_story_studentlist');
}

$scope.assignment_list=function(){
    $scope.popover.hide();
    $state.go('assignment_list');
}

$scope.closeList = function(){
   $scope.modal.remove();
}

if(Service_Store.getLocal('grpscreen') == 1){
    $scope.showgroupscreen();
    Service_Store.removeKey('grpscreen');
 }

}]);



