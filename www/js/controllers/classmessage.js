var classmessage = angular.module('starter');
var classmessage_socket, ionicPopup, classmessage_class_id, member_no;
/**
 * Define the class message controller
 */

classmessage.controller('classMessageCtrl',['$scope','$window', '$state', '$location','$ionicPopup','$ionicLoading', function($scope, $window, $state, $location,$ionicPopup,$ionicLoading){
        loader.dependency = $ionicLoading;
        ionicPopup = $ionicPopup;
        classmessage_class_id = Service_Store.getLocal('das_classid');
        member_no = $.trim(Service_Store.getLocal('das_member_no'));
        $scope.class_id = classmessage_class_id;
        $scope.classname= Service_Store.getLocal('das_classname');
        classmessage_socket = io.connect(global.config['chatting_url'], {'force new connection':true}); 
        loader.init(); //Loader init on request begin
        classmessage_socket.emit('new user', {member_no: member_no, source:'teacher'});
        
        $scope.getUserlist = function(class_id){ 
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.async = false;
            ajaxloader.load(global.config['api_url']+'/studentmessagelist?token='+Service_Store.getLocal('app_token')+'&class_id='+class_id+'&sort_by=A', function(resp){
                 var resp = $.parseJSON(resp);
                 $scope.user_list = resp['user_list'];
                 if($scope.user_list.length>0){
                    fillMessageHtml($scope, $ionicPopup);
                     if($scope.no_of_users < 2)
                     {
                         $('div.massage-list #lnk_all_parents').hide();
                     }
                 }
                 else
                 {
                     $('div.massage-list #no_of_users').html(0);
                     //$('div.massage-list #lnk_all_parents').show();
                 }
                 ajaxloader.async = true;
            });
        }

        $scope.checkUserList = function(){
            if($.inArray($scope._source, ["teacher","parent", "chatting"])>-1){
                $scope.getUserlist(classmessage_class_id);      
            }
         }

        classmessage_socket.on('users', function(source){
            loader.close(); //Loader close on response receive 
            $scope._source = source;
            $scope.checkUserList();
        });
        
        //Execute on pull down for refresh
        $scope.doRefresh = function() {
            if(typeof $scope._source != 'undefined'){
                ajaxloader.show_loader = false;
                $scope.checkUserList(); 
                ajaxloader.show_loader = true;
            }
            $scope.$broadcast('scroll.refreshComplete');
         };
        
        //Call on unload the page
        $scope.$on('$destroy', function() {
            clearAll();
        });     
}]);

/**
 * Define the parent message controller
 */
classmessage.controller('parentMessageCtrl',['$scope','$window', '$location', '$state','$ionicPopup','$ionicPopover' ,function($scope, $window, $location, $state,$ionicPopup,$ionicPopover){
        member_no = $.trim(Service_Store.getLocal('das_member_no'));
        classmessage_socket = io.connect(global.config['chatting_url'], {'force new connection':true}); 
        loader.init(); //Loader init on request begin
        classmessage_socket.emit('new user', {member_no: member_no, source:'parent'});
        $scope.openSideMenu=function($event){
    $scope.popover_items=[{name:"Remove student"},{name:"Account"}];
    var template = '<ion-popover-view class="dropdownsetting custom_drop"><ion-content>'
    +'<ul >'
    +'<li class="item" ng-click="removeStudent()"><a>Remove student</a></li>'
    +'<li class="item" ng-click="profile()"><a>Account</a></li>'
    +'</ul>'
    +'</ion-content></ion-popover-view>';
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

   $scope.removeStudent=function(){
    $state.go('remove_student')

    ;
    $scope.popover.hide();
   }

   $scope.profile=function(){
    $window.location.href='#/parent_profile';
    $scope.popover.hide();
   }


}
        $scope.getUserlist = function(member_no){ 
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.async = false;
            ajaxloader.load(global.config['api_url']+'/teacherchatlist?token='+Service_Store.getLocal('app_token')+'&parent_ac_no='+member_no+'&sort_by=A', function(resp){
                 $scope.user_list = $.parseJSON(resp);
                 if($scope.user_list.length>0){
                    fillParentMessageHtml($scope, $ionicPopup);
                 }
                 else
                 {
                    $('div#chat_list').show();
                    $('div#chat_list').html('<center>No teacher is connected!</center>');
                 }
                 ajaxloader.async = true;
            });
        }

        $scope.checkUserList = function(){
            if($.inArray($scope._source, ["teacher","parent", "chatting"])>-1){
                $scope.getUserlist(member_no);      
            }
         }

        classmessage_socket.on('users', function(source){ 
            loader.close(); //Loader close on response receive 
            $scope._source = source;
            $scope.checkUserList();
        });
        
        //Execute on pull down for refresh
        $scope.doRefresh = function() {
            if(typeof $scope._source != 'undefined'){
                ajaxloader.show_loader = false;
                $scope.checkUserList(); 
                ajaxloader.show_loader = true;
            }
            $scope.$broadcast('scroll.refreshComplete');
         };

         //Call on unload the page
        $scope.$on('$destroy', function() {
            clearAll();
        });   
}]);



