/**
 * Created by Administrator on 2016/10/20.
 */



var $ = require('jquery');
var position = require('./position.js');
var transition = require('./transition.js');
var canvas = require('./canvas.js');
var canvasObj = canvas();
var scale = require('./scale.js');
var scaleObj = scale();

var drag = {
    //拖拽列表的id值
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
    //触摸点相对于移动块的位置
    touchOffsetPos:{
        X:undefined,
        Y:undefined
    },
    //是否重叠
    isCover:undefined,
    //canvas用于生成参考线
    canvas:undefined,

    /**
     * 获取拖拽列表id和控制台的ID的值
     * @param dragList 拖拽列表的id属性
     * @param control 控制台的id属性
     * @private
     */
    __setID:function(dragList,control){
        this.dragParent = dragList;
        this.control = control;
    },
    /**
     * 初始化drag模块，包括定位和绑定事件
     * @param dragDOM drag模块的包裹节点，最外层的节点
     * @param ajaxObj 发送ajax的对象
     */
    init:function(dragDOM,ajaxObj){
        
        //将控制台重置为未放大状态
        scaleObj.controlMagnify = false;
        drag.__setID('dragList','control');
        //设置拖拽列表的高度
        var listContent = dragDOM.find('#content');
        var height = ($(window).height() * 0.21) | 0;
        listContent.height(height);

        //綁定拖拽事件
        listContent.find('.pic').each(function(index,cur){
            drag.listener($(cur),'touchstart',drag.touchStart);
        });
        //给放大缩小的icon定位
        var magnify = dragDOM.find('#magnify');
        magnify.css({
            'bottom':height + 20 + 'px'
        });

        //控制台
        var control = dragDOM.find('#' + this.control);
        //控制台能够显示的最大尺寸
        var controlMaxSize = {
            W:control.width(),
            H:$(window).height() - 52 - (height + 20 + magnify.height())
        };
        //控制台能够放大的最大尺寸受高度控制
        scaleObj.controlMaxSize = {
            H:controlMaxSize.H
        };


        //照片墙的真实尺寸，单位是cm
        var wallSize = {
            W:dragDOM.attr('data-width') | 0,
            H:dragDOM.attr('data-height') |0
        };

        var rateWall = wallSize.H / wallSize.W;
        var rateControl = controlMaxSize.H / controlMaxSize.W;
        if( rateWall> rateControl){
            var controlH = controlMaxSize.H * 0.8;
            control.height(controlH | 0).width(controlH/wallSize.H*wallSize.W | 0);
        }else{
            control.width(controlMaxSize.W).height(rateWall * controlMaxSize.W | 0)
        }
        //将控制台放大前的尺寸保存起来
            scaleObj.controlOriginalSize = {
                H:control.height(),
                W:control.width()
            };

        scaleObj.controlRate = scaleObj.controlMaxSize.H / scaleObj.controlOriginalSize.H;

        //给放大缩小icon绑定事件
        drag.listener(magnify,'click',scale);

        function scale(event){
            scaleObj.controlScale(event,control);
        }

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

        //初始化当前是第1页
        listContent.data({
            page:1
        });
        var next = dragDOM.find('#next');
        var prev = dragDOM.find('#prev');
        //翻页
        drag.listener(next,'click',clickPage);
        drag.listener(prev,'click',clickPage);

        function clickPage(event){
            turnPage(event,ajaxObj);
        }

    },
    /**
     * 注册事件
     * @param elem jquery节点，需要注册事件的元素
     * @param eventname 字符串 ，要註冊的事件名
     * @param handler 函數， 事件處理程序
     */
    listener:function(elem,eventname,handler){
        elem.unbind(eventname).on(eventname,handler);
    },
    touchStart:function(event){
        //阻止冒泡
        event.stopPropagation();

        //阻止浏览器默认的缩放和滚动
        event.preventDefault();

        var $target = $(event.target);
        //实际要移动的节点
        var moveElem = $target.parent('.picGroup');

        drag.startTouchPos.X = event.targetTouches[0].clientX;
        drag.startTouchPos.Y = event.targetTouches[0].clientY;

        drag.touchOffsetPos.X = drag.startTouchPos.X - moveElem.offset().left;
        drag.touchOffsetPos.Y = drag.startTouchPos.Y - moveElem.offset().top;
        var control = $('#' + drag.control);
        //相框从列表拖到控制台要缩放的比例

        var scale = scaleObj.controlOriginalSize.W / ($('#drag').attr('data-width') | 0);
        var baseScale = scale;
        //如果控制台处于放大的状态
        if(scaleObj.controlMagnify){
            scale = scale * scaleObj.controlRate;
        }
        //修改相框的尺寸,并将尺寸保存在属性
        var frame = moveElem.children().first('img');
        frame
            .height( ( (frame.attr( 'data-theight' ) | 0) * scale) | 0)
            .width( ( (frame.attr( 'data-twidth' ) | 0) * scale ) | 0)
            .attr({
                'originalWidth': ( (frame.attr( 'data-twidth' ) | 0) * baseScale ) | 0,
                'originalHeight':  ( (frame.attr( 'data-theight' ) | 0) * baseScale ) | 0
            });


        drag.canvas = canvasObj.createCanvas(moveElem,control);
        //给目标元素绑定touchMove事件
        drag.listener($target,'touchmove',drag.touchMove);

        //给目标元素绑定touchend事件
        drag.listener($target,'touchend',drag.touchEnd);
    },
    touchMove:function(event){

        //阻止冒泡
        event.stopPropagation();

        //阻止浏览器默认的缩放和滚动
        event.preventDefault();

        var $target = $(event.target);
        //实际要移动的节点
        var moveElem = $target.parent('.picGroup');

        //获得触摸点的位置
        drag.touchPos.X = event.targetTouches[0].clientX;
        drag.touchPos.Y = event.targetTouches[0].clientY;

        //修改移动块的位置
        moveElem.offset({
            top: (drag.touchPos.Y - drag.touchOffsetPos.Y) | 0,
            left: (drag.touchPos.X - drag.touchOffsetPos.X) | 0
        });
        //得到控制台和拖动元素列表的祖先元素
        var control = $("#" + drag.control);
        var dragListPar = $('#' + drag.dragParent);


        var controlOffset = undefined;
        if(!controlOffset){
            controlOffset = getControlOffset(control);
        }

        //拖动元素是否位于控制台的范围内,
        var sitControl = position.isRang(control, dragListPar, moveElem);

        //如果canvas存在就修改canvas的位置
        if(drag.canvas && sitControl ){
            var padding = canvasObj.padding;
            //之所以要减一，是因为参考线的宽度为1
            drag.canvas.css({
                'display':'block',
                'top':(drag.touchPos.Y - drag.touchOffsetPos.Y) - controlOffset.top - padding-1,
                'left':(drag.touchPos.X - drag.touchOffsetPos.X) - controlOffset.left - padding-1
            });
        }
        if(!sitControl){
            drag.canvas.css({
                'display':'none'
            })
        }
        drag.isCover = position.compare(control,moveElem);


    },
    touchEnd:function(event) {
        //阻止冒泡
        event.stopPropagation();

        //阻止浏览器默认的缩放和滚动
        event.preventDefault();

        //将canvas从控制台移除
        if(drag.canvas) {
            drag.canvas.remove();
            drag.canvas = undefined;
        }
        var $target = $(event.target);
        var moveElem = $target.parent('.picGroup');

        //得到控制台和拖动元素列表的祖先元素
        var control = $("#" + drag.control);
        var dragListPar = $('#' + drag.dragParent);

        var controlOffset = getControlOffset(control);

        //拖动元素是否位于控制台的范围内,
        var sitControl = position.isRang(control, dragListPar, moveElem);

        //如果被移动的元素是拖拽列表的后代
        if(isOffspring(moveElem,drag.dragParent)){

            //如果元素位于控制台范围并且没有覆盖
            if(sitControl && !drag.isCover){
                var newMoveElem = moveElem.clone();
                //添加一个唯一标识，与数据库无关
                newMoveElem.attr('id',(""+Math.random()).replace('.',"_"));

                //注册事件
                drag.listener(newMoveElem.find('.pic'),'touchstart',drag.touchStart);
                //将克隆粗出的元素插入控制台
                position.addTo(newMoveElem,control,moveElem);

                newMoveElem
                    .css({
                        'position':'absolute'
                    })
                    .attr({
                        'coordX': newMoveElem.offset().left - controlOffset.left,
                        'coordY': newMoveElem.offset().top - controlOffset.top
                    });
            }
            //将移动元素恢复到初始位置
            position.restore(moveElem);
            //隐藏提示
            control.find('#notice').hide();

        }else{
            if(!sitControl){
                moveElem.remove();
            }
            //回复到原来的位置
            if(drag.isCover){
                //隐藏提示
                control.find('#notice').hide();
                moveElem.css({
                    'top':moveElem.attr('coordY') + 'px',
                    'left':moveElem.attr('coordX') + 'px'
                });
            }
            //修改coordX和coordY屬性
            moveElem
                .attr({
                    'coordX': moveElem.offset().left - controlOffset.left,
                    'coordY': moveElem.offset().top - controlOffset.top
                });
        }
//        var parent = $target.parent();
//        var strClass = parent.attr('class');
//        //这种情况是已经选择了相框中的图案了
//        var other = strClass.indexOf('swiper-wrapper') >= 0 && $target.siblings().length <=0;
//        if(other){
//            $target = $target.parents('.swiper-container');
//            parent = $target.parent();
//        }
//        if (Math.abs(drag.startTouchPos.X - drag.touchPos.X) > 2 || Math.abs(drag.startTouchPos.Y - drag.touchPos.Y) > 2) {
//            if(strClass.indexOf('swiper-wrapper') < 0  || other) { //移动块，而非切换图案
//
//                var elem = undefined;
//
//                //得到控制台和拖动元素列表的父元素
//                var control = $("#" + drag.control);
//                var dragListPar = $('#' + drag.dragParent);
//
//
//
//                //拖动元素是否位于控制台,
//                var sitControl = position.isRang(control, dragListPar, $target);
//
//                //拖动结束后，如果拖拽元素的父元素是拖拽列表
//                if (parent.attr('id') === drag.dragParent) {
//                    //如果元素位于控制台并且没有覆盖
//                    if (sitControl && !drag.isCover) {
//                        var dragChild = transition.createSwiperElem($target);
//
//                        //为克隆出的元素绑定touchstart事件
//                        untilEvent.addEvent(dragChild[0], 'touchstart', drag.touchStart);
//
//                        //将克隆出的元素插入到控制台
//                        position.addTo(dragChild, control, $target);
//
//                        //将拖拽后生成的元素赋给elem
//                        elem = dragChild;
//
//                    }
//
//                    //将原来的触摸元素恢复到初始位置
//                    position.restore($target);
//                    //隐藏提示
//                    control.find('#notice').hide();
//                }
//                // 拖拽结束后，如果拖拽元素的父元素是控制台
//                if (parent.attr('id') === drag.control ) {
//                    //将拖拽的元素赋给elem
//                    elem = $target;
//
//                    //没有位于控制台
//                    if(!sitControl) {
//                        $target.remove();
//                    }
//
//                    //存在覆盖
//                    if(drag.isCover){
//                        //隐藏提示
//                        $(control.find('#notice')).hide();
//
//                        //返回原来的位置
//                        $target.css({
//                            top:$target.attr('coordY') + 'px',
//                            left:$target.attr('coordX') + 'px'
//                        });
//
//                    }
//
//                }
//
//                //将坐标保存在属性中，返回原来位置会用到
//                if(elem) {
//                    elem.attr({
//                        'coordX': elem.offset().left,
//                        'coordY': elem.offset().top
//                    });
//                }
//
//
//            }else{//切换图案
//                   switchPic($target);
//                }
//
//        } else {//点击控制台上的元素
//
//            if(parent.attr('id') === drag.control){
//
//                //放大
//                transition.magnify($target);
//            }
//        }
    }
};
module.exports = drag;
/**
 * 发送翻页请求
 * @param event 事件处理对象
 * @param ajaxObj ajax对象
 */
function turnPage(event,ajaxObj){
    event.preventDefault();
    event.stopPropagation();
    //可拖拽相框列表
    var listContent = $('#content');
    var page = listContent.data('page');
    var _target = $(event.target);
    if(_target.attr('id') === 'next'){
        listContent.data({
            'page':++page
        });
    }else if(_target.attr('id') === 'prev'){

        //如果当前就为第一页，不发送请求，也不改变当前的页码
        if(page <= 1){
            return;
        }

        listContent.data({
            'page':--page
        });
    }
    ajaxObj.turnPage(page);
}
/**
 * 判断是否为后代元素
 * @param ancestor 祖先的id属性
 * @param offspring 后代
 */
function isOffspring(offspring,ancestor){
    return offspring.parents('#' + ancestor).length > 0;
}
/**
 * 获得节点相对于屏幕的偏移值
 * @param elem
 */
function getControlOffset(elem){
    return {
        top:elem.offset().top,
        left:elem.offset().left
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


