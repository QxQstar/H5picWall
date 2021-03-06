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
    //从厘米到像素的转换比例
    this.transformRate = null;
}
/**
 * 缩放控制台
 * @param event 事件对象
 * @param control 要缩放的元素
 */
Scale.prototype.controlScale = function(event,control){
    var $target,drag,dragOriginalSize,controlPicGroups,me,frame,controlCvs,canvasMark;
    //阻止冒泡/捕获
    event.stopPropagation();
    me = this;
    //如果存在一个相框处于放大的状态就不能放大操作台
    if(me.frameMagnify){
        return false;
    }


    $target = $(event.target);
    //得到拖拽页面的模块元素
    drag = control.parent('#drag');
    if(!drag){
        drag = $('#drag');
    }

    //拖拽模块的原始尺寸
     dragOriginalSize = {
        W:$(window).width(),
        H:$(window).height()
    };

     controlPicGroups = control.find('.picGroup');
    //表示控制台的虚线宽
     controlCvs = $('#controlCvs');
    //标识场景大小的canvas
    canvasMark  = $('#canvasMark');

    //如果控制台没有处于放大状态，将控制台进行放大
    if( ! me.controlMagnify ){

        //修改icon的状态
        $target
            .addClass('off')
            .removeClass('on');
        //修改控制台的尺寸
        control
            .height(me.controlMaxSize.H)
            .width( ( me.controlMaxSize.H * ( me.controlOriginalSize.W / me.controlOriginalSize.H ) ) | 0 );

        //修改整个模块的尺寸
        drag
            .width( control.width() + control.offset().left * 2 )
            .height( (drag.width() * ( dragOriginalSize.H / dragOriginalSize.W ) ) | 0 );

        //控制台现在的高度与原来高度的比值
        if(!me.controlRate){
            me.controlRate  = me.controlMaxSize.H / me.controlOriginalSize.H;
        }


        //放大控制台中picGroup的位置和尺寸
        controlPicGroups
            .each(function(index,picGroup){
                $(picGroup)

                    .css({
                        top:parseFloat( $(picGroup).css('top') ) * me.controlRate   + 'px',
                        left: parseFloat( $(picGroup).css('left') ) * me.controlRate  + 'px'
                    })
                    .attr({
                        coordX: $(picGroup).attr('coordX')   * me.controlRate ,
                        coordY: $(picGroup).attr('coordY')   * me.controlRate
                    });
                //picGroup中表示相框的那个子元素,picGroup的大小是由frame的大小决定的
                frame = $(picGroup).children('img').first();
                frame
                    .height(  ( ( frame.attr('originalHeight')  ) * me.controlRate  ) |0 )
                    .width( ( ( frame.attr('originalWidth')  ) * me.controlRate  ) | 0 );
            });


    }else{//缩小控制台
        //修改icon的状态
        $target
            .addClass('on')
            .removeClass('off');
        //将控制台恢复到原来的尺寸
        control
            .height(me.controlOriginalSize.H)
            .width(me.controlOriginalSize.W);

        drag
            .width(dragOriginalSize.W)
            .height(dragOriginalSize.H);

        //将控制台上的图片组会恢复到原来的位置和大小
        controlPicGroups
            .each(function(index,picGroup){
                $(picGroup)
                    .css({
                        top: parseFloat( $(picGroup).css('top') ) / me.controlRate  + 'px',
                        left: parseFloat( $(picGroup).css('left') ) / me.controlRate  + 'px'
                    })
                    .attr({
                        coordX: $(picGroup).attr('coordX')   / me.controlRate ,
                        coordY: $(picGroup).attr('coordY')   / me.controlRate
                    });
                //picGroup中表示相框的那个子元素，picGroup的大小是由frame的大小决定的
                 frame = $(picGroup).children('img').first();
                frame
                    .height(frame.attr('originalHeight'))
                    .width(frame.attr('originalWidth'));


            });

    }
    controlCvs
        .height(control.height())
        .width(control.width());
    canvasMark
        .width(control.width())
        .offset({
            left:control.offset().left,
            right:control.offset().right
        });

    //修改控制台的状态
    this.controlMagnify = ! this.controlMagnify;
};
/**
 *放大相框
 * @param picGroup 要放大的元素
 * @param ajaxObj ajax对象
 */
