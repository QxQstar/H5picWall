var $ = require('jquery');
var registerObj = require('./register.js')();
var loginObj = require('./login.js')();
var share = require('./nativeShare.js');
/**
 * 弹窗类
 * @constructor
 */
function PopUp(){
    //重拼的次数
    this.resetNum = 0
}
/**
 * 提示没有拖入相框
 * @param message 提示系统
 */
PopUp.prototype.info = function(message){
    var info,mask,login,register,bottom,showContent ;
    bottom = $('#show').find('.bottom');
    showContent = $('#showContent');
    mask = $('<div class="f-mask" id="popUpMask"></div>')
                .css({
                        zIndex:800,
                        opacity:0.9
                });

    info = $('<div id="popUpInfo" class="m-popUpInfo">'+message+'</div>')
        .animate({
            opacity:1,
            top:'100px'
        },400);
    mask
        .append(info);
    $('body')
        .children('#container')
        .append(mask);
    //提示信息显示一秒后消失
    setTimeout(function(){
            info.animate({
                opacity:0
            },400);
            mask.animate({
                opacity:0
            },function(){
                $(this).remove();
            });
    },1000);

    login = $('#login');
    register = $('#register');
    if(login.length > 0 && isLogin()){
        setTimeout(function(){
            login
                .find('button')
                .unbind('click');
            login.remove();
            bottom.show();
            showContent.show();
        },2000);
    }else if(register.length > 0 && isLogin()){
        setTimeout(function(){
            register
                .find('button')
                .unbind('click');

            register.remove();
            bottom.show();
            showContent.show();
        },2000);
    }


};
/**
 * 正在加载
 */
PopUp.prototype.loading = function(){
    var load,str,arr, i,len,mask;
    arr = ['L','o','a','d','i','n','g'];
    mask = $('<div class="f-mask" id="popMask"></div>').css({
        zIndex:800,
        backgroundColor:'transparent'
    });
    load = $('<div class="m-load" id="popUpLoad"></div>');
    mask.append(load);
    str = '';
    len = arr.length;
    for(i = 0;i<len;i++){
        str += "<div class='u-text u-text-"+ (i+1) +"'>"+ arr[i] +"</div>";
    }
    load.html(str);
    $('#container')
        .append(mask);
};
/**
 * 点击重新拼，弹出的弹窗
 * @param ancestor 弹窗的祖先元素 jquery对象
 */
PopUp.prototype.resetInfo = function(ancestor){
    var bottom,me,cancel;
    me = this;
    //将底部隐藏
    bottom = ancestor.find('.bottom');
    bottom.hide();
    if(me.resetNum <= 2){
        me.createReset(ancestor);
    }else{
        //提示分享
        var nativeShare,config;
        nativeShare = $('<div id="nativeShare" class="m-nativeShare"></div>');
        ancestor.append(nativeShare);
        config = {
            url:'http://www.xiaoyu4.com/pw/html/index.html',
            title:'魅拓照片墙',
            desc:'有意思',
            img:'http://www.wangjunfeng.com/img/face.jpg',
            img_title:'照片墙',
            from:'魅拓照片墙'
        };
        share('nativeShare',config);
        //不分享
        cancel = nativeShare.find('#cancel');
        if(cancel.length >= 1){
            cancel
                .unbind('click')
                .on('click',function(event){
                    event.preventDefault();
                    event.stopPropagation();
                    cancel.unbind('click');
                    nativeShare.remove();
                    me.createReset(ancestor);
                });
        }else{
            nativeShare.on('click',function(){
                event.preventDefault();
                event.stopPropagation();
                nativeShare.unbind('click');
                nativeShare.remove();
                me.createReset(ancestor);
            });
        }

    }

};
/**
 * 重新拼的警告弹窗
 * @param ancestor
 */
PopUp.prototype.createReset = function(ancestor){
    var mask,content,backBtn,cancelBtn,bottom,me;
    me = this;
    bottom = ancestor.find('.bottom');
    //生成元素
    mask = $('<div class="f-mask "></div>');
    content = "<div class='resetInfo' id='resetInfo'>" +
        "<p class='desc'>信息将会遗失，是否确定重新拼？</p>"+
        "<div class='handle'>" +
        "<button type='button' class='backBtn' id='backBtn'>确定</button>"+
        "<button type='button' class='cancel' id='cancelBtn'>取消</button>"+
        "</div>"+
        "</div>";
    mask.html(content);
    ancestor.append(mask);
    backBtn = $('#resetInfo')
        .find('#backBtn')
        .on('click',function(event){
            event.preventDefault();
            event.stopPropagation();
            me.resetNum ++;
            history.back();


        });
    cancelBtn = $('#resetInfo')
        .find('#cancelBtn')
        .on('click',function(event){
            event.preventDefault();
            event.stopPropagation();
            mask.animate({
                opacity:0
            },200,function(){
                mask.remove();
                bottom.show();
            });
        });
};
/**
 * 登录弹窗
 * @param ancestor 祖先元素 jquery对象
 */
