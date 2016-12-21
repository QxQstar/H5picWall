/**
 * Created by Administrator on 2016/10/21.
 */

var $ = require('jquery');
var drag = require('./drag.js');
var transition = require('./transition.js');
var popUp = require('./popUp.js')();
var showObj = require('./show.js')();

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
        var container, isDrag, backBtn, link,button,isShow,during;
        container = $('#container');

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


        //将要渲染的页面是展示页面
        if(hash.indexOf('show') >= 0){
            container
                .find('#footer')
                .animate({
                    height:0,
                    padding:0
                },400,function(){
                    container
                        .find('#fixed')
                        .animate({
                            opacity:0
                        },200,function(){
                            container
                                .find('#control')
                                .animate({
                                    opacity:0
                                },100,crateScene);
                        });
                });
        }else{
            if(hash.indexOf('drag') >= 0){
                during = 200
            }else{
                during = 400;
            }
            container
                .css({
                    width:0,
                    height:0,
                    opacity:0
                })
                .animate({
                    opacity:1,
                    width:'100%',
                    height:'100%'
                },during);
            crateScene();
        }

        function crateScene() {

            //将返回的新模块插入到模块容器中
            container.html(result);
            //如果现在渲染的页面是drag页面
            isDrag = container.find('#drag');
            //如果现在渲染的页面是show页面
            isShow = container.find('#show');

            if (isDrag.length > 0) {
                //等图片加载完
                loadImg(isDrag, me, drag.init);

            } else if (isShow.length > 0) {
                loadImg(isShow, me, function (isShow, ajaxObj) {
                    showObj.init(isShow, ajaxObj);
                });
            }


            backBtn = container.find('#backBtn');

            if (backBtn.length > 0) {
                //后退
                backBtn.on('click', function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    history.back();
                });
            }

            //得到所有没有href属性的a标签
            link = container.find('a').not(function (cur) {
                var href;
                href = $(cur).attr('href');
                return href ? true : false;
            });

            if (link.length > 0) {
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
                //请求成功后将loading移除
                $('#popMask').animate({
                    opacity:0
                },500,function(){
                    $('#popMask').remove();
                });
                //缓存结果
                me.sceneData[hash] = result;

                addScene(me.sceneData[hash]);
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
                                '<img class="pic" src="/pw' + item.de_src + '" alt=" 画心 " data-code="' + item.ma_id + '" data-type="' + item.type + '" data-src="/pw' + item.de_src + '" data-price="'+ parseFloat( item.ma_price ).toFixed(2) +'"/>' +
                            '</div>' +
                            '<div class="info">' +
                                '<div class="name">' +
                                    item.name +
                                '</div>' +
                                '<div class="price">' +
                                    "￥" + ( parseFloat(item.price) + parseFloat(item.ma_price) ).toFixed(2) +
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
 * @param scaleObj 缩放对象
 */
Ajax.prototype.confirm = function(control,scaleObj){
    var offsetScale,data = {},bg,scale,ratio,screen_height;
    //判断控制台是否进行了放大
    if(scaleObj.controlMagnify){
        offsetScale = scaleObj.controlRate;
    }else{
        offsetScale = 1;
    }
    this.scaleObj = scaleObj;
    //从厘米到像素的转换比例
    scale = scaleObj.transformRate;
    ratio = parseFloat( ( $(window).width() / $(window).height() ).toFixed(2) );
    bg = getHashValue().split('$/')[1];
    screen_height = $(window).height();
    control.find('.picGroup').each(function(index,picGroup){
        var $picGroup,frame;
        $picGroup = $(picGroup);
        frame = $picGroup.children('img').first();

        data[index] = {
            pic_id:frame.attr('data-code'),
            ma_id:frame.attr('data-piccode'),
            m_x:$picGroup.offset().left / offsetScale | 0,
            m_y:$picGroup.offset().top / offsetScale| 0,
            t_x:parseInt( $picGroup.css('left') ) / scale /offsetScale | 0,
            t_y:parseInt( $picGroup.css('top') ) / scale / offsetScale| 0,
            pic_height:frame.height() / offsetScale,
            pic_width:frame.width() / offsetScale,
            bg:bg,
            ratio:ratio,
            screen_height:screen_height
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
                popUp.info('没有拖入相框');
            }
        }
    });

};
/**
 * 发送登录请假
 * @param login 登录模块的父元素 jquery对象
 */
Ajax.prototype.login = function(login){
    var data;
     data = {
        username:login.find('#message').val(),
        password:login.find('#password').val()
    };
    $.ajax({
        type: "POST",
        data: data,
        url: "/pw/index.php/home/login/login",
        dataType: 'json',
        success:function(result){
            popUp.info(result.msg);
        }
    });

};
/**
 * 注册
 * @param data 提交的数据
 */
Ajax.prototype.register = function(data){
    $.ajax({
        type: "POST",
        data: data,
        url: "/pw/index.php/home/login/reg",
        dataType: 'json',
        success:function(result){
            popUp.info(result.msg);
        }
    });
};
/**
 * 发送验证码
 * @param tel 发送验证码的手机号
 */
Ajax.prototype.sendYZM = function(tel){
    var exp = /^\d{6}1$/;
    $.ajax({
        type: "POST",
        url:"/Execution.aspx?type=shouji_yzm&shouji=" + tel + "",
        processData: true,
        success:function(data){
            if(exp.test(data)){
                popUp.info('发送成功');
            }else{
                popUp.info('发送失败');
            }
        }
    });
};
/**
 * 发送验证电话号码是否已经注册的请求
 * @param tel 要验证的电话号码
 * @param registerObj register对象
 */
Ajax.prototype.checkTel = function(tel,registerObj){
    $.ajax({
        type: "POST",
        data: {tel:tel},
        url: "/pw/index.php/home/login/checkuser",
        dataType: 'json',
        success:function(result){

            registerObj.telStatus = result.status;
            //1表示可用
            if(!result.status){
                popUp.info(result.msg);

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
 * 添加到购物车
 * @param show show模块 jquery对象
 */
Ajax.prototype.addCart = function(show){
    var data,hashArr,picGroups,gouwuchehao,frames,pics;
    hashArr = getHashValue().split('$/');
    gouwuchehao = hashArr[ hashArr.length - 1 ];
    data = {};
    picGroups = show.find('.picGroup');
    frames = picGroups.find('.frame');
    pics = picGroups.find('.pic');
    frames.each(function(index,frame){
        data[index] = {
            leixing:'相框',
            laiyuanbianhao:$(frame).attr('data-code'),
            gouwuchehao:gouwuchehao
        }
    });
    pics.each(function(index,pic){
        data[frames.length + index] = {
            leixing:'作品',
            laiyuanbianhao:$(pic).attr('data-code'),
            gouwuchehao:gouwuchehao
        }
    });
    $.ajax({
        type: "POST",
        data: data,
        url: "/pw/index.php/home/cart/addcart",
        dataType: 'json',
        success:function(result){
            if(result.status){
                popUp.info(result.msg);
                setTimeout(function(){
                    location.href = result.data;
                },2000);

            }else{
                popUp.info(result.msg);
            }
        }
    });
};
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