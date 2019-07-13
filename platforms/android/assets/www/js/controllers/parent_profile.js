var app1 = angular.module('starter')
app1.controller('parent_profileCtrl',['$scope','$location','$window','$ionicPopup','$cordovaCamera','$http','$state','$ionicModal','$cordovaFileTransfer','$ionicHistory','$ionicLoading',function($scope,$location,$window,$ionicPopup,$cordovaCamera,$http,$state,$ionicModal,$cordovaFileTransfer,$ionicHistory,$ionicLoading){
    loader.dependency = $ionicLoading;
    var image_path="";
    $scope.selection="0";
    $scope.showPopup=function(){
    // A popup dialog for select the class icon
    var myPopup = $ionicPopup.show({
    template: '<button class="button button-full button-assertive" on-tap="takePhoto()">Take Photo</button>'
    +'<button class="button button-full button-assertive" on-tap="choosePhoto()">Choose Photo</button>',
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
    $scope.imgURI =  imageData;
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
    $scope.imgURI =  imageData;
    myPopup.close();
    }, function (err) {
    // An error occured. Show a message to the user
    });
    }

    }


    //open notification setting
$scope.openNotification=function(){
    $state.go('notification_parent_setting');
 }

    // set credentials in input fields
    var jsonresponse=Service_Store.getLocal('parentdata');
    var json = $.parseJSON(jsonresponse);
    for (var i=0;i<json.length;i++)
    {
    var id       =json[i].id;
    var name     =json[i].name;
    var userEmail=json[i].email;
    var member_no=json[i].member_no;
    var user_type=json[i].type;
    var member_no=json[i].member_no;
    var userImage=json[i].image;
    var type     = json[i].type;

    }

    $scope.name = name;
    $scope.email = userEmail;
    $scope.member_no = member_no;
    name  = document.getElementById('name').value;
    email = document.getElementById('email').value;

    if(userImage!=""){

     $scope.imgURI=global.config['file_url']+global.config['image_path']+'/profile_image/'+userImage+'?'+global.randomNumber();
   
    }else{
    $scope.imgURI="img/chat_user.png"+'?'+global.randomNumber();
    }


    /**
    Function for edit profile
    **/ 

    $scope.editprofile2=function(){

     if($scope.selection=="0"){
      ajaxloader.loadURL(global.config['api_url']+'/student/update?token='+Service_Store.getLocal('app_token'),
{
 member_no : $scope.member_no,
  name: $scope.name
  
  
},$scope.nameUpdate = function(resp){
   var jsonresponse=Service_Store.getLocal('parentdata');
                 var json=JSON.parse(jsonresponse);                 
                 json[0].name = resp.student_name[0].name;
                 var imagedata=JSON.stringify(json);
                 Service_Store.setLocal('parentdata',imagedata);
                 var jsonresponse1=Service_Store.getLocal('parentdata');
                 var json=JSON.parse(jsonresponse);
                  global._alert({template: 'Profile Successfully Updated....', dependency:$ionicPopup});
                  $window.location.href='#/home/class_story';
});


}else{

    var imageName =$scope.imgURI;
   
    var params = {};
              params.name = $scope.name;
              params.email =$scope.email;
              params.member_no= $scope.member_no;
              

     var options = new FileUploadOptions();
        options.fileKey = "upload_file";
        options.fileName = '1.jpg';
        options.mimeType = "image/jpeg";
        options.params = params;
        options.chunkedMode = false;
        console.log("Testing data:"+imageName);
     $cordovaFileTransfer.upload(global.config['api_url']+'/student/updateimage?token='+Service_Store.getLocal('app_token'), imageName, options).then(function (result) {
                var json =$.parseJSON(result.response);
                 console.log(json);
                 var image_name=json.img_name;
                 var username=json.name[0].name; 
                 Service_Store.setLocal('das_username' ,username);                
                 Service_Store.setLocal('das_userimage',image_name);
                 var jsonresponse=Service_Store.getLocal('parentdata');
                 var json=JSON.parse(jsonresponse);
                 json[0].image = image_name;
                 json[0].name  =username;
                 var imagedata=JSON.stringify(json);
                 Service_Store.setLocal('parentdata',imagedata);
                 var jsonresponse1=Service_Store.getLocal('parentdata');
                 var json=JSON.parse(jsonresponse);
                  

                 global._alert({template: 'Profile updated...', dependency:$ionicPopup});
                  
                 $window.location.href='#/home/class_story';
             
             }, function (err) {
                 global._alert({template: 'Network problem profile not update', dependency:$ionicPopup});
             }, function (progress) {
                 // PROGRESS HANDLING GOES HERE
             });
   }
};

    

    //function call for back button
    $scope.backButton=function()
    {      
      $window.location.href='#/home/class_story';   
      
    }

    //function calling for logout
    $scope.logout = function(){
    try{
    var deviceId = Service_Store.getLocal('das_device_id');
    var app_token =  Service_Store.getLocal('app_token');
    Service_Store.clearAll();
    Service_Store.setLocal('das_device_id', deviceId);
    Service_Store.setLocal('app_token', app_token);
    $window.location.href = '#/login';
    global._alert({template: 'Successfully logged Out!', dependency:$ionicPopup});
    classmessage_socket.disconnect();
    }
    catch(ex){}

    }
    //function calling for change password
    $scope.changepassword = function(){
    $ionicModal.fromTemplateUrl('templates/changepassword.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
    });
    };

    $scope.openPrivacy = function()
    {

   $ionicModal.fromTemplateUrl('templates/privacy.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
    });
    };

$scope.openTerms = function()
  {
      $ionicModal.fromTemplateUrl('templates/terms.html', {
      scope: $scope,
      animation: 'slide-in-up'
      }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
      });
  };
$scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: '<img src="img/alert.png" class="alert"/><b>Classgenie</b>',
     template: 'Are you sure you want to delete Your account?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       $scope.deleteaccount(); 
     } else {
       return false;
     }
   });
 };
$scope.deleteaccount = function()
 {
    if(type == 2)
    {
    var url = 'teacher';
    }
    else if(type == 3)
    {
        var url = 'parent';
    }
ajaxloader.loadURL(global.config['api_url']+'/'+url+'/delete?token='+Service_Store.getLocal('app_token')+'&member_no='+member_no,
      {
      },$scope.studentDeleteResponse = function(resp){
          if(resp['status'] == "Success"){
            ajaxloader.async = true;
            $scope.logout();
            var message  = 'Account has been deleted';
            window.plugins.toast.show(message, 'short', 'center');
          }
          else if(resp['status'] == "Failure")
          {  
            window.plugins.toast.show(message, 'short', 'center');
          }
          else
          {
           global._alert({template: resp.error_msg, dependency:$ionicPopup});

          }
       });
 }
   $scope.closePrivacy = function()
   {
    $scope.modal.remove();
  }


}]);