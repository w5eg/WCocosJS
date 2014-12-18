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
	var swingL2R = cc.rotateBy(duration*(Math.abs(startAngle)/_maxAngle), _rotateBy).easing(cc.easeInOut(2.0));
	var swingAction = cc.sequence(swingL2R,swingL2R.reverse());
	return swingAction.repeatForever();
}
cc.w.CollisionLayer = cc.LayerColor.extend({
	
});
cc.w.CollisionDetectionUtil = {};
cc.w.CollisionDetectionUtil.pointInWhithRect = function(point,rects) {
	for (var i = 0; i < rects.length; i++) {
		var rect = rects[i];
		if (cc.rectContainsPoint(rect, point)) {
			return rect;
		}
	}
	return null;
};
cc.w.CollisionDetectionUtil.pointInWhithNode = function(point,nodes) {
	for (var i = 0; i < node.length; i++) {
		var node = nodes[i];
		if (cc.rectContainsPoint(node.getBoundingBox(), point)) {
			return node;
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