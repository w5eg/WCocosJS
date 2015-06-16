
/**
 * BUG:如果编译不过。可能并没有错误，找到相关的类。稍微加个字符再删除，重新保存一下，再运行可能就好了。
 * 注意:有时上面的问题可能是没有关联相关的JS文件导致的。关联文件的顺序也可能会有影响。
 */
cc.w = cc.w||{};
/**视图组件包名*/
cc.w.view = {};
cc.w.layout = {};

cc.w.layout.testNode = function(node){
	var nodeParent = node.getParent();
	if(nodeParent&&node){
		var layer = new cc.LayerColor(cc.color(0,100,200,150));
		layer.setContentSize(node.getContentSize());
		layer.setAnchorPoint(node.getAnchorPoint());
		layer.setPosition(node.getPosition());
		layer.ignoreAnchorPointForPosition(false);
		nodeParent.addChild(layer);
	}
};
/**一个接收一个Layer为子视图的Scene子类*/
cc.w.Scene = cc.Scene.extend({
	_className:"WScene",
	ctor:function (layer) {
		this._super();
		if (layer) {
			this.addChild(layer);
		}
	}
});
/**一个圆形进度条*/
cc.w.ProgressSprite = cc.Sprite.extend({
	_className:"WProgressSprite",
	_progress:1,//from 0.0~1.0
	_drawNode:null,
	ctor:function (param) {
		this._super(param);
		this._drawNode = new cc.DrawNode();
		this.addChild(this._drawNode);
		this.setProgress(this._progress)
	},
	setProgress:function(progress){
		if(progress<0||progress>1)return;
		this._progress = progress;
		this.updateView();
	},
	getProgress:function(){
		return this._progress;
	},
	setContentSize:function(size, height){
		this._super(size,height);
		this.updateView();
	},
	updateView:function(){
		this._drawNode.clear();
		var draw = this._drawNode;

		var stokenSize = 6;
		var radius = this.getContentSize().width-stokenSize*2+3;
		var startAngle = 36;
		var endAngle = startAngle+(180 + 14)*this._progress;
		for (var i = startAngle; i < endAngle; i++) {
			var pos = cc.w.getPointThatAroundTheRectByAngle(i, radius);
			pos.x += stokenSize-10;
			pos.y += stokenSize-10;
			draw.drawDot(pos, stokenSize, cc.color(228, 60, 2, 255));
		}
	}
});

/**
 * anglef 浮点型的角度值，
 * rectSize 浮点型的正方形边长
 */
cc.w.getPointThatAroundTheRectByAngle = function(angleF, rectSize){
	var  x = 0,y = 0;
	var radius = rectSize/2;
	var M_PI = Math.PI;
	var  M_PI_2 = M_PI/2;
	var angle = angleF/180*M_PI;
	var center = new cc.p();
	if (angle>=M_PI*2.0) {
		angle -= M_PI*2.0;
	}
	if (angle>=0&&angle<M_PI_2) {
		x = radius + abs(sin(angle)*radius);
		y = radius - abs(cos(angle)*radius);
	}
	if (angle>=M_PI_2&&angle<M_PI) {
		angle-=M_PI_2;
		x = radius + abs(cos(angle)*radius);
		y = radius + abs(sin(angle)*radius);
	}
	if (angle>=M_PI&&angle<M_PI_2+M_PI) {
		angle-=M_PI;
		x = radius - abs(sin(angle)*radius);
		y = radius + abs(cos(angle)*radius);
	}
	if (angle>=M_PI_2+M_PI&&angle<M_PI*2.0) {
		angle-=M_PI_2+M_PI;
		x = radius - abs(cos(angle)*radius);
		y = radius - abs(sin(angle)*radius);
	}
//	cc.log("x="+x+",y="+y);
	center.x = x;
	center.y = y;
	return center;
}
abs = function(d){
	return Math.abs(d);
}
sin = function(d){
	return Math.sin(d);
}
cos = function(d){
	return Math.cos(d);
}
cc.w.action = {};
cc.w.math = {};
cc.w.math.computeAngle = function(centerPoint,aroundPoint){
	var p = cc.pSub(centerPoint, aroundPoint);
//	cc.log("pSub x="+p.x +" y="+p.y);
	var angle = cc.pToAngle(cc.pSub(centerPoint, aroundPoint));
	return angle/Math.PI*180;
}
/**
 * 左右摇摆动画
 * @param node 传入当前要做动画的节点。因为动画执行之前要设置为最小角度
 * @param duration 动画执行一次的时长
 * @param startAngle 开始角度，最小值为-90，是大值为90
 * @returns 动画对象
 */
