var addClass = angular.module('starter');

addClass.controller('addskillCtrl',['$scope','$ionicPopup','$location','$window','$ionicHistory','$ionicLoading','$base64',function($scope,$ionicPopup,$location,$window,$ionicHistory,$ionicLoading,$base64){
 loader.dependency = $ionicLoading;
  $scope.image="img/20_icon_2.png";
  var stored_classId=Service_Store.getLocal('das_classid');
  var jsonresponse=Service_Store.getLocal('parentdata');
  var json= $.parseJSON(jsonresponse);
  

for (var i=0;i<json.length;i++)
{

  var id       =json[i].id;
  var name     =json[i].name;
  var userEmail=json[i].email;
  var member_no=json[i].member_no;
  var user_type=json[i].type;

}

$scope.classIconPopup=function(){
var url=global.config['api_url']+'/editskills/imagelist?'+'token='+Service_Store.getLocal('app_token');
var output = '';
var key='';
ajaxloader.load(url, function(data){
        data = $.parseJSON(data);
        mylist_data = data.user_list;
        Object.keys(mylist_data).forEach(function(key) {

          var imageName=  mylist_data[key]['image'];
          var imagePath=global.config['file_url']+"assets/skill/"+imageName;

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

/*add new class
*/
$scope.addNewSkill=function(){

      var s = $scope.image;
      var fields = s.split( '/' );
      var image_name = fields[6];
      var skill_name=$scope.skillName;
      if(image_name==""|| image_name==null)
      {
        image_name="20_icon_2.png";
       }

   global.checkNetworkConnection($ionicPopup);
    ajaxloader.loadURL(global.config['api_url']+'/editskills?token='+Service_Store.getLocal('app_token'),
   {
        name: $base64.encode($scope.skillName),
        image: image_name,
        pointweight: gradeValue,
        member_no: member_no,
        class_id:stored_classId

   },$scope.addResponse);
};

/**
*Response from ajax
*@params resp
*/
$scope.addResponse = function(resp){

  if(resp['status'] == "Success"){
    $window.location.href = '#editskills';
  }else if(resp.error_code==1){

        global._alert({template: resp.error_msg, dependency:$ionicPopup});
        
  }


}

}]);
//back functionalty
add_skill_goBack=function(){

  window.location.href = '#editskills';

}
