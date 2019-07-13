var parent = angular.module('starter');
parent.controller('parentRegister',['$scope','$ionicPopup','$location','$window','$ionicHistory','$ionicLoading', function($scope,$ionicPopup,$location,$window,$ionicHistory,$ionicLoading){
  loader.dependency = $ionicLoading;
  $scope.signup_title = 'Parent Signup';
  $scope.signup_content_class = 'signup-already';
  $scope.signup_content = '<p>Get ready for your best classroom yet :)</p>';
  $scope.show_content = true;
  $scope.par= {};
  $scope.minlength = 6;


/**
*Define login user function execute on click event
*/

   $scope.passvalidation = function(item)
   { 
    if($('#passsword').val().length < 6)
      { 
        $('#passsword').css({"border": "1px solid #F83A39"});
      }
      else if($('#passsword').val().length >= 6)
      {
        $('#passsword').css({"border": ""});
      }
   }

$scope.doParentSignUp=function(){
    global.checkNetworkConnection($ionicPopup);
    ajaxloader.loadURL(global.config['api_url']+'/parent?token='+Service_Store.getLocal('app_token'),
    {
        name: $scope.par.fname,
        email: $scope.par.email,
        password: $('#passsword').val(),
        phone: $scope.par.phone
    },$scope.signupResponse = function(resp){
    if(resp['status'] == "Failure")
    {
         global._alert({template: resp['comments'], dependency:$ionicPopup});
    }
    else if(resp['status'] == "Success")
    { 
         var jsonresponse =resp["user_list"];
         Service_Store.setLocal('parentdata',JSON.stringify(jsonresponse));
         for(i=0 ; i<=jsonresponse.length ; i++){
         if(jsonresponse[0].type ==3){

          //  ajaxloader.load(global.config['api_url']+'/sendmail?token='+Service_Store.getLocal('app_token')+'&email='+jsonresponse[0].email+'&id=15&member_no='+jsonresponse[0].member_no+'&name='+jsonresponse[0].name, function(resp){
                  $window.location.href = '#/check_parent_code';//load dashboard
           //  });

         }
        }
      }
      else if(resp.error_code==1){

        global._alert({template: resp.error_msg, dependency:$ionicPopup});

      }
      else
      {
          global._alert({template: resp['comments'], dependency:$ionicPopup});
      }

    });
};

/**
*Response from ajax
*@params resp
*/

}]);