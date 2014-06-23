"use strict";
var APP = APP || {};

APP.namespace = function (ns_string){
    var parts = ns_string.split('.'),
        parent = APP,
        parts_length = parts.length,
        i;
    
    if (parts[0] === "APP") {
        parts = parts.slice(1);
    }
    for (i=0; i< parts_length; i+=1) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
}

APP.domReadyFlag = false;

APP.init = function (){

}

function init(){
    if (APP.domReadyFlag) return;
    if (typeof domReady === 'function') {
        APP.domReadyFlag = true;
        domReady.call(window);
    }
}

(function (){
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', init, false);
    }
    
    document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
    var script = document.getElementById("__ie_onload");
    script.onreadystatechange = function() {
        if (this.readyState == "complete") {
            init();
        }
    };
    
    /* for Safari */
    if (/WebKit/i.test(navigator.userAgent)) { // sniff
      var _timer = setInterval(function() {
        if (/loaded|complete/.test(document.readyState)) {
           init();
        }
      }, 10);
    }
    
    /* for other browsers */
    window.onload =  init;

})();
