var singleSkill = angular.module('starter');

 singleSkill.controller('singleSkillCtrl',['$scope','$http','$window','$location','$ionicModal','$ionicPopup','$ionicLoading','$base64',function($scope,$http,$window,$location,$ionicModal,$ionicPopup,$ionicLoading,$base64){
  loader.dependency = $ionicLoading;
  var stored_classId=Service_Store.getLocal('das_classid');
  var memberNO= Service_Store.getLocal('das_member_no');
  $scope.imagePath =global.config['api_url']+global.config['image_path'];

  var skill_id    = Service_Store.getLocal('skillId');
  var skill_name  = Service_Store.getLocal('skillName');
  $scope.pointweight = Service_Store.getLocal('pointweight');
  $scope.selectGrade = Service_Store.getLocal('pointweight');
  var imageName   = Service_Store.getLocal('imageName');

  //set name and image on page load
  $scope.skillname=skill_name;
  $scope.image= global.config['file_url']+"assets/skill/"+imageName;

//positive values of points http://162.243.117.156:3000/classlist/negativepointweight?token=aforetechnical@321
     ajaxloader.async = false;
     global.checkNetworkConnection($ionicPopup);
     ajaxloader.load(global.config['api_url']+'/classlist/positivepointweight?token='+Service_Store.getLocal('app_token'),function(resp){
       $scope.selectGrades = $.parseJSON(resp);
       ajaxloader.async = true;
     });
     if(Service_Store.getLocal('pointweight') < 0)
     {
      ajaxloader.load(global.config['api_url']+'/classlist/negativepointweight?token='+Service_Store.getLocal('app_token'),function(resp){
       $scope.selectGrades = $.parseJSON(resp);
       ajaxloader.async = true;
     });
     }
//for skill icon
  $scope.classIconPopup=function(){
  global.checkNetworkConnection($ionicPopup);
  ajaxloader.load(global.config['api_url']+"/editskills/imagelist?"+'token='+Service_Store.getLocal('app_token'),
    function(resp){
      var res1=$.parseJSON(resp);
      var output='';
      if(res1.status == "Success")
      {
          var skill_data = res1.user_list;
          Object.keys(skill_data).forEach(function(key) {
          var imageName=  skill_data[key]['image'];
          var imagePath=global.config['file_url']+"assets/skill/"+imageName;
          output+='<img ng-src='+imagePath+' on-tap="setImage($event)"  id='+key+' ng-name="add_class_user" />'
      });


  // A popup dialog for select the class icon
  var myPopup = $ionicPopup.show({
    template: output,
    title: 'Choose Skill Icon',
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

}else if(resp.error_code==1){

        global._alert({template: resp.error_msg, dependency:$ionicPopup});

      }

});


}

//selectvalue from dropdown
var gradeValue="";
$scope.showSelectValue = function(selectGrade1) {
  $scope.gradeValue=selectGrade1;
}




//edit skill 
$scope.editSkill=function(){
  var s = $scope.image;
  var fields = s.split( '/' );

  var image_name = fields[6];
  var skill_name= $scope.skillname;

  var data={
    name:skill_name,
    pointweight: gradeValue,
    image: image_name,
    id:skill_id 
  }


  var config = {
    headers : {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
    }
  }

  //console.log($scope.selectGrade);return;

  global.checkNetworkConnection($ionicPopup);
  ajaxloader.loadURL(global.config['api_url']+'/editskills/update?token='+Service_Store.getLocal('app_token'),
  {
    name: $base64.encode($scope.skillname),
    pointweight: $scope.selectGrade,
    image:image_name,
    id:skill_id
  },function(resp){
    if(resp['status'] == "Success"){

      global._alert({template: $scope.skillname+' skill updated..', dependency:$ionicPopup});
      $window.location.href ='#/editskills';
    }

  });

}


//remove skill
$scope.removeSkill=function(){
  var s = $scope.image;
  var fields = s.split( '/' );

  var image_name = fields[6];
  var skill_name= $scope.skillname;
  global.checkNetworkConnection($ionicPopup);
  ajaxloader.loadURL(global.config['api_url']+'/editskills/delete?token='+Service_Store.getLocal('app_token'),
  {

    id:skill_id

  },function(resp){

    if(resp['status'] == "Success"){
      $window.location.href ='#/editskills';
    }

  });
}



}]);

//back button
edit_skill_goBack=function()
  {
    window.location.href ='#/editskills';
  }