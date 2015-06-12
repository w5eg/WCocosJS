cc.w.view.SlotsNode = cc.Node.extend({
	_columnNodes:null,
	ctor:function(size,height){
		this._super();
		this.setContentSize(size,height);
		this.setAnchorPoint(0.5, 0.5);
//		this.ignoreAnchorPointForPosition(false);
		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
		layer.setContentSize(this.getContentSize());
		this.addChild(layer);
		
//		var sp = new cc.Sprite("res/CloseNormal.png");
//		sp.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
//		this.addChild(sp);
		this._columnNodes = new Array();
		var columnNodeWidth = this.getContentSize().width/5;
		var columnNodeHeight = this.getContentSize().height;
		for (var i = 0; i < 5; i++) {
			var columnNode = new cc.w.view.SlotsColumnNode(columnNodeWidth,columnNodeHeight);
			columnNode.setPosition(columnNodeWidth*i, 0);
			this.addChild(columnNode);
			this._columnNodes.push(columnNode);
		}
	},
	onEnter:function(){
		this._super();
	},
	onExit:function(){
		this._super();
	}, 
});
/**
 * 老虎机的五个竖列中的一个，里面存放四个CELL组（SlotsCellGroup）
 */
cc.w.view.SlotsColumnNode = cc.Node.extend({
	ctor:function(size,height){
		this._super();
		this.setContentSize(size,height);
//		this.setAnchorPoint(0.5, 0.5);
		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
		layer.setContentSize(this.getContentSize());
		this.addChild(layer);
	},
});
/**
 * 老虎机的格子，一个格子显示一个图案，有一定的分数
 */
cc.w.view.SlotsCellNode = cc.Node.extend({
	ctor:function(size,height){
		this._super();
		this.setContentSize(size,height);
//		this.setAnchorPoint(0.5, 0.5);0
		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
		layer.setContentSize(this.getContentSize());
		this.addChild(layer);
	},
});
/**
 *格子组， 实现老虎机动画时的辅助组件，一个格子组里面有三个格子（SlotsCell）
 */
cc.w.view.SlotsCellGroupNode = cc.Node.extend({
	ctor:function(size,height){
		this._super();
		this.setContentSize(size,height);
//		this.setAnchorPoint(0.5, 0.5);0
		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
		layer.setContentSize(this.getContentSize());
		this.addChild(layer);
	},
	updateView:function(){
		
	}
});

cc.w.view.UsageLayerSlots = cc.w.view.UsageBaseLayer.extend({
	_className:"UsageLayerSlots",
	ctor:function(){
		this._super();
		this.setupView();
	},
	setupView:function(){
		this._super();
		var slotsNode = new cc.w.view.SlotsNode(cc.winSize.width,cc.winSize.height/2);
		slotsNode.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
		this.addChild(slotsNode);
	},
	onEnter:function(){
		this._super();
	},
});