var school = angular.module('starter');
/**
 * Define the school controller
 */
school.controller('ctrlSchool',['$scope','$ionicModal','$cordovaToast','$window','$ionicPopup','$ionicLoading', function($scope,$ionicModal,$cordovaToast,$window,$ionicPopup,$ionicLoading){
         loader.dependency = $ionicLoading;
         $scope.school_name = "";
         $scope.addlink = true;
         
         /**
          * Get list of all schools
          */  
        
        var jsonresponse=Service_Store.getLocal('parentdata');
        var json=JSON.parse(jsonresponse);
        var member_no = json[0].member_no;


         /**
          * Get list of all schools
          */
         ajaxloader.async = false;
         global.checkNetworkConnection($ionicPopup);
         ajaxloader.load(global.config['api_url']+'/schools/list?token='+Service_Store.getLocal('app_token')+'&member_no='+member_no,function(resp){
              $scope.mylist_data = $.parseJSON(resp).school_list;
              ajaxloader.async = true;
          });   
        
          /** 
           * Search school
           */
          $scope.seachSchool = function(school_name){
                var myLength = $("#search").val().length;
                if(myLength > 0)
                 {
                   $scope.addlink = false;
                 }
                 else
                 {
                    $scope.addlink = true;
                 }
               ajaxloader.async = false;
               global.checkNetworkConnection($ionicPopup);
               ajaxloader.load(global.config['api_url']+'/schools/search?token='+Service_Store.getLocal('app_token')+'&school_name='+school_name,function(resp){
                  $scope.mylist_data = $.parseJSON(resp).school_list;
                  ajaxloader.async = true;
               });
          }

          $scope.seachSchoolKeyup  = function(school_name, keyEvent){
                var myLength = $("#search").val().length;
                if(myLength > 0)
                 {
                   $scope.addlink = false;
                 }else{
                   $scope.addlink = true;
                 }
                $scope.seachSchool(school_name);
                $scope.school_name  = school_name; 
            }
          
          /**
           * Execute on selected itmem
           */
          $scope.selectedItem = function(elem, item){
               var schoolinfo = JSON.stringify(item);
               Service_Store.setLocal('selected_school', schoolinfo);
               $('#classgenie_school_list a').removeClass('activated');
               $('#classgenie_school_list #'+elem).addClass('activated');
               $scope.modal.remove();
               openteacherlist();
          }
          
          /**
           *Open school teacher list 
           */
          openteacherlist = function(){
               $ionicModal.fromTemplateUrl('templates/school_teacher_list.html', {
                 scope: null,
                 animation: 'slide-in-up'
               }).then(function(modal) {
                 $scope.modal = modal;
                 $scope.modal.show();
              });
           }

          /**
           * Send dash baord in case of i am not in school
           */
           $scope.sendDashboard = function(){
               Service_Store.setLocal('selected_school_id', 0);
               window.location.href = '#/dashboard';
           }

           /**
            * Send on teacher list page for sending invitation
            */
            $scope.sendRequestTeacherlist = function(){
               window.location.href = '#/school_teacher_list';
            }


            $scope.skipaddschool = function(){
                $scope.modal.remove();
            }

            $scope.add_school = function(){
                   var school_name = $scope.school_name;
                   Service_Store.setLocal('joinschool',school_name);
                   $scope.modal.remove();
                   $ionicModal.fromTemplateUrl('templates/createschool.html',{
                   scope: null,
                   controller:'addschool',
                   animation: 'slide-in-up'
                }).then(function(modal) {
                   $scope.modal = modal;
                   $scope.modal.show();
                });
          }
 
  }]);


var addschool = angular.module('starter');
/**
 *Define add school controller
 */
addschool.controller('addschool',['$scope','$ionicModal','$state','$window','$ionicPopup',function($scope,$ionicModal,$state,$window,$ionicPopup){
           var jsonresponse=Service_Store.getLocal('parentdata');
           var json=JSON.parse(jsonresponse);
           var teachername = json[0].name;
           $scope.school = {};
           $scope.school.schoolname = Service_Store.getLocal('joinschool');
           $scope.saveschool = function()
           { 
                global.checkNetworkConnection($ionicPopup);
                ajaxloader.loadURL(global.config['api_url']+'/schools/addschoolslist?token='+Service_Store.getLocal('app_token'),
                {
                  school_name: $scope.school.schoolname,
                  address:     $scope.school.address,
                  city:        $scope.school.city,
                  state:       $scope.school.state,
                  country:     $scope.school.country,
                  pincode:     $scope.school.pin,
                  phone:       $scope.school.phone,
                  email_id:    $scope.school.email,
                  web_url:     $scope.school.site,
                  member_no:Service_Store.getLocal('das_member_no')
                },$scope.addschoolResponse);
            }

            $scope.addschoolResponse = function(resp){ 
                if(resp['status'] == "Success"){
                  $scope.modal.remove(); 
                  $ionicModal.fromTemplateUrl('templates/schoolcreated.html',{
                    scope: null,
                    animation: 'slide-in-up'
                    }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                 }); 
                 var message  = 'School created, sent for approval';
                 var newschool = [];
                 newschool.push({'school_name':resp.teacher_list[0].school_name});
                 json[0].school_id = resp.teacher_list[0].school_id;
                 user = JSON.stringify(json);
                 Service_Store.setLocal('parentdata',user);
                 Service_Store.setLocal('school',JSON.stringify(newschool));
                 $state.go('dashboard', {}, { reload: true });
                 $scope.approveSchool();
                 window.plugins.toast.show(message, 'short', 'center');
                 Service_Store.setLocal('joinschool',$scope.school.schoolname);
                return;
              }else if(resp.error_code==1){
                  global._alert({template: resp.error_msg, dependency:$ionicPopup});
               }
            }

            $scope.approveSchool = function(){
              ajaxloader.load(global.config['api_url']+'/sendmail?token='+Service_Store.getLocal('app_token')+'&id='+6+'&teacher_name='+teachername+'&school_name='+$scope.school.schoolname, {}, $scope.sentinvite = function(resp){});
            }

            $scope.closepopup = function(){
              $scope.modal.remove();
            }

}]);

/**
 *Define sendinvite controller
 */
school.controller('sendinvite',['$scope','$state','$cordovaSocialSharing',function($scope,$state,$cordovaSocialSharing){
      $scope.school = Service_Store.getLocal('joinschool');
      $scope.skipinvitee = function(){
          $scope.modal.remove();
          $state.go('dashboard', {}, { reload: true });
      }

      $scope.closepopup = function(){
          $scope.modal.remove();
          $state.go('dashboard', {}, { reload: true });
      }

      $scope.inviteteachers = function(){
         $cordovaSocialSharing.share("Classgenie", "Classgenie App", "img/logo.jpg", "https://www.xyz.com");
      }
}]);
