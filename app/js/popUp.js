/**
 * Created by Administrator on 2016/11/8.
 */
var $ = require('jquery');
//选择照片墙尺寸
var TYPE_SIZE = 0;
/**
 * 弹窗类
 * @param type 生成弹窗的类型
 * @constructor
 */
function PoPUp(type){
    this.type = type;
}
/**
 * 生成弹窗
 */
PoPUp.prototype.createPopUp = function(){
    if(this.type === TYPE_SIZE){
        this.__sizePopUp();
    }
};
/**
 * 生成选择尺寸的弹窗
 * @private
 */
PoPUp.prototype.__sizePopUp = function(){
    createMask();
    //将当前对象保存起来
    var me = this;
    var sizeArr = ['250cm * 200cm','200cm * 100cm','100com * 80cm'];
    //选项的个数
    var num =3;
    var listStr = "";
    for(var i = 0;i<num;i++){
        listStr += "<li class='item'><button type='button' data-value='2' value='"+ sizeArr[i]+"' class='u-sizeItem f-cancel'>"+sizeArr[i]+"</button></li>";
    }
    var ul = $('<ul class="list"></ul>').html(listStr);
    var PopUpSize = $('<div class="m-PoPUpSize"></div>')
        .animate({
            'width':'75%',
            'height':'180px'
        },100);
    addElem($('body'),PopUpSize);
    var header = $('<div class="header clearfix">选择照片墙尺寸</div>').append('<button class="u-close f-cancel" data-value="0">X</button>');
    addElem(PopUpSize,header);
    addElem(PopUpSize,ul);
    var btnOK = $('<button type="button" class="f-btnOk f-cancel" data-value="1">确定</button>');
    addElem(PopUpSize,btnOK);
    //给关闭按钮和确定按钮绑定点击事件
    btnOK.unbind('click').on('click',function(event){
       btnHander(event,PopUpSize,me);
    });
    header.find('.u-close').unbind('click').on('click',function(event){
       btnHander(event,PopUpSize);
    });

    //给尺寸选项绑定点击事件
    ul.find('button').each(function(index,elem){
        $(elem).unbind('click').on('click',function(event){
            me.size = choiceSize(event);
        });
    });

};
/**
 * 生成蒙层
 */
function createMask(){
    var mask = $('<div class="f-mask f-full" id="mask"></div>');
    addElem($('body'),mask);
}
/**
 * 插入元素
 * @param parent 父元素
 * @param child 子元素
 */
function addElem(parent,child){
    parent.append(child);
}
/**
 * 移除元素
 * @param elem 需要被移除的元素
 */
function removeElem(elem){
    elem.remove();
}
/**
 * 点击确定和取消按钮的回调函数
 * @param event 事件对象
 * @param popUpElem 弹窗元素
 * @param PoPUpObj 弹窗对象
 */
function btnHander(event,popUpElem,PoPUpObj){
    var $target = $(event.target);

        event.stopPropagation();
        event.preventDefault();

        var mask = $('#mask');
        removeElem(mask);

        //移除弹窗元素
        removeElem(popUpElem);

    //判断点击的是确定按钮,取消按钮还是选择尺寸,1为确定按钮，0为取消按钮，2为选择尺寸
    var dataValue = $target.attr('data-value');
    if(dataValue === '1'){
        console.log(PoPUpObj.size);
    }
    //停留在当前场景
    if(dataValue === '0'){
        //将提示框显示出来
        $('.m-living').find('.u-notice').each(function(index,elem){
            $(elem).show();
        });
    }

}
/**
 * 选择尺寸的回调函数
 * @param event 事件对象
 */
function choiceSize(event){
    var $target = $(event.target);

    event.preventDefault();
    event.stopPropagation();

    //保存所选的尺寸信息
    var sizeValue = $target.val();

    //给被点击的尺寸添加选择样式
    $target.parents('.list').find('button').removeClass('u-sizeItem-on');
    $target.addClass('u-sizeItem-on');

    return sizeValue;

}
module.exports = PoPUp;