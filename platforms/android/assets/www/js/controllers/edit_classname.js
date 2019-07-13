var editClass = angular.module('starter');

editClass.controller('editClassCtrl',['$scope','$ionicPopup','$location','$window','$ionicHistory','$ionicLoading','$cordovaToast','$state',function($scope,$ionicPopup,$location,$window,$ionicHistory,$ionicLoading,$cordovaToast,$state){
loader.dependency = $ionicLoading;

var class_image=Service_Store.getLocal('das_classImage');
var nameOfClass=Service_Store.getLocal('das_classname');
$scope.gradeValue = Service_Store.getLocal('das_classGrade'); 
//console.log($scope.gradeValue.trim());
var stored_classId=Service_Store.getLocal('das_classid');
$scope.schoolId=Service_Store.getLocal('school_id');
$scope.stored_mem_no=Service_Store.getLocal('das_member_no');
console.log("mem no:: "+$scope.stored_mem_no);

$scope.image=global.config['file_url']+"assets/"+"class/"+class_image;
$scope.className=nameOfClass;
$scope.gradeName = $scope.gradeValue;
//console.log($scope.gradeName);

//Collect class data
ajaxloader.async = false;
ajaxloader.load(global.config['api_url']+'/classlist?token='+Service_Store.getLocal('app_token'),function(resp){    
     $scope.selectGrades = $.parseJSON(resp);
     var list = $scope.selectGrades;
     var count = -1; 
     ajaxloader.async = true;
 });

$scope.classIconPopup=function(){
var url=global.config['api_url']+"/classinfo?"+'token='+Service_Store.getLocal('app_token');
var output = '';
var key='';
ajaxloader.async = false;
ajaxloader.load(global.config['api_url']+'/classinfo?token='+Service_Store.getLocal('app_token'),function(resp){
ajaxloader.async = true;

          data = $.parseJSON(resp);

          mylist_data = data.user_list;
          Object.keys(mylist_data).forEach(function(key) {

          var imageName=  mylist_data[key]['image'];
          var imagePath=global.config['file_url']+"assets/"+"class/"+imageName;

          output+='<img ng-src='+imagePath+' on-tap="setImage($event)"  id='+key+' ng-name="add_class_user" />'

        });

    // A popup dialog for select the class icon
    var myPopup = $ionicPopup.show({
      template: output,
      title: 'Choose Class Icon',
      subTitle: '',
      scope: $scope,
      buttons: [{ 
        text: 'Close',
        type: 'button-default'
        }]
    });

    $scope.setImage = function(event){

    var imageId = event.target.id; // getting the image id on click
    $scope.image=$('#'+imageId).attr('src');// set the selected image on imageview
    myPopup.close();
    }

    myPopup.then(function(res) {
    });

 });
}


// $scope.showSelectValue = function(selectGrade) {
 
//   $scope.gradeValue=selectGrade;
 
// }

/*add new class
*/
$scope.updateClass=function(){
var image_name="";
var s = $scope.image;
var fields = s.split( '/' );
 image_name = fields[6];
var classname=$scope.className;
var grade_name = $scope.gradeName;
console.log(grade_name);
 if(image_name==""|| image_name==null){
  image_name="17_c_17.png"
}

ajaxloader.loadURL(global.config['api_url']+'/classinfo/update?token='+Service_Store.getLocal('app_token'),
{
  class_name: $scope.className,
  image: image_name,
  grade: $scope.gradeName,
  class_id: stored_classId,
  school_id:$scope.schoolId,
  teacher_ac_no:$scope.stored_mem_no

},$scope.addResponse);
};

/**
*Response from ajax
*@params resp
*/
$scope.addResponse = function(resp){
  
  if(resp['status'] == "Success")
  {

    window.location.href ='#/tab/'+stored_classId+'/classroom';
     global._alert({template: "Class Updated successfully.", dependency:$ionicPopup});

  }else if(resp.error_code==1){

            global._alert({template: resp.error_msg, dependency:$ionicPopup});
               
 }else
  {
            global._alert({template: resp['comments'], dependency:$ionicPopup});
  }
}

$scope.removeClass = function()
{
  

  $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: '<img src="img/alert.png" class="alert"/><b>Classgenie</b>',
     template: 'Are you sure you want to delete class '+nameOfClass+' ?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       $scope.delete();
     } else {
       
     }
   });
 };

$scope.showConfirm();

$scope.delete = function(){ 
ajaxloader.loadURL(global.config['api_url']+'/classinfo/delete?token='+Service_Store.getLocal('app_token'),
{
  class_id: stored_classId

},$scope.deleteSuccess = function(resp)
{

if(resp.status == "Success")
{
window.plugins.toast.show(nameOfClass+' has been successfully removed', 'short', 'center');
$state.go('dashboard');
}
else
{
  window.plugins.toast.show(resp.comments, 'short', 'center');
} 

 });
}

};

}]);

edit_class_goBack=function()
{

  window.location.href ='#/tab/stored_classId/classroom';
  //$ionicHistory.goBack();

}