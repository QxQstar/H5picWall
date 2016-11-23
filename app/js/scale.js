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
    //默认画框不处于放大状态
    this.frameMagnify = false;
}
/**
 * 缩放控制台
 * @param event 事件对象
 * @param control 要缩放的元素
 */
Scale.prototype.controlScale = function(event,control){
    if(this.frameMagnify){
        return false;
    }
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
/**
 *放大相框
 * @param elem 要放大的元素
 */
Scale.prototype.magnifyFrame = function(elem){

    //将画框设置为放大状态
    this.frameMagnify = true;
    //控制台
    var control = elem.parent();

    //将兄弟元素隐藏起来
    elem.siblings().each(function(index,cur){
        $(cur).hide();
    });
    //移除事件，使画框在放大的时候，画框不能进行拖动
    elem.find('.pic').unbind();

    var frame = elem.children('img').first();
    //将画框放大前的尺寸和位置缓存起来
    frame.data({
        'originH':frame.height(),
        'originW':frame.width(),
        'originT': frame.css('top'),
        'originL':frame.css('top')
    });
    //画框宽和高的比例
    var frameRate = frame.data('originW') / frame.data('originH');
    //控制台宽和高的比例
    var controlRate = control.width() / control.height();
    //放大画框
    if(frameRate > controlRate ){//很宽的画框
        frame
            .width( (control.width() * 0.7 ) | 0)
            .height( (1/frameRate * frame.width() ) | 0)
    }else{
        frame
            .height( (control.height() * 0.7) | 0)
            .width( (frameRate * frame.height() ) | 0 );
    }

    //修改画框的位置
    elem
        .css({
            top: (control.height() - elem.height() ) / 2 | 0,
            left: (control.width() - elem.width() ) / 2 | 0
        });

    var title = $('<p>更换画心</p>')
        .css({
            'text-align':'center',
            'margin-top': parseInt(elem.css('top')) * 0.3
        });
    var rate = $('<p>1/5</p>')
                .css({
                    'position':'absolute',
                    'right':elem.css('left')
                });

    var head = $('<div></div>');
    head.append(title).append(rate);
    var footer = $('<div></div>')
        .css({
            'position':'absolute',
            'bottom':'5%',
            'right':elem.css('left')
        });
    var button = $('<button>确认</button>');
    footer.append(button);
    //使head成为父元素的第一个元素
    control.prepend(head).append(footer);
};


module.exports = function(){
    return new Scale();
};