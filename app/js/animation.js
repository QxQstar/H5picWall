/**
 * Created by Administrator on 2016/11/4.
 */
"use strict";

var loadImage = require('./imageloader.js');
var Timeline = require('./timeline.js');

//初始化状态
var STATE_INITIAL = 0;
//开始状态
var STATE_START = 1;
//停止状态
var STATE_STOP = 2;
//同步任务
var TASK_SYNC = 0;
//异步任务
var TASK_ASYNC = 1;
/**
 * 简单的函数封装，执行callback
 * @param callback 执行的回调
 */
function next(callback){
    callback && callback();
}
/**
 * 帧动画对象
 * @constructor
 */
function Animation() {
    this.taskQueue = [];
    this.index = 0;
    this.state = STATE_INITIAL;
    this.timeline = new Timeline();
}

/**
 * 添加一个同步任务，图片预加载
 * @param imagelist 图片数组
 * @param finish 图片预加载结束后执行函数，将开始的css动画移除
 * @param loading 显示加载进度的元素
 */
Animation.prototype.loadImage = function(imagelist,loading,finish){
    var taskFn = function(next){
        loadImage(imagelist.slice(0),loading,finish,next);
    };
    var type = TASK_SYNC;

    return this.__add(taskFn,type);

};
/**
 * 添加一个异步定时任务，通过定时改变图片背景位置，实现帧动画
 * @param ele DOM对象
 * @param positions 背景位置数组
 * @param imageUrl 图片的地址
 */
Animation.prototype.changePosition = function(ele,positions,imageUrl){
    var len = positions.length;
    var type;
    var taskFn;
    var me = this;
    var bgW = 80;
    var bgH = 102;
    var clientW = document.documentElement.clientWidth || document.body.clientWidth;
    var clientH = document.documentElement.clientHeight || document.body.clientHeight;
    var offsetWHalf = (clientW - bgW)/2 | 0;
    var offsetHHalf = (clientH - bgH)/2 | 0;
    if(len){
        taskFn = function(next,time){
            if(imageUrl && !ele.style.backgroundImage){
                ele.style.display = 'block';
                ele.style.backgroundImage = 'url(' + imageUrl + ')';
            }
            //获得当前背景图片的位置索引
            var index = Math.min(time / me.interval | 0,len -1 );
            var position = positions[index].split(" ");
            //改变DOM背景图片的位置
            ele.style.backgroundPosition = ( Number(position[0]) + offsetWHalf )+ 'px ' +( Number(position[1]) + offsetHHalf)+ 'px';
            //如果已经到达最后一帧，则执行下一个任务
            if(index === len -1){
                next();
            }

        };
        type = TASK_ASYNC;
    }else{
        taskFn = next;
        type = TASK_ASYNC;
    }
    return this.__add(taskFn,type);
};
/**
 * 添加一个异步定时任务，通过定时改变images标签的src属性，实现帧动画
 * @param ele image标签
 * @param imagelist 图片数组
 */
Animation.prototype.changeSrc  = function(ele,imagelist){
    var len = imagelist.length;
    var type;
    var taskFn;
    var me = this;
    if(len){
        taskFn = function(next,time){
            ele.style.display = 'block';
            //获得当前图片索引
            var index = Math.min(time/me.interval | 0,len-1);
            //改变image对象的图片地址
            ele.src = imagelist[index];
            if(index === len-1){
                next();
            }
        };
        type = TASK_ASYNC;
    }else{
        taskFn = next;
        type = TASK_ASYNC;
    }
    return this.__add(taskFn,type);
};
/**
 * 高级用法 添加一个异步定时的任务，
 * 该任务自定义动画每一帧执行的任务
 * @param taskFn 自定义每帧执行的任务函数
 */
Animation.prototype.enterFrame = function(taskFn){
    return this.__add(taskFn,TASK_ASYNC);
};
/**
 *  添加一个同步任务，可以在上一个任务结束后执行的回调函数
 * @param callback 回调函数
 */
Animation.prototype.then = function(callback){
    var taskFn = function(next){
        callback();
        next();
    };
    var type = TASK_SYNC;
    return this.__add(taskFn,type);
};
/**
 * 开始执行任务，异步定时任务执行的时间间隔
 * @param interval
 */
