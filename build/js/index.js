webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/10/20.
	 */
	__webpack_require__(1);
	__webpack_require__(2);
	var $ = __webpack_require__(3);
	var untilEvent = __webpack_require__(4);
	var drag = __webpack_require__(5);

	var dragElem = $('.drag');
	untilEvent.addEvent(dragElem[0],'touchstart',drag.touchStart);

/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 2016/10/20.
	 */
	var untilEvent = {
	    addEvent:function(elem,type,handler){
	        if(elem.addEventListener){
	            elem.addEventListener(type,handler,false);
	        }else if(elem.attachEvent){
	            elem.attachEvent("on" + type,handler);
	        }else{
	            elem['on' + type] = handler;
	        }
	    },
	    removeEvent:function(elem,type,handler){
	        if(elem.removeEventListener){
	            elem.removeEventListener(type,handler,false);
	        }else if(elem.detachEvent){
	            elem.detachEvent('on' + type,handler);
	        }else{
	            elem['on' + type] = null;
	        }
	    },
	    getTarget:function(event){
	        return event.target || event.srcElement;
	    },
	    getEvent:function(event){
	        return event ? event : window.event;
	    },
	    preventDefault:function(event){
	        if(event.preventDefault){
	            event.preventDefault();
	        }else{
	            event.returnValue = false;
	        }
	    },
	    stopPropagation:function(event){
	        if(event.stopPropagation){
	            event.stopPropagation();
	        }else{
	            event.cancelBubble = true;
	        }
	    }
	};
	module.exports = untilEvent;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/10/20.
	 */

	var $ = __webpack_require__(3);
	var untilEvent = __webpack_require__(4);
	var drag = {
	    //�ƶ��������ӿڵ�λ��
	    position:{
	        X:undefined,
	        Y:undefined
	    },
	    //�����������ӿڵ�λ��
	    touchPos:{
	        X:undefined,
	        Y:undefined
	    },
	    //�������������ƶ�����λ��
	    touchOffsetPos:{
	        X:undefined,
	        Y:undefined
	    },
	    touchStart:function(event){
	        var e = untilEvent.getEvent(event);
	        var target = untilEvent.getTarget(e);

	        //��ֹð��
	        untilEvent.stopPropagation(e);

	        var $target = $(target);

	        drag.position.X = $target.offset().left;
	        drag.position.Y = $target.offset().top;

	        drag.touchPos.X = e.targetTouches[0].clientX;
	        drag.touchPos.Y = e.targetTouches[0].clientY;

	        drag.touchOffsetPos.X = drag.touchPos.X - drag.position.X;
	        drag.touchOffsetPos.Y = drag.touchPos.Y - drag.position.Y;

	        //��Ŀ��Ԫ�ذ���touchMove�¼�
	        untilEvent.addEvent(target,'touchmove',drag.touchMove);
	    },
	    touchMove:function(event){
	        var e = untilEvent.getEvent(event);
	        var target = untilEvent.getTarget(e);

	        //��ֹð��
	        untilEvent.stopPropagation(e);

	       var $target = $(target);

	        //����Ŀ��Ԫ���ϵ���ָ����һ������ֹĬ����Ϊ
	        if(e.targetTouches.length > 1){

	            untilEvent.preventDefault(e);

	        }else{

	            //���ô�������λ��
	            drag.touchPos.X = e.targetTouches[0].clientX;
	            drag.touchPos.Y = e.targetTouches[0].clientY;

	            //�޸��ƶ�����λ��
	            $(target).offset({
	                top:drag.touchPos.Y - drag.touchOffsetPos.Y,
	                left:drag.touchPos.X - drag.touchOffsetPos.X
	            });

	        }

	    },
	    touchEnd:function(event){

	    }
	};
	module.exports = drag;


/***/ }
]);