var addClass = angular.module('starter');

addClass.controller('addClassCtrl',['$scope','$state','$ionicPopup','$location','$window','$ionicHistory','$ionicLoading',function($scope,$state,$ionicPopup,$location,$window,$ionicHistory,$ionicLoading){
$scope.image="img/6_6_c_6.png";
var jsonresponse=Service_Store.getLocal('parentdata');
var json = $.parseJSON(jsonresponse);
for (var i=0;i<json.length;i++){
    var id       =json[i].id;
    var name     =json[i].name;
    var userEmail=json[i].email;
    var member_no=json[i].member_no;
    var user_type=json[i].type;
    $scope.schoolId=json[i].school_id;
}
 // $scope.schoolId=Service_Store.getLocal('school_id');
  console.log("hello hi:: "+$scope.schoolId);

//Collect class data
ajaxloader.async = false;
ajaxloader.load(global.config['api_url']+'/classlist?token='+Service_Store.getLocal('app_token')+"&teacher_ac_no="+member_no,function(resp){
     $scope.selectGrades = $.parseJSON(resp);
    // $scope.selectGrades = $scope.selectGrades;
     ajaxloader.async = true;     
 });

 $scope.classIconPopup=function(){
      var url=global.config['api_url']+"/classinfo?"+'token='+Service_Store.getLocal('app_token');
      var output = '';
      var key='';
      ajaxloader.load(global.config['api_url']+'/classinfo?token='+Service_Store.getLocal('app_token'),function(resp){
              data = $.parseJSON(resp);
              mylist_data = data.user_list;
              Object.keys(mylist_data).forEach(function(key) {

                var imageName=  mylist_data[key]['image'];
                var imagePath=global.config['file_url']+"assets/"+"class/"+imageName;

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

var gradeValue="";
$scope.showSelectValue = function(selectGrade) {
    gradeValue=selectGrade;
}

/**
 *add new class
 */
$scope.createNewClass=function(){
    var image_name="";
    var s = $scope.image;
    var fields = s.split( '/' );
     image_name = fields[6];

    var classname=$scope.className;
     if(image_name == "" || image_name==null){
      image_name="6_6_c_6.png"
    }

    ajaxloader.loadURL(global.config['api_url']+'/classinfo?token='+Service_Store.getLocal('app_token'),
    {
      class_name: $scope.className,
      image: image_name,
      grade: gradeValue,
      teacher_ac_no: member_no,
      school_id: $scope.schoolId,
    },$scope.addResponse);
};

/**
 *Response from ajax
 *@params resp
 */
$scope.addResponse = function(resp){
    if(resp['status'] == "Success"){
        var res  = JSON.stringify(resp['user_list']);
        var json = $.parseJSON(res);
        var class_id = json[0].class_id;  
        Service_Store.setLocal('das_classid',class_id);//set in local storage
        $window.location.href = '#/addstudent'; //load dashboard
     }
    else if(resp['error_code']==1){
        global._alert({template: resp['error_msg'], dependency:$ionicPopup});     
     }
    else
     {
        global._alert({template: resp['comments'], dependency:$ionicPopup});
     }
}

}]);

add_class_goBack=function(){
   window.location.href ='#/dashboard';
}