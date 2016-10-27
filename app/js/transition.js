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

    //添加相框中的素材
    addSwiper: function (swiperElem) {

        var elem = swiperElem.find('.swiper-wrapper');

          ajax.getPic(elem,swiperElem);


        elem.find('.swiper-slide').each(function(){
            var $this = $(this);
            untilEvent.addEvent($this[0],'touchstart',drag.touchStart);
        });



    },

    //生成控制台上的元素
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

        var warp = $('<ul class="swiper-wrapper clearfix"></ul>')
                        .css({
                            'margin-left':0
                        });
        swiperElem.append(warp);

        return swiperElem;
    },



    magnify:function(swiperElem){
         swiperElem.find('ul').html("");
        //添加一个蒙层
        this.addMask($('body'));

        //得到这个元素放大前的宽度和高度
        var W = swiperElem.width();
        var H = swiperElem.height();

        //得到父元素的高度和宽度
        var P = swiperElem.parent();
        var PW = P.width();
        var PH = P.height();

        //将这个元素放大前的尺寸缓存起来
        swiperElem.data({
            width:W,
            height:H
        });
        //获得这个元素的所有兄弟元素
        var sibElem = swiperElem.siblings();

        //让其他相框元素不显示
        sibElem.each(function(index,elem){
            $(elem).css({
                'display':'none'
            });
        });

        //添加一个确认按钮
        var btn = $('<button class="btn" id="btn">确认</button>')
                    .css({
                        'position':'absolute',
                        'bottom':'10px',
                        'right':'10px',
                        'color':'#ffffff',
                        'background-color':'red',
                        'box-shadow':'3px',
                        'padding':'5px 15px'
                    });
        swiperElem.append(btn);

        //通过触摸事件给btn模拟一个点击事件
        btn.unbind('touchstart').on('touchstart',function(event){
           //阻止事件冒泡或事件捕获
            event.stopPropagation();
            //取消默认行为
            event.preventDefault();
            var $this = $(this);
            //将触摸点的坐标缓存起来
            $this.data({
                'startX':event.targetTouches[0].clientX,
                'startY':event.targetTouches[0].clientY
            })
        });

        btn.unbind('touchmove').on('touchmove',function(event){
            //阻止事件冒泡或事件捕获
            event.stopPropagation();
            //取消默认行为
            event.preventDefault();
            var $this = $(this);
            //将触摸点的坐标缓存起来
            $this.data({
                'touchX':event.targetTouches[0].clientX,
                'touchY':event.targetTouches[0].clientY
            })
        });

        btn.unbind('touchend').on('touchend',function(event){
            //阻止事件冒泡或事件捕获
            event.stopPropagation();
            //取消默认行为
            event.preventDefault();
            var $this = $(this);
            $this.data('touchX') ? offsetX = Math.abs($this.data('startX') - $this.data('touchX')):undefined;
            $this.data('touchY') ? offsetY = Math.abs($this.data('startY') - $this.data('touchY')):undefined;
            if(!$this.data('touchX') || offsetX>2&&offsetY>2){//如果没有滑动不会触发touchmove事件，所有$(this).data('touchX')为understand


                var parent = $this.parent();
                //将控制台上的所有相框显示出来
                parent.siblings().each(function(index,elem){
                    if($(elem).attr('id') !== 'notice') {
                        $(elem).css('display', 'block');
                    }
                });
                //让该元素恢复到放大前的位置
                parent.css({
                    'top':parent.attr('coordy') + 'px',
                    'left':parent.attr('coordx') + 'px',
                    'width':parent.data('width') + 'px',
                    'height':parent.data('height') + 'px'
                });
                //获取相框中的图案列表
                var list = parent.find('.swiper-wrapper');
                //获得当前的marginLeft值
                var marginLeft = -parseInt(list.css('marginLeft'));
                //将margLeft恢复到0
                list.css({
                    'margin-left':'0',
                    'width':"100%"
                });
                //获得当前显示的是第几张印图
                var i = parseInt(marginLeft / transition.swiperElemW);
                list.children().each(function(index,elem){
                    if(index !== i){
                        $(elem).remove();
                    }else{

                        $(elem).css({
                            'width':parent.width() + 'px',
                            'height':parent.height() + 'px'
                        });
                            var PW = parent.width();
                            var PH = parent.height();
                            var W = parseInt($(elem).attr('data-W'));
                            var H = parseInt($(elem).attr('data-H'));
                        if(  PH / PW > H / W){
                            $(elem).css({
                                'background-size':'80% ' + 0.8*PW/W * H +'px'

                            })
                        }else{
                            $(elem).css({
                                'background-size': 0.8*PH/H * W+'px 80%'
                            })
                        }

                    }


                });
                //移除蒙层
                $('#mask').remove();
                //将btn移除
                $this.remove();
            }
        });

        //放大被点击的元素
        //使得所有比例的图案都能够在控制台中完全并且按照他的比例显示
        if(swiperElem.height() / swiperElem.width() >PH / PW ){
            swiperElem.css({
                'width':Math.ceil(0.8*PH/H*W) + 'px',
                'height':'80%',
                'top':'10%',
                'left':(PW-(Math.ceil(0.8*PH/H*W)))/2 + 'px',
                'overflow':'hidden'
            });
        }else{
            swiperElem.css({
                'width':'100%',
                'height':Math.ceil(PW/W*H) + 'px',
                'left':'0',
                'top':(PH - Math.ceil(PW/W*H))/2 + 'px',
                'overflow':'hidden'
            });
        }


        this.swiperElemW = parseInt(swiperElem.width());
        this.swiperElemH = parseInt(swiperElem.height());

       //添加需要却换的图案
        this.addSwiper(swiperElem);


    },



    //添加蒙层
    addMask:function(elem){
        var mask = $('<div class="mask" id="mask"></div>')
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