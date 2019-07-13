var addGroup = angular.module('starter');

addGroup.controller('assignment_studentlistCtrl', ['$scope', '$location', '$window', '$ionicModal', '$state', '$ionicPopup', '$ionicLoading', '$cordovaToast', '$filter', function ($scope, $location, $window, $ionicModal, $state, $ionicPopup, $ionicLoading, $cordovaToast, $filter) {
        loader.dependency = $ionicLoading;
        //var stored_classId = '827ccb0eea8a706c4c34a16891f84e7b2';
        var memberNo = Service_Store.getLocal('das_student_no');
        $scope.stud_status = Service_Store.getLocal('stud_status');
       //console.log(memberNo);return;
        $scope.pdfPath = global.config['file_url'] + global.config['image_path'] + '/assignment/';
        $scope.imagepath = global.config['file_url'] + global.config['image_path'] + 'profile_image/';
         ajaxloader.async = false;
         if($scope.stud_status==1){
         ajaxloader.load(global.config['api_url']+'/student/studentlist?token='+Service_Store.getLocal('app_token')+"&student_ac_no="+memberNo,
  function(resp){

  var res1=$.parseJSON(resp);
  
  if(res1.status == "Success")
    {     
        console.log(res1);
      $scope.mylist_data = res1.student_list;
      $scope.firstclass=res1.student_list[0].class_id;
      Service_Store.setLocal('stud_classid',$scope.firstclass);
      
      ajaxloader.async = true;
     
    }else if(res1.error_code==1){

        global._alert({template: res1.error_msg, dependency:$ionicPopup});

      }
      
   
 });
 var stored_classId = Service_Store.getLocal('stud_classid');

 //console.log('gghhjkhhkjh'+stored_classId);

        // api calling for classpost data
        loadData = function () {
            var fromDate = '';
            var toDate = '';
            ajaxloader.async = false;
            global.checkNetworkConnection($ionicPopup);

            ajaxloader.load(global.config['api_url'] + '/student/assignment/list?token=' + Service_Store.getLocal('app_token') + "&class_id=" + stored_classId + '&fromDate=' + fromDate + '&toDate=' + toDate, function (resp) {
                var res1 = $.parseJSON(resp);
                $scope.status_value = res1.status;
                if (res1.status == "Success")
                {
                    if (res1.assignment_details.length > 0) {
                        $scope.items = res1.assignment_details;
                    } else {
                        global._alert({template: "Data not found...", dependency: $ionicPopup});
                    }
                    // $scope.grade = res1.assignment_details.grade_details;
                    //$scope.teacher = res1.teacher_name;
                } else {
                    global._alert({template: "Data not found...", dependency: $ionicPopup});

                }

            });
        }
        }
     else{
        console.log(12);
       // alert(1);
          global._alert({template: 'Please get your account approval from your parents first!', dependency: $ionicPopup});
         $state.go('st_home.studentinvite');
     }

       // loadData();


        $scope.assignmentListData = function(classId,class_name,student_no){            
            //var classId = this.item.class_id;
            //console.log('hgdgdh'+classId);
            Service_Store.setLocal('stud_classid',classId);
            Service_Store.setLocal('stud_classname',class_name);
            Service_Store.setLocal('student_no',student_no);
             $window.location.href  = '#/assignment_student';
        }


        /* function for SEARCHING assignment list here.....................*/
        $scope.loadSearchData = function () {
            var fromDate = $filter('date')($scope.fromDate, 'yyyy-MM-dd');            
            var toDate = $filter('date')($scope.toDate, 'yyyy-MM-dd');
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.load(global.config['api_url'] + '/student/assignment/list?token=' + Service_Store.getLocal('app_token') + '&class_id=' +stored_classId+ '&fromDate=' + fromDate + '&toDate=' + toDate, function (resp)
            {
                var resp = JSON.parse(resp);
                $scope.status_val = resp.status;
                if (resp.status == "Success")
                {
                    $scope.listsize = resp.assignment_details.length;
                    
                    if ($scope.listsize > 0) {
                        $scope.items = resp.assignment_details;                        
                    } else {
                        global._alert({template: "Search data not found..", dependency: $ionicPopup});
                    }


                } else
                {
                    global._alert({template: "Data not found..", dependency: $ionicPopup});
                }
            });
        }



        $scope.datePicker = function (val) {
            if (!val) {
                console.log('Date not selected');
            } else {
                $('#fromDate').val(val);
            }
        };


        $scope.datePicker2 = function (val) {
            if (!val) {
                console.log('Date not selected');
            } else {
                $('#toDate').val(val);
            }
        };


        $scope.openPdf = function (attachment) {
            //console.log(attachment);
            var myPdfUrl = $scope.pdfPath + '/' + attachment;
            $window.open(myPdfUrl);
        }


        $scope.datediff = function () {
            var submission_date = '2016-11-25';
            var datec = $filter('date')(new Date(), 'yyyy-MM-dd');
            var date2 = new Date($scope.formatString(datec));
            var date1 = new Date($scope.formatString(submission_date));
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (diffDays >= 5 && diffDays <= 10) {
                return 'red-color';
            }

        }


        $scope.formatString = function (format) {
            var pieces = format.split('-'),
                    year = parseInt(pieces[0]),
                    month = parseInt(pieces[1]),
                    day = parseInt(pieces[2]),
                    date = new Date(year, month - 1, day);
            return date;
        }



        $scope.back = function () {
            $window.location.href = "#/st_home/assignment_student";
        }

    }]);