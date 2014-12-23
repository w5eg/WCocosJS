cc.w = {};
cc.w.Layout = {};
cc.w.Layout.testNode = function(node){
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
cc.w.Scene = cc.Scene.extend({
	_layer:null,
	onEnter:function () {
		this._super();
		if (this._layer) {
			this.addChild(this._layer);
		}
	},
	/**
	 * Constructor of cc.w.Scene
	 */
	_className:"WScene",
	ctor:function (layer) {
		this._super();
		this._layer = layer;
	}
});
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
cc.w.Action = {};
cc.w.Math = {};
cc.w.Math.computeAngle = function(centerPoint,aroundPoint){
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
cc.w.Action.swing = function(node,duration,startAngle){
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
cc.w.currentNode = null;
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
	_speed:5,
	_distance:cc.p(1, 1),
	_centerPoint:null,
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
		if(cNode||currentLen>=this._totalLen){
			if(cNode){
				this._currentPoint.x = cNode.x;
				this._currentPoint.y = cNode.y;
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
		var minDis = 0;
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
		
		this._centerPoint = cc.p(this.getContentSize().width/2,this.getContentSize().height-80);
		this._currentPoint = cc.p(this._centerPoint);
		this._node.setPosition(this._currentPoint);
		
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
//				pointNode.setPosition(point);
//				var node = cc.w.CollisionDetectionUtil.pointInWhithNode(point, nodes)
				self.detectCollistion(pointNode);
				
				cc.log("touch at: x="+point.x+" y="+point.y);
//				cc.log("centerPoint : x="+centerPoint.x+" y="+self._centerPoint.y);
				var angle = 180-cc.w.Math.computeAngle(self._centerPoint, point)-90;
//				cc.log("angle is : "+angle);
				self._node.setRotation(angle);
				var subP = cc.pSub(self._centerPoint, point);
				cc.log("subP : x="+subP.x+" y="+subP.y);
//				self._node.setRotation(45);
				var dur = cc.director.getWinSize().height/self._speed;
				var xSpeed = subP.x/dur,ySpeed = subP.y/dur;
				self._distance = cc.p(xSpeed,ySpeed);
				
				self._endPoint = point;
				self._totalLen = cc.pDistance(self._centerPoint, self._endPoint);
				
				self.unschedule(self.moveAway);
				self.schedule(self.moveAway,0.01);
			}
		});
		cc.eventManager.addListener(this.eventListener, this);
		
		this._lineLayer = new cc.w.DrawLineLayer(cc.Color(255, 255, 0, 255),5,self._centerPoint,self._endPoint);
		this.addChild(this._lineLayer);
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
		cc.log("3.1415926535897932384626");
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