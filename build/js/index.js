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
	var position = __webpack_require__(6);var ajax = __webpack_require__(8);

	var dragList = $('#dragList');


	//可拖拽元素的水平，竖直间距
	var gap = {
	    X:20,
	    Y:10
	};

	//通过ajax获取可拖拽的元素的列表
	ajax.getInitImg(dragList,gap);
	//设置每个元素
	//初始化可拖拽元素的位置
	position.init(dragList,gap);

	//设置控制台的高度。控制台的高度为屏幕的高度减去拖拽列表的盖度
	var control = $('#control');
	control.height( $(window).height() - dragList.height() );

	//给每个拖动元素绑定touchstart事件
	var dragElem = dragList.children();
	dragElem.each(function(index,elem){

	    untilEvent.addEvent(elem,'touchstart',drag.touchStart);
	});

	//拖拽元素的父元素的id值为dragList,操作台的id值为control
	drag.setID('dragList','control');

	//控制台提示文字
	var info = $('<div class="notice" id="notice">该区域内不能放置</div>')
	    .css({
	        'position':'absolute',
	        'display':'none',
	        'color':'red',
	        'font-size':'12px',
	        'border':'red dotted 2px',
	        'box-shadow':'0 0 1px red'
	    });

	control.append(info);

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
	var position = __webpack_require__(6);
	var transition = __webpack_require__(7);

	var drag = {
	    //拖拽元素的父元素的id
	    dragParen:undefined,
	    //操作台的id值
	    control:undefined,
	    //移动块相对视口的位置
	    position:{
	        X:undefined,
	        Y:undefined
	    },
	    //当前触摸点相对视口的位置
	    touchPos:{
	        X:undefined,
	        Y:undefined
	    },
	    //开始滑动触摸点相对视口的位置
	    startTouchPos:{
	        X:undefined,
	        Y:undefined
	    },
	    //触摸块相对于移动块的位置
	    touchOffsetPos:{
	        X:undefined,
	        Y:undefined
	    },
	    //是否重叠
	    isCover:undefined,
	    //canvas用于生成参考线
	    canvas:undefined,
	    //获取拖拽元素父元素id和控制台的ID的值
	    setID:function(dragList,control){
	        this.dragParent = dragList;
	        this.control = control;
	    },
	    touchStart:function(event){

	        var e = untilEvent.getEvent(event);
	        var target = untilEvent.getTarget(e);

	        //阻止冒泡
	        untilEvent.stopPropagation(e);

	        //阻止浏览器默认的缩放和滚动
	        untilEvent.preventDefault(e);

	        var $target = $(target);

	        drag.startTouchPos.X = e.targetTouches[0].clientX;
	        drag.startTouchPos.Y = e.targetTouches[0].clientY;

	        drag.position.X = $target.offset().left;
	        drag.position.Y = $target.offset().top;

	        drag.touchPos.X = e.targetTouches[0].clientX;
	        drag.touchPos.Y = e.targetTouches[0].clientY;

	        drag.touchOffsetPos.X = drag.touchPos.X - drag.position.X;
	        drag.touchOffsetPos.Y = drag.touchPos.Y - drag.position.Y;

	        var isSupport = supportCanvas();
	        var strClass = $target.parent().attr('class');
	        var flag = false;
	        if(strClass.indexOf('swiper-wrapper') < 0 ) {
	            flag = true;
	        }
	        if(strClass.indexOf('swiper-wrapper') >= 0 && $target.siblings().length <= 0){
	            flag = true;
	            //确保移动的是相框
	            $target = $target.parents('.swiper-container');
	        }
	        if(flag) {
	            //创建一个canvas,canvas的尺寸与目标元素的尺寸有关
	            if (isSupport) {
	                drag.canvas = getCanvas($target);
	            }
	        }
	        //给目标元素绑定touchMove事件
	        untilEvent.addEvent(target,'touchmove',drag.touchMove);

	        //给目标元素绑定touchMove事件
	        untilEvent.addEvent(target,'touchend',drag.touchEnd);
	    },
	    touchMove:function(event){

	        var e = untilEvent.getEvent(event);
	        var target = untilEvent.getTarget(e);

	        //阻止冒泡
	        untilEvent.stopPropagation(e);

	        //阻止浏览器默认的缩放和滚动
	        untilEvent.preventDefault(e);

	        var $target = $(target);
	        //获得触摸点的位置
	        drag.touchPos.X = e.targetTouches[0].clientX;
	        drag.touchPos.Y = e.targetTouches[0].clientY;
	        var strClass = $target.parent().attr('class');
	        var flag = false;
	        if(strClass.indexOf('swiper-wrapper') < 0 ) {
	            flag = true;
	        }
	        if(strClass.indexOf('swiper-wrapper') >= 0 && $target.siblings().length <= 0){
	            flag = true;
	            //确保移动的是相框
	            $target = $target.parents('.swiper-container');
	        }
	        if(flag){
	            //修改移动块的位置
	            $target.offset({
	                top: drag.touchPos.Y - drag.touchOffsetPos.Y,
	                left: drag.touchPos.X - drag.touchOffsetPos.X
	            });
	            //如果canvas存在就修改canvas的位置
	            if(drag.canvas){
	                var padding = 200;
	                //之所以要减一，是因为参考线的宽度为1
	                drag.canvas.css({
	                    'display':'block',
	                    'top':(drag.touchPos.Y - drag.touchOffsetPos.Y) - padding-1,
	                    'left':(drag.touchPos.X - drag.touchOffsetPos.X) -padding-1
	                });
	            }
	            var control = $('#' + drag.control);
	            drag.isCover = position.compare(control.children(),$target);
	        }

	    },
	    touchEnd:function(event) {
	        var e = untilEvent.getEvent(event);
	        var target = untilEvent.getTarget(e);

	        //阻止冒泡
	        untilEvent.stopPropagation(e);

	        //阻止浏览器默认的缩放和滚动
	        untilEvent.preventDefault(e);
	        //将canvas从控制台移除
	        if(drag.canvas) {
	            drag.canvas.remove();
	            drag.canvas = undefined;
	        }

	        var $target = $(target);
	        var parent = $target.parent();
	        var strClass = parent.attr('class');
	        //这种情况是已经选择了相框中的图案了
	        var other = strClass.indexOf('swiper-wrapper') >= 0 && $target.siblings().length <=0;
	        if(other){
	            $target = $target.parents('.swiper-container');
	            parent = $target.parent();
	        }
	        if (Math.abs(drag.startTouchPos.X - drag.touchPos.X) > 2 || Math.abs(drag.startTouchPos.Y - drag.touchPos.Y) > 2) {
	            if(strClass.indexOf('swiper-wrapper') < 0  || other) { //移动块，而非切换图案

	                var elem = undefined;

	                //得到控制台和拖动元素列表的父元素
	                var control = $("#" + drag.control);
	                var dragListPar = $('#' + drag.dragParent);



	                //拖动元素是否位于控制台,
	                var sitControl = position.isRang(control, dragListPar, $target);

	                //拖动结束后，如果拖拽元素的父元素是拖拽列表
	                if (parent.attr('id') === drag.dragParent) {
	                    //如果元素位于控制台并且没有覆盖
	                    if (sitControl && !drag.isCover) {
	                        var dragChild = transition.createSwiperElem($target);

	                        //为克隆出的元素绑定touchstart事件
	                        untilEvent.addEvent(dragChild[0], 'touchstart', drag.touchStart);

	                        //将克隆出的元素插入到控制台
	                        position.addTo(dragChild, control, $target);

	                        //将拖拽后生成的元素赋给elem
	                        elem = dragChild;

	                    }

	                    //将原来的触摸元素恢复到初始位置
	                    position.restore($target);
	                    //隐藏提示
	                    control.find('#notice').hide();
	                }
	                // 拖拽结束后，如果拖拽元素的父元素是控制台
	                if (parent.attr('id') === drag.control ) {
	                    //将拖拽的元素赋给elem
	                    elem = $target;

	                    //没有位于控制台
	                    if(!sitControl) {
	                        $target.remove();
	                    }

	                    //存在覆盖
	                    if(drag.isCover){
	                        //隐藏提示
	                        $(control.find('#notice')).hide();

	                        //返回原来的位置
	                        $target.css({
	                            top:$target.attr('coordY') + 'px',
	                            left:$target.attr('coordX') + 'px'
	                        });

	                    }

	                }

	                //将坐标保存在属性中，返回原来位置会用到
	                if(elem) {
	                    elem.attr({
	                        'coordX': elem.offset().left,
	                        'coordY': elem.offset().top
	                    });
	                }


	            }else{//切换图案
	                   switchPic($target);
	                }

	        } else {//点击控制台上的元素

	            if(parent.attr('id') === drag.control){

	                //放大
	                transition.magnify($target);
	            }
	        }
	    }
	};
	module.exports = drag;


	//判断浏览器是否支持canvas
	function supportCanvas(){
	    return !!$('<canvas></canvas>')[0].getContext;
	}
	//创建一个canvas
	function getCanvas(target){
	    var canvas = $('<canvas class="canvas"></canvas>');
	    var padding = 200;
	    canvas[0].height = target.height() + 2*padding;
	    canvas[0].width = target.width() + 2*padding;
	    canvas.css({
	        'position':'absolute',
	        'display':'none',
	        'z-index':11
	    });
	    var control = $("#"+drag.control);
	    control.append(canvas);
	    draw(canvas[0],padding);
	    return canvas;
	}
	//画参考线
	function draw(canvas,padding){
	    var context = canvas.getContext('2d');

	    //画横线
	    drawDash(context,0,canvas.width,padding,padding,10);
	    drawDash(context,0,canvas.width,canvas.height - padding,canvas.height - padding,10);
	    //画竖线
	    drawDash(context,padding,padding,0,canvas.height,10);
	    drawDash(context,canvas.width - padding,canvas.width - padding,0,canvas.height,10);

	    context.strokeStyle = '#333';
	    context.stroke();
	}
	function drawDash(ctx,x1,x2,y1,y2,dashLen){
	    var offsetLenX = Math.abs(x1 - x2),
	        offsetLenY = Math.abs(y1 - y2),
	        dashLength = !dashLen ? 5 : dashLen,
	        dashNum = offsetLenX ? Math.floor(offsetLenX / dashLength) : Math.floor(offsetLenY / dashLength);

	    if(offsetLenX){//画水平线,y1和y2相等
	        for(var i=0; i<dashNum; i++){
	            if(i % 2 === 0){
	                ctx.moveTo(x1 + (offsetLenX/dashNum) * i,y1);
	            }else{
	                ctx.lineTo(x1 + (offsetLenX/dashNum) * i, y1);
	            }
	        }
	    }else {//画竖直线，x1和x2相等
	        for (var i = 0; i < dashNum; i++) {
	            if (i % 2 === 0) {
	                ctx.moveTo(x1, y1 + (offsetLenY / dashNum) * i);
	            } else {
	                ctx.lineTo(x1, y1 + (offsetLenY / dashNum) * i)
	            }
	        }
	    }

	}
	//切换图案
	function switchPic($target){

	    var marginLeft = undefined;
	    var transitionParent = $target.parent();

	    //if语句判断滑动方向
	    if (drag.startTouchPos.X > drag.touchPos.X) {
	        marginLeft = parseInt(transitionParent.css('marginLeft'));
	        if (marginLeft > -transition.swiperElemW * (transitionParent.children().length - 1)) {

	            transitionParent.stop(false, true).animate({
	                'marginLeft': (marginLeft - transition.swiperElemW)

	            }, 200);
	        }
	    }
	    if (drag.startTouchPos.X < drag.touchPos.X) {
	        marginLeft = parseInt(transitionParent.css('margin-left'));

	        if (marginLeft < 0) {
	            transitionParent.stop(false, true).animate({
	                'marginLeft': (marginLeft + transition.swiperElemW)
	            }, 200);
	        }
	    }
	}




