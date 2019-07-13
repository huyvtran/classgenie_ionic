var slides = angular.module('starter');

slides.controller('slideCtrl',['$scope','$location','$window','$ionicLoading','$state','$ionicSlideBoxDelegate',function($scope,$location,$window,$ionicLoading,$state,$$ionicSlideBoxDelegate){
 loader.dependency = $ionicLoading;


$scope.skip_tutorial=function(){
  Service_Store.setLocal('skipdta',"1");
  var jsonresponse = Service_Store.getLocal('parentdata');
        if(jsonresponse != "" && jsonresponse != null)
        {
            var json = JSON.parse(jsonresponse);
            for (var i = 0; i < json.length; i++)
            {
                var id = json[0].id;
                var name = json[0].name;
                var userEmail = json[0].email;
                var member_no = json[0].member_no;
                var user_type = json[0].type;
                var school_id = json[0].school_id;
                var userImage = json[0].image;
                var status    = json[0].status;
            }
            if (user_type == 2 || user_type == 1 || user_type == 5) {console.log('user_type');
                $state.go('dashboard');
            }
            if (user_type == 3) {
                $state.go('home.class_story');
            }
            if (user_type == 4) {
                $state.go('st_home.studentinvite');
                      if(status == '0')
                {
                    window.plugins.toast.show('Account not verified', 'short', 'center');
                }
            }
        }
}

 }]);
