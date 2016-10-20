/**
 * Created by Administrator on 2016/10/20.
 */

var $ = require('jquery');
var untilEvent = require('./untilEvent.js');
var drag = {
    //移动块相对视口的位置
    position:{
        X:undefined,
        Y:undefined
    },
    //触摸点相对视口的位置
    touchPos:{
        X:undefined,
        Y:undefined
    },
    //触摸块相对于移动块的位置
    touchOffsetPos:{
        X:undefined,
        Y:undefined
    },
    touchStart:function(event){
        var e = untilEvent.getEvent(event);
        var target = untilEvent.getTarget(e);

        //阻止冒泡
        untilEvent.stopPropagation(e);

        var $target = $(target);

        drag.position.X = $target.offset().left;
        drag.position.Y = $target.offset().top;

        drag.touchPos.X = e.targetTouches[0].clientX;
        drag.touchPos.Y = e.targetTouches[0].clientY;

        drag.touchOffsetPos.X = drag.touchPos.X - drag.position.X;
        drag.touchOffsetPos.Y = drag.touchPos.Y - drag.position.Y;

        //给目标元素绑定touchMove事件
        untilEvent.addEvent(target,'touchmove',drag.touchMove);
    },
    touchMove:function(event){
        var e = untilEvent.getEvent(event);
        var target = untilEvent.getTarget(e);

        //阻止冒泡
        untilEvent.stopPropagation(e);

       var $target = $(target);

        //如果目标元素上的手指超过一个，阻止默认行为
        if(e.targetTouches.length > 1){

            untilEvent.preventDefault(e);

        }else{

            //获得触摸点的位置
            drag.touchPos.X = e.targetTouches[0].clientX;
            drag.touchPos.Y = e.targetTouches[0].clientY;

            //修改移动块的位置
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
