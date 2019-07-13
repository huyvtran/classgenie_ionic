var edit_student = angular.module('starter');

edit_student.controller('editStudentCtrl2',['$scope','$window','$location','$ionicPopup','$state','$ionicLoading','$cordovaToast',function($scope,$window,$location,$ionicPopup,$state,$ionicLoading,$cordovaToast){
    loader.dependency = $ionicLoading; 
    var stored_classId=Service_Store.getLocal('das_classid');
    var memberNO= Service_Store.getLocal('das_member_no');
    $scope.imagePath =global.config['file_url']+global.config['image_path'];
    $scope.studentName=Service_Store.getLocal('stud_name');
    var studentId=Service_Store.getLocal('stud_id');
    var imageName=Service_Store.getLocal('stud_imageName');
    $scope.name=Service_Store.getLocal('stud_name');
    $scope.image=$scope.imagePath+"student/"+imageName;


   //open image popup
   $scope.classIconPopup=function(){

    var url=global.config['api_url']+"/addstudent/list?"+'token='+Service_Store.getLocal('app_token');
    var output = '';
    var key='';
    
    global.checkNetworkConnection($ionicPopup);
     ajaxloader.load(global.config['api_url']+'/addstudent/list?token='+Service_Store.getLocal('app_token'),function(resp){
        data = $.parseJSON(resp);
        mylist_data = data.user_list;
        Object.keys(mylist_data).forEach(function(key) {

          var imageName=  mylist_data[key]['image'];
          var imagePath=global.config['file_url']+"assets/"+"student/"+imageName;

          output+='<img ng-src='+imagePath+' ng-click="setImage($event)"  id='+key+' ng-name="add_class_user" />'

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

//update student name and image
     $scope.updateStudent=function()
     {     
     var studentName=$scope.name;
     var image_name="";
     var s = $scope.image;
     var fields = s.split( '/' );
     image_name = fields[6];
        if(image_name=="student"|| image_name==null)
        {
            image_name="6_6_c_6.png"//chnage image name with student image name
         }
    global.checkNetworkConnection($ionicPopup);
    ajaxloader.loadURL(global.config['api_url']+'/addstudent/update?token='+Service_Store.getLocal('app_token'),
      {
       name: studentName,
       image:image_name,
       id:studentId

       },function(resp){

        if(resp.status=="Success"){
          
          global._alert({template: 'Student successfully updated!', dependency:$ionicPopup});// need to replace with toast message
          $state.go('editstudentlist');
          window.plugins.toast.show('student successfully updated', 'short', 'center');
         }else if(resp.error_code==1){

           global._alert({template: "Name already exist.", dependency:$ionicPopup});

          }else{

           global._alert({template: "Name already exist.", dependency:$ionicPopup});

          }
      });
         
    }
        
  $scope.removeStudent=function()
  {

    var confirmPopup = $ionicPopup.confirm({
     title: 'Please Confirm!',
     template: 'Are you sure you want to delete this student?'
   });

      confirmPopup.then(function(res) {
       if(res){
       global.checkNetworkConnection($ionicPopup);
       ajaxloader.loadURL(global.config['api_url']+'/addstudent/delete?token='+Service_Store.getLocal('app_token'),
        {
       
          id:studentId

        },function(resp){
        if(resp.status=="Success"){
          global._alert({template: 'Student successfully deleted!', dependency:$ionicPopup});
          $state.go('editstudentlist');
          //window.plugins.toast.show('Student removed', 'short', 'center');

           }
         });
}else{
  return false;
}
       });

    
     
  }
     
//back button 

$scope.edit_student_goBack=function(){
   $state.go('editstudentlist');
 }

}]);
 
 