/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/10/20.
	 */

	var $ = __webpack_require__(3);

	var position = {
	    //初始化位置
	    init:function(parent,gap){
	        var dragElem = parent.children();

	        //确保父元素是相对定位
	        if(parent.css('position') !== "relative"){
	            parent.css('position','relative');
	        }
	        parent.css({
	            'width':"100%",
	            'z-index':'12'
	        });
	        //当前列表内容的宽度
	        var ListWidth = 0;


	        //位于第几行
	        var i = 0;
	        //位于第几列
	        var j = 0;
	        dragElem.each(function(index,elem){
	            var curEle = $(elem);

	            //设置元素的初始位置
	            curEle.css({
	                position:"absolute",
	                zIndex:12,
	//                top:(i+1) * gap.Y + i*curEle.height(),
	//                left:(j+1) * gap.X + j*curEle.width()
	                top:gap.Y,
	                left:ListWidth + gap.X
	            });

	                //为每个元素添加一个唯一的标识，在恢复初始位置时有用
	            curEle.attr('index',index);

	            //将元素的初始位置保存起来
	            position.coord.push({
	                X:ListWidth + gap.X,
	                Y:gap.Y
	            });

	            //判断是否换行
	//            if( parseInt(curEle.css('left')) + curEle.width() + curEle.next().width() + gap.X >= parentW - gap.Y){
	//                i++;
	//                j=0;
	//            }else{
	//                j++;
	//            }
	            j++;

	            //设置父元素的高度
	            parent.height( parseInt(curEle.css('top')) + curEle.height() + gap.Y);

	            ListWidth = curEle.offset().left + curEle.width();
	        });
	    },
	    //将子元素插入到父元素中
	    addTo:function(child,parent,target){
	        //父元素在视口的坐标
	        var parentPos = {
	            X:parent.offset().left,
	            Y:parent.offset().top
	        };

	        //目标位置相对于视口的坐标
	        var targetPos = {
	            X:target.offset().left,
	            Y:target.offset().top
	        };

	        //确保父元素是相对定位
	        if(parent.css('position') !== "relative"){
	            parent.css({
	                'position':'relative'
	            });
	        }

	        parent.css({
	            'z-index':'12'
	        });
	        //将子元素插入父元素中
	        parent.append(child);

	        //修改子元素在父元素中的位置
	        child.css({
	            top:targetPos.Y - parentPos.Y,
	            left:targetPos.X - parentPos.X
	        });

	    },
	    //将元素恢复到原来的位置
	    restore:function(elem){
	        //获得元素的标识
	        var index = parseInt( elem.attr('index') );
	        elem.css({
	            top:position.coord[index].Y,
	            left:position.coord[index].X
	        });

	    },
	    //拖拽元素的初始坐标
	    coord:[],
	    //判断元素A是否在元素B的范围内
	    isRang:function(control,dragListPar,$target){
	        var isSituate = undefined;
	        if(control.offset().top > dragListPar.offset().top){
	            isSituate = $target.offset().top > control.offset().top
	                        && $target.offset().left > control.offset().left
	                        && ($target.offset().left + $target.width()) < (control.offset().left + control.width());
	        }else{
	            isSituate = ($target.offset().top + $target.height())<(control.offset().top + control.height())
	                        && $target.offset().top > control.offset().top
	                        && $target.offset().left > control.offset().left
	                        &&  ($target.offset().left + $target.width()) < (control.offset().left + control.width());
	        }
	        return isSituate;
	    },
	    //相交检测
	    compare:function(list,curElem){
	        var gap = 30;
	        var isCover = undefined,Booleans = undefined;
	        var control = $(list[0]).parent();
	        var info =  control.find('#notice');
	        $.each(list,function(index,elem){

	            var comPE = $(elem);

	            //不能和自己进行比较
	            if(comPE.attr('id') !== curElem.attr('id') && comPE.attr('id') !== 'notice' && comPE.attr('class') !=='canvas') {
	                //元素的位置
	                var curElemPos = curElem.offset();
	                var comPEPos = comPE.offset();

	                //curElem的投影
	                var curElemShadow_x = [curElemPos.left, curElemPos.left + curElem.width()];
	                var curElemShadow_y = [curElemPos.top, curElemPos.top + curElem.height()];

	                //comPE的投影
	                var comPEShadow_x = [comPEPos.left - gap, comPEPos.left + comPE.width() + gap];
	                var comPEShadow_y = [comPEPos.top - gap, comPEPos.top + comPE.height() + gap];

	                //检测是否X轴上相交
	                var intersect_x = (curElemShadow_x[0] > comPEShadow_x[0] && curElemShadow_x[0] < comPEShadow_x[1])
	                    || (curElemShadow_x[1] > comPEShadow_x[0] && curElemShadow_x[1] < comPEShadow_x[1]);

	                //检测是否Y轴上相交
	                var intersect_y = (curElemShadow_y[0] > comPEShadow_y[0] && curElemShadow_y[0] < comPEShadow_y[1])
	                    || (curElemShadow_y[1] > comPEShadow_y[0] && curElemShadow_y[1] < comPEShadow_y[1]);

	                Booleans = intersect_x && intersect_y;


	                if (index == 0) {
	                    isCover = Booleans;
	                } else {
	                    isCover = isCover || Booleans;
	                }

	                if (isCover) {

	                    info.height(comPE.height() + 2*gap)
	                        .width(comPE.width() + 2*gap)
	                        .css({
	                            'top':comPEPos.top - gap,
	                            'left':comPEPos.left - gap,
	                            'display':'block'
	                        });
	                    return false;

	                }else{
	                    info.css({
	                        'display':'none'
	                    });
	                }
	            }

	        });
	       return isCover

	    }

	};
	module.exports = position;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/10/24.
	 */
	var $ = __webpack_require__(3);
	var untilEvent = __webpack_require__(4);
	var drag = __webpack_require__(5);
	var ajax = __webpack_require__(8);


	var transition = {
	    swiperElemW:undefined,
	    swiperElemH:undefined,

	    //添加相框中的素材
	    addSwiper: function (swiperElem) {

	        var elem = swiperElem.find('.swiper-wrapper');

	          ajax.getPic(elem,swiperElem);


	        elem.find('.swiper-slide').each(function(){
	            var $this = $(this);
	            untilEvent.addEvent($this[0],'touchstart',drag.touchStart);
	        });



	    },

	    //生成控制台上的元素
	    createSwiperElem: function (elem) {
	        var src = elem.attr('src');


	        var swiperElem = $('<div class="swiper-container" id="swiperEle'+Math.random()+'"></div>')
	                        .css({
	                            'position':'absolute',
	                             'z-index':'12',
	                            'background': "transparent url(" + src + ") no-repeat center center",
	                            'height':parseInt(elem.height()),//宽高和列表中使相同的宽高
	                            'width':parseInt(elem.width()),
	                            'background-size':'100% '
	                        });
	        //将id中的小数点去掉
	        swiperElem.attr('id',swiperElem.attr('id').replace('.',""));

	        var warp = $('<ul class="swiper-wrapper clearfix"></ul>')
	                        .css({
	                            'margin-left':0
	                        });
	        swiperElem.append(warp);

	        return swiperElem;
	    },



	    magnify:function(swiperElem){
	         swiperElem.find('ul').html("");
	        //添加一个蒙层
	        addMask($('body'));

	        //得到这个元素放大前的宽度和高度
	        var W = swiperElem.width();
	        var H = swiperElem.height();

	        //得到父元素的高度和宽度
	        var P = swiperElem.parent();
	        var PW = P.width();
	        var PH = P.height();

	        //将这个元素放大前的尺寸缓存起来
	        swiperElem.data({
	            width:W,
	            height:H
	        });
	        //获得这个元素的所有兄弟元素
	        var sibElem = swiperElem.siblings();

	        //让其他相框元素不显示
	        sibElem.each(function(index,elem){
	            $(elem).css({
	                'display':'none'
	            });
	        });

	        //添加一个确认按钮
	        var btnOk = createBtn({
	            'position':'absolute',
	            'bottom':'10px',
	            'right':'10px',
	            'color':'#ffffff',
	            'background-color':'red',
	            'box-shadow':'3px',
	            'padding':'5px 15px',
	            'border':'none'
	        },'btnOK btn','btnOk', '确定');

	        swiperElem.append(btnOk);
	        //通过触摸事件给确认按钮模拟一个点击事件
	        clickHander(btnOk);


	        //添加一个取消按钮
	        var btnNO = createBtn({
	            'position':'absolute',
	            'bottom':'10px',
	            'left':'10px',
	            'color':'#ffffff',
	            'background-color':'red',
	            'box-shadow':'3px',
	            'padding':'5px 15px',
	            'border':'none'
	        },'btnNO btn','btnNO', '清除');

	        swiperElem.append(btnNO);
	        //通过触摸事件给确认按钮模拟一个点击事件
	        clickHander(btnNO);
	        swiperElem.css({
	            'background-color':"#fff"
	        });

	        //放大被点击的元素
	        //使得所有比例的图案都能够在控制台中完全并且按照他的比例显示
	        if(swiperElem.height() / swiperElem.width() >PH / PW ){
	            swiperElem.css({
	                'width':Math.ceil(0.8*PH/H*W) + 'px',
	                'height':'80%',
	                'top':'10%',
	                'left':(PW-(Math.ceil(0.8*PH/H*W)))/2 + 'px',
	                'overflow':'hidden'
	            });
	        }else{
	            swiperElem.css({
	                'width':'100%',
	                'height':Math.ceil(PW/W*H) + 'px',
	                'left':'0',
	                'top':(PH - Math.ceil(PW/W*H))/2 + 'px',
	                'overflow':'hidden'
	            });
	        }


	        this.swiperElemW = swiperElem.width();
	        this.swiperElemH = swiperElem.height();

	       //添加需要却换的图案
	        this.addSwiper(swiperElem);


	    }

	};
	module.exports = transition;


	function createBtn(style,className,ID,info){
	    var btn = $('<button class="'+className+'" id="'+ID+'">'+info+'</button>')
	        .css(style);
	    return btn
	}
	//显示当前选择的图案
	function showCurPic(elem,parent){
	    $(elem).css({
	        'width':parent.width() + 'px',
	        'height':parent.height() + 'px'
	    });
	    var PW = parent.width();
	    var PH = parent.height();
	    var W = parseInt($(elem).attr('data-W'));
	    var H = parseInt($(elem).attr('data-H'));
	    if(  PH / PW > H / W){
	        $(elem).css({
	            'background-size':'80% ' + 0.8*PW/W * H +'px'

	        })
	    }else{
	        $(elem).css({
	            'background-size': 0.8*PH/H * W+'px 80%'
	        })
	    }
	}
	//用触摸事件模拟点击事件
	function clickHander(btn){
	    btn.unbind('touchstart').on('touchstart',function(event){
	        //阻止事件冒泡或事件捕获
	        event.stopPropagation();
	        //取消默认行为
	        event.preventDefault();
	        var $this = $(this);
	        //将触摸点的坐标缓存起来
	        $this.data({
	            'startX':event.targetTouches[0].clientX,
	            'startY':event.targetTouches[0].clientY
	        })
	    });

	    btn.unbind('touchmove').on('touchmove',function(event){
	        //阻止事件冒泡或事件捕获
	        event.stopPropagation();
	        //取消默认行为
	        event.preventDefault();
	        var $this = $(this);
	        //将触摸点的坐标缓存起来
	        $this.data({
	            'touchX':event.targetTouches[0].clientX,
	            'touchY':event.targetTouches[0].clientY
	        })
	    });

	    btn.unbind('touchend').on('touchend',function(event){
	        //阻止事件冒泡或事件捕获
	        event.stopPropagation();
	        //取消默认行为
	        event.preventDefault();
	        var $this = $(this);
	        $this.data('touchX') ? offsetX = Math.abs($this.data('startX') - $this.data('touchX')):undefined;
	        $this.data('touchY') ? offsetY = Math.abs($this.data('startY') - $this.data('touchY')):undefined;
	        if(!$this.data('touchX') || offsetX<2&&offsetY<2){//如果没有滑动不会触发touchmove事件，所有$(this).data('touchX')为understand


	            var parent = $this.parent();
	            //将控制台上的所有相框显示出来
	            parent.siblings().each(function(index,elem){
	                if($(elem).attr('id') !== 'notice') {
	                    $(elem).css('display', 'block');
	                }
	            });
	            //让该元素恢复到放大前的位置和大小
	            parent.css({
	                'top':parent.attr('coordy') + 'px',
	                'left':parent.attr('coordx') + 'px',
	                'width':parent.data('width') + 'px',
	                'height':parent.data('height') + 'px',
	                'background-color':'transparent'
	            });
	            //获取相框中的图案列表
	            var list = parent.find('.swiper-wrapper');
	            //获得当前的marginLeft值
	            var marginLeft = -parseInt(list.css('marginLeft'));
	            //将marginLeft保存起来
	            list.data({
	                'marginLeft':-marginLeft
	            });
	            //将margLeft恢复到0
	            list.css({
	                'margin-left':'0',
	                'width':"100%"
	            });

	            //获得当前显示的是第几张印图
	            var i = parseInt(marginLeft / transition.swiperElemW);
	            list.children().each(function(index,elem){
	                if (index !== i) {
	                    $(elem).remove();
	                } else {
	                    if($this.attr('id') === 'btnOk') {//点击的是确认按钮
	                        //显示当前现在的图案
	                        showCurPic(elem, parent);
	                    }else{
	                        $(elem).remove();
	                    }
	                }

	            });
	            //移除蒙层
	            $('#mask').remove();
	            //移除另一个按钮
	            $this.siblings('.btn').remove();
	            //将btn移除
	            $this.remove();

	        }
	    });
	}
	//添加蒙层
	function addMask(elem){
	    var mask = $('<div class="mask" id="mask"></div>')
	        .css({
	            'position':'absolute',
	            'top':'0',
	            'right':'0',
	            'left':'0',
	            'bottom':'0',
	            'opacity':'0.8',
	            'background-color':'#000000',
	            'z-index':'11'
	        });
	    elem.append(mask);
	}



