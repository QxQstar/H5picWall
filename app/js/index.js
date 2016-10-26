/**
 * Created by Administrator on 2016/10/20.
 */
require('../css/base.css');
require('../css/drag.css');
var $ = require('jquery');
var untilEvent = require('./untilEvent.js');
var drag = require('./drag.js');
var position = require('./position.js');var ajax = require('./ajax.js');

var dragList = $('#dragList');


//可拖拽元素的水平，竖直间距
var gap = {
    X:20,
    Y:10
};

//通过ajax获取可拖拽的元素的列表
ajax.getInitImg(dragList,gap);
//设置每个元素
//初始化可拖拽元素的位置
position.init(dragList,gap);

//设置控制台的高度。控制台的高度为屏幕的高度减去拖拽列表的盖度
var control = $('#control');
control.height( $(window).height() - dragList.height() );

//给每个拖动元素绑定touchstart事件
var dragElem = dragList.children();
dragElem.each(function(index,elem){

    untilEvent.addEvent(elem,'touchstart',drag.touchStart);
});

//拖拽元素的父元素的id值为dragList,操作台的id值为control
drag.setID('dragList','control');

//控制台提示文字
var info = $('<div class="notice" id="notice">该区域内不能放置</div>')
    .css({
        'position':'absolute',
        'display':'none',
        'color':'red',
        'font-size':'12px',
        'border':'red dotted 2px',
        'box-shadow':'0 0 1px red'
    });

control.append(info);