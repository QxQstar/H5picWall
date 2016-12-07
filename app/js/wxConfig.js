/**
 * Created by Administrator on 2016/12/7.
 */
var wx = require('weixin-js-sdk');
function wxConfig(){
    //发送配置微信sdk的ajax请求
    (function(){
        var xmlhttp;
        //得到XHR对象
        function createXmlHttp(){
            if(window.XMLHttpRequest){
                return new XMLHttpRequest();
            }else if(window.ActiveXObject){
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
        }


        xmlhttp = createXmlHttp();
        var result;

        if(!xmlhttp){
            console.log('no support ajax');
        }else{
            xmlhttp.open("POST", "http://www.xiaoyu4.com/pw/index.php/admin/wechat/index", true);
            xmlhttp.onreadystatechange = function(){
                if(xmlhttp.readyState === 4){
                    if( xmlhttp.status === 200){
                        //解析成一个对象
                        result = JSON.parse( xmlhttp.responseText );
                        console.log(result);
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: result.appId, // 必填，公众号的唯一标识
                            timestamp: result.timestamp, // 必填，生成签名的时间戳
                            nonceStr: result.nonceStr, // 必填，生成签名的随机串
                            signature: result.signature,// 必填，签名，见附录1
                            jsApiList: [
                                'checkJsApi',
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'onMenuShareQQ',
                                'onMenuShareQZone'
                            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });



                    }
                }
            };
            var data = 'url=' + encodeURIComponent(location.href.split("#")[0]);
            xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

            xmlhttp.send(data);

        }
    })();

    wx.ready(function(){
        wx.onMenuShareTimeline({
            title: '魅拓照片墙', // 分享标题
            link: 'http://www.xiaoyu4.com/pw/html/index.html', // 分享链接
            imgUrl: '', // 分享图标
            success: function () {
            },
            cancel: function () {
            },
            fail:function(){
            }
        });
        wx.onMenuShareAppMessage({
            title: '魅拓照片墙', // 分享标题
            desc: '有意思', // 分享描述
            link: 'http://www.xiaoyu4.com/pw/html/index.html', // 分享链接
            imgUrl: '', // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareQQ({
            title: '魅拓照片墙', // 分享标题
            desc: '有意思', // 分享描述
            link: 'http://www.xiaoyu4.com/pw/html/index.html', // 分享链接
            imgUrl: '', // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        wx.onMenuShareQZone({
            title: '魅拓照片墙', // 分享标题
            desc: '有意思', // 分享描述
            link: 'http://www.xiaoyu4.com/pw/html/index.html', // 分享链接
            imgUrl: '', // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }

        });
    });
}
module.exports = wxConfig;