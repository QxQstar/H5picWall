/**
 * Created by Administrator on 2016/10/21.
 */

var $ = require('jquery');

var ajax = {
    //得到可拖拽图片的初始列表
    getInitImg:function(parent,gap){
        var num  = 50;
        $.ajax({
            type:"GET",
            async:false,
            url:'/Home/picwall/index',
            success:function(result){
                if(result.status == 1) {
                    $.each(result.data, function (index,item) {
                        var src = item.pic_src;
                        var width = parseInt(item.width);
                        var height = parseInt(item.height);
                        var ratio = num / height;
                        var img = $('<img>').attr("src",src).height(num).width(parseInt(width * ratio));
                        parent.append(img);
                    });
                }
            },
            dataType:'json'
        });
    },
    //请求相框里的图案
    getPic:function(elem,swiperElem){

        var swiperElemW = parseInt(swiperElem.width());
        var swiperElemH = parseInt(swiperElem.height());

        $.ajax({
           type:'GET',
            async:false,
            url:'/Home/picwall/mater',
            error:function(){
                console.log('error');
            },
            success:function(result){
                if(result.status == 1){
                    $.each(result.data,function(index,item){
                        var li = $('<li class="item swiper-slide" style=""></li>')
                                    .css({
                                        'background':"url(" + item.ma_src + ") no-repeat center center",
                                         "height": swiperElemH,
                                          "width": swiperElemW,
                                          "float":'left'
                                    });
                        if(parseInt(item.height) >= parseInt(item.width)){
                            li.css({
                                'background-size':'auto 100%'
                            });
                        }else{
                            li.css({
                                'background-size':'100% auto'
                            });
                        }


                        //每添加一个图案就增加图案父元素的宽度
                        elem.width(swiperElemW * (++index));
                        elem.append(li);
                    });
                }
            },
            dataType:'json'
        });

        swiperElem.append(elem);
    }
};

module.exports  = ajax;