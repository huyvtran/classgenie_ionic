var dashboard = angular.module('starter');
dashboard.controller('dashboardCtrl',['$scope','$window','$location','$state','$cordovaSocialSharing','$ionicModal','$state','$ionicPopup','$ionicLoading','$cordovaToast','$ionicPlatform',function($scope,$window,$location,$state,$cordovaSocialSharing,$ionicModal,$state,$ionicPopup,$ionicLoading,$cordovaToast,$ionicPlatform){
loader.dependency = $ionicLoading;
$scope.classlength = '';
$scope.imagePath = global.config['file_url']+global.config['image_path']; // Image path For binding Image with view
            var jsonresponse=Service_Store.getLocal('parentdata');
            var deviceId=Service_Store.getLocal('das_device_id');
            Service_Store.setLocal('profile_status',"1");
            var json=JSON.parse(jsonresponse);            
            Service_Store.setLocal('user_status',json[0].status);
            for (var i=0;i<json.length;i++)
            { 
               var id       =json[0].id;
               var name     =json[0].name;
               var userEmail=json[0].email;
               var member_no=json[0].member_no;
               var user_type=json[0].type;
               var school_id=json[0].school_id;
               var userImage=json[0].image;
               var _type=json[0].type;
               var status   =json[0].status; 
            }
            Service_Store.setLocal('_type',_type)
            if(school_id == 0 || school_id == undefined)   //If no school associate
            { 
               $scope.school   = 'Join Your School';
               $scope.subtitle = 'Connect with teachers at your school';
            }
            else if(typeof(Service_Store.getLocal('school')) != 'undefined')   //If school associate
            { 
               var school = JSON.parse(Service_Store.getLocal('school'));
               if(Array.isArray(school) && school.length>0){
                  $scope.school = school =  school[0].school_name;
               }
               else
               {
                  $scope.school = school =  '';
               }
           }
           $scope.username=name;
           Service_Store.setLocal('das_member_no',member_no);
           Service_Store.setLocal('school_id',school_id);
           Service_Store.setLocal('das_username' ,name);
           if(userImage != '')
               Service_Store.setLocal('das_userimage',userImage);
           else
              userImage=Service_Store.getLocal('das_userimage');
           
          if(userImage)
              $scope.imgURI=global.config['file_url']+global.config['image_path']+'profile_image/'+userImage+'?'+global.randomNumber();
          else
              $scope.imgURI="img/chat_user.png?"+global.randomNumber();


          //Replace $ character with ?
          $scope.removeDollerChar = function(string){
              return string.replace('$','?');
          } 

          /**
           *Function to Load Dashboard data and class List for teacher 
           */
           loadData=function(){
                   global.checkNetworkConnection($ionicPopup);
                   ajaxloader.async=false;
                   ajaxloader.load(global.config['api_url']+'/classinfo/dashboard?token='+Service_Store.getLocal('app_token')+"&teacher_ac_no="+member_no,
                   function(resp){
                         ajaxloader.async=true;
                         var res1=$.parseJSON(resp);
                         if(res1.status == "Success"){
                          $scope.arr_count =res1.user_list.length;
                             $scope.items = res1.user_list;
                             $scope.classlength = res1.user_list.length;

                         }
                         else if(res1.error_code==1){
                             global._alert({template: res1.error_msg, dependency:$ionicPopup});
                         }
                  });
           }
       
         loadData(); //Execute on pageload
      
         /**
          * 
          */
         $scope.doRefresh = function(){
              loadData();              
              $scope.$broadcast('scroll.refreshComplete');  
         };

          /**
           *Function to Save user Device Id from On server 
           */
          deviceRegister=function(){
                global.checkNetworkConnection($ionicPopup);
                ajaxloader.async=false;
                ajaxloader.loadURL(global.config['api_url']+'/save_deviceid?token='+Service_Store.getLocal('app_token'),
                {
                   member_no:member_no,
                   device_id:deviceId
                },function(resp){
                   ajaxloader.async=true;
                });
          }

          deviceRegister(); //calling function for register device id

           /**
            *Function to verify school
            *Send to school story listing page
            */
           $scope.varify = '';
           $scope.schoolvarify = function(){
                ajaxloader.load(global.config['api_url']+'/teacher/search?token='+Service_Store.getLocal('app_token')+"&member_no="+member_no,
                   function(resp){
                       var res1=$.parseJSON(resp);
                       if(res1.status == "Success")
                       {
                          if(res1.user_list[0].status == '1' && school_id != 0){
                             $state.go('school_story');
                          }
                          else if(res1.user_list[0].status == '0' && school_id != 0){
                             window.plugins.toast.show('Your account is under verification', 'short', 'center');
                          } 
                       }
                       else if(res1.error_code==1){     
                          global._alert({template: res1.error_msg, dependency:$ionicPopup});
                       }
                 });
            }
   
   
   /**
    *Execute this function on school click
    */     
   $scope.schoolinfo = function(){    
        if(school_id == 0)
        { 
           if(user_type == 5 || user_type == 1){
             $scope.hideshow = false;
           }else{
              $scope.hideshow = true;
           }   
              
           $ionicModal.fromTemplateUrl('templates/school.html', {
              scope: $scope,
              animation: 'slide-in-up'
           }).then(function(modal) {
              $scope.modal = modal;
              $scope.modal.show();
           });
        }
        else
        {
           $scope.schoolvarify();
        }
  }

     
   //list item click open classroompage
   $scope.openClassDetail=function(){
        var classid   = this.item.class_id;
        var className = this.item.class_name;
        Service_Store.setLocal('das_classid',classid);
        Service_Store.setLocal('das_classname',className);
        Service_Store.setLocal('das_classBack',"dashback");
        $window.location.href = '#/tab/'+classid+'/classroom';
    }
  
    //share app on social media
    $scope.shareSocial=function(){
         var message = "Build your own classroom community this year with Classgenie. "+$scope.username+" and other teachers of your school have already joined this community and hope that you will also love this. Turn your classroom into a digital one with Classgenie, encourage students, coordinate with parents, share school posts or classroom activities images or video or candid moments of the kids with their parents.\n\n To know more about our services please visit ";
         $cordovaSocialSharing.share("Classgenie", "Classgenie App", "img/logo.jpg", ""+message+" http://www.classgenie.in");
    }
     //open school story
    $scope.OpenSchoolStory=function(){
       $state.go('school_story');
    }


    //open event list
    $scope.eventList = function(){
      $state.go('eventlist');
    }
    $scope.addclass = function(){
      if((school_id == 0 || school_id == undefined) && $scope.classlength == 1)   //If no school associate
            { 
                 global._alert({template: 'You can\'t add more than one demo class as you are not join in any school', dependency:$ionicPopup});
                
            }else{

              if($scope.arr_count>9){
                global._alert({template: 'You cannot add more than 10 classes.', dependency:$ionicPopup});
              }else{
                $state.go('addclass');
              }
              
            }
    }

    
 }]);

