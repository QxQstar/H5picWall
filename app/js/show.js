/**
 * Created by Administrator on 2016/12/2.
 */
var $ = require('jquery');
/**
 * չʾģ��Ĺ��캯��
 * @constructor
 */
function Show(){
    //ajax����
    this.ajaxObj = null;
    //scale����
    this.scaleObj = null;
    //��Ƭǽ��������Ĭ��Ϊ1
    this.length = 1;
    //��ǰ����ʾ����Ƭ����ţ���1��ʼ����
    this.index = 1;

}
/**
 * �޸�չʾģ�������ĳߴ��λ��
 * @param show չʾģ�� id����Ϊshow��jquery�ڵ�
 * @param ajaxObj ����
 */
Show.prototype.modifySize = function(show,ajaxObj){
    this.ajaxObj = ajaxObj;
    this.scaleObj = ajaxObj.scaleObj;
    var scale = this.scaleObj.transformRate;
    show.find('.picGroup').each(function(index,picGroup){
        var frame;
        frame = $(picGroup).children('img').first();
        frame
            .height(( (frame.attr('data-theight') | 0) * scale) | 0)
            .width(( (frame.attr('data-twidth') | 0) * scale ) | 0)
    });
};
/**
 * ��ʼ��showģ�飬�󶨱�Ҫ���¼�
 * @param show Ҫ���¼��Ľڵ㣬һ��jquery�ڵ�
 */
Show.prototype.init = function(show){
    var me = this;
    show.unbind('touchstart').on('touchstart',function(event){
        me.touchStart(event,me);
    });
};
/**
 * ��ʼ�������¼��������
 * @param event �¼�����
 * @param me Show����
 */
Show.prototype.touchStart = function(event,me){
    var $target;
    event.stopPropagation();
    event.preventDefault();
    $target = $(event.target);
    //��ʼ����ʱ�Ĵ������λ��
    me.startTouchPos = {
        X:event.targetTouches[0].clientX,
        Y:event.targetTouches[0].clientY
    };
    //��ǰ�������λ��
    me.touchPos = {
        X:event.targetTouches[0].clientX,
        Y:event.targetTouches[0].clientY
    };

    //��touchmove�¼�
    $target.unbind('touchmove').on('touchmove',function(event){
        me.touchMove(event,me)

    });
};
/**
 * �����ƶ����¼��������
 * @param event �¼�����
 * @param me Show����
 */
Show.prototype.touchMove = function(event,me){
    var $target;
    event.stopPropagation();
    event.preventDefault();
    $target = $(event.target);
    //��ǰ�������λ��
    me.touchPos = {
        X:event.targetTouches[0].clientX,
        Y:event.targetTouches[0].clientY
    };

    //��touchend�¼�
    $target.unbind('touchend').on('touchend',function(event){
        me.touchEnd(event,me)
    });
};
/**
 * �����������¼��������
 * @param event �¼�����
 * @param me Show����
 */
Show.prototype.touchEnd = function(event,me){
    event.stopPropagation();
    event.preventDefault();
    if(me.touchPos.X - me.startTouchPos.X > 10){
        //��һ��,����ajax����

    }else if(me.touchPos.X - me.startTouchPos.X < -10){
        //��һ�ţ�����ajax����
    }else{
        return false;
    }
};
module.exports = function(){
    return new Show();
};