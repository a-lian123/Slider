/**
* aouthor: alian wangzhuanglian 654849917@qq.com
* des    : Slider1.0.0 is a image slideshow plug-in for Zetop width features like touch,CSS3 transition and CSS3 transform.
*          Slider1.0是一个我闲暇时间写的zepto插件，用于实现像微博、微信朋友圈展示多张图片的那种效果。可以滑动，缩放。基于JavaScript touch事件，zetop doubleTouch事件，和CSS3。
* version: 1.0.0 
* depend : Zepto 1.1.3 + width 'zepto event touch ie'mode  
*/


;(function ($){
	'use strict';	
	$.slider =function (options,callback){

		var Slider = {
			setting:{
				imgAry  : [],        //图片数组
				hasDot  : true,      //是否有点点
				isLoop  : true,       //是否有循环
				indexNow: 0          //开始的位置
			},
			init: function (data, callback){
				var that           = this;
				this.$el 		   = null;
				this.$close        = null;
				this.$ul           = null;
				this.$li           = null;
				this.$nav          = null;
				this.$navli        = null;
				this.$imgs	       = null;                              
				this.liLength      = this.setting.imgAry.length;
				this.liWidth	   = 0;
				this.ulWidth       = 0; 
				this.indexNow      = this.setting.indexNow || 0;         //目前的index
				this.winWidth	   = $(window).width();                  //屏幕宽度
				this.winHeight 	   = $(window).height();                 //屏幕高度
				this.loadNum       = 0;                                  //加载的图片数量
				this.initFingerDis = 0;                                  //两个手指之间的距离
				this.isScale       = false;                              //是否正在缩放
				this.isMove        = false;                              //是否正在滑动
				this.initImgMoveX  = 0;                                  //图片放大的时候初始触摸的X
				this.initImgMoveY  = 0;	                                 //图片放大的时候初始触摸的Y
				this.lastImgMoveX  = 0;                                  //图片放大的时候移动的X
				this.lastImgMoveY  = 0;	                                 //图片放大的时候移动的Y
				this.lastSlideX    = 0;                                  //滑动的时候X的坐标
				this.initSlideX    = 0;                                  //滑动触摸时手指的x坐标	
				this.minScale	   = 1.3;                                //图片最小缩放倍数
				this.maxScale      = 3;                                  //图片最大缩放倍数
				this.scaleArg      = 1;                                  //图片缩放率
				this.finalScale    = 1;                                  //最终的缩放率
				this.moveX         = 0;                                  //最终的移动X
				this.moveY         = 0;                                  //最终的移动Y
				this.scale         = 1;                                  //缩放的比例

				//生成图片列表
				this.render();


			},
			onload: function(){
				this.loadNum++;

				if(this.loadNum == this.liLength){
					this.$loading.remove();

					//初始化图片尺寸
					this.initImg();

					//显示图片列表
					this.$ul.show();

					//绑定事件
					this.onEvent();

					//回调
					if(callback) callback();
				}
			},
			render: function(){
				var that = this;
				//生成基本元素
				var html = '<div class="slide-wrapper" id="J-slide-wrapper">'+
								'<span class="slide-tips" id="J-slide-load">加载中...</span>'+
	                        	'<ul class="slide"></ul>'+
	     						'<ul class="slide-nav"></ul>'+
		                        '<span class="slide-close" id="J-slide-colse">关闭</span>'+
		                   '</div>';
		        this.$el           = $(html);
		        this.$close        = this.$el.find('#J-slide-colse');
				this.$ul           = this.$el.find('.slide');
				this.$nav          = this.$el.find('.slide-nav');
				this.$loading      = this.$el.find('#J-slide-load');
				this.liWidth	   = this.winWidth;
				this.ulWidth       = this.setting.isLoop ? this.liWidth * (this.liLength + 2) : this.liWidth * this.liLength ; 
				//添加进body
				$('body').append(this.$el);

				//插入图片
				this.appendImg();

				//生成点点
				if(this.setting.hasDot){
					for(var i = 0; i < this.liLength; i++){
						this.$nav.append('<li></li>');	
					}
					this.$navli =  this.$el.find('.slide-nav li');
					this.$navli.eq(0).addClass('on');
				}

				//最大化
				this.$el.css({'width' : this.winWidth,'height' : this.winHeight}).show();
				
				//初始化slider的宽度 
				this.$ul.css({'width' : this.ulWidth + 'px'});

				//定位slide
				if(this.setting.isLoop) this.$ul.css('left',-this.liWidth + 'px');
				this.transform(0, -(this.indexNow) * this.liWidth, 0, 1, 'auto', this.$ul);
				if(this.setting.hasDot){
					this.$navli.removeClass('on');
					this.$navli.eq(this.indexNow).addClass('on');
				}

				//设置li宽度
				this.$li = this.$el.find('.slide li');
				this.$li.css({'width' : this.liWidth + 'px'});

			},
			appendImg: function(){
				var imgHtml = '',
				    that = this;

				//生成图片列表
				for(var i = 0; i < this.liLength; i++){
					if(i == 0 && this.setting.isLoop){
						imgHtml += '<li class="Route"><img src="' + this.setting.imgAry[this.liLength - 1] + '" /></li>';
					}

					imgHtml += '<li class="Route"><img src="'+ this.setting.imgAry[i] + '" /></li>';
		       		
		       		if(i == this.liLength - 1 && this.setting.isLoop){
		       			imgHtml += '<li class="Route"><img src="' + this.setting.imgAry[0] + '" /></li>';
		       		}
				}
				this.$ul.append(imgHtml);
				this.$imgs = this.$ul.find('img');

				//设置img事件
				this.$imgs.on('load error emptied stalled',function(e){
					that.onload.call(that,e);
				});
			},
			//初始化图片尺寸
			initImg: function(){
				var length = this.setting.isLoop?this.liLength + 2 : this.liLength;
				for(var i = 0; i < length; i++){
					var $img = this.$imgs.eq(i);
					var imgHeight = $img[0].naturalHeight;
					var imgWidth  = $img[0].naturalWidth;
					if(!(imgWidth && imgHeight)){
						$img.parent().html('<span class="slide-tips">加载失败</span>');
					}else if(imgHeight > imgWidth){
						var scaleH = this.winHeight/imgHeight;
						var scaleW = this.winWidth/imgWidth;

						if(scaleW * imgHeight > this.winHeight ){
							$img.css({'width': imgWidth * scaleH ,'height': this.winHeight});
						}else{
							$img.css({'width': this.winWidth , 'height': imgHeight * scaleW});
						}

					}
				}
			},
			onEvent: function(){
				var that = this;
				//滑动
				this.$el.on('touchstart doubleTap',function(e){
					that.onTouchEvent.call(that,e);
				});
			
			},
			onTouchEvent: function(e){
				var that = this,
					type = e.type,
					touches = e.touches || [],
					$zoomTarget = this.setting.isLoop ? this.$li.eq(this.indexNow + 1) : this.$li.eq(this.indexNow),
					scale = 0;

				if (e.preventDefault) e.preventDefault();
				//关闭
				if($(e.target).attr('id') === 'J-slide-colse'){this.destory(); return;}

				switch(type){
					case 'touchstart':
						console.log('touchstart');
						
						//缩放
						if(touches.length === 2){
							this.initFingerDis = this.fingersDistance(touches);
							this.isScale = true;
						//缩放之后的移动
						}else if(touches.length === 1 && this.isScale && !this.isMove){
							this.initImgMoveX = touches[0].clientX - this.moveX;
							this.initImgMoveY = touches[0].clientY - this.moveY; 
						//滑动的移动
						}else if(touches.length === 1 && !this.isScale){	
							this.initSlideX = this.lastSlideX = touches[0].clientX;
							this.moveLength = 0;
						}

						this.$el.on('touchmove touchend', function(e){
							that.onTouchEvent.call(that,e);
						});
						break;
					case 'touchmove':
						console.log('touchmove');

						//两只手指放大
						if(touches.length === 2 && !this.isMove){
								this.lastFingerDis = this.fingersDistance(touches);
								var rate = this.lastFingerDis / this.initFingerDis;
								this.scale = rate * this.finalScale;
								this.transform(0, 0, 0, this.scale ,'50% 50%', $zoomTarget);
						//放大的时候移动图片
						}else if(touches.length === 1 &&  this.isScale && !this.isMove){
								this.lastImgMoveX = touches[0].clientX;
								this.lastImgMoveY = touches[0].clientY;
								this.moveX = this.lastImgMoveX - this.initImgMoveX,
								this.moveY = this.lastImgMoveY - this.initImgMoveY;

								//移动图片
								this.transform(0 ,this.moveX, this.moveY, this.finalScale, '50% 50%', $zoomTarget);
						//滑动
						}else if(touches.length === 1){
							//滑动时禁止其他的操作（放大，移动）
							this.isMove = true;
							this.lastSlideX = touches[0].clientX;
							this.moveLength = this.lastSlideX - this.initSlideX;
							this.transform(0, (-that.indexNow * that.liWidth + that.moveLength), 0, 1, 'auto', this.$ul);
						}
						
						break;
					case 'touchend':
						console.log('touchend');
						this.$el.off('touchmove touchend');

						//滑动后重置silder位置
						this.resetSliderPosition();

						//放大后重置图片位置
						this.resetImgPosition($zoomTarget);
						
						this.$el.off('touchmove touchend');					
						
						break;
					case 'doubleTap':
						if(this.isScale){
							//重置finalScale,和moveX，moveY
							this.finalScale = 1;
							this.moveY = 0;
							this.moveX = 0;
							this.transform(3 , 0, 0, 1, '50% 50%', $zoomTarget);
							this.isScale = false;
						}
						break;
				}
			},
			resetSliderPosition: function(){
				if(!this.isMove) return;

				var l = this.moveLength;
				var canMovePre =  this.indexNow != 0 || this.setting.isLoop,
				    canMoveNext = this.indexNow != this.liLength - 1 || this.setting.isLoop;

				if(l < 0 && Math.abs(l) > this.liWidth/3 && canMoveNext){
					console.log('moveToLeft');
					this.movenext();
					
				}else if(l > 0 && Math.abs(l) > this.liWidth/3 && canMovePre){
					console.log('moveToRight');
					this.moveprev();
					}else{	
					this.transform(3, -(this.indexNow) * this.liWidth, 0, 1, 'auto', this.$ul);
				}

				this.isMove = false;
			},
			resetImgPosition: function($zoomTarget){
				if(!this.isScale) return;

				var $img = $zoomTarget.find('img');

				//缩放倍数和状态重置
				if(this.scale <= this.minScale){
					//重置finalScale,和moveX，moveY
					this.finalScale = 1;
					this.moveY = 0;
					this.moveX = 0;
					this.transform(3 , 0, 0, 1, '50% 50%', $zoomTarget);
					this.isScale = false;
				}else{
					this.finalScale = this.scale;
				}

				var imgWidth = $img.width(),
					imgHeight = $img.height();
				

				//上下边界的界定
				var set = (this.winHeight - imgHeight)/2;
				if(set > 0){
					if(this.moveY < -set){
						this.moveY = -set;
					}else if(this.moveY > set){
						this.moveY = set;
					}
				}else{
					if(this.moveY < set){
						this.moveY = set;
					}else if(this.moveY >　-set){
						this.moveY = -set;
					}
				}

				set = (this.winWidth - imgWidth)/2;
				if(set > 0){
					if(this.moveX < -set){
						this.moveX = -set;
					}else if(this.moveX > set){
						this.moveX = set;
					}
				}else{
					if(this.moveX < set){
						this.moveX = set;
					}else if(this.moveX > -set){
						this.moveX = -set;
					}
				}

				//移动图片
				this.transform(3 ,this.moveX, this.moveY, this.finalScale, '50% 50%', $zoomTarget);

			},
			slide: function(){
				var that = this;
				
				this.movenext();

				this.timer = setTimeout(function(){
					that.slide.call(that);
				}, 2000);
			},
			moveprev: function(){
				var that = this;

				this.indexNow --;

				//移动
				this.transform(2, -(this.indexNow) * this.liWidth, 0, 1, 'auto', this.$ul);

				if(this.indexNow < 0 && this.setting.isLoop){

					this.indexNow = this.liLength - 1;
				  	
					setTimeout(function(){
						that.transform(0, -(that.indexNow) * that.liWidth, 0, 1, 'auto', that.$ul);
	                },200);
				}

	            //点点
				if(this.setting.hasDot){
					this.$navli.removeClass('on');
					this.$navli.eq(this.indexNow).addClass('on');
				}
				
			},
			movenext: function(){
				var that = this;

				this.indexNow ++;

				//移动
				this.transform.call(this, 2, -(this.indexNow) * this.liWidth, 0, 1,  'auto', this.$ul);

				if(this.indexNow >= this.liLength && this.setting.isLoop){
				 	
					this.indexNow = 0;
				  
					setTimeout(function(){
						that.transform( 0, 0, 0, 1, 'auto',that.$ul);
	                },200);
	            }	

	            //点点
				if(this.setting.hasDot){
					this.$navli.removeClass('on');
					this.$navli.eq(this.indexNow).addClass('on');
				}
		
			},
			transform : function(duration, positionX, positionY, scale, origin, $target){
				$target.css({
					'transform'         : 'translate3d(' + positionX + 'px, '+ positionY +'px, 0px) scale('+ scale +')', 
					'-webkit-transform' : 'translate3d(' + positionX + 'px, '+ positionY +'px, 0px) scale('+ scale +')',
					'transition'        : 'all 0.'+ duration +'s cubic-bezier(0.22, 0.69, 0.72, 0.88)',
					'-webkit-transition': 'all 0.'+ duration +'s cubic-bezier(0.22, 0.69, 0.72, 0.88)',
		            'transform-origin'  		: origin,
					'-webkit-transform-origin'  : origin
				});
			},
			fingersDistance:function(touches){
				var e0 = touches[0] || {},
	            e1 = touches[1] || {},
	            x0 = e0.clientX || 0,
	            x1 = e1.clientX || 0,
	            y0 = e0.clientY || 0,
	            y1 = e1.clientY || 0,
	            disX = Math.abs(x0 - x1),
	            disY = Math.abs(y0 - y1);

	       		return Math.sqrt(disX * disX + disY * disY);
			},
			destory:function(e){
				if(this.$close){
					this.$close.off('touchstar');
					this.$close = null;
				}
				if(this.$imgs){
					this.$imgs.off('load error emptied stalled');
					this.$imgs = null;
				}
				if(this.$el){
					this.$el.off('touchstar touchmove touchend').remove();
	           		this.$el = null;
				}
				
			},
			handleData: function(callback){
				this.setting.imgAry = callback();
			}
		}


		$.extend(Slider.setting, options || {});

		Slider.init();


		return this;
	};
})(window.Zepto);
