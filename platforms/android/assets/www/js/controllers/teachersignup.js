  var teach1 = angular.module('starter');
  teach1.controller('teacherRegister',['$scope','$location','$window','$http','$ionicPopup','$ionicLoading',function($scope,$location,$window,$http, $ionicPopup,$ionicLoading){
  loader.dependency = $ionicLoading;
  $scope.signup_title = 'Teacher Signup';
  $scope.signup_content_class = 'signup-already';
  $scope.signup_content = '<p>Get ready for your best classroom yet :)</p>';
  $scope.show_content = true;
  $scope.reg={};
  $scope.minlength = 6;
  
  /**
     *function to varify validation
     *@params item
     */

   $scope.passvalidation = function(item)
   { 
   
      if($('#password').val().length < 6)
      { 
        $('#password').css({"border": "1px solid #F83A39"});
      }
      else if($('#password').val().length >= 6)
      {
        $('#password').css({"border": ""});
      }
   }
    /**
     *Define login user function execute on click event
     */
     $scope.doTeacherSignUp=function(){
          
         ajaxloader.loadURL(global.config['api_url']+'/teacher?token='+Service_Store.getLocal('app_token'),
         {
            name: $scope.reg.fname,
            email: $scope.reg.email,
            password: $scope.reg.password,
            phone: $scope.reg.phone,
            usertype:"2"
        },$scope.signupResponse);
     }

    /**
     *Response from ajax
     *@params resp
     */
     $scope.signupResponse = function(resp){
        if(resp['status'] == "Success")
        { 

           var jsonresponse =resp["user_list"];
           
           Service_Store.setLocal('parentdata',JSON.stringify(jsonresponse));
           for(var i=0;i<jsonresponse.length;i++){

            if(jsonresponse[0].type==2)
            {

             //ajaxloader.load(global.config['api_url']+'/sendmail?token='+Service_Store.getLocal('app_token')+'&email='+jsonresponse[0].email+'&id=14&member_no='+jsonresponse[0].member_no, function(resp){
                  $window.location.href = '#/dashboard';//load dashboard
             //});
            }
          }
        }else if(resp.error_code==1){

            global._alert({template: resp.error_msg, dependency:$ionicPopup});

          }
        else if(resp['comments'] == "already exists!")
           {
            global._alert({template: 'Email id already exists', dependency:$ionicPopup});

           }
        else
          {
           global._alert({template: resp['comments'], dependency:$ionicPopup});
          }
 }


}]);



