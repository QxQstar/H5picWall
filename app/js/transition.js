/**
 * Created by Administrator on 2016/10/24.
 */
//require('../../common/libs/swpier/idangerous.swiper.css');
var $ = require('jquery');
//var Swiper = require('../../common/libs/swpier/idangerous.swiper.min.js');
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
                            'height':parseInt(elem.height()),
                            'width':parseInt(elem.width())
                        });
        //将id中的小数点去掉
        swiperElem.attr('id',swiperElem.attr('id').replace('.',""));

        if(parseInt(elem.height()) >= parseInt(elem.width())){
            swiperElem.css({
                'background-size':'auto 100%'
            });
        }else{
            swiperElem.css({
                'background-size':'100% auto'
            });
        }

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

        swiperElem.css({
                'width':'80%',
                'height':'80%',
                'left':'10%',
                'right':"10%",
                'top':'auto',
                'bottom':'10%',
                'overflow':'hidden'
            });
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