// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ionic.service.core','ngCordova','ngRoute','base64','starter.services','ionic-datepicker'])
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$sceDelegateProvider){
  $ionicConfigProvider.tabs.position('top');
  $sceDelegateProvider.resourceUrlWhitelist(['**']);  
   global.loadConfig();
  $stateProvider
.state('login', {
     url: "/login",
     cache:false,
     templateUrl: function (){return global.config['template_path']+"login.html";},
  })
.state('forgetpassword', {
      url: "/forgetpassword",
      cache:false,
      templateUrl: function (){return global.config['template_path']+"forgetpassword.html"},  // route for forgot password module
      controller:"Forgetpassword"
  })
  .state('signup', {
      url: "/signup",
      cache:false,
      templateUrl: function (){return global.config['template_path']+"signup.html"},         // route for forgot signup module
  })

.state('teachersignup', {
      url: "/teachersignup",
      cache:false,
      templateUrl: function (){return global.config['template_path']+"teachersignup.html"},  // route for forgot teachersignup module
  })
.state('parantsignup', {
      url: "/parantsignup",
      cache:false,
      templateUrl: function (){return global.config['template_path']+"parantsignup.html"},   // route for forgot parantsignup module
   
  })
.state('studentsignup', {
      url: "/studentsignup",
      cache:false,
      templateUrl: function (){return global.config['template_path']+"studentsignup.html"},  // route for forgot studentsignup module
   
  })
.state('dashboard', {
      cache:false,
      url: "/dashboard",
      templateUrl: function (){return global.config['template_path']+"dashboard.html"},    // route for forgot dashboard module
      controller:"dashboardCtrl" // for loading controller on run time when page loads
  })
.state('tab', {
    url: "/tab",
    cache:false,
    templateUrl: function (){return global.config['template_path']+"classtabs.html"},    // route for forgot classtabs module
    controller:"tabcontroller",
  })
.state('profile', {
     url: '/profile',
     templateUrl: function (){return global.config['template_path']+"profile.html"},  
     controller:"profilectrl",
     cache:false
  })
.state('tab.classroom', {
    url: '/:id/classroom',
    cache:false,
    views: {
        'classroom':
         {
          templateUrl: function (){return global.config['template_path']+"classroom.html"}, // route for forgot classroom module
          controller:"classroomCtrl",
         }

        } 
  }) 
.state('tab.class_story_listing',{
    url: '/:id/class_story_listing',
    cache:false,
    views: {
        'class_story_listing':
         {
          templateUrl: function (){return global.config['template_path']+"class_story_listing.html"}, // route for forgot classstory module
          controller:"student_list_Ctrl"
         }

        } 
    }) 
.state('tab.messages', {
    url: '/:id/messages',
    cache:false,
    views: {
        'messages':
         {
           templateUrl: function (){return global.config['template_path']+"messages.html"}, // route for forgot messages module
           controller:"classMessageCtrl"
         }

        } 
    }) 
.state('addclass', {
    url: '/addclass',
    cache:false,
    templateUrl: function (){return global.config['template_path']+"addclass.html"}, // route for forgot addclass module
    })
  

.state('addstudent', {
    cache:false,
    url: '/addstudent',
  templateUrl: function (){return global.config['template_path']+"addstudent.html"}, // route for forgot addstudent module
     
  })
 
.state('inviteparent',{
  cache:false,
    url: '/inviteparent',
  templateUrl: function (){return global.config['template_path']+"inviteparent.html"}, // route for forgot inviteparent module
  })

.state('editskills',{
    cache:false,
    url: '/editskills',
  templateUrl: function (){return global.config['template_path']+"editskills.html"}, // route for forgot editskills module
  controller:"editskillsCtrl",

  })
.state('addskill',{

    url: '/addskill',
    cache:false,
    templateUrl: function (){return global.config['template_path']+"addskill.html"}, // route for forgot addskill module
 // controller:"addskillCtrl",

  })
.state('addneedwork',{

    url: '/addNeedWork',
    
  templateUrl: function (){return global.config['template_path']+"needwork.html"}, // route for forgot addskill module
 // controller:"addskillCtrl",

  })
.state('single_editskill',{
  url: '/single_editskill',
  templateUrl: function (){return global.config['template_path']+"single_editskill.html"}, // route for forgot editskill module
  //controller:"singleSkillCtrl",
cache:false
  })
.state('editstudentlist',{
  url: '/editstudentlist',
  templateUrl: function (){return global.config['template_path']+"editstudentlist.html"},
  cache:false
   // route for forgot editstudentlist module

  })
  .state('editstudent',{
  url: '/editstudent',
  templateUrl: function (){return global.config['template_path']+"editstudent.html"},//route for edit student page
  cache:false

  })
   .state('chat',{
     url: '/:id/chat',
     templateUrl: function (){return global.config['template_path']+"chat.html"}, // route for forgot classstoryparent module
     controller:"chatCtrl",
     cache:false
  })
   .state('editclass_name',{
      cache:false,
      url: '/editclass_name',
      templateUrl: function (){return global.config['template_path']+"editclass_name.html"},// route for editclass name module
  })
   .state('classstory',{
      cache:false,
      url: '/classstory',
      templateUrl: function (){return global.config['template_path']+"classstory.html"},// route for  classstory module
      controller:"Class_StoryCtrl"
      
  })
   .state('check_parent_code',{
      cache:false,
      url: '/check_parent_code',
      templateUrl: function (){return global.config['template_path']+"check_parent_code.html"},// route for  check_parent_code module
      controller:"checkParentCtrl",
  })
   .state('group_student_list',{
      cache:false,
      url: '/group_student_list',
      templateUrl: function (){return global.config['template_path']+"group_student_list.html"},
      controller:"groupListCtrl"
  })

    .state('post',{
      url: '/post',
       cache:false,
      templateUrl: function (){return global.config['template_path']+"post.html"},
     controller:"post_StoryCtrl"
    })
  .state('home', {
    url: "/home",
    cache:false,
    templateUrl: function (){return global.config['template_path']+"hometab.html"},    // route for forgot classtabs module
    controller:"hometabcontroller",
  })
  .state('home.parent_messages',{
  url: "/parent_messages",
  cache:false,
    views: {
        'parent_messages':
         {
           templateUrl: function (){return global.config['template_path']+"parent_messages.html"}, // route for forgot messages module
           controller:"parentMessageCtrl"
         }

        } 

  })
  .state('home.class_story',{
  url: "/class_story",
  cache:false,
  views: {
        'class_story':
         {
           templateUrl: function (){return global.config['template_path']+"classstoryparent.html"}, // route for forgot messages module
           controller:"classstory_parent"
         }

        } 

  })
  .state('home.your_kid',{
  url: "/your_kid",
  cache:false,
  views: {
        'your_kid':
         {
           templateUrl: function (){return global.config['template_path']+"yourkid.html"}, // route for forgot messages module
           controller:"yourKidCtrl"
         }

         } 
  })

  .state('home.parentEvent',{
  url: "/event_parent",
  cache:false,
  views: {
        'event_parent':
         {
           templateUrl: function (){return global.config['template_path']+"event_parent.html"}, // route for forgot messages module
           controller:"EventParentCtrl"
         }

         } 
  })

  .state('home.your_kid_assignment',{
  url: "/your_kid_assignment",
  cache:false,
  views: {
        'your_kid_assignment':
         {
           templateUrl: function (){return global.config['template_path']+"yourkidassignment.html"}, // route for forgot messages module
           controller:"yourKidassignmentCtrl"
         }

         } 
  })


.state('home.your_kid_performance',{
  url: "/your_kid_performance",
  cache:false,
  views: {
        'your_kid_assignment':
         {
           templateUrl: function (){return global.config['template_path']+"yourkidassignment.html"}, // route for forgot messages module
           controller:"yourKidCtrl"
         }

         } 
  })


  .state('class_story_comments',{
   url:"/class_story_comments",
   cache:false,
   templateUrl: function (){return global.config['template_path']+"class_story_comments.html"},    // route for class story comment module
   controller:"comment_StoryCtrl",

  })
  
  
   .state('student_story_comments',{
   url:"/student_story_comments",
   cache:false,
   templateUrl: function (){return global.config['template_path']+"student_story_comments.html"},    // route for class student story comment module
   controller:"student_comment_StoryCtrl",

  })

  .state('stud_account',{
   cache:false,
   url:"/stud_account",
   templateUrl:function(){return global.config['template_path']+"studentsetting.html"},
   controller:"studcontroller",
  })
   .state('edit_post',{
   url:"/edit_post",
   templateUrl:function(){return global.config['template_path']+"edit_post.html"},
   controller:"edit_StoryCtrl",
   cache:false
  })
.state('classstory_listing',{
   url:"/class_story_listing",
   templateUrl:function(){return global.config['template_path']+"class_story_listing.html"},
   controller:"student_list_Ctrl",
   cache:false
  })

  .state('parent_student_list',{
   url:"/parent_student_list",
   templateUrl:function(){return global.config['template_path']+"parent_student_list.html"},
   controller:"parent_kidCtrl",
   cache:false
  })



  .state('remove_student',{
   cache:false,
   url:"/remove_student",
   templateUrl:function(){return global.config['template_path']+"remove_student.html"},
   controller:"remove_kidCtrl",
})

  .state('student_update_photo',{
   url:"/student_update_photo",
   templateUrl:function(){return global.config['template_path']+"student_update_photo.html"},
   controller:"student_update_photoCtrl",
   cache:false

  })

.state('attendance_list',{
   url:"/attendance_list",
   templateUrl:function(){return global.config['template_path']+"attendance_list.html"},
   controller:"attendanceCtrl",
   cache:false
  })
.state('viewReport',{
   url:"/viewReport",
   templateUrl:function(){return global.config['template_path']+"viewReport.html"},
   controller:"viewreportCtrl",
   cache:false
  })

.state('school_story',{
   url:"/school_story",
   templateUrl:function(){return global.config['template_path']+"school_story.html"},
   controller:"school_StoryCtrl",
   cache:false
  })
.state('school_story_post',{
   url:"/school_story_post",
   templateUrl:function(){return global.config['template_path']+"school_story_post.html"},
   controller:"school_postStoryCtrl",
   cache:false
  })
.state('school_story_comments',{
   url:"/school_story_comments",
   templateUrl:function(){return global.config['template_path']+"school_story_comments.html"},
   controller:"school_cmmtCtrl",
   cache:false
  }) 
.state('edit_school_post',{
   url:"/edit_school_post",
   templateUrl:function(){return global.config['template_path']+"edit_school_post.html"},
   controller:"edit_schoolStoryCtrl",
   cache:false
  })
 .state('notification_setting',{
   url:"/notification_setting",
   templateUrl:function(){return global.config['template_path']+"notification_setting.html"},
   controller:"notification_settingCtrl",
   cache:false
  })
 

 .state('notification_setting_students',{
   url:"/notification_setting_students",
   templateUrl:function(){return global.config['template_path']+"notification_setting_students.html"},
   controller:"notification_setting_studentsCtrl",
   cache:false
  })

 
 .state('notification_parent_setting',{
   url:"/notification_parent_setting",
   templateUrl:function(){return global.config['template_path']+"notification_parent_setting.html"},
   controller:"notification_parent_settingCtrl",
   cache:false
  })
 
  .state('classparent_comment',{
   url:"/classparent_comment",
   templateUrl:function(){return global.config['template_path']+"classparent_comment.html"},
   controller:"comment_parentStoryCtrl",
   cache:false
  })
  .state('parent_profile',{
   url:"/parent_profile",
   templateUrl:function(){return global.config['template_path']+"parent_profile.html"},
   controller:"parent_profileCtrl",
   cache:false
  })

  .state('student_story',{
   url:"/student_story",
   templateUrl:function(){return global.config['template_path']+"student_story.html"},
   controller:"student_storyCtrl",
   cache:false
  })

  .state('studentstory_post',{
   url:"/studentstory_post",
   templateUrl:function(){return global.config['template_path']+"studentstory_post.html"},
   controller:"student_postCtrl",
   cache:false
  })
   .state('edit_studentstory',{
   url:"/edit_studentstory",
   templateUrl:function(){return global.config['template_path']+"edit_studentstory.html"},
   controller:"student_editCtrl",
   cache:false
  })

   .state('student_menu', {
      url: "/student_menu",
      cache:false,  
      templateUrl:function(){return global.config['template_path']+"student_menu.html"},
       controller:"studentmenu_ctrl"

    })
    .state('student_menu.student_home', {
      url: "/:id/student_home",
      cache:false,
      views: {
        'menuContent' :{
          templateUrl: "templates/student_home.html",
          controller:"studenthome_ctrl"
        }
      }
    })
    .state('student_menu.student_story', {
      url: "/:id/student_story",
      cache:false,
      views: {
        'menuContent' :{
          templateUrl: "templates/student_story.html"
        }
      }
    })

    .state('st_home', {
    url: "/st_home",
    cache:false,
    templateUrl: function (){return global.config['template_path']+"student_tabhome.html"},    // route for forgot classtabs module
    controller:"sttabcontroller",
  })
  .state('st_home.studentinvite',{
  url: "/studentinvite",
  cache:false,
    views: {
        'studentinvite':
         {
           templateUrl: function (){return global.config['template_path']+"studentinvite.html"}, // route for forgot messages module
           controller:"studcontroller"
         }

        } 

  })


  .state('st_home.event_student',{
  url: "/event_student",
  cache:false,
    views: {
        'event_student':
         {
           templateUrl: function (){return global.config['template_path']+"event_student.html"}, // route for forgot messages module
           controller:"EventStudentCtrl"
         }

        } 

  })
  .state('viewstudent_Report',{
  url: "/viewstudent_Report",
  cache:false,
  templateUrl: function (){return global.config['template_path']+"studentdashboard.html"}, // route for forgot messages module
  controller:"studentperformance"
       
  })

   .state('st_home.tab_pending',{
  url: "/tab_pending",
  cache:false,
    views: {
        'tab_pending':
         {
           templateUrl: function (){return global.config['template_path']+"tab_pending.html"}, // route for forgot messages module
           controller:"tab_pendingCtrl"
         }

        } 

  }) 

  .state('st_home.assignment_student_list',{
  url: "/assignment_student_list",
  cache:false,
    views: {
        'assignment_student_list':
         {
           templateUrl: function (){return global.config['template_path']+"assignment_student_list.html"}, // route for forgot messages module
           controller:"assignment_studentlistCtrl"
         }

        } 

  })
  
.state('assignment_student',{
   url:"/assignment_student",
   templateUrl:function(){return global.config['template_path']+"assignment_student.html"},
   controller:"assignment_studentCtrl",
   cache:false
  })


.state('pending_story_studentlist',{
   url:"/pending_story_studentlist",
   templateUrl:function(){return global.config['template_path']+"pending_story_studentlist.html"},
   controller:"studentlistCtrl",
   cache:false
  })
   
   .state('pending_story_list',{
   url:"/pending_story_list",
   templateUrl:function(){return global.config['template_path']+"pending_story_list.html"},
   controller:"studentpending_storyCtrl",
   cache:false
  })

   .state('leadersignup',{
   url:"/leadersignup",
   templateUrl:function(){return global.config['template_path']+"leadersignup.html"},
   controller:"leader_signupCtrl",
   cache:false
  })
    .state('add_group',{
   url:"/add_group",
   templateUrl:function(){return global.config['template_path']+"add_group.html"},
   controller:"addGroupCtrl",
   cache:false
  })
.state('create_assignment',{
   url:"/create_assignment",
   templateUrl:function(){return global.config['template_path']+"teacherassignment.html"},
   controller:"createAssignCtrl",
   cache:false
  })
.state('editAassignment',{
   url:"/editAassignment",
   templateUrl:function(){return global.config['template_path']+"assignment_edit.html"},
   controller:"editAassignment",
   cache:false
  })


.state('assignment_list',{
   url:"/assignment_list",
   templateUrl:function(){return global.config['template_path']+"assignment_list.html"},
   controller:"assignmentListCtrl",
   cache:false
  })

.state('submitted_assignment_list',{
   url:"/submitted_assignment_list",  
   templateUrl:function(){return global.config['template_path']+"assignment_submitted_list.html"},
   controller:"submittedassignmentCtrl",
   cache:false
  })
// today
  .state('childreview',{
   url:"/childreview",
   templateUrl:function(){return global.config['template_path']+"child_review.html"},
   controller:"childreview",
   cache:false
  })
  
  .state('teacherList',{
   url:"/teacherList",
   templateUrl:function(){return global.config['template_path']+"teacherList.html"},
   controller:"ctrlTeacherList",
   cache:false
  })


  .state('volunteerList',{
   url:"/volunteerList",
   templateUrl:function(){return global.config['template_path']+"event_volunteer_list.html"},
   params:      {'event_id': null},
   controller:"ctrlVolunteerList",
   cache:false
  })



  .state('notifications',{
   url:"/notifications",
   templateUrl:function(){return global.config['template_path']+"notifications.html"},
   controller:"notificationsCtrl",
   cache:false
  })

   .state('event_notifications',{
   url:"/event_notifications",
   templateUrl:function(){return global.config['template_path']+"event_notifications.html"},
   controller:"event_notifications",
   cache:false
  })
   

   .state('side_menu_assignment', {
      url: "/side_menu_assignment",
      cache:false,  
      templateUrl:function(){return global.config['template_path']+"assignment_side_menu.html"},
       controller:"assign_menuCtrl"

    }) 


  
.state('side_menu_assignment.side_menu_assignment_content', {
      url: "/:id/side_menu_assignment_content",
      cache:false,
      views: {
        'menuContent1' :{
          templateUrl: "templates/assignment.html",
          controller:"assignmentCtrl"
        }
      }
    })  
.state('side_menu_performance', {
      url: "/side_menu_performance",
      cache:false,  
      templateUrl:function(){return global.config['template_path']+"performance_side_menu.html"},
       controller:"performance_menuCtrl"

    })

.state('side_menu_performance.side_menu_performance_content', {
      url: "/:id/side_menu_performance_content",
      cache:false,
      views: {
        'menuContent_performance' :{
          templateUrl: "templates/child_review.html",
          controller:"childreview"
        }
      }
    })
    

.state('student_comment_story', {
      url: "/student_comment_story",
      cache:false,  
      templateUrl:function(){return global.config['template_path']+"student_comment_story.html"},
       controller:"st_story_commentCtrl"

    })
  
  .state('eventmgmt', {
      url: "/eventmgmt",
      cache:false,
      templateUrl: function (){return global.config['template_path']+"eventmgmt.html"},  // route for event module
      controller:"eventCtrl"
  })
  .state('eventlist',{
    url: "/eventlist",
    cache:false,
    templateUrl:function(){
      return global.config['template_path']+"event_list.html"},
      controller:"eventListCtrl"    
  })

.state('editEvent',{
   url:"/editEvent",
   templateUrl:function(){return global.config['template_path']+"event_edit.html"},
   controller:"editEvent",
   cache:false
  })

  .state('parenteventmgmt', {
      url: "/parenteventmgmt",
      cache:false,
      templateUrl: function (){return global.config['template_path']+"parenteventmgmt.html"},  // route for event module
      controller:"parentEventCtrl"
  })

.state('school_story_in_parent', {
      url: "/school_story_in_parent",
      cache:false,
      templateUrl: function (){return global.config['template_path']+"school_story_in_parent.html"},  // route for event module
      controller:"schoolstory_parentCtrl"
  })
.state('school_story_in_student', {
      url: "/school_story_in_student",
      cache:false,
      templateUrl: function (){return global.config['template_path']+"school_story_in_student.html"},  // route for event module
      controller:"schoolstory_studentCtrl"
  })
.state('school_post_comment', {
      url: "/school_post_comment",
      cache:false,
      templateUrl: function (){return global.config['template_path']+"school_post_comment.html"},  // route for event module
      controller:"schoolpost_commentCtrl"
  })
.state('slide', {
      url: "/slide",
      cache:false,
      templateUrl: function (){return global.config['template_path']+"slide.html"},  
      controller:"slideCtrl"
  })


$urlRouterProvider.otherwise('/login');   
})
  
