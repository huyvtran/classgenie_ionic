var story_student = angular.module('starter');

story_student.controller('student_storyCtrl',['$scope','$window','$location','$ionicPopup','$ionicPopover','$state','$ionicModal','$ionicHistory','$http','$ionicLoading',function($scope,$window,$location,$ionicPopup,$ionicPopover,$state,$ionicModal,$ionicHistory,$http,$ionicLoading){
loader.dependency = $ionicLoading;


var stored_classId=Service_Store.getLocal('das_classid');
var studentNo=Service_Store.getLocal('classStory_st_no');
var parent_acc_no=Service_Store.getLocal('classStory_pt_no');
var story_status=Service_Store.getLocal('classStory_status');
var user_name=Service_Store.getLocal('das_username');
$scope.file = global.config['file_url'];
var memberNo=Service_Store.getLocal('das_member_no');
$scope.imagePath = global.config['file_url']+global.config['image_path'];
$scope.videoPath= global.config['video_path']+global.config['image_path'];

var studentcode=Service_Store.getLocal('studentcode');
var userImage=Service_Store.getLocal('das_userimage');
$scope.pagecount=1;



$scope.removeDollerChar = function(string){
   return string.replace('$','?');
} 
 $scope.video = function (videoId) {
  return  $scope.imagePath+'class_stories/'+videoId;
};

$scope.postStory  = function()
{

$state.go('studentstory_post');

}

if(userImage=="" || userImage== undefined ){
            $scope.imgURI="img/chat_user.png"+"?"+global.randomNumber();
   
          }else{
                     $scope.imgURI=global.config['file_url']+global.config['image_path']+'profile_image/'+userImage+"?"+global.randomNumber();

          }





// api calling for classpost data
 loadData=function(){
  
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.async=false;
   ajaxloader.load(global.config['api_url']+'/studentstory/postlist?token='
    +Service_Store.getLocal('app_token')+"&student_no="+studentcode+"&class_id=" +"&page_number="+$scope.pagecount,
    function(resp){
           var res1=$.parseJSON(resp);
          if(res1.status == "Success")
          {
            $scope.items=res1.user_list;
          
           for(var i=0;i<res1.user_list.length;i++){
                 if(res1.user_list[i]['status']){
                    for(var j=0;j<res1.user_list[i]['status'].length;j++){
                       if(res1.user_list[i]['status'][j]['member_no'] == memberNo){
                           if(res1.user_list[i]['status'][j]['status'] == '0')
                               $scope.items[i]['liked'] = 0;
                           else
                             $scope.items[i]['liked'] = 1;
                       }
                       else
                       {
                          $scope.items[i]['liked'] = 0;
                       }
                    }
                 }
                 else
                 {
                    $scope.items[i]['liked'] = 0;
                 }
         }
 
         


        }else{
           global._alert({template:"No post available now..", dependency:$ionicPopup});

        }  
           ajaxloader.async=true;
      });
}


 
  loadData();
 

   //open post page
       $scope.openPost=function(){
         $window.location.href ='#/studentstory_post';

       }   

       //open comment page
       $scope.openCommentPage=function(){
        var storyId=this.item.id;
          Service_Store.setLocal('teacher_post_id',storyId);
          
  
       }
     //like the post
     $scope.openLikePage=function(index){
        var liked_status = $('#hid_liked_status_'+index).val();
        var storyId=this.item.id;
        global.checkNetworkConnection($ionicPopup);
        ajaxloader.async=false;
        ajaxloader.loadURL(global.config['api_url']+'/classstories/likes?token='+Service_Store.getLocal('app_token'),
          {
            story_id:storyId,
            class_id: stored_classId,
            member_no:memberNo,
            status: (liked_status == '1' ? "-1" : "1"),
            sender_ac_no:memberNo

          },function(resp){
              ajaxloader.async=true;
              if(resp['status'] == "Success")
              {
                 if(liked_status == '1'){
                    $('#hid_liked_status_'+index).val(0);
                    $('#liked_id_'+index).removeClass('clicked-color');
                 }
                 else
                 {
                    $('#hid_liked_status_'+index).val(1);
                    $('#liked_id_'+index).addClass('clicked-color');
                 }
                 $('#like_icon_'+index).html(resp['user_list'][0]['likes']);
              }else{
                global._alert({template: "No post liked", dependency:$ionicPopup});
              }

            });
  }


// open like list page
$scope.likes=function(){
     var storyId=this.item.id;
     $ionicModal.fromTemplateUrl('templates/like_listpage.html', {
     scope: $scope
  }).then(function(modal) {
     $scope.modal = modal;
     $scope.modal.show();
  });

//getting like list
  global.checkNetworkConnection($ionicPopup); 
  ajaxloader.async = false;
  ajaxloader.load(global.config['api_url']+'/classstories/likesList?token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId+"&story_id="+storyId,
  function(resp){
  var res1=$.parseJSON(resp);
  if(res1.status == "Success")
    {
      
      var data1 = res1.like_list;
      $scope.like_list_items =data1; 
      for(var i=0;i<data1.length;i++){
       $scope.name=data1[i].name;
       $scope.imageName=data1[i].image;
     
       var s=$scope.imageName;
       var fields = s.split( '_' );
       $scope.list_image=fields[1];
    

       var b= $scope.list_image;
       
       var c=b.split( '0' );
       var check_image=c[0];
       if(check_image==2){

        $scope.img =$scope.imagePath+'profile_image/'+$scope.imageName;
       }else{

        $scope.img =$scope.imagePath+'profile_image/'+$scope.imageName;
       }

      }
      ajaxloader.async = true;
     
    }
 });

$scope.goBack_likePage=function(){
  $scope.modal.hide();
}

}
   

   //open comment menu 
 $scope.openCommentMenu=function($event){
  var storyId=this.item.id;
  Service_Store.setLocal('teacher_post_id',storyId);

  $scope.popover_items=[{name:"Edit"},{name:"Delete"}];
    var template = '<ion-popover-view class="post_dropdown">'
    +'<ul class="list post_drop_list">'
    +'<li class="item" ng-click="editPost()"><a>Edit </a></li>'
    +'<li class="item" ng-click="deletePost()"><a>Delete</a></li>'
    +'</ul>'
    +'</ion-popover-view>';

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

 //function for open edit post
    $scope.editPost=function(){
      $scope.popover.hide();
    
    $state.go('edit_studentstory');
    }
  // function for delete post  
    $scope.deletePost=function(){
      var storyId= Service_Store.getLocal('teacher_post_id');
     
      $scope.popover.hide();
      ajaxloader.async=false;
      ajaxloader.loadURL(global.config['api_url']+'/classstories/delete?token='+Service_Store.getLocal('app_token'),
      {
       id:storyId
      
      },function(resp){
           ajaxloader.async=true;
           if(resp['status'] == "Success")
            {
              global._alert({template: "Post deleted successfully..", dependency:$ionicPopup});
              loadData();

              }else{
              global._alert({template: "Post not deleted..", dependency:$ionicPopup});
            }
      });
       
    }
}

$scope.pagging=function(){

$scope.pagecount=$scope.pagecount+1;
loadData();

}
}]);

back_studentstory = function(){
   window.location.href = '#/student_story';
}
