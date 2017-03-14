        if (!Array.prototype.find) {
	  Array.prototype.find = function(predicate) {
	    if (this == null) {
	      throw new TypeError('Array.prototype.find called on null or undefined');
	    }
	    if (typeof predicate !== 'function') {
	      throw new TypeError('predicate must be a function');
	    }
	    var list = Object(this);
	    var length = list.length >>> 0;
	    var thisArg = arguments[1];
	    var value;

	    for (var i = 0; i < length; i++) {
	      value = list[i];
	      if (predicate.call(thisArg, value, i, list)) {
	        return value;
	      }
	    }
	    return undefined;
	  };
	}


var ex={};
;(function(window, document, _) {

       
    
    
   	function Page() {
   	        instance = this;

   	        this.data = {};
   		this.init = function(input) {                    
                    this.data.heroes = input.heroes;
                    this.data.maps = input.maps;
                    this.data.modes = input.modes;
   		};

   			this.getTemplate = function(name) {

	            var container = document.getElementById(name + '-tmpl');

	            if ( container === null ) {
	                return null;
	            }

	            return _.template(container.innerHTML);
	        }

	        this.decodeHtml = function(html) {
			    var txt = document.createElement("textarea");
			    txt.innerHTML = html;
			    return txt.value;
			}

   			this.switchTheme = function(type) {
   				var theme;

   				var headCont = document.getElementsByTagName('header')[0];
   				_.each(headCont.children,function(el){el.classList.add('hidden')});
   				document.getElementById(type+'-head').classList.remove('hidden');
   				switch(type) {
   					case "main":
   						theme = 'grey';
   					break;
		   			case "modes":
   						theme = 'orange';
		   			break;
		   			case "heroes":
   					    theme = 'blue';
		   			break;
		   			case "maps":
   					    theme = 'green';
		   			break;
		   		}

		   		document.body.classList = "";
		   		document.body.classList.add(theme);
   			};

   			this.changeContent = function(type) {
   				var instance = this;
   				var tmpl = instance.getTemplate(type);

	    		var out = (function(tmpl){
					var div = document.createElement('div');

					div.innerHTML = tmpl({
						items: instance.data[type]
					});

					return div.innerHTML;

				})(tmpl);

				return out;
   			}

	   		var buttons = document.getElementsByClassName('chcont');
		   	if(buttons !== null) {
		   		_.each(buttons,function(el,index,but){
		   			el.addEventListener('click',function(e){
		   				e.preventDefault();

		   				document.getElementById('main-head').classList.add('collapsed');
		   				document.getElementById('mainNav').classList.remove('hidden');

		   				var type = el.dataset.type;
		   				instance.switchTheme(type);

		   				var out = instance.changeContent(type);
                        /*
		   				var tmpl = instance.getTemplate(type);
	    				var out = (function(tmpl){
							var div = document.createElement('div');

							div.innerHTML = tmpl({
								items: instance.data[type]
							});

							return div.innerHTML;

						})(tmpl);
                        */
                        var container = document.getElementById('content');
						container.innerHTML = instance.decodeHtml(out);
						document.getElementById('main').classList.add('hidden');
						container.classList.remove('hidden');

		   			});
		   		});
		   	}

		   	var nav = document.getElementsByClassName('nav-link');
		   	if(nav !== null) {
		   		_.each(nav,function(el,index,but){
		   			el.addEventListener('click',function(e){
		   				e.preventDefault();
		   				var t = el.hash.substr(1);

                        instance.switchTheme(t);
                        if(t !== 'main') {
                        	var out = instance.changeContent(t);
                        	var container = document.getElementById('content');
							container.innerHTML = instance.decodeHtml(out);
						}

                        var headCont = document.getElementsByTagName('header')[0];
		   					_.each(headCont.children,function(el){el.classList.add('hidden')});
   							document.getElementById(t+'-head').classList.remove('hidden');
		   				if(t == 'main') {
		   					document.getElementById(t+'-head').classList.remove('collapsed');
		   					document.getElementById('mainNav').classList.add('hidden');

		   					document.getElementById('main').classList.remove('hidden');
		   					document.getElementById('content').classList.add('hidden');
		   				}
		   			});
		   		});
		   	}

		   	/* heroes inline navigation */
		   	document.getElementById('content').addEventListener('click',function(e){
		   		if(e.target.classList.contains('hero-button')) {
		   			document.getElementById('loader').style.display='block';
		   			var el = e.target;
		   			var op = el.dataset.type;

		   			if(op == 'all') {
		   				var temp = instance.data.heroes;
		   			}
		   			else {
		   				var temp = instance.data.heroes.filter(function(el) { return el.type==op; });
		   			}

		   				var tmpl = instance.getTemplate('heroes');
	    				var out = (function(tmpl){
							var div = document.createElement('div');

							div.innerHTML = tmpl({
								items: temp
							});

							return div.innerHTML;

						})(tmpl);

                        var container = document.getElementById('content');

						setTimeout(function(){
						console.log(el);
							document.getElementById('loader').style.display='none';
							container.innerHTML = instance.decodeHtml(out);
							_.each(document.getElementsByClassName('hero-button'),function(e){
				   				e.classList.remove('active');
				   				if(e.dataset.type == el.dataset.type) {
				   					e.classList.add('active');
				   				}
				   			});

						},1000);

		   		}

		   	});
		   	
		   	this.init(window.ex);

	   }

	   window.addEventListener('DOMContentLoaded', function() {
               
                $.getJSON('modes.json',function(data){
                    window.ex = data;                    
                    new Page();                    
                });                
                
	   });

})(window, document, _);