"use strict";
(function(){
    APP.Search = {
		responseData: null,
		loaded:0,
		numItems:10,
		maxItems:10,
		expires: 'expires=Wed, 31 Dec 2014 12:00:00 GMT',
		init : function(){
			var event = APP.Events,
				that = this,
				el = document.getElementsByTagName('html')[0],
				dom = APP.Dom;
				
			event.on('#search-btn', 'click', function(e){
				that.searchHandler(e);
			});
			
			event.on('#search-text', 'keyup', function(e){
				if(e.keyCode == 13){
					that.searchHandler(e);
				}
			});
			
			event.on(document, 'scroll', function(e){
				if (el.scrollHeight - el.scrollTop < 1000){ 
					that.appendResults('loadmore');
				}
			});
			
			event.on('#results', 'click', function(e){
				if(dom.hasClass(e.target, 'link')){
					return;
				}
				
				event.preventDefault(e);
				var target = e.target,
					id = target.id;
				if (dom.hasClass(target, 'details')){
					if(!dom.get('#details-content-'+id)){
						dom.addClass(target, 'show-details');
						that.getDetails(target.id);
					} else {
						that.showHideDetails(target);
					}
				} else if(dom.hasClass(target, 'fav')){
					id = id.replace('fav-','');
					if(dom.hasClass(target, 'active')){
						dom.removeClass(target,'active').addClass(target,'inactive');
						that.removeFav(id);
					} else {
						dom.removeClass(target,'inactive').addClass(target,'active');
						that.addFav(id);
					}
				}
				
			});
			
		},
		addFav: function(id){
			var c = this.getCookie('fav');
			
			if(c!==''){
				c += ',';
			}
			
			c += id;
			this.setCookie('fav', c);
			
		},
		
		removeFav: function(id){
			var c = this.getCookie('fav'),
				l,i,n;
			if (c !== ''){
				c = c.split(',');
				l = c.length;
				for(i=0; i<l; i++){
					if(c[i] === id){
						 c[i] = '-1';
					}
				}
				n = c.join();
			}
			
			this.setCookie('fav', n);
		},
		
		setCookie: function(name, val){
			document.cookie = name+"="+ val + "; " +this.expires; 
			return;
		},
		
		getCookie: function(name){
			var c = document.cookie.split(';'),
				i,
				len = c.length,
				x;
			
			for(i=0; i<len; i++){
				if (c[i].indexOf(name+'=') >= 0 ){
					return (c[i].split("=")[1]);
				}
			}
			
	
			
			return '';
			
		},
		searchHandler: function (e){
			var event = APP.Events,
				request = APP.Request,
				dom = APP.Dom,
				q,
				that = this;
			
			event.preventDefault(e);
			q = APP.Dom.get('#search-text').value;
			if (q.trim() === ''){
				alert('Please enter a valid search term!!');
				return;
			}
			
			this.addSpiner('#results');
			var url = 'https://graph.facebook.com/search?q=' + q + '&type=page&access_token=663863887040402|f6b8036c5a85631a6c232f3918b6014f';
			
			request.get('GET', url, function(data){
				var data = JSON.parse(data);
				that.loaded = 0;
				that.numItems = that.maxItems;
				
				data.data.sort(function (a, b) {
					if (a.name < b.name){
					  return 1;
					}
					
					if (a.name > b.name){
					  return -1;
					}
					
					return 0;
				});
				that.responseData = data;
				that.appendResults();
			});
		},
		
		appendResults : function(loadmore){
			var response = this.responseData,
			dom =  APP.Dom,
			result = dom.get('#results'),
			docFrag,
			length = response.data.length,
			i,
			nodes,
			row,
			that = this,
			resultContent = null,
			l=1;
			if (!loadmore){
				this.removeSpiner('#results');
			}
			
			resultContent = dom.get('#resultContent');
			if(!resultContent){
				resultContent = dom.createElement({tag: 'div', className: 'resultContent', id: 'resultContent'});
			}
			if (length <= 0){
				row = dom.createElement({tag: 'div', text: 'Sorry, we couldnt find any results for this search', className: 'error'});
				resultContent.appendChild(row);
			} else {
				this.numItems = (this.numItems > length) ? length : this.numItems;
				
				for (i=this.loaded; i< this.numItems; i++) { 
					row = this.createResultRow(response.data[i]);
					resultContent.appendChild(row);
					l++;
				}
				this.loaded = this.loaded + l;
				this.numItems =  this.numItems + this.maxItems;
				
			}
			
			
			
			result.appendChild(resultContent);
			
			
		},
		
		showHideDetails: function(el){
			var id = el.id,
				detailsNode = APP.Dom.get("#details-content-"+ id);
				
			if(APP.Dom.hasClass(el, 'show-details')){
				el.innerHTML = 'Show Details';
				APP.Dom.removeClass(el, 'show-details').addClass(el,'hide-details');
				APP.Dom.removeClass(detailsNode, 'show').addClass(detailsNode,'hide');
			} else {
				el.innerHTML = 'Hide Details';
				APP.Dom.removeClass(el, 'hide-details').addClass(el,'show-details');
				APP.Dom.removeClass(detailsNode, 'hide').addClass(detailsNode,'show');
			
			}
		},
		
		createResultRow: function(data){
			var	dom =  APP.Dom,
				row,
				cell = new Array(),i,len,
				c = this.getCookie('fav'),
				classVal = 'inactive';
				
				cell[0] = dom.createElement({tag: 'img',src: 'https://graph.facebook.com/'+ data.id+'/picture?type=normal', className: 'pageImg left'});
				
				cell[1] = dom.createElement({tag: 'h3',text: data.name, className: 'pageName'});
				
				cell[2] = dom.createElement({tag: 'div',text: data.category, className: 'pageCat'});
				if(c.indexOf(data.id) >= 0){
					classVal = 'active';
				}
				cell[3] = dom.createElement({tag: 'a',text: 'Show Details', className: 'details', id: data.id, href: '#'});
				cell[4] = dom.createElement({tag: 'a', className: 'fav '+ classVal, id: 'fav-' + data.id, href: '#'});
				
				
				row = dom.createElement({tag: 'div',  className: 'pageRow'});
				len = cell.length;
				
				for(i=0; i<len; i++){
					row.appendChild(cell[i]);
				}
				
				
			return row;
		},
		
		getDetails: function(id){
			var id = id.replace('details-',''),
			url = 'https://graph.facebook.com/'+ id,
			that = this;
			
			APP.Request.get('GET', url, function(data){
				that.appendDetails(id,JSON.parse(data));
			});
			
		},
		
		appendDetails: function(id, details){
			var dom = APP.Dom,
				el = dom.get('#'+id),
				contentEl,
				parentEl = el.parentNode,
				cells = new Array(),
				i, len, html = '';
			
			el.text = 'Hide Details';
			contentEl = dom.createElement({tag:'div', id: 'details-content-'+ id, className: 'detailsContent clear'});
			
			if(details.about){
				cells.push(dom.createElement({tag:'div', className: 'about', text: '<span class="label">About: </span>: '+ details.about}));
			}
			
			cells.push(dom.createElement({tag:'div', className: 'birthday', text: details.birthday}));
			
			cells.push(dom.createElement({tag:'div', className: 'likes', text: details.likes + ' likes this'}));
			
			cells.push(dom.createElement({tag:'a', className: 'link', href: 'http://'+details.website, text: details.website}));
			
			cells.push(dom.createElement({tag:'a', className: 'link', href: details.link, text: 'Go to Page' }));
			
			len = cells.length;
			
			for(i=0; i< len; i++){
				contentEl.appendChild(cells[i]);
			}
			parentEl.appendChild(contentEl);
			
			
		},
		
		addSpiner: function (elemId) {
			var el = APP.Dom.get(elemId);
			APP.Dom.addClass(el, 'fade');
		},
		
		removeSpiner: function (elemId) {
			var dom = APP.Dom,
			el = dom.get(elemId),
			contEl = dom.get('#resultContent');
			
			if(contEl){
				dom.removeNode(dom.get('#resultContent'));
			}
			dom.removeClass(el, 'fade');
		}
	}
})();

