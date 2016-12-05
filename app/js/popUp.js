var $ = require('jquery');
/**
 * 弹窗类
 * @constructor
 */
function PopUp(){

}
/**
 * 提示
 */
PopUp.prototype.info = function(){
    var info,mask;
    mask = $('<div class="f-mask" id="popUpMask"></div>')
                .css({
                        zIndex:800,
                        opacity:0.9
                });

    info = $('<div id="popUpInfo" class="m-popUpInfo">还没有拖入相框</div>')
        .animate({
            opacity:1,
            top:'100px'
        },400);
    mask
        .append(info);
    $('body')
        .children('#container')
        .append(mask);
    //提示信息显示一秒后消失
    setTimeout(function(){
            info.animate({
                opacity:0
            },400);
            mask.animate({
                opacity:0
            },function(){
                $(this).remove();
            });
    },1000);
};
/**
 * 正在加载
 */
PopUp.prototype.loading = function(){
    var load,str,arr, i,len,mask;
    arr = ['L','o','a','d','i','n','g'];
    mask = $('<div class="f-mask" id="popMask"></div>').css({
        zIndex:800,
        backgroundColor:'transparent'
    });
    load = $('<div class="m-load" id="popUpLoad"></div>');
    mask.append(load);
    str = '';
    len = arr.length;
    for(i = 0;i<len;i++){
        str += "<div class='u-text u-text-"+ (i+1) +"'>"+ arr[i] +"</div>";
    }
    load.html(str);
    $('#container')
        .append(mask);
};
module.exports = function(){
    return new PopUp()
};