/**
 * Created by Administrator on 2016/10/20.
 */



var $ = require('jquery');
var position = require('./position.js');
var transition = require('./transition.js');
var canvasObj = require('./canvas.js')();
var scaleObj = require('./scale.js')();

var drag = {
    //拖拽列表的id值
    dragParen:undefined,
    //操作台的id值
    control:undefined,
    //当前触摸点相对视口的位置
    touchPos:{
        X:undefined,
        Y:undefined
    },
    //开始滑动触摸点相对视口的位置
    startTouchPos:{
        X:undefined,
        Y:undefined
    },
    //触摸点相对于移动块的位置
    touchOffsetPos:{
        X:undefined,
        Y:undefined
    },
    //是否重叠
    isCover:undefined,
    //canvas用于生成参考线
    canvas:undefined,

    /**
     * 获取拖拽列表id和控制台的ID的值
     * @param dragList 拖拽列表的id属性
     * @param control 控制台的id属性
     * @private
     */
    __setID:function(dragList,control){
        this.dragParent = dragList;
        this.control = control;
    },
    /**
     * 初始化drag模块，包括定位和绑定事件
     * @param dragDOM drag模块的包裹节点，最外层的节点 i属性为#drag的节点
     * @param ajaxObj 发送ajax的对象
     */
    init:function(dragDOM,ajaxObj){
        var listContent,height,fixed,control,controlMaxSize,wallSize,rateWall,
            rateControl,next,prev,okBtn;
        //将ajax对象保存起来
        drag.ajaxObj = ajaxObj;
        //将控制台重置为未放大状态
        scaleObj.controlMagnify = false;
        //将画框重置为未放大状态
        scaleObj.frameMagnify = false;

        drag.__setID('dragList','control');
        //获取拖拽列表的高度
        listContent = dragDOM.find('#footer');
        height = listContent.height() | 0;
        //给放大缩小的icon定位
        fixed = dragDOM.find('#fixed');
        fixed.css({
            bottom:height + 20 + 'px'
        });
        //綁定拖拽事件
        listContent.find('.pic').each(function(index,cur){
            drag.listener($(cur),'touchstart',drag.touchStart);
        });


        //控制台
        control = dragDOM.find('#' + drag.control);
        //控制台能够显示的最大尺寸
        controlMaxSize = {
            W:control.width(),
            H:$(window).height() - 52 - (height + 20 + fixed.height())
        };
        //控制台能够放大的最大尺寸受高度控制
        scaleObj.controlMaxSize = {
            H:controlMaxSize.H
        };


        //要创建的照片墙的真实尺寸，单位是cm
        wallSize = {
            W:dragDOM.attr('data-width') | 0,
            H:dragDOM.attr('data-height') |0
        };

        rateWall = wallSize.H / wallSize.W;
        rateControl = controlMaxSize.H / controlMaxSize.W;
        if( rateWall> rateControl){
            var controlH = controlMaxSize.H * 0.9;
            control.height(controlH | 0).width(controlH/wallSize.H*wallSize.W | 0);
        }else{
            control.width(controlMaxSize.W).height(rateWall * controlMaxSize.W | 0)
        }
        //将控制台放大前的尺寸保存起来
        scaleObj.controlOriginalSize = {
            H:control.height(),
            W:control.width()
        };
        //控制台缩放的比例
        scaleObj.controlRate = scaleObj.controlMaxSize.H / scaleObj.controlOriginalSize.H;
        //从厘米到像素的转换比例
        scaleObj.transformRate = scaleObj.controlOriginalSize.W / ($('#drag').attr('data-width') | 0);

        //给放大缩小icon绑定事件
        drag.listener($('#magnify'),'click',scale);

        function scale(event){
            scaleObj.controlScale(event,control);
        }

        //初始化当前是第1页
        listContent.data({
            page:1
        });
        next = dragDOM.find('#next');
        prev = dragDOM.find('#prev');
        //翻页
        drag.listener(next,'click',clickPage);
        drag.listener(prev,'click',clickPage);

        function clickPage(event){
            turnPage(event,ajaxObj);
        }

        //给顶部的确定按钮绑定事件
        okBtn = dragDOM.find('#okBtn');
        drag.listener(okBtn,'click',confirm);
        function confirm(event){
            var $target;
            //阻止默认行为和冒泡/捕获
            event.stopPropagation();
            event.preventDefault();

            $target = $(event.target);
            //如果存在一个相框处于放大状态，不能点确定
            if(scaleObj.frameMagnify){
                return false;
            }
            //解除绑定的事件，防止多次提交
            $target.unbind('click');

            ajaxObj.confirm(control,scaleObj.transformRate);

        }

    },
    /**
     * 注册事件
     * @param elem jquery节点，需要注册事件的元素
     * @param eventname 字符串 ，要註冊的事件名
     * @param handler 函數， 事件處理程序
     */
    listener:function(elem,eventname,handler){
        elem.unbind(eventname).on(eventname,handler);
    },
    touchStart:function(event){
        var $target,picGroup,control,frame;
        //阻止冒泡
        event.stopPropagation();

        //阻止浏览器默认的缩放和滚动
        event.preventDefault();


         $target = $(event.target);
        //实际要移动的节点
        picGroup = $target.parent('.picGroup');

        drag.startTouchPos.X = event.targetTouches[0].clientX;
        drag.startTouchPos.Y = event.targetTouches[0].clientY;

        drag.touchPos.X = drag.startTouchPos.X;
        drag.touchPos.Y = drag.startTouchPos.Y;
        if(picGroup.length > 0) {
            drag.touchOffsetPos.X = drag.startTouchPos.X - picGroup.offset().left;
            drag.touchOffsetPos.Y = drag.startTouchPos.Y - picGroup.offset().top;
        }

        //如果相框处于放大的状态不能拖动
        if(!scaleObj.frameMagnify) {


            control = $('#' + drag.control);
            //如果移动的元素是拖拽列表的后代，则要替换图片,还需要修改尺寸
            if (isOffspring(picGroup, drag.dragParent)) {

                $target.css({
                    opacity: '1'
                });


                frame = picGroup.children().first('img');

                //将缩略图缓存起来
                picGroup.data({
                    thumbnail: frame.attr('src')
                });

                drag.listener(frame, 'load', function () {
                    var scale;
                    scale = scaleObj.transformRate;
                    //如果控制台处于放大的状态
                    if (scaleObj.controlMagnify) {
                        scale = scaleObj.transformRate * scaleObj.controlRate;
                    }
                    //修改相框的尺寸,并将尺寸保存在属性，在放大和缩小控制台的时候需要使用
                    frame
                        .height(( (frame.attr('data-theight') | 0) * scale) | 0)
                        .width(( (frame.attr('data-twidth') | 0) * scale ) | 0)
                        .attr({
                            originalWidth: ( (frame.attr('data-twidth') | 0) * scale ) | 0,
                            originalHeight: ( (frame.attr('data-theight') | 0) * scale ) | 0
                        });

                    drag.canvas = canvasObj.createCanvas(picGroup, control);

                });

                //修改src属性,修改src属性会引起图片的加载
                frame.attr({
                    src: frame.attr('data-src')
                })
            } else {
                drag.canvas = canvasObj.createCanvas(picGroup, control);
            }
        }
        //给目标元素绑定touchMove事件
        drag.listener($target, 'touchmove', drag.touchMove);

        //给目标元素绑定touchend事件
        drag.listener($target, 'touchend', drag.touchEnd);
    },
    touchMove:function(event){
        var $target,picGroup,control,dragListPar,controlOffset,sitControl,padding;
        //阻止冒泡
        event.stopPropagation();

        //阻止浏览器默认的缩放和滚动
        event.preventDefault();

        $target = $(event.target);
        //实际要移动的节点
        picGroup = $target.parent('.picGroup');

        //获得触摸点的位置
        drag.touchPos.X = event.targetTouches[0].clientX;
        drag.touchPos.Y = event.targetTouches[0].clientY;

        //如果相框处于放大的状态不能拖动，
        if(!scaleObj.frameMagnify) {


            //修改移动块的位置
            picGroup.offset({
                top: ( (drag.touchPos.Y - drag.touchOffsetPos.Y) | 0 ),
                left: ( (drag.touchPos.X - drag.touchOffsetPos.X) | 0 )
            });
            //得到控制台和拖动元素列表的祖先元素
            control = $("#" + drag.control);
            dragListPar = $('#' + drag.dragParent);
            if (!controlOffset) {
                controlOffset = getControlOffset(control);
            }

            //拖动元素是否位于控制台的范围内,
            sitControl = position.isRang(control, dragListPar, picGroup);

            //如果canvas存在就修改canvas的位置,当被拖的元素位于控制台才显示canvas
            if (drag.canvas && sitControl) {
                padding = canvasObj.padding;
                //之所以要减一，是因为参考线的宽度为1
                drag.canvas.css({
                    display: 'block',
                    top: (drag.touchPos.Y - drag.touchOffsetPos.Y - controlOffset.top - padding - 1) + 'px',
                    left: (drag.touchPos.X - drag.touchOffsetPos.X - controlOffset.left - padding - 1) + 'px'
                });
            }
            if (!sitControl && drag.canvas) {
                drag.canvas.css({
                    display: 'none'
                })
            }
        }

    },
    touchEnd:function(event) {
        var $target,picGroup,control,dragListPar,controlOffset,
            sitControl,newPicGroup,total,nowPrice,newPrice;
        //阻止冒泡
        event.stopPropagation();

        //阻止浏览器默认的缩放和滚动
        event.preventDefault();


        //将canvas从控制台移除
        if(drag.canvas) {
            drag.canvas.remove();
            drag.canvas = undefined;
        }

        $target = $(event.target);
        picGroup = $target.parent('.picGroup');
        //得到控制台和拖动元素列表的祖先元素
        control = $("#" + drag.control);
        dragListPar = $('#' + drag.dragParent);

        controlOffset = getControlOffset(control);
        if(picGroup.length > 0) {
            //拖动元素是否位于控制台的范围内,
            sitControl = position.isRang(control, dragListPar, picGroup);
            //是否存在覆盖
            drag.isCover = position.compare(control, picGroup);
        }
        //拖动相框，而非点击放大
        if( (Math.abs(drag.startTouchPos.X - drag.touchPos.X) > 2 || Math.abs(drag.startTouchPos.Y - drag.touchPos.Y) > 2 ) ) {
            //如果相框处于放大的状态执行切换画心的操作，不移动元素

            if(scaleObj.frameMagnify){

                if(drag.startTouchPos.X > drag.touchPos.X){
                    //下一张
                    //$('#list')表示画心列表
                    transition.changePic(1,$('#picList'));
                }else if(drag.startTouchPos.X < drag.touchPos.X){
                    //上一张
                    transition.changePic(-1,$('#picList'));
                }
                return false;
            }
            //如果被移动的元素是拖拽列表的后代
            if (isOffspring(picGroup, drag.dragParent)) {

                //如果元素位于控制台范围,没有覆盖并且相框没有放大
                if (sitControl && !drag.isCover && !scaleObj.frameMagnify) {
                    newPicGroup = picGroup.clone();
                    //添加一个唯一标识，与数据库无关
                    newPicGroup.attr('id', ("" + Math.random()).replace('.', "_"));

                    //注册事件
                    drag.listener(newPicGroup.find('.pic'), 'touchstart', drag.touchStart);
                    //将克隆出的元素插入控制台
                    position.addTo(newPicGroup, control, picGroup);

                    //将价格缓存起来
                    newPicGroup.data({
                        'price':(picGroup.next('.info').find('.price').html()).slice(1)
                    });
                    newPicGroup
                        .css({
                            position: 'absolute'
                        })
                        .attr({
                            coordX: newPicGroup.offset().left - controlOffset.left,
                            coordY: newPicGroup.offset().top - controlOffset.top
                        });

                    //总价增加
                    total = $('#fixed').find('.total');
                    nowPrice = parseFloat( total.html() );
                    newPrice = nowPrice + parseFloat(newPicGroup.data('price'));
                    total.html(newPrice);


                }
                //将移动元素恢复到初始位置
                position.restore(picGroup);
                //隐藏提示
//                control.find('#notice').hide();

            } else {
                if (!sitControl) {
                    //总价减少
                    total = $('#fixed').find('.total');
                    nowPrice = parseFloat( total.html() );
                    newPrice = nowPrice - parseFloat(picGroup.data('price'));
                    total.html(newPrice);
                    picGroup.remove();

                }
                //回复到原来的位置
                if (drag.isCover) {
                    //隐藏提示
//                    control.find('#notice').hide();
                    picGroup.css({
                        top: picGroup.attr('coordY') + 'px',
                        left: picGroup.attr('coordX') + 'px'
                    });
                }
                //修改coordX和coordY屬性
                picGroup
                    .attr({
                        coordX: picGroup.offset().left - controlOffset.left,
                        coordY: picGroup.offset().top - controlOffset.top
                    });
            }
        }else{
            //如果点击的元素是拖拽列表的后代
            if(isOffspring(picGroup,drag.dragParent)) {
                position.restore(picGroup);
            }else{
                //如果点击的元素不是拖拽列表的后代才放大
                scaleObj.magnifyFrame(picGroup,drag.ajaxObj);
            }


        }

    }
};
module.exports = drag;
/**
 * 发送翻页请求
 * @param event 事件处理对象
 * @param ajaxObj ajax对象
 */
function turnPage(event,ajaxObj){
    event.preventDefault();
    event.stopPropagation();
    //可拖拽相框列表
    var listContent = $('#footer');
    var page = listContent.data('page');
    var _target = $(event.target);
    if(_target.attr('id') === 'next'){
        if(ajaxObj.totalPicPage){
            //如果当前就为最后一页，不发送请求，也不改变当前的页码
            if(page >= ajaxObj.totalPicPage){
                return;
            }
        }
        listContent.data({
            page:++page
        });
    }else if(_target.attr('id') === 'prev'){

        //如果当前就为第一页，不发送请求，也不改变当前的页码
        if(page <= 1){
            return;
        }

        listContent.data({
            page:--page
        });
    }
    ajaxObj.turnPage(page);
}
/**
 * 判断是否为后代元素
 * @param ancestor 祖先的id属性
 * @param offspring 后代
 */
function isOffspring(offspring,ancestor){
    return offspring.parents('#' + ancestor).length > 0;
}
/**
 * 获得节点相对于屏幕的偏移值
 * @param elem
 */
function getControlOffset(elem){
    return {
        top:elem.offset().top,
        left:elem.offset().left
    }
}


