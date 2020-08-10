/*https://github.com/skidding/dragdealer*/
!function(t,i){"function"==typeof define&&define.amd?define(i):"object"==typeof module&&module.exports?module.exports.Dragdealer=i():t.Dragdealer=i()}(this,function(){function t(t){var i="Webkit Moz ms O".split(" "),e=document.documentElement.style;if(void 0!==e[t])return t;t=t.charAt(0).toUpperCase()+t.substr(1);for(var s=0;s<i.length;s++)if(void 0!==e[i[s]+t])return i[s]+t}function i(t){l.backfaceVisibility&&l.perspective&&(t.style[l.perspective]="1000px",t.style[l.backfaceVisibility]="hidden")}var e=function(t,i){this.options=this.applyDefaults(i||{}),this.bindMethods(),this.wrapper=this.getWrapperElement(t),this.wrapper&&(this.handle=this.getHandleElement(this.wrapper,this.options.handleClass),this.handle&&(this.init(),this.bindEventListeners()))};e.prototype={defaults:{disabled:!1,horizontal:!0,vertical:!1,slide:!0,steps:0,snap:!1,loose:!1,speed:.1,xPrecision:0,yPrecision:0,handleClass:"handle",css3:!0,activeClass:"active",tapping:!0},init:function(){this.options.css3&&i(this.handle),this.value={prev:[-1,-1],current:[this.options.x||0,this.options.y||0],target:[this.options.x||0,this.options.y||0]},this.offset={wrapper:[0,0],mouse:[0,0],prev:[-999999,-999999],current:[0,0],target:[0,0]},this.dragStartPosition={x:0,y:0},this.change=[0,0],this.stepRatios=this.calculateStepRatios(),this.activity=!1,this.dragging=!1,this.tapping=!1,this.reflow(),this.options.disabled&&this.disable()},applyDefaults:function(t){for(var i in this.defaults)t.hasOwnProperty(i)||(t[i]=this.defaults[i]);return t},getWrapperElement:function(t){return"string"==typeof t?document.getElementById(t):t},getHandleElement:function(t,i){var e,s,n;if(t.getElementsByClassName){if(e=t.getElementsByClassName(i),e.length>0)return e[0]}else for(s=new RegExp("(^|\\s)"+i+"(\\s|$)"),e=t.getElementsByTagName("*"),n=0;n<e.length;n++)if(s.test(e[n].className))return e[n]},calculateStepRatios:function(){var t=[];if(this.options.steps>=1)for(var i=0;i<=this.options.steps-1;i++)this.options.steps>1?t[i]=i/(this.options.steps-1):t[i]=0;return t},setWrapperOffset:function(){this.offset.wrapper=u.get(this.wrapper)},calculateBounds:function(){var t={top:this.options.top||0,bottom:-(this.options.bottom||0)+this.wrapper.offsetHeight,left:this.options.left||0,right:-(this.options.right||0)+this.wrapper.offsetWidth};return t.availWidth=t.right-t.left-this.handle.offsetWidth,t.availHeight=t.bottom-t.top-this.handle.offsetHeight,t},calculateValuePrecision:function(){var t=this.options.xPrecision||Math.abs(this.bounds.availWidth),i=this.options.yPrecision||Math.abs(this.bounds.availHeight);return[t?1/t:0,i?1/i:0]},bindMethods:function(){"function"==typeof this.options.customRequestAnimationFrame?this.requestAnimationFrame=s(this.options.customRequestAnimationFrame,window):this.requestAnimationFrame=s(c,window),"function"==typeof this.options.customCancelAnimationFrame?this.cancelAnimationFrame=s(this.options.customCancelAnimationFrame,window):this.cancelAnimationFrame=s(f,window),this.animateWithRequestAnimationFrame=s(this.animateWithRequestAnimationFrame,this),this.animate=s(this.animate,this),this.onHandleMouseDown=s(this.onHandleMouseDown,this),this.onHandleTouchStart=s(this.onHandleTouchStart,this),this.onDocumentMouseMove=s(this.onDocumentMouseMove,this),this.onWrapperTouchMove=s(this.onWrapperTouchMove,this),this.onWrapperMouseDown=s(this.onWrapperMouseDown,this),this.onWrapperTouchStart=s(this.onWrapperTouchStart,this),this.onDocumentMouseUp=s(this.onDocumentMouseUp,this),this.onDocumentTouchEnd=s(this.onDocumentTouchEnd,this),this.onHandleClick=s(this.onHandleClick,this),this.onWindowResize=s(this.onWindowResize,this)},bindEventListeners:function(){n(this.handle,"mousedown",this.onHandleMouseDown),n(this.handle,"touchstart",this.onHandleTouchStart),n(document,"mousemove",this.onDocumentMouseMove),n(this.wrapper,"touchmove",this.onWrapperTouchMove),n(this.wrapper,"mousedown",this.onWrapperMouseDown),n(this.wrapper,"touchstart",this.onWrapperTouchStart),n(document,"mouseup",this.onDocumentMouseUp),n(document,"touchend",this.onDocumentTouchEnd),n(this.handle,"click",this.onHandleClick),n(window,"resize",this.onWindowResize),this.animate(!1,!0),this.interval=this.requestAnimationFrame(this.animateWithRequestAnimationFrame)},unbindEventListeners:function(){o(this.handle,"mousedown",this.onHandleMouseDown),o(this.handle,"touchstart",this.onHandleTouchStart),o(document,"mousemove",this.onDocumentMouseMove),o(this.wrapper,"touchmove",this.onWrapperTouchMove),o(this.wrapper,"mousedown",this.onWrapperMouseDown),o(this.wrapper,"touchstart",this.onWrapperTouchStart),o(document,"mouseup",this.onDocumentMouseUp),o(document,"touchend",this.onDocumentTouchEnd),o(this.handle,"click",this.onHandleClick),o(window,"resize",this.onWindowResize),this.cancelAnimationFrame(this.interval)},onHandleMouseDown:function(t){r.refresh(t),a(t),h(t),this.activity=!1,this.startDrag()},onHandleTouchStart:function(t){r.refresh(t),h(t),this.activity=!1,this.startDrag()},onDocumentMouseMove:function(t){t.clientX-this.dragStartPosition.x===0&&t.clientY-this.dragStartPosition.y===0||(r.refresh(t),this.dragging&&(this.activity=!0,a(t)))},onWrapperTouchMove:function(t){return r.refresh(t),!this.activity&&this.draggingOnDisabledAxis()?void(this.dragging&&this.stopDrag()):(a(t),void(this.activity=!0))},onWrapperMouseDown:function(t){r.refresh(t),a(t),this.startTap()},onWrapperTouchStart:function(t){r.refresh(t),a(t),this.startTap()},onDocumentMouseUp:function(t){this.stopDrag(),this.stopTap()},onDocumentTouchEnd:function(t){this.stopDrag(),this.stopTap()},onHandleClick:function(t){this.activity&&(a(t),h(t))},onWindowResize:function(t){this.reflow()},enable:function(){this.disabled=!1,this.handle.className=this.handle.className.replace(/\s?disabled/g,"")},disable:function(){this.disabled=!0,this.handle.className+=" disabled"},reflow:function(){this.setWrapperOffset(),this.bounds=this.calculateBounds(),this.valuePrecision=this.calculateValuePrecision(),this.updateOffsetFromValue()},getStep:function(){return[this.getStepNumber(this.value.target[0]),this.getStepNumber(this.value.target[1])]},getStepWidth:function(){return Math.abs(this.bounds.availWidth/this.options.steps)},getValue:function(){return this.value.target},setStep:function(t,i,e){this.setValue(this.options.steps&&t>1?(t-1)/(this.options.steps-1):0,this.options.steps&&i>1?(i-1)/(this.options.steps-1):0,e)},setValue:function(t,i,e){this.setTargetValue([t,i||0]),e&&(this.groupCopy(this.value.current,this.value.target),this.updateOffsetFromValue(),this.callAnimationCallback())},startTap:function(){!this.disabled&&this.options.tapping&&(this.tapping=!0,this.setWrapperOffset(),this.setTargetValueByOffset([r.x-this.offset.wrapper[0]-this.handle.offsetWidth/2,r.y-this.offset.wrapper[1]-this.handle.offsetHeight/2]))},stopTap:function(){!this.disabled&&this.tapping&&(this.tapping=!1,this.setTargetValue(this.value.current))},startDrag:function(){this.disabled||(this.dragging=!0,this.setWrapperOffset(),this.dragStartPosition={x:r.x,y:r.y},this.offset.mouse=[r.x-u.get(this.handle)[0],r.y-u.get(this.handle)[1]],this.wrapper.className.match(this.options.activeClass)||(this.wrapper.className+=" "+this.options.activeClass),this.callDragStartCallback())},stopDrag:function(){if(!this.disabled&&this.dragging){this.dragging=!1;var t=0===this.bounds.availWidth?0:(r.x-this.dragStartPosition.x)/this.bounds.availWidth,i=0===this.bounds.availHeight?0:(r.y-this.dragStartPosition.y)/this.bounds.availHeight,e=[t,i],s=this.groupClone(this.value.current);if(this.options.slide){var n=this.change;s[0]+=4*n[0],s[1]+=4*n[1]}this.setTargetValue(s),this.wrapper.className=this.wrapper.className.replace(" "+this.options.activeClass,""),this.callDragStopCallback(e)}},callAnimationCallback:function(){var t=this.value.current;this.options.snap&&this.options.steps>1&&(t=this.getClosestSteps(t)),this.groupCompare(t,this.value.prev)||("function"==typeof this.options.animationCallback&&this.options.animationCallback.call(this,t[0],t[1]),this.groupCopy(this.value.prev,t))},callTargetCallback:function(){"function"==typeof this.options.callback&&this.options.callback.call(this,this.value.target[0],this.value.target[1])},callDragStartCallback:function(){"function"==typeof this.options.dragStartCallback&&this.options.dragStartCallback.call(this,this.value.target[0],this.value.target[1])},callDragStopCallback:function(t){"function"==typeof this.options.dragStopCallback&&this.options.dragStopCallback.call(this,this.value.target[0],this.value.target[1],t)},animateWithRequestAnimationFrame:function(t){t?(this.timeOffset=this.timeStamp?t-this.timeStamp:0,this.timeStamp=t):this.timeOffset=25,this.animate(),this.interval=this.requestAnimationFrame(this.animateWithRequestAnimationFrame)},animate:function(t,i){if(!t||this.dragging){if(this.dragging){var e=this.groupClone(this.value.target),s=[r.x-this.offset.wrapper[0]-this.offset.mouse[0],r.y-this.offset.wrapper[1]-this.offset.mouse[1]];this.setTargetValueByOffset(s,this.options.loose),this.change=[this.value.target[0]-e[0],this.value.target[1]-e[1]]}(this.dragging||i)&&this.groupCopy(this.value.current,this.value.target),(this.dragging||this.glide()||i)&&(this.updateOffsetFromValue(),this.callAnimationCallback())}},glide:function(){var t=[this.value.target[0]-this.value.current[0],this.value.target[1]-this.value.current[1]];return!(!t[0]&&!t[1])&&(Math.abs(t[0])>this.valuePrecision[0]||Math.abs(t[1])>this.valuePrecision[1]?(this.value.current[0]+=t[0]*Math.min(this.options.speed*this.timeOffset/25,1),this.value.current[1]+=t[1]*Math.min(this.options.speed*this.timeOffset/25,1)):this.groupCopy(this.value.current,this.value.target),!0)},updateOffsetFromValue:function(){this.options.snap?this.offset.current=this.getOffsetsByRatios(this.getClosestSteps(this.value.current)):this.offset.current=this.getOffsetsByRatios(this.value.current),this.groupCompare(this.offset.current,this.offset.prev)||(this.renderHandlePosition(),this.groupCopy(this.offset.prev,this.offset.current))},renderHandlePosition:function(){var t="";return this.options.css3&&l.transform?(this.options.horizontal&&(t+="translateX("+this.offset.current[0]+"px)"),this.options.vertical&&(t+=" translateY("+this.offset.current[1]+"px)"),void(this.handle.style[l.transform]=t)):(this.options.horizontal&&(this.handle.style.left=this.offset.current[0]+"px"),void(this.options.vertical&&(this.handle.style.top=this.offset.current[1]+"px")))},setTargetValue:function(t,i){var e=i?this.getLooseValue(t):this.getProperValue(t);this.groupCopy(this.value.target,e),this.offset.target=this.getOffsetsByRatios(e),this.callTargetCallback()},setTargetValueByOffset:function(t,i){var e=this.getRatiosByOffsets(t),s=i?this.getLooseValue(e):this.getProperValue(e);this.groupCopy(this.value.target,s),this.offset.target=this.getOffsetsByRatios(s)},getLooseValue:function(t){var i=this.getProperValue(t);return[i[0]+(t[0]-i[0])/4,i[1]+(t[1]-i[1])/4]},getProperValue:function(t){var i=this.groupClone(t);return i[0]=Math.max(i[0],0),i[1]=Math.max(i[1],0),i[0]=Math.min(i[0],1),i[1]=Math.min(i[1],1),(!this.dragging&&!this.tapping||this.options.snap)&&this.options.steps>1&&(i=this.getClosestSteps(i)),i},getRatiosByOffsets:function(t){return[this.getRatioByOffset(t[0],this.bounds.availWidth,this.bounds.left),this.getRatioByOffset(t[1],this.bounds.availHeight,this.bounds.top)]},getRatioByOffset:function(t,i,e){return i?(t-e)/i:0},getOffsetsByRatios:function(t){return[this.getOffsetByRatio(t[0],this.bounds.availWidth,this.bounds.left),this.getOffsetByRatio(t[1],this.bounds.availHeight,this.bounds.top)]},getOffsetByRatio:function(t,i,e){return Math.round(t*i)+e},getStepNumber:function(t){return this.getClosestStep(t)*(this.options.steps-1)+1},getClosestSteps:function(t){return[this.getClosestStep(t[0]),this.getClosestStep(t[1])]},getClosestStep:function(t){for(var i=0,e=1,s=0;s<=this.options.steps-1;s++)Math.abs(this.stepRatios[s]-t)<e&&(e=Math.abs(this.stepRatios[s]-t),i=s);return this.stepRatios[i]},groupCompare:function(t,i){return t[0]==i[0]&&t[1]==i[1]},groupCopy:function(t,i){t[0]=i[0],t[1]=i[1]},groupClone:function(t){return[t[0],t[1]]},draggingOnDisabledAxis:function(){return!this.options.horizontal&&r.xDiff>r.yDiff||!this.options.vertical&&r.yDiff>r.xDiff}};for(var s=function(t,i){return function(){return t.apply(i,arguments)}},n=function(t,i,e){t.addEventListener?t.addEventListener(i,e,!1):t.attachEvent&&t.attachEvent("on"+i,e)},o=function(t,i,e){t.removeEventListener?t.removeEventListener(i,e,!1):t.detachEvent&&t.detachEvent("on"+i,e)},a=function(t){t||(t=window.event),t.preventDefault&&t.preventDefault(),t.returnValue=!1},h=function(t){t||(t=window.event),t.stopPropagation&&t.stopPropagation(),t.cancelBubble=!0},r={x:0,y:0,xDiff:0,yDiff:0,refresh:function(t){t||(t=window.event),"mousemove"==t.type?this.set(t):t.touches&&this.set(t.touches[0])},set:function(t){var i=this.x,e=this.y;t.clientX||t.clientY?(this.x=t.clientX,this.y=t.clientY):(t.pageX||t.pageY)&&(this.x=t.pageX-document.body.scrollLeft-document.documentElement.scrollLeft,this.y=t.pageY-document.body.scrollTop-document.documentElement.scrollTop),this.xDiff=Math.abs(this.x-i),this.yDiff=Math.abs(this.y-e)}},u={get:function(t){var i={left:0,top:0};return void 0!==t.getBoundingClientRect&&(i=t.getBoundingClientRect()),[i.left,i.top]}},l={transform:t("transform"),perspective:t("perspective"),backfaceVisibility:t("backfaceVisibility")},p=["webkit","moz"],c=window.requestAnimationFrame,f=window.cancelAnimationFrame,d=0;d<p.length&&!c;++d)c=window[p[d]+"RequestAnimationFrame"],f=window[p[d]+"CancelAnimationFrame"]||window[p[d]+"CancelRequestAnimationFrame"];return c||(c=function(t){return setTimeout(t,25)},f=clearTimeout),e});




