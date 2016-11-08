/**
 * Created by Administrator on 2016/11/8.
 */
var $ = require('jquery');
var PopUp = require('./popUp.js');
//客厅
var TYPE_LIVING = 1;
//饭厅
var TYPE_DINING = 2;
//卧室
var TYPE_BEDROOM = 3;
//书房
var TYPE_STUDY = 4;
//走廊
var TYPE_AISLE = 5;
//类型数组
var TYPEARR = [TYPE_DINING,TYPE_BEDROOM,TYPE_STUDY,TYPE_AISLE];
/**
 * 创建场景的类
 * @param type 需要创建的创建的类型，默认创建客厅
 * @constructor
 */
function CreteScene(type){
    this.type = type
}
/**
 * 创建新场景，在这个函数中要判断需要创建什么场景，默认创建客厅
 */
CreteScene.prototype.startCreate = function(){
    //创建客厅
    if(typeof this.type === 'undefined' || this.type === TYPE_LIVING){
        this.__createLiving();
    }
    //创建走廊
    if(this.type === TYPE_AISLE){
        this.__createAisle();
    }
    //创建饭厅
    if(this.type === TYPE_DINING){
        this.__createDining();
    }
    //创建卧室
    if(this.type === TYPE_BEDROOM){
        this.__createBedroom()
    }
    //创建书房
    if(this.type === TYPE_STUDY){
        this.__createStudy();
    }
};
/**
 * 创建客厅
 * @private
 */
CreteScene.prototype.__createLiving = function(){
    //将当前对象保存起来
    var me = this;
    var container = $('#container');
    //在场景中创建提示框的数量
    var num = 2;
    //创建一个客厅模块，并将它加入到页面中
    var living = $('<div class="m-living f-full">')
                        .appendTo(container)
                        .css({
                            'background':'url(/upload/21c099ce1d4fd1a9ba1377c8c7841dd4.jpg) no-repeat center',
                            'background-size':'100% 100%'
                        });
    //给客厅模块添加箭头
    var arrows = $('<div class="arrows f-full"></div>');
    for(var i = 0;i<4;i++){
        arrows.html( arrows.html() + "<button type='button' type-data = '"+ TYPEARR[i] +"'class='u-arrow u-arrow-"+ i +"'></button>");
    }
    addElem(living,arrows);
    //给每个箭头绑定点击事件
    arrows.children('button').each(function(index,button){
        $(button).unbind('click').on('click',function(){
            //清空当前场景
            empty(living);
            //获得需要创建的类型
            me.type = $(this).attr('type-data') >> 0;
            //创建一个新场景
            me.startCreate();
        })
    });
    //给客厅中添加提示框
    var notices = me.__createNotice(num);
    for(var i=0,len = notices.length;i<len;i++){
        addElem(living,notices[i]);
        //为每个提示框添加一个点击事件
        notices[i].unbind('click').on('click',function(){
            //获得该区域是否拼图的标志位
            var finish = $(this).attr('value-data');
            if(finish === 'false'){
                //隐藏提示框
                 for(var i = 0;i<len;i++){
                     hideElem(notices[i]);
                 }
                var type_size = 0;
                var popUpObj = new PopUp(type_size);
                popUpObj.createPopUp();
            }
            if(finish === 'true'){

            }
        });
    }
};
/**
 *创建走廊
 * @private
 */
CreteScene.prototype.__createAisle = function(){
    console.log('走廊');
    console.log(this.type);
};
/**
 * 创建饭厅
 * @private
 */
CreteScene.prototype.__createDining = function(){
    console.log('饭厅');
    console.log(this.type);
};
/**
 * 创建卧室
 * @private
 */
CreteScene.prototype.__createBedroom = function(){
    console.log('卧室');
    console.log(this.type);
};
/**
 * 创建书房
 * @private
 */
CreteScene.prototype.__createStudy = function(){
    console.log('书房');
    console.log(this.type);
};
/**
 * 创建场景中的提示框
 * @param num 提示框的数量
 * @private
 */
CreteScene.prototype.__createNotice = function(num){
    var notices = [];
    var item = undefined;
    //给区域是否拼图的标志位
    var finish = false;
    for(var i = 0;i<num;i++){
        item = $('<button type="button" value-data='+ finish +' class="u-notice u-notice-'+ i +' f-shiny">' +
            '改区域可拼照片墙</button>');
        notices.push(item);
    }
    return notices;
};
/**
 * 清空场景
 * @param elem 需要清空的场景对象
 */
function empty(elem){
    elem.remove();
}
/**
 * 添加子元素
 * @param parent 父元素
 * @param child 子元素
 */
function addElem(parent,child){
    parent.append(child);
}
/**
 * 隐藏元素
 * @param elem 被隐藏的元素
 */
function hideElem(elem){
    elem.hide();
}
module.exports = CreteScene;