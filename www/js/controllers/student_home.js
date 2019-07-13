var studentmenu = angular.module('starter');

studentmenu.controller('studenthome_ctrl', ['$scope', '$location', '$window', '$ionicModal', '$base64', '$ionicPopup', '$ionicLoading', '$cordovaToast', '$ionicSideMenuDelegate', '$state', '$ionicScrollDelegate','$ionicPopover', function ($scope, $location, $window, $ionicModal, $base64, $ionicPopup, $ionicLoading, $cordovaToast, $ionicSideMenuDelegate, $state, $ionicScrollDelegate, $ionicPopover) {
        loader.dependency = $ionicLoading;
        $ionicScrollDelegate.scrollBottom(true);
        var stored_classId = Service_Store.getLocal('stud_classid');
        $scope.file = global.config['file_url'];
        var memberNo = Service_Store.getLocal('das_student_no');
        $scope.imagePath = global.config['file_url'] + global.config['image_path'];
        $scope.videoPath = global.config['video_path']+"/student_stories/";
        var studentcode = Service_Store.getLocal('studentcode');
        var rand_num = global.randomNumber();

        $scope.removeDollerChar = function (string) {
            return string.replace('$', '?');
        }

        $scope.pagecount = 1;
        $scope.story_type = Service_Store.getLocal("st_type");
        var jsonresponse = Service_Store.getLocal('parentdata');
        var userImage;
        var json = JSON.parse(jsonresponse);
        for (var i = 0; i < json.length; i++)
        {
            var id = json[0].id;
            var name = json[0].name;
            var userEmail = json[0].email;
            var member_no = json[0].member_no;
            var user_type = json[0].type;

            userImage = json[0].image;
        }
        
        $scope.video = function (videoId) {
            return  $scope.imagePath + 'student_stories/' + videoId;
        };

        $scope.postStory = function ()
        {

            $state.go('studentstory_post');

        }

        if (userImage == "" || userImage == undefined) {
            $scope.imgURI = "img/chat_user.png";

        } else {
            $scope.imgURI = global.config['file_url'] + global.config['image_path'] + 'profile_image/' + userImage+"?"+global.randomNumber();

        }


        //load data 2nd function
        loadData2 = function () {
          $scope.postCount=0;
          $scope.class_id= Service_Store.getLocal('stud_classid');
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.async = false;
            ajaxloader.load(global.config['api_url'] + '/studentstory/postlist?token='
                    + Service_Store.getLocal('app_token') + "&student_no=" + studentcode + "&class_id="+$scope.class_id +"&page_number="+ $scope.pagecount,
                    function (resp) {
                        var res1 = $.parseJSON(resp);
                        $scope.status_val=res1.status;
                        if (res1.status == "Success")
                        {
                            $scope.items2 = res1.user_list;
                             $scope.postCount= res1.user_list.length;
                            for (var i = 0; i < res1.user_list.length; i++) {
                                if (res1.user_list[i]['status']) {
                                    for (var j = 0; j < res1.user_list[i]['status'].length; j++) {
                                        if (res1.user_list[i]['status'][j]['member_no'] == memberNo) {
                                            if (res1.user_list[i]['status'][j]['status'] == '0')
                                                $scope.items2[i]['liked'] = 0;
                                            else
                                                $scope.items2[i]['liked'] = 1;
                                        } else
                                        {
                                            $scope.items2[i]['liked'] = 0;
                                        }
                                    }
                                } else
                                {
                                    $scope.items2[i]['liked'] = 0;
                                }
                            }
                        } else {
                           $scope.items2="";
                           $scope.postCount=0;
                            global._alert({template: "No post available now..", dependency: $ionicPopup});

                        }
                        ajaxloader.async = true;
                    });
        }





        loadData2();


        //open comment page
        $scope.openCommentPage = function () {
            var storyId = this.item_pend.id;
            Service_Store.setLocal('teacher_post_id', storyId);
            $window.location.href = '#/student_story_comments';

        }
        
        
      //like the post
     $scope.openLikePage=function(index){
        var liked_status = $('#hid_liked_status_'+index).val();
        var storyId=this.item_pend.id;
        global.checkNetworkConnection($ionicPopup);
        ajaxloader.async=false;
        ajaxloader.loadURL(global.config['api_url']+'/classstories/likes?token='+Service_Store.getLocal('app_token'),
          {
            story_id:storyId,
            class_id: stored_classId,
            member_no:memberNo,
            status: (liked_status == '1' ? "-1" : "1")

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
       

        //open post page
        $scope.openPost = function () {
            $window.location.href = '#/studentstory_post';

        }


// open like list page
//         $scope.likes = function () {
//             var storyId = this.item_pend.id;
//             $ionicModal.fromTemplateUrl('templates/like_listpage.html', {
//                 scope: $scope
//             }).then(function (modal) {
//                 $scope.modal = modal;
//                 $scope.modal.show();
//             });

// //getting like list
//             global.checkNetworkConnection($ionicPopup);
//             ajaxloader.async = false;
//             ajaxloader.load(global.config['api_url'] + '/classstories/likesList?token=' + Service_Store.getLocal('app_token') + "&class_id=" + stored_classId + "&story_id=" + storyId,
//                     function (resp) {
//                         var res1 = $.parseJSON(resp);
//                         if (res1.status == "Success")
//                         {

//                             var data1 = res1.like_list;
//                             $scope.like_list_items = data1;
//                             for (var i = 0; i < data1.length; i++) {
//                                 $scope.name = data1[i].name;
//                                 $scope.imageName = data1[i].image;
//                                 $scope.username=data1[i].username;
//                                 $scope.mem_no=data1[i].member_no;

//                   var teache_no=$scope.mem_no;
//                   var value2=teache_no.toString();
//                   var res = value2.slice(0,1);
                  

//                   if(res==4){
                    
//                    $scope.name = $scope.username;

//                   }else{
                    
//                   }

//                                 var s = $scope.imageName;
//                                 var fields = s.split('_');
//                                 $scope.list_image = fields[1];


//                                 var b = $scope.list_image;

//                                 var c = b.split('0');
//                                 var check_image = c[0];
//                                 if (check_image == 2) {

//                                     $scope.img = $scope.imagePath + 'profile_image/' + $scope.imageName;
//                                 } else {

//                                     $scope.img = $scope.imagePath + 'profile_image/' + $scope.imageName;
//                                 }

//                             }
//                             ajaxloader.async = true;

//                         }
//                     });

//             $scope.goBack_likePage = function () {
//                 $scope.modal.hide();
//             }

//         }


        $scope.pagging = function () {

            $scope.pagecount = $scope.pagecount + 1;
            loadData2();

        }

        $scope.opendelete=function($event){
         console.log("student story post "+ this.item_pend.id);
          var storyId=this.item_pend.id;
          Service_Store.setLocal('teacher_post_id',storyId);

  $scope.popover_items=[{name:"Edit"},{name:"Delete"}];
    var template = '<ion-popover-view class="post_dropdown">'
    +'<ul class="list post_drop_list">'
    +'<li class="item" ng-click="editPost()"><a>Edit</a></li>'
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
     
      ajaxloader.loadURL(global.config['api_url']+'/studentstory/postdelete?token='+Service_Store.getLocal('app_token'),
      {
       id:storyId,
       },function(resp){
           ajaxloader.async=true;
           if(resp['status'] == "Success")
            {
              $scope.items2='';
            global._alert({template: "Post deleted successfully..", dependency:$ionicPopup});
             
                    loadData2();
                     
             

              }else{
              global._alert({template: "Post not deleted..", dependency:$ionicPopup});
            }
      });
     } else {
       
     }
   });//confirm popup close
    }
   
    // edit student post fuction
    $scope.editPost=function(){
         $scope.popover.hide();

         $window.location.href='#/edit_studentstory';
        
         
        
    }

}

    }]);


