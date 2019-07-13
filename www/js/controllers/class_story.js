var storyClass = angular.module('starter');

storyClass.controller('Class_StoryCtrl',['$scope','$window','$location','$ionicPopup','$ionicPopover','$state','$ionicModal','$ionicHistory','$http','$ionicLoading','$cordovaToast','$timeout',function($scope,$window,$location,$ionicPopup,$ionicPopover,$state,$ionicModal,$ionicHistory,$http,$ionicLoading,$cordovaToast,$timeout){
loader.dependency = $ionicLoading;

var class_image=Service_Store.getLocal('das_classImage');
var nameOfClass=Service_Store.getLocal('das_classname');
var gradeOfClass=Service_Store.getLocal('das_classGrade');
var stored_classId=Service_Store.getLocal('das_classid');
var studentNo=Service_Store.getLocal('classStory_st_no');
var parent_acc_no=Service_Store.getLocal('classStory_pt_no');
var story_status=Service_Store.getLocal('classStory_status');
$scope.user_name=Service_Store.getLocal('das_username');
$scope.file = global.config['file_url'];
var memberNo=Service_Store.getLocal('das_member_no');
$scope.imagePath = global.config['file_url']+global.config['image_path'];
$scope.name_ofClass=nameOfClass;
var userImage=Service_Store.getLocal('das_userimage');
$scope.pagecount=1;
$scope.nameofsearch="";
$scope.showmsg=false;
 $scope.postCount=0;



$scope.removeDollerChar = function(string){
   return string.replace('$','?');
} 
 $scope.video = function (videoId) {
  return  $scope.imagePath+'class_stories/'+videoId;
};

$scope.getStudentClass = function(member_no){
  
  return member_no.toString().substr(0,1) == '4' ? 'class_story_student':'';
}

$scope.postStory  = function()
{

$state.go('post');

}



$scope.liked=false;
$scope.unliked=false;



// api calling for classpost data
  $scope.loadData=function(){
  $scope.postCount=0;
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.async=false;
   ajaxloader.load(global.config['api_url']+'/classstories/allPost?token='
    +Service_Store.getLocal('app_token')+"&source=ac&class_id="+stored_classId+"&member_no="+memberNo+"&page_number="+$scope.pagecount+"&name="+ $scope.nameofsearch,
    function(resp){
            $scope.nameofsearch="";
            $scope.showmsg=false;
           ajaxloader.async=true;
           var res1=$.parseJSON(resp);
           if(!res1.hasOwnProperty('posts'))
          {
            $scope.status_val ="";
          }else{
           $scope.status_val=res1.status;
           //console.log("hello"+$scope.status_val);
           var arraylength=res1.posts.length;
           if(arraylength<global.config['page_size']){
              $scope.status_val ="";
           }
          }
          if(res1.status == "Success")
          {
            $scope.items=res1.posts;
           
           
            var list  = $scope.items;
            $scope.items.forEach(function(list){
             var number = String(list.teacher_ac_no);   
                 if(number.substr(0,1) ==  '4'){
                  list.image_folder = 'student_stories';
                 }else if(number.substr(0,1) ==  '2'){
                  list.image_folder = 'class_stories';
                 }   
            });
                $scope.postCount=res1.posts.length;
               for(var i=0;i<res1.posts.length;i++){               
                 var userImage;
                 userImage = res1.posts[i].teacher_name.image;
                 if(userImage==''|| userImage==undefined){
                      $scope.items[i].imgURI="img/chat_user.png?"+global.randomNumber();
                 }else{
                  $scope.items[i].imgURI=global.config['file_url']+global.config['image_path']+'profile_image/'+userImage+'?'+global.randomNumber();

                 }
                 if(res1.posts[i]['status']){
                    for(var j=0;j<res1.posts[i]['status'].length;j++){
                       if(res1.posts[i]['status'][j]['member_no'] == memberNo){
                           if(res1.posts[i]['status'][j]['status'] == '0')
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
          
          //$window.location.href='#/classstory';
          $scope.items="";
          $scope.showmsg=true;
         
           //global._alert({template:"No post available now..", dependency:$ionicPopup});
           window.plugins.toast.show("To refresh page please pull down..", 'short', 'center');

        }  
           
      });
}

 $scope.loadData2=function(){
  $scope.stud_no=Service_Store.getLocal('classStory_st_no');
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.async=false;
   ajaxloader.load(global.config['api_url']+'/classstories/allPost?token='
    +Service_Store.getLocal('app_token')+"&class_id="+stored_classId+"&parent_ac_no="+parent_acc_no+"&member_no="+memberNo+"&student_no="+$scope.stud_no
    ,function(resp){
      $scope.showmsg=false;
       $scope.nameofsearch="";
       ajaxloader.async=true;
           var res1=$.parseJSON(resp);
           if(!res1.hasOwnProperty('posts'))
          {
            $scope.status_val = "";
          }else{
           $scope.status_val=res1.status;
           var arraylength=res1.posts.length;
           if(arraylength<global.config['page_size']){
              $scope.status_val = "";
           }
          }
          if(res1.status == "Success")
          {
            $scope.items=res1.posts;
           
           
            var list  = $scope.items;
            $scope.items.forEach(function(list){
             var number = String(list.teacher_ac_no);   
                 if(number.substr(0,1) ==  '4'){
                  list.image_folder = 'student_stories';
                 }else if(number.substr(0,1) ==  '2'){
                  list.image_folder = 'class_stories';
                 }   
            });
           for(var i=0;i<res1.posts.length;i++){               
                 var userImage;
                 userImage = res1.posts[i].teacher_name.image;
                 if(userImage==''|| userImage==undefined){
                      $scope.items[i].imgURI="img/chat_user.png"
                 }else{
                  $scope.items[i].imgURI=global.config['file_url']+global.config['image_path']+'profile_image/'+userImage;

                 }
                 if(res1.posts[i]['status']){
                    for(var j=0;j<res1.posts[i]['status'].length;j++){
                       if(res1.posts[i]['status'][j]['member_no'] == memberNo){
                           if(res1.posts[i]['status'][j]['status'] == '0')
                               $scope.items[i]['liked'] = 0;
                           else
                             $scope.items[i]['liked'] = 1;

                           console.log("items data::"+$scope.items);
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
          
          $window.location.href='#/classstory';
          $scope.items="";
          $scope.showmsg=true;

           //global._alert({template:"No post available now..", dependency:$ionicPopup});
         

        }  
           
      });

}
 if(story_status=="all"){

  loader.init();
$timeout(function(){
      $scope.loadData();
    },500);
   
 }else{
   
   $timeout(function(){
      $scope.loadData2();
    },500);
 }



 $scope.doRefresh = function() {
      if(story_status=="all"){
  

   loader.init();
 $timeout(function(){
      $scope.loadData();
    },500);
  $scope.pagecount=1;
 }else{
   
   loader.init();
$timeout(function(){
      $scope.loadData2();
    },500);
  $scope.pagecount=1;
 }
       
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     
  };

   //open post page
       $scope.openPost=function(){
         $window.location.href ='#/post';

       }   

       //open comment page
       $scope.openCommentPage=function(){
        var storyId=this.item.id;
        var image =this.item.imgURI;
          Service_Store.setLocal('teacher_post_id',storyId);
          Service_Store.setLocal('post_userimage',image);
          $window.location.href ='#/class_story_comments';
  
       }
     //like the post
     $scope.openLikePage=function(index){
        var liked_status = $('#hid_liked_status_'+index).val();
        var storyId=this.item.id;
        global.checkNetworkConnection($ionicPopup);
        ajaxloader.async=false;
        ajaxloader.loadURL(global.config['api_url']+'/classstories/likes?token='+Service_Store.getLocal('app_token')+"&member_no="+memberNo,
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
        $scope.randno=global.randomNumber();
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
    +'<li class="item" ng-click="editPost()">Edit </li>'
    +'<li class="item" ng-click="deletePost()">Delete</li>'
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
    
    $state.go('edit_post');
    }
  // function for delete post  
    $scope.deletePost=function(){

// A confirm dialog
 
   var confirmPopup = $ionicPopup.confirm({
     title: 'Please Confirm!',
     template: 'Are you sure you want to delete this post?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       var storyId= Service_Store.getLocal('teacher_post_id');
      $scope.popover.hide();
      ajaxloader.async=false;
      ajaxloader.loadURL(global.config['api_url']+'/classstories/delete?token='+Service_Store.getLocal('app_token'),
      {
       id:storyId,
       class_id:stored_classId
      
      },function(resp){
           ajaxloader.async=true;
           if(resp['status'] == "Success")
            {
            var delete_count=  resp['user_list'][0]['count'];
            if(delete_count==0){
              window.location.reload();
            }else{
               global._alert({template: "Post deleted successfully..", dependency:$ionicPopup});
              //window.location.href='#/classstory';
              loader.init();
              $timeout(function(){
                 if(story_status=="all"){
                    $scope.loadData();}
                    else{
                      $scope.loadData2();
                    }
                  },200);
            }
          }else{
                global._alert({template: "Post not deleted..", dependency:$ionicPopup});
              }
            });
    } else {
      //popup cancel
    }
   });
 }
}

  $scope.pagging=function(){

  $scope.pagecount=$scope.pagecount+1;
  $scope.loadData();

  }
  // //search the story by name
   $scope.searchStory=function(search_name){
 $scope.nameofsearch=$scope.search_name;

      if($scope.nameofsearch){
        
         if(story_status=="all"){

          loader.init();
         $timeout(function(){
            $scope.loadData();
        },200);
   
        }else{
   
         $timeout(function(){
             $scope.loadData2();
            },200);
        }
      
      }

     }
    $scope.search_story=function(){
     
      // $scope.nameofsearch=$scope.search_name;

      // if($scope.nameofsearch){
        
      //    if(story_status=="all"){

      //     loader.init();
      //    $timeout(function(){
      //       $scope.loadData();
      //   },200);
   
      //   }else{
   
      //    $timeout(function(){
      //        $scope.loadData2();
      //       },200);
      //   }
      
      // }

    }
}]);

back_classstory = function(){
   window.location.href = '#/tab/'+Service_Store.getLocal('das_classid')+'/class_story_listing';
}