PopUp.prototype.login = function(ancestor){
    var login,content,bottom,showContent,submit,me,register,cancel;
    me = this;
    bottom = ancestor.find('.bottom');
    showContent = ancestor.find('#showContent');
    bottom.hide();
    showContent.hide();
    login = $('<div class="m-login" id="login"></div>');
    content = '<form class="loginForm" id="loginForm">'+
                    '<button type="button" class="cancel" id="cancel"></button>'+
                    '<div class="head">登录魅拓进行购买</div>'+
                     '<div class="tel">'+
                            '<input type="text" placeholder="手机号/邮箱" id="message">'+
                     '</div>'+
                      '<div class="possword">'+
                            '<input type="password" placeholder="密码" id="password">'+
                      '</div>'+
                      '<div class="register">'+
                            '<button type="button" id="register" >立即注册</button>'+
                      '</div>'+
                      '<div class="submit">'+
                            '<button type="button" id="submit">登录</button>'+
                      '</div>'+
                '</form>';
    login.html(content);
    ancestor.append(login);
    submit = login
            .find('#submit')
            .on('click',function(event){
                event.stopPropagation();
                event.preventDefault();
                loginObj.login(login,me);
            });
    //注册
    register = login
                .find('#register')
                .on('click',function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    submit.unbind('click');
                    //移除登录弹窗，生成注册弹窗
                    login.remove();
                    me.register(ancestor);
                });
    //取消登录
    cancel = login.find('#cancel');
    cancel
        .unbind('click')
        .on('click',function(event){
            event.stopPropagation();
            submit.unbind('click');
            cancel.unbind('click');
            login.remove();
            showContent.show();
            bottom.show();
        });

};
/**
 * 注册弹窗
 * @param ancestor 祖先元素 jquery对象
 */
PopUp.prototype.register = function(ancestor){
    var register,content,getYzm,me,tel,timer,submit,cancel;
    me = this;
    register = $('<div class="m-register" id="register"></div>');
    content = '<form class="registerForm" id="registerForm">'+
                    '<button type="button" class="cancel" id="cancel"></button>'+
                    '<div class="head">用户注册</div>'+
                    '<table class="table">'+
                        '<tr class="row">'+
                            '<td class="col col-1">'+
                                '<label for="tel">手机号码:</label>'+
                            '</td>'+
                            '<td class="col col-2">'+
                                '<input type="text" id="tel">'+
                                '<p class="info">(输入11位正确的手机号)</p>'+
                            '</td>'+
                        '</tr>'+
                        '<tr class="row">'+
                            '<td class="col col-1">'+
                                '<label for="getyzm">验证码:</label>'+
                            '</td>'+
                            '<td class="col col-2">'+
                                '<input type="text" id="yzm" class="yzm">'+
                                '<button type="button" class="getYzm" id="getyzm">获取验证码</button>'+
                            '</td>'+
                        '</tr>'+
                        '<tr class="row">'+
                            '<td class="col col-1">'+
                                '<label for="password">密码:</label>'+
                            '</td>'+
                            '<td class="col col-2">'+
                                '<input type="password" id="password">'+
                                '<p class="info">(为了您的账户安全，并且密码长度大于6位)</p>'+
                            '</td>'+
                        '</tr>'+
                        '<tr class="row">'+
                            '<td class="col col-1">'+
                                '<label for="surePassword">确认密码:</label>'+
                            '</td>'+
                            '<td class="col col-2">'+
                                '<input type="password" id="surePassword">'+
                                '<p class="info">(确保密码输入正确)</p>'+
                            '</td>'+
                        '</tr>'+
                        '<tr class="row">'+
                            '<td class="col col-1">'+
                                '<label for="Email">E-mail:</label>'+
                            '</td>'+
                            '<td class="col col-2">'+
                                '<input type="text" id="Email">'+
                                '<p class="info">(电子邮箱可用于找回密码)</p>'+
                            '</td>'+
                        '</tr>'+
                        '<tr class="row">'+
                            '<td class="col col-1"></td>'+
                            '<td class="col col-2">'+
                                '<input type="checkbox" id="checkBox" checked>'+
                                '<label for="checkBox">我已经认真阅读并同意《<button type="button">注册协议</button>》</label>'+
                            '</td>'+
                        '</tr>'+
                        '<tr class="row">'+
                            '<td class="col col-1"></td>'+
                            '<td class="col col-2">'+
                                '<button type="button" id="submit" class="submit">确认注册</button>'+
                            '</td>'+
                        '</tr>'+
                    '</table>'+
                '</form>';

    register.html(content);
    ancestor.append(register);
    getYzm = register.find('#getyzm');
    tel = register.find('#tel');
    submit = register.find('#submit');
    cancel = register.find('#cancel');
    //为发送验证码绑定事件
    getYzm
        .unbind('click')
        .on('click',function(event){
            event.preventDefault();
            event.stopPropagation();
            registerObj.sendYZM(register,me);
        });
    //输入号码绑定事件
    tel
        .unbind('keyup')
        .on('keyup',function(){
            clearTimeout(timer);
            timer = setTimeout(function(){
                registerObj.checkTel(tel.val(),me);
            },1000);
        });

    submit
        .unbind('click')
        .on('click',function(event){
            event.stopPropagation();
            event.preventDefault();
            registerObj.submit(register,me);
        });
    //取消注册
    cancel
        .unbind('click')
        .on('click',function(){
            event.stopPropagation();
            event.preventDefault();
            submit.unbind('click');
            tel.unbind('keyup');
            cancel.unbind('click');
            getYzm.unbind('click');
            register.remove();
            ancestor.find('.bottom').show();
            ancestor.find('#showContent').show();

        })


};
/**
 * 检查是否登录
 * @returns {boolean}
 */
function isLogin(){
    var cookie = document.cookie;
    if(cookie.indexOf('www_xiaoyu4_comuser_name=') >= 0){
        return true;
    }else{
        return false
    }

}
module.exports = function(){
    return new PopUp()
};