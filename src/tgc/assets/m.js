/**
* mini lib by brucewan
*/

(function(m){
	if(m) {
		return;
	}
	var vendors = [ 'webkit', 'moz', 'o' ];
	var m = {
		extend: function (destination, source, override, replacer) {
			if (override === undefined) override = true;
			for (var property in source) {
				if (override || !(property in destination)) {
					if(replacer) replacer(property);
					else destination[property] = source[property];
				}
			}
			return destination;
		},
		support: {
			translate3d:  (function() {var sTranslate3D = 'translate3d(0px, 0px, 0px)'; var eTemp = document.createElement('div'); eTemp.style.cssText = ' -moz-transform:' + sTranslate3D + '; -ms-transform:' + sTranslate3D + '; -o-transform:' + sTranslate3D + '; -webkit-transform:' + sTranslate3D + '; transform:' + sTranslate3D; var rxTranslate = /translate3d\(0px, 0px, 0px\)/g; var asSupport = eTemp.style.cssText.match(rxTranslate); var bHasSupport = (asSupport !== null && asSupport.length == 1); return bHasSupport; })()
		},
		css: function(obj, prop, value){
			var needVendor = /transform/i;
			if(needVendor.test(prop)) {
				for(var i = 0; i < vendors.length; i++) {
					obj.style[vendors[i]+ prop.substr(0, 1).toUpperCase()+prop.substr(1)] = value;
				}
			}
			obj.style[prop] = value;
		}
	};
	window.m = m;
})(window.m);



/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-06-12
 * @description 滑动类
 * @name Tab
 * @example
		var tab1 = new m.Slide({
			target: $('#slide01 li')
		});
 * @class
*/

/**
 * @param {nodelist} config.target 目标滑动元素
 * @param {nodelist} config.trigger 导航或触发的元素
 * @param {boolean}  [config.touchMove=false] 是否允许触摸滑动
 * @param {string}  [config.direction='x'] 指定滑动的方向
 * @param {number}  [config.touchSpeed=1] 触摸滑动的速度
 * @param {string}  [config.currentClass='current'] 当前trigger的classname
 * @param {boolean}  [config.progressBar=false] 是否显示当前播放进度（小圆点）
 * @param {string}  [config.lazyClass] 启用按需加载的目标元素classname
 * @constructor 
*/
m.Slide = function(config){
	this.config = m.extend(m.extend({}, m.Slide.config), config, true);
	this.init();
}

