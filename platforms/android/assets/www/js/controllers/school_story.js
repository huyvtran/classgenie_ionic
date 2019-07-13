var storySchool = angular.module('starter');

storySchool.controller('school_StoryCtrl', ['$scope', '$window', '$location', '$ionicPopup', '$ionicPopover', '$state', '$ionicModal', '$ionicHistory', '$http', '$ionicLoading', function ($scope, $window, $location, $ionicPopup, $ionicPopover, $state, $ionicModal, $ionicHistory, $http, $ionicLoading) {
        
    $scope.show = function() {
    $ionicLoading.show({
      template:'<ion-spinner icon="android"></ion-spinner>'
     }).then(function(){
     });
    };

  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
    });
  };


        loader.dependency = $ionicLoading;

        var class_image = Service_Store.getLocal('das_classImage');
        var nameOfClass = Service_Store.getLocal('das_classname');
        var gradeOfClass = Service_Store.getLocal('das_classGrade');
        var stored_classId = Service_Store.getLocal('das_classid');
        var studentNo = Service_Store.getLocal('classStory_st_no');
        var parent_acc_no = Service_Store.getLocal('classStory_pt_no');
        var story_status = Service_Store.getLocal('classStory_status');

        var memberNo = Service_Store.getLocal('das_member_no');
        $scope.teacher_acno=Service_Store.getLocal('das_member_no');
        $scope.imagePath = global.config['file_url'] + global.config['image_path'];
        $scope.videoPath = global.config['video_path'] + global.config['image_path'];
        $scope.pagecount = 1;

        $scope.liked = false;
        $scope.unliked = true;
        $scope.popupShow = false;
        $scope.showmsg=false;


        $scope.removeDollerChar = function (string) {
            return string.replace('$', '?');
        }
        $scope.video = function (videoId) {
            return  $scope.imagePath + 'school_stories/' + videoId;
        };

        var jsonresponse = Service_Store.getLocal('parentdata');
        var json = JSON.parse(jsonresponse);
        for (var i = 0; i < json.length; i++)
        {
            var id = json[0].id;
            var name = json[0].name;
            var userEmail = json[0].email;
            var member_no = json[0].member_no;
            var user_type = json[0].type;
            var school_id = json[0].school_id;
        }
        $scope.userType = user_type;
        Service_Store.setLocal('das_school_id', school_id);
        $scope.school_id = Service_Store.getLocal('das_school_id');
// api calling for classpost data
        loadData = function () {
            $scope.postCount=0;
            ajaxloader.async = false;
            global.checkNetworkConnection($ionicPopup);
            if($scope.school_id==""||$scope.school_id=='undefined' || $scope.school_id=='null'){
                $scope.school_id = Service_Store.getLocal('das_school_id');
            }
            ajaxloader.load(global.config['api_url'] + '/schoolstory/allpostschoolstory?token='
                    + Service_Store.getLocal('app_token') + "&school_id=" + $scope.school_id + "&page_number=" + $scope.pagecount,
                    function (resp) {
                            $scope.showmsg=false;
                            var res1 = $.parseJSON(resp);
                        $scope.status_val=res1.status;
                        if (res1.status == "Success")
                        {
                            $scope.items = res1.post;
                            $scope.school_name = res1.school_name[0].school_name;
                            $scope.postCount=res1.post.length;
                            
                           
                            for (var i = 0; i < res1.post.length; i++) {
                               
                                if (res1.post[i]['like_status']) {
                                    for (var j = 0; j < res1.post[i]['like_status'].length; j++)
                                    {
                                        if (res1.post[i]['like_status'][j]['member_no'] == memberNo)
                                        {
                                            
                                            if (res1.post[i]['like_status'][j]['status'] == '0')
                                            {
                                                $scope.items[i]['liked'] = 0;
                                            }
                                            else
                                            {
                                                $scope.items[i]['liked'] = 1;
                                                
                                            }
                                        }
                                        else
                                        {
                                           //  console.log(res1.post[i]['like_status'][j]['member_no']);
                                           // console.log(memberNo);
                                           //  $scope.items[i]['liked'] = 0;
                                           //   alert("liked2");
                                        }
                                    }
                                }else
                                {
                                    $scope.items[i]['liked'] = 0;
                                }
                            }  

                            $scope.schoolName = res1.school_name[0].school_name;
                            } else {
                                $scope.showmsg=true;
                                $scope.items="";
                            
                            }
                        ajaxloader.async = true;

                    });
        }


        loadData();

