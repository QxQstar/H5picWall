/**
 * Created by Administrator on 2016/12/2.
 */
var $ = require('jquery');
var popUpObj = require('./popUp.js')();
/**
 * 展示模块的构造函数
 * @constructor
 */
function Show(){
    //ajax对象
    this.ajaxObj = null;
    //scale对象
    this.scaleObj = null;
    //照片墙的数量，默认为1
    this.length = 1;
    //当前该显示的照片的序号，从1开始排序
    this.index = 1;
    this.warpElem = null;

}
/**
 * 修改展示模块中相框的尺寸和位置
 * @param show 展示模块 id属性为show的jquery节点
 */
Show.prototype.modifySize = function(show){

    var scale = this.scaleObj.transformRate;
    show.find('.picGroup').each(function(index,picGroup){
        var frame,$picGroup;
        $picGroup = $(picGroup);
        frame = $picGroup.children('img').first();
        frame
            .height(( (frame.attr('data-theight') | 0) * scale) | 0)
            .width(( (frame.attr('data-twidth') | 0) * scale ) | 0);

        //大小修改完成后将相框显示出来
        $picGroup
            .animate({
                opacity:1
            },10);

    });


};
/**
 * 初始化show模块，绑定必要的事件
 * @param show show模块，一个jquery节点
 * @param ajaxObj 对象
 */
Show.prototype.init = function(show,ajaxObj){
    var me,ancestor;
    me = this;
    //将show模块最外层的元素id保存起来
    me.warpElem = show.attr('id');
    me.ajaxObj = ajaxObj;
    me.scaleObj = ajaxObj.scaleObj;
    me.modifySize(show,ajaxObj);
    ancestor = $('#' + me.warpElem);
    //让ajax对象成为popUp对象的一个属性，方便在popUp模块中调用ajax对象中的方法
    popUpObj.ajaxObj = ajaxObj;
    shareBtn = $('#shareBtn');
    //给分享按钮绑定事件
//    shareBtn.on('click',function(){
//        var nativeShare,config;
//        nativeShare = $('<div id="nativeShare"></div>');
//        $('#' + me.warpElem).append(nativeShare);
//        config = {
//            url:'http://blog.wangjunfeng.com',
//            title:'魅拓照片墙',
//            desc:'魅拓照片墙',
//            img:'http://www.wangjunfeng.com/img/face.jpg',
//            img_title:'照片墙',
//            from:'魅拓照片墙'
//        };
//        share('nativeShare',config);
//    });


    //重置backbtn的事件处理程序
    ancestor
        .find('#backBtn')
        .unbind('click').on('click',function(event){
            event.stopPropagation();
            event.preventDefault();
            popUpObj.resetInfo(ancestor)
        });
    //添加购物车
    ancestor
        .find('#carBtn')
        .on('click',function(event){
            event.stopPropagation();
            event.preventDefault();
            //如果已经登录,执行添加到购物车
            if(isLogin()){
                me.ajaxObj.addCart(show);
            }else{
                popUpObj.login( $('#container') );
            }
        });

};
/**
 * 检查是否登录
 * @returns {boolean}
 */
function isLogin(){
    var cookie = document.cookie;
    if(cookie.indexOf('www_xiaoyu4_comuser_name=') >= 0){
        return true;
    }else{
        return false
    }

}
module.exports = function(){
    return new Show();
};