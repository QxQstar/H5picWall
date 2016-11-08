/**
 * Created by Administrator on 2016/11/4.
 */
'use strict';

/**
 * Ԥ����ͼƬ�ĺ���
 * @param images ����ͼƬ��������߶���
 * @param callback ȫ��ͼƬ������Ϻ���õĻص�����
 * @param timeout ���س�ʱ��ʱ��
 */
function loadImage(images,callback,timeout){
    //�������ͼƬ�ļ�����
    var count = 0;
    //ȫ��ͼƬ���سɹ���һ����־λ
    var success = true;
    //��ʱtimer��id
    var timerId = 0;
    //�Ƿ���س�ʱ�ı�־λ
    var isTimeout = false;
    //�Ѿ�������ɵĳ���
    var loaded = 0;

    //��ͼƬ���飨����󣩽��б���
    for(var key in images){
        //���˵�prototype�ϵ�����
        if(!images.hasOwnProperty(key)){
            continue;
        }
        //���ÿ��ͼƬԪ��
        //����item��һ��object��{src:XXX}
        var item = images[key];
        if(typeof item === "string"){
            item = images[key] = {
                src:item
            }
        }
        //�����ʽ�������������������һ�α���
        if(!item || !item.src){
            continue;
        }
       //����+1
         ++ count;
        //����ͼƬԪ�ص�id
        item.id = '__img__' + key + getId();
        //����ͼƬԪ�ص�image������һ��image����
        item.image = window[item.id] = new Image();

        doLoad(item);
    }
    //�������Ϊ0����ֱ�ӵ���callback
    if(!count){
       callback(success);
    }else if(timeout){
        timerId = setTimeout(onTimeout,timeout)
    }
    /**
     * ��������ͼƬԤ���صĺ���
     * @param item ͼƬԪ�صĶ���
     */
    function doLoad(item){
        item.state = 'loading';

        var img = item.image;
        //ͼƬ���سɹ���һ���ص�����
        img.onload = function(){
            //ֻҪ��һ�ų��ּ���ʧ�ܣ�success�ͻ�Ϊfalse
            success = success & true;
            item.state = 'load';
            loaded ++;
            done();

        };
        //ͼƬ����ʧ�ܵĻص�����
        img.onerror = function(){
            success = false;
            item.state = 'error';
            loaded ++;
            done();
        };
        //����ͼƬ
        img.src = item.src;
        /**
         * ÿ��ͼƬ������ɵĻص����������۳ɹ�����ʧ��
         */
        function done(){
            img.onload = null;
            img.onerror = null;
            try{
               delete window[item.id]
            }catch (e){

            }
            //ÿ��ͼƬ������ɣ���������һ��������ͼƬ�������û�г�ʱ������������ʱ������ִ�лص�����
            if(count === loaded && !isTimeout){
                clearTimeout(timerId);
                callback(success);
            }
        }
    }

    /**
     * ��ʱ����
     */
    function onTimeout(){
        isTimeout = true;
        callback(false);
    }

}

var __id = 0;
function getId(){
   return ++ __id;
}
module.exports = loadImage;