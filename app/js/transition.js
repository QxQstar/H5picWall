/**
 * Created by Administrator on 2016/10/24.
 */
var $ = require('jquery');
var untilEvent = require('./untilEvent.js');
var drag = require('./drag.js');
var ajax = require('./ajax.js');


var transition = {
    swiperElemW:undefined,
    swiperElemH:undefined,

    addSwiper: function (swiperElem) {

        var elem = swiperElem.find('.swiper-wrapper');

          ajax.getPic(elem,swiperElem);


        elem.find('.swiper-slide').each(function(){
            var $this = $(this);
            untilEvent.addEvent($this[0],'touchstart',drag.touchStart);
        });



    },
    createSwiperElem: function (elem) {
        var src = elem.attr('src');


        var swiperElem = $('<div class="swiper-container" id="swiperEle'+Math.random()+'"></div>')
                        .css({
                            'position':'absolute',
                             'z-index':'12',
                            'background': "#fff url(" + src + ") no-repeat center center",
                            'height':parseInt(elem.height()),//宽高和列表中使相同的宽高
                            'width':parseInt(elem.width()),
                            'background-size':'100% '
                        });
        //将id中的小数点去掉
        swiperElem.attr('id',swiperElem.attr('id').replace('.',""));
//
//        if(parseInt(elem.height()) >= parseInt(elem.width())){
//            swiperElem.css({
//                'background-size':'100%'
//            });
//        }else{
//            swiperElem.css({
//                'background-size':'100% '
//            });
//        }

        var warp = $('<ul class="swiper-wrapper clearfix"></ul>')
                        .css({
                            'margin-left':0
                        });
        swiperElem.append(warp);

        return swiperElem;
    },

    magnify:function(swiperElem){
        //添加一个蒙层
        this.addMask($('body'));
        //添加一个确认按钮
        var btn = $('<button class="btn" id="btn">确认</button>')
                    .css({
                        'position':'absolute',
                        'bottom':'0',
                        'right':'0',
                        'color':'#ffffff',
                        'background-color':'red',
                        'box-shadow':'3px',
                        'padding':'5px'
                    });
        swiperElem.append(btn);

        //获得这个元素的所有兄弟元素
        var sibElem = swiperElem.siblings();

        //让所有兄弟元素不显示
        sibElem.each(function(index,elem){
            $(elem).css({
                'display':'none'
            });
        });
        //放大被点击的元素
        swiperElem.css({
                'left':'auto',
                'top':'auto',
                'overflow':'hidden'
            });
        //得到这个元素的原来的宽度和高度
        var W = swiperElem.width();
        var H = swiperElem.height();

        //得到父元素的高度和宽度
        var P = swiperElem.parent();
        var PW = P.width();
        var PH = P.height();

        //使得所有比例的图案都能够在控制台中完全并且按照他的比例显示
        if(swiperElem.height() / swiperElem.width() >PH / PW ){
            swiperElem.css({
                'width':Math.ceil(0.8*PH/H*W) + 'px',
                'height':'80%',
                'top':'10%',
                'left':(PW-(Math.ceil(0.8*PH/H*W)))/2 + 'px'
            });
        }else{
            swiperElem.css({
                'width':'100%',
                'height':Math.ceil(PW/W*H) + 'px',
                'left':'auto',
                'top':(PH - Math.ceil(PW/W*H))/2 + 'px'
            });
        }
        //让它的宽高为整数
        swiperElem.css({
            'height':parseInt(swiperElem.height()),
            'width':parseInt(swiperElem.width())
        });

        this.swiperElemW = parseInt(swiperElem.width());
        this.swiperElemH = parseInt(swiperElem.height());

        // 移除触摸事件
//        untilEvent.removeEvent(swiperElem[0],'touchstart',drag.touchStart);
//        untilEvent.removeEvent(swiperElem[0],'touchmove',drag.touchMove);
//        untilEvent.removeEvent(swiperElem[0],'touchend',drag.touchEnd);

       //添加需要却换的图案
        this.addSwiper(swiperElem);


    },
    addMask:function(elem){
        var mask = $('<div class="mask"></div>')
            .css({
                'position':'absolute',
                'top':'0',
                'right':'0',
                'left':'0',
                'bottom':'0',
                'opacity':'0.8',
                'background-color':'#000000',
                'z-index':'11'
            });
        elem.append(mask);
    }
};
module.exports = transition;