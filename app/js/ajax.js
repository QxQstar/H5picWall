/**
 * Created by Administrator on 2016/10/21.
 */

var $ = require('jquery');
var drag = require('./drag.js');
var transition = require('./transition.js');
//var layer = require('./layer.js');
var popUp = require('./popUp.js')();

/**
 * 发送ajax请求的构造函数
 * @constructor
 */
function Ajax(){
    //用来保存每个相框请求到的画心列表
    this.picData={};
    //用来保存渲染场景需要的数据
    this.sceneData={};
    //用来保存每一页相框的数据
    this.pagedata ={};
    //用来保存厘米到像素转换的比例
    this.scale = undefined;
}

/**
 * 发送创建场景的请求
 */
Ajax.prototype.createScene = function(){
    var hash,me,addScene,hashArr;
    //hash的值的形式为begin或者drag$/bedRoom等，只有当$/前面的值为drag时，$/后面才会有值
    hash = getHashValue();
    me = this;
    addScene = function(result){
        var container, isDrag, backBtn, link,button,isShow;
        container = $('#container').css({
            width:0,
            opacity:0
        });

        //在移除元素之前，解除子元素绑定的事件
        link = container.find('a');
        button  = container.find('button');
        if(link.length > 0){
            link.each(function (index, cur) {
                $(cur).unbind();
            });
        }

        if(button.length > 0){
            button.unbind();
        }

        //将返回的新模块插入模块容器中
        container.html(result);
        container
            .animate({
                opacity:1,
                width:'100%'
            },400);
        //如果现在渲染的页面是drag页面
        isDrag = container.find('#drag');
        if (isDrag.length > 0) {
            //等图片加载完
            loadImg(isDrag,me,drag.init);

        }

        //如果现在渲染的页面是show页面
        isShow = container.find('#show');
        if(isShow.length > 0){
            loadImg(isShow,me,modifySize);
        }

        backBtn = container.find('#backBtn');

        if (backBtn.length > 0) {
            //后退
            backBtn.on('click', function () {
                history.back();
            });
        }

        //得到所有没有href属性的a标签
        link = container.find('a').not(function (cur) {
            var href;
            href = $(cur).attr('href');
            return href ? true : false;
        });

        if(link.length > 0) {
            link.each(function (index, cur) {

                $(cur).on('click', function (event) {
                    //防止连续发送请求
                    event.preventDefault();
                    $(this).unbind();
                    var hashValue = $(this).attr('data-id');
                    var type = $(this).attr('data-type');
                    //只有data-id的值为drag时，才会存在data-type
                    if (type) {
                        //改变hash值
                        location.hash = "#/" + hashValue + '$/' + type;
                    } else {
                        location.hash = '#/' + hashValue;
                    }
                });
            });
        }


    };
    //如果存在相关数据就不发送请求
    if(me.sceneData.hasOwnProperty(hash)){
        addScene(me.sceneData[hash]);
    }else {
        hashArr = hash.split('$/');
        popUp.loading();
        $.ajax({
            type: "POST",
            data: {
                hash: hashArr[1],
                ps_code:hashArr[2]
            },
            url: '/pw/index.php/home/' + hashArr[0] + '/index',
            dataType: 'html',
            success: function (result) {
                if(hash.split('$/')[0] !== 'show'){
                    me.sceneData[hash] = result;
                }

                addScene(result);
            }
        });
    }
};
/**
 * 请求翻页
 * @param page 要请求的页码
 */
