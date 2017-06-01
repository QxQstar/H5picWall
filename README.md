# 1. 目录结构
## 1.1. app文件夹
app文件夹下代码是实际编辑代码
### 1.1.1. js文件夹
- index.js：入口文件
- ajax.js：执行ajax请求
- animation.js：帧动画
- imageloader.js：图片预加载
- timeline.js：异步操作。注：帧动画却换图片是异步操作
- canvas.js：生成canvas
- drag.js：拖拽相框
- nativeShare.js：提示分享
- popUp.js：生成弹窗
- position.js：拖拽相框页面中改变位置和判断位置
- register.js：注册
- login.js：登录
- scale.js：缩放尺寸
- show.js：显示所拼照片墙
- transition.js：切换画心
- wxConfig.js配置分享到微信的参数
### 1.1.2. css文件夹
- loading.css：加载动画
- login.css：登录
- register.css：注册
- base.css：基础样式
- nativeShare.css：提示分享
- loyout.css：布局
### 1.1.3. index.html
- index.html：浏览器加载的html文件

## 1.2. build文件夹
build文件夹中的文件是使用webpack打包生成的文件，项目运行的就是这个文件夹中的文件
# 2. 打包
整个项目使用webpack打包，实际运行的代码位于build文件夹中，app文件夹是编辑的代码，修改app文件夹中的代码后都要使用webpack重新打包，如果修改了app中css文件要将bulid中新的css文件重新上传到服务器，如果修改了app中的js文件要将bulid中新的js文件重新上传到服务器，如果改变了app中的index.html文件要将build中的index.html文件重新上传到服务器。
# 3. app/js中js模块功能介绍
## 3.1. index.js
index.js是项目的入口，在这个文件的头部引入了整个项目需要的全部css文件。这个项目要创建新的场景都是改变hash值去实现的，所有在这个文件中给window绑定了hashchange事件。用户访问的url地址可能不相同，只有当访问地址是[http://www.xiaoyu4.com/pw/html/index.html](http://www.xiaoyu4.com/pw/html/index.html) 时才会播放帧动画，播放帧动画结束后要改变hash值以至于用户能进一步操作，帧动画播放结束后运行的函数是animation.js中的dispose
## 3.2. imageloader.js
执行帧动画所需要图片是通过imageloader.js模块提前加载的，所有imageloader.js模块执行的功能就是图片预加载，在图片预加载过程中页面会执行css动画，当所有需要预加载的图片加载完成后css动画被移除，并开始播放帧动画
## 3.3. timeline.js
帧动画切换图片是异步操作，异步操作是在timeline.js中进行控制的，切换图片的图片的时间间隔可以通过传递参数的形式进行设置，如果没有传递参数则采用默认值
## 3.4. animation.js
帧动画模块，在这个模块中要依赖imageloader.js模块和timeline.js模块，这个模块中的函数是在index.js中调用
##3.5. ajax.js
执行ajax请求的模块。在这个模块中的功能有：创建新场景，相框列表翻页，请求可以切换的画心，保存所拼照片墙，登录，注册，发送验证码，判断电话号码是否已经注册，添加到购物车
## 3.6. canvas.js
用于生成canvas的模块，在这个项目中所有的canvas都在drag页面，drag页面中有三种canvas，分别是参考线，控制台标识，照片墙尺寸标识。控制台标识，照片墙尺寸标识都是在drag模块中的init函数里创建的。参考线在拖动的时候创建
## 3.7. drag.js
Drag页面功能的模块，这个模块的init完成的功能是界面的初始化及事件的绑定，touchStart是触摸开始的事件处理程序，在这个函数中要判断触摸元素的父元素（calss为picGroup）是否是拖拽列表的后代，touchMove的主要功能是移动相框，touchEnd是触摸结束要执行的函数，在这个函数中要判断是点击相框，移动相框还是切换画心。如果是点击相框，则相框放大。如果是切换画心则切换相框中高的画心。如果是移动相框，怎样判断被移动的相框是否是拖拽列表的后代。
## 3.8. sacle.js
在这个模块中主要有两个功能，分别是对控制台进行缩放和放大相框。放大相框后要生成可切换的画心列表，通过点击确定按钮确定新的画心，由于画心的价格可能不一样，所有点击确定按钮要执行的重要操作是修改显示的价格
## 3.9. transition.js
在这个模块中主要有两个功能，分别是生成可切换的画心列表和切换画心。
## 3.10. position.js
这个模块中有四个功能，分别是检测相交，判断元素A是否在元素B的范围内，将拖拽列表中的相框插入控制台，将拖拽列表中的相框恢复到初始位置
## 3.11. show.js
在这个模块中能进行的功能有加入购物车和重新拼
## 3.12. register.js
注册模块
## 3.13. login.js
登录模块，当在show页面点击加入购物车，如果用户还没有登录，会弹出登录弹窗让用户登录
## 3.14. popUp.js
所有的弹窗都是在这个模块中生成的
## 3.15. nativeShare.js
提示用户分享的模块，在这个模块中主要是判断是什么浏览器
## 3.16. wxConfig.js
配置分享到微信
# 4. 项目思路
每一个能够创建新的场景的a标签都有一个data-id属性，这个data-id的值与即将展示的新场景的页面hash值一一对应，当点击这些a标签后url中的hash值变成该a标签的data-id属性值，当hash值发生改变会触发window的hashchange事件，在hashchange的事件处理程序中检查当前页面中是否有一个dom节点的id属性值与hash值相同，如果没有就发送ajax请求重新渲染页面，如果有就不做任何操作

