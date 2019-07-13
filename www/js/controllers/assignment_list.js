var create_assignment = angular.module('starter');

create_assignment.filter('dateRange', function() {
    return function(input, fromDate, toDate) {
        
        var retArray = [];
        
        angular.forEach(input, function(obj){
            var receivedDate = obj.created_at;
            if(receivedDate >= fromDate && receivedDate <= toDate) {
                retArray.push(obj);         
            }
        }); 
        
        return retArray; 
    };
});

create_assignment.controller('assignmentListCtrl', ['$scope', '$filter', '$location', '$window', '$ionicModal', '$state', '$ionicPopup', '$ionicLoading', '$cordovaToast', '$cordovaFileTransfer', '$cordovaCamera', '$ionicPlatform','$cordovaFileOpener2', function ($scope, $filter, $location, $window, $ionicModal, $state, $ionicPopup, $ionicLoading, $cordovaToast, $cordovaFileTransfer, $cordovaCamera, $ionicPlatform,$cordovaFileOpener2) {
        loader.dependency = $ionicLoading;
        var stored_classId = Service_Store.getLocal('das_classid');
        var classname = Service_Store.getLocal('das_classname');
        $scope.fromDate='';
        $scope.toDate='';
        $scope.pagecount = 1;
        var member_no = Service_Store.getLocal('das_member_no');
        $scope.pdfPath = global.config['file_url'] + global.config['image_path'] + 'assignment';
         var filename1 = "";
         var pagesShown = 1;
         var pageSize = 10;
         
         /*function for assignment list here.........................*/

        loadData = function () {            
            $scope.classname = classname;
            global.checkNetworkConnection($ionicPopup);
            ajaxloader.load(global.config['api_url'] + '/assignment/list?token=' + Service_Store.getLocal('app_token')+'&class_id='+stored_classId+'&fromDate='+$scope.fromDate+'&toDate='+$scope.toDate+'&page_number='+$scope.pagecount+"&title="/*+$scope.classname*/, function (resp)
            {
                var resp = JSON.parse(resp);

                $scope.status_val = resp.assignment_list.length;                
                if (resp.status == "Success")
                {
                    $scope.datanotfound=false;
                    $scope.listsize = resp.assignment_list.length;
                    if ($scope.listsize > 0) {
                        $scope.datanotfound=false;
                        $scope.items = resp.assignment_list;
                        $scope.totalCount = resp.total_submit_count;
                        $scope.submittedCount = resp.total_student_submit_count;
                        $scope.listsize = $scope.items.length;
                    } else {
                           $scope.datanotfound=true;
                           $scope.items="";
                    }

                } else
                {
                     $scope.datanotfound=true;
                     $scope.items="";
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

       

        $scope.editAssignment = function(item){
        Service_Store.setLocal('assignment_edit_data',JSON.stringify(item));
            $state.go('editAassignment'); 
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

        $scope.pagging = function () {
            $scope.pagecount = $scope.pagecount + 1;
            loadData();
        }
        
        

        /* function for SEARCHING assignment list here.....................*/
         $scope.loadSearchData = function (fromDate,toDate) {
            $scope.fromDate = $filter('date')(fromDate, 'yyyy-MM-dd');            
          $scope.toDate = $filter('date')(toDate, 'yyyy-MM-dd'); 
             if(fromDate > toDate){
              global._alert({template: "End date should be greater than start date", dependency: $ionicPopup});
               return false;     
            }else{                    
            loadData();
        }
        } 

        loadData();

        
        $scope.create_assignment = function () {
            $state.go('create_assignment');
        }


        /* function for submit assignment list here.....................*/
        $scope.submitted_assignment_list = function (item) {
            Service_Store.setLocal('assignmentId', item);
            //$state.go('submitted_assignment_list');
            $window.location.href = '#submitted_assignment_list';
        }

        $scope.modalPopClose = function () {
            $scope.modal.hide();
        }

        /* function for delete assignment here.....................*/
        $scope.removeAssignment = function (item) {            
             var confirmPopup = $ionicPopup.confirm({
             title: 'Delete assignment',
             template: 'Are you sure you want to delete?',
             });

            confirmPopup.then(function(res) {
                
            if (res == true) {                
                  var assignmentNo = item;
                    ajaxloader.loadURL(global.config['api_url'] + '/assignment/delete?token=' + Service_Store.getLocal('app_token'),
                            {
                                id: assignmentNo
                            }, $scope.removeResponse);

              }

           });              
        };
        /**
         *Response from ajax
         *@params resp
         */
        $scope.removeResponse = function (resp) { 
          
            if (resp['status'] == "Success")
            {
            loadData();   
            } else if (resp.error_code == 1) {            
            global._alert({template: 'Assignment not deleted', dependency: $ionicPopup});
            } else
            {
                global._alert({template: 'error occure', dependency: $ionicPopup});
            }
       
        }



        /*function to send notifications*/

        $scope.send_notifications = function (item) {             
            Service_Store.setLocal('assignmentId', item);
            $window.location.href = "#notifications";
        }



        $scope.backPage = function () {
            $window.location.href = '#/tab/'+stored_classId+'/classroom';
        };


        $scope.openPdf = function (attachemet) {
             $scope.myPdfUrl = $scope.pdfPath + '/' + attachemet;
             $window.open( $scope.myPdfUrl, '_system', 'location=yes'); 
        }
        /* function for edit assignment data by id here.....................*/
        $scope.edit = function (item) {
            $scope.date = $filter("date")(Date.now(), 'yyyy-MM-dd');
            // //console.log($scope.date);
            // if(item.total_student_submit_count != 0)
            // {
            //      global._alert({template: 'cannot edit', dependency:$ionicPopup});
            //     return;
               
            // }
            $scope.aid = item.id;
            var assignmentNo = item.id;
            var description = item.description;
            var title = item.title;
            var submition_date =item.submition_date;
            var member_no = item.member_no;
            ajaxloader.async = false;
            var res = ajaxloader.load(global.config['api_url'] + '/assignment/assignmentListById?token=' + Service_Store.getLocal('app_token') + '&assignmentId=' + assignmentNo + '&class_id=' + stored_classId+'&description='+description+'&title='+title+'&submition_date='+submition_date+'&member_no='+member_no+'&sender_ac_no='+member_no,
                    function (resp) {
                       // console.log(resp);
                        ajaxloader.async = true;
                        var res1 = $.parseJSON(resp);
                        //console.log("date in res1:::"+ res1);
                        if (res1['status'] == "Success")
                        {
                           $scope.submitionDate = "2011-01-13";
                            // $ionicModal.fromTemplateUrl('templates/assignment_edit.html', {
                            //     scope: $scope,
                            //     animation: 'slide-in-up',
                            // }).then(function (modal) {
                            //     $scope.modal = modal;
                            //     $scope.title = res1.assignment_list[0]['title'];
                            //     $scope.description = res1.assignment_list[0]['description'];
                            //     $scope.submitionDate = res1.assignment_list[0]['submition_date']; 
                            //      var arrval = $scope.submitionDate.split('/');
                                 
                            //      var origval = arrval[2]+'-'+arrval[1]+'-'+arrval[0]; 
                            //      console.log(origval);
                            //     $scope.submitionDate = origval;
                            //     // $('#submit_date').html(origval);
                            //    // console.log($scope.submitionDate);                                                             
                            //     $scope.submission_date1 = new Date(res1.assignment_list[0]['submition_date']);
                            //     //console.log($scope.submission_date);
                            //     //$('#submit_date').val(res1.assignment_list[0]['submition_date']); 
                            //     //console.log("date in edit"+res1.assignment_list[0]['submition_date']);
                            //     $scope.assignment_url=res1.assignment_list[0]['attachment'];
                            //     $scope.modal.show();
                            // });
                        } else if (resp.error_code == 1) {

                            global._alert({template: resp.error_msg, dependency: $ionicPopup});

                        } else
                        {
                            global._alert({template: resp['comments'], dependency: $ionicPopup});
                        }
                    });

           
}
        
       

    }]);