.run(function($ionicPlatform,$location,$rootScope, $cordovaPush,$window,$location,$ionicPopup,$cordovaDevice,$state,$cordovaToast) {
  $ionicPlatform.ready(function() {

  //**api calling for token**//
  ajaxloader.load(global.config['api_url']+'/return_token',
           function(resp){
             var res1=$.parseJSON(resp);
             
             if(res1.status == "Success")
             {
               Service_Store.setLocal('app_token',res1.token);
             }
       });
    //**end **//
    // Hardware back button//

     $ionicPlatform.onHardwareBackButton(function() { 
      console.log($state.current.name);
        if($state.current.name == 'dashboard'){
         $state.go('dashboard');
         $ionicPopup.confirm({
         title: '<img src="img/alert.png" class="alert"/><b>Classgenie</b>',
         template: 'Exit classgenie ?'
       }).then(function(res) {
      if(res) 
      {  
        console.log("In if ..");
         ionic.Platform.exitApp();
      }
      else
        {   
           $state.go('dashboard');
        }
      
        }); 
       }
       else if($state.current.name == 'home.class_story'){
         $state.go('home.class_story');
         $ionicPopup.confirm({
         title: '<img src="img/alert.png" class="alert"/><b>Classgenie</b>',
         template: 'Exit classgenie ?'
       }).then(function(res) {
      if(res) 
      {  
         ionic.Platform.exitApp();
      }
      else
        {   
           $state.go('home.class_story');
        }
      
        }); 
       }
       else if($state.current.name == 'st_home.studentinvite'){
         $state.go('st_home.studentinvite');
         $ionicPopup.confirm({
         title: '<img src="img/alert.png" class="alert"/><b>Classgenie</b>',
         template: 'Exit classgenie ?'
       }).then(function(res) {
      if(res) 
      {  
         ionic.Platform.exitApp();
      }
      else
        {   
           $state.go('st_home.studentinvite');
        }
      
        }); 
       }
    });
  
    
    var device = $cordovaDevice.getDevice();//use for get device information
   
//******CODE TO CHECK INTERNET CONNECTION IN THE APP STARTS *****//
            
            if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                    $ionicPopup.alert({
                        title: '<img src="img/alert.png" class="alert"/><b>Classgenie</b>',
                        template: 'The internet is disconnected on your device.'
                    })
                    .then(function(result) {
                        if(!result) {
                            ionic.Platform.exitApp();
                        }
                    });
                }
            }

            
//for skip login page

var jsonresponse = Service_Store.getLocal('parentdata');
        if(jsonresponse != "" && jsonresponse != null)
        {
            var json = JSON.parse(jsonresponse);
            for (var i = 0; i < json.length; i++)
            {
                var id = json[0].id;
                var name = json[0].name;
                var userEmail = json[0].email;
                var member_no = json[0].member_no;
                var user_type = json[0].type;
                var school_id = json[0].school_id;
                var userImage = json[0].image;
                var status    = json[0].status;
            }
            if (user_type == 2 || user_type == 1 || user_type == 5) {console.log('user_type');
                $state.go('dashboard');
            }
            if (user_type == 3) {
                $state.go('home.class_story');
            }
            if (user_type == 4) {
                $state.go('st_home.studentinvite');
                      if(status == '0')
                {
                    window.plugins.toast.show('Account not verified', 'short', 'center');
                }
            }
        }
           
      
//******CODE TO CHECK INTERNET CONNECTION IN THE APP ENDS *****//

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    } 
    
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
      var push = new Ionic.Push({});
      push.register(function(token) {
          Service_Store.setLocal('das_device_id',token.token);
          console.log("Device token:",token.token);
      });
       var androidConfig = {
        "senderID": global.config['sender_id'],
        "clearNotifications": false,
      };
       $cordovaPush.register(androidConfig).then(function(result) {
          // Success
        }, function(err) {
          // Error
        });
        $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification){
         console.log(notification);
         var message =notification.payload.message;
         var module=notification.payload.module_id;
         console.log("notification message::"+message+"   module: "+module);

        
        switch(notification.event) {
          case 'registered':
            break;
          case 'message':
            // this is the actual push notification. its format depends on the data model from the push server
            //alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
              if (!notification.foreground)
              {
               loadNotification(notification);
               
              }
              else{
                 //alert(notification.payload.message);
                 loadNotification(notification.payload.message);
                  
              }
            break;
          case 'error':
            //alert('GCM error = ' + notification.msg);
            break;

          default:
            //alert('An unknown GCM event has occurred');
            break;
        }
      });
   });

  loadNotification=function(notification){
        //$window.location.href='#/dashboard';
          
          var message = notification.payload.message;
          var module=notification.payload.module_id;
          var member_no=notification.payload.member_no;
          var class_id=notification.payload.class_id;
          var storedData= Service_Store.getLocal('parentdata');
          console.log("status of storedData::"+storedData);

          if(storedData==null){


             if(member_no.substr(0,1)=='2'){
                   ajaxloader.async=false;
                   ajaxloader.load(global.config['api_url']+'/teacher/search?token='+global.config['token']+"&teacher_ac_no="+member_no,
                   
                   function(resp){
                       ajaxloader.async=true;
                       var res1=$.parseJSON(resp);
                       if(res1.status == "Success")
                         {
                          console.log("after parse data::"+JSON.stringify(res1));
                          Service_Store.setLocal('parentdata', JSON.stringify(resp));
                         }
                   });
                 }else{
                      ajaxloader.async=false;
                    ajaxloader.load(global.config['api_url']+'/teacher/search?token='+global.config['token']+"&teacher_ac_no="+member_no,
                   
                    function(resp){
                       ajaxloader.async=true;
                       var res1=$.parseJSON(resp);
                       if(res1.status == "Success")
                         {
                          console.log("after parse data::"+JSON.stringify(res1));
                          Service_Store.setLocal('parentdata', JSON.stringify(resp));
                         }
                   });

                 }
          }else{


              

             if(module==1){
               //$window.location.href='#/parent_student_list';
              $window.location.href='#/home/class_story';
             }
             if(module==2){
                $window.location.href='#/dashboard';
              }
              if(module==3){
                 if(member_no.substr(0,1)=='2')
                    $window.location.href='#/dashboard';
                 else
                    $window.location.href='#/home/parent_messages';
              }
              if(module==4){
                 if(member_no.substr(0,1)=='2')
                    $window.location.href='#/dashboard';
                 else
                    $window.location.href='#/home/class_story';
              }

          }
          
      }
})
