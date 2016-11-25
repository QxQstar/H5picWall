/**
 * Created by Administrator on 2016/10/24.
 */
var $ = require('jquery');

var transition = {
    swiperElemW:undefined,
    swiperElemH:undefined,
    /**
     * 生成可切换的画心列表
     * @param elem 要接受画心列表的元素 jquery节点
     * @param data 画心列表数据，对象
     */
    addPicList:function(elem,data){
        //将已经存在的画心元素隐藏
        var pic = elem.find('.pic').hide();
        //生成列表
        var list = "";
        console.log('addPic');
        //应该首先显示的图片的索引，默认为0
        var index = 0;
        var total = 0;
        $.each(data,function(index,item){
            list += "<li class='picItem'>"+
                        "<img id='"+ index +"' src='/pw"+ item.ma_src +"' class='pic' />"+
                    "</li>";
            total ++;
        });

        if(typeof parseInt(elem.attr('data-picIndex')) === 'number'){
            index = parseInt(elem.attr('data-picIndex'));
        }
        var ul = $('<ul id="list" class="clearfix"></ul>')
                   .css({
                        'position':'relative',
                        'marginLeft':-(elem.width() * index) | 0 + 'px',
                        'height':'100%',
                        'width':(elem.width() * total) | 0 + 'px'
                    })
                    .html(list);
        ul
            .find('.picItem')
            .css({
                'position':'relative',
                'height':'100%',
                'width':elem.width() | 0 + 'px',
                'float':'left'
            })
            .find('.pic')
            .css({
                'opacity':'1'
            });
        elem.append(ul);
        //绑定事件
        elem.siblings('#picPrev').on('click',change);
        elem.siblings('#picNext').on('click',change);

        function change(event){
            transition.changePic(event,ul);
        }

    },
    /**
     * 切换画心
     * @param event 事件对象
     * @param list 画心列表 jquery节点
     */
    changePic:function(event,list){

        event.stopPropagation();
        event.preventDefault();
        var total  = list.children('li').length;
        var W = list.children('li').first().width();
        //当前marginLeft值
        var marginLeft = parseInt(list.css('marginLeft'));

        var $target = $(event.target);
        if($target.attr('id') === 'picNext'){
            if(marginLeft > -(total -1) * W){
                list.stop(false, true).animate({
                    'marginLeft': (marginLeft - W) | 0+ 'px'
                }, 200);
            }
        }else{
            if(marginLeft < 0){
                list.stop(false, true).animate({
                    'marginLeft': (marginLeft + W) | 0+ 'px'
                }, 200);
            }
        }
    }
//    //添加相框中的素材
//    addSwiper: function (swiperElem) {
//
//        var elem = swiperElem.find('.swiper-wrapper');
//
//          ajax.getPic(elem,swiperElem);
//
//
//        elem.find('.swiper-slide').each(function(){
//            var $this = $(this);
//            untilEvent.addEvent($this[0],'touchstart',drag.touchStart);
//        });
//
//
//
//    },
//
//    //生成控制台上的元素
//    createSwiperElem: function (elem) {
//        var src = elem.attr('src');
//
//
//        var swiperElem = $('<div class="swiper-container" id="swiperEle'+Math.random()+'"></div>')
//                        .css({
//                            'position':'absolute',
//                             'z-index':'12',
//                            'background': "transparent url(" + src + ") no-repeat center center",
//                            'height':parseInt(elem.height()),//宽高和列表中使相同的宽高
//                            'width':parseInt(elem.width()),
//                            'background-size':'100% '
//                        });
//        //将id中的小数点去掉
//        swiperElem.attr('id',swiperElem.attr('id').replace('.',""));
//
//        var warp = $('<ul class="swiper-wrapper clearfix"></ul>')
//                        .css({
//                            'margin-left':0
//                        });
//        swiperElem.append(warp);
//
//        return swiperElem;
//    },
//
//
//
//    magnify:function(swiperElem){
//         swiperElem.find('ul').html("");
//        //添加一个蒙层
//        addMask($('body'));
//
//        //得到这个元素放大前的宽度和高度
//        var W = swiperElem.width();
//        var H = swiperElem.height();
//
//        //得到父元素的高度和宽度
//        var P = swiperElem.parent();
//        var PW = P.width();
//        var PH = P.height();
//
//        //将这个元素放大前的尺寸缓存起来
//        swiperElem.data({
//            width:W,
//            height:H
//        });
//        //获得这个元素的所有兄弟元素
//        var sibElem = swiperElem.siblings();
//
//        //让其他相框元素不显示
//        sibElem.each(function(index,elem){
//            $(elem).css({
//                'display':'none'
//            });
//        });
//
//        //添加一个确认按钮
//        var btnOk = createBtn({
//            'position':'absolute',
//            'bottom':'10px',
//            'right':'10px',
//            'color':'#ffffff',
//            'background-color':'red',
//            'box-shadow':'3px',
//            'padding':'5px 15px',
//            'border':'none'
//        },'btnOK btn','btnOk', '确定');
//
//        swiperElem.append(btnOk);
//        //通过触摸事件给确认按钮模拟一个点击事件
//        clickHander(btnOk);
//
//
//        //添加一个取消按钮
//        var btnNO = createBtn({
//            'position':'absolute',
//            'bottom':'10px',
//            'left':'10px',
//            'color':'#ffffff',
//            'background-color':'red',
//            'box-shadow':'3px',
//            'padding':'5px 15px',
//            'border':'none'
//        },'btnNO btn','btnNO', '清除');
//
//        swiperElem.append(btnNO);
//        //通过触摸事件给确认按钮模拟一个点击事件
//        clickHander(btnNO);
//        swiperElem.css({
//            'background-color':"#fff"
//        });
//
//        //放大被点击的元素
//        //使得所有比例的图案都能够在控制台中完全并且按照他的比例显示
//        if(swiperElem.height() / swiperElem.width() >PH / PW ){
//            swiperElem.css({
//                'width':Math.ceil(0.8*PH/H*W) + 'px',
//                'height':'80%',
//                'top':'10%',
//                'left':(PW-(Math.ceil(0.8*PH/H*W)))/2 + 'px',
//                'overflow':'hidden'
//            });
//        }else{
//            swiperElem.css({
//                'width':'100%',
//                'height':Math.ceil(PW/W*H) + 'px',
//                'left':'0',
//                'top':(PH - Math.ceil(PW/W*H))/2 + 'px',
//                'overflow':'hidden'
//            });
//        }
//
//
//        this.swiperElemW = swiperElem.width();
//        this.swiperElemH = swiperElem.height();
//
//       //添加需要却换的图案
//        this.addSwiper(swiperElem);
//
//
//    }

};
module.exports = transition;

