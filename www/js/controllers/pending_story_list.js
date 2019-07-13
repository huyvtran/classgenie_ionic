var studentstory_list = angular.module('starter');

 studentstory_list.controller('studentpending_storyCtrl',['$scope','$location','$window','$ionicModal','$ionicHistory','$ionicPopup','$ionicLoading','$cordovaToast','$state',function($scope,$location,$window,$ionicModal,$ionicHistory,$ionicPopup,$ionicLoading,$cordovaToast,$state){
 loader.dependency = $ionicLoading;
 $scope.className=Service_Store.getLocal('das_classname');
 var stored_classId=Service_Store.getLocal('das_classid');
 var stored_memberNo= Service_Store.getLocal('das_member_no');
 $scope.imagePath =global.config['file_url']+global.config['image_path'];
 var studentcode= Service_Store.getLocal("st_code");
 $scope.pagecount=1;
 
 $scope.randNO=global.randomNumber();
 $scope.story_calling=Service_Store.getLocal("allstoryPennding");




 $scope.loadDatawhole=function(){
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.async=false;
   ajaxloader.load(global.config['api_url']+"/studentstory/class/postlist?"+'token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId+"&page_number="+$scope.pagecount,
    function(resp){
    var res1=$.parseJSON(resp);
           console.log("resp::"+resp);
           console.log(res1.user_list.length);

        if(!res1.hasOwnProperty('user_list'))
          {
            $scope.status_val = "";
          }else{
           $scope.status_val=res1.status;
           var arraylength=res1.user_list.length;
           if(arraylength<global.config['page_size']){
              $scope.status_val = "";
           }
             }
          
          if(res1.user_list!='')

          {
            $scope.items2=res1.user_list;

          }else{
           //global._alert({template:"No post available now..", dependency:$ionicPopup});
              $scope.zerocount=0;
               $scope.items2=res1.user_list;

        }  
           ajaxloader.async=true;
    });}





//load data 2nd function
$scope.loadData2=function(){
  

 global.checkNetworkConnection($ionicPopup);
   ajaxloader.async=false;
   ajaxloader.load(global.config['api_url']+'/studentstory/postlist?token='
    +Service_Store.getLocal('app_token')+"&student_no="+studentcode+"&class_id="+stored_classId+"&page_number="+$scope.pagecount,
    function(resp){
           var res1=$.parseJSON(resp);
           console.log("resp::"+resp);
           console.log(res1.user_list.length);
           $scope.list_data=res1.user_list.length;

        if(!res1.hasOwnProperty('user_list'))
          {
            $scope.status_val = "";
          }else{
           $scope.status_val=res1.status;
           var arraylength=res1.user_list.length;

           if(arraylength<global.config['page_size']){
              $scope.status_val = "";
           }
          }
          
          
          if(res1.user_list!='')

          {
            $scope.items2=res1.user_list;
            }else{
             $scope.items2="";
             $scope.zerocount=0;

           //global._alert({template:"No post available now..", dependency:$ionicPopup});

        }  
           ajaxloader.async=true;
      });
}

    if($scope.story_calling=="allpendingstory"){
      
      $scope.loadDatawhole();
      //window.localStorage.removeItem("allstoryPennding");
       }else{
     
          $scope.loadData2();
      }


 $scope.doRefresh = function() {

     if($scope.story_calling=="allpendingstory"){
             $scope.loadDatawhole();
       }else{
     
          $scope.loadData2();
       }

       // // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
       
     };

$scope.approve_story=function(){
var story_id=this.item_pend.id;

 ajaxloader.loadURL(global.config['api_url']+'/studentstory/approveteacher?token='+Service_Store.getLocal('app_token'),
{
  id: story_id,
  status:"1",
  sender_ac_no: stored_memberNo
},$scope.approve_response);

}

// unapprove story  function
$scope.unapprove_story=function(){
var story_id=this.item_pend.id;

 ajaxloader.loadURL(global.config['api_url']+'/studentstory/approveteacher?token='+Service_Store.getLocal('app_token'),
{
  id: story_id,
  status:"-1",
  sender_ac_no: stored_memberNo
},$scope.unapprove_response);

  
}

/**
*Response from ajax
*@params resp
*/
$scope.approve_response = function(resp){
  
  if(resp['status'] == "Success")
  {
    
    if($scope.story_calling=="allpendingstory"){
       global._alert({template:"Story approved successfully", dependency:$ionicPopup});

         $scope.loadDatawhole();
      }else{    
       global._alert({template:"Story approved successfully", dependency:$ionicPopup});
      
           $scope.loadData2();
          
       }
  }else if(resp['error_code']==1){

        global._alert({template: resp['error_msg'], dependency:$ionicPopup});
        
  }
else
  {
    global._alert({template: resp['comments'], dependency:$ionicPopup});
  }
}



/**
*Response from ajax
*@params resp
*/
$scope.unapprove_response = function(resp){
  
  if(resp['status'] == "Success")
  {
    
    if($scope.story_calling=="allpendingstory"){
       global._alert({template:"Story un approved successfully", dependency:$ionicPopup});

         $scope.loadDatawhole();
      }else{    
       global._alert({template:"Story un approved successfully", dependency:$ionicPopup});
      
           $scope.loadData2();
          
       }
  }else if(resp['error_code']==1){

        global._alert({template: resp['error_msg'], dependency:$ionicPopup});
        
  }
else
  {
    global._alert({template: resp['comments'], dependency:$ionicPopup});
  }
}




//pagging functionality 
$scope.pagging=function(){

$scope.pagecount=$scope.pagecount+1;
if($scope.story_calling=="allpendingstory"){
         $scope.loadDatawhole();
      }else{
     
           $scope.loadData2();
       }
}

$scope.goBackstory=function(){
  $window.location.href='#/pending_story_studentlist';
}

 }]);