Ajax.prototype.turnPage = function(page){
    var me,addPage;
    me = this;
    //生成一页新的相框
    addPage = function(data){
        var items,listStr;
        items = $('#dragList');
        listStr = '';
        $.each(data, function (dataIndex, item) {
            listStr += '<li class="item f-padding7">' +
                            '<div class="picGroup">' +
                                '<img src="/pw' + item.pic_src + '" alt=" 相框 " data-code="' + item.id + '" data-type="' + item.type + '" data-twidth="' + item.t_width + '" data-theight="' + item.t_height + '" data-src="' + item.imgfile + '" data-piccode="'+ item.ma_id +'"/>' +
                                '<img class="pic" src="/pw' + item.de_src + '" alt=" 画心 " data-code="' + item.ma_id + '" data-type="' + item.type + '" data-src="/pw' + item.de_src + '"/>' +
                            '</div>' +
                            '<div class="info">' +
                                '<div class="name">' +
                                    item.name +
                                '</div>' +
                                '<div class="price">' +
                                    "￥" + parseFloat(item.price).toFixed(2) +
                                '</div>' +
                            '<div>' +
                        '</li>';
        });
        items.html(listStr);
        //注册拖拽事件
        items.find('.pic').each(function (index, cur) {
            drag.listener($(cur), 'touchstart', drag.touchStart);
        });

    };

    //如果存在相关数据就不发送请求
    if(me.pagedata.hasOwnProperty(page)){
        addPage(me.pagedata[page]);
    }else {
        $.ajax({
            type: "POST",
            data: {
                p: page
            },
            url: "/pw/index.php/home/drag/page",
            dataType: 'json',
            success: function (result) {
                if (result.status === 1) {
                    me.pagedata[page] = result.data;
                    //获取总共有多少页
                    me.totalPicPage = result.pageCount;
                    addPage(me.pagedata[page]);
                }
            }
        });
    }

};
/**
 * 请求可以切换的画心
 * @param picGroup 要切换画心的相框 jquery节点
 */
Ajax.prototype.getPic = function(picGroup){
    var me,defaultPic,type,code;
    me = this;
    defaultPic = picGroup.find('.pic');
    type = defaultPic.attr('data-type');
    //code表示每个相框的默认画心的id，这个值不会改变
    code = defaultPic.attr('data-code');
    //如果存在要请求的相关数据则不发送请求
    if(me.picData.hasOwnProperty(code)){
        transition.addPicList(picGroup,me.picData[code],drag);
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
                    transition.addPicList(picGroup,me.picData[code],drag);
                }
            }
        })
    }


};
/**
 * 确认所拼的照片墙
 * @param control 控制台，一个jquery 节点
 * @param scale 厘米与像素之间的转换比例
 */
Ajax.prototype.confirm = function(control,scale){
    this.scale = scale;
    var data = {},bg;
    bg = getHashValue().split('$/')[1];
    control.find('.picGroup').each(function(index,picGroup){
        var $picGroup,frame;
        $picGroup = $(picGroup);
        frame = $picGroup.children('img').first();

        data[index] = {
            pic_id:frame.attr('data-code'),
            ma_id:frame.attr('data-piccode'),
            m_x:$picGroup.offset().left | 0,
            m_y:$picGroup.offset().top | 0,
            t_x:parseInt( $picGroup.css('left') ) / scale | 0,
            t_y:parseInt( $picGroup.css('top') ) / scale | 0,
            bg:bg
        }
    });
    $.ajax({
        type: "POST",
        data: data,
        url: "/pw/index.php/home/show/add",
        dataType: 'json',
        success:function(result){
            if(result.status === 1){
                oldHash = getHashValue();
                location.hash = "#/" + 'show' + '$/' + oldHash.split('$/')[1] + '$/' + result.data
            }else{
                popUp.info();
            }
        }
    });

};
/**
 * 得到hash值，不包含#/
 */
function getHashValue(){
    return location.hash.split('#/')[1];
}
/**
 * 修改show页面中picGroup的尺寸
 * @param show id属性为#show的jquery节点
 * @param ajaxObj ajax对象
 */
function modifySize(show,ajaxObj){
    var scale = ajaxObj.scale;
    show.find('.picGroup').each(function(index,picGroup){
        var frame;
        frame = $(picGroup).children('img').first();
        frame
            .height(( (frame.attr('data-theight') | 0) * scale) | 0)
            .width(( (frame.attr('data-twidth') | 0) * scale ) | 0)
    });
}
/**
 * 给图片加载添加回调
 * @param parent img的祖先元素
 * @param ajaxObj ajax对象
 * @param callback 图片全部加载完成后执行的回调函数
 */
function loadImg(parent,ajaxObj,callback){
    var count,length,imgs;
    //已经加载完成的图片数量
    count = 0;
    imgs = parent.find('img');
    length = imgs.length;
    imgs
        .unbind('load')
        .on('load',function(){
            count ++;
            if(count === length){
                callback(parent,ajaxObj);
            }
        });
}
module.exports  = function(){
    return new Ajax();
};