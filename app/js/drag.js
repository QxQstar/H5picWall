/**
 * Created by Administrator on 2016/10/20.
 */

var $ = require('jquery');
var untilEvent = require('./untilEvent.js');
var drag = {
    //�ƶ�������ӿڵ�λ��
    position:{
        X:undefined,
        Y:undefined
    },
    //����������ӿڵ�λ��
    touchPos:{
        X:undefined,
        Y:undefined
    },
    //������������ƶ����λ��
    touchOffsetPos:{
        X:undefined,
        Y:undefined
    },
    touchStart:function(event){
        var e = untilEvent.getEvent(event);
        var target = untilEvent.getTarget(e);

        //��ֹð��
        untilEvent.stopPropagation(e);

        var $target = $(target);

        drag.position.X = $target.offset().left;
        drag.position.Y = $target.offset().top;

        drag.touchPos.X = e.targetTouches[0].clientX;
        drag.touchPos.Y = e.targetTouches[0].clientY;

        drag.touchOffsetPos.X = drag.touchPos.X - drag.position.X;
        drag.touchOffsetPos.Y = drag.touchPos.Y - drag.position.Y;

        //��Ŀ��Ԫ�ذ�touchMove�¼�
        untilEvent.addEvent(target,'touchmove',drag.touchMove);
    },
    touchMove:function(event){
        var e = untilEvent.getEvent(event);
        var target = untilEvent.getTarget(e);

        //��ֹð��
        untilEvent.stopPropagation(e);

       var $target = $(target);

        //���Ŀ��Ԫ���ϵ���ָ����һ������ֹĬ����Ϊ
        if(e.targetTouches.length > 1){

            untilEvent.preventDefault(e);

        }else{

            //��ô������λ��
            drag.touchPos.X = e.targetTouches[0].clientX;
            drag.touchPos.Y = e.targetTouches[0].clientY;

            //�޸��ƶ����λ��
            $(target).offset({
                top:drag.touchPos.Y - drag.touchOffsetPos.Y,
                left:drag.touchPos.X - drag.touchOffsetPos.X
            });

        }

    },
    touchEnd:function(event){

    }
};
module.exports = drag;
