var event = angular.module('starter');
/**
 * Define the event controller
 */
 event.controller('eventListCtrl',['$scope','$state','$window','$filter','$ionicModal', '$ionicPopup', '$ionicLoading', function($scope,$state,$window, $filter,$ionicModal, $ionicPopup, $ionicLoading){      
    var no_of_valunteer=[], hour_range=[], minute_range=[], second_range = [];
      $scope.loginData = {};
      loader.dependency = $ionicLoading; //Set for loader
      var pagesShown = 1;
      var pageSize = 10;
      var member_no = Service_Store.getLocal('das_member_no');
      var school_id = Service_Store.getLocal('school_id');
      var user_status = Service_Store.getLocal('user_status');
      var searchItem1234 =Service_Store.getLocal('searchItem1234');
      var searchItem12 =Service_Store.getLocal('searchItem12');
      $scope.names = ["All Event","ongoing","upcomming","previous"]; 
      $scope.searchItem ='All Event';
     $scope.loadData = function(){
     $scope.searchItem1 =  $('#searchlist').val();
     if(searchItem1234 =='upcomming' || searchItem1234=='ongoing' || searchItem1234=='select' ){
      $scope.searchItem1 = searchItem1234;
      $scope.searchItem = searchItem1234;
      Service_Store.removeKey('searchItem1234');
      searchItem1234 =Service_Store.getLocal('searchItem1234');
   }else if($scope.searchItem1==null || $scope.searchItem1==''||$scope.searchItem1=='string:All Event'){
    $scope.searchItem1='';
   }
   else{
    var searchItem12 = $scope.searchItem1.split(':');
    $scope.searchItem1 = searchItem12[1];
    $scope.searchItem1 = $scope.searchItem1.toLowerCase();
   }
     global.checkNetworkConnection($ionicPopup);
   ajaxloader.load(global.config['api_url']+'/event/list?token=aforetechnical@321!&school_id='+school_id+'&member_no='+member_no+'&source='+$scope.searchItem1,
   function(resp){
     var res1=$.parseJSON(resp);
    if (res1.status == "Success")
      {
          $scope.items = res1.event_details;
               var arr = [];
               angular.forEach($scope.items,function(value,key){
                if(value.start_date1.length > 0){
                  arr.push(value);
                }

              });
              $scope.dataLength = arr.length;
              if($scope.dataLength > 0){
               $scope.items = arr;
              }

      }else{
              $scope.dataLength=0;
            }
            });
 }


     $scope.loadData(); 

       $scope.itemsLimit = function() {
        return pageSize * pagesShown;
        };

        $scope.hasMoreItemsToShow = function() {
            return pagesShown < ($scope.items.length / pageSize);
        };

        $scope.showMoreItems = function() {
            pagesShown = pagesShown + 1;         
        };


     $scope.create_event = function(){
     if(user_status!=0 && school_id !=0){
        $state.go('eventmgmt');
     }else{
      global._alert({template: 'Your account is under verification you can`t create event', dependency: $ionicPopup});            
      
     }
     
     }


     $scope.volunteerList = function(item){      
      $state.go('volunteerList',{'event_id': item});
     }

     $scope.resp_list = function(eve_id){
     ajaxloader.load(global.config['api_url']+'/event/responsibilty_list?token=aforetechnical@321!&event_id='+eve_id+'',
     function(resp){
        var respons = $.parseJSON(resp);
         $scope.resp_items = respons.responsibilty_list;
      if (respons.status == "Success" && $scope.resp_items.length > 0)
        { 
         $scope.resp_data = $ionicPopup.show({
            template:'<ion-list>'+
               '  <ion-item ng-repeat="item in resp_items track by $index" > '+
               ' <p>{{item.responsibilty}}<p>'+
               '  </ion-item>'+
               '</ion-list> ',
            title: 'Responsibility List',
            subTitle: '',
            scope: $scope,
            buttons: [{ 
                        text: 'Close',
                        type: 'button-default'
                     }]
          });
          ajaxloader.async = true;                  
                } else {
                   global._alert({template: 'No responsiblity added', dependency: $ionicPopup});  
                }
              });           
     }
     $scope.resp_schedule = function(resp_id){
    ajaxloader.load(global.config['api_url']+'/event/date_time_list?token=aforetechnical@321!&event_id='+resp_id+'',
     function(resp){
        var respons_schedule = $.parseJSON(resp);
        $scope.et = respons_schedule.date_time_list[0].end_date.split(' ',4);
        $scope.st = respons_schedule.date_time_list[0].start_date.split(' ',4);
         $scope.resp_date_items = respons_schedule.date_time_list;
         $scope.sd = $scope.resp_date_items[0].start_date.split(' ',3);
         $scope.ed = $scope.resp_date_items[0].end_date.split(' ',3);
      if (respons_schedule.status == "Success")
        {
           $scope.resp_date_data = $ionicPopup.show({
            template:'<ion-list>'+
               '  <ion-item ng-repeat="item in resp_date_items track by $index" > '+
               ' <p>Start Date: '+$scope.sd[0]+$scope.sd[1]+','+$scope.sd[2]+'<p>'+
              ' <p>Start Time:'+ $scope.st[3]+'<p>'+
               ' <p>End Date: '+$scope.ed[0]+$scope.ed[1]+','+$scope.ed[2]+'<p>'+
               ' <p>End Time:'+ $scope.et[3]+'<p>'+
               '  </ion-item>'+
               '</ion-list> ',
            title: 'Event Schedule',
            subTitle: '',
            scope: $scope,
            buttons: [{ 
                        text: 'Close',
                        type: 'button-default'
                     }]
          });
          ajaxloader.async = true;                  
                } else {
                  $scope.datanotFound="No Event Available Yet !"; 
                }
     });
     }

     $scope.editEvent = function(event_data,searchItem1){
       var myDate=new Date();
myDate.setDate(myDate.getDate()+1);

var dt = (myDate.getFullYear()+ '/' + ("0" + (myDate.getMonth() + 1)).slice(-2) + '/' +myDate.getDate());
var dd = event_data.start_date1;
var res_event_start_date = dd.split(" ");
if(res_event_start_date[0] < dt){
 global._alert({template: 'Event would not be edited....', dependency: $ionicPopup});
 return false;
}else{
      Service_Store.setLocal('event_edit_data',JSON.stringify(event_data));
      Service_Store.setLocal('searchItem1234',searchItem1);
            $state.go('editEvent');
     }
   }

       /* function for delete ResponsibiltyResponsibilty here.....................*/
      $scope.removeEvent = function(event_id){
             $scope.event_id_data = event_id;
             var confirmPopup = $ionicPopup.confirm({
             title: 'Delete Responsibilty',
             template: 'Are you sure you want to delete?',
             });

            confirmPopup.then(function(res) {
                
            if (res == true) {      
                    ajaxloader.loadURL(global.config['api_url'] + '/event/delete?token=' + Service_Store.getLocal('app_token'),
                            {
                                id:  $scope.event_id_data
                            }, $scope.removeResponse);
              }
           });              
        };
         $scope.removeResponse = function (resp) { 
            if (resp['status'] == "Success")
            {
            $scope.loadData();   
            } else if (resp.error_code == 1) {            
            global._alert({template: 'Responsibilty not deleted', dependency: $ionicPopup});
            } else
            {
                global._alert({template: 'error occure', dependency: $ionicPopup});
            }
       
        }
     

      $scope.sendEvent = function(school_id,searchItem1){
      Service_Store.setLocal('event_school_id',school_id);
      Service_Store.setLocal('searchItem12',searchItem1);
      $window.location.href = '#/event_notifications';
     }

        $scope.goToDashBoard = function(){
          $window.location.href = '#/dashboard';
      }  

      $scope.pagging = function () {
    $scope.pagecount = $scope.pagecount + 1;
    $scope.loadData();
}        

  $scope.backPage = function () {
   // console.log(fddf);
   Service_Store.removeKey('searchItem1234');
            $window.location.href = '#/dashboard';
        };
     
 }]);