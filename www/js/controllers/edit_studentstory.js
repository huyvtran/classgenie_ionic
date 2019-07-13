var edit_postStory = angular.module('starter');

edit_postStory.controller('student_editCtrl',['$scope','$location','$window','$ionicPopup','$cordovaCamera','$http','$state','$ionicModal','$base64','$ionicHistory','$cordovaFileTransfer','$cordovaCapture','$ionicLoading','$timeout',function($scope,$location,$window,$ionicPopup,$cordovaCamera,$http,$state,$ionicModal,$base64,$ionicHistory,$cordovaFileTransfer,$cordovaCapture,$ionicLoading,$timeout){
loader.dependency = $ionicLoading;
var stored_classId=Service_Store.getLocal('das_classid');
var stored_memberNo= Service_Store.getLocal('das_member_no');
var storyId= Service_Store.getLocal('teacher_post_id');
var student_no=Service_Store.getLocal('das_student_no');
$scope.imagePath = global.config['file_url']+global.config['image_path'];
 
$scope.postData={};
var imageStatus="0";
var selection="0";
var file_path="";
$scope.videoPath={};
//function for load post data
loadData=function(){
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.async=false;
   ajaxloader.load(global.config['api_url']+'/studentstory/commentdetail?token='+
    Service_Store.getLocal('app_token')+"&story_id="+storyId+"&teacher_ac_no="+stored_memberNo,
    function(resp){
       ajaxloader.async=true;

       var res1=$.parseJSON(resp);
        if(res1.status == "Success")
          {

      
          $scope.image=res1.post[0].image;
          $scope.postId=res1.post[0].id;
          $scope.like =res1.post[0].likes;
          $scope.like_status=res1.post[0].status;
          $scope.teacher_ac_no=res1.post[0].teacher_ac_no;
          $scope.postData.message=res1.post[0].message;
            $scope.ext ="jpg";//json[0].ext;

           $scope.imgURI=$scope.imagePath+"student_stories/"+$scope.image+"?"+global.randomNumber();
        } else if(res1.error_code==1){

                  global._alert({template: res1.error_msg, dependency:$ionicPopup});

        }else{
          global._alert({template: "No post available now..", dependency:$ionicPopup});
        }

      });


}


//function calling
loadData();

$scope.showPopup=function(){
  // A popup dialog for select the class icon
  imageStatus="1"
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
  selection="1";
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
   selection="2";
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
   selection="3";

  var options = { limit: 1, duration: 30 };

  $cordovaCapture.captureVideo(options).then(function(videoData) {
      // Success! Video data is here
      //$scope.imgURI1 = "data:video/mp4;base64," + videoData;
      
       file_path = videoData[0].fullPath;
      $scope.videoPath=file_path;
      myPopup.close();
      

      }, function(err) {
      // An error occurred. Show a message to the user
    });


  }

}

$scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner>'
    }).then(function(){
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
    });
  };

//upload the post 

$scope.post=function(){

  var textmessage =$scope.postData.message;
  if(selection=="0" && textmessage!=""){
    global.checkNetworkConnection($ionicPopup);
    ajaxloader.loadURL(global.config['api_url']+'/studentstory/post_msgupdate?token='+Service_Store.getLocal('app_token'),
    {
      id:storyId,
      message: textmessage,
      sender_ac_no:student_no,
      
      }, $scope.postResponse = function(resp)
      {
            if(resp['status'] == "Success")
            { 
               global._alert({template: "Your post successfully edit.", dependency:$ionicPopup});

                 $window.location.href = '#/student_menu/stored_classId/student_home';
               //$state.go('classstory', {}, { reload: true });
            }
            else if(resp['status'] == "Failure")
            {
               global._alert({template: resp['comments'], dependency:$ionicPopup});

            }
            else
            {
               global._alert({template: 'server issue while saving,Please try after some time', dependency:$ionicPopup});
            }

      });


       /**
      *Response from ajax
      *@params resp
      */
     

     } else if(selection=="3"){

    var textmessage =$scope.postData.message;
    var params = {};
              params.message = textmessage;
              params.id =storyId;
              
         
      var s = $scope.videoPath;
      var fields = s.split( '/' );
      var nameOfVideo = fields[6];
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
        $cordovaFileTransfer.upload(global.config['api_url']+'/studentstory/post_update?token='+Service_Store.getLocal('app_token'), file_path, options).then(function (result) {
                 //$scope.hide();
              //    $ionicLoading.hide().then(function(){
              // });
                $scope.progressBar.close();
                 global._alert({template: 'Post Successfully..', dependency:$ionicPopup});
                 $window.location.href = '#/student_menu/stored_classId/student_home';

                 
             }, function (err) {
             }, function (progress) {
                 // PROGRESS HANDLING GOES HERE
                 //$scope.show();
                  $timeout(function () {
                      $scope.uploadProgress = Math.floor(progress.loaded / progress.total * 100);
                      $('#myProgress').val("hi"+$scope.uploadProgress);
                 });
             });
       }else{

       var imageName =$scope.imgURI;
       var textmessage =$scope.postData.message;
       var params = {};
           params.message = textmessage;
           params.id =storyId;
         
         

        var options = new FileUploadOptions();
        options.fileKey = "upload_file";
        options.fileName = '1.jpg';
        options.mimeType = "image/jpeg";
       
        options.params = params;
        options.chunkedMode = false;
        
        $scope.progressPopup(); 
        $cordovaFileTransfer.upload(global.config['api_url']+'/studentstory/post_update?token='+Service_Store.getLocal('app_token'), imageName, options).then(function (result) {
                $scope.progressBar.close();
                global._alert({template: 'Post Successfully..', dependency:$ionicPopup});
                $window.location.href = '#/student_menu/stored_classId/student_home';
             }, function (err) {
                global._alert({template: 'Post not edit successfully..', dependency:$ionicPopup});
             }, function (progress) {
                 // PROGRESS HANDLING GOES HERE
                 //$scope.show();
                 $timeout(function () {
                      $scope.uploadProgress = Math.floor(progress.loaded / progress.total * 100);
                      $('#myProgress').val("hi"+$scope.uploadProgress);
                 });
        });


       }

  }



$scope.editPostback=function(){
  
  //$ionicHistory.goBack();
  $window.location.href = '#/student_menu/stored_classId/student_home';
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
         return false;
      }

}]);

