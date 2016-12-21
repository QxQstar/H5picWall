/**
 * Created by Administrator on 2016/10/20.
 */

var $ = require('jquery');

var position = {

    //将子元素插入到父元素中
    addTo:function(child,parent,target){
        var parentPos,targetPos;
        //父元素在视口的坐标
        parentPos = {
            X:parent.offset().left,
            Y:parent.offset().top
        };

        //目标位置相对于视口的坐标
        targetPos = {
            X:target.offset().left,
            Y:target.offset().top
        };
        //将子元素插入父元素中
        parent.append(child);

        //修改子元素在父元素中的位置
        child.css({
            top:targetPos.Y - parentPos.Y + 'px',
            left:targetPos.X - parentPos.X + 'px'
        });

    },
    //将移动元素恢复到原来的状态
    restore:function(picGroup){
        //将移动的元素恢复到原来的状态
        picGroup.css({
                top:'auto',
                left:'auto'
            });
        //恢复画框和画心的属性
        var frame = picGroup.children().first('img');
        frame.unbind('load').on('load',function(event){

            event.stopPropagation();

            frame
                .height('auto')
                .width('auto')
                .css({'max-width':'100%'})
        });
        frame
            .attr('src',picGroup.data('thumbnail'))
            .next('img')
            .css({
                opacity:0
            });
    },
    //判断元素A是否在元素B的范围内
    isRang:function(control,dragListPar,$target){
        var isSituate;
        if(control.offset().top > dragListPar.offset().top){
            isSituate = $target.offset().top > control.offset().top
                        && $target.offset().left > control.offset().left
                        && ($target.offset().left + $target.width()) < (control.offset().left + control.width());
        }else{
            isSituate = ($target.offset().top + $target.height())<(control.offset().top + control.height())
                        && $target.offset().top > control.offset().top
                        && $target.offset().left > control.offset().left
                        &&  ($target.offset().left + $target.width()) < (control.offset().left + control.width());
        }
        return isSituate;
    },
    /**
     * 相交检测
     * @param parent curElem的父元素 jquery节点
     * @param curElem 正在移动的元素 jquery节点
     * @returns {boolean} 是否相交
     */
    compare:function(parent,curElem){
        var list,gap,isCover,control,info;
        list = parent.children();
        gap = 10;

        //默认不覆盖
        isCover = false;
        Booleans = false;
        control = $(list[0]).parent();
        info =  control.find('#notice');
        $.each(list,function(index,elem){
            var comPE,curElemPos,comPEPos,curElemShadow_x,curElemShadow_y,
                comPEShadow_x,comPEShadow_y,intersect_x,intersect_y;
            comPE = $(elem);

            //不能和自己，canvas，提示信息进行比较
            if(comPE.attr('id') !== curElem.attr('id') &&
                comPE.attr('class') !=='canvas' &&
                comPE.attr('id') !== 'notice') {
                //元素的位置
                curElemPos = curElem.offset();
                comPEPos = comPE.offset();

                //curElem的投影
                curElemShadow_x = [curElemPos.left, curElemPos.left + curElem.width()];
                curElemShadow_y = [curElemPos.top, curElemPos.top + curElem.height()];

                //comPE的投影
                comPEShadow_x = [comPEPos.left - gap, comPEPos.left + comPE.width() + gap];
                comPEShadow_y = [comPEPos.top - gap, comPEPos.top + comPE.height() + gap];

                //检测是否X轴上相交
                intersect_x = (curElemShadow_x[0] > comPEShadow_x[0] && curElemShadow_x[0] < comPEShadow_x[1])
                    || (curElemShadow_x[1] > comPEShadow_x[0] && curElemShadow_x[1] < comPEShadow_x[1])
                    ||(curElemShadow_x[0] < comPEShadow_x[0] && curElemShadow_x[1] > comPEShadow_x[1]);

                //检测是否Y轴上相交
                intersect_y = (curElemShadow_y[0] > comPEShadow_y[0] && curElemShadow_y[0] < comPEShadow_y[1])
                    || (curElemShadow_y[1] > comPEShadow_y[0] && curElemShadow_y[1] < comPEShadow_y[1])
                    ||(curElemShadow_y[0] < comPEShadow_y[0] && curElemShadow_y[1] > comPEShadow_y[1]);

                Booleans = intersect_x && intersect_y;


                isCover = isCover || Booleans;
                if (isCover) {

                    info.height(comPE.height() + 2*gap)
                        .width(comPE.width() + 2*gap)
                        .css({
                            'top':comPEPos.top - parent.offset().top- gap,
                            'left':comPEPos.left - parent.offset().left - gap,
                            'display':'block'
                        });
                    return false;

                }else{
                    info.css({
                        'display':'none'
                    });
                }

            }

        });
       return isCover

    }

};
module.exports = position;