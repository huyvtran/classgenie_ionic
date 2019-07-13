var login = angular.module('starter');
/**
 *Login controller
 */
login.controller('Login', ['$scope', '$ionicPopup', '$location', '$window', '$ionicLoading', '$state','$cordovaToast', function ($scope, $ionicPopup, $location, $window, $ionicLoading, $state,$cordovaToast) {
        loader.dependency = $ionicLoading;
        $scope.signup_title = 'Login';
        $scope.show_content = false;
        $scope.loginData = {};
        var jsonresponse = Service_Store.getLocal('parentdata');
        

        /**
         *Define login user function execute on click event
         */
        $scope.loginUser = function () {
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.load(global.config['api_url'] + '/login?token=' + Service_Store.getLocal('app_token') + '&email=' + $scope.loginData.email_id + '&password=' + $scope.loginData.password,
                    $scope.loginResponse);
        };

        /**
         *Response from ajax
         *@params resp
         */
        $scope.loginResponse = function (resp) {
            var obj = $.parseJSON(resp);
            var deviceId  = Service_Store.getLocal('das_device_id');
            var app_token =  Service_Store.getLocal('app_token');
            var skipdata =Service_Store.getLocal('skipdta');
            Service_Store.clearAll();
            Service_Store.setLocal('das_device_id', deviceId);
            Service_Store.setLocal('app_token', app_token);
            Service_Store.setLocal('skipdta',skipdata);
            
            if (obj.status == "Success")

            {
                var jsonresponse = obj.user_list;
                Service_Store.setLocal('parentdata', JSON.stringify(jsonresponse));
                if (obj.user_list[0].type == '2' || obj.user_list[0].type == '1' || obj.user_list[0].type == '5')
                {
                    if (obj.hasOwnProperty("school") == true) {
                        Service_Store.setLocal('school', JSON.stringify(obj.school));
                        Service_Store.setLocal('school_id',JSON.stringify(obj.school_id));
                    }
                    
                    if(skipdata=="" || skipdata==null){
                     $state.go('slide');

                   }else{$window.location.href = '#/dashboard'; //load dashboard
                   }
                    
                } else if (obj.user_list[0].type == '3')
                {
                    Service_Store.setLocal('school_id',JSON.stringify(obj.school_id));
                    if(skipdata=="" || skipdata==null){
                     $state.go('slide');

                   }else{
                    $window.location.href = '#/home/class_story'; //load parent dashboard              }
                }
                } else if (obj.user_list[0].type == '4') {
                    if(skipdata=="" || skipdata==null){
                     $state.go('slide');

                   }else{
                    $window.location.href = '#/st_home/studentinvite'; //load dashboard
                }
                     if(obj.user_list[0].status == '0')
                {
                    window.plugins.toast.show('Account not verified', 'short', 'center');
                }
                }
            } else if (resp.error_code == 1) {

                global._alert({template: resp.error_msg, dependency: $ionicPopup});

            } else
            {
                global._alert({template: 'Please check username or password', dependency: $ionicPopup});
            }
        }



    }]);

/**
 *Forget password controller
 */
login.controller('Forgetpassword', ['$scope', '$ionicPopup', '$location', '$state', '$ionicPopup', '$ionicLoading', function ($scope, $ionicPopup, $location, $state, $ionicPopup, $ionicLoading) {
        
       $scope.forgotPassword = function ()
        { //$scope.show();
            var id    = '';
            var param = '';
            if($scope.useremail.indexOf('@') != '-1' )
            {   param = 'email';
                id    = '10';
            }else{
                param = 'username';
                id    = '17';
            }
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.load(global.config['api_url'] + '/sendmail?token=' + Service_Store.getLocal('app_token') + '&'+param+'=' + $scope.useremail + '&id=' + id,
                    $scope.loginResponse = function (resp)
                    {
                        var res = JSON.parse(resp);
                        if (res.status == 'Success')
                        { //$scope.hide();

                            global._alert({template: 'Password reset has been sent to your email id', dependency: $ionicPopup});
                            $state.go('login');
                        } else
                        {
                            $scope.hide();
                            global._alert({template: 'Username or Email address not registered', dependency: $ionicPopup});

                        }
                    });

            //$scope.show();
        };

        $scope.close_reset_password = function ()
        {

            $state.go('login');
        }

    }]);
