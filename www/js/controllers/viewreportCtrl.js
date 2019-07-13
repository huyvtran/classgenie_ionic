var classroom = angular.module('starter');

/**
 *Define classroom controller
 */
classroom.controller('viewreportCtrl',['$scope','$window','$location','$state','$ionicPopup','$ionicModal','$ionicHistory','$ionicLoading','$ionicPopover','$ionicLoading','$cordovaToast','$timeout',function($scope,$window,$location,$state,$ionicPopup,$ionicModal,$ionicHistory,$ionicLoading,$ionicPopover,$ionicLoading,$cordovaToast,$timeout){
 var stored_classId=Service_Store.getLocal('das_classid');
 Service_Store.setLocal('datetoken','today');
 $scope.imagePath =global.config['file_url']+global.config['image_path'];
 

   /**
      *api calling loader for classroom data
      */  
      $scope.show = function() {
          $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner>'
          }).then(function(){
          });
      };

      $scope.hide = function(){
          $ionicLoading.hide().then(function(){
          });
      };

  loadstudent = function(){
        global.checkNetworkConnection($ionicPopup);
        ajaxloader.async=false;
        ajaxloader.load(global.config['api_url']+"/classinfo/studentlist?"+'token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId,
          function(resp){
        ajaxloader.async=true;
        var res1=$.parseJSON(resp);
        if(res1.status == "Success")

          { 
            var class_studentlist =res1.class_details.student_list;
            $scope.className=res1.class_details.class_name;
            $scope.classImage=res1.class_details.image;
            $scope.classPoints=res1.class_details.pointweight;
            $scope.items = class_studentlist;
            var classgrade =res1.class_details.grade;
            //store data in local storage
            Service_Store.setLocal('das_classname', $scope.className);
            Service_Store.setLocal('das_classImage', $scope.classImage);
            Service_Store.setLocal('das_classGrade', classgrade);
          }else if(res1.error_code==1){

            global._alert({template: res1.error_msg, dependency:$ionicPopup});
            }
         });
   }
loadstudent();
/**
 *Function to load class student list for performance report
 */
$scope.getReport = function(item){
    var datetoken = Service_Store.getLocal('datetoken');
    if(datetoken == 'thismonth'){
     $scope.tokenDta = 'This Month';
   }else if(datetoken == 'thisweek'){
     $scope.tokenDta = 'This Week';
   }else if(datetoken == 'daterange'){
    $scope.tokenDta = 'Date Range';
   }else{
    $scope.tokenDta = 'Today';
   }
    $ionicModal.fromTemplateUrl('templates/your_kid_performance.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
    $scope.modal1 = modal;
    $scope.modal1.show();
    });  
    var class_id  = stored_classId;
    var datetoken = 'thismonth';
    if(item == '1'){
      var student   = '1';
      $scope.name   = 'Whole Class Performance';
    }
    else
    {
       var student   = item.student_no;
       $scope.name   = item.name;
    }

    $scope.closeList = function(){
      $scope.modal1.remove();
    }
     
    $scope.getDateRange = function(){
        $ionicModal.fromTemplateUrl('templates/calender.html', {
                scope: $scope,
              animation: 'slide-in-up'
              }).then(function(modal) {
                 $scope.modal = modal;
                 $scope.modal.show();
              });
    } 
    
    $scope.getdateSelected = function(){
       $scope.getStudentData(student,class_id,datetoken);
     }

     $scope.getDate = function(event){ 
          Service_Store.removeKey('datetoken');
          var id = event.target.id;  
          $('#'+id).addClass('ion-checkmark-round');
          $scope.datetokenview = event.target.attributes.value.value;
          $scope.closePopover();
          Service_Store.setLocal('datetoken',id);
          if(id == 'thismonth'){
          $scope.tokenDta = 'This Month';
           }else if(id == 'thisweek'){
             $scope.tokenDta = 'This Week';
           }else if(id == 'daterange'){
            $scope.tokenDta = 'Date Range';
           }else{
            $scope.tokenDta ='Today';
           }
          var datetoken = Service_Store.getLocal('datetoken'); 
          if(id == 'daterange')
          {
            $scope.getDateRange();
            return;
          }
          $scope.getStudentData(student,class_id,datetoken); 
    };

    $scope.getStudentData(student,class_id,datetoken);   

}

$scope.openReportWithDate = function(v){   
      var fulldate = '';
      if(v != ''){
         var date  =  new Date(v);
      }
      else
      {
         var date  =  new Date();
      }
      var year  = date.getFullYear();
      var month = date.getMonth()+1;
      var date  = date.getDate();
      fulldate  = year+'/'+month+'/'+date;  
      return fulldate;
  }

/**
 *Function to load performance report
 */
