var myEdit_skill = angular.module('starter');
myEdit_skill.controller('editskillsCtrl',['$scope','$http','$window','$location','$ionicModal','$ionicPopup','$ionicLoading','$base64',function($scope,$http,$window,$location,$ionicModal,$ionicPopup,$ionicLoading,$base64){
    loader.dependency = $ionicLoading;  
    $scope.positiveskill = true;
    $scope.needsworkskill = false;
    $('#pskillbutton').addClass('color_change');
    $('#nskillbutton').removeClass('color_change');
    var stored_classId=Service_Store.getLocal('das_classid');
    var memberNO= Service_Store.getLocal('das_member_no');
    $scope.imagePath =global.config['file_url']+global.config['image_path'];
 
   
   //getting skills list 
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.async=false;
   ajaxloader.load(global.config['api_url']+'/points/class/?token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId,
     function(resp){
        var res1=$.parseJSON(resp);
        if(res1.status == "Success")
        {
            ajaxloader.async=true;
            var positive = res1.user_list;
            var needwork = res1.needwork;
            $scope.class_award_items    = positive; 
            $scope.class_needwork_items = needwork;
            $scope.items =res1.user_list; 
        }else if(res1.error_code==1){

            global._alert({template: res1.error_msg, dependency:$ionicPopup});

        }
    });
  
      //add new skill in list
      $scope.addNewSkill=function(){
      $window.location.href = '#addskill';
      }
     
       $scope.addNeedWork  = function(){
       $window.location.href = '#addNeedWork';
       };

//edit existing skill
$scope.editSkill=function(){

    Service_Store.setLocal('skillId',this.item.id);
    Service_Store.setLocal('skillName',this.item.name);
    Service_Store.setLocal('pointweight',this.item.pointweight);
    Service_Store.setLocal('imageName',this.item.image);
    $window.location.href = '#single_editskill';
}

$scope.goBack=function(){

    $window.location.href = '#tab/'+stored_classId+'/classroom';

}



$scope.needButton=function()
{
$('#nskillbutton').addClass('color_change');
$('#pskillbutton').removeClass('color_change');
$scope.positiveskill  = false;
$scope.needsworkskill = true;

}

//positive button coading
$scope.positiveButton=function()
{
$('#pskillbutton').addClass('color_change');
$('#nskillbutton').removeClass('color_change');
$scope.positiveskill  = true;
$scope.needsworkskill = false;

}

}]);