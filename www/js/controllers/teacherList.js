var school = angular.module('starter');
/**
 * Define the school teacher controller
 */
school.controller('ctrlTeacherList', ['$scope', '$ionicModal', '$state', '$base64', '$ionicPopup', '$ionicLoading', '$ionicHistory', '$location', '$window', function ($scope, $ionicModal, $state, $base64, $ionicPopup, $ionicLoading, $ionicHistory, $location, $window) {
        loader.dependency = $ionicLoading;
        var data = JSON.parse(Service_Store.getLocal('parentdata'));
        var school_id = data[0]['school_id'];
        $scope.schoolId  = school_id;
        $scope.pagecount = 1;
        $scope.schooladd = data['address']
        $scope.member_no = Service_Store.getLocal('das_member_no');
        console.log($scope.member_no);
        $scope.imagepath = global.config['file_url'] + global.config['image_path'] + 'profile_image/';
        var user = Service_Store.getLocal('parentdata');
        user = JSON.parse(user);

        loadData = function () {           
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.load(global.config['api_url'] + '/schools/teacherlistlimit?token=' + Service_Store.getLocal('app_token') + '&school_id=' + school_id + '&page_number=' + $scope.pagecount, function (resp)
            {
                var resp = JSON.parse(resp);                
                $scope.status_val = resp.status;
                if (resp.status == "Success")
                {
                    $scope.items = resp.Teacher_list; 
                    $scope.total_count = resp.count_list[0]['count'];
                    $scope.listsize = $scope.items.length;

                }else
                {
                    global._alert({template: "No teacher list now..", dependency: $ionicPopup});
                }
            });
        }



        $scope.pagging = function () {
            $scope.pagecount = $scope.pagecount + 1;           
            loadData();

        }


        

        $scope.backPage = function () {
            $window.location.href = '#/school_story';
        };

        loadData();



/* function for delete teacher here.....................*/
$scope.removeTeacher = function (member_no) {            
  var confirmPopup = $ionicPopup.confirm({
    title: 'Delete teacher',
    template: 'Are you sure want to delete?',
  });
  confirmPopup.then(function(res) {
    if (res == true) {
      ajaxloader.loadURL(global.config['api_url'] + '/teacher/delete?token=' + Service_Store.getLocal('app_token'),
      {
        member_no:member_no,
        school_id: $scope.schoolId,
        sender_ac_no: $scope.member_no
      }, $scope.removeResponse);
    }
  });              
};



         /**
         *Response from ajax
         *@params resp
         */
        $scope.removeResponse = function (resp) {
            if (resp['status'] == "Success")
            {
               loadData();                                  
            } else if (resp.error_code == 1) {            
            global._alert({template: 'Not success', dependency: $ionicPopup});
            } else
            {
                global._alert({template: 'error occure', dependency: $ionicPopup});
            }
       
        }




        /* function to approove teacher here.....................*/
        $scope.approoveTeacher = function (member_no) {
             var confirmPopup = $ionicPopup.confirm({
             title: 'Approove teacher',
             template: 'Are you sure want to change status?',
             });

            confirmPopup.then(function(res) {
                
            if (res == true) {
                    ajaxloader.loadURL(global.config['api_url'] + '/schools/teacherapprove/?token=' + Service_Store.getLocal('app_token'),
                            {
                            member_no:member_no,
                            school_id: $scope.schoolId,
                            sender_ac_no: $scope.member_no

                            }, $scope.removeResponse);

              }

           });              
        };
 

    }]);
