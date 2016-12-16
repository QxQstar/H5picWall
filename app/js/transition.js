/**
 * Created by Administrator on 2016/10/24.
 */
var $ = require('jquery');

var transition = {
    //默认不处于切换的过程中
    status : 0,
    //应该显示的图片的索引，默认为0,从0开始计数
    index:0,
    /**
     * 生成可切换的画心列表
     * @param picGroup 要接受画心列表的元素 jquery节点
     * @param data 画心列表数据，对象
     * @param drag drag模块中的对象
     */
    addPicList: function (picGroup, data,drag) {
        var pic,list,index,total,ul,rate,picPrev,picNext;
        //将已经存在的img.pic元素隐藏
        pic = picGroup.find('.pic').hide();
        //生成列表
        list = "";

//        index = 0;
        //总共的画心数量
        total = 0;
        $.each(data, function (index, item) {
            list += "<li class='picItem'>" +
                "<img id='" + index + "' src='/pw" + item.ma_src + "' class='pic' data-code='"+ item.id +"' data-price='"+  item.price +"'/>" +
                "</li>";
            total++;
        });

        if (picGroup.attr('data-picIndex')
            && typeof parseInt(picGroup.attr('data-picIndex')) === 'number') {
            //data-picIndex属性表示首先该显示第几张画心，默认情况显示第一张画心
            transition.index = parseInt(picGroup.attr('data-picIndex'));
        }else{
            //将index重置为0
            transition.index = 0;
        }
        ul = $('<ul id="picList" class="clearfix"></ul>')
            .css({
                position: 'relative',
                marginLeft: -(picGroup.width() * transition.index) | 0 + 'px',
                height: '100%',
                width: (picGroup.width() * total)  + 'px'
            })
            .html(list);
        ul
            .find('.picItem')
            .css({
                position: 'relative',
                height: '100%',
                width: picGroup.width()  + 'px',
                float: 'left'
            })
            .find('.pic')
            .css({
                opacity: '1'
            });
        ul.find('.pic').on('load',function(){
            //为了防止画心太小，不好滑动，给li页要绑定touch事件
            drag.listener($(this).parent('li'),'touchstart',drag.touchStart);
            drag.listener($(this),'touchstart',drag.touchStart);
        });
        //给li触摸事件，使可以滑动切换画心

        rate = $('#rate');
        rate.html( ( (transition.index + 1 ) | 0) + '/' + total);
        picGroup.append(ul);
        //绑定事件
        picNext = picGroup.siblings('#picNext');
        picPrev = picGroup.siblings('#picPrev');

        picPrev
            .unbind('click')
            .on('click', change);
        picNext
            .unbind('click')
            .on('click', change);

        function change(event) {
            transition.changePic(event, ul);
        }

    },
    /**
     * 切换画心
     * @param event 事件对象
     * @param list 画心列表 jquery节点
     */
    changePic: function (event, list) {
        var total, W,marginLeft,showRate,$target,picGroup;
        picGroup = list.parent('.picGroup');
        //如果当前处于却换的动画中
        if(transition.status){
            return;
        }
        if(typeof event === 'object'){
            event.stopPropagation();
            event.preventDefault();
            $target = $(event.target);
        }
        //总共可以却换的画心数量
         total = list.children('li').length;
         W = list.children('li').first().width();
        //当前marginLeft值
         marginLeft = parseFloat(list.css('marginLeft'));
         showRate = function () {
            //当前却换到的画心的序号
             picGroup.attr('data-picIndex',transition.index);
            $('#rate').html(transition.index+1 + '/' + total);

             //本次切换完成
             transition.status = 0;
        };
        if (event === 1 ||
            ($target && $target.attr('id') === 'picNext')) {
            if(transition.index < total -1){
                transition.index ++;
                transition.status = 1;
                list.stop(false, true).animate({
                    marginLeft: (marginLeft - W)  + 'px'
                }, 200, showRate);
            }
        } else {
            if (transition.index > 0) {
                transition.index --;
                transition.status = 1;
                list.stop(false, true).animate({
                    marginLeft: (marginLeft + W)  + 'px'
                }, 200, showRate);


            }
        }

    }
};
module.exports = transition;