$scope.doRefresh = function() {
    $scope.pagecount=0;
       loadData();
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
       
     };



        //open post page
        $scope.openPost = function () {
            $window.location.href = '#/school_story_post';

        }

        //open comment page
        $scope.openCommentPage = function () {
            var storyId = this.item.id;
            Service_Store.setLocal('teacher_post_id', storyId);
           // $window.location.href = '#/school_story_comments';
             $state.go('school_story_comments');
              
        }
        //like the post
        $scope.openLikePage = function (index) {
            var liked_status = $('#hid_liked_status_' + index).val();
            var storyId = this.item.id;
            ajaxloader.async = false;
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.loadURL(global.config['api_url'] + '/schoolstory/like?token=' + Service_Store.getLocal('app_token'),
                    {
                        story_id: storyId,
                        school_id: $scope.school_id,
                        member_no: memberNo,
                        sender_ac_no:memberNo,
                        status: (liked_status == '1' ? "-1" : "1")

                    }, function (resp) {
                ajaxloader.async = true;
                if (resp['status'] == "Success")
                {
                    if (liked_status == '1') {
                        $('#hid_liked_status_' + index).val(0);
                        $('#liked_id_' + index).removeClass('clicked-color');
                    } else
                    {
                        $('#hid_liked_status_' + index).val(1);
                        $('#liked_id_' + index).addClass('clicked-color');
                    }
                    $('#like_icon_' + index).html(resp['user_list'][0]['likes']);
                } else {
                    global._alert({template: "No post liked", dependency: $ionicPopup});
                }


            });
        }



