/**
 * Created by Administrator on 2016/11/8.
 */
var $ = require('jquery');
//var ajax = require('./ajax.js');
//var ajaxObj = ajax();
var ajaxObj = require('./ajax.js')();
/**
 * 创建场景的类
 * @constructor
 */
function CreateScene(){
}
/**
 * 创建场景
 */
CreateScene.prototype.createScene = function(){

      ajaxObj.createScene();
};


module.exports = function(){
    return new CreateScene();
};