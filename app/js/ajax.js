/**
 * Created by Administrator on 2016/10/21.
 */

var $ = require('jquery');
var drag = require('./drag.js');
var transition = require('./transition.js');

//var ajax = {
//    //得到可拖拽图片的初始列表
//    getInitImg:function(parent,gap){
//        var num  = 50;
//        $.ajax({
//            type:"GET",
//            async:false,
//            url:'/Home/picwall/index',
//            success:function(result){
//                if(result.status == 1) {
//                    $.each(result.data, function (index,item) {
//                        var src = item.pic_src;
//                        var width = parseInt(item.width);
//                        var height = parseInt(item.height);
//                        var ratio = num / height;
//                        var img = $('<img>')
//                            .attr("src",src)
//                            .height(num)
//                            .width(parseInt(width * ratio));
//                        parent.append(img);
//                    });
//                }
//            },
//            dataType:'json'
//        });
//    },
//    //请求相框里的图案
//    getPic:function(elem,swiperElem){
//
//        var swiperElemW = swiperElem.width();
//        var swiperElemH = swiperElem.height();
//        var num = 50;
//        //显示之前却换到的图案
//        if(elem.data('marginLeft')){
//            elem.css({
//                'marginLeft':elem.data('marginLeft')
//            })
//        }
//        $.ajax({
//           type:'GET',
//            async:false,
//            url:'/Home/picwall/mater',
//            error:function(){
//                console.log('error');
//            },
//            success:function(result){
//                if(result.status == 1){
//                    $.each(result.data,function(index,item){
//                        var W = item.width;
//                        var H = item.height;
//                        var li = $('<li class="item swiper-slide"></li>')
//                                    .css({
//                                        'background':"url(" + item.ma_src + ") no-repeat center center",
//                                         "height": parseInt(swiperElemH),
//                                          "width": parseInt(swiperElemW),
//                                          "float":'left'
//                                    })
//                                    //下面两个属性在确定所选图案时，会用
//                                    .attr({
//                                        'data-w':parseInt(num/H * W),
//                                         'data-H':num
//                                    });
////
//                          if( swiperElemH / swiperElemW > H / W){
//                              li.css({
//                                  'background-size':'80% ' + 0.8*swiperElemW/W * H +'px'
//
//                              })
//                          }else{
//                              li.css({
//                                  'background-size': 0.8*swiperElemH/H * W+'px 80%'
//                              })
//                          }
//
//
//                        //每添加一个图案就增加图案父元素的宽度
//                        elem.width(swiperElemW * (++index));
//                        elem.append(li);
//                    });
//                }
//            },
//            dataType:'json'
//        });
//
//        swiperElem.append(elem);
//    }
//
//};

/**
 * 发送ajax请求的构造函数
 * @constructor
 */
function Ajax(){
    //用来保存每个相框请求到的画心列表
    this.picData={};
}

/**
 * 发送创建场景的请求
 */
Ajax.prototype.createScene = function(){
    var hash = getHashValue();
    var me = this;
    $.ajax({
        type:"POST",
        data:{hash:hash.split('$/')[1]},
        url:'/pw/index.php/home/'+ hash.split('$/')[0] +'/index',
        dataType:'html',
        success:function(result){
                var container = $('#container');
                //在移除元素之前，解除子元素绑定的事件
                container.find('a').each(function(index,cur){
                    $(cur).unbind();
                });
                container.find('#backBtn').unbind();
                //将返回的新模块插入模块容器中
                container.html(result);

                //如果现在渲染的页面是drag页面
                var isDrag = container.find('#drag');
                if(isDrag.length > 0){
                    drag.init(isDrag,me);
                }

                var backBtn = container.find('#backBtn');

                if(backBtn) {
                    //后退
                    backBtn.on('click', function () {
                        history.back();
                    });
                }

                //得到所有没有href属性的a标签
                var link = container.find('a').not(function(cur){
                    var href = $(cur).attr('href');
                    return href ? true : false;
                });


                link.each(function(index,cur){

                    $(cur).on('click',function(event){
                    //防止连续发送请求
                        event.preventDefault();
                        $(this).unbind();
                        var hashValue = $(this).attr('data-id');
                        var type = $(this).attr('data-type');
                        //如果存在data-type属性
                        if(type) {
                            //改变hash值
                            location.hash = "#/" + hashValue + '$/' + type;
                        }else{
                            location.hash = '#/' + hashValue;
                        }
                    });
                });
        }
    });
};
/**
 * 请求翻页
 * @param page 要请求的页码
 */
Ajax.prototype.turnPage = function(page){
    $.ajax({
        type:"POST",
        data:{
            p:page
        },
        url:"/pw/index.php/home/drag/page",
        dataType:'json',
        success:function(result){
            if(result.status === 1){
                var items = $('#dragList');
                var listStr = '';
                $.each(result.data,function(dataIndex,data){
                      listStr += '<li class="item f-padding7">'+
                                        '<div class="picGroup">'+
                                            '<img src="/pw'+ data.pic_src +'" alt=" 相框 " data-code="'+ data.id +'" data-type="'+ data.type +'" data-twidth="'+ data.t_width +'" data-theight="'+ data.t_height +'" data-src="'+ data.imgfile +'"/>'+
                                            '<img class="pic" src="/pw'+ data.de_src +'" alt=" 相框 " data-code="'+ data.ma_id +'" data-type="'+ data.type +'" data-src="/pw'+ data.de_src +'"/>'+
                                        '</div>'+
                                        '<div class="info">'+
                                            '<div class="name">'+
                                                data.name+
                                            '</div>'+
                                            '<div class="price">'+
                                                parseFloat(data.price).toFixed(2)+
                                            '</div>'+
                                        '<div>'+
                                    '</li>';
                });
                items.html(listStr);
                //注册拖拽事件
                items.find('.pic').each(function(index,cur){
                    drag.listener($(cur),'touchstart',drag.touchStart);
                });

            }
        }
    });
};
/**
 * 请求可以切换的画心
 * @param picGroup 要切换画心的相框 jquery节点
 */
Ajax.prototype.getPic = function(picGroup){
    var me = this;
    var defaultPic = picGroup.find('.pic');
    var type = defaultPic.attr('data-type');
    var code = defaultPic.attr('data-code');
    //如果存在要请求的相关数据则不发送请求
    if(me.picData.hasOwnProperty(code)){
        transition.addPicList(picGroup,me.picData[code]);
    }else{
        $.ajax({
            type: "POST",
            data: {
                type: type
            },
            url: "/pw/index.php/home/mater/findbytype",
            dataType: 'json',
            success: function (result) {
                if (result.status === 1) {
                    //将请求到的数据缓存起来
                    me.picData[code] = result.data;
                    transition.addPicList(picGroup,me.picData[code]);
                }
            }
        })
    }


};
/**
 * 得到hash值，不包含#/
 */
function getHashValue(){
    return location.hash.split('#/')[1];
}
module.exports  = function(){
    return new Ajax();
};