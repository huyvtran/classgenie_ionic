var comments = angular.module('starter');

comments.controller('schoolpost_commentCtrl',['$scope','$location','$window','$ionicPopup','$ionicPopover','$ionicHistory','$ionicLoading','$state',function($scope,$location,$window,$ionicPopup,$ionicPopover,$ionicHistory,$ionicLoading,$state){
loader.dependency = $ionicLoading;
var stored_classId=Service_Store.getLocal('das_classid');
 $scope.school_id =Service_Store.getLocal('das_school_id');
if(Service_Store.getLocal('school_post')== "storystudent"){
  var stored_memberNo= Service_Store.getLocal('das_student_no');
}else{
     var stored_memberNo= Service_Store.getLocal('das_member_no');
}
var storyId= Service_Store.getLocal('teacher_post_id');
$scope.school =  Service_Store.getLocal('school_name');


$scope.teacher_acno=Service_Store.getLocal('st_tac_no');


$scope.imagePath = global.config['file_url']+global.config['image_path'];

$scope.data={};
$scope.liked=false;
$scope.unliked=true;


loadData=function(){
   ajaxloader.async=false;
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.load(global.config['api_url']+'/schoolstory/allcommentDetail?token='
    +Service_Store.getLocal('app_token')+"&story_id="+storyId+"&teacher_ac_no="+$scope.teacher_acno,
    function(resp){
     ajaxloader.async=true;
     var res1=$.parseJSON(resp);
       if(res1.status == "Success")
        {
          var json =res1.post;
          
          $scope.image=json[0].image;
          $scope.postId=json[0].id;
          $scope.like =json[0].likes;
          $scope.like_status=json[0].status;
          $scope.teacher_ac_no=json[0].teacher_ac_no;
          $scope.message=json[0].message;
          $scope.ext=json[0].ext;
          $scope.teacher_name=res1.teacher_name;
          $scope.items=res1.comment_list;
          $scope.commentCount=$scope.items.length;
          $scope.pathUrl=$scope.imagePath+"school_stories/"+$scope.image;

        }
        else if(resp.error_code==1){

        global._alert({template: resp.error_msg, dependency:$ionicPopup});

       }else{
          global._alert({template: "No post available now..", dependency:$ionicPopup});
        }

      });

}
loadData();
//post comment
$scope.sendMessage=function(){
   

   ajaxloader.async=false;
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.loadURL(global.config['api_url']+'/schoolstory/comment?token='+Service_Store.getLocal('app_token'),
    {
      
      story_id:storyId,
      member_no:stored_memberNo,
      sender_ac_no:stored_memberNo,
      school_id:$scope.school_id,
      comment:$scope.data.message
     },function(resp){
     ajaxloader.async=true;
    if(resp['status'] == "Success")
        {
          global._alert({template: "Comment successfully...", dependency:$ionicPopup});
          loadData();
          
          $scope.data.message="";

          }
          else if(resp.error_code==1){

           global._alert({template: resp.error_msg, dependency:$ionicPopup});

          }else{
            global._alert({template: "Comment not send...", dependency:$ionicPopup});
          }
    });

} 
//open comment menu 
 $scope.openCommentMenu=function($event){

  $scope.popover_items=[{name:"Edit"},{name:"Delete"}];
    var template = '<ion-popover-view class="post_dropdown">'
    +'<ul  class="list post_drop_list">'
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
    
     $window.location.href="#/edit_school_post"
    }
  // function for delete post  
    $scope.deletePost=function(){
      var storyId= Service_Store.getLocal('teacher_post_id');
      $scope.popover.hide();
      ajaxloader.async=false;
      global.checkNetworkConnection($ionicPopup);
      ajaxloader.loadURL(global.config['api_url']+'/schoolstory/delete?token='+Service_Store.getLocal('app_token'),
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
//like the post
  $scope.openLikePage=function(){
 
   var storyId=$scope.postId;
   ajaxloader.async=false;
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.loadURL(global.config['api_url']+'/schoolstory/like?token='+Service_Store.getLocal('app_token'),
    {
      story_id:storyId,
      class_id: stored_classId,
      member_no:stored_memberNo,
      status:"1"

    },function(resp){
     ajaxloader.async=true;

        if(resp['status'] == "Success")
        {
          $scope.liked=true;
          $scope.unliked=false;
         //loadData();
         $state.go('tab.classstory', {}, { reload: true });
        }else{
          global._alert({template: "No post liked", dependency:$ionicPopup});
        }

      });
}

//back button 
$scope.comment_goBack=function(){
    $window.location.href='#/school_story_in_parent';
   
  
}

}]);

