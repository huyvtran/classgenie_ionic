var school = angular.module('starter');
/**
 * Define the school teacher controller
 */
school.controller('ctrlVolunteerList', ['$scope','$stateParams', '$ionicModal', '$state', '$base64', '$ionicPopup', '$ionicLoading', '$ionicHistory', '$location', '$window', function ($scope,$stateParams, $ionicModal, $state, $base64, $ionicPopup, $ionicLoading, $ionicHistory, $location, $window) {
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
            ajaxloader.load(global.config['api_url'] + '/event/parent_name?token=' + Service_Store.getLocal('app_token') + '&event_id=' + $stateParams.event_id, function (resp)
            {
                var resp = JSON.parse(resp);
                $scope.status_val = resp.status;
                if (resp.status == "Success")
                {
                  if(resp.volunteer_list.length > 0){
                    $scope.volunteersLength  = resp.volunteer_list.length;
                    $scope.items = resp.volunteer_list; 
                  }else{
                    $scope.volunteersLength  = 0;
                   
                
                  }
                }else
                {
                  $scope.volunteersLength  =0;
                }
            });
        }



        $scope.pagging = function () {
            $scope.pagecount = $scope.pagecount + 1;           
            loadData();

        } 

        $scope.backPage = function () {
            $window.location.href = '#/eventlist';
        };

        loadData();



/* function for delete teacher here.....................*/
$scope.removeVolunteer = function (volunteersId) {            
  var confirmPopup = $ionicPopup.confirm({
    title: 'Delete volunteers',
    template: 'Are you sure want to delete this volunteers?',
  });
  confirmPopup.then(function(res) {
    if (res == true) {
      ajaxloader.loadURL(global.config['api_url'] + '/event/quit_from_volunteer?token=' + Service_Store.getLocal('app_token'),
      {
        id:volunteersId,        
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
              $window.location.href = '#/eventlist';                                 
            } else if (resp.error_code == 1) {            
            global._alert({template: 'Not success', dependency: $ionicPopup});
            } else
            {
                global._alert({template: 'error occure', dependency: $ionicPopup});
            }
       
        } 

    }]);
