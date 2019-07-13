var inviteParent = angular.module('starter');

inviteParent.controller('inviteParentCtrl',['$scope','$window','$location','$ionicPopup','$ionicHistory','$state','$ionicLoading','$cordovaToast',function($scope,$window,$location,$ionicPopup,$ionicHistory,$state,$ionicLoading,$cordovaToast){var jsonObj;
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
   * Function definition for ionic loader
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
   * getting student list according class id
   * api calling for classroom data
   */
var class_studentlist   = '';
$scope.loadStudent = function(){
  ajaxloader.async=false;
  global.checkNetworkConnection($ionicPopup);
  ajaxloader.load(global.config['api_url']+"/classinfo/studentlist?"+'token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId,
  function(resp){
  ajaxloader.async=true;
      var res1=$.parseJSON(resp);
      if(res1.status == "Success")
      {  

        $scope.class_name = res1.class_details.class_name;
        class_studentlist = res1.class_details.student_list;
       
        $scope.items = class_studentlist;
        var count = $scope.items;

        $scope.totalstudents = $scope.items.length;
        var connected = 0;
        count.forEach(function(count){
             
           if(count.request_status>0)
           { 
            connected++;
           }
           $scope.connected = connected;
           var comp = ((connected/$scope.totalstudents)*100);
           if($scope.connected > 0){
              comp = comp+'%';
            $('div.prog').css({'width':''+comp+''});
           }else if($scope.connected < 1){
              comp = '0'+'%';
            $('div.prog').css({'width':''+comp+''});
           }

       });

       if(count < 1)
       {
        $scope.list = "No students in your class";
       }

      }else if(res1.error_code==1){

        global._alert({template: res1.error_msg, dependency:$ionicPopup});

      } 
    });}
$scope.loadStudent();
   /**
     * sent mail to teacher with parent and student code of all tecahers added
     * api calling for classroom data
     */

  //      $scope.showConfirm = function() {
  //       if(class_studentlist.length < 1)
  //       {
  //           global._alert({template: 'add students  to the class', dependency:$ionicPopup});
  //       }else{
  //      var myPopup = $ionicPopup.show({
  //       template: 'Great We just emailed your parent invites to '+userEmail+'',
  //       scope: $scope,
  //       buttons: [
  //       {
  //       text: '<b>Ok</b>',
  //       type: 'button-positive',
  //       onTap: function(e) {
  //       $scope.generateInvitationPdf();
  //       }
  //     }
  //   ]
  // });
  //      }
  //    };
      
      $scope.generateInvitationPdf = function()
      { $scope.show();
        //ajaxloader.async=false;
        global.checkNetworkConnection($ionicPopup);
        ajaxloader.load(global.config['api_url']+'/pdfgenerate?token='+Service_Store.getLocal('app_token')+"&member_no="+member_no+"&class_id="+stored_classId,
                  function(resp){
                  //ajaxloader.async=true;
                  var res1 = JSON.parse(resp);
                  if(res1.status == "Success")
                  { 
                    $scope.inviteAllParents();
                   
                  }else if(resp.error_code==1){

                    global._alert({template: resp.error_msg, dependency:$ionicPopup});
                  }
                  else
                  {
                    return false;
                  }

                  });
      }


      $scope.inviteAllParents = function()
      { 
        global._alert({template: 'Great We just emailed the parent invites for class '+$scope.class_name+' to '+userEmail+'', dependency:$ionicPopup});
        global.checkNetworkConnection($ionicPopup);
         ajaxloader.load(global.config['api_url']+'/sendmail?'+'token='+Service_Store.getLocal('app_token')+"&member_no="+member_no+"&id=1"+"&class_id="
                    +stored_classId,
                  function(resp){
                  ajaxloader.async=true;
                  var res1=$.parseJSON(resp);
                  if(res1.status == "Success")
                  {
                   $state.go('dashboard');
                  }
                  
                  });
         $scope.hide();
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
   }

   $scope.inviteParent=function(id){
     var studentName=this.item.name;
     var parentNo=this.item.parent_no;
    
    $scope.data = {};
    // A popup dialog for select the class icon
    var layout='<input type="email" ng-model="data.email">';
    var myPopup = $ionicPopup.show({
      template: layout,
      title: 'Invite Parent',
      subTitle: '',
      scope: $scope,
      buttons: [{ 
        text: 'Close',
        type: 'button-default'
        },{text: 'Invite',
        type: 'button-positive',
         onTap: function(e) {

          if (!$scope.data.email) {
          //don't allow the user to close unless he enters email
           e.preventDefault();
          } 
           else {
                ajaxloader.async=false;
                  global.checkNetworkConnection($ionicPopup);
                   ajaxloader.load(global.config['api_url']+'/sendmail?'+'token='+Service_Store.getLocal('app_token')+"&email="+$scope.data.email+"&id=3"+"&parent_no="
                    +parentNo+"&teacher_name="+Service_Store.getLocal('das_username'),
                  function(resp){
                  ajaxloader.async=true;
                  var res1=$.parseJSON(resp);
                  console.log(res1);
                  if(res1.status == "Success")
                  { if(res1.mail_flage == "teacher")
                     {
                      global._alert({template: 'This email id already exists as a teacher id', dependency:$ionicPopup});
                     }
                    // else if(res1.mail_flage == "invalidmail")
                    // {
                    //   global._alert({template: 'Invalid Email Id', dependency:$ionicPopup});  
                    // }
                    else
                    {
                     var message = "invitation sent to "+studentName+"'s parent";
                    //  window.plugins.toast.show(message, 'short', 'center'); 
                    global._alert({template: message, dependency:$ionicPopup});
                    $scope.loadStudent();
                    }
                     
                  }
                  });

                  return $scope.data.email;
                }
                                    
              }

           }]
         });
       }

   $scope.inviteBack=function(){
   $ionicHistory.goBack();
  }
}]);