/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/10/21.
	 */

	var $ = __webpack_require__(3);

	var ajax = {
	    //得到可拖拽图片的初始列表
	    getInitImg:function(parent,gap){
	        var num  = 50;
	        $.ajax({
	            type:"GET",
	            async:false,
	            url:'/Home/picwall/index',
	            success:function(result){
	                if(result.status == 1) {
	                    $.each(result.data, function (index,item) {
	                        var src = item.pic_src;
	                        var width = parseInt(item.width);
	                        var height = parseInt(item.height);
	                        var ratio = num / height;
	                        var img = $('<img>')
	                            .attr("src",src)
	                            .height(num)
	                            .width(parseInt(width * ratio));
	                        parent.append(img);
	                    });
	                }
	            },
	            dataType:'json'
	        });
	    },
	    //请求相框里的图案
	    getPic:function(elem,swiperElem){

	        var swiperElemW = swiperElem.width();
	        var swiperElemH = swiperElem.height();
	        var num = 50;
	        //显示之前却换到的图案
	        if(elem.data('marginLeft')){
	            elem.css({
	                'marginLeft':elem.data('marginLeft')
	            })
	        }
	        $.ajax({
	           type:'GET',
	            async:false,
	            url:'/Home/picwall/mater',
	            error:function(){
	                console.log('error');
	            },
	            success:function(result){
	                if(result.status == 1){
	                    $.each(result.data,function(index,item){
	                        var W = item.width;
	                        var H = item.height;
	                        var li = $('<li class="item swiper-slide"></li>')
	                                    .css({
	                                        'background':"url(" + item.ma_src + ") no-repeat center center",
	                                         "height": parseInt(swiperElemH),
	                                          "width": parseInt(swiperElemW),
	                                          "float":'left'
	                                    })
	                                    //下面两个属性在确定所选图案时，会用
	                                    .attr({
	                                        'data-w':parseInt(num/H * W),
	                                         'data-H':num
	                                    });
	//
	                          if( swiperElemH / swiperElemW > H / W){
	                              li.css({
	                                  'background-size':'80% ' + 0.8*swiperElemW/W * H +'px'

	                              })
	                          }else{
	                              li.css({
	                                  'background-size': 0.8*swiperElemH/H * W+'px 80%'
	                              })
	                          }


	                        //每添加一个图案就增加图案父元素的宽度
	                        elem.width(swiperElemW * (++index));
	                        elem.append(li);
	                    });
	                }
	            },
	            dataType:'json'
	        });

	        swiperElem.append(elem);
	    }
	};

	module.exports  = ajax;

/***/ }
]);