// open like list page
        $scope.likes = function () {
            var storyId = this.item.id;
            $ionicModal.fromTemplateUrl('templates/school_like_page.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });

//getting like list 
            ajaxloader.async = false;
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.load(global.config['api_url'] + '/schoolstory/likesList?token=' + Service_Store.getLocal('app_token') + "&school_id=" + $scope.school_id + "&story_id=" + storyId,
                    function (resp) {
                        $scope.like_list_items="";
                        var res1 = $.parseJSON(resp);
                        if (res1.status == "Success")
                        {

                            var data1 = res1.like_list;
                            $scope.like_list_items = data1;
                            for (var i = 0; i < data1.length; i++) {
                                $scope.randno=global.randomNumber();
                                
                            }
                            ajaxloader.async = true;

                        }else{
                            $scope.like_list_items="";
                        }
                    });
            $scope.goBack_likePage = function () {

                $scope.modal.hide();
            }


        }


        //open comment menu 
        $scope.openCommentMenu = function ($event) {
            var storyId = this.item.id;
            Service_Store.setLocal('teacher_post_id', storyId);

            $scope.popover_items = [{name: "Edit"}, {name: "Delete"}];
            var template = '<ion-popover-view class="post_dropdown">'
                    + '<ul class="list post_drop_list">'
                    + '<li class="item" on-tap="editPost()"><a>Edit </a></li>'
                    + '<li class="item" on-tap="deletePost()"><a>Delete</a></li>'
                    + '</ul>'
                    + '</ion-popover-view>';

            $scope.popover = $ionicPopover.fromTemplate(template, {
                scope: $scope
            });


            $scope.popover.show($event);

            $scope.closePopover = function () {
                $scope.popover.hide();
            };

            $scope.$on('popover.hidden', function () {
                // Execute action
            });

            //function for open edit post
            $scope.editPost = function () {
                $scope.popover.hide();

                $window.location.href = "#/edit_school_post"
            }
            // function for delete post  
         $scope.deletePost = function () {
             var confirmPopup = $ionicPopup.confirm({
                 title: 'Please Confirm!',
                 template: 'Are you sure you want to delete this post?'
               });

           confirmPopup.then(function(res) {
          if(res) {
             var storyId = Service_Store.getLocal('teacher_post_id');

                $scope.popover.hide();
                ajaxloader.async = false;
                global.checkNetworkConnection($ionicPopup);
                ajaxloader.loadURL(global.config['api_url'] + '/schoolstory/delete?token=' + Service_Store.getLocal('app_token'),
                        {
                            id: storyId,
                            teacher_ac_no: memberNo

                        }, function (resp) {
                    ajaxloader.async = true;
                    if (resp['status'] == "Success")
                    {
                        var delete_count = resp['count'][0]['count'];
                        if (delete_count == 0) {
                            window.location.reload();

                        } else {
                            global._alert({template: "Post deleted successfully..", dependency: $ionicPopup});
                            loadData();
                        }

                    } else if (resp.error_code == 1) {

                        global._alert({template: resp.error_msg, dependency: $ionicPopup});

                    } else {
                        global._alert({template: "Post not deleted..", dependency: $ionicPopup});
                    }
                });
      
          } else {
       
                 }
              });
            }
        }

        $scope.openPostSchool_Story = function () {
            $window.location.href = '#/school_story_post'

        }
        $scope.back_classstory = function () {
            //$ionicHistory.goBack();
            $window.location.href = '#/dashboard';
        }

        $scope.openSideMenu = function($event)
        {
            $scope.popover_items = [{name: "Change School"}];            
             
            var template = '<ion-popover-view class="dropdownsetting change_school_one"><ion-content>'
                    + '<ul class="list">'
                    + '<li class="item" on-tap="openChangeSchool()" on-doubletap="doubletapresponse()"><a>Change School</a></li>'
                    + '<li class="item" on-tap="openteacherlist()" ng-if="'+$scope.userType+' == 1 || '+$scope.userType+' == 5"><a>Teacher List</a></li>'
                    + '</ul>'
                    + '</ion-content></ion-popover-view>';

            $scope.popover = $ionicPopover.fromTemplate(template, {
                scope: $scope
            });


            $scope.popover.show($event);

            $scope.closePopover = function () {
                $scope.popover.hide();
            };
            $scope.doubletapresponse = function()
            {
              return;
            }
            $scope.$on('popover.hidden', function () {
                // Execute action
            });
            $scope.logout = function(){
                    try{
                         var deviceId = Service_Store.getLocal('das_device_id');
                         var app_token =  Service_Store.getLocal('app_token');
                         Service_Store.clearAll();
                         Service_Store.setLocal('das_device_id', deviceId);
                         Service_Store.setLocal('app_token', app_token);
                         $window.location.href = '#/login';
                         global._alert({template: 'Successfully logged out!', dependency:$ionicPopup});
                         classmessage_socket.disconnect();
                    }
                    catch(ex){}
           }
            
            $scope.openChangeSchool = function ()
            {


                var confirmPopup = $ionicPopup.confirm({
                 title: 'Please Confirm!',
                 template: 'Your account will be deactivated, to join another school please sign up first.'
               });

           confirmPopup.then(function(res) {
          if(res) {
                $scope.closePopover();
                global.checkNetworkConnection($ionicPopup);
                ajaxloader.loadURL(global.config['api_url'] + '/schools/change?token=' + Service_Store.getLocal('app_token'),
                        {
                            member_no: member_no
                            
                         }, function (resp) {
                    ajaxloader.async = true;
                    if (resp['status'] == "Success")
                    {  
                     $scope.logout();
                       
                     } else if (resp.error_code == 1) {

                        global._alert({template: resp.error_msg, dependency: $ionicPopup});

                    } else {
                        global._alert({template: "Post not deleted..", dependency: $ionicPopup});
                    }
                });
      }
       
  });
            }
            
            $scope.openteacherlist=function(){
                 $scope.popover.hide();                 
                 $window.location.href="#/teacherList";
            }

            $scope.openLeaveSchool = function ()
            {
                if (school_id != 0)
                    ;
                json[0].school_id = 0;
            }

        }
//calling page by page number
        $scope.pagging = function () {

            $scope.pagecount = $scope.pagecount + 1;
            loadData();

        }
       

    }]);

