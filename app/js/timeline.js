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
//��ʼ��״̬
var STATE_INITIAL = 0;
//��ʼ״̬
var STATE_START = 1;
//ֹͣ״̬
var STATE_STOP = 2;
/**
 * ʱ������
 * @constructor
 */
function Timeline(){
    this.state = STATE_INITIAL;
    this.animationHandler = 0;

}
/**
 * ʱ������ÿһ�λص�ִ�еĺ���
 * @param time �Ӷ�����ʼ����ǰִ�е�ʱ��
 */
Timeline.prototype.onenterFrame = function(time){

};
/**
 * ������ʼ
 * @param interval ÿһ�λص���ʱ����
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
 * �ö���ֹͣ
 */
Timeline.prototype.stop = function(){
    if(this.state !== STATE_START){
        return;
    }
    this.state = STATE_STOP;
    //���������ʼ�������¼�����ӿ�ʼ��������������ʱ��
    if(this.startTime){
        this.dur = +new Date() - this.startTime;
    }
    cancelRequestAnimationFrame(this.animationHandler);

};
/**
 * ���¿�ʼ����
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
 * ʱ���ᶯ����������
 * @param timeline ʱ����ʵ��
 * @param startTime ������ʼʱ���
 */
function startTimeline(timeline,startTime){
    timeline.startTime = startTime;
    nextTick.interval = timeline.interval;
    //��һ�λص���ʱ���
    var lastTick = +new Date();
    nextTick();

    /**
     * ÿһִ֡�еĺ���
     */
    function nextTick(){
        var now = +new Date();

        timeline.animationHandler = requestAnimationFrame(nextTick);

        //��ǰʱ������һ�λص���ʱ����������õ�ʱ��������ʾ��ο���ִ�лص�����
        if(now - lastTick >= timeline.interval){
            timeline.onenterFrame(now - startTime);
            lastTick = now;
        }
    }
}
module.exports = Timeline;