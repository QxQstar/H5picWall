/**
 * Created by Administrator on 2016/11/4.
 */
'use strict';
var DEFAULT_INTERVAL = 1000/60;
/**
 * raf
 */
var requestAnimationFrame = (function(){
    return window.requestAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback){
            return window.setTimeout(callback,callback.interval || DEFAULT_INTERVAL);
        }
})();

var cancelRequestAnimationFrame = (function(){
    return window.cancelRequestAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        function(id){
            return window.clearTimeout(id);
        }
})();
//初始化状态
var STATE_INITIAL = 0;
//开始状态
var STATE_START = 1;
//停止状态
var STATE_STOP = 2;
/**
 * 时间轴类
 * @constructor
 */
function Timeline(){
    this.state = STATE_INITIAL;
    this.animationHandler = 0;

}
/**
 * 时间轴上每一次回调执行的函数
 * @param time 从动画开始到当前执行的时间
 */
Timeline.prototype.onenterFrame = function(time){

};
/**
 * 动画开始
 * @param interval 每一次回调的时间间隔
 */
Timeline.prototype.start = function(interval){
    if(this.state === STATE_START){
        return;
    }
    this.state = STATE_START;
    this.interval = interval || DEFAULT_INTERVAL;
    startTimeline(this,+new Date());
};
/**
 * 让动画停止
 */
Timeline.prototype.stop = function(){
    if(this.state !== STATE_START){
        return;
    }
    this.state = STATE_STOP;
    //如果动画开始过，则记录动画从开始到现在所经历的时间
    if(this.startTime){
        this.dur = +new Date() - this.startTime;
    }
    cancelRequestAnimationFrame(this.animationHandler);

};
/**
 * 重新开始动画
 */
Timeline.prototype.restart = function(){
    if(this.state === STATE_START){
        return;
    }
    if(!this.dur || !this.interval){
        return;
    }
    this.state = STATE_START;
    startTimeline(this,+new Date() - this.dur);
};
/**
 * 时间轴动画启动函数
 * @param timeline 时间轴实例
 * @param startTime 动画开始时间戳
 */
function startTimeline(timeline,startTime){
    timeline.startTime = startTime;
    nextTick.interval = timeline.interval;
    //上一次回调的时间戳
    var lastTick = +new Date();
    nextTick();

    /**
     * 每一帧执行的函数
     */
    function nextTick(){
        var now = +new Date();

        timeline.animationHandler = requestAnimationFrame(nextTick);

        //当前时间与上一次回调的时间戳大于设置的时间间隔，表示这次可以执行回调函数
        if(now - lastTick >= timeline.interval){
            timeline.onenterFrame(now - startTime);
            lastTick = now;
        }
    }
}
module.exports = Timeline;