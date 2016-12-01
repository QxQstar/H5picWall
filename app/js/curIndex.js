/**
 * Created by Administrator on 2016/11/8.
 * 入口js文件，这个文件用于整合其他的模块
 */
//移入需要的css模块
require('./../css/base.css');
require('./../css/loading.css');
require('./../css/layout.css');

//引入需要的js模块
var $ = require('jquery');
var animation = require('./animation.js');
var createSceneObj = require('./createScene.js')();
if(location.href.indexOf('#/') >= 0) {
    location.href = location.href.split('#/')[0];
}
//进度显示元素
var loading = $('#rate')[0];

//帧动画相关变量
var animationBg = $('#animation');

//需要预加载的图片列表
var imageList = [
    '/pw/upload/1.jpg',
   '/pw/upload/2.jpg',
    '/pw/upload/3.jpg',
    '/pw/upload/4.jpg',
    '/pw/upload/5.jpg',
    '/pw/upload/6.jpg',
    '/pw/upload/7.jpg',
    '/pw/upload/8.jpg',
    '/pw/upload/9.jpg',
    '/pw/upload/10.jpg',
    '/pw/upload/11.jpg',
    '/pw/upload/12.jpg',
    '/pw/upload/13.jpg',
    '/pw/upload/14.jpg',
    '/pw/upload/15.jpg',
    '/pw/upload/16.jpg',
    '/pw/upload/17.jpg',
    '/pw/upload/18.jpg',
    '/pw/upload/19.jpg',
    '/pw/upload/20.jpg',
    '/pw/upload/21.jpg',
    '/pw/upload/22.jpg',
    '/pw/upload/23.jpg',
    '/pw/upload/24.jpg',
    '/pw/upload/25.jpg',
    '/pw/upload/26.jpg',
    '/pw/upload/27.jpg',
    '/pw/upload/28.jpg',
    '/pw/upload/29.jpg',
    '/pw/upload/30.jpg',
    '/pw/upload/31.jpg',
    '/pw/upload/32.jpg',
    '/pw/upload/33.jpg',
    '/pw/upload/34.jpg',
    '/pw/upload/35.jpg',
    '/pw/upload/36.jpg',
    '/pw/upload/37.jpg',
    '/pw/upload/38.jpg',
    '/pw/upload/39.jpg',
    '/pw/upload/40.jpg',
    '/pw/upload/41.jpg',
    '/pw/upload/42.jpg',
    '/pw/upload/43.jpg',
    '/pw/upload/44.jpg',
    '/pw/upload/45.jpg',
    '/pw/upload/46.jpg',
    '/pw/upload/47.jpg',
    '/pw/upload/48.jpg',
    '/pw/upload/49.jpg',
    '/pw/upload/50.jpg',
    '/pw/upload/51.jpg',
    '/pw/upload/52.jpg',
    '/pw/upload/53.jpg',
    '/pw/upload/54.jpg',
    '/pw/upload/55.jpg',
    '/pw/upload/56.jpg',
    '/pw/upload/57.jpg',
    '/pw/upload/58.jpg',
    '/pw/upload/59.jpg',
    '/pw/upload/60.jpg',
    '/pw/upload/61.jpg',
    '/pw/upload/62.jpg',
    '/pw/upload/63.jpg',
    '/pw/upload/64.jpg',
    '/pw/upload/65.jpg',
    '/pw/upload/66.jpg',
    '/pw/upload/67.jpg',
    '/pw/upload/68.jpg',
    '/pw/upload/69.jpg',
    '/pw/upload/70.jpg',
    '/pw/upload/71.jpg',
    '/pw/upload/72.jpg',
    '/pw/upload/73.jpg',
    '/pw/upload/74.jpg',
    '/pw/upload/75.jpg',
    '/pw/upload/76.jpg',
    '/pw/upload/77.jpg',
    '/pw/upload/78.jpg'
];

//帧动画对象
var animationObj = animation()
                    .loadImage(imageList,loading,loadFinish)
                    .changeSrc(animationBg[0].getElementsByTagName('img')[0],imageList);

//开始动画,这是后续操作的入口
    animationObj.start(100);

/**
 * 图片加载结束后执行的回调函数
 */
function loadFinish(){
    //得到加载模块并移除
    var loading = $('#animateLoading');
    loading.remove();
}
//给window绑定事件
$(window).on('hashchange',function(){
    var hash = location.hash;
    var hashValue;
    if(hash.indexOf('$/') < 0) {
        hashValue = hash.split('#/')[1];
    }else{
        hashValue = hash.split('#/')[1].split('$/')[0];
    }
    if(!hashValue) return false;
    //获得与hash值对应的DOM节点
    var elem = $('#' + hashValue);
    //如果对应的dom节点节点不存在，则发送ajax请求去生成
    if(elem.length < 1){
        createSceneObj.createScene();
    }
});

