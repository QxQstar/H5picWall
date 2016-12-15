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
 */
Canvas.prototype.createCanvas = function(target,parent,padding){
    var canvas;
    padding = typeof padding !== 'undefined' ? padding : this.padding;
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
        this.drawLine(canvas[0],padding);
        return canvas;
    }else {
        return this.isSupport;
    }
};
/**
 * 画参考线
 * @param canvas 画参考线的canvas元素
 * @param padding 参考线生长的长度
 */
Canvas.prototype.drawLine = function(canvas,padding){
    var context;
    context = canvas.getContext('2d');

    //画横线
    this.drawDash(context,0,canvas.width,padding,padding,10);
    this.drawDash(context,0,canvas.width,canvas.height - padding,canvas.height - padding,10);
    //画竖线
    this.drawDash(context,padding,padding,0,canvas.height,10);
    this.drawDash(context,canvas.width - padding,canvas.width - padding,0,canvas.height,10);

    context.strokeStyle = '#333';
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
 */
Canvas.prototype.drawDash = function(ctx,x1,x2,y1,y2,dashLen){
    var offsetLenX,offsetLenY,dashLength,dashNum,i;
    offsetLenX = Math.abs(x1 - x2);
    offsetLenY = Math.abs(y1 - y2);
    dashLength = !dashLen ? 5 : dashLen;
    dashNum = offsetLenX ? Math.floor(offsetLenX / dashLength) : Math.floor(offsetLenY / dashLength);

    if(offsetLenX){//画水平线,y1和y2相等
        for( i=0; i<dashNum; i++){
            if(i % 2 === 0){
                ctx.moveTo(x1 + (offsetLenX/dashNum) * i,y1);
            }else{
                ctx.lineTo(x1 + (offsetLenX/dashNum) * i, y1);
            }
        }
    }else {//画竖直线，x1和x2相等
        for (i = 0; i < dashNum; i++) {
            if (i % 2 === 0) {
                ctx.moveTo(x1, y1 + (offsetLenY / dashNum) * i);
            } else {
                ctx.lineTo(x1, y1 + (offsetLenY / dashNum) * i)
            }
        }
    }
};

module.exports = function(){
    var canvas;
    canvas = new Canvas();
    canvas.supportCanvas();
    return canvas;
};



