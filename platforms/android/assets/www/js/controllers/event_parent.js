var events = angular.module('starter');

events.controller('EventParentCtrl', ['$scope', '$filter', '$location', '$window', '$ionicModal', '$state', '$ionicPopup', '$ionicLoading', '$cordovaToast', '$cordovaFileTransfer', '$cordovaCamera', '$ionicPlatform','$cordovaFileOpener2', function ($scope, $filter, $location, $window, $ionicModal, $state, $ionicPopup, $ionicLoading, $cordovaToast, $cordovaFileTransfer, $cordovaCamera, $ionicPlatform,$cordovaFileOpener2) {

loader.dependency = $ionicLoading;
var stored_classId = Service_Store.getLocal('das_classid');
var classname = Service_Store.getLocal('das_classname'); 
$scope.pagecount = 1;
   var pagesShown = 1;
   var pageSize = 10;
var member_no = Service_Store.getLocal('das_member_no');
$scope.data = {
    model: '',
    availableOptions: [
      {id: '', name: 'All Event'},
      {id: 'ongoing', name: 'Ongoing'},
      {id: 'upcomming', name: 'Upcomming'},
      {id:'previous',name:'Previous'}
    ]
   };
 

//calling api for school list
$scope.schoolData=function(){ 
ajaxloader.async = false;
ajaxloader.load(global.config['api_url']+'/studentstory/schools/list?token='+Service_Store.getLocal('app_token')+"&member_no="+member_no,
  function(resp){
  var res1=$.parseJSON(resp);        
  if(res1.status == "Success")
    {
     $scope.school_id = res1.school_name[0].school_id;
     ajaxloader.async = true;
    }else if(res1.error_code==1){
        global._alert({template: res1.error_msg, dependency:$ionicPopup});

      } 
 });
 
}(); 

$scope.itemsLimit = function() {
        return pageSize * pagesShown;
        };

        $scope.hasMoreItemsToShow = function() {
            return pagesShown < ($scope.items.length / pageSize);
        };

        $scope.showMoreItems = function() {
            pagesShown = pagesShown + 1;         
        };


 /**
         *Response from ajax
         *@params resp
         */
        $scope.volunteerResponse = function (resp) { 
          
            if (resp['status'] == "Success")
            {
            $scope.loadData();   
            } else if (resp.error_code == 1) {            
            global._alert({template: 'Assignment not deleted', dependency: $ionicPopup});
            } else
            {
                global._alert({template: 'error occure', dependency: $ionicPopup});
            }
       
        }
         $scope.searchItem="";
/*function for assignment list here.........................*/
$scope.loadData = function () { 
    $scope.classname = classname;
    var searchItem = $scope.data.model;
    global.checkNetworkConnection($ionicPopup);
    ajaxloader.load(global.config['api_url'] + '/event/list?token=' + Service_Store.getLocal('app_token')+'&school_id='+$scope.school_id+'&page_number='+$scope.pagecount+'&source='+searchItem/*+$scope.classname*/, function (resp)
    {
        var resp = JSON.parse(resp); 
        if (resp.status == "Success")
        { 
                $scope.dataLength = resp.event_details.length
                $scope.items = resp.event_details;

            } else{
              $scope.dataLength = 0;
            }
    });
}  

$scope.quit_from_volunteer = function(item){

   var confirmPopup = $ionicPopup.confirm({
     title: 'Exit from volunteer',
     template: "ARE YOU SURE YOU DON'T WANT TO REMAIN AS VOLUNTEER?",
     });
 
    confirmPopup.then(function(res) { 
           
    if (res == true) {                
          var volunteer_id = item;
            ajaxloader.loadURL(global.config['api_url'] + '/event/quit_from_volunteer?token=' + Service_Store.getLocal('app_token'),
                    {
                        id: volunteer_id,
                        member_no:member_no
                    }, $scope.volunteerResponse);

      }

   }); 
}





$scope.updateVolunteers = function(event_id){ 
 ajaxloader.loadURL(global.config['api_url']+'/event/add_volunteer?token='+Service_Store.getLocal('app_token'),
                    {
                        member_no:member_no,
                        event_id:event_id,                        
                    }, function (resp) {
                      ajaxloader.async = true;
                if (resp['status'] == "Success"){
                     $scope.items = '';                   
                   $scope.loadData();
                } else if (resp['status'] == 'user_exist') {
                    global._alert({template: 'You are already volunteer of this event', dependency: $ionicPopup});
                }
            }); 

} 


$scope.resp_list = function(eve_id){
    ajaxloader.load(global.config['api_url']+'/event/responsibilty_list?token=aforetechnical@321!&event_id='+eve_id+'',
       function(resp){
        var respons = $.parseJSON(resp); 
    $scope.resp_items = respons.responsibilty_list;
    $scope.respLength  = respons.responsibilty_list.length;
    if (respons.status == "Success")
    { 
        if($scope.respLength > 0){
        $scope.resp_data = $ionicPopup.show({
            template:'<ion-list>'+
            '  <ion-item ng-repeat="item in resp_items track by $index" > '+
            ' <p>{{item.responsibilty}}<p>'+
            '  </ion-item>'+
            '</ion-list> ',
            title: 'Responsibility List',
            subTitle: '',
            scope: $scope,
            buttons: [{ text: '<b>Yes</b>',
            type: 'button-positive', 
            onTap: function(e) { 
                $scope.updateVolunteers(eve_id);
            }
        },
        {  
            text: 'No',
            type: 'button-default', 
            onTap: function(e) {
             $scope.resp_data.close();
         }

     }] 

 });
}else{

 global._alert({template: 'Responsibility is not found for this event!', dependency: $ionicPopup});
            

}
        ajaxloader.async = true;                  
    }  
});

} 

$scope.pagging = function () {
    $scope.pagecount = $scope.pagecount + 1;
    $scope.loadData();
}
        
$scope.loadData();

  

}]);