##Slider for Zepto
--------------------------------------------

###简介

 Slider2.0.1是一个我闲暇时间写的Zepto插件，用于在移动端实现像微博、微信朋友圈展示多张图片的那种效果。可以滑动，缩放，也可实现简单的页面上幻灯片效果。基于JavaScript touch事件，zetop doubleTouch事件，和CSS3。

 ----------------------------------------------
###例子

#####微信图片展示的效果
![例子](http://test.wzlian.me/slider/images/1.png)
点击链接[enter link description here](http://test.wzlian.me/slider/demo/demo1.html)

#####简单的幻灯片效果
![例子](http://test.wzlian.me/slider/images/2.png)
点击链接[enter link description here](http://test.wzlian.me/slider/demo/demo2.html)

-------------------------------------------
###调用方法
引入Zepto.js

(1)实现微信图片展示的效果
```
$.slider({
	imgAry: ['pic1.jpg', 'pic2.jpg', 'pic3.jpg', 'pic4.jpg'],//图片数组
	isLoop:	false,                                           //是否能循环滑动，默认为false
	hasDot: true,                                            //是否有下面的点点，默认为true
	indexNow: 0                                              //当前的图片顺序,默认为0，从0开始
	isFullScreen: true                                       //是否全屏展示
});
```
说明：只需传入需要展示的图片地址数组，不需要增加额外的HTML以及CSS，不需要引入CSS链接，js会自动插入样式，引入的css文件在`css/slider_fullScreen.css`。

(2)实现简单的幻灯片效果

```
$.slider({
	hasDot: true,                                          //是否有点点
	$el: $('.wrapper'),                                    //最外层的元素
	isFullScreen:false,                                    //是否全屏
	autoSlide: true                                        //是否自动播放
});
```
说明：这部分的html需要自己书写且需要根据下面的格式进行书写，类名没有限制：
```
<div>
	<ul>
		<li><img src="../images/1408219308583895419.jpg" alt="1"></li>
		<li><img src="../images/1817202449744335681.jpg" alt="2"></li>
		<li><img src="../images/6204762820111109095629050_640.jpg" alt="3"></li>
		<li><img src="../images/6597343545054048507.jpg" alt="4"></li>
		<li><img src="../images/Funny_Kitty_Balanc_e.jpg" alt="5"></li>
		<li><img src="../images/images.jpg" alt="6"></li>
	</ul>
</div>

```
js会为最外层添加```slide-wrapper_n```类并添加必要的样式。
这部分我们需要先在样式中引入以下样式，li中的样式可以自由设置覆盖，添加的样式如下，css文件在`css/slider_noFullScreen.css`。

```
.slide-wrapper_n{overflow: hidden;}.slide-wrapper_n li,.slide-wrapper_n ul{margin:0;padding:0}.slide-wrapper_n ul{position: absolute;left: 0;top: 0;}.slide-wrapper_n li{float: left;list-style: none;}
```

-------------------------------------------
###依赖

Zepto 1.1.3 + 
width 'zepto event touch ie' mode  

-------------------------------------------
###最新版本
  1.0.0  实现了基本的插件的功能
  1.0.1  修复了页面如果滚动到底部，滑动组件直接定位在顶部的bug；修改了图片加载方式，由之前
  的全部加载改为图片独立加载。
  2.0.0  增加了简单幻灯片的效果，优化了代码
  2.0.1  全屏幻灯片默认隐藏关闭按钮，样式自动插入