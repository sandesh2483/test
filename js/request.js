"use strict";
(function(){
    APP.Request = {
		xmlhttp: null,
		
		getReqObj: function(){
			if(!this.xmlhttp){
				if (window.XMLHttpRequest){
					this.xmlhttp=new XMLHttpRequest();
				} else {
					this.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
				}
			}
			return;
		},
		
		get: function (method, url, callback, async, options){
			var method = method || 'GET',
				async = async || true,
				that = this;
			if (!url || url === '') return;
			
			this.getReqObj();
			
			this.xmlhttp.open(method,url,async);
			this.xmlhttp.send();
			
			this.xmlhttp.onreadystatechange = function(){
				if (that.xmlhttp.readyState==4 && that.xmlhttp.status==200) {
					callback(that.xmlhttp.responseText);
				}
			}
		}		
	}
})();

