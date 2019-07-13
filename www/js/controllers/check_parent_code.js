var check_parent_code = angular.module('starter');
check_parent_code.controller('checkParentCtrl',['$scope','$location','$window','$ionicPopup','$ionicHistory','$ionicLoading','$cordovaToast',function($scope,$location,$window,$ionicPopup,$ionicHistory,$ionicLoading,$cordovaToast){
loader.dependency = $ionicLoading;
    var jsonresponse=Service_Store.getLocal('parentdata');
    var json= $.parseJSON(jsonresponse);
    for (var i=0;i<json.length;i++)
    {

        var id       =json[0].id;
        var name     =json[0].name;
        var userEmail=json[0].email;
        var member_no=json[0].member_no;
        var user_type=json[0].type;
    }
/**
*Define login user function execute on click event
*/
    $scope.checkCode=function(){

       
        global.checkNetworkConnection($ionicPopup);
        ajaxloader.loadURL(global.config['api_url']+'/parentcode?token='+Service_Store.getLocal('app_token'),
        {
            parent_no: $scope.code,
            parent_ac_no:member_no

        },$scope.check_code_Response);
    };

/**
*Response from ajax
*@params resp
*/
    $scope.check_code_Response = function(resp){
        if(resp['status'] == "Failure")
        {
            global._alert({template: resp['comments'], dependency:$ionicPopup});
        }
        else if(resp['status'] == "Success")
        {  if(resp['student_list'].length<2){
           $window.location.href = '#/home/class_story'; //load parent dashboard   
        }else{
            $window.location.href = '#/home/your_kid';
            window.plugins.toast.show('student successfully added..', 'short', 'center');
        }
        }
        else
        {
            global._alert({template: 'server issue while saving,Please try after some time', dependency:$ionicPopup});
        }

    };

    $scope.goBack=function(){

      $ionicHistory.goBack();
        
    }

}]);