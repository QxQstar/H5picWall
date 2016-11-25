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
    //如果相框处于放大的状态就不能放大操作台
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

        //将控制台上的图片组会恢复到原来的位置和大小
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
 * @param ajaxObj ajax对象
 */
Scale.prototype.magnifyFrame = function(elem,ajaxObj){
    //如果操作台处于放大的状态不能放大相框
    if(this.controlMagnify){
        return false;
    }
    //将画框设置为放大状态
    this.frameMagnify = true;
    //控制台
    var control = elem.parent();

    //将兄弟元素隐藏起来
    elem.siblings().each(function(index,cur){
        $(cur).hide();
    });

    var frame = elem.children('img').first();
    //将画框放大前的尺寸和位置缓存起来
    frame.data({
        'originH':frame.height(),
        'originW':frame.width(),
        'originT': elem.css('top'),
        'originL':elem.css('left')
    });
    //画框宽和高的比例
    var frameRate = frame.data('originW') / frame.data('originH');
    //控制台宽和高的比例
    var controlRate = control.width() / control.height();
    //放大画框
      if( frameRate > controlRate ){
          elem
              .css({
                  'width':'70%',
                  'height':( 1/frameRate * (control.width() * 0.7)  ) + 'px'
              })
      }else{
          elem
              .css({
                  'height':'70%',
                  'width':(frameRate * (control.height() * 0.7)) +'px'
              })
      }
    //添加背景和修改位置
        elem
            .css({
                'background-image': 'url(' + frame.attr('src') + ')',
                'background-repeat': 'no-repeat',
                'background-size': '100% 100%',
                'top': ((control.height() - elem.height()) / 2 | 0) + 'px',
                'left': ((control.width() - elem.width()) / 2 | 0) + 'px'
            });
        frame.hide();
    //发送请求，获得画心列表
    ajaxObj.getPic(elem);
      var head,footer,sureBtn,prev,next;
       //生成一些必要的元素
    (function() {

        var title = $('<p>更换画心</p>')
            .css({
                'text-align': 'center',
                'margin-top': parseInt(elem.css('top')) * 0.3
            });
        var rate = $('<p id="rate">1/5</p>')
            .css({
                'position': 'absolute',
                'right': elem.css('left')
            });

        head = $('<div class="title"></div>');
        head.append(title).append(rate);
        footer = $('<div class="footer"></div>')
            .css({
                'position': 'absolute',
                'bottom': '5%',
                'text-align':'center'
            });
        sureBtn = $('<button type="button" class="sure">确认</button>');
        footer.append(sureBtn);
        prev = $('<button type="button" class="changePic prev" id="picPrev"></button>')
                .css({
                    left:'7px'
                });
        next = $('<button type="button" class="changePic next" id="picNext"></button>')
                .css({
                    right:'7px'
                });

        //使head成为父元素的第一个元素
        control.prepend(head).append(footer).append(prev).append(next);
    })();


    var me = this;
    //给确定按钮绑定事件
    sureBtn.unbind('click').on('click',function(event){

        event.stopPropagation();
        event.preventDefault();

        head.remove();
        footer.remove();
        prev.remove();
        next.remove();

        elem
            .css({
                width:'auto',
                height:'auto',
                top:frame.data('originT'),
                left:frame.data('originL'),
                backgroundImage:'none'
            });
        elem.siblings().each(function(index,cur){
            $(cur).show();
        });
        frame.show();

        me.frameMagnify = false;

    });



};


module.exports = function(){
    return new Scale();
};