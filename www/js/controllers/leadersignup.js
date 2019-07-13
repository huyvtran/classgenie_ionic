  var teach1 = angular.module('starter');
  teach1.controller('leader_signupCtrl',['$scope','$location','$window','$http','$ionicPopup','$ionicLoading',function($scope,$location,$window,$http,$ionicPopup,$ionicLoading){
  loader.dependency = $ionicLoading;
  $scope.signup_title = 'Leader Signup';
  $scope.signup_content_class = 'signup-already';
  $scope.signup_content = '<p>Get ready for your best classroom yet :)</p>';
  $scope.show_content = true;
  $scope.reg={};
  $scope.minlength = 6;
  $scope.list = [

            {
                Id: 5,
                Name: 'Vice-principle',                 
            },
            {
                Id: 1,
                Name: 'Principle',                 
            },   
            ];


  
  /**
   *function to varify validation
   *@params item
   */

   $scope.varify = function(item)
   {
        var message = '';
        if(item == undefined){
           message = 'password must be atleast 6 characters long..';
           global._alert({template: message, dependency:$ionicPopup});
           $scope.formteacher = false;
        }
       else
        {
          $scope.formteacher = true;
        }
   }

    
    /**
     *Define login user function execute on click event
     */
     $scope.doTeacherSignUp=function(){       
          
         ajaxloader.loadURL(global.config['api_url']+'/teacher/?token='+Service_Store.getLocal('app_token'),
         {
            name: $scope.reg.fname,
            email: $scope.reg.email,
            password: $scope.reg.password,
            phone: $scope.reg.phone,
            usertype:$scope.reg.selectGrade
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
            if(jsonresponse[0].type==1 || jsonresponse[0].type==5)
            {
               $window.location.href = '#/dashboard';
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



