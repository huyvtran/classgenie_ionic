var school = angular.module('starter');
/**
 * Define the school teacher controller
 */
school.controller('ctrlSchoolTeacherList',['$scope','$ionicModal','$state','$base64','$ionicPopup','$ionicLoading', function($scope,$ionicModal,$state,$base64,$ionicPopup,$ionicLoading){
          loader.dependency = $ionicLoading;
          var data = JSON.parse(Service_Store.getLocal('selected_school'));
          $scope.idList='';
          data = JSON.parse(data);
          $scope.school = data['school_name'];
          var school_id = data['school_id'];
          $scope.schooladd   = data['address']
          $scope.member_no = Service_Store.getLocal('das_member_no');
          $scope._type=Service_Store.getLocal('_type')
          $scope.imagepath= global.config['file_url']+global.config['image_path']+'profile_image/';
          var user = Service_Store.getLocal('parentdata');
              user = JSON.parse(user);
          global.checkNetworkConnection($ionicPopup);
          ajaxloader.load(global.config['api_url']+'/schools/teacherlist?token='+Service_Store.getLocal('app_token')+'&school_id='+school_id,function(resp)
           {  
                var resp = JSON.parse(resp);
                console.log(JSON.stringify(resp));
                if(resp.status == "Success"){
                    $scope.items  = resp.Teacher_list;            
                    $scope.listsize = $scope.items.length;
                    for(var i=0;i<resp.Teacher_list.length;i++){
 
                      $scope.idList +=resp.Teacher_list[i].email+',';

                     
                      console.log("^^^^^"+$scope.idList);
                    }
                    console.log($base64.encode( $scope.idList));
                }
                else
                {
                    $scope.listsize = resp.comments;
                }
           });
          

    $scope.closepopup = function(){
         $scope.modal.remove();
     };    
     
     /**
      * Execute on join the school click
      */
      $scope.cnfbox = function(){
        var confirmPopup = $ionicPopup.confirm({
          title: '<img src="img/alert.png" class="alert"/><b>Classgenie</b>',
             template: 'Are you Sure you want to join this School?'
           });
        confirmPopup.then(function(res){
          if(res){
            $scope.joinschool();
          }else{
            return false;
          }
        });
      };
      
     $scope.joinschool = function(){
             global.checkNetworkConnection($ionicPopup);
             ajaxloader.loadURL(global.config['api_url']+'/schools/joinschools?token='+Service_Store.getLocal('app_token'),
             {
                  school_id: school_id,
                  member_no: $scope.member_no,
                  type: $scope._type
                  
             },$scope.joinresponse = function(resp){
                      if(resp.status == "Success"){ 
                            var newschool = [];
                            newschool.push({'school_name':$scope.school});
                            user[0].school_id = school_id;
                            user = JSON.stringify(user);
                            Service_Store.setLocal('parentdata',user);
                            Service_Store.setLocal('school',JSON.stringify(newschool));
                            $state.go('dashboard', {}, { reload: true });
                            if(sendrequest()){
                              alert(1);
                               $scope.modal.remove();
                            }
                            var message  = "You Joined the school";
                            window.plugins.toast.show(message, 'short', 'center');
                      } 
                      else if(resp.status == "Failure"){
                          var message  = resp.comments;
                          //window.plugins.toast.show(message, 'short', 'center');
                          global._alert({template: message, dependency:$ionicPopup});
                      }
                      else if(resp.error_code==1){
                          global._alert({template: resp.error_msg, dependency:$ionicPopup});
                      } 
                      window.plugins.toast.show(message, 'short', 'center');
                } 

            );
      }
     
     /**
      *Send request to all the member associates with the school
      */
     sendrequest = function(){
       
              console.log("*******"+user[0].name);  
             if(typeof $scope.items != 'undefined'){
                  $scope.listsize = $scope.items.length;
                  var mailid = [];
                  for(i=0;i<$scope.listsize;i++){ 
                     mailid.push({'value':$scope.items[i].email});
                  }
                  // var emaildata = { "emaildata" :{
                  //   "member_no":$scope.member_no,
                  //   "name":user[0].name,
                  //   "email":{
                  //   "mailid":mailid
                  //    }}};

                 //emaildata = JSON.stringify(emaildata);
                // emaildata = $base64.encode(emaildata);
                 global.checkNetworkConnection($ionicPopup);
                 ajaxloader.loadURL(global.config['api_url']+'/sendmail?token='+Service_Store.getLocal('app_token')+'&id='+5,
                  {
                    member_no:$scope.member_no,
                    emaildata:$base64.encode($scope.idList)
                  },$scope.sentinvite = function(resp){
                      if(resp.status == "Success"){
                          $scope.modal.remove();
                      }
                 });
             }
             $scope.modal.remove();
       }
      
}]);
