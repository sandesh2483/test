"use strict";
(function(){
    APP.Dom = {
        classHash: {},
        
        get: function (identifier){
            var fc,
                id;
            if (typeof identifier === undefined || identifier.length === 0) return;
            
            fc = identifier.substring(0,1);
            id = (fc === '#' || fc === '.')? identifier.slice(1) : identifier;
            
            if (fc === '#') {  //check if id
                return this.getById(id);
            } else if (fc === '.'){  // check if class
                //return this.getByClass(id);
            } else {
                return this.getByTag(id);
            }
        },
        
        getById: function (id) {
            return document.getElementById(id);
            
        },
        
        getByTag: function (id) {
            return document.getElementsByTagName(id);
        },
        
        getByClass: function (className) {
            //TBD
        },
        
        hasClass: function(el, className) {
            return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1;
        },
        
        addClass: function(el, className){
            if(this.hasClass(el, className)) return this;
            
            el.className = el.className + " " +className;
            return this;
        },
        
        removeClass: function(el, className){
            var parts = el.className.split(' '),
                length = parts.length,
                i,
                nc = "";
            
            for(i=0; i<length; i+=1){
                if (className != parts[i]) {
                    nc += parts[i] + " ";
                }
            }
            
          el.className = nc;
          return this;
            
        },
        
        removeNode: function(el){
            return el.parentElement.removeChild(el);
        },
        
        createElement: function (args){
            var node;
			if(args.tag && args.tag != ''){
                node = document.createElement(args.tag);
            }
            
			if(args.id){
                node.id = args.id;
            }
			
            if(args.className){
                node.className = args.className;
            }
            
            if(args.top){
                node.style.top = args.top + "px";
            }
            
            if(args.left){
                node.style.left = args.left + "px";
            }
			
			if(args.text){
				node.innerHTML = args.text;
			}
			
			if(args.src){
				node.src = args.src;
			}
			
			if(args.href){
				node.href = args.href;
			}
            
            return node;
        }
    }
})();
