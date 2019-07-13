var create_assignment = angular.module('starter');

create_assignment.controller('submittedassignmentCtrl', ['$scope', '$location', '$window', '$ionicModal', '$state', '$ionicPopup', '$ionicLoading', '$cordovaToast', '$cordovaFileTransfer', '$cordovaCamera', '$ionicPlatform','$filter','$cordovaToast', function ($scope, $location, $window, $ionicModal, $state, $ionicPopup, $ionicLoading, $cordovaToast, $cordovaFileTransfer, $cordovaCamera, $ionicPlatform,$filter,$cordovaToast) {
        loader.dependency = $ionicLoading;
        var stored_classId = Service_Store.getLocal('das_classid');
        $scope.pagecount = 1;
        var pagesShown = 1;
        var pageSize = 10;
        var member_no = Service_Store.getLocal('das_member_no');
        var assignmentId = Service_Store.getLocal('assignmentId');
        $scope.imagePath = global.config['file_url'] + global.config['image_path'];
        


        /* list for submitted assignment to the student here..............*/
        loadData = function () {
            global.checkNetworkConnection();
            ajaxloader.load(global.config['api_url'] + '/assignment/submitedlist?token=' + Service_Store.getLocal('app_token') + '&assignment_id=' + assignmentId+"&page_number="+$scope.pagecount, function (resp)
            {
                var resp = JSON.parse(resp);
                $scope.status_val = resp.status;
                $scope.status_val = resp.assignmentStudentList.length;
                if (resp.status == "Success")
                {
                    $scope.items = resp.assignment_list[0];
                    $scope.studentList = resp.assignmentStudentList;
                    
                    $scope.listsize = $scope.studentList.length;

                } else
                {
                    global._alert({template: "Data not found..", dependency: $ionicPopup});
                     $scope.status_val="Failure"
                }
            });
        }
        loadData();

        $scope.filterValue = function($event){
        if(isNaN(String.fromCharCode($event.keyCode))){
            $event.preventDefault();
        }
       };


       $scope.itemsLimit = function() {
        return pageSize * pagesShown;
        };

        $scope.hasMoreItemsToShow = function() {
            return pagesShown < ($scope.studentList.length / pageSize);
        };

        $scope.showMoreItems = function() {
            pagesShown = pagesShown + 1;         
        };




        $scope.pagging = function () {
            $scope.pagecount = $scope.pagecount + 1;
            loadData();
        }

        /*function to add grade for student  here by teacher..................*/
        $scope.addGrade = function (item) {
            var grade = $('#text_' + item.id).val();//return;
            if(grade == ''){               
                global._alert({template: "Marks required!", dependency: $ionicPopup});                 
            }else{
            var id = item.id;
            var student_no = item.student_no;
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.async = false;
            ajaxloader.loadURL(global.config['api_url']+'/assignment/submit?token='+Service_Store.getLocal('app_token'),
                    {
                        grade: grade,
                        id: id,
                        student_no: student_no,
                        sender_ac_no:member_no

                    }, function (resp) {
                      ajaxloader.async = true;

                if (resp['status'] == "Success") {

                    global._alert({template: 'Successfully added grade to ' + item.student_name.name, dependency: $ionicPopup});                     
                    $state.go('submitted_assignment_list',{}, { reload: true });
                    
                } else if (resp.error_code == 1) {

                    global._alert({template: 'Grade not added', dependency: $ionicPopup});

                }
            });
        }
        }


        /*send reminder to student for submit assignment here..............*/
        $scope.sendReminder = function () {
            var student_no = this.item.student_no;
             var id = this.item.id;
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.async = false;
            ajaxloader.load(global.config['api_url'] +'/assignment/reminder?token='+Service_Store.getLocal('app_token')+'&student_no='+student_no+'&id='+id+'&sender_ac_no='+member_no, function (resp)
            {
                var resp = JSON.parse(resp);
                $scope.status_val = resp.status;
                if (resp.status == "Success")
                {
                    global._alert({template: "Reminder sent successfully", dependency: $ionicPopup});
                     $state.go('submitted_assignment_list',{}, { reload: true });
                    // loadData();

                } else
                {
                    global._alert({template: "Error occur", dependency: $ionicPopup});
                }
            });
        }

        $scope.backPage = function () {
            $window.location.href = "#assignment_list";
        }
        $scope.unverified = function()
        {
          window.plugins.toast.show('student account not activated', 'short', 'center');

        }

    }]);