$(document).ready(function(){
   $scope.getStudentData = function(student,class_id,datetoken){ 
         var url = '';
         var date1 = '';
         var date2 = '';
         if(datetoken == 'thismonth'){
           $scope.tokenDta = 'This Month';
         }else if(datetoken == 'thisweek'){
           $scope.tokenDta = 'This Week';
         }else if(datetoken == 'daterange'){
          $scope.tokenDta = 'Date Range';
         }else{
          $scope.tokenDta = 'Today';
         }
         if(Service_Store.getLocal('datetoken') == 'daterange'){
            datetoken =  Service_Store.getLocal('datetoken');
            date1 = $scope.openReportWithDate($('#date1').val());
            date2 = $scope.openReportWithDate($('#date2').val());
            $scope.tokenDta = 'From '+ date1 +' To ' +date2;
            Service_Store.setLocal('datetoken','thismonth');
         }
         if(student == '1'){
            url = global.config['api_url']+'/class_perform?token='+Service_Store.getLocal('app_token')+"&class_id="+class_id+"&datetoken="+datetoken+"&startdate="+date1+"&enddate="+date2;
         }
         else
         {
            url = global.config['api_url']+'/report/student?token='+Service_Store.getLocal('app_token')+"&class_id="+class_id+"&student_info_no="+student+"&datetoken="+datetoken+"&startdate="+date1+"&enddate="+date2;
         }

     ajaxloader.load(url,
         function(resp){
         var res1=$.parseJSON(resp);
         if(res1.status != "Failure"){
                $scope.show();
                $scope.nocontent = true;
                $scope.graph = false;
                  var positive = [];
                  var needwork = [];
                  //$scope.teacher_name = res1.teacher_name[0].name;
                  $scope.time = '';//moment(1439198499).format("HH:mm:ss");
                  var skill_list = res1.point;
                  $scope.pos_total = 0;
                  $scope.need_total = 0;
                  skill_list.forEach(function(skill_list){
                        if(skill_list.customize_detail.hasOwnProperty('pointweight') == true){
                            if(skill_list.customize_detail.pointweight>0){ 
                               var pos_skillcount = skill_list.point; //skill_list.customize_detail.pointweight;
                               $scope.pos_total += pos_skillcount;
                            }
                            else if(skill_list.customize_detail.pointweight<0){
                               var need_skillcount = skill_list.point*(-1); //skill_list.customize_detail.pointweight;
                               $scope.need_total += need_skillcount;
                            }
                        }
                        else
                        {
                          $scope.pos_total = 0;
                          $scope.need_total = 0;
                        }
                  }); 
                  var positive_skill = Math.round(($scope.pos_total/($scope.pos_total+$scope.need_total))*100);
                  var needwork_skill = Math.round(($scope.need_total/($scope.pos_total+$scope.need_total))*100);
                  FusionCharts.ready(function(){
                            var fusioncharts = new FusionCharts({
                            type: 'doughnut2d',
                            renderAt: 'chart-container',
                            width: '445',
                            height: '250',
                            dataFormat: 'json',
                            dataSource: {
                                "chart": {
                                    "caption": "",
                                    "subCaption": "",
                                    "numberPrefix": "%",
                                    "startingAngle": "310",
                                    "decimals": "0",
                                    "defaultCenterLabel": ""+positive_skill+"% Positive",
                                    "centerLabel": "$label : $value",
                                    "useDataPlotColorForLabels": "1",
                                    "theme": "fint"
                                },
                                "data": [
                                {
                                    "label": "Need Work",
                                    "value": needwork_skill
                                },
                                {
                                    "label": "Positive",
                                    "value": positive_skill
                                } 
                                
                            ]}
                       });
                     try{
                         fusioncharts.render();
                         $scope.award_data = res1.point;
                         $scope.hide();
                      }catch (e){
                         $scope.disconnected = false;
                         $scope.award_data = '';
                         $scope.nocontent = false;
                         $scope.graph = true;
                      }
              });
         }
        if(res1.status == "Failure"){
            $scope.disconnected = false;
            $scope.award_data = '';
            $scope.nocontent = false;
            $scope.graph = true;
          }
        });
    }
});

/**
 *Function to Migrate to class room screen
 */
$scope.classroom_page = function(){
   window.location.href = '#/tab/'+stored_classId+'/classroom'
}

/**
 *Function to show date  List popup
 */
$scope.selectDate = function($event){
    $scope.popover_items=[{name:"Today"},{name:"This Week"},{name:"This Month"},{name:"Date range"}];
    var template = '<ion-popover-view class="dropdownsetting stud"><ion-content>'
    +'<ul class="list">'
    +'<a><li class="item" id="today"     value="Today"     on-tap="getDate($event)">Today</li></a>'
    +'<a><li class="item" id="thisweek"  value="This Week"  on-tap="getDate($event)">This Week</li></a>'
    +'<a><li class="item" id="thismonth" value="This Month" on-tap="getDate($event)">This Month</li></a>'
    +'<a><li class="item" id="daterange" value="range"      on-tap="getDate($event)">Date Range</li></a>'
    +'</ul>'
    +'</ion-content></ion-popover-view>';

    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });


    $scope.popover.show($event);

    $scope.closePopover = function() {
      $scope.popover.hide();
    };

    $scope.$on('popover.hidden', function() {
       // Execute action
     }); 

}

}]);