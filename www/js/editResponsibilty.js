var edit_assignment = angular.module('starter');

edit_assignment.controller('editResponsibilty', ['$scope', '$location', '$window', '$ionicModal', '$state', '$ionicPopup', '$ionicLoading', '$cordovaToast', '$cordovaFileTransfer', '$cordovaCamera', '$ionicPlatform','$filter', function ($scope, $location, $window, $ionicModal, $state, $ionicPopup, $ionicLoading, $cordovaToast, $cordovaFileTransfer, $cordovaCamera, $ionicPlatform,$filter) {
        loader.dependency = $ionicLoading;

        var stored_classId = Service_Store.getLocal('das_classid');
        var member_no = Service_Store.getLocal('das_member_no');
        var assignment_edit_data = JSON.parse(Service_Store.getLocal('assignment_edit_data'));         
        $scope.imagePath = global.config['file_url'] + global.config['image_path'];
        $scope.filename = "";
        $scope.date=new Date();
        var filename1 = "";  
        $scope.aid = assignment_edit_data.id;      
        $scope.title = assignment_edit_data.title;
        $scope.description = assignment_edit_data.description;
        $scope.submitionDate = assignment_edit_data.submition_date;
        var arrval = $scope.submitionDate.split('/');
        $scope.example = {
         value: new Date(arrval[2], arrval[1] - 1,arrval[0])
       };
        $scope.assignment_url=assignment_edit_data.attachment;

 /*get file name*/
$scope.filepathChooser = function () {
    $scope.assignment_url='';
    filename1 = '';
    global._alert({template: "File extention should be as pdf or docs or docx..", dependency: $ionicPopup});
            fileChooser.open(function (uri) {
               filename1 = uri;
               $scope.assignment_url=filename1;               
            });

        }
/* function for sorting assignment list here.....................*/
        $scope.editAssignmentPost = function () {    
         if(filename1==""){                     
           if($('#exampleInput').val() !== ''){           
            var assignDate = $filter('date')($('#exampleInput').val(), 'yyyy-MM-dd');
           }else{
            var assignDate = $filter('date')($scope.submitionDate, 'yyyy-MM-dd');
           } 
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.async = false;
            ajaxloader.loadURL(global.config['api_url']+'/assignment/update/data?token='+Service_Store.getLocal('app_token'),
                    {
                        title:$scope.title,
                        id:$scope.aid,
                        description: $scope.description,
                        submition_date:assignDate,
                        sender_ac_no:member_no
                    }, function (resp) {
                      ajaxloader.async = true;
                if (resp['status'] == "Success"){
                  Service_Store.removeKey('assignment_edit_data')
                    global._alert({template: 'Successfully  update the assignment. ', dependency: $ionicPopup});                      
                    $state.go('assignment_list',{},{ reload: true });
                } else if (resp.error_code == 1) {
                    global._alert({template: 'Grade not added', dependency: $ionicPopup});
                }
            });
            }
            else
            {
           if($('#exampleInput').val() !== ''){           
            var assignDate = $filter('date')($('#exampleInput').val(), 'yyyy-MM-dd');
           }else{
            var assignDate = $filter('date')($scope.submitionDate, 'yyyy-MM-dd');
           }             
            var params = {};//new FileUploadOptions();            
            params.class_id = stored_classId;
            params.title = $scope.title;
            params.description = $scope.description;
            params.sender_ac_no=member_no;
            params.submition_date = assignDate;
            params.id =$scope.aid;
            var file =filename1;
            var options = new FileUploadOptions();
            options.fileKey = "upload_file";
            options.fileName = "1.pdf";
            options.mimeType = "file/pdf";
            options.params = params;
            options.chunkedMode = false;
            $cordovaFileTransfer.upload(global.config['api_url'] +'/assignment/update?token=' + Service_Store.getLocal('app_token'), file, options).then(function (result) {
              
                var json = $.parseJSON(result.response);
                global._alert({template: 'File successfully saved...', dependency: $ionicPopup});
                $state.go('assignment_list');           
            }, function (err) {
                global._alert({template: 'Network problem please try again..', dependency: $ionicPopup});
            }, function (progress) {
                // PROGRESS HANDLING GOES HERE
            });

          }

        }
        $scope.back = function () {
            $window.history.back();
        }
}]);