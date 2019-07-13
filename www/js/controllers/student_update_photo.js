/**
 * Define student update photo controller
 */
classmessage.controller('student_update_photoCtrl',['$scope', '$ionicPopup','$cordovaCamera', '$cordovaFileTransfer','$ionicLoading','$state', function($scope, $ionicPopup, $cordovaCamera, $cordovaFileTransfer,$ionicLoading,$state){
      loader.dependency = $ionicLoading;
      var data = Service_Store.getLocal('parentdata');
      var student_data = JSON.parse(data);
      $scope.photo_image = (student_data[0]['image'] == "" ? global.config['file_url']+global.config['image_path']+'image/no_image.gif' : global.config['file_url']+global.config['image_path']+'profile_image/'+student_data[0]['image'])+'?'+Math.random(); 
      $scope.photo_image_val = student_data[0]['image'];
      //Open photop popup
      $scope.photoPopup = function(){
              var myPopup = $ionicPopup.show({
              template: '<button class="button button-full button-assertive" ng-click="takePhoto()">Take Photo</button>'
              +'<button class="button button-full button-assertive" ng-click="choosePhoto()">Choose Photo</button>',
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
              $scope.photo_image_val = $scope.photo_image =  imageData;
              myPopup.close();
              }, function (err) {
              // An error occured. Show a message to the user
              });
              };

              $scope.choosePhoto = function () {
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
              $scope.photo_image_val = $scope.photo_image =  imageData;
              myPopup.close();
              }, function (err) {
              // An error occured. Show a message to the user
              });
              }

         }
         
         //Call goback function
         $scope.update_photo_goBack = function(){
            $state.go('stud_account');
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
         //Call update photo function
         $scope.updatePhoto = function(){
                $scope.show();
                var imageName =$scope.photo_image;
                var params = {};
                var jsonresponse=Service_Store.getLocal('parentdata');
                var json = $.parseJSON(jsonresponse);
                params.member_no= json[0].member_no;
                var options = new FileUploadOptions();
                options.fileKey = "upload_file";
                options.fileName = '1.jpg';
                options.mimeType = "image/jpeg";
                options.params = params;
                options.chunkedMode = false;
                $cordovaFileTransfer.upload(global.config['api_url']+'/student/updateimage?token='+Service_Store.getLocal('app_token'), imageName, options).then(function (result) {
                          var res = $.parseJSON(result['response']);
                          if(res['status'] == 'Success'){
                              json[0].image = res['img_name'];
                              student_data[0]['image']  = json[0].image;
                              var user = JSON.stringify(student_data);
                              Service_Store.setLocal('parentdata',user);
                              $scope.show();
                              global._alert({template: 'Profile updated...', dependency:$ionicPopup});
                              $scope.update_photo_goBack();
                           }
                           else
                           {
                              global._alert({template: 'Network error...', dependency:$ionicPopup});
                           }
                     }, function (err) {
                      }, function (progress) {
                         // PROGRESS HANDLING GOES HERE
                });
         }
}]);