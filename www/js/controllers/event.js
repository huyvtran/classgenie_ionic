var event = angular.module('starter');
/**
 * Define the event controller
 */
 event.controller('eventCtrl',['$scope','$state','$window','$filter','$ionicModal', '$ionicPopup', '$ionicLoading', function($scope,$state,$window, $filter,$ionicModal, $ionicPopup, $ionicLoading){
     
    var no_of_valunteer=[], hour_range=[], minute_range=[], second_range = [],selectItem=[];
    $scope.loginData = {};
    $scope.object_id=[];
    $scope.datanotFound='';
     loader.dependency = $ionicLoading; //Set for loader
     $scope.today = new Date();
    var member_no = Service_Store.getLocal('das_member_no');    
   
     
   //   loadData = function(){
   //     global.checkNetworkConnection($ionicPopup);
   // // ajaxloader.async = false;
   //   ajaxloader.load(global.config['api_url']+'/event/list?token=aforetechnical@321!&school_id=4&member_no=124578',
   //   function(resp){
   //     var res1=$.parseJSON(resp);
   //     console.log(res1.event_list);     
   //    if (res1.status == "Success")
   //      {
   //        $scope.items = res1.event_list;
   //        ajaxloader.async = true;                  
   //              } else {
   //                $scope.datanotFound="No Assignment Available Yet !"; 

   //                                  console.log($scope.datanotFound);   
   //              }
   //   });
   //   }
   //   loadData();
    //Go to dashboard
      $scope.goToDashBoard = function(){
          $window.location.href = '#/eventlist';
      }      
      /*Create noofvalunter, hour, minute and second range*/
      for(var i=0; i<=9; i++){
        no_of_valunteer.push(i);
      }
      for(var i=0; i<24; i++){
         if(i<10) i='0'+i;
         hour_range.push(i);
      }
   
      for(var i=0; i<60; i++){
         if(i<10) i='0'+i;
         minute_range.push(i);
      }

      for(var i=0; i<60; i++){
         if(i<10) i='0'+i;
         second_range.push(i);
      }
      $scope.no_of_valunteer = no_of_valunteer;
      $scope.hour_range = hour_range;
      $scope.minute_range = minute_range;
      $scope.second_range = second_range;
      /*Eof genrate range*/
    
      // $scope.selectSchedule = function(scheduleValue){
      //        if(scheduleValue == ''){
      //            $('#divMainContainer').hide();
      //        }
      //        else 
      //        {
      //         $('#divMainContainer').show();
      //         if(scheduleValue == 'm'){
      //           $('#div_monthly').show();
      //           $('#div_weekly').hide();
      //           $('#div_date').hide();
      //         }
      //         if(scheduleValue == 'w'){
      //           $('#div_monthly').hide();
      //           $('#div_weekly').show();
      //           $('#div_date').hide();
      //         }
      //         if(scheduleValue == 'd'){
      //           $('#div_monthly').hide();
      //           $('#div_weekly').hide();
      //           $('#div_date').show();
      //         }
      //         if(scheduleValue == 'lw'){
      //           $('#div_monthly').hide();
      //           $('#div_weekly').hide();
      //           $('#div_date').hide();
      //         }
      //        }
      //   };

    //Get date picker value
    // $scope.mdatePickerCallback = function($this){
    //   $('#mdate').val(this.mcurrentDate);
    // }
  
    $scope.datePickerCallback = function(){
      $('#date').val(this.currentDate);
    }
    
    //Select no. of valueteer
    $scope.selectNoofValunteer = function(valunteerValue){
      if(valunteerValue>0){
           $('#rowResponsibilty').show();
      }
      else
      {
        $('#rowResponsibilty').hide();
      }
    }

     //Open responsibilty modal popup
     $scope.openResponsibilty = function(){
          $ionicModal.fromTemplateUrl('templates/add_responsibilty.html', {
          scope: $scope,
       }).then(function(modal) {
          $scope.modal = modal;
          $scope.loadResponsibiltyList();   //Load responsibilty list on page load
          $scope.modal.show();
       });
      }

      $scope.closeResponsibiltyModal = function(){
         $scope.modal.hide();
      }
      
      $scope.fres = {}; $scope.feres = {};
      //Execute this function when click save
      $scope.saveResponsibilty = function(){
             ajaxloader.async = false;
             ajaxloader.load(global.config['api_url']+'/event_responsibilty/list?token='+Service_Store.getLocal('app_token')+'&responsibilty='+$scope.fres.responsibilty,function(resp){
                  ajaxloader.async = true;
                  if($.parseJSON(resp).length>0){
                     global._alert({template: 'Responsibilty already exists!', dependency: $ionicPopup});
                  }
                  else
                  {
                     $scope._saveResponsibilty();
                  }
             });      
        }        
        //Save new responsibilty 
        $scope._saveResponsibilty = function(){
           ajaxloader.loadURL(global.config['api_url']+'/event_responsibilty/save?token='+Service_Store.getLocal('app_token'), {
                   responsibilty:$scope.fres.responsibilty,
                    member_no:member_no

                  }, function(resp){
                     global._alert({template: 'Responsibilty added successfully', dependency: $ionicPopup});
                     $scope.fres = {};
                     $scope.loadResponsibiltyList();
              });
        }
        $scope.loadResponsibiltyList = function(){
             ajaxloader.async = false;
             var resp_id=[];
             ajaxloader.load(global.config['api_url']+'/event_responsibilty/list?token='+Service_Store.getLocal('app_token')+"&member_no="+member_no, function(resp){
                  ajaxloader.async = true;
                  respj = $.parseJSON(resp); 
                  $scope.resListData = JSON.stringify(respj);
                  var resListId = JSON.stringify(respj);
                  $scope.respList_id =JSON.stringify(respj.user_list);
                  $scope.responsibilty_list_items = respj.user_list;                
             });
        }
        //Selected Responsibility
        $scope.selectResponsibilty = function(id){
           $scope.resp_id = id;
        }
        //Open responsibilty page 
        $scope.editResponsibiltyPage = function(id,name){
              $scope.object_id = id;
              $scope.object_name = name;
              $ionicModal.fromTemplateUrl('templates/edit_responsibilty.html', {
                scope: $scope,
             }).then(function(modal) {
                $scope.edit_modal = modal;
                $scope.showResponsibiltyDetail();
                $scope.edit_modal.show();
             });
        }
        var arr = [];
        $scope.updateSelection = function($event, id) {
        var checkbox = $event.target;        
        if(checkbox.checked){
           arr.push(id);
        }else{
           var index = arr.indexOf(id); 
          if (index > -1) {
            arr.splice(index, 1);
          }
        } 
        $scope.array_values =JSON.stringify(arr);
        };


        //  $scope.clickItem = function(id){

        //   console.log(4);
        //   console.log(id);
        //       //$scope.object_id = id;
        //        $scope.object_id.push({"resp_id":id});
        //       //$scope.object_name = name;
        //       console.log($scope.object_id);
        //       $scope.resp_srt = JSON.stringify($scope.object_id);
        //       console.log(24);
        //       console.log($scope.resp_srt);
        //      //  $ionicModal.fromTemplateUrl('templates/edit_responsibilty.html', {
        //      //    scope: $scope,
        //      // }).then(function(modal) {
        //      //    $scope.edit_modal = modal;
        //      //    $scope.showResponsibiltyDetail();
        //      //    $scope.edit_modal.show();
        //      // });
        // }



        $scope.closeEditResponsibiltyModal = function(){
             $scope.edit_modal.hide();
        }
        $scope.backPage = function () {
            $window.location.href = '#/tab/dashboard'        };
        $scope.showResponsibiltyDetail = function(){
             ajaxloader.async = false;
             ajaxloader.load(global.config['api_url']+'/event_responsibilty/list?token='+Service_Store.getLocal('app_token')+'&object_id='+$scope.object_id,function(resp){
                  ajaxloader.async = true;
                  var resp = $.parseJSON(resp);
             });
        }
        
        //Execute update responsibilty 
        $scope.updateResponsibilty = function(item,id){
            ajaxloader.async = false;
            ajaxloader.loadURL(global.config['api_url']+'/event_responsibilty/update?token='+Service_Store.getLocal('app_token'), {
                   responsibilty: item,
                   responsibilty_id:id
                  }, function(resp){
                     ajaxloader.async = true;
                     $scope.feres = {};
                     global._alert({template: 'Responsibilty update successfully', dependency: $ionicPopup});
                     $scope.edit_modal.hide();
                     $scope.loadResponsibiltyList();
              });  
        }
        
        //Remove responsibilty
        $scope.removeResponsibilty = function(id){
              ajaxloader.loadURL(global.config['api_url']+'/event_responsibilty/remove?token='+Service_Store.getLocal('app_token'),{
                responsibilty_id:id
              },function(resp){
                     global._alert({template: 'Responsibilty deleted successfully', dependency: $ionicPopup});
                     $scope.edit_modal.hide();
                     $scope.loadResponsibiltyList();
             });
        }          
      $scope.event_submit = function(){
         $scope.loadResponsibiltyList();
       var startDate = $filter('date')($scope.loginData.startDate,'yyyy-MM-dd')
       var endDate = $filter('date')($scope.loginData.endDate, 'yyyy-MM-dd');
       var day_weekly = $filter('date')($scope.loginData.date_weekly);
       var day_monthly = $filter('date')($scope.loginData.mcurrentDate,'yyyy-MM-dd');
       var startTime = $filter('date')($scope.loginData.starttime, 'HH:mm:ss');
       var endTime = $filter('date')($scope.loginData.endtime,'HH:mm:ss')
       var member_no = Service_Store.getLocal('das_member_no');
       var school_id = Service_Store.getLocal('school_id'); 
       var today_date= $filter('date')($scope.today,'yyyy-MM-dd');
     
       if($scope.array_values!= undefined){
       var res_id = '';
       angular.forEach(JSON.parse($scope.array_values),function(item,key){
         res_id += item+',';
       });
       var n=res_id.lastIndexOf(",");
       var a=res_id.substring(0,n);       
     }else{
      var a=0;      
     }
      if($scope.loginData.valunteerValue > 0 && a == 0){
          global._alert({template: 'Please add some responsibilty', dependency: $ionicPopup});      
      return false;
    }
      if($scope.loginData.event_name == undefined){
          global._alert({template: 'Event name should not be blank', dependency: $ionicPopup});      
      return false;
    }
    if($scope.loginData.event_description == undefined){
          global._alert({template: 'Event description should not be blank', dependency: $ionicPopup});      
      return false;
    }

    if(startDate == undefined || endDate==undefined){
          global._alert({template: 'Start Date and End Date should not be blank', dependency: $ionicPopup});      
      return false;
    }
     if(startTime == undefined || endTime==undefined){
          global._alert({template: 'Start Time and End Time should not be blank', dependency: $ionicPopup});      
      return false;
    }
     if(today_date >= startDate){
          global._alert({template: 'Start Date should be greate than today date', dependency: $ionicPopup});      
      return false;
    }  
       if(startDate == endDate && startTime>endTime){
          global._alert({template: 'End Time should be greate than start time', dependency: $ionicPopup});      
      return false;
    }

      if(startDate > endDate){
          global._alert({template: 'End Date should be greate than start date', dependency: $ionicPopup});      
      return false;
    }    
       global.checkNetworkConnection($ionicPopup);
            ajaxloader.async = false;
            ajaxloader.loadURL(global.config['api_url']+'/event/create_event?token='+Service_Store.getLocal('app_token'),
                    {  
                      event_name:$scope.loginData.event_name,
                      event_description:$scope.loginData.event_description,
                      no_of_valunteer:$scope.loginData.valunteerValue,
                      scheduleValue:$scope.loginData.scheduleValue,
                      startDate:startDate,
                      endDate:endDate,
                      starttime:startTime,
                      endtime:endTime,
                      responsibilty:a,
                      member_no:member_no,
                      sender_ac_no:member_no,
                      school_id:school_id,
                      day_weekly:$scope.loginData.filterss,
                      day_monthly:day_monthly
                    }, function (resp) {
                      ajaxloader.async = true;
                if (resp['status'] == "Success") {
                    global._alert({template: 'Event created successfully', dependency: $ionicPopup});
                    $state.go('eventlist');
                } 
                    });    
      }
 }]);