Animation.prototype.start = function(interval){
    if(this.state === STATE_START){
        return this
    }
    //如果任务队列为空则直接返回
    if(!this.taskQueue.length){
        return this
    }
    this.state = STATE_START;
    this.interval = interval;
    this.__runTask();
    return this;
};
/**
 * 添加一个同步任务，回退到上一个任务来实现重复上一个任务的效果，可以定义重复的次数
 * @param times 重复的次数
 */
Animation.prototype.repeat = function(times){
    var me = this;
    var taskFn = function(){
        if(typeof times === 'undefined'){
            //无限次重复
            me.index -- ;
            me.__runTask();
            return;
        }
        if(times){
            times --;
            me.index --;
            me.__runTask();
        }else{
            var task = me.taskQueue[me.index];
            //到达重复的次数，跳转到下一个任务
            me.__next(task);
        }
    };
    var type = TASK_SYNC;
    return me.__add(taskFn,type);
};
/**
 * 添加一个同步任务，相对于repeat()的一个更加友好的接口，无限重复上一个任务
 */
Animation.prototype.repeatForever = function(){
    return this.repeat();
};
/**
 * 设置当前任务执行结束到下一个任务开始前的等待时间
 * @param time 等待时间
 */
Animation.prototype.wait = function(time){
    if(this.taskQueue && this.taskQueue.length >0){
        this.taskQueue[this.taskQueue.length - 1].wait = time;
    }
    return this;
};
/**
 * 暂停当前的异步定时任务
 */
Animation.prototype.pause = function(){
    if(this.state === STATE_START){
        this.state = STATE_STOP;
        this.timeline.stop();
        return this;
    }
    return this;
};
/**
 * 重新执行上一次暂停的异步任务
 */
Animation.prototype.restart = function(){
    if(this.state === STATE_STOP){
        this.state = STATE_START;
        this.timeline.restart();
        return this;
    }
    return this;
};
/**
 * 释放资源并创建下一个场景
 */
Animation.prototype.dispose = function(){
    if(this.state !== STATE_INITIAL){
        this.state = STATE_INITIAL;
        this.timeline  = null;
        this.taskQueue = null;
        //改变页面的hash值
        location.hash = "#/begin";
        return this;
    }
    return this;
};
/**
 * 添加一个任务到任务队列
 * @param taskFn 任务方法
 * @param type 任务类型
 * @private
 */
Animation.prototype.__add = function(taskFn,type){
    this.taskQueue.push({
        taskFn:taskFn,
        type:type
    });
    return this;
};
/**
 * 执行任务
 * @private
 */
Animation.prototype.__runTask = function(){
    if(!this.taskQueue || this.state !== STATE_START){
        return;
    }
    //执行任务完毕
    if(this.index === this.taskQueue.length){
        this.dispose();
        return;
    }
    var task = this.taskQueue[this.index];
    if(task.type === TASK_SYNC){
        this.syncTask(task);
    }else{
        this.asnycTask(task);
    }
};
/**
 * 一个同步任务
 * @param task 执行的任务对象
 */
Animation.prototype.syncTask = function(task){
    var me = this;
    var next = function(){
        //执行下一个任务
        me.__next(task);
    };
    var taskFn = task.taskFn;
    taskFn(next);
};
/**
 * 一个异步任务
 * @param task 执行的任务对象
 */
Animation.prototype.asnycTask = function (task) {
    var me = this;
    var enterFrame = function(time){
        var taskFn = task.taskFn;
        var next = function(){
            //停止当前任务
            me.timeline.stop();
            //执行下一任务
            me.__next(task);
        };
        taskFn(next,time);
    };
    this.timeline.onenterFrame = enterFrame;
    this.timeline.start(this.interval);
};
/**
 * 切换到下一个任务,如果任务需要等待，则延迟执行
 * @param task 当前任务
 * @private
 */
Animation.prototype.__next = function(task){
    var me = this;
    this.index ++;
    task.wait?setTimeout(function(){
        me.__runTask();
    },task.wait):this.__runTask();
};
module.exports = function(){
    return new Animation();
};
