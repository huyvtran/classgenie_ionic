var comment = angular.module('starter');

comment.controller('school_cmmtCtrl',['$scope','$location','$window','$ionicPopup','$ionicPopover','$ionicHistory','$ionicLoading','$state',function($scope,$location,$window,$ionicPopup,$ionicPopover,$ionicHistory,$ionicLoading,$state){
loader.dependency = $ionicLoading;
var stored_classId=Service_Store.getLocal('das_classid');
var stored_memberNo= Service_Store.getLocal('das_member_no');
var storyId= Service_Store.getLocal('teacher_post_id');
var school = JSON.parse(Service_Store.getLocal('school'));
$scope.teacher_acno=stored_memberNo;
$scope.schoolName=school[0].school_name;

$scope.imagePath = global.config['file_url']+global.config['image_path'];
$scope.school_id =Service_Store.getLocal('das_school_id');
$scope.data={};
$scope.liked=false;
$scope.unliked=true;

$scope.load_story_comment=function(){
   ajaxloader.async=false;
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.load(global.config['api_url']+'/schoolstory/allcommentDetail?token='
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
          // $scope.teacher_name=res1.teacher_name[0].name; 
          $scope.ext=json[0].ext;
          $scope.pathUrl=$scope.imagePath+"school_stories/"+$scope.image;
          //alert($scope.teacher_name[0].name); 
          if(res1.teacher_name[0].hasOwnProperty('name') == true)
          {
            
          $scope.teacher_name=res1.teacher_name[0].name; 
          
          }
          $scope.items=res1.comment_list;
          $scope.commentCount=$scope.items.length;

        }
        else if(resp.error_code==1){

        global._alert({template: resp.error_msg, dependency:$ionicPopup});

       }else{
          global._alert({template: "No post available now..", dependency:$ionicPopup});
        }

      });

}
$scope.load_story_comment();
//post comment
$scope.sendMessage=function(){
   

   ajaxloader.async=false;
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.loadURL(global.config['api_url']+'/schoolstory/comment?token='+Service_Store.getLocal('app_token'),
    {
      
      story_id:storyId,
      member_no:stored_memberNo,
      school_id:$scope.school_id,
      comment:$scope.data.message,
      sender_ac_no:stored_memberNo
     },function(resp){
     ajaxloader.async=true;
    if(resp['status'] == "Success")
        {
          //loadData();//console.log("reloaded");
          global._alert({template: "Comment successfully...", dependency:$ionicPopup});
           $scope.load_story_comment();
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
         // $scope.load_story_comment();
          $window.location.href="#/school_story";

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
    $window.location.href='#/school_story';
  
}

}]);

