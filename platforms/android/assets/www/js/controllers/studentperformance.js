app.controller('studentperformance',['$scope','$ionicPopover','$window','$ionicModal','$ionicPopup','$ionicLoading','$cordovaToast','$state',function($scope,$ionicPopover,$window,$ionicModal,$ionicPopup,$ionicLoading,$cordovaToast,$state){
$scope.datearea  = true;
$scope.imagePath =global.config['file_url']+global.config['image_path'];
var data = Service_Store.getLocal('parentdata');
var student_data = JSON.parse(data);
$scope.member_no = student_data[0].member_no;
var student  = student_data[0].member_no;
$scope.student   = student_data[0];
$scope.username  = $scope.student['username'];
$scope.member_no = $scope.student['member_no'];
var daterange = [];
if(student_data[0].status == 0){
   $scope.unverified = false;
}
else
{
  $scope.unverified = true;
}

$scope.getStudentClassList = function(){
      ajaxloader.load(global.config['api_url']+'/student/studentlist?token='+Service_Store.getLocal('app_token')+"&student_ac_no="+$scope.member_no,
        function(resp){
            var res1=$.parseJSON(resp);
            if(res1.status == "Success")
              {     
                  $scope.mylist_data = res1.student_list;
                  ajaxloader.async = true;
                  $scope.disconnected = true;
                  if(res1.student_list.length >0)
                  {
                    if(Service_Store.getLocal('studentcode') === null)
                    {
                     Service_Store.setLocal('studentcode',res1.student_list[0].student_no);
                     Service_Store.setLocal('parentcode',res1.student_list[0].parent_no);
                    }
                  }
                  if(res1.student_list.length >0)
                  {
                    $scope.code = res1.student_list[0].student_no;
                    $scope.parentcode = res1.student_list[0].parent_no;
                  }
              }
              if(res1.status == "Failure"){
                  $scope.disconnected = false;
                  Service_Store.removeKey('studentcode');
                  Service_Store.removeKey('parentcode');
              }
              else if(res1.error_code==1){
                  global._alert({template: res1.error_msg, dependency:$ionicPopup});
              }
       });

}

$scope.getStudentClassList();
$scope.class = 'All Classes';
Service_Store.setLocal('datetoken','thismonth');
$scope.datetokenview = 'This Month';

/**
 *function to fetch student performance according to selected class filters 
 **/
$scope.getStudentData = function(){ 
       var date1 = '';
       var date2 = '';
       var datetoken = Service_Store.getLocal('datetoken');
       if(datetoken == 'range' && daterange.length>0)
        {  
           datetoken = 'daterange'; 
           date1 = daterange[0].startdate;
           date2 = daterange[0].enddate;
        }
      if($scope.class == 'All Classes'){
           //$('#'+student).addClass('ion-checkmark-round');
           var url = global.config['api_url']+'/report/student/classreportlist?token='+Service_Store.getLocal('app_token')+"&student_ac_no="+student+"&datetoken="+datetoken+"&startdate="+date1+"&enddate="+date2;
       }
       else
       {  
           //$('#'+student.item.student_no).addClass('ion-checkmark-round');
           var url = global.config['api_url']+'/report/student?token='+Service_Store.getLocal('app_token')+"&class_id="+$scope.class_id+"&student_info_no="+$scope.student_no+"&datetoken="+datetoken+"&startdate="+date1+"&enddate="+date2;
       }
       showchart(url);
 }


$scope.selectDate = function($event){
    $scope.popover_items=[{name:"Today"},{name:"This Week"},{name:"This Month"},{name:"Date range"}];
    var template = '<ion-popover-view class="dropdownsetting stud"><ion-content>'
    +'<ul class="list" >'
    +'<a><li class="item" id="today"     value="Today"      on-tap="getDate($event)">Today</li></a>'
    +'<a><li class="item" id="thisweek"  value="This Week"  on-tap="getDate($event)">This Week</li></a>'
    +'<a><li class="item" id="thismonth" value="This Month" on-tap="getDate($event)">This Month</li></a>'
    +'<a><li class="item" id="range"     value="Date Range"  on-tap="getDate($event)">Date Range</li></a>'
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
     });
}


$scope.selectClass = function(){ 
    $scope.getStudentClassList();
    var member  = student;
    var myPopup = $ionicPopup.show({
            title: 'Select Class',
            template: '<ul class="list">'
            +'<li class="item" id="'+member+'" on-tap="closepopup('+member+')"><a>All Class</a></li>'
            +'<div ng-repeat="item in mylist_data"><li id="{{item.student_no}}"  class="item" value="{{item.class_id}}" on-tap="closepopup(this)"><a>{{item.class_name}}</a></li></div>'
            +'</ul>',
            scope: $scope,
            buttons: [{ 
                    text: 'Close',
                    type: 'button-default'
                 }]
       });

   $scope.closepopup = function(student){  
        if(typeof student.item == 'undefined')
        {
           $scope.class = 'All Classes';
        }
        else
        {
           $scope.class = student.item.class_name;
           $scope.class_id = student.item.class_id;
           $scope.student_no = student.item.student_no;
        }
        $('#sp_selected_class').html('&nbsp;'+$scope.class);
        $scope.getStudentData();
        myPopup.close();
    }

}

$scope.getAttendenceWithDate = function(v){  
      var dateformat = '';
      if(v != '')
      {
      var date  =  new Date(v);
      }
      else
      {
        var date  =  new Date();
      }
      var year  = date.getFullYear();
      var month = date.getMonth()+1;
      var date  = date.getDate();
      dateformat  = year+'/'+month+'/'+date;  
    return  dateformat;
}

$scope.getDateRange = function(){

     $ionicModal.fromTemplateUrl('templates/calender.html', {
                  scope: $scope,
                  animation: 'slide-in-up'
                }).then(function(modal) {
                   $scope.modal = modal;
                   $scope.modal.show();
                });

       $scope.getdateSelected = function()
          {  
              daterange=[];
              $scope.daterange = ''
              $scope.d1 = $('#date1').val();
              $scope.d2 = $('#date2').val();
              daterange.push({"startdate":$scope.getAttendenceWithDate($scope.d1),"enddate":$scope.getAttendenceWithDate($scope.d2)});
              $scope.daterange = JSON.stringify(daterange);
              $scope.datearea  = false;
              $scope.range = $scope.getAttendenceWithDate($scope.d1)+'   To   '+$scope.getAttendenceWithDate($scope.d2);
              $scope.getStudentData();
          }
 }

$scope.getDate = function(event){ 
      $scope.range = '';
      $scope.datearea  = true;
      var id = event.target.id;  
      //$('#'+id).addClass('ion-checkmark-round');
      if(id == 'range')
      { 
         $scope.getDateRange();
      }
      $scope.datetokenview = event.target.attributes.value.value;
      $('#sp_selected_date').html('&nbsp;'+$scope.datetokenview);
      Service_Store.setLocal('datetoken',id);
      $scope.getStudentData();
      $scope.closePopover();    
}; 


/**
 * function to represent student performance in do-nut graph format 
 **/

$(document).ready(function(){
     showchart = function(url)
     { 
          $scope.graph = true;
          $scope.nograph = true;
          global.checkNetworkConnection($ionicPopup);
          ajaxloader.load(url,
          function(resp){
          var res1=$.parseJSON(resp);

          if(res1.status == "Success")
            {  
               $scope.nograph = true;
               $scope.graph = false; 
               var positive = [];
               var needwork = [];
               $scope.award_data = res1.point;
               var skill_list = res1.point;
               $scope.pos_total = 0;
               $scope.need_total = 0;
               //$scope.teacher_name = res1.teacher_name[0].name;
               skill_list.forEach(function(skill_list){
                   if(skill_list.customize_detail.pointweight > 0)
                   { 
                     var pos_skillcount = skill_list.point  //skill_list.customize_detail.pointweight;
                     $scope.pos_total += pos_skillcount;
                   }
                   else if(skill_list.customize_detail.pointweight < 0)
                   {
                     var need_skillcount = skill_list.point*(-1); //skill_list.customize_detail.pointweight;
                     $scope.need_total += need_skillcount;
                   }
                }); 
                var positive_skill = Math.round(($scope.pos_total/($scope.pos_total+$scope.need_total))*100);
                var needwork_skill = Math.round(($scope.need_total/($scope.pos_total+$scope.need_total))*100);
                FusionCharts.ready(function(){
                var fusioncharts = new FusionCharts({
                type: 'doughnut2d',
                renderAt: 'chart-container',
                width: '460',
                height: '460',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "",
                        "subCaption": "",
                        "startingAngle": "310",
                        "decimals": "0",
                        "defaultCenterLabel":"Positive:"+positive_skill+"%",
                        "centerLabel": "$label award: $value",
                        "useDataPlotColorForLabels": "1",
                        "theme": "fint"
                    },
                    "data": [
                    {
                        "label": "Need Work",
                        "value": needwork_skill
                    },{
                        "label": "Positive",
                        "value": positive_skill
                    }
                  ]}
               });
               fusioncharts.render();
             });
             ajaxloader.async = true;
          }
         else
         {
              $scope.nograph = false;
              $scope.graph = true;
              $scope.award_data = '';
         }
            
        });

     }
});


$scope.curr_day = function() {
      var d = new Date();
      var weekday = new Array(7);
      weekday[0] = "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";

      var n = weekday[d.getDay()];
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();

      if(dd<10) {
          dd='0'+dd
      } 

      if(mm<10) {
          mm='0'+mm
      } 

     today = mm+'/'+dd+'/'+yyyy;
     $scope.date = n + ' ' + today;
     var date = global.currenDate();
     var month = date.split("-");
     month = month[1];
     $scope.currday = n + ' , ' +  dd + ' ' + month
 }

 $scope.curr_day();

 $scope.getStudentData();

 $scope.goBack = function(){
     $state.go('st_home.studentinvite');
  }

}]);