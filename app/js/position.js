/**
 * Created by Administrator on 2016/10/20.
 */

var $ = require('jquery');

var position = {
    //初始化位置
    init:function(parent,gap){
        var dragElem = parent.children();

        //确保父元素是相对定位
        if(parent.css('position') !== "relative"){
            parent.css('position','relative');
        }
        parent.css({
            'width':"100%",
            'z-index':'10'
        });
        //当前列表内容的宽度
        var ListWidth = 0;


        //位于第几行
        var i = 0;
        //位于第几列
        var j = 0;
        dragElem.each(function(index,elem){
            var curEle = $(elem);

            //设置元素的初始位置
            curEle.css({
                position:"absolute",
//                top:(i+1) * gap.Y + i*curEle.height(),
//                left:(j+1) * gap.X + j*curEle.width()
                top:gap.Y,
                left:ListWidth + gap.X
            });

                //为每个元素添加一个唯一的标识，在恢复初始位置时有用
            curEle.attr('index',index);

            //将元素的初始位置保存起来
            position.coord.push({
                X:ListWidth + gap.X,
                Y:gap.Y
            });

            //判断是否换行
//            if( parseInt(curEle.css('left')) + curEle.width() + curEle.next().width() + gap.X >= parentW - gap.Y){
//                i++;
//                j=0;
//            }else{
//                j++;
//            }
            j++;

            //设置父元素的高度
            parent.height( parseInt(curEle.css('top')) + curEle.height() + gap.Y);

            ListWidth = curEle.offset().left + curEle.width();
        });
    },
    //将子元素插入到父元素中
    addTo:function(child,parent,target){
        //父元素在视口的坐标
        var parentPos = {
            X:parent.offset().left,
            Y:parent.offset().top
        };

        //目标位置相对于视口的坐标
        var targetPos = {
            X:target.offset().left,
            Y:target.offset().top
        };

        //确保父元素是相对定位
        if(parent.css('position') !== "relative"){
            parent.css({
                'position':'relative'
            });
        }

        parent.css({
            'z-index':'12'
        });
        //将子元素插入父元素中
        parent.append(child);

        //修改子元素在父元素中的位置并且保证子元素的大小不变
        child.css({
            top:targetPos.Y - parentPos.Y,
            left:targetPos.X - parentPos.X,
            width:target.width(),
            height:target.height()
        });

    },
    //将元素恢复到原来的位置
    restore:function(elem){
        //获得元素的标识
        var index = parseInt( elem.attr('index') );
        elem.css({
            top:position.coord[index].Y,
            left:position.coord[index].X
        });

    },
    //拖拽元素的初始坐标
    coord:[],
    //判断元素A是否在元素B的范围内
    isRang:function(control,dragListPar,$target){
        var isSituate = undefined;
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
    //碰撞
    reSort:function(list,curElem){
        var gap = 30;
        //检测相交
        var compare = function(curElem,comPE){

            //元素的位置
            var curElemPos = curElem.offset();
            var comPEPos = comPE.offset();

            //curElem的投影
            var curElemShadow_x = [curElemPos.left,curElemPos.left + curElem.width()];
            var curElemShadow_y = [curElemPos.top,curElemPos.top + curElem.height()];

            //comPE的投影
            var comPEShadow_x = [comPEPos.left - gap,comPEPos.left + comPE.width() + gap];
            var comPEShadow_y = [comPEPos.top - gap,comPEPos.top + comPE.height() + gap];

            //检测是否X轴上相交
            var intersect_x = (curElemShadow_x[0] > comPEShadow_x[0] && curElemShadow_x[0] < comPEShadow_x[1])
                              || (curElemShadow_x[1] > comPEShadow_x[0] && curElemShadow_x[1] < comPEShadow_x[1]);
            //检测是否Y轴上相交
            var intersect_y = (curElemShadow_y[0] > comPEShadow_y[0] && curElemShadow_y[0] < comPEShadow_y[1])
                || (curElemShadow_y[1] > comPEShadow_y[0] && curElemShadow_y[1] < comPEShadow_y[1]);

            return intersect_x && intersect_y;

        };

        //错开重排
        var reset = function(curElem,compare){
            //元素的位置
            var curElemPos = curElem.offset();
            //参考元素的位置
            var comPEPos = compare.offset();

            var maxW = Math.max(curElem.width(),compare.width());
            var maxH = Math.max(curElem.height,compare.height());

            //两个元素上边，左边，的间距，这些值决定了该往哪个方向偏移
            var offsetTop = Math.abs(curElemPos.top - comPEPos.top);
            var offsetLeft = Math.abs(curElemPos.left - comPEPos.left);
            //需要移动的元素位于参考元素的下方
            if(curElemPos.top > comPEPos.top){
                console.log('下方');
                //需要移动的元素位于参考元素的右方
                  if(curElemPos.left > comPEPos.left){
                      console.log('右边');
                      if(offsetLeft > offsetTop){
                          //向右移动
                          curElem.css({
                              'left':comPEPos.left + compare.width() + gap
                          });
                      }else{
                            //向下移动
                          curElem.css({
                                'top':comPEPos.top + compare.height + gap
                          });
                      }
                  }else{
                      console.log('左边');
                      if(offsetLeft > offsetTop){
//                          //向左移动
                          curElem.css({
                              'left':comPEPos.left - curElem.width() - gap
                          });
                      }else{
//                          //向下移动
                          curElem.css({
                              'top':comPEPos.top + compare.height() + gap
                          });
                      }


                  }
            }else{
                console.log('上方');
                //需要移动的元素位于参考元素的右方
                if(curElemPos.left > comPEPos.left){
                    console.log('右边');
                    if(offsetLeft > offsetTop){
                        //向右移动
                        curElem.css({
                            'left':comPEPos.left + compare.width() + gap
                        });
                    }else{
                        //向上移动
                        curElem.css({
                            'top':comPEPos.top - curElem.height() - gap
                        });
                    }
                }else{
                    console.log('左边');
                    if(offsetLeft > offsetTop){
//                        //向左移动
                        curElem.css({
                            'left':comPEPos.left - curElem.width() - gap
                        });
                    }else{
                        //向上移动
                        curElem.css({
                            'top':comPEPos.top - curElem.height() - gap
                        });
                    }


                }
            }
        };
        //将要作为参考的元素
        var referElem = [];
        $.each(list,function(index,elem){
            //不能和自己进行比较
            if(curElem.attr('id') !== $(elem).attr('id')){
                if(compare(curElem,$(elem))){
                    referElem.push(elem);
                }
            }
        });
        $.each(referElem,function(index,elem){
            reset(curElem,$(elem));
        });
        if(referElem.length > 0) {
            //重新检测
            this.reSort(referElem, curElem);
        }
    }

};
module.exports = position;