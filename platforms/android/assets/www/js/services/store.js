var Service_Store = new function() {

   this.setLocal = function(key, value) {
   
	   try{
		   window.localStorage.setItem(key, value);
	   }catch(e){
		   
		   window.localStorage.setItem(key, null);
	   }
	   
    },

    this.getLocal = function(key) {
    	
        try {        	
            return window.localStorage.getItem(key);
            
        }catch(e) {
        	
        	return null;
        }
    },

    this.removeKey = function(key){
        try {      
            window.localStorage.removeItem(key);
         }catch(e){}
    },

    this.clearAll = function(){
         try {      
             localStorage.clear();
         }catch(e){}
    }
}


var Service_Baseurl = new function (){
	 this.getBaseURL = function () {
		   return window.location.protocol + "//" + window.location.hostname + (window.location.port && ":" + window.location.port) + "/";
		}
}