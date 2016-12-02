/**
 * Created by Administrator on 2016/12/2.
 */
var $ = require('jquery');
/**
 * 展示模块的构造函数
 * @constructor
 */
function Show(){
    //ajax对象
    this.ajaxObj = null;
    //scale对象
    this.scaleObj = null;
    //照片墙的数量，默认为1
    this.length = 1;
    //当前该显示的照片的序号，从1开始排序
    this.index = 1;

}
/**
 * 修改展示模块中相框的尺寸和位置
 * @param show 展示模块 id属性为show的jquery节点
 * @param ajaxObj 对象
 */
Show.prototype.modifySize = function(show,ajaxObj){
    this.ajaxObj = ajaxObj;
    this.scaleObj = ajaxObj.scaleObj;
    var scale = this.scaleObj.transformRate;
    show.find('.picGroup').each(function(index,picGroup){
        var frame;
        frame = $(picGroup).children('img').first();
        frame
            .height(( (frame.attr('data-theight') | 0) * scale) | 0)
            .width(( (frame.attr('data-twidth') | 0) * scale ) | 0)
    });
};
/**
 * 初始化show模块，绑定必要的事件
 * @param show 要绑定事件的节点，一个jquery节点
 */
Show.prototype.init = function(show){
    var me = this;
    show.unbind('touchstart').on('touchstart',function(event){
        me.touchStart(event,me);
    });
};
/**
 * 开始触摸的事件处理程序
 * @param event 事件对象
 * @param me Show对象
 */
Show.prototype.touchStart = function(event,me){
    var $target;
    event.stopPropagation();
    event.preventDefault();
    $target = $(event.target);
    //开始触摸时的触摸点的位置
    me.startTouchPos = {
        X:event.targetTouches[0].clientX,
        Y:event.targetTouches[0].clientY
    };
    //当前触摸点的位置
    me.touchPos = {
        X:event.targetTouches[0].clientX,
        Y:event.targetTouches[0].clientY
    };

    //绑定touchmove事件
    $target.unbind('touchmove').on('touchmove',function(event){
        me.touchMove(event,me)

    });
};
/**
 * 触摸移动的事件处理程序
 * @param event 事件对象
 * @param me Show对象
 */
Show.prototype.touchMove = function(event,me){
    var $target;
    event.stopPropagation();
    event.preventDefault();
    $target = $(event.target);
    //当前触摸点的位置
    me.touchPos = {
        X:event.targetTouches[0].clientX,
        Y:event.targetTouches[0].clientY
    };

    //绑定touchend事件
    $target.unbind('touchend').on('touchend',function(event){
        me.touchEnd(event,me)
    });
};
/**
 * 触摸结束的事件处理程序
 * @param event 事件对象
 * @param me Show对象
 */
Show.prototype.touchEnd = function(event,me){
    event.stopPropagation();
    event.preventDefault();
    if(me.touchPos.X - me.startTouchPos.X > 10){
        //上一张,发送ajax请求

    }else if(me.touchPos.X - me.startTouchPos.X < -10){
        //下一张，发送ajax请求
    }else{
        return false;
    }
};
module.exports = function(){
    return new Show();
};