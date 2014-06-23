"use strict";
(function(){
    APP.Events = {
        on: function(elem, evtType, callback, capture){
            var c,
                el = (typeof elem === "object")? elem : APP.Dom.get(elem),
                i,
                x;
                
            if (!el) return;
            if (el.addEventListener) {
                c = (capture)? capture : false;
                el.addEventListener(evtType, callback, c);
            } else if (el.attachEvent) {
                el.attachEvent('on'+evtType, callback);
            }
        },
        
        removeEvent: function (elem, evtType, fn){
            var el = (typeof elem === "object")? elem : APP.Dom.get(elem);
            
            if (el.removeEventListener){
                el.removeEventListener(evtType,fn,false);
            } else if (el.detachEvent) {
                el.detachEvent('on'+evtType,fn);
            }
        },
        
        stopPropogation: function(e){
            (e.stopPropagation) ? e.stopPropagation : e.cancelBubble = true;
        },
        
        preventDefault: function(e){
            (e.preventDefault) ? e.preventDefault() : e.returnValue = false;
        }

    }
})();

