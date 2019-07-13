  var student_signup = angular.module('starter');
  student_signup.controller('studentRegister',['$scope','$window','$ionicPopup','$cordovaToast','$state','$ionicLoading',function($scope,$window,$ionicPopup,$cordovaToast,$state,$ionicLoading){
  loader.dependency = $ionicLoading;

  $scope.signup_title = 'Student Signup';
  $scope.show_content = false;
  $scope.alreadyexist = true;
  $scope.ageValue = "Age";
  $scope.loginData={};
  $scope.checkcode = true;
  $scope.stu_signup = true;
  $('#hidden_fields').hide();
  $('#signup').hide();
  $scope.message = true;
  $scope.parentemail;
  
  //Show taggle message
  $scope.toggleCustom = function() {
     $scope.message = $scope.message === false ? true: false;
  };
    
  /**
   *checking username  function execute on click event
   */  
   $scope.checkUserName=function(){
      if($scope.loginData.studentcode.length >= 9)
      { 
          global.checkNetworkConnection($ionicPopup);
          ajaxloader.loadURL(global.config['api_url']+'/student/add?token='+Service_Store.getLocal('app_token')+'&student_no='+$scope.loginData.studentcode,{},$scope.studentSignupResponse = function(resp){
                  if(resp['status'] == "Success"){   
                      $scope.checkcode = true;
                      $('#signup').show();
                      $('#hidden_fields').show();
                      $('#checkuser').hide();
                      $('#user').hide();
                      $scope.id = resp['user_list'][0].id;
                      $scope.student_no = resp['user_list'][0].student_no;
                  }
                  else if( resp['status'] == "Failure"){  
                      $scope.response = resp['comments'];       
                      global._alert({template: $scope.response, dependency:$ionicPopup});
                  }else if(res1.error_code==1){
                      global._alert({template: resp.error_msg, dependency:$ionicPopup});
                  }
              }
         );
      }
      else
      { 
         var message = 'Code length too short..';
         global._alert({template: message, dependency:$ionicPopup});
      }
  }

  $scope.varifyUser = function()
  {
      if($('#uname').val().length  > 4 && $('#uname').val().indexOf('@') == '-1' && $scope.loginData.ageValue.length > 0 && $('#password').val().length > 5)
      {
        $scope.stu_signup = false;
      }else{
        $scope.stu_signup = true;
      }
  }
  
  //student signup 
  $scope.studentSignup=function(){
              global.checkNetworkConnection($ionicPopup);
          	  ajaxloader.loadURL(global.config['api_url']+'/student?token='+Service_Store.getLocal('app_token'),
          		{           
      			        username: $scope.loginData.username,
                         age: $scope.ageValue,
                    password: $scope.loginData.password,
                          id: $scope.id,
                  student_no: $scope.student_no
               },$scope.loginResponse = function(resp){
                      if(resp['status'] == "Success")
                      { 
                         var jsonresponse = resp["user_list"];
                         if(resp["user_list"][0].type==4)
                         { 
                            var stud_data = JSON.stringify(jsonresponse);
                            Service_Store.setLocal('parentdata',stud_data);
                            Service_Store.setLocal('signup','1');
                            Service_Store.setLocal('studentcode',$scope.loginData.studentcode);
                            $state.go('st_home.studentinvite');
                         }
                      }
                      else if(resp['status'] == "Failure"){
                        global._alert({template: resp['comments'], dependency:$ionicPopup});
                      }
                      else if(resp.error_code==1){
                        global._alert({template: resp.error_msg, dependency:$ionicPopup});
                     }
                     else
                     {
                         global._alert({template: "Server issue while saving,Please try after some time", dependency:$ionicPopup});
                     }
             });
      };
     
     $scope.numberfocus = function(){
        $scope.alreadyexist = true;
     }

}]);
