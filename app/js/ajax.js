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

        var swiperElemW = swiperElem.width();
        var swiperElemH = swiperElem.height();
        var num = 50;
        //显示之前却换到的图案
        if(elem.data('marginLeft')){
            elem.css({
                'marginLeft':elem.data('marginLeft')
            })
        }
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
                        var W = item.width;
                        var H = item.height;
                        var li = $('<li class="item swiper-slide" style=""></li>')
                                    .css({
                                        'background':"url(" + item.ma_src + ") no-repeat center center",
                                         "height": parseInt(swiperElemH),
                                          "width": parseInt(swiperElemW),
                                          "float":'left'
                                    })
                                    .attr({
                                        'data-w':parseInt(num/H * W),
                                         'data-H':num
                                    });
//
                          if( swiperElemH / swiperElemW > H / W){
                              li.css({
                                  'background-size':'80% ' + 0.8*swiperElemW/W * H +'px'

                              })
                          }else{
                              li.css({
                                  'background-size': 0.8*swiperElemH/H * W+'px 80%'
                              })
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