Scale.prototype.magnifyFrame = function(picGroup,ajaxObj){
    var control,frame,frameRate,controlRate,head,footer,sureBtn,prev,next,me,controlCvs,magnify,canvasMark;
    me = this;

    //如果操作台处于放大的状态或者已经存在一个相框处于放大状态不能放大相框
    if(me.controlMagnify || me.frameMagnify){

            return false;
    }
    //将画框设置为放大状态
    me.frameMagnify = true;
    //控制台的虚线
    controlCvs = $('#controlCvs');
    //场景大小的标识
    canvasMark = $('#canvasMark');

    controlCvs.hide();
    canvasMark.hide();
    //放大/缩小的icon
    magnify = $('#magnify');
    magnify.css({
        'opacity':0
    });
    //将顶部隐藏起来
    $('.m-top').css({
        opacity:0
    });
    //控制台
    control = picGroup.parent();

    //将兄弟元素隐藏起来
    picGroup.siblings('.picGroup').each(function(index,cur){
        $(cur).hide();
    });

    //表示相框的那个img元素
    frame = picGroup.children('img').first();

    //将画框放大前的尺寸和位置缓存起来
    frame.data({
        originH:frame.height(),
        originW:frame.width(),
        originT: parseInt(picGroup.css('top')),
        originL:parseInt(picGroup.css('left'))
    });
    frame.hide();

    //画框宽和高的比例
    frameRate = frame.data('originW') / frame.data('originH');
    //控制台宽和高的比例
    controlRate = control.width() / control.height();
    //放大画框
      if( frameRate > controlRate ){
          picGroup
              .css({
                  width:'70%',
                  height:( 1/frameRate * (control.width() * 0.7)  ) + 'px'
              })
      }else{
          picGroup
              .css({
                  height:'95%',
                  width:(frameRate * (control.height() *0.95)) +'px'
              })
      }

    //放大之后的状态
    picGroup
            .css({
                backgroundImage: 'url(' + frame.attr('src') + ')',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
                top: ((control.height() - picGroup.height()) / 2 | 0) + 'px',
                left: ((control.width() - picGroup.width()) / 2 | 0) + 'px'
            });


       //生成一些必要的元素
    (function() {
        var rate,title;
        title = $('<p id="picName">'+picGroup.find('.pic').attr('data-name')+'</p>')
                .css({
                    textAlign: 'center'
                });

        //显示可切换的画心总数量和当前切换到的画心序号
        rate = $('<p id="rate"></p>')
            .css({
                position: 'absolute',
                right: picGroup.css('left')
            });

        head = $('<div class="title"></div>');
        head.append(title).append(rate);

        footer = $('<div class="footer"></div>');
        sureBtn = $('<button type="button" class="sure">确认</button>');
        footer.append(sureBtn);

        prev = $('<button type="button" class="changePic prev" id="picPrev"></button>');
        next = $('<button type="button" class="changePic next" id="picNext"></button>');

        //使head成为父元素的第一个元素
        control.prepend(head).append(footer).append(prev).append(next);
    })();

    //获得画心列表,不一定会发送ajax请求，所以这行代码要写在闭包的后面
    ajaxObj.getPic(picGroup);


    //给确定按钮绑定事件
    sureBtn.on('click',function(event){
        var list,pic,curIndex,frame,optionalPic,newPrice,oldPrice,total,oldTotalPrice;
        //阻止冒泡/捕获和默认行为
        event.stopPropagation();
        event.preventDefault();

        //动态生成的画心列表的父元素
        list = picGroup.children('#picList');

        //picGroup中直接子元素，表示画心的那个img元素
        pic = picGroup.children('.pic');
        //picGroup中直接子元素，表示相框的那个img元素
        frame = picGroup.children('img').first();

        //切换到的画心的序号，从0开始计数
        curIndex = picGroup.attr('data-picIndex');
        if(typeof curIndex === 'undefined'){
            curIndex = 0
        }
        //显示切换到的那个画心
        optionalPic = list.find('img').eq(curIndex);
        //新选择的画心的价格
        newPrice = parseFloat( optionalPic.attr('data-price'));
        //之前的画心的价格
        oldPrice = parseFloat( pic.attr('data-price'));
        pic.attr({
            'src':optionalPic.attr('src'),
            'data-price':newPrice.toFixed(2),
            'data-name':optionalPic.attr('data-name')
        });

        //修改相框当前的画心编号
        frame.attr('data-piccode',optionalPic.attr('data-code'));
        //修改总价
        total = $('#fixed').find('.total');
        oldTotalPrice = parseFloat( total.html() );
        total.html( ( oldTotalPrice - oldPrice + newPrice ).toFixed(2));

        //修改当相框拖入控制台，缓存的价格
        picGroup.data({
            'price':( parseFloat( frame.attr('data-price') ) - oldPrice + newPrice ).toFixed(2)
        });
        head.remove();
        sureBtn.unbind('click');
        footer.remove();
        //在从页面移除之前，先移除绑定的事件
        prev.unbind('click').remove();
        next.unbind('click').remove();
        optionalPic.unbind();
        list.find('li').unbind();
        list.remove();
        picGroup
            .css({
                width:'auto',
                height:'auto',
                top:frame.data('originT') + 'px',
                left:frame.data('originL') + 'px',
                backgroundImage:'none'
            })
            .siblings('.picGroup').each(function(index,cur){
                //将隐藏的兄弟节点显示出来
                $(cur).show();
            });
        //将表示画框和画心的img直接子元素显示出来
        frame.show();
        pic.show();
        controlCvs.show();
        canvasMark.show();
        magnify.css({
            'opacity':1
        });
        //将画框修改为未放大状态
        me.frameMagnify = false;
        //将顶部显示出来
        $('.m-top').css({
            opacity:1
        });

    });



};


module.exports = function(){
    return new Scale();
};