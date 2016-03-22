module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	var config = {
		//服务器变量
		serverHost: '*',
		serverPort: 3000,
		livereload: 35729,
		root: './',        // web服务器根目录，.号为Gruntfile.js所在目录
		html: 'demo/', //html模板所在目录
	};

	// 时间戳
	// var timeStmp = (new Date()).toLocalString().replace(/[^0-9]*/g,'');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			options: {
				port: config.serverPort,
				hostname: config.serverHost,
				middleware: function(connect, options) {
					return [
						require('connect-livereload')({
							port: config.livereload
						}),
						// 静态文件服务
						connect.static(config.root),
						// 设置目录浏览
						connect.directory(options.base),
					];
				}
			},

			server: {
				options: {
					open: false, //自动打开网页 http://
					base: [
						config.root //主目录
					]
				}
			},
		},

		//打开浏览器
		open: {
			dev: {
				url: 'http://localhost:' + config.serverPort + '/' + config.html,
				app: 'google chrome', //指定打开的浏览器
			}
		},

		// less
		less: {
			development: {
				options: {
					//该选项用来指定less中通过 @import 导入的文件对应的路径，默认与待编译文件路径相同。
					paths: ["dev/less/"],
					//是否使用 clean-css 进行压缩，默认不使用。
					cleancss: false,
					//生成的文件是否删除空格进行压缩，默认不压缩。
					compress:false,
				},
				files: {
					'dev/css/style.css': 'dev/less/main.less'
				}
			},
		},
		//css压缩
		// cssmin: {
		// 	options: {
		// 		compatibility: "ie7",
		// 		advanced: false,
		// 		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + ' auth:<%= pkg.author %> */\n'
		// 	},
		// 	build: {
		// 		files: [
		// 			{
		// 				expand: true,
		// 				cwd: 'dev/css/',
		// 				src: ['**/*.css'],
		// 				dest: 'build/css/',
		// 				ext: '_<%=pkg.version%>.min.css'
		// 			}
		// 		]
		// 	}
		// },
		//js压缩
		uglify: {
			build: {
				options: {
					banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + ' auth:<%= pkg.author %>*/\n',
					compress: {
			          drop_console: true
			        }
				},
				files: [
					{
						expand: true,
						cwd: 'js/',
						src: ['Slider.js'],
						dest: 'js/',
						ext: '.min.js'
					}
				]
			}
		},
		sprite: {
		    options: {
		        // sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
		        imagepath: 'dev/images/sprite',
		        // 映射CSS中背景路径，支持函数和数组，默认为 null
		        imagepath_map: null,
		        // 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
		        spritedest: 'dev/images/',
		        // 替换后的背景路径，默认 ../images/
		        spritepath: '../images/',
		        // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
		        padding: 2,
		        // 是否使用 image-set 作为2x图片实现，默认不使用
		        useimageset: false,
		        // 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
		        newsprite: false,
		        // 给雪碧图追加时间戳，默认不追加
		        spritestamp: true,
		        // 在CSS文件末尾追加时间戳，默认不追加
		        cssstamp: true,
		        // 默认使用二叉树最优排列算法
		        algorithm: 'binary-tree',
		        // 默认使用`pixelsmith`图像处理引擎
		        engine: 'pixelsmith'
		    },
		    autoSprite: {
		        files: [{
		            // 启用动态扩展
		            expand: true,
		            // css文件源的文件夹
		            cwd: 'dev/less/',
		            // 匹配规则
		            src: 'icon.less',
		            // 导出css和sprite的路径地址
		            dest: 'dev/less/',
		            // 导出的css名
		            ext: 'sprite.less'
		        }]
		    }
		},
		//复制
		copy: {
			build: {
				files:[
					{
						expand: true,
						// flatten只拷贝一级目录
						// flatten:true,
						cwd: 'dev/images/',
						src: ['**', '!sprite/**'],
						dest: 'build/images/'
					},{
						expand: true,
						cwd: 'dev/',
						src: ['css/**','js/**','lib/**'],
						dest: 'build/'
					}
				]
			}
		},
		//清空
		clean: {
			//清空build文件夹
			build: {
				src: ['build/**']
			},
		},
		//htmlinclde
		includereplace: {
			//开发时调用，不传版本号
			dev: {
				options: {
					//include时候的全局变量，可以通过@@变量名来引用
					globals: {
						coding:'UTF-8'
					}
				},
				files: [{
					expand: true,
					flatten: true,
					cwd: 'dev/tmpl/',
					src: ['*.html', '!*.inc'],
					dest: 'dev/html/',
				}]
			},
			//build的时候
			build:{
				options: {
					//include时候的全局变量，可以通过@@变量名来引用
					globals: {
						coding:'gb2312'
					}
				},
				files: [{
					expand: true,
					flatten: true,
					cwd: 'dev/tmpl/',
					src: ['*.html', '!*.inc'],
					dest: 'build/html/',
				}]
			}
		},
		//转码
		transcode: {
			//UTF-8转gbk
			u2g: {
				options: {
					fromEncoding: 'UTF-8',
					toEncoding: 'GBK'
				},
				files: [
					{
						expand: true,
						cwd: 'build/',
						src: ['**/*.html','!images/**'],
						dest: 'build/',
					}
				]
			},
			//gbk转UTF-8
			g2u: {
				options: {
					fromEncoding: 'GBK',
					toEncoding: 'UTF-8'
				},
				files: [
					{
						expand: true,
						cwd: 'build/',
						src: ['**/*.html','!images/**'],
						dest: 'build/',
					}
				]
			}
		},

		//监控文件变化
		watch: {
			clinet: {
				options: {
					livereload: config.livereload
				},
				files:['dev/**']
			},
			less2css: {
				files: ['dev/less/*','!dev/less/icon.less'],
				tasks: ['less'],
				options: {
					event: ['changed']
				}
			},
			//更新雪碧图和css文件
			updateSprite:{
				files: ['dev/less/icon.less'],
				tasks: ['sprite']
			},
			//更新html
			include: {
				options: {
					livereload: false,
				},
				files: ['dev/tmpl/**'],
				tasks: ['includereplace:dev']
			}
		},

		useminPrepare: {
			build: {
				html: 'dev/html/*.html',
				options: {
				}
			}
		},

		usemin: {
			html: {
				files : [{
					src : 'build/html/*.html'
				}]
			}
		},

		filerev: {
			build:{
				files : [{
					src : ['build/**','!build/html/**','!build/images/**','!build/lib/**']
				}]
			}
		}

	});



	// 注册grunt默认任务
	grunt.registerTask('default', ['connect:server', 'buildSource', 'open:dev', 'watch']);
	//开始生成文件
	grunt.registerTask('buildSource', ['sprite','less','includereplace:dev']);
	//转码
	grunt.registerTask('u2g', ['transcode:u2g']);
	grunt.registerTask('g2u', ['transcode:g2u']);
	//build
	grunt.registerTask('build', [
		'clean:build',
		'includereplace:build',
	    'cssmin:build',
	    'uglify:build',
	    'copy:build'
	]);
	grunt.registerTask('build2', [
		'clean:build',
		'useminPrepare',
		
		'filerev',
		'usemin',
		'u2g'
	]);



	// 监控watch事件，改变任务的配置
	grunt.event.on('watch', function(action, filepath, file) {});

};