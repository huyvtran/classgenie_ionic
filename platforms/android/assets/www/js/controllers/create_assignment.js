var create_assignment = angular.module('starter');

create_assignment.controller('createAssignCtrl', ['$scope', '$location', '$window', '$ionicModal', '$state', '$ionicPopup', '$ionicLoading', '$cordovaToast', '$cordovaFileTransfer', '$cordovaCamera', '$ionicPlatform','$filter', function ($scope, $location, $window, $ionicModal, $state, $ionicPopup, $ionicLoading, $cordovaToast, $cordovaFileTransfer, $cordovaCamera, $ionicPlatform,$filter) {
        loader.dependency = $ionicLoading;
        var stored_classId = Service_Store.getLocal('das_classid');
        var member_no = Service_Store.getLocal('das_member_no');
        $scope.imagePath = global.config['file_url'] + global.config['image_path'];
        $scope.filename = "";
         $scope.date=new Date(); 

        $scope.filepathChooser = function () {
            global._alert({template: "File extention should be as pdf or docs or docx..", dependency: $ionicPopup});
            fileChooser.open(function (uri) {
                console.log(44);
                console.log(uri);
                $scope.filename = uri;
            });

        }


// $("#the-file-input").change(function() {
//   // will log a FileList object, view gifs below
//    // console.log(this.files[0]);
//    // console.log(this.files[0].name);
//    console.log("filename::"+$(this).val());
//    $scope.filename=$(this).val();
//    console.log("filename::"+$scope.filename);
//  });


        /* create assignment with attachement....................*/
        $scope.summit_assignment = function () {
           // console.log($scope.submission_date +'   '+$scope.date);return;
            var assignDate = $filter('date')($scope.submission_date, 'yyyy-MM-dd');
            var assignDate2= $filter('date')($scope.date, 'yyyy-MM-dd');
           if(assignDate < assignDate2){
              global._alert({template: "Date should not be less than current date..", dependency: $ionicPopup});
               return false;     
            }else{
            if($scope.filename==''){
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.async = false;
            ajaxloader.loadURL(global.config['api_url']+'/assignment/update/data?token='+Service_Store.getLocal('app_token'),
                    {
                        title:$scope.title,
                        id:"",
                        description: $scope.description,
                        submition_date:assignDate,
                        class_id :stored_classId,
                        member_no : member_no,
                        sender_ac_no:member_no
                    }, function (resp) {
                      ajaxloader.async = true;
                if (resp['status'] == "Success") {
                    global._alert({template: 'Assignment created successfully. ', dependency: $ionicPopup});                  
                    $state.go('assignment_list',{}, { reload: true });

                } else if (resp.error_code == 1) {

                    global._alert({template: 'Grade not added', dependency: $ionicPopup});

                }
            });
           }else{

            // var imageName =$scope.imgURI;
            var params = {};//new FileUploadOptions();
            params.member_no = $scope.member_no;
            params.sender_ac_no = member_no;
            console.log(params.sender_ac_no);
            params.class_id = stored_classId;
            params.title = $scope.title;
            params.description = $scope.description;
            params.member_no = member_no;
            params.submition_date = assignDate;
            var file = $scope.filename;
            var options = new FileUploadOptions();
            //console.log(options);
            options.fileKey = "upload_file";
            options.fileName = "1.pdf";
            options.mimeType = "pdf";
            options.params = params;
            options.chunkedMode = false;
            console.log(88);
            console.log(JSON.stringify(options));
            $cordovaFileTransfer.upload(global.config['api_url'] + '/assignment/post?token=' + Service_Store.getLocal('app_token'), file, options).then(function (result) {
                var json = $.parseJSON(result.response);
                console.log(json);
                global._alert({template: 'File successfully saved...', dependency: $ionicPopup});
                $state.go('assignment_list');
            }, function (err) {
                global._alert({template: 'Network problem please try again..', dependency: $ionicPopup});
            }, function (progress) {
                // PROGRESS HANDLING GOES HERE
            });


        }
    }
    }

        $scope.back = function () {
            $window.history.back();
        }

}]);