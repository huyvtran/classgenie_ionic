//classstory comment delete
var comments = angular.module('starter');

comments.controller('st_story_commentCtrl',['$scope','$location','$window','$ionicPopup','$ionicPopover','$ionicHistory','$ionicLoading',function($scope,$location,$window,$ionicPopup,$ionicPopover,$ionicHistory,$ionicLoading){
loader.dependency = $ionicLoading;

$scope.class_id = '';
//var stored_classId=Service_Store.getLocal('das_classid');
var stored_memberNo= Service_Store.getLocal('das_member_no');
var storyId= Service_Store.getLocal('teacher_post_id');
var student_no=Service_Store.getLocal('studentNo');

$scope.nameOfClass=Service_Store.getLocal('das_classname');
$scope.imagePath = global.config['file_url']+global.config['image_path'];
var userImage=Service_Store.getLocal('post_userimage');
$scope.imageurl="";

$scope.pagestatus=Service_Store.getLocal('frompage');
$scope.data={};
$scope.liked=false;
$scope.unliked=true;

$scope.removeDollerChar = function(string){
   return string.replace('$','?');
}


loadData=function(){
  var json="";
   ajaxloader.async=false;
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.load(global.config['api_url']+'/classstories/commentDetail?token='
    +Service_Store.getLocal('app_token')+"&story_id="+storyId+"&teacher_ac_no="+stored_memberNo,
    function(resp){
        ajaxloader.async=true;
        var res1=$.parseJSON(resp);
        if(res1.status == "Success")
        {
          json =res1.post;
          $scope.image=json[0].image;
          $scope.postId=json[0].id;
          $scope.class_id = json[0].class_id;
          $scope.like =json[0].likes;
          $scope.like_status=json[0].status;
          $scope.teacher_ac_no=json[0].teacher_ac_no;
          $scope.message=json[0].message;
          $scope.ext=json[0].ext;
          $scope.username=json[0].username;
         
          if($scope.username!=""|| $scope.username!=undefined ||$scope.username!=null){
             $scope.teacher_name=$scope.username;
            $scope.items=res1.comment_list;
            $scope.imageurl=res1.teacher_name[0].image;
            $scope.commentCount=$scope.items.length;
           
           
          }
          if($scope.username==""){
            
             $scope.teacher_name=res1.teacher_name[0].name;
              $scope.items=res1.comment_list;
              $scope.commentCount=$scope.items.length;
              $scope.imageurl=res1.teacher_name[0].image;
              

          }
        if($scope.imageurl=="" || $scope.imageurl== undefined ){
            $scope.imgURI="img/chat_user.png";
   
             }else{
                     $scope.imgURI=global.config['file_url']+global.config['image_path']+'profile_image/'+$scope.imageurl;

             }

            }else{
          global._alert({template: "No post available now..", dependency:$ionicPopup});
        }

      });
       
       
       var value1= $scope.teacher_ac_no.toString();
       var res = value1.substring(0,1);
       
     
      if(res==4){
         
           $scope.imagefolder="student_stories";
           $scope.std_image=$scope.items.student_name;
           
           
      }else{
        
        $scope.imagefolder="class_stories";
        $scope.std_image=json[0].teacher_name.image;
      }

       $scope.path_url=$scope.imagePath+$scope.imagefolder+"/"+$scope.image;
       }

      

//comment on post 
$scope.sendMessage=function(){


  
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.async=false;
   ajaxloader.loadURL(global.config['api_url']+'/classstories/comment?token='+Service_Store.getLocal('app_token'),
    {
     
      story_id:storyId,
      member_no:stored_memberNo,
      sender_ac_no:stored_memberNo,
      class_id:$scope.class_id,//stored_classId,
      comment:$scope.data.message,
      student_no:student_no
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


loadData();
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
         $state.go('tab.classstory', {}, { reload: true });
        }else{
          global._alert({template: "No post liked", dependency:$ionicPopup});
        }

      });
}
//delete comment  http://localhost:3000/classstories/comment/delete?id=1&token=aforetechnical@321
$scope.delete_comment=function(){
var comment_id= this.item.id;
global.checkNetworkConnection($ionicPopup);
   ajaxloader.async=false;
   ajaxloader.loadURL(global.config['api_url']+'/classstories/comment/delete?token='+Service_Store.getLocal('app_token'),
    {
      id:comment_id,
      
    },function(resp){
     ajaxloader.async=true;

        if(resp['status'] == "Success")
        {
           global._alert({template: "Comment deleted successfully..", dependency:$ionicPopup});
           loadData();
        }else{
          global._alert({template: "No post liked", dependency:$ionicPopup});
        }

      });



 }
//back button 
$scope.comment_goBack=function(){
  //$window.location.href="#/classstory";

  $ionicHistory.goBack();
}

}]);

