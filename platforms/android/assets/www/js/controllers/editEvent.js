var edit_assignment = angular.module('starter');
edit_assignment.controller('editEvent', ['$scope','$filter', '$location', '$window', '$ionicModal', '$state', '$ionicPopup', '$ionicLoading', '$cordovaToast', '$cordovaFileTransfer', '$cordovaCamera','$ionicHistory', '$ionicPlatform','$filter', function ($scope,$filter,$location,$window, $ionicModal, $state, $ionicPopup, $ionicLoading, $cordovaToast, $cordovaFileTransfer, $cordovaCamera,$ionicHistory, $ionicPlatform,$filter) {
        loader.dependency = $ionicLoading;
         $scope.today = new Date();
        var no_of_valunteer=[];
        var end_time_arrval=[];
        var start_time_arrval=[];
        var member_no = Service_Store.getLocal('das_member_no');
        var event_edit_data = JSON.parse(Service_Store.getLocal('event_edit_data'));
        var searchItem1234 =Service_Store.getLocal('searchItem1234');
        $scope.event_id=event_edit_data.event_list[0].id;        
        $scope.event_name =event_edit_data.event_list[0].event_name; 
        $scope.event_description = event_edit_data.event_list[0].description;
        $scope.valunteerValue12 = event_edit_data.event_list[0].no_of_volunteer;
        $scope.volunteer_responsibility = event_edit_data.event_list[0].volunteer_responsibility;
         $scope.event_start_date = event_edit_data.start_date1;
          $scope.event_end_date = event_edit_data.end_date1;
         var res_event_start_date = $scope.event_start_date.split(" ");
         var res_event_end_date = $scope.event_end_date.split(" ");
        $scope.event_start_date = res_event_start_date[0];
        $scope.event_end_date = res_event_end_date[0];
        $scope.event_start_time = res_event_start_date[1];
        $scope.event_end_time = res_event_end_date[1];
        var start_date = $filter('date')(new Date($scope.event_start_date), 'dd/MM/yyyy');
        var end_date = $filter('date')(new Date($scope.event_end_date), 'dd/MM/yyyy');
        var start_date_arrval = start_date.split('/');
        var end_date_arrval = end_date.split('/');
        $scope.example_date = {
         value_start_date: new Date(start_date_arrval[2],start_date_arrval[1] - 1,start_date_arrval[0]),
         value_end_date: new Date(end_date_arrval[2], end_date_arrval[1] - 1,end_date_arrval[0])
       };
       start_time_arrval = $scope.event_start_time.split(':');
       end_time_arrval = $scope.event_end_time.split(':');
        $scope.example_time = {
          value_start_time: new Date(start_date_arrval[2],start_date_arrval[1] - 1,start_date_arrval[0],start_time_arrval[0], start_time_arrval[1],start_time_arrval[2]),
          value_end_time: new Date(end_date_arrval[2], end_date_arrval[1] - 1,end_date_arrval[0],end_time_arrval[0], end_time_arrval[1],end_time_arrval[2])};

        for(var i=0; i<=9; i++){
        no_of_valunteer.push(i);
      }
      $scope.no_of_valunteer = no_of_valunteer;
       $scope.selectNoofValunteer = function(valunteerValue){
        if(valunteerValue>0){
           $('#rowResponsibilty').show();
        }
        else
        {
            $('#rowResponsibilty').hide();
        }
    }
     $scope.closeResponsibiltyModal = function(){
         $scope.modal.hide();
      }
      
      $scope.fres = {}; $scope.feres = {};
       $scope.saveResponsibilty = function(){
          var vale = '';
          vale = $('#responsibilty').val();
           if($scope.fres.responsibilty){
           ajaxloader.loadURL(global.config['api_url']+'/event_responsibilty/save?token='+Service_Store.getLocal('app_token'), {
                   responsibilty: $scope.fres.responsibilty,
                   member_no:member_no

                  }, function(resp){
                     global._alert({template: 'Responsibilty added successfully', dependency: $ionicPopup});
                     $scope.fres = {};
                     $scope.loadResponsibiltyList();
              });
        }else{
          global._alert({template: 'Responsibilty not added successfully', dependency: $ionicPopup});
        }
      }


      //Execute this function when click save
      // $scope.saveResponsibilty = function(){
      //   console.log(400);
      //        ajaxloader.async = false;
      //        ajaxloader.load(global.config['api_url']+'/event_responsibilty/list?token='+Service_Store.getLocal('app_token')+'&responsibilty='+$scope.fres.responsibilty,function(resp){
      //             ajaxloader.async = true;
      //             if($.parseJSON(resp).length>0){
      //                global._alert({template: 'Responsibilty already exists!', dependency: $ionicPopup});
      //             }
      //             else
      //             {
      //               console.log(102);
      //                $scope._saveResponsibilty();
      //             }
      //        });
         
        
      //   }
        
      //   //Save new responsibilty 
      //   $scope._saveResponsibilty = function(){
      //     console.log(100);
      //     var vale = '';
      //     vale = $('#responsibilty').val();
      //     console.log(vale);
      //      //ajaxloader.async = true;
      //      if(vale){
      //      ajaxloader.loadURL(global.config['api_url']+'/event_responsibilty/save?token='+Service_Store.getLocal('app_token'), {
      //              responsibilty: vale,
      //              member_no:member_no

      //             }, function(resp){
      //                global._alert({template: 'Responsibilty added successfully', dependency: $ionicPopup});
      //                $scope.fres = {};
      //                $scope.loadResponsibiltyList();
      //         });
      //   }else{
      //     global._alert({template: 'Responsibilty not added successfully', dependency: $ionicPopup});
      //   }
      // }
     $scope.loadResponsibiltyList = function(){
      var vol_responsibility = $scope.volunteer_responsibility.split(',').map(Number);
      $scope.arr = vol_responsibility;
             ajaxloader.async = false;
             var resp_id=[];
             ajaxloader.load(global.config['api_url']+'/event_responsibilty/list?token='+Service_Store.getLocal('app_token')+"&member_no="+member_no, function(resp){
                  ajaxloader.async = true;
                  respj = $.parseJSON(resp); 
                  $scope.resListData = JSON.stringify(respj);
                  var resListId = JSON.stringify(respj);
                  $scope.respList_id =JSON.stringify(respj.user_list);
                  $scope.responsibilty_list_items1 = respj.user_list;
                  var responsibilty_list_data = JSON.parse(JSON.stringify($scope.responsibilty_list_items1));
                  var mydata = [];  
                 
                  angular.forEach(responsibilty_list_data, function(value, key){

                    if(vol_responsibility.indexOf(value.id) >=0){                      
                     mydata.push({'list':value,'checked':true}); 
                    }else{                     
                      mydata.push({'list':value,'checked':false}); 
                    }
                  
                    });
                  $scope.responsibilty_list_items =mydata;                
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

        $scope.arr = [];
        $scope.updateSelection = function($event, id) { 
        var checkbox = $event.target;        
        if(checkbox.checked){
            $scope.arr.push(id);
        }else{
           var index =  $scope.arr.indexOf(id); 
          if (index > -1) {
             $scope.arr.splice(index, 1);
          }
        } 
        $scope.array_values =JSON.stringify($scope.arr);
          };

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
             // ajaxloader.async = false;

              ajaxloader.loadURL(global.config['api_url']+'/event_responsibilty/remove?token='+Service_Store.getLocal('app_token'),{
                responsibilty_id:id
              },function(resp){
                    // ajaxloader.async = true;
                    // $scope.feres = {};
                     global._alert({template: 'Responsibilty deleted successfully', dependency: $ionicPopup});
                     $scope.edit_modal.hide();
                     $scope.loadResponsibiltyList();
             });
        }    
     $scope.openResponsibilty = function(){
           $ionicModal.fromTemplateUrl('templates/edit_add_responsibilty.html', {
              scope: $scope,
           }).then(function(modal) {
              $scope.modal = modal;
          $scope.loadResponsibiltyList();   //Load responsibilty list on page load
              $scope.modal.show();
           });
      }
$scope.edit_event_submit = function(){
  $scope.eve_name = $('#eventname').val();
  $scope.eve_desc = $('#eventdesc').val();
   var today_date= $filter('date')($scope.today,'yyyy-MM-dd');
       if($scope.array_values!= undefined){
       var res_id = '';
       angular.forEach(JSON.parse($scope.array_values),function(item,key){
         res_id += item+',';
       });
       var n=res_id.lastIndexOf(",");
       var a=res_id.substring(0,n);
     }else{
      var a=$scope.volunteer_responsibility;
    }
        var valu = $('#noofval').val();
        var t =valu.split(':');
        var val_value = t[1];
        var edit_startDate = $filter('date')($scope.example_date.value_start_date,'yyyy-MM-dd');
        var edit_endDate = $filter('date')($scope.example_date.value_end_date,'yyyy-MM-dd');
        var edit_startTime = $filter('date')($scope.example_time.value_start_time, 'HH:mm:ss');
        var edit_endTime = $filter('date')($scope.example_time.value_end_time,'HH:mm:ss');
        $scope.scheduleValue='d';
        var member_no = Service_Store.getLocal('das_member_no');
        var school_id = Service_Store.getLocal('school_id');
          if(val_value > 0 && a == 0){
            global._alert({template: 'Please add some responsibilty', dependency: $ionicPopup});      
      return false;
    }
        if($scope.eve_name == undefined||$scope.eve_name == ''||$scope.eve_name == null){
          global._alert({template: 'Event name should not be blank', dependency: $ionicPopup});
          return false;
    }
    if($scope.eve_desc == undefined||$scope.eve_desc == ''||$scope.eve_desc == null){
          global._alert({template: 'Event description should not be blank', dependency: $ionicPopup});      
      return false;
    }

    if(edit_startDate == undefined || edit_endDate==undefined){
          global._alert({template: 'Start Date and End Date should not be blank', dependency: $ionicPopup});      
      return false;
    }
     if(edit_startTime == undefined || edit_endTime==undefined){
          global._alert({template: 'Start Time and End Time should not be blank', dependency: $ionicPopup});      
      return false;
    }
     if(today_date >= edit_startDate){
          global._alert({template: 'Start Date should be greate than today date', dependency: $ionicPopup});      
      return false;
    }  
       if(edit_startDate == edit_endDate && edit_startTime > edit_endTime){
          global._alert({template: 'End Time should be greate than start time', dependency: $ionicPopup});      
      return false;
    }      

      if(edit_startDate > edit_endDate){
          global._alert({template: 'End Date should be greate than start date', dependency: $ionicPopup});      
      return false;
    }

       global.checkNetworkConnection($ionicPopup);
            ajaxloader.async = false;
            ajaxloader.loadURL(global.config['api_url']+'/event/edit_event?token='+Service_Store.getLocal('app_token'),
              {
                event_id:$scope.event_id,
                event_name:$scope.eve_name,
                event_description:$scope.eve_desc,
                no_of_valunteer:val_value,
                scheduleValue:$scope.scheduleValue,
                startDate:edit_startDate,
                endDate:edit_endDate,
                starttime:edit_startTime,
                endtime:edit_endTime,
                responsibilty:a,
                member_no:member_no,
                sender_ac_no:member_no,
                school_id:school_id
                }, function (resp){
                  ajaxloader.async = true;
                if (resp['status'] == "Success"){
                    global._alert({template: 'Event updated successfully', dependency: $ionicPopup});
                    $state.go('eventlist');
                  }
                });
}

/* function for sorting assignment list here.....................*/

  //           $scope.back=function(){
  //  $ionicHistory.goBack();
  // }
            $scope.back = function () {
            $window.history.back();
        }
}]);