/**
 * Genrate dynamic html
 */
fillMessageHtml = function($scope, $ionicPopup){
     $scope.no_of_users = 0;
     $scope.online_user = '';
     $scope.offline_user = '';
     $scope.pending_user = '';
     $scope.notification_sender_ac_no = '';
     $.each($scope.user_list, function(index, val){
        if(typeof val.parent_detail != 'undefined'){
             $scope.notification_sender_ac_no += ','+val.parent_ac_no;
        }
     });
     if($scope.notification_sender_ac_no != ''){
        $scope.notification_sender_ac_no = $scope.notification_sender_ac_no.substring(1);
     }
     chat_notification = {};
     global.checkNetworkConnection($ionicPopup);
     ajaxloader.async = false;
     ajaxloader.load(global.config['api_url']+'/teacher/chat_notification?token='+Service_Store.getLocal('app_token')+'&receiver_ac_no='+member_no+'&notification_sender_ac_no='+$scope.notification_sender_ac_no, function(resp){
         ajaxloader.async = true;
         $.each($.parseJSON(resp), function(index, val){
              if(typeof chat_notification[val.sender_ac_no] == 'undefined'){
                 chat_notification[val.sender_ac_no] = [];
              }
              if(typeof chat_notification[val.sender_ac_no][val.receiver_class_id]  == 'undefined'){
                 chat_notification[val.sender_ac_no][val.receiver_class_id] = [];
              }
              chat_notification[val.sender_ac_no][val.receiver_class_id].push(index);
         });
     });
     $.each($scope.user_list, function(index, val){
         /*if(typeof val.parent_detail != 'undefined' && val.parent_detail.login_status == 1){
            $scope.online_user += '<div class="item item-avatar"><img src="../img/chat_user.png"><h2 onclick="setParentDetail({name:\''+val.name+'\',parent_ac_no:\''+val.parent_ac_no+'\'})" style="cursor: pointer;"><span>'+val.name+"'s Parent</span>";
            $scope.online_user += '<img src="../img/online.png"></h2></div>';
            $scope.online_user +=  '</h2></div>';
            $scope.no_of_users++;
         }
         if(typeof val.parent_detail != 'undefined' && val.parent_detail.login_status == 0){
            $scope.offline_user += '<div class="item item-avatar"><img src="../img/chat_user.png"><h2 onclick="setParentDetail({name:\''+val.name+'\',parent_ac_no:\''+val.parent_ac_no+'\'})" style="cursor: pointer;"><span>'+val.name+"'s Parent</span>";
            $scope.offline_user += '<img src="../img/offline.png"></h2></div>';
            $scope.offline_user += '</h2></div>';
            $scope.no_of_users++;
         }*/
         if(typeof val.parent_detail != 'undefined'){
            if(typeof chat_notification[val.parent_ac_no] == 'undefined' || typeof chat_notification[val.parent_ac_no][val.class_id] == 'undefined'){
                val.parent_detail.read_messages = 0;
            }
            else
            {
               val.parent_detail.read_messages = chat_notification[val.parent_ac_no][val.class_id].length;
            }
            $scope.online_user += '<div class="item item-avatar"><img src="img/chat_user.png"><h2 onclick="setParentDetail({name:\''+val.name+'\',parent_ac_no:\''+val.parent_ac_no+'\'})" style="cursor: pointer;"><span style="font-weight:'+(val.parent_detail.read_messages==0?'normal':'bold')+'">'+val.name+"'s Parent"+(val.parent_detail.read_messages==0?"" : "("+val.parent_detail.read_messages+")")+"</span>";
            $scope.online_user += '</h2></div>';
            $scope.no_of_users++;
         }
         if(typeof val.parent_detail == 'undefined'){
            $scope.pending_user += '<div onclick="inviteParent()" class="item item-avatar"><img src="img/chat_user.png"><h2 onclick="inviteParent();"><span>'+val.name+"'s Parent</span>";
            $scope.pending_user += '</h2><p><a href="#/inviteparent">Invite parent</a></p></div>';
         }
     });
     $('div.massage-list #no_of_users').html($scope.no_of_users);
     $('div.massage-list #chat_list').html($scope.online_user+$scope.offline_user+$scope.pending_user);
     $('div.massage-list #lnk_all_parents').fadeIn(500);
     $('div.massage-list #chat_list').fadeIn(500);
inviteParent = function()
{
    window.location.href= '#/inviteparent';
}
}


/**
 * Genrate dynamic html
 */