m.Slide.config = {
	touchMove: false,
	animTime: 500,
	touchDis: 40,
	direction: 'x',
	touchSpeed: 1,
	currentClass: 'current',
	progressBar: false
}
m.Slide.prototype = {
	init: function(){
		var self = this;
		var c = self.config;

		self._data = {};

		self.target = c.target;
		self.length = self.target.length;
		self.trigger = c.trigger;
		self.num = self.target.length;
		self.wrap = self.target[0].parentNode;
		// self.wrap.cssText += ';-webkit-transition: all .5s linear;'
		if(m.support.translate3d) {
			self.wrap.style.webkitTransition = '-webkit-transform '+ c.animTime +'ms ease-out';
		}
		m.css(self.wrap, 'transform', 'translate(0,0)');
		self.width = self.wrap.parentNode.clientWidth;

		if(c.progressBar === true) {
			var progressBar = document.createElement('ul');
			progressBar.classList.add('progress-bar');
			for(var i = 0; i < self.length; i++) {
				var child = document.createElement('li');
				progressBar.appendChild(child);
			}
			self.progressBar = self.wrap.parentNode.appendChild(progressBar).childNodes;
		}

		self._attach();

		self.playTo(0);

	},

	_attach: function(){
		var self = this;
		var c = self.config;

		// 横竖屏切换时
		window.addEventListener('resize', self.update.bind(self));

		// 点击图标触发
		if(self.trigger) {
			var len = self.trigger.length;
			for(var i = 0; i < len; i++) {
				(function(i){
					self.trigger[i].addEventListener('touchend', function(e){
						self.playTo(i);
					});
				})(i);
			}
		}

		// 滑动屏幕触发
		var d = self._data;
		var locked = false;
		var touchDirection;
		var touchMove, touchEnd;
		if(c.touchMove) {
			self.wrap.addEventListener('touchstart', function(e){
				if(c.ontouchstart && c.ontouchstart.apply(self, [e]) === false) {
					return false;
				}
				d.pageX = e.touches[0].pageX;
				d.pageY = e.touches[0].pageY;
				self.wrap.style.webkitTransitionDuration = '0ms';
				self.wrap.addEventListener('touchmove', touchMove);
				self.wrap.addEventListener('touchend', touchEnd);
				touchDirection = '';


				// self.wrap.addEventListener('touchcancel', touchEnd);
			});
		}
		touchMove = function(e){
			d.disX = e.touches[0].pageX - d.pageX;
			d.disY = e.touches[0].pageY - d.pageY;
			// $("#hand-t").show();
			if(c.direction == 'x') {
				d.dis = d.disX;
			} else {
				d.dis = d.disY;
			}

			if(!touchDirection) {
				if(Math.abs(d.disX / d.disY) > 1) {
					touchDirection = 'x';
				} else {
					touchDirection = 'y';
				}
			}

			if(c.ontouchmove && c.ontouchmove.apply(self, [d.dis, e]) === false) {
				return false;
			}

			// self.wrap.style.webkitTransform = 'translate3d(' + (d.dis - self.current * self.width) + 'px,0,0)';
			if(c.direction == touchDirection) {
				if(c.direction == 'x') {
					m.css(self.wrap, 'transform', 'translate3d(' + (d.dis - self.target[self.current].offsetLeft) + 'px,0,0)');
				} else {

					m.css(self.wrap, 'transform', 'translate3d(0,' + (d.dis - self.target[self.current].offsetTop) + 'px,0)');
				}
			}

		}
		touchEnd = function() {
			if(touchDirection && c.direction != touchDirection) {
				return;
			}
			if(d.dis === undefined || isNaN(d.dis)) {
				d.dis = 0;
			}

			self.wrap.style.webkitTransitionDuration = c.animTime + 'ms';
			self.wrap.removeEventListener('touchmove', touchMove);
			self.wrap.removeEventListener('touchend', touchEnd);

			var isOK = true;
			if(c.ontouchend) {
				if(c.ontouchend.apply(self, [d.dis]) === false) {
					isOK = false;
				}
			}


			if(!d.dis || (Math.abs(d.dis) < c.touchDis || !isOK)) {
				self.playTo(self.current);
				return;
			}
			if(d.dis > 0) {
				self.playTo(self.current-c.touchSpeed);
			} else {
				self.playTo(self.current+c.touchSpeed);
			}

			d.dis = 0;


		};

		// 用户点击时
		self.wrap.addEventListener('click', function(e){
			c.onclick && c.onclick.call(self, e);
		});


	},

	playTo: function(i){
		var self = this;
		var c = self.config;

		self.wrap.style.webkitTransitionDuration = c.animTime + 'ms';

		/**
		 * @event Slide#changebefore:开始切换时
		 * @property {object} event 事件对象
		 */
		if(c.onchangebefore) {
			if(c.onchangebefore.apply(self, [i]) === false) {
				return;
			}
		}

		if(i >= self.num -1) {
			i = self.num - 1;
		}
		if(i < 0) {
			i = 0;
		}
		if(m.support.translate3d) {
			if(c.direction == 'x') { 
				m.css(self.wrap, 'transform', 'translate3d('+ (-self.target[i].offsetLeft ) +'px,0,0)');
			} else {
				m.css(self.wrap, 'transform', 'translate3d(0,'+ (-self.target[i].offsetTop) +'px,0)');
			}		
		} else {
			if(c.direction == 'x') {
				m.css(self.wrap, 'transform', 'translate('+ (-self.target[i].offsetLeft) +'px,0)');
			} else {
				m.css(self.wrap, 'transform', 'translate(0,'+ (-self.target[i].offsetTop) +'px)');
				//setTimeout(function(){$("#hand-t").hide()},500);
			}	
		}
		// 如果还是当前页
		if(i === self.current) return;

		if(self.trigger && self.trigger[self.current]) {
			self.trigger[self.current].classList.remove(c.currentClass);
		}
		if(self.progressBar && self.progressBar[self.current]) {
			self.progressBar[self.current].classList.remove(c.currentClass);
		}
		self.prevPage = self.current;
		self.current = i;
		if(self.trigger && self.trigger[self.current]) {
			self.trigger[self.current].classList.add(c.currentClass);
		}
		if(self.progressBar && self.progressBar[self.current]) {
			self.progressBar[self.current].classList.add(c.currentClass);
		}
		
		// c.onchangebefore && c.onchangebefore.apply(self, [i]);

		if(c.lazyClass) {
			self.lazy(i);
		}
		window.setTimeout(function(){
			/**
			 * @event Slide#change:切换结束时
			 * @property {object} event 事件对象
			 */
			c.onchange && c.onchange.apply(self, [i]);
		}, c.animTime);
	},
	prev: function(){
		this.playTo(this.current - 1);
	},
	next: function(){
		this.playTo(this.current + 1);
	},
	update: function(e){
		var self = this;
		self.width = self.wrap.parentNode.clientWidth;
	},
	lazy: function(i){
		var lazyElems = []
			targetWrap = this.target[i];
		if(targetWrap.classList.contains(this.config.lazyClass)) {
			lazyElems.push(targetWrap);
		}
		var lazyChildren = Array.prototype.slice.call(targetWrap.querySelectorAll('.'+this.config.lazyClass), 0);
		lazyElems = lazyElems.concat(lazyChildren);

		for(var j = 0; j < lazyElems.length; j++) {
			var elem = lazyElems[j];
			var url = elem.getAttribute('data-url');
			if(url) {
				if(/img/i.test(elem.tagName))	{
					elem.src = url;
				} else {
					elem.style.backgroundImage = 'url('+ url +')';
				}
				elem.removeAttribute('data-url');
			}
		}	
	}
};
/*  |xGv00|6a6df7287d6978f9ce7e9f4fff801ce8 */