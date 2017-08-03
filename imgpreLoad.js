#	imgpreload.js的使用方法
#	
#	### imgpreload.js用于进行图片预加载。
#	
#	> 在require引用中此模块的引用代号为 `imgpreload` 	
#	#	API
#	
#	### imgpreload.load(imgs,onComplete,onReady)
#	进行图片预加载
#	* imgs : 图片路径数组
#	* onComplete : 图片加载完成后的回调函数，有2个参数：
#	* loaded : 成功加载的图片数组
#		* imgs ： 返回传入的图片数组
#	* onReady : 每加载完一张图片都会执行该方法，有2个参数：
#		* n : 被加载图片在数组中的序号
#		* img : 传入的图片的路径
#


(function(global,factory){
	if(typeof define === 'function' && define.amd){
		define(function(){
			return factory(global);
		});
	}else if(typeof module !== 'undefined' && module.exports){
		module.exports = factory(global);
   	} else { //正常状态
        global.imgpreload = factory(global.MHJ, global);
    }
}(typeof window !== 'undefined' ? window : this,function(window){
	var imgReady = (function () {
	    var list = [], intervalId = null,
	
	    // 用来执行队列
	    tick = function () {
			var i = 0;
			for (; i < list.length; i++) {
				list[i].end ? list.splice(i--, 1) : list[i]();
			}
			!list.length && stop();
		},
	
	    // 停止所有定时器队列
		stop = function () {
			clearInterval(intervalId);
			intervalId = null;
		};
	
	    return function (url, ready, load, error) {
	        var onready, width, height, newWidth, newHeight,
	            img = new Image();
	
	        img.src = url;
	
	        // 如果图片被缓存，则直接返回缓存数据
	        if (img.complete) {
	            ready.call(img);
	            load && load.call(img);
	            return;
	        }
	        ;
	
	        width = img.width;
	        height = img.height;
	
	        // 加载错误后的事件
	        img.onerror = function () {
	            error && error.call(img);
	            onready.end = true;
	            img = img.onload = img.onerror = null;
	        };
	
	        // 图片尺寸就绪
	        onready = function () {
	            newWidth = img.width;
	            newHeight = img.height;
	            if (newWidth !== width || newHeight !== height ||
	                // 如果图片已经在其他地方加载可使用面积检测
	                newWidth * newHeight > 1024
	                ) {
	                ready && ready.call(img);
	                onready.end = true;
	            }
	        };
	        onready();
	
	        // 完全加载完毕的事件
	        img.onload = function () {
	            // onload在定时器时间差范围内可能比onready快
	            // 这里进行检查并保证onready优先执行
	            !onready.end && onready();
	
	            load && load.call(img);
	
	            // IE gif动画会循环执行onload，置空onload即可
	            img = img.onload = img.onerror = null;
	        };
	
	        // 加入队列中定期执行
	        if (!onready.end) {
	            list.push(onready);
	            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
	            if (intervalId === null) intervalId = setInterval(tick, 40);
	        }
	        ;
	    };
	})();

	return {
		load:function(imgs,onComplete,onReady) {
			var onComplete = onComplete || function(count,imgs){};
			var onReady = onReady || function(i,img){};
			
			var loaded = 0;
			var error = 0;
			for(var i = 0; i < imgs.length; i++){
				(function(n){
					var n = n;
					imgReady(imgs[n],function(){
						++loaded;
						onReady && onReady(n,imgs[n]);
						if(loaded + error >= imgs.length){
							onComplete && onComplete(loaded,imgs);
						}
					},null,function(){
						++ error;
						if(error + loaded >= imgs.length) {
							onComplete && onComplete(loaded,imgs);
						}
					});
				})(i);

	        }
		}
	}
}));
