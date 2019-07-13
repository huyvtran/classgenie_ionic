var comments = angular.module('starter');

comments.controller('comment_parentStoryCtrl',['$scope','$location','$window','$ionicPopup','$ionicPopover','$ionicHistory','$ionicLoading','$timeout',function($scope,$location,$window,$ionicPopup,$ionicPopover,$ionicHistory,$ionicLoading,$timeout){
loader.dependency = $ionicLoading;

var stored_classId=Service_Store.getLocal('das_classid');
var post_class_id=Service_Store.getLocal('post_classid');
var stored_memberNo= Service_Store.getLocal('das_member_no');
var storyId= Service_Store.getLocal('teacher_post_id');
 $scope.classn= Service_Store.getLocal('teacher_class');
 $scope.date=Service_Store.getLocal('post_date');
$scope.imagePath = global.config['file_url']+global.config['image_path'];
$scope.data={};
$scope.liked=false;
$scope.unliked=true;
$scope.removeDollerChar = function(string){
   return string.replace('$','?');
} 

loadData=function(){
   ajaxloader.async=false;
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.load(global.config['api_url']+'/classstories/commentDetail?token='
    +Service_Store.getLocal('app_token')+"&story_id="+storyId+"&teacher_ac_no="+stored_memberNo,
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
          $scope.teacher_image=res1.teacher_name[0].image;
          $scope.items=res1.comment_list;
          $scope.commentCount=$scope.items.length;
          $scope.username=json[0].username;

          if($scope.username==""||$scope.username=="undefined"|| $scope.username=="null"){
            $scope.teacher_name=res1.teacher_name[0].name;
          }else{
             $scope.teacher_name=$scope.username;
          }

        }else{
          global._alert({template: "No post available now..", dependency:$ionicPopup});
        }
          $scope.userImage=Service_Store.getLocal('post_userimage');
         var value1= $scope.teacher_ac_no.toString();
         var res = value1.slice(0,1);    
          if(res==4){
               $scope.imagefolder="student_stories";
          }else{
            $scope.imagefolder="class_stories";
          }
           $scope.path_url=$scope.imagePath+$scope.imagefolder+"/"+$scope.image+'?'+global.randomNumber();
      });

}
   loader.init();
   $timeout(function(){
      loadData();
    },500);
$scope.teacher_img=global.config['file_url']+global.config['image_path']+'profile_image/'+ $scope.teacher_image+'?'+global.randomNumber();
//post comment
$scope.sendMessage=function(){

   global.checkNetworkConnection($ionicPopup);
   ajaxloader.async=false;
   ajaxloader.loadURL(global.config['api_url']+'/classstories/comment?token='+Service_Store.getLocal('app_token')+"&student_no=",
    {
      
      story_id:storyId,
      member_no:stored_memberNo,
      class_id:post_class_id,
      comment:$scope.data.message,
      sender_ac_no:stored_memberNo,
     },function(resp){
     ajaxloader.async=true;
    if(resp['status'] == "Success")
        {
          global._alert({template: "Comment successfully...", dependency:$ionicPopup});
          loadData();
          $scope.data.message="";

          }else{
          global._alert({template: "Comment not send...", dependency:$ionicPopup});
        }
    });

} 
//open comment menu 
 $scope.openCommentMenu=function($event){

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
    
     $window.location.href="#/edit_post"
    }
  // function for delete post  
    $scope.deletePost=function(){
      var storyId= Service_Store.getLocal('teacher_post_id');
      $scope.popover.hide();
      global.checkNetworkConnection($ionicPopup);
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
//like the post
  $scope.openLikePage=function(){
 
   var storyId=$scope.postId;
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.async=false;
   ajaxloader.loadURL(global.config['api_url']+'/classstories/likes?token='+Service_Store.getLocal('app_token'),
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
         $state.go('classparent_commnet', {}, { reload: true });
        }else{
          global._alert({template: "No post liked", dependency:$ionicPopup});
        }

      });
}


//back button 
$scope.comment_Back=function(){
   $window.location.href='#/home/class_story'; 

  //$ionicHistory.goBack();
}


}]);

