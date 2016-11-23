/**
 * Created by Administrator on 2016/11/23.
 */
var $ = require('jquery');

/**
 * 缩放类
 * @constructor
 */
function Scale(){
    //默认控制台不处于放大状态
    this.controlMagnify = false;
    //控制台放大后的尺寸,只有高度
    this.controlMaxSize = null;
    //控制台在放大之前的尺寸
    this.controlOriginalSize = null;
    //控制台缩放的比例
    this.controlRate = null;
}
/**
 * 缩放控制台
 * @param event 事件对象
 * @param control 要缩放的元素
 */
Scale.prototype.controlScale = function(event,control){

    event.stopPropagation();
    event.preventDefault();

    var $target = $(event.target);

    var drag = control.parent();

    //拖拽模块的原始尺寸
    var dragOriginalSize = {
        W:$(window).width(),
        H:$(window).height()
    };
    var controlPicGroups = control.find('.picGroup');
    var me = this;
    //进行放大
    if( ! this.controlMagnify ){
        console.log(me.controlRate);
        $target
            .addClass('off')
            .removeClass('on');
        control
            .height(me.controlMaxSize.H)
            .width( ( me.controlMaxSize.H * ( me.controlOriginalSize.W / me.controlOriginalSize.H ) ) | 0 );

        drag
            .width( control.width() + control.offset().left * 2 )
            .height( (drag.width() * ( dragOriginalSize.H / dragOriginalSize.W ) ) | 0 );

        //控制台现在的高度与原来高度的比值
        if(!me.controlRate){
            me.controlRate  = me.controlMaxSize.H / me.controlOriginalSize.H;
        }


        //放大控制台中图片组的位置和尺寸
        controlPicGroups
            .each(function(index,cur){
                $(cur)
                    .css({
                        'top':( parseInt( $(cur).css('top') ) * me.controlRate ) | 0,
                        'left':( parseInt( $(cur).css('left') ) * me.controlRate ) | 0
                    })
                    .attr({
                        'coordX':( ( $(cur).attr('coordX') | 0 ) * me.controlRate ) | 0,
                        'coordY':( ( $(cur).attr('coordY') | 0 ) * me.controlRate ) | 0
                    });

                var frame = $(cur).children('img').first();
                frame
                    .height(  ( ( frame.attr('originalHeight') | 0 ) * me.controlRate  ) | 0)
                    .width( ( ( frame.attr('originalWidth') | 0 ) * me.controlRate  ) | 0 );
            });

    }else{
        $target
            .addClass('on')
            .removeClass('off');

        control
            .height(me.controlOriginalSize.H)
            .width(me.controlOriginalSize.W);

        drag
            .width(dragOriginalSize.W)
            .height(dragOriginalSize.H);

        //将控制台上的图片组回复到原来的位置和大小
        controlPicGroups
            .each(function(index,cur){
                $(cur)
                    .css({
                        'top':( parseInt( $(cur).css('top') ) / me.controlRate ) | 0,
                        'left':( parseInt( $(cur).css('left') ) / me.controlRate ) | 0
                    })
                    .attr({
                        'coordX':( ( $(cur).attr('coordX') | 0 ) / me.controlRate ) | 0,
                        'coordY':( ( $(cur).attr('coordY') | 0 ) / me.controlRate ) | 0
                    });

                var frame = $(cur).children('img').first();
                frame
                    .height(frame.attr('originalHeight'))
                    .width(frame.attr('originalWidth'));


            });

    }

    this.controlMagnify = ! this.controlMagnify;
};


module.exports = function(){
    return new Scale();
};