//
//function createBtn(style,className,ID,info){
//    var btn = $('<button class="'+className+'" id="'+ID+'">'+info+'</button>')
//        .css(style);
//    return btn
//}
////显示当前选择的图案
//function showCurPic(elem,parent){
//    $(elem).css({
//        'width':parent.width() + 'px',
//        'height':parent.height() + 'px'
//    });
//    var PW = parent.width();
//    var PH = parent.height();
//    var W = parseInt($(elem).attr('data-W'));
//    var H = parseInt($(elem).attr('data-H'));
//    if(  PH / PW > H / W){
//        $(elem).css({
//            'background-size':'80% ' + 0.8*PW/W * H +'px'
//
//        })
//    }else{
//        $(elem).css({
//            'background-size': 0.8*PH/H * W+'px 80%'
//        })
//    }
//}
////用触摸事件模拟点击事件
//function clickHander(btn){
//    btn.unbind('touchstart').on('touchstart',function(event){
//        //阻止事件冒泡或事件捕获
//        event.stopPropagation();
//        //取消默认行为
//        event.preventDefault();
//        var $this = $(this);
//        //将触摸点的坐标缓存起来
//        $this.data({
//            'startX':event.targetTouches[0].clientX,
//            'startY':event.targetTouches[0].clientY
//        })
//    });
//
//    btn.unbind('touchmove').on('touchmove',function(event){
//        //阻止事件冒泡或事件捕获
//        event.stopPropagation();
//        //取消默认行为
//        event.preventDefault();
//        var $this = $(this);
//        //将触摸点的坐标缓存起来
//        $this.data({
//            'touchX':event.targetTouches[0].clientX,
//            'touchY':event.targetTouches[0].clientY
//        })
//    });
//
//    btn.unbind('touchend').on('touchend',function(event){
//        //阻止事件冒泡或事件捕获
//        event.stopPropagation();
//        //取消默认行为
//        event.preventDefault();
//        var $this = $(this);
//        $this.data('touchX') ? offsetX = Math.abs($this.data('startX') - $this.data('touchX')):undefined;
//        $this.data('touchY') ? offsetY = Math.abs($this.data('startY') - $this.data('touchY')):undefined;
//        if(!$this.data('touchX') || offsetX<2&&offsetY<2){//如果没有滑动不会触发touchmove事件，所有$(this).data('touchX')为understand
//
//
//            var parent = $this.parent();
//            //将控制台上的所有相框显示出来
//            parent.siblings().each(function(index,elem){
//                if($(elem).attr('id') !== 'notice') {
//                    $(elem).css('display', 'block');
//                }
//            });
//            //让该元素恢复到放大前的位置和大小
//            parent.css({
//                'top':parent.attr('coordy') + 'px',
//                'left':parent.attr('coordx') + 'px',
//                'width':parent.data('width') + 'px',
//                'height':parent.data('height') + 'px',
//                'background-color':'transparent'
//            });
//            //获取相框中的图案列表
//            var list = parent.find('.swiper-wrapper');
//            //获得当前的marginLeft值
//            var marginLeft = -parseInt(list.css('marginLeft'));
//            //将marginLeft保存起来
//            list.data({
//                'marginLeft':-marginLeft
//            });
//            //将margLeft恢复到0
//            list.css({
//                'margin-left':'0',
//                'width':"100%"
//            });
//
//            //获得当前显示的是第几张印图
//            var i = parseInt(marginLeft / transition.swiperElemW);
//            list.children().each(function(index,elem){
//                if (index !== i) {
//                    $(elem).remove();
//                } else {
//                    if($this.attr('id') === 'btnOk') {//点击的是确认按钮
//                        //显示当前现在的图案
//                        showCurPic(elem, parent);
//                    }else{
//                        $(elem).remove();
//                    }
//                }
//
//            });
//            //移除蒙层
//            $('#mask').remove();
//            //移除另一个按钮
//            $this.siblings('.btn').remove();
//            //将btn移除
//            $this.remove();
//
//        }
//    });
//}
////添加蒙层
//function addMask(elem){
//    var mask = $('<div class="mask" id="mask"></div>')
//        .css({
//            'position':'absolute',
//            'top':'0',
//            'right':'0',
//            'left':'0',
//            'bottom':'0',
//            'opacity':'0.8',
//            'background-color':'#000000',
//            'z-index':'11'
//        });
//    elem.append(mask);
//}

