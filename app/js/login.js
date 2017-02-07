/**
 * Created by Administrator on 2017/2/7.
 */
/**
 * 登录类
 * @constructor
 */
var $ = require('jquery');
function Login(){

}
/**
 * 登录
 * @param elem 登录弹窗 jquery节点
 * @param popUpObj 弹窗对象 Object
 */
Login.prototype.login = function(elem,popUpObj){
    var username,password;
    username = elem.find('#message').val().replace(/^\s*|\s*$/g,"");
    password = elem.find('#password').val().replace(/^\s*|\s*$/g,"");
    if(username.length < 1){
        popUpObj.info('输入登录账号');
    }else if(password.length < 1){
        popUpObj.info('输入登录密码');
    }else{
        popUpObj.ajaxObj.login({
            username:username,
            password:password
        });
    }
};
module.exports = function(){
    return new Login();
};
