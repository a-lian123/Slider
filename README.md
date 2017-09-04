## Slider for Zepto
--------------------------------------------

### 简介

 Slider3.0.1是一个我闲暇时间写的Zepto插件，用于在移动端实现像微博、微信朋友圈展示多张图片的那种效果。可以滑动，缩放，也可实现简单的页面上幻灯片效果。基于JavaScript touch事件，zetop doubleTouch事件，和CSS3。

 ----------------------------------------------
### 例子

##### 微信图片展示的效果
<img src="http://wzlian.me/project/slider/images/qr1.png" width = "100" height = "100" alt="qr1" />
[demo](http://wzlian.me/project/slider/demo/demo1.html)
##### 简单的幻灯片效果
<img src="http://wzlian.me/project/slider/images/qr2.png" width = "100" height = "100" alt="qr2" />
[demo](http://wzlian.me/project/slider/demo/demo2.html)
-------------------------------------------
### 调用方法
引入`Zepto.js` 和 `slide.js`

(1)实现微信图片展示的效果

```
//初始化Slider对象，进行必要的配置
var Slider = $.slider({
	isLoop:	false,                                           //是否能循环滑动，默认为false
	hasDot: true,                                            //是否有下面的点点，默认为true
	isFullScreen: true,                                      //是否全屏展示，默认是true
	hasCloseBtn: true                                        //是否拥有关闭按钮，默认没有，使用点击屏幕的方式关闭
});

//显示组件
Slider.show(index,//传入显示图片的index（从0开始），显示图片展示
			['pic1.jpg', 'pic2.jpg', 'pic3.jpg', 'pic4.jpg']//传入需要展示的图片数组
			);

```
说明：
- 只需传入需要展示的图片地址数组，不需要增加额外的HTML以及CSS，不需要引入CSS链接，js会自动插入样式，引入的css文件在`css/slider.css`。
- 若一个页面中需要不同的配置，初始化两个对象即可。

(2)实现简单的幻灯片效果

```
$.slider({
		isLoop: false,  //是都循环播放
		hasDot: true, //是否有点点
		$el: $('.wrapper'), //最外层的节点
		isFullScreen:false, //是否全屏
		autoSlide:true
});
```
说明：这部分的html需要自己书写且需要根据下面的格式进行书写，类名没有限制：
```
<div>
	<ul>
		<li><img src="../images/1408219308583895419.jpg"></li>
		<li><img src="../images/1817202449744335681.jpg"></li>
		<li><img src="../images/6204762820111109095629050_640.jpg"></li>
		<li><img src="../images/6597343545054048507.jpg"></li>
		<li><img src="../images/Funny_Kitty_Balanc_e.jpg"></li>
		<li><img src="../images/images.jpg"></li>
	</ul>
</div>

```
js会为最外层添加```slide-wrapper_n```类并添加必要的样式。
因为需要等到css添加后样式才能生效，我们需要在初始化前将元素隐藏，所以我们需要先在最外层的div设置 css `visibility:hidden;`。
li中元素的样式可以自由设置覆盖。



-------------------------------------------
### 依赖

Zepto 1.2.0 + 
width 'zepto event touch ie' mode  

-------------------------------------------
### 最新版本
-  1.0.0  （20150321）实现了基本的插件的功能
  
-  1.0.1  （20150402）修复了页面如果滚动到底部，滑动组件直接定位在顶部的bug；修改了图片加载方式，由之前
  的全部加载改为图片独立加载。
  
-  2.0.0  （20150817）增加了简单幻灯片的效果，优化了代码
  
-  2.0.1  （20151126）全屏幻灯片默认隐藏关闭按钮，样式自动插入

-  3.0.0  （20160415）优化了单击关闭的功能，在图片放大后也能单击关闭；优化了全屏模式下初始化和显示的方式，不再重复创建Slider和插入html；两种slider模式下都自动插入css；修改了图片滑动机制，学习swipe.js插件，使用了translate的方式去定位，使整体更加流畅，循环滑动的模式下不会出现卡顿的问题；全屏模式下，对于小于屏幕尺寸的图片，显示原始尺寸

-  3.0.1  （20160593）1.修改全屏展示模式下的初始化方式2.优化代码3.fixed 点点生成的bug
