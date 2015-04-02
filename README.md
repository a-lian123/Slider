##Slider for Zepto
--------------------------------------------

###简介

 Slider1.0.1是一个我闲暇时间写的Zepto插件，用于在移动端实现像微博、微信朋友圈展示多张图片的那种效果。可以滑动，缩放。基于JavaScript touch事件，zetop doubleTouch事件，和CSS3。

 ----------------------------------------------
###例子

![例子](http://test.wzlian.me/slider/images/demo.png)
点击链接[enter link description here](http://test.wzlian.me/slider/demo/index.html)

-------------------------------------------
###调用方法
引入Zepto.js

```
$.slider({
	imgAry: ['pic1.jpg', 'pic2.jpg', 'pic3.jpg', 'pic4.jpg'],//图片数组
	isLoop:	false,                                   //是否能循环滑动，默认为false
	hasDot: true,                                    //是否有下面的点点，默认为true
	indexNow: 0                                      //当前的图片顺序,默认为0，从0开始
});
```

-------------------------------------------
###依赖

Zepto 1.1.3 + 
width 'zepto event touch ie' mode  

-------------------------------------------
###最新版本
  1.0.0  实现了基本的插件的功能
  1.0.1  修复了页面如果滚动到底部，滑动组件直接定位在顶部的bug；修改了图片加载方式，由之前的全部加载改为图片独立加载。