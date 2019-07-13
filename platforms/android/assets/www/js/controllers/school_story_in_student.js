var storySchool = angular.module('starter');
storySchool.controller('schoolstory_studentCtrl', ['$scope', '$window', '$location', '$ionicPopup', '$ionicPopover', '$state', '$ionicModal', '$ionicHistory', '$http', '$ionicLoading', function ($scope, $window, $location, $ionicPopup, $ionicPopover, $state, $ionicModal, $ionicHistory, $http, $ionicLoading) {
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
      var memberNo = Service_Store.getLocal('das_student_no');
      $scope.pagecount = 1;
      $scope.imagePath = global.config['file_url'] + global.config['image_path'];
      $scope.videoPath = global.config['video_path'] + global.config['image_path'];
      $scope.liked = false;
      $scope.unliked = true;
      $scope.popupShow = false;
      $scope.removeDollerChar = function (string) {
        return string.replace('$', '?');
      }
      $scope.video = function (videoId) {
        return  $scope.imagePath + 'school_stories/' + videoId;
      };



//calling api for school list
$scope.schoolData=function(){
  ajaxloader.async = false;
  ajaxloader.load(global.config['api_url']+'/studentstory/schools/list?token='+Service_Store.getLocal('app_token')+"&member_no="+memberNo,
    function(resp){
      var res1=$.parseJSON(resp);
      if(res1.status == "Success")
      {
        $scope.school_id = res1.school_name[0].school_id;
        // $window.location.href="#/student_menu/"+$scope.firstclass+"/student_home";
        ajaxloader.async = true;
        $scope.loadData();
      }else if(res1.error_code==1){
        global._alert({template: res1.error_msg, dependency:$ionicPopup});

      }
    });
}
// api calling for classpost data
$scope.loadData = function () {
  $scope.postCount=0;
  ajaxloader.async = false;
  global.checkNetworkConnection($ionicPopup);
  if($scope.school_id==""||$scope.school_id=='undefined' || $scope.school_id=='null'){
  $scope.school_id = Service_Store.getLocal('das_school_id');
  }
  ajaxloader.load(global.config['api_url'] +'/schoolstory/allpostschoolstory?token='+ Service_Store.getLocal('app_token') + "&school_id=" + $scope.school_id + "&page_number=" + $scope.pagecount,
    function (resp) {
      var res1 = $.parseJSON(resp);
      $scope.status_val=res1.status;
      if (res1.status == "Success")
      {
        $scope.items = res1.post;
        $scope.school_name = res1.school_name[0].school_name;
        // if(res1.post.length<10){
        //   $scope.status_val="Failure";
        // }
        $scope.postCount=res1.post.length;
        for (var i = 0; i < res1.post.length; i++) {
          if (res1.post[i]['status']) {
            for (var j = 0; j < res1.post[i]['status'].length; j++) {
              if (res1.post[i]['status'][j]['member_no'] == memberNo)
               {
                if (res1.post[i]['status'][j]['status'] == '0')
                {
                  $scope.items[i]['liked'] = 0;
                }
                else
                {
                  $scope.items[i]['liked'] = 1;
                }
              

              } else{
               //$scope.items[i]['liked'] = 0;
              }
               }
             } else {
              $scope.items[i]['liked'] = 0;
            }
          } 
          $scope.schoolName = res1.school_name[0].school_name;
        } else {
          $scope.postCount=0;
          $scope.items='';
        //$state.go('school_story');
        //$window.location.href = '#/school_story';
        global._alert({template: "No post available now..", dependency: $ionicPopup});
      }ajaxloader.async = true;
    });
}

  $scope.schoolData();    
$scope.doRefresh = function() {
  $scope.loadData();
  $scope.pagecount=1;
  // Stop the ion-refresher from spinning
  $scope.$broadcast('scroll.refreshComplete');
};

//open comment page
$scope.openCommentPage = function () {
  var storyId = this.item.id;
  var schoolName=this.school_name;
  Service_Store.setLocal('teacher_post_id', storyId);
  Service_Store.setLocal('school_name', schoolName);
  Service_Store.setLocal('school_post', "storystudent");
  $window.location.href = '#/school_post_comment';
           // $window.location.href = '#/school_story_comments';
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
            sender_ac_no: memberNo,
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
//         $scope.likes = function () {
//             var storyId = this.item.id;
//             $ionicModal.fromTemplateUrl('templates/school_like_page.html', {
//                 scope: $scope
//             }).then(function (modal) {
//                 $scope.modal = modal;
//                 $scope.modal.show();
//             });

// //getting like list 
//             ajaxloader.async = false;
//             global.checkNetworkConnection($ionicPopup);
//             ajaxloader.load(global.config['api_url'] + '/schoolstory/likesList?token=' + Service_Store.getLocal('app_token') + "&school_id=" + $scope.school_id + "&story_id=" + storyId,
//                     function (resp) {
//                         var res1 = $.parseJSON(resp);
//                         if (res1.status == "Success")
//                         {

//                             var data1 = res1.like_list;
//                             $scope.like_list_items = data1;
//                             for (var i = 0; i < data1.length; i++) {
//                                 $scope.name = data1[i].name;
//                                 $scope.imageName = data1[i].image;

//                                 var s = $scope.imageName;
//                                 var fields = s.split('_');
//                                 $scope.list_image = fields[1];
//                             }
//                             ajaxloader.async = true;

//                         }
//                     });
//             $scope.goBack_likePage = function () {

//                 $scope.modal.hide();
//             }
//          }


        
        $scope.back_classstory = function () {
           
            $window.location.href = '#/st_home/studentinvite';
        }

       
//calling page by page number
        $scope.pagging = function () {

            $scope.pagecount = $scope.pagecount + 1;
            $scope.loadData();

         }
}]);