cc.w.action.swing = function(node,duration,startAngle){
	if(duration<0)duration = 1;
	var _minAngle = -90;
	var _maxAngle = 90;
	
	var _starAngle = startAngle;
	var _rotateBy = -startAngle*2;
	if(startAngle<_minAngle||startAngle>_maxAngle){
		if(startAngle<_minAngle){startAngle = _minAngle;}
		if(startAngle>_maxAngle){startAngle = _maxAngle;}
	}else{
		var _starAngle = startAngle;
		var _rotateBy = -startAngle*2;
	}
	node.setRotation(startAngle);
	var swingL2R = cc.rotateBy(duration*(Math.abs(startAngle)/_maxAngle), _rotateBy).easing(cc.easeInOut(1.5));
	var swingAction = cc.sequence(swingL2R,swingL2R.reverse());
	return swingAction.repeatForever();
}
cc.w.currentNode = null;//???为什么不定义在CollisionLayer内部？？？
cc.w.CollisionLayer = cc.LayerColor.extend({
	_nodes : [],
	_node:null,
	_lineLayer:null,
	// 创建一个事件监听器 OneByOne 为单点触摸
	eventListener : null,
	createNode:function(cellSize){
		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
		layer.setContentSize(cellSize, cellSize);
		layer.ignoreAnchorPointForPosition(false);
		layer.setAnchorPoint(cc.p(0.5, 0.5));
		return layer;
	},
	onEixt:function(){
		this._super();
		cc.eventManager.removeListener(this.eventListener);  
	},
	onEnter:function(){
		this._super();
	},
	_speed:1,
	_distance:cc.p(1, 1),
	_centerPoint:null,
	_defaultLineLen:80,
	_defaultPoint:null,//离中心最近的点。这个第次根据事件位置变化
	_endPoint:null,
	_totalLen:0,
	_state:0,
	_stateOriginal:0,
	_stateGoingAway:1,
	_stateGoingBack:2,
	_currentPoint:null,
	_stateLabel:null,
	moveAway:function(){
		this._updateState(this._stateGoingAway);
		var contentSize = this.getContentSize();
		var currentLen = cc.pDistance(this._centerPoint, this._currentPoint);
//		cc.log("cl="+currentLen+" tl"+this._totalLen);
		if(currentLen<this._totalLen){
//			this._currentPoint = cc.pAddIn(cc.p(-this._distance.x,-this._distance.y),this._currentPoint);
//			cp = cc.pAddIn(cc.p(1,1),this._centerPoint);
			this._currentPoint.x -=this._distance.x;
			this._currentPoint.y -=this._distance.y;
//			this._currentPoint = cc.pAddIn(cc.p(1,1),this._currentPoint);
//			cc.log("cp.x="+this._currentPoint.x+" cp.y="+this._currentPoint.y);
		}
		
		var cNode = this.detectCollistion(this._node);
		if(
				cNode||
				currentLen>=this._totalLen){
			if(cNode){
//				this._currentPoint.x = cNode.x;
//				this._currentPoint.y = cNode.y;
				this._computeEndPoint(cNode.getPosition(), true);
			}
			this.unschedule(this.moveAway);
			this.unschedule(this.moveBack);
			this.schedule(this.moveBack,0.01);
		}
		this._node.setPosition(this._currentPoint);
		//test
//		this.unschedule(this.moveAway);
		//end test
		this._lineLayer.setEndPosition(this._currentPoint);
	},
	moveBack:function(){
		var minDis = 
//			0;
		this._defaultLineLen;
		this._updateState(this._stateGoingBack);
		var contentSize = this.getContentSize();
		var currentLen = cc.pDistance(this._centerPoint, this._currentPoint);
		currentLen*=this._currentPoint.y<=this._centerPoint.y?1:-1;
//		cc.log("cl="+currentLen+" tl"+this._totalLen);
		if(currentLen>minDis){
//			this._currentPoint = cc.pAddIn(this._distance,this._currentPoint);
			this._currentPoint.x +=this._distance.x;
			this._currentPoint.y +=this._distance.y;
		}else{
			this._updateState(this._stateOriginal);
			this.unschedule(this.moveBack);
		}
		this._node.setPosition(this._currentPoint);
//		var angle = 180-cc.w.Math.computeAngle(this._centerPoint, this._currentPoint)-90;
//		this._node.setRotation(angle);
		this._lineLayer.setEndPosition(this._currentPoint);
	},
	_updateState : function(state) {
		this._state = state;
		this._stateLabel.setString(""+this._state);
//		cc.log("state = "+this._state);
	},
	_className:"WCollisionLayer",
	ctor:function () {
		this._super(cc.color(70,70,70,255));
		this.eventListener = this.createListener();
		
		var row = 2,col = 5;
		var cellSize = 80;
		var rowSpace = 10,colSpace = 10;
		var left = 260;
		var bottom = 260;
		var centerPosition = cc.p(left, bottom);
		this._node = this.createNode(20);
		this.addChild(this._node,100);
		
		//设置画线的中心点
		this._centerPoint = cc.p(this.getContentSize().width/2,this.getContentSize().height-80);
		
		var label = new cc.LabelTTF("!",null,20);
		this._node.addChild(label);
		
		this._stateLabel = new cc.LabelTTF(""+this._state,null,20);
		this.addChild(this._stateLabel);
		this._stateLabel.setAnchorPoint(0, 1)
		this._stateLabel.setPosition(0, cc.director.getWinSize().height);
		
		var self = this;
		for (var i = 0; i < row; i++) {
			for (var j = 0; j < col; j++) {
				var node = this.createNode(cellSize);
				node.setPosition(centerPosition);
				//cc.eventManager.addListener(this.eventListener.clone(), node);
				this._nodes.push(node);
				this.addChild(node);
				centerPosition.x += cellSize+colSpace;
			}
			centerPosition.x = left;
			centerPosition.y += cellSize+rowSpace;
		}
		var nodes = this._nodes;
		var pointNode = this._node;
		
		this.eventListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,                       // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞掉事件，不再向下传递。
			onTouchBegan: function (touch, event) {
				return true;
			},
			onTouchMoved: function (touch, event) {         //实现onTouchMoved事件处理回调函数, 触摸移动时触发
			},
			onTouchEnded: function (touch, event) {         // 实现onTouchEnded事件处理回调函数
				if(self._state!=self._stateOriginal){
					return;
				}
				var target = event.getCurrentTarget();
				var point = target.convertToNodeSpace(touch.getLocation());
				if (point.y>self._centerPoint.y) {
					return;
				}
//				pointNode.setPosition(point);
//				var node = cc.w.CollisionDetectionUtil.pointInWhithNode(point, nodes)
				self.detectCollistion(pointNode);
				
				cc.log("touch at: x="+point.x+" y="+point.y);
//				cc.log("centerPoint : x="+centerPoint.x+" y="+self._centerPoint.y);
				
				self._computeEndPoint(point, false);
				
				self.unschedule(self.moveAway);
				self.schedule(self.moveAway,0.01);
			}
		});
		cc.eventManager.addListener(this.eventListener, this);
		this._setDefaultPosition();
		this._lineLayer = new cc.w.DrawLineLayer(cc.Color(255, 255, 0, 255),5,this._centerPoint,this._defaultPoint);
		this.addChild(this._lineLayer);
	},
	_setDefaultPosition:function(eventPoint){
		if(eventPoint){
			var scale = this._defaultLineLen/cc.pDistance(this._centerPoint, eventPoint);
			var vEvnet = cc.pSub(this._centerPoint, eventPoint);
			var vDefault = cc.pMult(vEvnet, scale);
			var vDefaultX = Math.abs(vDefault.x);
			var vDefaultY = Math.abs(vDefault.y);
			//把向量xy转换为坐标xy
			var x,y;
			if (eventPoint.x>this._centerPoint.x) {
				x = this._centerPoint.x + vDefaultX;
			}else{
				x = this._centerPoint.x - vDefaultX;
			}
			y = this._centerPoint.y - vDefaultY;
			this._defaultPoint = cc.p(x, y);
		}else{
			this._defaultPoint = cc.pAdd(this._centerPoint, cc.p(0, -this._defaultLineLen));
		}
		this._currentPoint = cc.p(this._defaultPoint);
		this._node.setPosition(this._defaultPoint);
	},
	_computeEndPoint:function(eventPoint,isEnd){
		this._setDefaultPosition(eventPoint);
		return;
		if (isEnd) {
			this._endPoint = eventPoint;
		}else{
			//整体Y轴的高度
			var yLen = this._centerPoint.y;
			//从事件点到中心点的X和Y
			var distanceEvent = cc.pSub(this._centerPoint,eventPoint);
			//事件y轴的高度
			var yLenEvent = Math.abs(distanceEvent.y);
			//事件x轴的高度
			var xLenEvent = Math.abs(distanceEvent.x);
			//缩放比率
			var lenScale = yLenEvent/yLen;
			//从原点到中心点的X和Y
			var distanceMax = cc.pSub(this._centerPoint,cc.p());
			var x = xLenEvent/lenScale;
			var y = yLenEvent/lenScale;
			if (x>distanceMax.x) {
				x = distanceMax.x;
				lenScale = x/xLenEvent;
				y = yLenEvent*lenScale;
			}else{
				y = distanceMax.y;
				lenScale = y/yLenEvent;
				x = xLenEvent*lenScale;
			}
			
			var defaultDistanceScale = this._defaultLineLen/this._centerPoint.y;
//			var currentPointV = cc.pMult(cc.p(x,y), defaultDistanceScale);
			
			//把向量xy转换为坐标xy
			if (eventPoint.x>this._centerPoint.x) {
				x += this._centerPoint.x;
//				currentPointV.x = this._centerPoint.x - currentPointV.x;
			}else{
				x = this._centerPoint.x - x;
//				currentPointV.x = this._centerPoint.x + currentPointV.x;
			}
			y = this._centerPoint.y - y;
			this._endPoint = cc.p(x,y);
//			currentPointV.y = this._centerPoint.y - currentPointV.y;
//			this._currentPoint = currentPointV;
			
			var self = this;
			var angle = 180-cc.w.Math.computeAngle(this._centerPoint, this._endPoint)-90;
//			cc.log("angle is : "+angle);
			this._node.setRotation(angle);
			var subP = cc.pSub(self._centerPoint, this._endPoint);
			cc.log("subP : x="+subP.x+" y="+subP.y);
//			self._node.setRotation(45);
			var dur = cc.director.getWinSize().height/self._speed;
			var xSpeed = subP.x/dur,ySpeed = subP.y/dur;
			self._distance = cc.p(xSpeed,ySpeed);
			
		}
		this._totalLen = cc.pDistance(this._centerPoint, this._endPoint);
	},
	detectCollistion:function(pointNode){
		var node = cc.w.CollisionDetectionUtil.nodeInWhithNode(pointNode, this._nodes)
		var cNode = cc.w.currentNode;
		if (node&&node!=cNode) {
			cc.w.currentNode = node;
			node.runAction(cc.sequence(cc.blink(1, 3),cc.callFunc(function(){

			})));
		}
		return node;
	},
	createListener:function(){
		var l = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,                       // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞掉事件，不再向下传递。
			onTouchBegan: function (touch, event) {     //实现 onTouchBegan 事件处理回调函数
				var target = event.getCurrentTarget();  // 获取事件所绑定的 target, 通常是cc.Node及其子类 
				target.setLocalZOrder(100); 
				// 获取当前触摸点相对于按钮所在的坐标
				var locationInNode = target.convertToNodeSpace(touch.getLocation());    
				var s = target.getContentSize();
				var rect = cc.rect(0, 0, s.width, s.height);

				if (cc.rectContainsPoint(rect, locationInNode)) {       // 判断触摸点是否在按钮范围内
					cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
					target.opacity = 180; 
					return true;
				}
				return false;
			},
			onTouchMoved: function (touch, event) {         //实现onTouchMoved事件处理回调函数, 触摸移动时触发
				// 移动当前按钮精灵的坐标位置
				var target = event.getCurrentTarget();
				var delta = touch.getDelta();              //获取事件数据: delta
				target.x += delta.x;
				target.y += delta.y;
			},
			onTouchEnded: function (touch, event) {         // 实现onTouchEnded事件处理回调函数
				var target = event.getCurrentTarget();
				cc.log("sprite onTouchesEnded.. ");
				target.setOpacity(255);
				target.setLocalZOrder(0);
			}
		});
		return l;
	},
});
cc.w.DrawLineLayer = cc.Layer.extend({
	_startPosition : null,
	_endPosition : null,
	_drawNode:null,
	_lineColor:null,
	_lineWidth:null,
	onExit:function(){
		this._super();
	},
	ctor:function (color,width,sp,ep) {
//		cc.log("3.1415926535897932384626");
		this._super();
		this._startPosition = sp;
		var contentSize = this.getContentSize();
		if(!this._startPosition)this._startPosition = cc.p(contentSize.width/2, contentSize.height);
		this._endPosition = ep;
		if(!this._endPosition)this._endPosition = cc.p(contentSize.width/2, contentSize.height-200);
		if(color){
			this._lineColor = color;
		}else{
			this._lineColor = cc.color(255, 0, 255, 255);
		}
		if(width){
			this._lineWidth = width;
		}else{
			this._lineWidth = 5;
		}
		this._drawNode = new cc.DrawNode();
		this.addChild(this._drawNode);
		this.updateView();
	},
	setEndPosition:function(ep){
		if (ep) {
			this._endPosition = ep;
			this.updateView();
		}
	},
	getStartPosition:function(){
		return this._startPosition;
	},
	setColor:function(color){
		this._lineColor = color;
		this.updateView();
	},
	updateView:function(){
		this._drawNode.clear();
		this._drawNode.drawSegment(this._startPosition, this._endPosition, this._lineWidth, this._lineColor);
	},
});
cc.w.CollisionDetectionUtil = {};
cc.w.CollisionDetectionUtil.pointInWhithNode = function(point,nodes) {
	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		//node.convertToNodeSpace(point)
		if (cc.rectContainsPoint(node.getBoundingBox(),point )) {
			return node;
		}
	}
	return null;
};
cc.w.CollisionDetectionUtil.nodeInWhithNode = function(node,nodes) {
	for (var i = 0; i < nodes.length; i++) {
		var whith = nodes[i];
		//node.convertToNodeSpace(point)
		if (cc.rectContainsRect(whith.getBoundingBox(),node.getBoundingBox())) {
			return whith;
		}
	}
	return null;
};
/*
 * var xhr = cc.loader.getXMLHttpRequest(); xhr.onreadystatechange = function () {
 * if (xhr.readyState == 4 && xhr.status == 200) { var response =
 * xhr.responseText; if(response) { var jsonData=JSON.parse(response);
 * if(jsonData) { cc.log("sssssssssssss"+response); }
 *  } }else{ cc.log("ffffffffffffff!"); } }; xhr.open("GET",
 * "https://itunes.apple.com/search?term=jack+johnson&limit=1"); xhr.send();
 * 
 */


