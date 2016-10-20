/**
 * Created by Administrator on 2016/10/20.
 */
require('../css/base.css');
require('../css/drag.css');
var $ = require('jquery');
var untilEvent = require('./untilEvent.js');
var drag = require('./drag.js');

var dragElem = $('.drag');
untilEvent.addEvent(dragElem[0],'touchstart',drag.touchStart);