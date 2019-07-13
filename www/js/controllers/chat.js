//Define global variable
var timer=60000*2;
var classmessage = angular.module('starter');
var sender_ac_no, sender_name, receiver_ac_no, receiver_name, ionicPopup;
/**
 * Define the chat controller
 */
classmessage.controller('chatCtrl',['$scope','$window', '$location', '$interval', '$timeout', '$ionicScrollDelegate', '$ionicPopup', '$cordovaCamera', '$cordovaFileTransfer', '$cordovaCapture', '$compile','$ionicLoading' ,'$cordovaToast', function($scope, $window, $location, $interval, $timeout, $ionicScrollDelegate, $ionicPopup, $cordovaCamera, $cordovaFileTransfer, $cordovaCapture, $compile,$ionicLoading,$cordovaToast){
	   loader.dependency = $ionicLoading;
	   ionicPopup = $ionicPopup;
	   sender_ac_no = $.trim(Service_Store.getLocal('das_member_no'));
	   if(Service_Store.getLocal('parentdata')){
		  sender_name = $.trim($.parseJSON(Service_Store.getLocal('parentdata'))[0]['name']);
	   }
	   $scope.class_id =  $.trim(Service_Store.getLocal('das_classid'));
	   $scope.member_no = $location.path().split('/')[1];
	   $scope.message = "";
	   $scope.page_number = 1;
	   $scope.socket = io.connect(global.config['chatting_url'], {'force new connection':true}); 
       //Show emotion list
       $scope.showEmotionList = function(){
           showEmotionList($scope, $ionicPopup);   
       }

       //Show picture popup
       $scope.showPicturePopup=function(){
            showPicturePopup($scope, $ionicPopup, $cordovaCamera, $cordovaCapture);
        }
       
       //Execute on page load
       $scope.load_page_init = function(){
       	       $scope.load_pager_init = true;
	       	   if(/^-?[0-9]+$/.test($scope.member_no)){  //Execute block on single chat
		   	    //Check teacher or parent login
		        if(sender_ac_no.substr(0,1) == 2){
			   	    $scope.parent_id = $scope.member_no;
			   		$scope.teacher_id = sender_ac_no;
			    }
			    else
			    {
			       $scope.class_id =  $.trim(Service_Store.getLocal('chat_classid'));
			   	   $scope.teacher_id = $scope.member_no;
			   	   $scope.parent_id = sender_ac_no;
			    }
			    updateNotification(sender_ac_no, $scope.member_no, $scope.class_id); //update notification 
		   	    ajaxloader.async = false;
		   		ajaxloader.load(global.config['api_url']+'/parent/search?token='+Service_Store.getLocal('app_token')+'&member_no='+$scope.member_no, function(resp){
		             var resp = $.parseJSON(resp);
		             receiver_ac_no = $scope.member_no;
		            /* $scope.Name = receiver_name = resp['user_list'][0]['name'];
		             $scope.Name += (sender_ac_no.substr(0,1) == 2 ? '('+ Service_Store.getLocal('message_account_name')+' Parent)' : '');*/
		             receiver_name = resp['user_list'][0]['name'];
		             $scope.Name = 'Message';
		             ajaxloader.async = true;
		        });
		   	   loadMessages({teacher_id:$scope.teacher_id, parent_id:$scope.parent_id}, {timeout:$timeout, ionicScrollDelegate:$ionicScrollDelegate, scope:$scope, compile:$compile});
		   }
		   else   // Execute block on all 	   
	       {
		       	  $scope.Name = "All Parents";
		       	  $scope.teacher_id = sender_ac_no; //teacher equal to sender account no.
		       	  var parent_ac_nos = '', receiver_names='', receiver_ac_nos='';
		       	  global.checkNetworkConnection(ionicPopup);
		       	  ajaxloader.async = false;
		       	  //Collect all parent list
		       	  ajaxloader.load(global.config['api_url']+'/studentmessagelist?token='+Service_Store.getLocal('app_token')+'&class_id='+$scope.member_no+'&source=chat&sort_by=A', function(resp){
		               ajaxloader.async = true;
		               var resp = $.parseJSON(resp);
		               $.each(resp['user_list'], function (index, value){
		                	 if(value.parent_ac_no != '0'){
					 	          parent_ac_nos += ','+value.parent_ac_no;
					 	          receiver_names += ','+value.parent_detail.name;
					 	          receiver_ac_nos += ','+value.parent_ac_no;
				 	         }  	
		                });
		               if(parent_ac_nos != ''){
		               	  $scope.parent_id = parent_ac_nos.substring(1);
		               	  receiver_name = receiver_names.substring(1);
		               	  receiver_ac_no = receiver_ac_nos.substring(1);
		               	  loadMessages({teacher_id:sender_ac_no, parent_id:$scope.parent_id}, {timeout:$timeout, ionicScrollDelegate:$ionicScrollDelegate, scope:$scope, compile:$compile});
		               }
		               else
		               {
		               	  $scope.parent_id = '';
		               }
		       	  });
		   }
       }
	   $scope.load_page_init();

        //Exectue in case of pagination
        $scope.loadPreviousData = function(){
            $scope.page_number++;
            if(/^-?[0-9]+$/.test($scope.member_no)){
                loadMessages({teacher_id:$scope.teacher_id, parent_id:$scope.parent_id}, {scope:$scope, compile:$compile, pagination:true});
            }
            else
            {
            	loadMessages({teacher_id:sender_ac_no, parent_id:$scope.parent_id}, {scope:$scope, compile:$compile, pagination:true});
            }
        }

        
	   /**
	    * Send message
	    */
	    $scope.sendMessageInit = function(source){
	    	 if(/^-?[0-9]+$/.test($scope.member_no)){
             	$scope.socket.emit('message', {teacher_id:$scope.teacher_id,parent_id:$scope.parent_id,message:$scope.message});
                if(source == 1){  //source 1 means for image or video
                      $scope.updateDBMedia($scope.teacher_id, $scope.parent_id, {teacher_id:$scope.teacher_id, parent_id:$scope.parent_id, timeout:$timeout, ionicScrollDelegate:$ionicScrollDelegate});
                }
                else
                {
			 	      updateDB($scope.teacher_id, $scope.parent_id ,$scope.message, {teacher_id:$scope.teacher_id, parent_id:$scope.parent_id, timeout:$timeout, ionicScrollDelegate:$ionicScrollDelegate, scope:$scope, compile:$compile});
			 	}
			 	$scope.socket.emit('new user', {member_no: sender_ac_no, source:'chatting'}); //Execute for notification
			 }
			 else  //Block execute in case of all parent
			 {
			 	 if(source == 1){ //source 1 means for image or video
			 	       $scope.updateDBMedia(sender_ac_no, $scope.parent_id, {teacher_id:sender_ac_no, parent_id:$scope.parent_id, timeout:$timeout, ionicScrollDelegate:$ionicScrollDelegate});  
			 	 }
			 	 else
			 	 {
			 	       updateDB(sender_ac_no, $scope.parent_id ,$scope.message, {teacher_id:sender_ac_no, parent_id:$scope.parent_id, timeout:$timeout, ionicScrollDelegate:$ionicScrollDelegate, scope:$scope, compile:$compile});
			 	 }
			 }
			 $scope.message = "";
	    }
        
        //Execute on message textbox
	    $scope.sendMessage = function(keyEvent){
	        if(keyEvent.which === 13){
			   $scope.sendMessageInit();
			}
	    }
        
        //Execute on button click
	    $scope._sendMessage = function(){
	    	if($scope.message == '')
	    	{
	    		window.plugins.toast.show("message text can't be blank", 'short', 'center');
	    		return;
	    	}else{
	        $scope.sendMessageInit();
	    }
	}
        
        //Call from server
	    $scope.socket.on('push message', function(response){
	    	if((sender_ac_no == response.teacher_id || sender_ac_no == response.parent_id) && $scope.Name != 'All Parents'){
		       loadMessages(response, {timeout:$timeout, ionicScrollDelegate:$ionicScrollDelegate, scope:$scope, compile:$compile});
		    }
		});
        
        //Run on every 120 second
		/*$scope.message_timer = $interval(function(){
		   loadMessages({teacher_id:$scope.teacher_id, parent_id:$scope.parent_id}, {timeout:$timeout, ionicScrollDelegate:$ionicScrollDelegate, scope:$scope, compile:$compile});
		}, timer);*/

		$scope.backFromChat = function(){
			$scope.clearAll();
			if(sender_ac_no.substr(0,1) == 3){
				 $window.location.href = "#/home/parent_messages";
			}
			else
			{
				$window.location.href = "#/tab/"+$scope.class_id+"/messages";
			}
		} 
        
        //Call on unload the page
		$scope.$on('$destroy', function() {
		    $scope.clearAll();
		}); 

		$scope.clearAll = function (){
			$scope.socket.disconnect();
		    //$interval.cancel($scope.message_timer);
		}

       //updateDBMedia function
       $scope.updateDBMedia = function(teacher_id, parent_id, obj){
       	       $scope.page_number = 1;  //On Upload initialize page_number
       	       $scope.load_pager_init = true;
       	       var arr_media = $scope.message.split('.');
       	       var ext = arr_media.slice(-1)[0];
               var options = new FileUploadOptions();
			   options.fileKey = "message";
			   options.fileName = "media."+ext;
			   options.mimeType = (ext == 'mp4' || ext == '3gp' ? "video": "image") +"/"+ext;
               var params = new Object();
	           params.teacher_id = teacher_id;
	           params.parent_id = parent_id;
	           params.sender_name = sender_name;
	           params.receiver_name = receiver_name;
	           params.sender_ac_no = sender_ac_no;
	           params.receiver_ac_no = receiver_ac_no;
	           params.class_id = $scope.class_id;
	           if(/^-?[0-9]+$/.test($scope.member_no))
				   params.source_init = '';
			   else
				   params.source_init = 'all';
	           options.params = params;
	           options.chunkedMode = false;
	           $cordovaFileTransfer.upload(global.config['api_url']+'/teacher/chat_media?token='+Service_Store.getLocal('app_token')+'&time='+Math.random(), $scope.message, options).then(function (result) {
	                    $scope.progressBar.close();
	                    loadMessages({teacher_id:obj.teacher_id, parent_id:obj.parent_id}, {timeout:obj.timeout, ionicScrollDelegate:obj.ionicScrollDelegate, scope:$scope, compile:$compile});
	                 }, function (err) {
	                  alert("ERROR: " + JSON.stringify(err));
	               }, function (progress) {
	                     $timeout(function () {
			          		  $scope.uploadProgress = Math.floor(progress.loaded / progress.total * 100);
			          		  $('#myProgress').val($scope.uploadProgress);
			        	 });
	             });
	    }

 }]);


  /** 
   * Load message function
   */
  loadMessages = function(response, objdependency){
  	  var el = '';
  	  global.checkNetworkConnection(ionicPopup);
  	  var url = global.config['api_url']+'/teacher/chat?token='+Service_Store.getLocal('app_token')+'&teacher_id='+response.teacher_id+'&parent_id='+response.parent_id+'&class_id='+objdependency.scope.class_id+'&page_number='+objdependency.scope.page_number;
  	  if(objdependency.scope.Name == 'All Parents'){
  	  	 url += '&source_init=all';
  	  }
      ajaxloader.load(url, function(resp){
                   var resp = $.parseJSON(resp);
                   if(objdependency.scope.page_number == 1){ //On Page Load
                      $('.message_chat').html('');
                   }
				   if(resp.length>0){
				       $.each(resp, function (index, value){
				       	   var _message = value.message;
				       	   if(value.message.indexOf('image#$#')>-1){
				       	      var msg = value.message.split('#$#');
				       	      value.message="<img src='"+global.config['file_url']+"assets/"+"chat/"+msg[1]+"'>";
				       	   }
				       	   if(value.message.indexOf('video#$#')>-1){
				       	      var msg = value.message.split('#$#');
				       	      var arr_video = msg[1].split('.');
				       	      value.message='<video controls="controls"><source src="'+global.config['file_url']+'assets/chat/'+msg[1]+'" type="video/'+arr_video[1]+'" /></video>';
				       	   }
				       	   if(value.message.indexOf('emotion_image')>-1){
				       	   	   var msg = value.message.split('~');
				       	   	   value.message="<img src='"+global.config['file_url']+"assets/"+"chaticon/"+msg[1]+"' class='bubble_icon'>";
				       	   }
				       	   if($.trim(value.sender_ac_no) == sender_ac_no){
				       	   	  el = objdependency.compile('<div class="chat-bubble new_right"><div class="ion-close new_icon" ng-click="removeChat(\''+value._id+'\',\''+global.addslashes(_message)+'\',\''+value.receiver_ac_no+'\')"></div><div class="message">'+value.message+'</div><div class="message-detail"><span>'+value.sender_name+'</span>, <span data-livestamp="'+value.created_at+'" class="msg-rhs"></span></div></div>')(objdependency.scope);
				       	   }
					       else 
					       {
					       	  el = objdependency.compile('<div class="chat-bubble left"><div class="message ng-binding">'+value.message+'</div><div class="message-detail"><span class="bold ng-binding">'+value.sender_name+'</span>,<span data-livestamp="'+value.created_at+'" class="msg-rhs"></span></div></div>')(objdependency.scope);
					       }
					       if(!objdependency.pagination){
					          $('.message_chat').append(el);	
					       }
					       else
					       {
					       	  $('.message_chat').prepend(el);
					       }
					   });
					   if(!objdependency.pagination){ //Execute in default not in pagination
						    objdependency.timeout(function(){
							     objdependency.ionicScrollDelegate.scrollBottom(true);
						    }); 
					    }
					    if(objdependency.scope.load_pager_init){   //Execute in case of page load
                            if($('.message_chat .chat-bubble').length >= global.config.page_size){
                                //$('#Pagination').show();
                            if(resp.length > 19){
                                $('#Pagination').show();
                            }else{                            	 
                            $('#Pagination').hide();	
                            }



                            }
                            else
                            {
                            	$('#Pagination').hide();
                            }
					    }
			       }
			       else
			       {
			       	  if(objdependency.pagination){ //Check if pagination click
			       	      $('#Pagination').hide();
			       	  }
			       }
           });

        //Remove chat content
		objdependency.scope.removeChat = function(objectid, message, receiver_ac_no){
			   if(typeof objdependency.scope.page_number != 'undefined')
			      objdependency.scope.page_number = 1;
			   global.checkNetworkConnection(ionicPopup);
               ajaxloader.async = false;
	           ajaxloader.loadURL(global.config['api_url']+'/teacher/remove_chat?token='+Service_Store.getLocal('app_token')+'&time='+Math.random(), {
	                objectid: objectid,
	                message: message,
	                receiver_ac_no:receiver_ac_no
	             }, function(resp){
	                  ajaxloader.async = true;
					  if(resp['message'] == 1){
					  	  objdependency.scope.load_page_init();
					  }
	            });
		 }
     }

     /**
      * updateDB function
      */
     updateDB = function(teacher_id, parent_id, message, obj){
     	     var source_init;
             if(typeof obj.scope.page_number != 'undefined'){
			      obj.scope.page_number = 1;
			      obj.scope.load_pager_init = true;
             }
             if(/^-?[0-9]+$/.test(obj.scope.member_no))
             	source_init = '';
             else
                source_init = 'all';
             global.checkNetworkConnection(ionicPopup);
     	     ajaxloader.async = false;
			 ajaxloader.loadURL(global.config['api_url']+'/teacher/chat?token='+Service_Store.getLocal('app_token')+'&time='+Math.random(), {
				  	teacher_id:teacher_id,
				  	parent_id:parent_id,
				  	message:message,
				  	sender_name: sender_name,
				  	receiver_name: receiver_name,
				  	sender_ac_no: sender_ac_no,
				  	receiver_ac_no: receiver_ac_no,
				    class_id: obj.scope.class_id,
				    source_init:source_init 
				}, function(resp){
					ajaxloader.async = true;
					if(resp['message'] == 1){
                        loadMessages({teacher_id:obj.teacher_id, parent_id:obj.parent_id}, {timeout:obj.timeout, ionicScrollDelegate:obj.ionicScrollDelegate, scope:obj.scope, compile:obj.compile});
					}
			 });
	  }

      /**
      * update notification
      */
	  updateNotification = function(member_no, sender_ac_no, class_id){
	  	     global.checkNetworkConnection(ionicPopup);
             ajaxloader.async = false;
			 ajaxloader.loadURL(global.config['api_url']+'/teacher/update_chat?token='+Service_Store.getLocal('app_token')+'&time='+Math.random(), {
				  	member_no: member_no,
				  	sender_ac_no: sender_ac_no,
				  	class_id: class_id
				}, function(resp){
				    ajaxloader.async = true;
			 });
	  }

	  /**
	   * Show emotion list
	   */
	   showEmotionList = function($scope, $ionicPopup){
            ajaxloader.async = false;
            var output = '';
			ajaxloader.load(global.config['api_url']+'/classlist/chaticon?token='+Service_Store.getLocal('app_token'),function(resp){
			       ajaxloader.async = true;
			       mylist_data = $.parseJSON(resp);
        		   $.each(mylist_data, function(index, val){
                        var imagePath=global.config['file_url']+"assets/"+"chaticon/"+val.value;
						output+='<img ng-src='+imagePath+' ng-click="setImage(\''+val.value+'\')" />'
        		   });
			});

			// A popup dialog for select the class icon
		    var myPopup = $ionicPopup.show({
			      template: output,
			      title: 'Choose Message Icon',
			      subTitle: '',
			      scope: $scope,
			      buttons: [{ 
			        text: 'Close',
			        type: 'button-default'
			        }]
		      });

		    $scope.setImage = function(image_name){
                 $scope.message = 'emotion_image~'+image_name;
                 $scope.sendMessageInit();
                 myPopup.close();
		    }
	   }

      /**
	   * Show picture popup
	   */
	   showPicturePopup = function($scope, $ionicPopup, $cordovaCamera, $cordovaCapture){
			  var myPopup = $ionicPopup.show({
				  template: '<button class="button button-full button-assertive" ng-click="takePhoto(1)">Take Photo</button>'
				  +'<button class="button button-full button-assertive" ng-click="takePhoto(2)">Choose Photo</button>'
				  +'<button class="button button-full button-assertive" ng-click="recordVideo()">Record video</button>',
				  title: 'Select Picture',
				  subTitle: '',
				  scope: $scope,
			      buttons: [{ 
			         text: 'Close',
			         type: 'button-default'
			      }]
			});

	     $scope.takePhoto = function(type){
	   	     var options = {
			    quality: 75,
			    destinationType: Camera.DestinationType.FILE_URI,
			    sourceType: (type == 1 ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY),
			    allowEdit: true,
			    encodingType: Camera.EncodingType.JPEG,
			    targetWidth: 300,
			    targetHeight: 300,
			    popoverOptions: CameraPopoverOptions,
			    saveToPhotoAlbum: (type == 1 ? true : false)
			  };
			  $cordovaCamera.getPicture(options).then(function (imageData) {
				  $scope.message = imageData;
				  if($scope.message.indexOf('?')>-1){
				  	 $scope.message = $scope.message.substring(0, $scope.message.indexOf('?'));
				  }
                  $scope.sendMessageInit(1);
			      myPopup.close();
			      $scope.progressPopup();
			  }, function (err) {
			 });
	    }

	    $scope.recordVideo = function(){
	        var options = {
	             limit: 1,
	             duration: 30
	          };
	        $cordovaCapture.captureVideo(options).then(function(videoData) {
	                var file_path = videoData[0].fullPath;
					$scope.message = file_path;  
					$scope.sendMessageInit(1);
			        myPopup.close(); 	 
			        $scope.progressPopup();
        	   }, function(err) {
		    });
	    }

	    $scope.progressPopup = function(){
             $scope.progressBar = $ionicPopup.show({
				  template: '<progress id="myProgress" max="100" value="0"></progress>',
				  title: 'Uploading...',
				  subTitle: '',
				  scope: $scope,
				   buttons: [
                     { text: 'Close' }
                   ]
			});	    	
	    }
	}