cc.w.WLoaderScene = cc.Scene.extend({
	_interval : null,
	_label : null,
	_className:"WLoaderScene",
	_resources:[],
	_sb:null,
	/**
	 * Contructor of cc.WLoaderScene
	 * @returns {boolean}
	 */
	init : function(){
		var self = this;

		//logo
		var logoWidth = 160;
		var logoHeight = 200;

		// bg
		var bgLayer = self._bgLayer = new cc.LayerColor(cc.color(32, 32, 32, 255));
		bgLayer.setPosition(cc.visibleRect.bottomLeft);
		self.addChild(bgLayer, 0);

		//image move to CCSceneFile.js
		var fontSize = 24, lblHeight =  -logoHeight / 2 + 100;
		if(cc._loaderImage){
			//loading logo
			cc.loader.loadImg(cc._loaderImage, {isCrossOrigin : false }, function(err, img){
				logoWidth = img.width;
				logoHeight = img.height;
				self._initStage(img, cc.visibleRect.center);
			});
			fontSize = 14;
			lblHeight = -logoHeight / 2 - 10;
		}
		//loading percent
		var label = self._label = new cc.LabelTTF("Loading... 0%", "Arial", fontSize);
		label.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, lblHeight)));
		label.setColor(cc.color(180, 180, 180));
		bgLayer.addChild(this._label, 10);
		return true;
	},

	_initStage: function (img, centerPos) {
		var self = this;
		var texture2d = self._texture2d = new cc.Texture2D();
		texture2d.initWithElement(img);
		texture2d.handleLoadedTexture();
		var logo = self._logo = new cc.Sprite(texture2d);
		logo.setScale(cc.contentScaleFactor());
		logo.x = centerPos.x;
		logo.y = centerPos.y;
		self._bgLayer.addChild(logo, 10);
	},
	/**
	 * custom onEnter
	 */
	 onEnter: function () {
		 var self = this;
		 cc.Node.prototype.onEnter.call(self);
		 self.schedule(self._startLoading, 0.3);
	 },
	 /**
	  * custom onExit
	  */
	 onExit: function () {
		 cc.Node.prototype.onExit.call(this);
		 var tmpStr = "Loading... 0%";
		 this._label.setString(tmpStr);
	 },

	 /**
	  * init with resources
	  * @param {Array} resources
	  * @param {Function|String} cb
	  */
	 initWithResources: function (resources, cb) {
		 this._resources.push(resources);
		 this._cb = cb;
	 },

	 _startLoading: function () {
		 var self = this;
		 self.unschedule(self._startLoading);
		 var res = self._resources;
		 cc.loader.load(res,
				 function (result, count, loadedCount) {
			 var percent = (loadedCount / count * 100) | 0;
			 percent = Math.min(percent, 100);
			 self._label.setString("Loading... " + percent + "%");
		 }, function () {
			 if (self._cb)
				 self._cb();
		 });
	 }
});
/**
 * <p>cc.WLoaderScene.preload can present a loaderScene with download progress.</p>
 * <p>when all the resource are downloaded it will invoke call function</p>
 * @param resources
 * @param cb
 * @returns {cc.WLoaderScene|*}
 * @example
 * //Example
 * cc.WLoaderScene.preload(g_resources, function () {
       cc.director.runScene(new HelloWorldScene());
   }, this);
 */
cc.w.WLoaderScene.preload = function(resources, cb){
	var _cc = cc.w;
	if(!_cc.loaderScene) {
		_cc.loaderScene = new cc.w.WLoaderScene();
		_cc.loaderScene.init();
	}
	_cc.loaderScene.initWithResources(resources, cb);

	cc.director.runScene(_cc.loaderScene);
	return _cc.loaderScene;
};
cc.w.DemoLayer = cc.Layer.extend({
	ctor:function(){
		this._super();
		var layer = new cc.LayerColor(cc.color(55,55,55));
		this.addChild(layer);
		this.setupView();
	},
	setupView:function(){
		var size = cc.winSize;
		var closeItem = new cc.MenuItemImage(
				res.CloseNormal_png,
				res.CloseSelected_png,
				function () {
					cc.log("Menu is clicked!");
				}, this);
		closeItem.attr({
			x: size.width-60,
			y: 60,
			anchorX: 0.5,
			anchorY: 0.5
		});
		var menu = new cc.Menu(closeItem);
		menu.x = 0;
		menu.y = 0;
		this.addChild(menu, 1);
	}
});