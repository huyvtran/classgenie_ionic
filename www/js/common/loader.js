var loader = {
	  loaderblock:'',
	  block:'body',
	  position:'middle',
	  mode:'inline',
	  dependency: '',
	  init:function (){
	  	   
	 //    block = $(loader.block);
	 //    var _w = block.width();
	 //    var _h = block.height();
	 //    if(loader.mode == 'inline'){
	 //      var _p = ObjectPosition(block[0]);
	 //      _p.top = _p.top + 250;
	 //    }
	 //    else
	 //      var _p = {left:0,top:0};
	 //    var pfooter = $(document).scrollTop()+$(window).height();
		// if(_h > (pfooter - _p.top)){
		// 	_h = pfooter - _p.top;
		// }
		// if($(block).has($('#ajaxloader')).length == 0){
		//    loader.loaderblock = $('<table id="ajaxloader"><tr><td id="loadertd" valign="'+loader.position+'" align="center"><img class="loaderimg" src="img/loader_new.gif" /></td></tr></table>').css({'opacity':'1.0','height':_h,'width':_w,'vertical-align':'middle','position':'absolute','left':_p.left,top:_p.top,'z-index':1051}).appendTo(block);
  //          $('#loadertd').css({'height':_h,'width':_w});
		// }
        if(!loader.dependency){
           return '';
        }
        else
        {
			 loader.dependency.show({
	            template: '<ion-spinner icon="android"></ion-spinner>'
	         });
	     }
	  },
	  close:function(){
		 //loader.loaderblock.remove()
		  if(!loader.dependency){
	           return '';
	       }
	       else
	       {
			  loader.dependency.hide();
		   }
	  }
 } 

 function ObjectPosition(obj) {
    var curleft = 0;
      var curtop = 0;
      if (obj.offsetParent) {
            do {
                  curleft += obj.offsetLeft;
                  curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
      }
      return {left:curleft,top:curtop};
}