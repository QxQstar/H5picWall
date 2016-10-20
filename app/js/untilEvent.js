/**
 * Created by Administrator on 2016/10/20.
 */
var untilEvent = {
    addEvent:function(elem,type,handler){
        if(elem.addEventListener){
            elem.addEventListener(type,handler,false);
        }else if(elem.attachEvent){
            elem.attachEvent("on" + type,handler);
        }else{
            elem['on' + type] = handler;
        }
    },
    removeEvent:function(elem,type,handler){
        if(elem.removeEventListener){
            elem.removeEventListener(type,handler,false);
        }else if(elem.detachEvent){
            elem.detachEvent('on' + type,handler);
        }else{
            elem['on' + type] = null;
        }
    },
    getTarget:function(event){
        return event.target || event.srcElement;
    },
    getEvent:function(event){
        return event ? event : window.event;
    },
    preventDefault:function(event){
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue = false;
        }
    },
    stopPropagation:function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    }
};
module.exports = untilEvent;