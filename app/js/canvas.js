/**
 * Created by Administrator on 2016/11/23.
 */
var $ = require('jquery');
/**
 * canvas类
 * @constructor
 */
function Canvas(){
    this.isSupport = null;
    //默認參考線的長度為200px
    this.padding = 200;
    this.color = "#999"
}
/**
 *判断浏览器是否支持canvas
 */
Canvas.prototype.supportCanvas = function(){
    this.isSupport =  !!$('<canvas></canvas>')[0].getContext;
};
/**
 * 创建canvas
 * @param target 新创建的canvas的尺寸依据
 * @param parent 新建canvas的父元素
 * @param padding 参考线生长的长度
 * @param color 线条的颜色
 */
Canvas.prototype.createCanvas = function(target,parent,padding,color){
    var canvas;
    padding = typeof padding !== 'undefined' ? padding : this.padding;
    color = typeof color !== 'undefined' ? color : this.color;
    if(this.isSupport){
        canvas = $('<canvas class="canvas"></canvas>');
        canvas[0].height = target.height() + 2*padding;
        canvas[0].width = target.width() + 2*padding;

        canvas.css({
            position:'absolute',
            display:'none',
            zIndex:11,
            margin:'auto'
        });
        parent.append(canvas);
        this.drawLine(canvas[0],padding,color);
        return canvas;
    }else {
        return this.isSupport;
    }
};
/**
 * 画参考线
 * @param canvas 画参考线的canvas元素
 * @param padding 参考线生长的长度
 * @param color 线条的颜色
 */
Canvas.prototype.drawLine = function(canvas,padding,color){
    var context,isRefer;
    context = canvas.getContext('2d');
    isRefer = padding > 0;

    //画横线
    this.drawDash(context,0,canvas.width,padding,padding,10,isRefer);
    this.drawDash(context,0,canvas.width,canvas.height - padding,canvas.height - padding,10,isRefer);
    //画竖线
    this.drawDash(context,padding,padding,0,canvas.height,10,isRefer);
    this.drawDash(context,canvas.width - padding,canvas.width - padding,0,canvas.height,10,isRefer);

    context.strokeStyle = color;
    context.lineWidth = 1;
    context.stroke();
};
/**
 * 将参考线画为虚线
 * @param ctx
 * @param x1 所画虚线的起点的x坐标，
 * @param x2 所画虚线的终点的x坐标
 * @param y1 所画虚线起点的y坐标
 * @param y2 所画虚线终点的y坐标
 * @param dashLen 虚线中线的长度
 * @param isRefer 是否是参考线
 */
Canvas.prototype.drawDash = function(ctx,x1,x2,y1,y2,dashLen,isRefer){
    var offsetLenX,offsetLenY,dashLength,dashNum, i,offset;
    offsetLenX = Math.abs(x1 - x2);
    offsetLenY = Math.abs(y1 - y2);
    offset = isRefer ? 0.5 : 0;
    dashLength = !dashLen ? 5 : dashLen;
    dashNum = offsetLenX ? Math.floor(offsetLenX / dashLength) : Math.floor(offsetLenY / dashLength);

    if(offsetLenX){//画水平线,y1和y2相等
        for( i=0; i<dashNum; i++){
            if(i % 2 === 0){
                ctx.moveTo(x1 + (offsetLenX/dashNum) * i + offset,y1 + offset);
            }else{
                ctx.lineTo(x1 + (offsetLenX/dashNum) * i + offset, y1 + offset);
            }
        }
    }else {//画竖直线，x1和x2相等
        for (i = 0; i < dashNum; i++) {
            if (i % 2 === 0) {
                ctx.moveTo(x1 +offset, y1 + (offsetLenY / dashNum) * i + offset);
            } else {
                ctx.lineTo(x1 + offset, y1 + (offsetLenY / dashNum) * i + offset)
            }
        }
    }
};
/**
 * 在控制台上面显示场景的大小
 * @param control 控制台，jquery节点
 * @param width 场景的宽度，单位cm
 * @param height 场景的高度，单位cm
 * @param color 颜色
 */
Canvas.prototype.sizeMark = function(control,width,height,color){
    if(this.isSupport){
        var top,left,right,canvas,context,fontW;
        color = typeof color !== 'undefined' ? color : this.color;
        top = control.offset().top;
        left = control.offset().left;
        right = control.offset().right;
        canvas = $('<canvas class="canvasMark" id="canvasMark"></canvas>');
        canvas[0].height = 10;
        canvas[0].width = control.width();
        canvas.insertBefore(control);
        context = canvas[0].getContext('2d');
        canvas.css({
            position:'absolute',
            left:left + 'px',
            top:top-canvas[0].height * 2 + 'px',
            right:right + 'px',
            zIndex:11
        });
        context.strokeStyle = color;
        //这里设置线的粗细为1，但是canvas画出的线的粗细并不为1px，画线的时候在起点后终点上加0.5可以让线的粗细为1px
        context.lineWidth = 1;
        //左边的圆圈
        context.beginPath();
        context.arc(canvas[0].height/2,canvas[0].height/2,canvas[0].height/4,0,2*Math.PI);
        context.stroke();
        //右边的圆圈
        context.beginPath();
        context.arc(canvas[0].width - canvas[0].height/2,canvas[0].height/2,canvas[0].height/4,0,2*Math.PI);
        context.stroke();
        //左边的线条
        context.beginPath();
        context.moveTo(canvas[0].height * 2 + 0.5,canvas[0].height / 2 + 0.5);
        context.lineTo(canvas[0].width / 3 + 0.5,canvas[0].height / 2 + 0.5);
        context.stroke();
        //右边的线条
        context.beginPath();
        context.moveTo(canvas[0].width / 3 * 2 + 0.5,canvas[0].height / 2 + 0.5);
        context.lineTo(canvas[0].width - canvas[0].height * 2 + 0.5,canvas[0].height/2 +0.5);
        context.stroke();
        //提示文字
        context.beginPath();
        context.font = "10px Courier New";
        context.fillStyle = color;
        context.textBaseline = 'top';
        //得到文字的宽度
        fontW = context.measureText(width + 'cm * ' + height +'cm').width;
        context.fillText(width + 'cm * ' + height +'cm',(canvas[0].width - fontW )/2,0);
    }
};
module.exports = function(){
    var canvas;
    canvas = new Canvas();
    canvas.supportCanvas();
    return canvas;
};



