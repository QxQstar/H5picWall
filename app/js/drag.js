/**
 * Created by Administrator on 2016/10/20.
 */



var $ = require('jquery');
var untilEvent = require('./untilEvent.js');
var position = require('./position.js');
var transition = require('./transition.js');

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
        if($target.parent().attr('class').indexOf('swiper-wrapper') < 0 ) {
            //修改移动块的位置
            $target.offset({
                top: drag.touchPos.Y - drag.touchOffsetPos.Y,
                left: drag.touchPos.X - drag.touchOffsetPos.X
            });
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

        var $target = $(target);
        var parent = $target.parent();
            if (Math.abs(drag.startTouchPos.X - drag.touchPos.X) > 2 || Math.abs(drag.startTouchPos.Y - drag.touchPos.Y) > 2) {

                if($target.parent().attr('class').indexOf('swiper-wrapper') < 0) { //移动块，而非切换图案

                    var elem = undefined;

                    //得到控制台和拖动元素列表的父元素
                    var control = $("#" + drag.control);
                    var dragListPar = $('#' + drag.dragParent);

                    //拖动元素是否位于控制台
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

                    //将坐标保存在属性中
                    elem.attr({
                        'coordX':elem.offset().left,
                        'coordY':elem.offset().top
                    });


                }else{ //切换图案

                    var marginLeft = undefined;
                    var transitionParent = $target.parent();

                    //if语句判断滑动方向
                    if(drag.startTouchPos.X > drag.touchPos.X){
                         marginLeft = parseInt(transitionParent.css('marginLeft'));
                        if(marginLeft > -transition.swiperElemW * (transitionParent.children().length -1) ) {

                            transitionParent.stop(false,true).animate({
                                'marginLeft': (marginLeft - transition.swiperElemW)

                            },200);
                        }
                    }
                    if(drag.startTouchPos.X < drag.touchPos.X){
                        marginLeft = parseInt(transitionParent.css('margin-left'));

                        if(marginLeft < 0) {
                            transitionParent.stop(false,true).animate({
                                'marginLeft': (marginLeft + transition.swiperElemW)
                            },200);
                        }
                    }

                }

            } else {//点击控制台上的元素

                if($target.parent().attr('id') === drag.control){
                    //放大
                    transition.magnify($target);
                }
            }
    }
};
module.exports = drag;

