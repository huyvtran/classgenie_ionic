var global = {};

//cosole log
global.fclog = function (str){
    console.log(str);
}

//commom alert function
global._alert = function(obj){
   obj.title = (typeof obj.title == 'undefined' ? '<img src="img/alert.png" class="alert"/><b>Classgenie</b>' : ob.title);
   obj.dependency.alert({
     title: obj.title,
     template: obj.template
   });  
}
// common confirm function

global._showConfirm = function(obj) {
 // var confirmPopup = $ionicPopup.confirm({
     obj.title = (typeof obj.title == 'undefined' ? '<img src="img/alert.png" class="alert"/><b>Classgenie</b>' : ob.title)
     obj.dependency.confirm({
     title: obj.title,
     template: obj.template,
     buttons: [
      { text: 'OK',
        type: 'button-positive',
        onTap: function(e) {
         //console.log(1);
         return 1;
         }
     },
      {
        text: 'Cancel',
        type: 'button-positive',
        onTap: function(e) {
         return 0;
         //console.log(2);
        }
      }
    ]
   });  

   //   obj.dependency.response(function(res) {
   //   if(res) {
   //     console.log('You are sure');
   //   } else {
   //     console.log('You are not sure');
   //   }
   // });
}
   //});

 //   obj.dependency.showConfirm(function(res) {
 //     if(res) {
 //       return true;
 //     } else {
 //       return false;
 //     }
 //   });
 // }

//Execute when page init
$(document).ready(function(){
    try{      
    }
    catch(ex){}
});

//Load config
global.loadConfig = function(){
    try{  
         ajaxloader.async = false; 
         ajaxloader.load('json/config.json',function (resp){   
             global.config = $.parseJSON(resp); 
             ajaxloader.async = true;   
         });
     }
    catch(ex){}
}

//Function define add slashes 
global.addslashes = function(str) {
    str = str.replace(/\\/g, '\\\\');
    str = str.replace(/\'/g, '\\\'');
    str = str.replace(/\"/g, '\\"');
    str = str.replace(/\0/g, '\\0');
    return str;
}

//Function define strip slashes
global.stripslashes = function(str) {
    str = str.replace(/\\'/g, '\'');
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\0/g, '\0');
    str = str.replace(/\\\\/g, '\\');
    return str;
}

//Function return the current date
global.currenDate = function(){
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    var todayTime = new Date();
    var month = month[todayTime.getMonth()];
    var day = todayTime . getDate();
    var year = todayTime . getFullYear();
    return day + "-" + month + "-" + year;
}

//Function check network connection
global.checkNetworkConnection = function(dependency){
       if(window.Connection) {
            if(navigator.connection.type == Connection.NONE) {
                dependency.alert({
                    title: "Classgenie",
                    template: "The internet is disconnected on your device."
                })
                .then(function(result) {
                    if(!result) {
                        return false;
                    }
                });
            }
        }
}

//Genrate random function
global.randomNumber = function(){
   return Math.random();
}