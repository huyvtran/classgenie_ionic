var events = angular.module('starter');

events.controller('EventStudentCtrl', ['$scope', '$filter', '$location', '$window', '$ionicModal', '$state', '$ionicPopup', '$ionicLoading', '$cordovaToast', '$cordovaFileTransfer', '$cordovaCamera', '$ionicPlatform','$cordovaFileOpener2', function ($scope, $filter, $location, $window, $ionicModal, $state, $ionicPopup, $ionicLoading, $cordovaToast, $cordovaFileTransfer, $cordovaCamera, $ionicPlatform,$cordovaFileOpener2) {

loader.dependency = $ionicLoading;
var stored_classId = Service_Store.getLocal('stud_classid'); 
var classname = Service_Store.getLocal('das_classname'); 
$scope.pagecount = 1;
var pagesShown = 1;
var pageSize = 10;
var member_no = Service_Store.getLocal('das_student_no');
$scope.stud_status = Service_Store.getLocal('stud_status');
var school_id = Service_Store.getLocal('school_id');
$scope.data = {
    model: '',
    availableOptions: [
      {id: '', name: 'All Events'},
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
       
        $scope.itemsLimit = function() {
        return pageSize * pagesShown;
        };

        $scope.hasMoreItemsToShow = function() {
            return pagesShown < ($scope.items.length / pageSize);
        };

        $scope.showMoreItems = function() {
            pagesShown = pagesShown + 1;         
        };

$scope.pagging = function () {
    $scope.pagecount = $scope.pagecount + 1;
    $scope.loadData();
}
if($scope.stud_status==1){        
$scope.loadData(); 
}else{
 global._alert({template: 'Please get your account approval from your parents first!', dependency: $ionicPopup});
 $state.go('st_home.studentinvite');
}
 
}]);