fillParentMessageHtml = function($scope, $ionicPopup){
     $scope.no_of_users = 0;
     $scope.online_user = '';
     $scope.offline_user = '';
     $scope.notification_sender_ac_no = '';
     var count_teacher_info = 0;
     $.each($scope.user_list, function(index, val){
        if(typeof val.teacher_info != 'undefined'){
            $scope.notification_sender_ac_no += ','+val.class_info.teacher_ac_no;
        }
     });
     if($scope.notification_sender_ac_no != ''){
        $scope.notification_sender_ac_no = $scope.notification_sender_ac_no.substring(1);
     }
     chat_notification = {};
     global.checkNetworkConnection($ionicPopup);
     ajaxloader.async = false;
     ajaxloader.load(global.config['api_url']+'/teacher/chat_notification?token='+Service_Store.getLocal('app_token')+'&receiver_ac_no='+member_no+'&notification_sender_ac_no='+$scope.notification_sender_ac_no, function(resp){
         ajaxloader.async = true;
         $.each($.parseJSON(resp), function(index, val){
              if(typeof chat_notification[val.sender_ac_no]  == 'undefined'){
                 chat_notification[val.sender_ac_no] = [];
              }
              if(typeof chat_notification[val.sender_ac_no][val.receiver_class_id]  == 'undefined'){
                 chat_notification[val.sender_ac_no][val.receiver_class_id] = [];
              }
              chat_notification[val.sender_ac_no][val.receiver_class_id].push(index);
         });
     });
     $.each($scope.user_list, function(index, val){
         /*if(typeof val.teacher_info != 'undefined' && val.teacher_info.login_status == 1){
            $scope.online_user += '<div class="item item-avatar"><img src="../img/chat_user.png"><h2 onclick="setTeacherDetail({name:\''+val.teacher_info.name+'\',teacher_ac_no:\''+val.class_info.teacher_ac_no+'\'})" style="cursor: pointer;"><span>'+val.teacher_info.name+'</span>';
            $scope.online_user += '<img src="../img/online.png"></h2><p>'+val.class_info.class_name+'</p></div>';
            $scope.online_user += '</h2><p>'+val.class_info.class_name+'</p></div>';
            $scope.no_of_users++;
         }
         if(typeof val.teacher_info != 'undefined' && val.teacher_info.login_status == 0){
            $scope.offline_user += '<div class="item item-avatar"><img src="../img/chat_user.png"><h2 onclick="setTeacherDetail({name:\''+val.teacher_info.name+'\',teacher_ac_no:\''+val.class_info.teacher_ac_no+'\'})" style="cursor: pointer;"><span>'+val.teacher_info.name+'</span>';
            $scope.offline_user += '<img src="../img/offline.png"></h2><p>'+val.class_info.class_name+'</p></div>';
            $scope.offline_user += '</h2><p>'+val.class_info.class_name+'</p></div>';
            $scope.no_of_users++;
         }*/
         if(typeof val.teacher_info != 'undefined'){
            count_teacher_info++;
            if(typeof chat_notification[val.class_info.teacher_ac_no] == 'undefined' || typeof chat_notification[val.class_info.teacher_ac_no][val.class_id] == 'undefined'){
                val.teacher_info.read_messages = 0;
            }
            else
            {
               val.teacher_info.read_messages = chat_notification[val.class_info.teacher_ac_no][val.class_id].length;
            }
            $scope.online_user += '<div class="item item-avatar" onclick="setTeacherDetail({name:\''+val.teacher_info.name+'\',teacher_ac_no:\''+val.class_info.teacher_ac_no+'\',class_id:\''+val.class_id+'\'})"><img src="img/chat_user.png"><h2 style="cursor: pointer;"><span style="font-weight:'+(val.teacher_info.read_messages==0?'normal':'bold')+'">'+val.teacher_info.name+(val.teacher_info.read_messages==0?"":"("+val.teacher_info.read_messages+")")+'</span>';
            $scope.online_user += '</h2><p>'+val.class_info.class_name+'</p></div>';
            $scope.no_of_users++;
         }
     });
     if(count_teacher_info == 0){
          $('div#chat_list').html('<center>No teacher is connected!</center>');
          $('div#chat_list').show();
     }
     else
     {
        $('div.massage-list #chat_list').html($scope.online_user+$scope.offline_user);
        $('div.massage-list #chat_list').fadeIn(500);
     }   
 }


 //Send to chat page
 setParentDetail = function(obj){
     clearAll();
     Service_Store.setLocal('message_account_name', obj.name);
     window.location.href = '#/'+obj.parent_ac_no+'/chat';
 }

 //Send to chat page for all parent
 setParentDetailAll = function(){
     if($.trim($('#no_of_users').html()) == 0){
         ionicPopup.alert({
             title: "<b>Classgenie</b>",
             template: "Sorry, No parent is connected!"
         })
     }
     else
     {
       clearAll();
       window.location.href = '#/'+classmessage_class_id+'/chat';
     } 
 }

//Send to chat page
 setTeacherDetail = function(obj){
     clearAll();
     Service_Store.setLocal('chat_classid', obj.class_id);
     window.location.href = '#/'+obj.teacher_ac_no+'/chat';
 }

 //Go to dashboard 
 goToDashBoard = function(){
     clearAll();
     window.location.href = '#/dashboard';
 }

 //Go to dashboard 
 goToDashBoardParent = function(){
     clearAll();
     window.location.href = '#/home/class_story';
 }

 //Clear all localstorage
 clearAll = function(){
     classmessage_socket.disconnect();
 }