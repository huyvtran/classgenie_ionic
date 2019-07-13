var addGroup = angular.module('starter');

addGroup.controller('tab_pendingCtrl', ['$scope', '$location', '$window', '$ionicModal', '$state', '$ionicPopup', '$ionicLoading', '$cordovaToast','$timeout', function ($scope, $location, $window, $ionicModal, $state, $ionicPopup, $ionicLoading, $cordovaToast,$timeout) {
        loader.dependency = $ionicLoading;
        $scope.stud_status = Service_Store.getLocal('stud_status');
//$window.location.href="#/student_menu"
        $scope.showclassstory = function () {
          $('#removeClass1').addClass("award_tab");
         $('#removeClass2').removeClass("award_tab");
         $('#removeClass3').removeClass("award_tab");
         Service_Store.setLocal("st_type", "1");
         loadData();
        }

//open pending story
        $scope.myClass = "new_tab_btn";
        $scope.showpendingstory = function () {
         $('#removeClass1').removeClass("award_tab");
         $('#removeClass2').addClass("award_tab");
         $('#removeClass3').removeClass("award_tab");
            
          Service_Store.setLocal("st_type", "2");
          // if ($scope.myClass === "new_tab_btn") {
          //   $scope.myClass = "new_tab_btn award_tab";
          // } else {
          //       $scope.myClass = "new_tab_btn";
          //     }
              $state.go('student_menu');
            }

// $ionicScrollDelegate.scrollBottom(true);
        var stored_classId = Service_Store.getLocal('stud_classid');
        $scope.file = global.config['file_url'];
        var memberNo = Service_Store.getLocal('das_student_no');
        Service_Store.setLocal('das_member_no',memberNo);
        $scope.imagePath = global.config['file_url'] + global.config['image_path'];
        $scope.videoPath = global.config['video_path'] + global.config['image_path'];
        var studentcode = Service_Store.getLocal('studentcode');
        $scope.stud_status=Service_Store.getLocal('stud_status');
        var rand_num = global.randomNumber();
        $scope.items ="";
        $scope.kidstory=0;


        $scope.removeDollerChar = function (string) {
            return string.replace('$', '?');
        }

        $scope.pagecount = 1;
        $scope.pendingShow = false;
        $scope.storyShow = false;
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


        $scope.removeDollerChar = function (string) {
            return string.replace('$', '?');
        }
        $scope.video = function (videoId) {
            return  $scope.imagePath + 'class_stories/' + videoId;
        };

        $scope.postStory = function ()
        {

            $state.go('studentstory_post');

        }

        if (userImage == "" || userImage == undefined) {
            $scope.imgURI = "img/chat_user.png";

        } else {
            $scope.imgURI = global.config['file_url'] + global.config['image_path'] + 'profile_image/' + userImage;

        }
       // http://localhost:3000/student/classlist?member_no=40000067&token=aforetechnical@321
        getclassid=function(){
          global.checkNetworkConnection($ionicPopup);
           ajaxloader.async=false;
           ajaxloader.load(global.config['api_url']+'/student/classlist?token='+Service_Store.getLocal('app_token')+'&member_no='+memberNo,
           $scope.getclassResponse);
       };

       /**
       *Response from ajax
       *@params resp
       */
        $scope.getclassResponse = function(resp){
           var res1=$.parseJSON(resp);
           console.log(resp);
            $scope.classid= res1.class_id;
            ajaxloader.async=true;
      
          }
          
            getclassid();



if($scope.stud_status==1){
// api calling for classpost data
loadData = function () {
  $scope.url='';
  if($scope.kidstory==0){
  $scope.url=global.config['api_url'] + '/classstories/allPost?token='
                    + Service_Store.getLocal('app_token') +"&source=ac"+ "&class_id="+$scope.classid+"&page_number="+$scope.pagecount+"&member_no="+memberNo;
}else{
  $scope.url=global.config['api_url'] + '/classstories/allPost?token='
                    + Service_Store.getLocal('app_token') +"&member_no="+memberNo+
                    '&parent_ac_no='+$scope.stud_parent_no+'&student_no='+$scope.stud_no+ "&page_number="+$scope.pagecount;

}
global.checkNetworkConnection($ionicPopup);
ajaxloader.async = false;
ajaxloader.load($scope.url,
  function (resp) {
    var res1 = $.parseJSON(resp);
    if(!res1.hasOwnProperty('posts'))
    {
      $scope.storycount = true;
    }else{
      $scope.status_value=res1.status;
      var arraylength=res1.posts.length;
      if(arraylength < global.config['page_size']){
        $scope.storycount = true;
      }
    } if (res1.status == "Success")
                        {   $scope.failure = "";
                            $scope.items = res1.posts;


                            var list  = $scope.items;
                            $scope.items.forEach(function(list){
                             var number = String(list.teacher_ac_no);   
                                 if(number.substr(0,1) ==  '4'){
                                  list.image_folder = 'student_stories';
                                 }else if(number.substr(0,1) ==  '2'){
                                  list.image_folder = 'class_stories';
                                 }   
                            });

                            for (var i = 0; i < res1.posts.length; i++) {
                                if (res1.posts[i]['status']) {
                                    for (var j = 0; j < res1.posts[i]['status'].length; j++) {
                                        if (res1.posts[i]['status'][j]['member_no'] == memberNo) {
                                            if (res1.posts[i]['status'][j]['status'] == '0')
                                                $scope.items[i]['liked'] = 0;
                                            else
                                                $scope.items[i]['liked'] = 1;
                                        } else
                                        {
                                            $scope.items[i]['liked'] = 0;
                                        }
                                    }
                                } else
                                {
                                    $scope.items[i]['liked'] = 0;
                                }
                            }

                            //$scope.class_name=res1.class_name[0].class_name;


                        } else {
                            //global._alert({template: "No post available now..", dependency: $ionicPopup});
                            $scope.failure = "No post available now..";
                        }
                        ajaxloader.async = false;
                    });
        }
}
else{
   global._alert({template: "Please get your account approval from your parents first!", dependency: $ionicPopup});
         $state.go('st_home.studentinvite');
}

loadclasslist=function(){
  // $state.go('student_menu.student_home');
ajaxloader.async = false;
ajaxloader.load(global.config['api_url']+'/student/studentlist?token='+Service_Store.getLocal('app_token')+"&student_ac_no="+memberNo,
  function(resp){
  var res1=$.parseJSON(resp);
  if(res1.status == "Success")
    {     
      $scope.mylist_data = res1.student_list;
      $scope.firstclass=res1.student_list[0].class_id;
      Service_Store.setLocal('stud_classid',$scope.firstclass);
      
      ajaxloader.async = true;
     
    }else if(res1.error_code==1){

        global._alert({template: res1.error_msg, dependency:$ionicPopup});

      }
  });
 
}

        loadclasslist();

        loader.init();
        $timeout(function(){
          loadData();
        },500);
        
         //open comment page
       $scope.openCommentPage=function(){
           var storyId=this.item.id;
           var className=this.item.class_name.class_name;
           
           Service_Store.setLocal('post_userimage',$scope.imgURI);
           Service_Store.setLocal('teacher_post_id',storyId);
           Service_Store.setLocal('frompage','tabpending');
           Service_Store.setLocal('das_classname',className);

           $window.location.href ='#/student_comment_story';
  
       }
       
       
       
       //like the post
     $scope.openLikePage=function(index){
      var studentnoLike=Service_Store.getLocal('studentNo');
        var liked_status = $('#hid_liked_status_'+index).val();
        $scope.classId="";
        var storyId=this.item.id;
         $scope.classId=this.item.class_id;
         console.log("here claas is"+$scope.classId);

        global.checkNetworkConnection($ionicPopup);
        ajaxloader.async=false;
        ajaxloader.loadURL(global.config['api_url']+'/classstories/likes?token='+Service_Store.getLocal('app_token'),
          {
            story_id:storyId,
            class_id:$scope.classId,
            member_no:memberNo,
            sender_ac_no:memberNo,
            student_no:studentnoLike,
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

// open like list page
        $scope.likes = function () {
            var storyId = this.item.id;
            $scope.classId=this.item.class_id;
             console.log("here claas is"+$scope.classId);
            $ionicModal.fromTemplateUrl('templates/like_listpage.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });

//getting like list
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.async = false;
            ajaxloader.load(global.config['api_url'] + '/classstories/likesList?token=' + Service_Store.getLocal('app_token') + "&class_id=" + $scope.classId+ "&story_id=" + storyId,
                    function (resp) {
                        var res1 = $.parseJSON(resp);
                        if (res1.status == "Success")
                        {

                            var data1 = res1.like_list;
                            console.log("length::"+ data1);
                            $scope.like_list_items = data1;
                            console.log($scope.like_list_items);
                            for (var i = 0; i < data1.length; i++) {
                                 $scope.randno=global.randomNumber();
                               }
                               ajaxloader.async = true;
                             }
                    });
            $scope.goBack_likePage = function () {
                $scope.modal.hide();
            }
        }



//calling individual story
$scope.showPopup=function(){
$scope.kidstory=1;
 

//var url=global.config['api_url']+"/parent/kidslist?"+'token='+Service_Store.getLocal('app_token')+'&parent_ac_no='+$scope.parent_ac_no;
      var output = '';
      var key='';
      ajaxloader.load(global.config['api_url']+'/student/studentlist?token='+Service_Store.getLocal('app_token')+'&student_ac_no='+memberNo,function(resp){
              var res1=$.parseJSON(resp);
               var jsonResponse=res1.student_list;
               $scope.items_stlist=res1.student_list;
             

          // A popup dialog for select the class icon
          $scope.myPopup = $ionicPopup.show({
            template:'<ion-list>'+
               '  <ion-item ng-repeat="item in items_stlist" ng-click="selectkid()"> '+
               ' <p> {{item.name}} ({{item.class_name}})<p>'+
               '<p style="display:none">{{item.student_no}}</p>'+
               '<p style="display:none">{{item.class_id}}</p>'+
               '<p style="display:none">{{item.parent_ac_no}}</p>'+
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
  $scope.myPopup.close();
  $('#removeClass1').removeClass("award_tab");
  $('#removeClass2').removeClass("award_tab");
  $('#removeClass3').addClass("award_tab");
  $scope.stud_no=this.item.student_no;
  $scope.stud_classid=this.item.class_id;
  $scope.stud_parent_no=this.item.parent_ac_no;
  $scope.items='';
  loadData();
}


 $scope.addClass = function(item){  
            if(item == 1){
               $('#removeClass1').removeClass("award_tab");
               return 'award_tab';
             }else{
              $('#removeClass2').removeClass("award_tab");
              $('#removeClass1').addClass("award_tab"); 
             }  
           }

   

$scope.myPopup.then(function(res) {

});
});
    }


$scope.pagging=function(){

  $scope.pagecount=$scope.pagecount+1;
  loadData();

  }
 $scope.doRefresh = function() {
       loadData();
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
        $scope.pagecount="1";
       
     };

    }]);
