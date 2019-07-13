var app = angular.module('starter');
app.controller('classstory_parent',['$scope','$ionicPopup','$ionicModal','$ionicPopover','$window','$location','$state','$ionicHistory','$ionicLoading','$state',function($scope,$ionicPopup,$ionicModal,$ionicPopover,$window,$location,$state,$ionicHistory,$ionicLoading,$state){
	   loader.dependency = $ionicLoading;
     var classid="";
     var student_no= Service_Store.getLocal('par_student_no');
     var parent_ac_no= Service_Store.getLocal('das_member_no');
     var status= Service_Store.getLocal('par_status');

     var jsonresponse=Service_Store.getLocal('parentdata');
     var deviceId=Service_Store.getLocal('das_device_id');
     $scope.pagecount=1;
     $scope.kidstory=0;
     $scope.showmsg=false;
     $scope.nameofsearch="";
     var json= $.parseJSON(jsonresponse);
      
	    for (var i=0;i<json.length;i++)
	    { 
	     var id       =json[0].id;
	     var name     =json[0].name;
	     var userEmail=json[0].email;
	     var member_no=json[0].member_no;
	     var user_type=json[0].type;
       var image_user=json[0].image;
	    }
        $scope.username=name; 
        $scope.parent_ac_no=member_no;
        $scope.imagePath = global.config['file_url']+global.config['image_path'];
    	  $scope.videoPath=global.config['video_path']+global.config['image_path'];

    if(image_user){

     $scope.imgURI=global.config['file_url']+global.config['image_path']+'profile_image/'+image_user+'?'+global.randomNumber();
   
    }else{
    $scope.imgURI="img/chat_user.png"+'?'+global.randomNumber();
    }

    	  $scope.liked=false;
    	  $scope.unliked=true;
	      Service_Store.setLocal('das_member_no',$scope.parent_ac_no);
    	  Service_Store.setLocal('das_username',name);
       
        deviceRegister=function(){
          ajaxloader.async=false;
          global.checkNetworkConnection($ionicPopup);
          ajaxloader.loadURL(global.config['api_url']+'/save_deviceid?token='+Service_Store.getLocal('app_token'),
          {
            member_no:member_no,
            device_id:deviceId
          },function(resp){
           ajaxloader.async=true;
                  
            });

          }

       deviceRegister();

        getclassid=function(){
          global.checkNetworkConnection($ionicPopup);
           ajaxloader.async=false;
           ajaxloader.load(global.config['api_url']+'/parentstories?token='+Service_Store.getLocal('app_token')+'&parent_ac_no='+$scope.parent_ac_no,
           $scope.getclassResponse);
       };

       /**
       *Response from ajax
       *@params resp
       */
        $scope.getclassResponse = function(resp){
           var res1=$.parseJSON(resp);
           
            classid= res1.class_id;
            ajaxloader.async=true;
      
          }
          
         getclassid();
         var class_id= Service_Store.setLocal('das_classid',classid);
          
         loadData=function(){
          $scope.kidstory=0;
          
           $scope.postCount=0;
           $scope.arr_length=0;
           global.checkNetworkConnection($ionicPopup);
           ajaxloader.async=false;
           ajaxloader.load(global.config['api_url']+'/classstories/allPost?token='+Service_Store.getLocal('app_token')+'&source=ac'+'&class_id='+classid+"&page_number="+$scope.pagecount+"&member_no="+$scope.parent_ac_no+"&name="+$scope.nameofsearch,
           $scope.storyResponse);
        };

        
       /**
       *Response from ajax
       *@params resp
       */
        $scope.storyResponse = function(resp){
           $scope.showmsg=false;
           $scope.postCount=0;
           var res1=$.parseJSON(resp);
           console.log(res1);
          $scope.status_val=res1.status;
            if(!res1.hasOwnProperty('posts'))
          {
            $scope.status_val = "";
          }else{
           $scope.status_val=res1.status;
           $scope.arr_length=res1.posts.length;
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
            $scope.postCount=res1.posts.length;
           for(var i=0;i<res1.posts.length;i++){

                $scope.teacher_ac_no=res1.posts[i].teacher_ac_no;
                 var value1= $scope.teacher_ac_no.toString();
                 var res = value1.slice(0,1);
              if(res==4){
                $scope.imagefolder="student_stories";
             }else{
              $scope.imagefolder="class_stories";
             }


                 if(res1.posts[i]['status']){
                    for(var j=0;j<res1.posts[i]['status'].length;j++){
                       if(res1.posts[i]['status'][j]['member_no'] == member_no){
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
           //global._alert({template:"No post available now..", dependency:$ionicPopup});
            //window.location.href = '#/home/class_story';
            $scope.items='';
            $scope.showmsg=true;
            
        }  
           ajaxloader.async=true;
      
  }

  $scope.video = function (videoId) {
  return  $scope.imagePath+'class_stories/'+videoId;
};

    
 

       //open comment page
       $scope.openCommentPage=function(){
          var storyId=this.item.id;
          var classn =this.item.class_name.class_name;
          var post_classid=this.item.class_id;
          console.log("post_classid```````"+post_classid);
          var date=this.item.date;
          var userimg=this.item.teacher_name.image;
          Service_Store.setLocal('teacher_post_id',storyId);
          Service_Store.setLocal('post_classid',post_classid);
           Service_Store.setLocal('teacher_class',classn);
            Service_Store.setLocal('post_date',date);
            Service_Store.setLocal('post_userimage',userimg);
          $window.location.href ='#/classparent_comment';

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

   $scope.goBack_likePage=function(){
  
     $scope.modal.remove();
  }

//getting like list 
global.checkNetworkConnection($ionicPopup);
   ajaxloader.async = false;
   ajaxloader.load(global.config['api_url']+'/classstories/likesList?token='+Service_Store.getLocal('app_token')+"&story_id="+storyId,
   function(resp){
   var res1=$.parseJSON(resp);
   if(res1.status == "Success")
    {
      
      var data1 = res1.like_list;
      $scope.like_list_items =data1; 
      
      console.log("*"+$scope.randno);

      for(var i=0;i<data1.length;i++){
        $scope.randno=global.randomNumber();
       }
        ajaxloader.async = true;
     
      }else if(res1.error_code==1){

        global._alert({template: res1.error_msg, dependency:$ionicPopup});
        }
   });
 
 } 
//like the post
     $scope.openLikePage=function(index){
        var liked_status = $('#hid_liked_status_'+index).val();
        var storyId=this.item.id;
        var idofclass=this.item.class_id;
        global.checkNetworkConnection($ionicPopup);
        ajaxloader.async=false;
        ajaxloader.loadURL(global.config['api_url']+'/classstories/likes?token='+Service_Store.getLocal('app_token'),
          {
            story_id:storyId,
            class_id: idofclass,
            member_no:member_no,
            status: (liked_status == '1' ? "-1" : "1"),
            sender_ac_no:member_no
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





//Load student story
load_student_story=function(){
  $scope.kidstory=1;
      global.checkNetworkConnection($ionicPopup);
      ajaxloader.async=false;
      ajaxloader.load(global.config['api_url']+
        '/classstories/allPost?token='+Service_Store.getLocal('app_token')
        +'&member_no='+$scope.parent_ac_no+'&parent_ac_no='+$scope.parent_ac_no+'&student_no='+$scope.stud_no+"&name="+$scope.nameofsearch+"&page_number="+$scope.pagecount,
       $scope.student_storyResponse);
    };

   /**
     *Response from ajax
     *@params resp
     */
    $scope.student_storyResponse = function(resp){
      $scope.postCount=0; 
       var res1=$.parseJSON(resp);
           console.log(res1);
           $scope.showmsg=false;
          $scope.status_val=res1.status;
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
            $scope.postCount=res1.posts.length;
           for(var i=0;i<res1.posts.length;i++){

                $scope.teacher_ac_no=res1.posts[i].teacher_ac_no;
                 var value1= $scope.teacher_ac_no.toString();
                 var res = value1.slice(0,1);
              if(res==4){
                $scope.imagefolder="student_stories";
             }else{
              $scope.imagefolder="class_stories";
             }


                 if(res1.posts[i]['status']){
                    for(var j=0;j<res1.posts[i]['status'].length;j++){
                       if(res1.posts[i]['status'][j]['member_no'] == member_no){
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
           //global._alert({template:"No post available now..", dependency:$ionicPopup});
            //window.location.href = '#/home/class_story';
            $scope.items='';
            $scope.showmsg=true;
            
        }  
           ajaxloader.async=true;
  }


// open right menu
$scope.openSideMenu1=function($event){
    $scope.popover_items=[{name:"Remove student"},{name:"Account"},{name:"School Story"}];
    var template = '<ion-popover-view class="dropdownsetting custom_drop s_story_drp"><ion-content>'
    +'<ul >'
    +'<li class="item" ng-click="removeStudent()"><a>Remove student</a></li>'
    +'<li class="item" ng-click="profile()"><a>Account</a></li>'
    +'<li class="item" ng-click="school_story()"><a>School Story</a></li>'
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

   $scope.school_story=function(){
    $scope.popover.hide();
     $window.location.href='#/school_story_in_parent';

   }


}


 
if($scope.kidstory==1){
  $scope.postCount=0;
  load_student_story();
  
}else{
  $scope.postCount=0;
loadData();
}

$scope.doRefresh = function() {
      $scope.pagecount=1;
      $scope.postCount=0;
      if($scope.kidstory==1){
        load_student_story();
        }else{
          loadData();
        }
      
      $scope.$broadcast('scroll.refreshComplete');
    }

//calling kids story
$scope.showkidstory=function(){
var url=global.config['api_url']+"/parent/kidslist?"+'token='+Service_Store.getLocal('app_token')+'&parent_ac_no='+$scope.parent_ac_no;
      var output = '';
      var key='';
      ajaxloader.load(global.config['api_url']+'/parent/kidslist?token='+Service_Store.getLocal('app_token')+'&parent_ac_no='+$scope.parent_ac_no,function(resp){
              var res1=$.parseJSON(resp);
               var jsonResponse=res1.student_list;
               $scope.items_stlist=res1.student_list;
             

          // A popup dialog for select the class icon
          $scope.myPopup = $ionicPopup.show({
            template:'<ion-list>'+
               '  <ion-item ng-repeat="item in items_stlist" ng-click="selectkid()"> '+
               ' <p> {{item.name}} ({{item.class_name}})<p>'+
               '<p style="display:none">{{item.student_no}}</p>'+
               '  </ion-item>'+
               '</ion-list> ',
            title: 'Kids List',
            subTitle: '',
            scope: $scope,
            buttons: [{ 
                        text: 'Close',
                        type: 'button-default'
                     }]



          });

 $scope.selectkid=function(){ 
   $scope.kidstory=1;
   $scope.addClass = function(item){  
            if(item == 1){
               $('#removeClass').removeClass("award_tab");
               return 'award_tab';
             }else{
              $('#removeClass2').removeClass("award_tab");
              $('#removeClass').addClass("award_tab"); 
             }  
           }
 $scope.myPopup.close();
  $scope.stud_no=this.item.student_no;
  console.log("sandeep"+$scope.stud_no);
  $scope.items='';
  load_student_story();
}


 

   

$scope.myPopup.then(function(res) {

});
});
    }

 // //search the story by name
   $scope.searchStory=function(search_name){
     
     $scope.nameofsearch=search_name;
    
      if($scope.nameofsearch){
        
         if($scope.kidstory==1){
          
            load_student_story();
          }else{
            
             loadData();
            
        }
      
      }

     }
     $scope.search_story=function(){
     // alert($scope.search_name);
     }


//open again classstory
$scope.openclassstory=function(){
 $scope.kidstory=0; 
  $scope.items='';
  loadData();

    }

$scope.pagging=function(){
$scope.pagecount=$scope.pagecount+1;
if($scope.kidstory==0){
 
  loadData();
}else{
  
  load_student_story();
}

}

}]);