jQuery(document).ready(function($) {

	$('.cq-draggable-container').each(function(index) {
		var _this = $(this);
		var _autoplay = $(this).data('autoplay') == "yes" ? true : false;
		var _autoplayspeed = $(this).data('_autoplayspeed') || 5000;
		var _labelcolor = $(this).data('labelcolor');
		var _dragbuttonwidth = $(this).data('dragbuttonwidth');
		var _contaienrwidth = $(this).data('contaienrwidth') || '80%';
		var _defaultbarbgcolor = $(this).data('defaultbarbgcolor');
		var _draggingbarbgcolor = $(this).data('draggingbarbgcolor') || 'rgba(0,0,0,0.5)';
		var _activeiconcolor = $(this).data('activeiconcolor');
		var _avatarstyle = $(this).data('avatarstyle');


		_this.css('width', _contaienrwidth);
		$('.cq-draggable-slider', _this).css('background-color', _defaultbarbgcolor);
		$('.cq-draggable-stripe', _this).css('background-color', _draggingbarbgcolor);
		$('.cq-highlight-label', _this).css('color', _labelcolor);
		$('.cq-menu-square', _this).css('width', _dragbuttonwidth);
		$('.cq-carouselcontent').perfectScrollbar({
			stopPropagationOnClick: false
		});
		var _titlecarousel = $('.cq-titlecontainer', _this).slick({
			touchMove: false,
			swipe: false,
		    slidesToShow: 1,
		    slidesToScroll: 1,
		    infinite: false,
		    arrows: false
		});
		var _carousel = $('.cq-carouselcontainer', _this).slick({
			touchMove: false,
			swipe: false,
		    slidesToShow: 1,
		    slidesToScroll: 1,
		    infinite: false,
		    arrows: false
		});
		var _avatarnum = $('.cq-barcontainer', _this).find('.cq-highlight-container').length;
		$('.cq-barcontainer', _this).find('.cq-highlight-container').each(function(index) {
			var _icon = $(this).find('.cq-highlight');
			if(_icon[0]){
				var _iconbgcolors = _icon.data('iconbgcolors');
				_icon.css('background-color', _iconbgcolors);
				// _icon.css('opacity', 0.2);
			}
			$(this).css({
				width: 1/_avatarnum*100 + '%'
			});
		})

		var _currentnum = 0;
		var _drag = new Dragdealer($('.cq-draggable-slider', _this)[0], {
			handleClass: 'cq-draggable-handle',
		    speed: 0.3,
		    animationCallback: function(x, y) {
				if(_autoplay) _slideshow();
				var slider_value = ((Math.round(x * 100)));
				var stripe_width = slider_value;
				_currentnum = Math.floor((slider_value+2)*_avatarnum/100);
				if(_currentnum>=_avatarnum) _currentnum = _avatarnum - 1;
				$(".cq-draggable-stripe", _this).css("width", ""+stripe_width+"%");
				_carousel.slick('slickGoTo', _currentnum);
				_titlecarousel.slick('slickGoTo', _currentnum);

		    },
		    dragStopCallback: function(x, y){
		    	if(_autoplay) _slideshow();
				var slider_value = ((Math.round(x * 100)));
				var stripe_width = slider_value;
				_currentnum = Math.floor((slider_value+2)*_avatarnum/100);
				if(_currentnum>=_avatarnum) _currentnum = _avatarnum - 1;
				$(".cq-draggable-stripe", _this).css("width", ""+stripe_width+"%");
				_carousel.slick('slickGoTo', _currentnum);
				_titlecarousel.slick('slickGoTo', _currentnum);

		    },
		    callback: function(x, y){
		    	var slider_value = ((Math.round(x * 100)));
				var stripe_width = slider_value;
				_currentnum = Math.floor((slider_value+2)*_avatarnum/100);
				var slider_value = ((Math.round(x * 100)));

				if(_currentnum>=_avatarnum) _currentnum = _avatarnum - 1;
				$(".cq-draggable-stripe", _this).css("width", ""+stripe_width+"%");
				_carousel.slick('slickGoTo', _currentnum);
				_titlecarousel.slick('slickGoTo', _currentnum);

				if(_avatarstyle=="text"){
					$('.cq-highlight-label', _this).each(function(index) {
						if(index<=_currentnum){
							$(this).stop(true).animate({'margin-top': '32px'}, 400);
						}else{
							$(this).stop(true).animate({'margin-top': ''}, 400);
						}

					});
	    		}
		    	$('.cq-highlight', _this).each(function(index) {
		    		if(_avatarstyle=="text"){
		    // 			if(index<=_currentnum){
						// 	$(this).find('.cq-highlight-label').stop(true).animate({'margin-top': '32px'}, 400);
						// }else{
						// 	$(this).find('.cq-highlight-label').stop(true).animate({'margin-top': ''}, 400);
						// }
		    		}else if(_avatarstyle=="icon"){
		    			if(index<=_currentnum){
							if(_activeiconcolor!="")$(this).css({'background-color': _activeiconcolor});
						}else{
							var _bgcolor = $(this).data('iconbgcolors');
							$(this).css({'background-color': _bgcolor});
						}

		    		}
				});

		    }


		});

	    $('.cq-draggable-slider', _this).on('click', function(event) {
	    	var relX = event.pageX - $(this).parent().offset().left;
	    	_drag.setValue(relX/$(this).parent().width());
	    });

		var _slideID;
		var _x = 0.5/_avatarnum;
		function _slideshow(){
	        clearTimeout(_slideID);
	        _slideID = setTimeout(function() {
	        	_x += 1/_avatarnum;
	        	if(_x>=1) _x = 0.5/_avatarnum;
	        	_drag.setValue(_x);
	        }, _autoplayspeed);
	    }

	    _this.on('mouseover', function(event) {
			if(_autoplay) clearTimeout(_slideID);
	    }).on('mouseleave', function(event) {
			if(_autoplay) _slideshow();
	    });


		_drag.setValue(0.5/_avatarnum||0.1);

	});


});
