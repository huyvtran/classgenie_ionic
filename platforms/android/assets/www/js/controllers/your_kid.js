var kids_list = angular.module('starter');

kids_list.controller('yourKidCtrl',['$scope','$location','$window','$http','$state','$ionicHistory','$ionicModal','$ionicPopover','$ionicPopup','$ionicLoading','$timeout',function($scope,$location,$window,$http,$state,$ionicHistory,$ionicModal,$ionicPopover,$ionicPopup,$ionicLoading,$timeout){


loader.dependency = $ionicLoading;
var stored_memberNo= Service_Store.getLocal('das_member_no');
$scope.imagePath = global.config['file_url']+global.config['image_path'];
Service_Store.setLocal('datetoken','thismonth');

  loadData=function(){
	  ajaxloader.async = false;
    global.checkNetworkConnection($ionicPopup);
     ajaxloader.load(global.config['api_url']+'/parent/kidslist?token='+Service_Store.getLocal('app_token')+"&parent_ac_no="+stored_memberNo,
     function(resp){
           var res1=$.parseJSON(resp);
           var jsonResponse=res1.student_list;
           $scope.items=res1.student_list;
           ajaxloader.async = true;
      });
}
$scope.addParentCode=function(){
    Service_Store.setLocal('key_back_status',"your_kid");
    $state.go('check_parent_code');
}

 loader.init();
 $timeout(function(){
      loadData();
    },500);


$scope.performance = function(item)
  {

    $state.go('side_menu_performance.side_menu_performance_content');
    Service_Store.setLocal('report',JSON.stringify(item)); 
  }


$scope.openSideMenuPerformance=function(item){
  //Service_Store.removeKey('atttab');
  $scope.std_parent_no=this.item.parent_ac_no ;
  /* all classsesss hree*/
  var classesData = Service_Store.getLocal("classesData"); 
  Service_Store.setLocal("parent_acno",$scope.std_parent_no);
    var data = {
              "name":item.name,
              "class_name":item.class_name,
              "member_no":item.member_no,
              "parent_ac_no":item.parent_ac_no,
              "student_no":item.student_no,
              "class_id":classesData,
              "class11":'all'
          }; 
  Service_Store.setLocal('report',JSON.stringify(data)); 
  Service_Store.removeKey("classesData");   
  $window.location.href='#/side_menu_performance';

}
}]);
kids_list.controller('childreview',['$scope','$location','$window','$http','$state','$ionicHistory','$ionicModal','$ionicPopover','$ionicPopup','$ionicLoading',function($scope,$location,$window,$http,$state,$ionicHistory,$ionicModal,$ionicPopover,$ionicPopup,$ionicLoading){
  var daterange = [];
$scope.imagePath = global.config['file_url']+global.config['image_path'];



$scope.showAttTab = function()
    {


        $scope.hideattendence = false;
        $scope.hidegraph = true;
        $scope.perftab="";
        $scope.att_tab="award_tab";
        $scope.selectdate = true;
        Service_Store.setLocal('atttab','1');
        // comment in 2/4/2017
        Service_Store.removeKey('datetoken');
        $scope.getCurrentAttendence = function()
      {
        Service_Store.removeKey('range_date_class');
        $scope.tokenDta = '';
        var curr = new Date; // get current date
        var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        var firstday = String(new Date(curr.setDate(first)));
        var lastday = String(new Date());         
        var f = firstday.split(" "); 
        
        $scope.date1 = f[0]+", "+f[1]+", "+f[2];        
        var l = lastday.split(" ");;
        $scope.date2 = l[0]+", "+l[1]+", "+l[2];
        $scope.loadttendence($scope.openReportWithDate(firstday,1),$scope.openReportWithDate(lastday,1));
      }
        $scope.getCurrentAttendence();
    }

  
  $scope.getday = function(item)
    { 
      var d = new Date(item.date);
      var n = d.getDay();
    }



//loadData();

$scope.selectDate = function($event)
{


 $scope.popover_items=[{name:"Today"},{name:"This Week"},{name:"This Month"},{name:"Date range"}];
  var template = '<ion-popover-view class="dropdownsetting stud"><ion-content>'
  +'<ul class="list">'
  +'<a><li class="item" id="today"     value="Today"      on-tap="getDate($event)">Today</li></a>'
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

$scope.getDate = function(event)
{ var id = event.target.id;  
  $('#'+id).addClass('ion-checkmark-round');
  $scope.datetokenview = event.target.attributes.value.value; 
  //.log($scope.datetokenview);
  $scope.closePopover();

  if($scope.datetokenview == 'range')
    { 
      $scope.getDateRange();
    }
  Service_Store.setLocal('datetoken',id);
  var data = JSON.parse(Service_Store.getLocal('report'));
  var student_no = data.student_no;
  var class_id = data.class_id; 
  var name = data.name;
  $scope.openStudentDetail(student_no,class_id,name);   
// }
};



$scope.goBack  = function()
{
    $state.go('home.your_kid');
}

$scope.loadttendence = function(date1,date2)
{
    var dd = Date.parse(date1);
    var diff =  Math.floor(( Date.parse(date2) - Date.parse(date1) ) / 86400000);
  var nextDay = ''; 
  var tomorrow = new Date(date1);  
  var days = [];
  var data = Service_Store.getLocal('report');
      data = JSON.parse(data);
      $('.change_class').html(data.class_name);
    var member_no = data.student_no;
    var today_date = tomorrow.setDate(tomorrow.getDate());
    days.push({"student_no":member_no,"attendance":"NA","date" : $scope.openReportWithDate(today_date,3)});
       for(i=1;i<=diff;i++)
  {
    tomorrow.setDate(tomorrow.getDate() + 1);
    days.push({"student_no":member_no,"attendance":"NA","date" : $scope.openReportWithDate(tomorrow,3)});
  } 
    ajaxloader.async = false;
    global.checkNetworkConnection($ionicPopup);
    ajaxloader.load(global.config['api_url']+'/attendance_report?token='+Service_Store.getLocal('app_token')+"&student_no="+member_no+"&date1="+date1+"&date2="+date2,
     function(resp){
     var res1=$.parseJSON(resp);
     $scope.stu=res1.attandence_list;
     var list = $scope.stu; 
     days.forEach(function(days){
      
      list.forEach(function(list){
            if(days.date == list.date){
        days.attendance = list.attendance;
        }
      })

     })
     $scope.days = days;
     ajaxloader.async = true;
      });
}




$scope.getDateRange = function()
{

$ionicModal.fromTemplateUrl('templates/calender.html', {
              scope: $scope,
            animation: 'slide-in-up'
            }).then(function(modal) {
               $scope.modal = modal;
               $scope.modal.show();
            });
}
   
$scope.getdateSelected = function()
  { var today = new Date();
    var date1 = '';
    var date2 = '';
    $scope.daterange = '';
      daterange = [];
      $scope.d1 = $('#date1').val();
      $scope.d2 = $('#date2').val();
      if($scope.d1 == '')
      {
        $scope.d1 = today.toString();
      }if($scope.d2 == '')
      {
        $scope.d2 = today.toString();
      }
      if(Service_Store.getLocal('datetoken') == null){
          date1 = $scope.openReportWithDate($scope.d1,1);
          date2 = $scope.openReportWithDate($scope.d2,1);
          $scope.loadttendence(date1,date2);
          $scope.getAttendenceWithDate($scope.d1,$scope.d2); 
              }
              else
              {
        date1 = $scope.openReportWithDate($scope.d1,2);
        date2 = $scope.openReportWithDate($scope.d2,2);
        daterange.push({"date1":date1,"date2":date2});
        $scope.daterange = JSON.stringify(daterange);
        $scope.tokenDta = 'From '+ daterange[0].date1 +' To ' +daterange[0].date2;
        Service_Store.setLocal('range_date_class',$scope.tokenDta);
        $scope.openStudentDetail();
     }

  }


$scope.openReportWithDate = function(v,a)
  {   var fulldate = '';
      var date  =  new Date(v);
      var year  = date.getFullYear();
      var month = date.getMonth()+1;
      if(month<=9){
        month = '0'+month;
      }
      var date  = date.getDate();     
      if(a == 1)
      {
      fulldate  = year+'-'+month+'-'+date;
      }else if(a == 2)
      {
      fulldate  = year+'/'+month+'/'+date;  
      }
      else if(a == 3)
      {if(date < 10 && date != 0)
        {
          date = '0'+date;
        }
       fulldate  = date+'/'+month+'/'+year;
        
      }
      return fulldate;
  }

$scope.getAttendenceWithDate = function(d1,d2)
  { var date1 =  d1.split(" ");
    $scope.date1 = date1[0]+", "+date1[1]+", "+date1[2];
    var date2 =  d2.split(" ");
    $scope.date2 = date2[0]+", "+date2[1]+", "+date2[2];
  }



$(document).ready(function(){

$scope.openStudentDetail = function()
  { 

      var date1 = '';
      var date2 = '';
      var datetoken = Service_Store.getLocal('datetoken'); 
      if(datetoken == null){
       datetoken = 'thismonth';
      } 
    if(datetoken == 'thismonth'){
       $scope.datetokenview = 'THIS MONTH';
     }else if(datetoken == 'thisweek'){
      $scope.datetokenview = 'THIS WEEK';
     }else if(datetoken == 'daterange'){
      $scope.datetokenview = 'DATE RANGE';
     }else{
       $scope.datetokenview = datetoken.toUpperCase();      
     }
       if(datetoken != 'daterange'){
       $scope.tokenDta = '';
      }      
      var data = JSON.parse(Service_Store.getLocal('report'));
      var student_no = data.student_no;
      var class_id = data.class_id;
     
     
      var student_ac_no = data.member_no;
      var parent_ac_no = data.parent_ac_no;
      var name = data.name;
      if(datetoken == 'daterange' && daterange != '')
      {  
        date1 = daterange[0].date1;
        Service_Store.setLocal('date1',date1); 
        date2 = daterange[0].date2;
        Service_Store.setLocal('date2',date2);
        
      }
      $scope.name = name; 
      $scope.graph = true;
      if( datetoken == 'daterange' && daterange.length === 0){
        date1 = Service_Store.getLocal('date1');
        date2 = Service_Store.getLocal('date2'); 
    } 
     
 
   
      if(data.class11 == 'single'){ 
      var url = global.config['api_url']+'/report/student?token='+Service_Store.getLocal('app_token')+"&class_id="+class_id+"&student_info_no="+student_no+"&datetoken="+datetoken+"&startdate="+date1+"&enddate="+date2;
       //Service_Store.removeKey('date1');
       //Service_Store.removeKey('date2');
   }
  else{

   var url = global.config['api_url']+'/report/all/student?token='+Service_Store.getLocal('app_token')+"&parent_ac_no="+parent_ac_no+"&name="+name+"&datetoken="+datetoken+"&startdate="+date1+"&enddate="+date2;
   //  //var url = global.config['api_url']+'/report/student?token='+Service_Store.getLocal('app_token')+"&class_id="+class_id+"&student_info_no="+student_no+"&datetoken="+datetoken+"&startdate="+date1+"&enddate="+date2;
   }
      global.checkNetworkConnection($ionicPopup);
      //ajaxloader.async = true;
      ajaxloader.load(url,
        function(resp){
        var res1=$.parseJSON(resp);        
        if(res1.status == "Success")
          { 
            $scope.nocontent = false;
            $scope.graph = true;    
            $scope.award_data = res1.point 
              var positive = [];
              var needwork = [];

             var skill_list = res1.point;
             $scope.pos_total = 0;
             $scope.need_total = 0;
             skill_list.forEach(function(skill_list){
            if(skill_list.customize_detail.pointweight > 0)
            {
              var pos_skillcount = skill_list.point;// / skill_list.customize_detail.pointweight;
              $scope.pos_total += pos_skillcount;
            }
            else if(skill_list.customize_detail.pointweight < 0)
            {
              var need_skillcount = skill_list.point*(-1);// / skill_list.customize_detail.pointweight;
              $scope.need_total += need_skillcount;
            }
             }); 
             var positive_skill = Math.round(($scope.pos_total/($scope.pos_total+$scope.need_total))*100);
             var needwork_skill = Math.round(($scope.need_total/($scope.pos_total+$scope.need_total))*100);
             FusionCharts.ready(function(){
          var fusioncharts = new FusionCharts({
          type: 'doughnut2d',
          renderAt: 'chart-container',
          width: '490',
          height: '250',
          right:'45',
          dataFormat: 'json',
          dataSource: {
              "chart": {
                  "caption": "",
                  "subCaption": "",
                  "numberPrefix": "%",
                  "startingAngle": "310",
                  "decimals": "0",
                  "defaultCenterLabel": "Positive:"+positive_skill+"%",
                  "centerLabel": "$label award: $value",
                  "useDataPlotColorForLabels": "1",
                  "theme": "fint"
              },
              "data":[{
                      "label": "Need Work",
                      "value": needwork_skill
                     }, 
                     {
                      "label": "Positive",
                      "value": positive_skill
                     }
          ]}
      });

      fusioncharts.render();
      });
             ajaxloader.async = true;
          }
          if(res1.status == "Failure"){
            $scope.award_data = '';
            $scope.nocontent = true;
            $scope.graph = false; 

           }
           else if(res1.error_code == '1')
          { 
            global._alert({template: res1.error_msg, dependency:$ionicPopup});
            $scope.goBack();
          }
       });
  }
  $scope.openStudentDetail();
});

$scope.showPerfTab = function()
  {
    Service_Store.setLocal('atttab','2');
    $scope.hideattendence = true;
    $scope.hidegraph = false;
    $scope.selectdate = false;
    $scope.perftab="award_tab";
    $scope.att_tab="";
    $scope.openStudentDetail();
  }

 var atttab = Service_Store.getLocal('atttab');   
  if(atttab == '1'){
   $scope.showAttTab();   
  }else{
   $scope.showPerfTab();  
  }



}]);