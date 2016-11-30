/**
 * Created by Administrator on 2016/10/24.
 */
var $ = require('jquery');

var transition = {
    /**
     * 生成可切换的画心列表
     * @param picGroup 要接受画心列表的元素 jquery节点
     * @param data 画心列表数据，对象
     * @param drag drag模块中的对象
     */
    addPicList: function (picGroup, data,drag) {
        var pic,list,index,total,ul,rate;
        //将已经存在的img.pic元素隐藏
        pic = picGroup.find('.pic').hide();
        //生成列表
        list = "";
        //应该显示的图片的索引，默认为0,从0开始计数
        index = 0;
        //总共的画心数量
        total = 0;
        $.each(data, function (index, item) {
            list += "<li class='picItem'>" +
                "<img id='" + index + "' src='/pw" + item.ma_src + "' class='pic' data-code='"+ item.id +"' />" +
                "</li>";
            total++;
        });

        if (picGroup.attr('data-picIndex')
            && typeof parseInt(picGroup.attr('data-picIndex')) === 'number') {
            //data-picIndex属性表示首先该显示第几张画心，默认情况显示第一张画心
            index = parseInt(picGroup.attr('data-picIndex'));
        }
        ul = $('<ul id="picList" class="clearfix"></ul>')
            .css({
                position: 'relative',
                marginLeft: -(picGroup.width() * index) | 0 + 'px',
                height: '100%',
                width: (picGroup.width() * total) | 0 + 'px'
            })
            .html(list);
        ul
            .find('.picItem')
            .css({
                position: 'relative',
                height: '100%',
                width: picGroup.width() | 0 + 'px',
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
        rate.html( ( (index + 1 ) | 0) + '/' + total);
        picGroup.append(ul);
        //绑定事件
        picGroup.siblings('#picPrev').on('click', change);
        picGroup.siblings('#picNext').on('click', change);

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
        var total, W,marginLeft,showRate,$target;
        if(typeof event === 'object'){
            event.stopPropagation();
            event.preventDefault();
            $target = $(event.target);
        }
        //总共可以却换的画心数量
         total = list.children('li').length;
         W = list.children('li').first().width();
        //当前marginLeft值
         marginLeft = parseInt(list.css('marginLeft'));
         showRate = function () {
            //当前却换到的画心的序号
            var curIndex = ( Math.abs(parseInt(list.css('marginLeft'))) / W + 1) | 0;
            $('#rate').html(curIndex + '/' + total);
        };
        if (event === 1 ||
            ($target && $target.attr('id') === 'picNext')) {
            if (marginLeft > -(total - 1) * W) {
                list.stop(false, true).animate({
                    marginLeft: (marginLeft - W) | 0 + 'px'
                }, 200, showRate);
            }
        } else {
            if (marginLeft < 0) {
                list.stop(false, true).animate({
                    marginLeft: (marginLeft + W) | 0 + 'px'
                }, 200, showRate);


            }
        }

    }
};
module.exports = transition;
