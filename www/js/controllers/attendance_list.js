var attendance_module = angular.module('starter');

attendance_module.controller('attendanceCtrl',['$scope','$filter','$location','$window','$state','$ionicHistory','$base64','$ionicPopup','$ionicLoading','$ionicPopover','$ionicModal','$cordovaToast',function($scope,$filter,$location,$window,$state,$ionicHistory,$base64,$ionicPopup,$ionicLoading,$ionicPopover,$ionicModal,$cordovaToast){
loader.dependency = $ionicLoading;
var daterange = [];
var datetoken = 'today';
var datevalue = '';
var off = '';
var cdate = '';
var date = ''
$scope.today = new Date();
$scope.current = $scope.currentDate;
var stored_memberNo= Service_Store.getLocal('das_member_no');
var stored_classId=Service_Store.getLocal('das_classid');
$scope.classimage=Service_Store.getLocal('das_classImage');
$scope.imagePath = global.config['file_url']+global.config['image_path'];
$scope.imageuri=$scope.imagePath+"/class/"+$scope.classimage;
$scope.currenDate = global.currenDate();
$scope.current = $scope.today;


$scope.getDate_1 = function($this)
{
$scope.date_max = $filter('date')(this.current,'yyyy-MM-dd');
$scope.date_max2 = $filter('date')($scope.today,'yyyy-MM-dd');
if($scope.date_max > $scope.date_max2){
  global._alert({template: 'You can\'t mark attendance for upcoming dates.', dependency: $ionicPopup});      
      return false;
}else{
loadData(this.current);
date = this.current;
}
}


loadData=function(date){
      $scope.holiday = 'NA';
      $scope.reset   = true;
      cdate     = new Date(date);
      var year  = cdate.getFullYear();
      var month = cdate.getMonth()+1;
      var date  = cdate.getDate();
      var fulldate  = year+'-'+month+'-'+date;
    global.checkNetworkConnection($ionicPopup);
	 // ajaxloader.async = false;
     ajaxloader.load(global.config['api_url']+'/attendance/studentlist?token='+Service_Store.getLocal('app_token')+"&class_id="+stored_classId+"&date1="+fulldate,
     function(resp){
       // if( res1.hasOwnProperty('user_list')){
           var res1=$.parseJSON(resp);
           if(res1.hasOwnProperty('user_list')){
           $scope.items=res1['user_list'];
           var response =res1['user_list'];
           for(var i=0;i<response.length;i++){
            if(res1['user_list'][i]['student_no'][0]['attendance']==""){
                res1['user_list'][i]['student_no'][0]['attendance']="NA"
                $scope.items=res1['user_list'];
              }
                
            }
             console.log($scope.items);

           response.forEach(function(response){
      if(response.hasOwnProperty('id'))
      { 
         $scope.reset  = false;
          return;
      }
     });
    }else{
      $scope.datamessage = 'No Data';
    }
   });
}

loadData($scope.today);

$scope.currentDate = new Date();
$scope.maxDate = new Date(2105, 6, 1);
$scope.minDate = new Date(2016, 6, 31);
 

//function for reset attendence
$scope.resetAttendence = function()
  { 
     var resetdate = $scope.getDateFormat(cdate);
    ajaxloader.loadURL(global.config['api_url']+'/attendance_reset?token='+Service_Store.getLocal('app_token'),
       {
          class_id:stored_classId,
          date:resetdate
       },$scope.attendanceResponse = function(resp){
           loadData(resetdate);
    });

  }

//function for absent all class
$scope.all=function(holiday)
{
  $scope.holiday = holiday;
 $('#student_list').find('.aatendence_present img').each(function(){
        if(holiday == 'A'){
            $(this).removeAttr('src'); //Remove all present
            $(this).attr('src','img/attendance_a.png'); //Add absent
        } else if(holiday == 'NA' || holiday == 'H'){
            $(this).removeAttr('src'); //Remove all present
            $(this).attr('src','img/attendance_h.png'); //Add absent
            off = holiday;
        }
        else
        {
            $(this).removeAttr('src'); ////Remove all absent
            $(this).attr('src','img/attendance_p.png'); //Add present
         }
     });
}

//Give attendence function
$scope.giveAttendance = function(event){
     var src = event.target.src.substr(event.target.src.lastIndexOf('/')+1);
     if(src == 'attendance_p.png'){
        event.target.src = "img/attendance_a.png";
     }
     if(src == 'attendance_a.png'){
        event.target.src = 'img/attendance_l.png';
     }
     if(src == 'attendance_l.png'){
        event.target.src = 'img/attendance_p.png';
        off = 'NA';
     }
     else if(src == 'attendance_h.png'){
        event.target.src = 'img/attendance_p.png';
     } 
     else if(src == 'attendance_na.png'){
        event.target.src = 'img/attendance_p.png';
     }
}
$scope.getDateFormat = function(date)
{

      date   = new Date(date);
      var year  = date.getFullYear();
      var month = date.getMonth()+1;
      var date  = date.getDate();
      var fulldate1  = year+'-'+month+'-'+date;
      return fulldate1;

}

//Save attendence 
$scope.saveAttendence = function(){
   // var date = $('#date1').val();
   if($scope.date_max > $scope.date_max2){
  global._alert({template: 'You can\'t mark attendance for upcoming dates.' , dependency: $ionicPopup});      
      return false;
}else{
    if(date == '')
    {
      date = $scope.currentDate;
    } 
    var objSend = {};
    objSend.class_id = stored_classId;
    objSend.student_list = [];
    $('#student_list').find('.aatendence_present img').each(function(){
        var attendence;
        if($(this).attr('src') == 'img/attendance_p.png'){
           attendence = 'P';
        }
        if($(this).attr('src') == 'img/attendance_a.png'){
           attendence = 'A';
        }
        if($(this).attr('src') == 'img/attendance_l.png'){
          attendence = 'L';
        }
        if($(this).attr('src') == 'img/attendance_h.png'){
          attendence = off;
        }
        objSend.student_list.push({student_no:$(this).attr('data-studentno'), attendance:attendence});
    });
   var listData=$base64.encode(JSON.stringify(objSend));
   global.checkNetworkConnection($ionicPopup);
   var fulldate1 = $scope.getDateFormat(date);
   ajaxloader.async = false;
    ajaxloader.loadURL(global.config['api_url']+'/attendance/save?token='+Service_Store.getLocal('app_token'),
   {
      student_list:listData,
      date:fulldate1
   },$scope.attendanceResponse = function(resp){
    //return;
    ajaxloader.async = true;
  if(resp['status'] == "Success")
  { window.plugins.toast.show('attendance updated', 'short', 'center');
    $scope.daterange = fulldate1; 
    datetoken = 'date';
    $window.location.href = '#/tab/'+stored_classId+'/classroom';
    $scope.getAttendenceReport(datetoken);
   
}else if(resp['error_code']==1){

           global._alert({template: resp['error_msg'], dependency:$ionicPopup});

           }
  else
  {
    global._alert({template: resp['comments'], dependency:$ionicPopup});
  }
});



/**
*Response from ajax
*@params resp
*/
}
}
 $scope.back_attendance=function(){
     $window.location.href = '#/tab/'+stored_classId+'/classroom';
    }


$scope.ViewAttendanceReport = function($event)
{

     $scope.popover_items=[{name:"Today"},{name:"This Week"},{name:"This Month"},{name:"Date range"}];
      var template = '<ion-popover-view class="dropdownsetting stud"><ion-content>'
      +'<ul class="list" >'
      +'<a><li class="item" id="today"     value="today"      on-tap="getDate($event)">today</li></a>'
      +'<a><li class="item" id="thisweek"  value="this week"  on-tap="getDate($event)">this week</li></a>'
      +'<a><li class="item" id="thismonth" value="this month" on-tap="getDate($event)">this month</li></a>'
      +'<a><li class="item" id="range"     value="date range" on-tap="getDate($event)">date range</li></a>'
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
      var dateToken = '';

}

$scope.getDate = function(event)
  {   
      if(event.target.id == 'range')
      {
      $scope.getDateRange();//return;
      datevalue = 'selected '+event.target.innerText;
      }
      else if(event.target.id != 'range')
      {
      datetoken = event.target.id;
      $scope.getAttendenceReport(datetoken);
      datevalue = event.target.innerText;
      }
      $scope.closePopover();
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

$scope.openReportWithDate = function(v)
  {   var fulldate = '';
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
      fulldate  = year+'/'+month+'/'+date;  
      return fulldate;
  }

$scope.getdateSelected = function()
{
var daterange = [];
var d1 = $scope.openReportWithDate($('#date1').val());
var d2 = $scope.openReportWithDate($('#date2').val());
daterange.push({"date1":d1,"date2":d2});
$scope.daterange = JSON.stringify(daterange[0]);
datetoken  = 'daterange'; 
$scope.getAttendenceReport(datetoken);
}

$scope.getAttendenceReport = function(dateToken)
{ 
  if(datetoken == 'daterange' || datetoken == 'date')
  { 
    var range = $scope.daterange;
  }else
  {
    var range = '';
  }
  var data = JSON.parse(Service_Store.getLocal('parentdata'));//return;
  var name = data[0].name;
  var member_no = data[0].member_no;
  var email = data[0].email;
  ajaxloader.loadURL(global.config['api_url']+'/download_exl?token='+Service_Store.getLocal('app_token'),
   {
      datetoken:dateToken,
      class_id:stored_classId,
      teacher_name:name,
      member_no:member_no,
      email:email,
      daterange:range

   },$scope.attendanceResponse = function(resp){
      if(resp['status'] ==  'Success'){
           global._alert({template: 'Attendence record for ' +datevalue+' has been successfully mailed on your id '+email+'', dependency:$ionicPopup});
     }
});
return true;
}
}]);

attendance_module.controller('dateController',['$scope','$filter','$ionicPopup',function($scope,$filter,$ionicPopup){
$scope.getDateRange = function()
{

}
$scope.close = function()
{

$scope.modal.remove();

}

$scope.currentDate = new Date();
$scope.maxDate = new Date(2105, 6, 1);
$scope.minDate = new Date(2016, 6, 31);
 
$scope.datePickerCallback = function ($this) {
$('#date1').val('');
$('#date1').val(this.currentDate);
};

$scope.currentDate1 = new Date();
$scope.maxDate = new Date(2105, 6, 1);
$scope.minDate = new Date(2016, 6, 31);
$scope.datePickerCallback2 = function ($this) {
$('#date2').val('');
$('#date2').val(this.currentDate1);
};

$scope.choosedate = function(a)
{ 
  var date1 = $filter('date')($scope.currentDate, 'yyyy-MM-dd');
  var date2 = $filter('date')($scope.currentDate1, 'yyyy-MM-dd'); 
  if(date1 > date2){
    alert('End date should be greater than start date');
    return false;
  }
    if(a == 1)
    {
    $scope.modal.remove();
    $scope.getdateSelected();
    }
    else if(a == 0){
    $scope.modal.remove();
    }

}

}]);

