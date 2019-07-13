var kids_list = angular.module('starter');
kids_list.controller('assignmentCtrl', ['$scope','$filter', '$location', '$window', '$http', '$state', '$ionicHistory', '$ionicModal', '$ionicPopover', '$ionicPopup', '$ionicLoading', function ($scope,$filter,$location, $window, $http, $state, $ionicHistory, $ionicModal, $ionicPopover, $ionicPopup, $ionicLoading) {

        
        loader.dependency = $ionicLoading;
        $scope.fromDate='';
        $scope.toDate='';
        $scope.pagecount = 1;
         var pagesShown = 1;
         var pageSize = 10;
        var student_no = Service_Store.getLocal('das_student_no');
        $scope.student_name="";
        $scope.class_name="";
        

        //var studentnumber = Service_Store.getLocal('studentnumber');
        $scope.pdfPath = global.config['file_url'] + global.config['image_path'] + 'assignment';
        Service_Store.setLocal('datetoken', 'thismonth');
        $scope.datanotFound='';         
        var hash = window.location.href.split('/').reverse();        
        $scope.class_id = hash[1];
        $scope.loadData = function () {

           //  var student_name = Service_Store.getLocal('student_name');
           // var class_name = Service_Store.getLocal('class_name');
            $scope.student_name = Service_Store.getLocal('student_name');
            $scope.class_name = Service_Store.getLocal('class_name');
            console.log( $scope.student_name+"hello ::"+$scope.class_name);
            ajaxloader.async = false;
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.load(global.config['api_url'] + '/parent/assignment/list?token=' + global.config['token'] + "&class_id=" + $scope.class_id+'&student_no='+student_no+'&fromDate=' + $scope.fromDate + '&toDate=' + $scope.toDate + '&page_number=' + $scope.pagecount, function (resp) {

                var res1 = $.parseJSON(resp);              

                $scope.status_value = res1.status;                
                if (res1.status == "Success")
                {
                    $scope.totalLength = res1.assignment_list.length;
                    if(res1.assignment_list.length > 0){ 
                    $scope.items = res1.assignment_list;
                    ajaxloader.async = true;
                }else{
                    $scope.totalLength = 0;
                }
                    
                } else {
                     
                        $scope.totalLength=0;
                    
                }
            });
        }


         $scope.itemsLimit = function() {
        return pageSize * pagesShown;
        };

        $scope.hasMoreItemsToShow = function() {
            return pagesShown < ($scope.items.length / pageSize);
        };

        $scope.showMoreItems = function() {
            pagesShown = pagesShown + 1;         
        };




        $scope.pagging = function () {           
            $scope.pagecount = $scope.pagecount + 1;
            $scope.loadData();

        }


        $scope.addClass = function(item){
        item = item.split('/');
        var currentDate11    = $filter('date')(item[0]+'-'+item[1]+'-'+item['2'], 'dd-MM-yyyy');
        var splt1 = currentDate11.split('-');         
        var currentDate    = $filter('date')(new Date(), 'yyyy-MM-dd');
        var splt2 = currentDate.split('-');
        var today = new Date();
        var tommarrow = $filter('date')(new Date(today.getTime() + (24 * 60 * 60 * 1000)), 'yyyy-MM-dd');
        var splt3 = tommarrow.split('-');
      
        var d1_submission_date = (new Date( splt1[2], splt1[1], splt1[0], 0, 0, 0, 0 )).getTime();
        var d1_current_date = (new Date( splt2[0], splt2[1], splt2[2], 0, 0, 0, 0 )).getTime(); 
        var d2_tomarrow = (new Date( splt3[0], splt3[1], splt3[2], 0, 0, 0, 0 )).getTime(); 
         if((d1_submission_date == d2_tomarrow) || (d1_submission_date ==d1_current_date)) { 
              return 'border_red';
         }else{
            return 'border_green';
         }
       }


        $scope.loadData();
       
       //  /* function for SEARCHING assignment list here.....................*/
        $scope.loadSearchData = function (fromDate,toDate) {
            $scope.fromDate = $filter('date')(fromDate, 'yyyy-MM-dd');            
            $scope.toDate = $filter('date')(toDate, 'yyyy-MM-dd'); 
             if(fromDate > toDate){
              global._alert({template: "End date should be greater than start date", dependency: $ionicPopup});
               return false;     
            }else{                    
            $scope.loadData();
        }
        }


        $scope.openPdf = function (attachment) { 
            $scope.myPdfUrl = $scope.pdfPath + '/' + attachment;
             $window.open( $scope.myPdfUrl, '_system', 'location=yes');
        }



        $scope.datediff = function () {
            var submission_date = '2016-11-25';
            var datec = $filter('date')(new Date(), 'yyyy-MM-dd');
            var date2 = new Date($scope.formatString(datec));
            var date1 = new Date($scope.formatString(submission_date));
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (diffDays >= 5 && diffDays <= 10) {
                return 'red-color';
            }

        }


        $scope.formatString = function (format) {
            var pieces = format.split('-'),
                    year = parseInt(pieces[0]),
                    month = parseInt(pieces[1]),
                    day = parseInt(pieces[2]),
                    date = new Date(year, month - 1, day);
            return date;
        }


    }]);






     