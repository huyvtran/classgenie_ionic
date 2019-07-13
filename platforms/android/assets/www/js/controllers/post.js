var postStory = angular.module('starter');

postStory.controller('post_StoryCtrl',['$scope','$location','$window','$ionicPopup','$cordovaCamera','$http','$state','$ionicModal','$ionicHistory','$cordovaCapture','$cordovaFileTransfer','$ionicLoading','$timeout','$cordovaToast',function($scope,$location,$window,$ionicPopup,$cordovaCamera,$http,$state,$ionicModal,$ionicHistory,$cordovaCapture,$cordovaFileTransfer,$ionicLoading,$timeout,$cordovaToast){
loader.dependency = $ionicLoading;
var stop = 0;
var stored_classId=Service_Store.getLocal('das_classid');
var stored_memberNo= Service_Store.getLocal('das_member_no');
var story_status=Service_Store.getLocal('classStory_status');
var studentNo=Service_Store.getLocal('classStory_st_no');
var parentNo= Service_Store.getLocal('classStory_pt_no');
$scope.user_name=Service_Store.getLocal('das_username');
$scope.postData={};
$scope.videoPath={};
$scope.selection="0";
var file_path="";

$scope.showPopup=function(){
  // A popup dialog for select the class icon
  var myPopup = $ionicPopup.show({
  template: '<button class="button button-full button-assertive" ng-click="takePhoto()">Take Photo</button>'
  +'<button class="button button-full button-assertive" ng-click="choosePhoto()">Choose Photo</button>'
  +'<button class="button button-full button-assertive" ng-click="chooseVideo()">Video</button>',
  title: 'Select Picture',
  subTitle: '',
  scope: $scope,
  buttons: [{ 
			  text: 'Close',
			  type: 'button-default'
			}]
  });
  myPopup.then(function(res) {

  });

//open camera
$scope.takePhoto = function () {
  $scope.selection="1";
  var options = {
    quality: 100,
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType: Camera.PictureSourceType.CAMERA,
    allowEdit: true,
    encodingType: Camera.EncodingType.JPEG,
    targetWidth: 300,
    targetHeight: 300,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: true
  };

  $cordovaCamera.getPicture(options).then(function (imageData) {
    $scope.imgURI =imageData;
    myPopup.close();
  }, function (err) {
// An error occured. Show a message to the user
});
};

$scope.choosePhoto = function () {
   $scope.selection="2";
  var options = {
    quality: 100,
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    allowEdit: true,
    encodingType: Camera.EncodingType.JPEG,
    targetWidth: 300,
    targetHeight: 300,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: false
  };

$cordovaCamera.getPicture(options).then(function (imageData) {
    $scope.imgURI =imageData;
    myPopup.close();
  }, function (err) {
// An error occured. Show a message to the user
 });
}

$scope.chooseVideo= function(){
   $scope.selection="3";
   
   var options = { limit: 1, duration: 30 };
   $cordovaCapture.captureVideo(options).then(function(videoData) {
    file_path = videoData[0].fullPath;
     $scope.videoPath=file_path;
           myPopup.close();


      }, function(err) {
      // An error occurred. Show a message to the user
    });
  }
}




  $scope.post=function(){
 var textmessage =$scope.postData.message;
    // console.log($scope.postData.message+'  length');return;
   if(($scope.selection==0 && textmessage=='') || ($scope.selection==0 && $scope.postData.message==undefined)){
      
        global._alert({template: 'Please add some text or image!', dependency:$ionicPopup});
    }else if($scope.selection==0 && textmessage!=undefined){
      
           if(story_status=='all'){
                global.checkNetworkConnection($ionicPopup);
                ajaxloader.loadURL(global.config['api_url']+'/classstories?token='+Service_Store.getLocal('app_token'),
                {
                  class_id:stored_classId,
                  message: textmessage,
                  teacher_ac_no:stored_memberNo,
                  teacher_name:$scope.user_name,
                  sender_ac_no:stored_memberNo
                  },$scope.postResponse);
               }else{
                global.checkNetworkConnection($ionicPopup);
                ajaxloader.loadURL(global.config['api_url']+'/classstories?token='+Service_Store.getLocal('app_token'),
                {
                  class_id:stored_classId,
                  message: textmessage,
                  teacher_ac_no:stored_memberNo,
                   parent_ac_no:parentNo,
                   student_no:studentNo,
                   teacher_name:$scope.user_name,
                   sender_ac_no:stored_memberNo
                  },$scope.postResponse);
                }
            }else if($scope.selection=="3"){
   
                  var textmessage =$scope.postData.message;
             
                 if(story_status=='all'){
                  
                     var params = {};
                        params.message = textmessage;
                        params.class_id =stored_classId;
                        params.teacher_ac_no =stored_memberNo;
                        params.teacher_name=$scope.user_name;
                        params.sender_ac_no = stored_memberNo;
                   }else
                   {
                    
                    var params = {};
                        params.message =textmessage;
                        params.class_id =stored_classId;
                        params.teacher_ac_no =stored_memberNo;
                        params.parent_ac_no =parentNo;
                        params.student_no =studentNo;
                        params.teacher_name=$scope.user_name;
                        params.sender_ac_no = stored_memberNo;
                   }
                      var s = $scope.videoPath;
                      var fields = s.split( '/' );
                      var nameOfVideo = fields.slice(-1)[0];
                      var options = new FileUploadOptions();
                         options.fileKey  = "upload_file";
                         options.fileName = nameOfVideo;
                         options.mimeType = "video/3gp";
                        
                        options.params    = params;
                        options.chunkedMode = false;
                        options.headers = {
                          Connection: "close"
                        }

                    $scope.progressPopup();
                    $cordovaFileTransfer.upload(global.config['api_url']+'/upload?token='+Service_Store.getLocal('app_token'), file_path, options).then(function (result) {
                           //$scope.hide();
                            $scope.progressBar.close();            
                          global._alert({template: 'Story added successfully', dependency:$ionicPopup});
                          $window.location.href ='#/classstory';
                          
                       }, function (err) {
                       }, function (progress) {
                           // PROGRESS HANDLING GOES HERE
                           //$scope.show();
                           // $scope.progressPopup();
                           $timeout(function () {
                                $scope.uploadProgress = Math.floor(progress.loaded / progress.total * 100);
                                $('#myProgress').val($scope.uploadProgress);
                           });
                       });
                 }else{

                         var imageName =$scope.imgURI;
                         var textmessage =$scope.postData.message;
                         
                         if(story_status=='all'){
                         
                         var params = {};
                                params.message = textmessage;
                                params.class_id =stored_classId;
                                params.teacher_ac_no =stored_memberNo;
                                params.teacher_name=$scope.user_name;
                                params.sender_ac_no = stored_memberNo;
                           }else
                           {
                           
                            var params = {};
                                params.message =textmessage;
                                params.class_id =stored_classId;
                                params.teacher_ac_no =stored_memberNo;
                                params.parent_ac_no =parentNo;
                                params.student_no =studentNo;
                                params.teacher_name=$scope.user_name;
                                params.sender_ac_no = stored_memberNo;
                           }

                          var options = new FileUploadOptions();
                          options.fileKey = "upload_file";
                          options.fileName = '1.jpg';
                          options.mimeType = "image/jpeg";
                         
                          options.params = params;
                          options.chunkedMode = false;
                          
                          $scope.progressPopup();  
                          $cordovaFileTransfer.upload(global.config['api_url']+'/upload?token='+Service_Store.getLocal('app_token'), imageName, options).then(function (result) {             
                                 $scope.progressBar.close();
                                 global._alert({template: 'Story added Successfully..', dependency:$ionicPopup});
                                 $window.location.href ='#/classstory';
                               }, function (err) {
                               }, function (progress) {
                                   // PROGRESS HANDLING GOES HERE
                                  // $scope.show();
                                  $timeout(function () {
                                        $scope.uploadProgress = Math.floor(progress.loaded / progress.total * 100);
                                        $('#myProgress').val($scope.uploadProgress);
                                   });

                          });


                         }
            
}

/**
*Response from ajax
*@params resp
*/
$scope.postResponse = function(resp){ 

  if(resp['status'] == "Success")
  {
   // window.plugins.toast.show('Successfully posted..', 'short', 'center');
    global._alert({template: 'Story added successfully', dependency:$ionicPopup});
    $window.location.href ='#/classstory'; //load dashboard
  }
else
  {
    global._alert({template:'Story not added somthing going wrong!', dependency:$ionicPopup});
  }
}

$scope.backPost=function(){

 $ionicHistory.goBack();

 }

 $scope.progressPopup = function(){
             $scope.progressBar = $ionicPopup.show({
          template: '<progress id="myProgress" max="100" value="0"></progress>',
          title: 'Uploading...',
          subTitle: '',
          scope: $scope,
          buttons: [
                    { text: 'Close' }
                   ]

      }); 
      }

       $scope.stopUpload = function()
      {  
         $scope.progressBar.close(); 
         stop = 1;
         return false;
      } 
       

}]);

