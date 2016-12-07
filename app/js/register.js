/**
 * Created by Administrator on 2016/12/7.
 */
/**
 * 注册类
 * @constructor
 */
var $ = require('jquery');

function Register(){
    this.ajaxObj = null;
    //电话号码是否可用,默认不可用
    this.telStatus = false;
}
/**
 * 发送验证码
 * @param register 登录模块 jquery对象
 * @param popUpObj
 */
Register.prototype.sendYZM = function(register,popUpObj){
    var $target,myreg,tel,timer;
    tel = register.find('#tel');
    $target = register.find('#getyzm');
    myreg = /(?:^1[3,8]\d{9}$)|(?:^15[^4]\d{8}$)|(?:^14[7,5,9]\d{8}$)|(?:^17[3,6,7,8]\d{8}$)/;
    if(tel.val().length <= 0){
        popUpObj.info('手机号码为空');
    }else if( !myreg.test( tel.val() ) ){
        popUpObj.info('手机号码格式不正确');
    }else if(!this.telStatus){
        popUpObj.info('该电话号码已注册');
    }else{
        $target.attr('disabled',true);
        $target.data({
            time:120
        });
        timer = setInterval(function(){
            count($target,timer);
        },1000);
        //将ajax对象赋给ajaxObj属性
        this.ajaxObj = popUpObj.ajaxObj;

        this.ajaxObj.sendYZM(tel.val());


    }
};
/**
 * 验证电话号码是否已经注册了
 * @param tel 要验证的电话号码
 * @param popUpObj popUp对象
 */
Register.prototype.checkTel = function(tel,popUpObj){
    this.ajaxObj = popUpObj.ajaxObj;
    this.ajaxObj.checkTel(tel,this);
};
/**
 * 确认注册
 * @param register 注册模块 jquery对象
 * @param popUpObj popUpd对象
 */
Register.prototype.submit = function(register,popUpObj){
    var pw,surePw,checkBox,email,data,tel,yzm,myreg;
    this.ajaxObj = popUpObj.ajaxObj;
    myreg = /(?:^1[3,8]\d{9}$)|(?:^15[^4]\d{8}$)|(?:^14[7,5,9]\d{8}$)|(?:^17[3,6,7,8]\d{8}$)/;
    tel = register.find('#tel').val().replace(/^\s*|\s*$/g,"");
    yzm = register.find('#yzm').val().replace(/^\s*|\s*$/g,"");
    pw = register.find('#password').val().replace(/^\s*|\s*$/g,"");
    surePw = register.find('#surePassword').val().replace(/^\s*|\s*$/g,"");
    email = register.find('#Email').val().replace(/^\s*|\s*$/g,"");
    checkBox = register.find('#checkBox').attr('checked');
    if(tel.length <= 0){
        popUpObj.info('电话号码为空');
    }else if(!myreg.test(tel)){
        popUpObj.info('电话号码格式不正确');
    }else if(yzm.length <= 0){
        popUpObj.info('验证码为空');
    }else if(pw.length < 6){
        popUpObj.info('密码长度小于6位字符');
    }else if(pw !== surePw){
        popUpObj.info('两次输入的密码不一致');
    }else if(email.length <= 0){
        popUpObj.info('未输入电子邮箱');
    }else if(!checkBox){
        popUpObj.info('未同意注册协议');
    }else{
        data = {
            username:tel,
            password:pw,
            yzm:yzm,
            email:email
        };
    this.ajaxObj.register(data);
    }
};
/**
 * 计时
 * @param $target 显示计时的元素 jquery对象
 * @param timer 定时器
 */
function count($target,timer){
    var time;
    time = $target.data('time') | 0;
    $target.html(time + '秒后可重发');
    if( time <= 0){
        clearInterval(timer);
        $target.attr('disabled',false).html('重发验证码');
        return false;
    }
    $target.data({
        time:time - 1
    });
}
module.exports = function(){
    return new Register();
};