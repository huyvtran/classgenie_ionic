var postStory = angular.module('starter');

postStory.controller('student_postCtrl',['$scope','$location','$window','$ionicPopup','$cordovaCamera','$http','$state','$ionicModal','$ionicHistory','$cordovaCapture','$cordovaFileTransfer','$ionicLoading','$timeout',function($scope,$location,$window,$ionicPopup,$cordovaCamera,$http,$state,$ionicModal,$ionicHistory,$cordovaCapture,$cordovaFileTransfer,$ionicLoading,$timeout){
loader.dependency = $ionicLoading;

$scope.postData={};
$scope.videoPath={};
$scope.selection="0";
var file_path="";
var student_no=Service_Store.getLocal('das_student_no');
var studentcode=Service_Store.getLocal('studentcode');
$scope.stored_classId=Service_Store.getLocal('stud_classid');
$scope.classname=Service_Store.getLocal('stud_classname');
var username=Service_Store.getLocal('stud_username');

  
ajaxloader.async = false;
ajaxloader.load(global.config['api_url']+'/student/studentlist?token='+Service_Store.getLocal('app_token')+'&student_ac_no='+student_no,function(resp){
      var response = $.parseJSON(resp);
      $scope.selectGrades =response.student_list;
     ajaxloader.async = true;
      });



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
    });
  }
}


//upload the post 
// $scope.progressPopup = function(){

//              $scope.progressBar = $ionicPopup.show({
//           template: '<progress id="myProgress" max="100" value="0"></progress>',
//           title: 'Uploading...',
//           subTitle: '',
//           scope: $scope
//       });       
//       }
  
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

// var st_classId="";
// $scope.showSelectValue = function(selectGrade) {
//   st_classId=selectGrade;   
// }


  $scope.post=function(){
    $scope.student_name =Service_Store.getLocal('stud_name_first'); 
    Service_Store.setLocal('redirect_class_id',st_classId);
    var st_classId= $scope.stored_classId; 
    //console.log($scope.student_name);return false;
   // $scope.progressPopup();return;
  var textmessage =$scope.postData.message;
  if($scope.selection==0 && textmessage==undefined){
      console.log("message:: and "+textmessage +" "+$scope.selection);
        global._alert({template: 'Please add some text or image!', dependency:$ionicPopup});
    }
      else if($scope.selection==0 && textmessage!=undefined){
      
        global.checkNetworkConnection($ionicPopup);
        //$scope.progressPopup();return;
        ajaxloader.loadURL(global.config['api_url']+'/studentstory/msgpost?token='+Service_Store.getLocal('app_token'),
        {
          class_id:st_classId,
          message: textmessage,
          student_no:studentcode,
          username:$scope.student_name,
          member_no:student_no,
          sender_ac_no:student_no
          },$scope.postResponse = function(resp)
      {
            if(resp['status'] == "Success")
            { console.log("787675");
               global._alert({template: "Your post successfully.", dependency:$ionicPopup});
               $window.location.href = '#/student_menu/'+st_classId+'/student_home';

               //$state.go('classstory', {}, { reload: true });
               //$ionicHistory.goBack();

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

      
     } else if($scope.selection=="3"){
   
        var textmessage =$scope.postData.message;
   
      
        
           var params = {};
              params.message = textmessage;
              params.class_id =st_classId;
              params.student_no =studentcode;
              params.username=$scope.student_name;
              params.member_no=student_no;
              params.sender_ac_no=student_no;
         
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
          $cordovaFileTransfer.upload(global.config['api_url']+'/studentstory/post?token='+Service_Store.getLocal('app_token'), file_path, options).then(function (result) {
                 console.log("start");
                 $scope.progressBar.close();
                  console.log("close");
                 global._alert({template: 'Post Successfully..', dependency:$ionicPopup});
                 $window.location.href ='#/student_menu/'+st_classId+'/student_home';
                
             }, function (err) {
             }, function (progress) {
                 // PROGRESS HANDLING GOES HERE
                 //$scope.show();
                  $timeout(function () {
                      $scope.uploadProgress = Math.floor(progress.loaded / progress.total * 100);
                      $('#myProgress').val($scope.uploadProgress);
                 });
             });
       }else{

       var imageName =$scope.imgURI;
       var textmessage =$scope.postData.message;
  
       var params = {};
              params.message = textmessage;
              params.class_id =st_classId;
              params.student_no =studentcode;
              params.username=$scope.student_name;
              params.member_no=student_no;
              params.sender_ac_no=student_no;
              
         
         
        var options = new FileUploadOptions();
        options.fileKey = "upload_file";
        options.fileName = '1.jpg';
        options.mimeType = "image/jpeg";
       
        options.params = params;
        options.chunkedMode = false;
        
              $scope.progressPopup(); 
        $cordovaFileTransfer.upload(global.config['api_url']+'/studentstory/post?token='+Service_Store.getLocal('app_token'), imageName, options).then(function (result) {
                console.log("gghsdg"+result);
                 console.log("start");
                 $scope.progressBar.close();
                  console.log("close");
               global._alert({template: 'Post Successfully..', dependency:$ionicPopup});
               $window.location.href ='#/student_menu/'+st_classId+'/student_home';
             }, function (err) {
             }, function (progress) {
                 // PROGRESS HANDLING GOES HERE
                $timeout(function () {
                      $scope.uploadProgress = Math.floor(progress.loaded / progress.total * 100);
                      $('#myProgress').val($scope.uploadProgress);
                 });
        });


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
         return false;
      }

}]);


