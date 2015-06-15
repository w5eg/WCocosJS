cc.w.slots = cc.w.slots||{};
cc.w.slots.SlotCell = {
		
};
/**
 * 老虎机结果对象
 */
cc.w.slots.Result = {
		
};
//老虎机状态
cc.w.slots.STATE_STOPED = 0;
cc.w.slots.STATE_RUNNING = 1;
cc.w.slots.STATE = cc.w.slots.STATE_STOPED;//0表示静止，1表示运行（当 STATE==0&&RESULT==NULL表示开始运行，STATE==0&&RESULT!=null表示结束运行）
//老虎机结果
cc.w.slots.RESULT = null;//
cc.w.slots.EVENT_CYCLED = "cc.w.slots.EVENT_CYCLED";//老虎机运行一个循环事件
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
	_cellNodeTop:null,
	_cellNodeCenter:null,
	_cellNodeBottom:null,
	_isLeader:false,//是否是头
	_testMode:true,
	ctor:function(size,height){
		this._super();
		this.setContentSize(size,height);
//		this.setAnchorPoint(0.5, 0.5);0
		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
//		layer.setOpacity(30);
		layer.setContentSize(this.getContentSize());
		this.addChild(layer);
		
		this.setupView();
	},
	setLeader:function(isLeader){
		this._isLeader = isLeader;
	},
//	setOpacity:function(newValue){
//		this._super(newValue);
//		for ( var c in this.getChildren()) {
//			c.setOpacity(newValue);
//		}
//	},
	setupView:function(){
		var cellCount = 3;
		var cellWidth = this.getContentSize().width;
		var cellHeight = this.getContentSize().height/cellCount;
		var fs = 5;
		for (var i = 0; i < cellCount; i++) {
			var cellNode = new cc.w.view.SlotsCellNode(cellWidth,cellHeight);
			cellNode.setPosition(0, cellHeight*i)
			if (i==2) {
				this._cellNodeTop = cellNode;
				if (this._testMode) {
					var label = new cc.LabelTTF("TOP","Arial",fs);
					label.setTag(1001);
					label.setColor(cc.color(255, 255, 0, 255));
					label.setPosition(cellWidth/2, cellHeight/2);
					cellNode.addChild(label);
				}
			}
			if (i==1) {
				this._cellNodeCenter = cellNode;
				if (this._testMode) {
					var label = new cc.LabelTTF("CENTER","Arial",fs);
					label.setTag(1002);
					label.setColor(cc.color(255, 255, 0, 255));
					label.setPosition(cellWidth/2, cellHeight/2);
					cellNode.addChild(label);
				}
			}
			if (i==0) {
				this._cellNodeBottom = cellNode;
				if (this._testMode) {
					var label = new cc.LabelTTF("BOTTOM","Arial",fs);
					label.setTag(1003);
					label.setColor(cc.color(255, 255, 0, 255));
					label.setPosition(cellWidth/2, cellHeight/2);
					cellNode.addChild(label);
				}
			}
			this.addChild(cellNode);
		}
	},
	updateView:function(result){
		if (result==null) {
			return;
		}
	},
});

/**
 * 老虎机的五个竖列中的一个，里面存放四个CELL组（SlotsCellGroupNode）
 */
cc.w.view.SlotsColumnNode = cc.Node.extend({
	_testMode:true,
	_groups:null,
	_headGroup:null,
	_clippingNode:null,
	ctor:function(size,height){
		this._super();
		this.setContentSize(size,height);
		this._clippingNode = new cc.ClippingNode(this.createRectStencil(size, height));
//		this.setStencil();
		this._clippingNode.setInverted(false);
		this.addChild(this._clippingNode);
//		this.setAnchorPoint(0.5, 0.5);
		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
		layer.setContentSize(this.getContentSize());
		this.addClipedChild(layer);
		this.setupView();
	},
	setupView:function(){
		this._groups = new Array();
		//第一列有四个组。
		var groupCount = 4;
		var groupWidth = this.getContentSize().width;
		var groupHeight = this.getContentSize().height;
		for (var i = 0; i < groupCount; i++) {
			Array.prototype.map;
			var group = new cc.w.view.SlotsCellGroupNode(groupWidth,groupHeight);
			if (i==0) {
				group
			}
//			group.setOpacity(5);
			group.setPosition(0, this.getContentSize().height*2-i*groupHeight);
			this.addClipedChild(group);
			if (this._testMode) {
				var label = new cc.LabelTTF("Group"+i,"Arial",40);
				label.setTag(1003);
				label.setColor(cc.color(0, 255, 0, 255));
				label.setPosition(groupWidth/2, groupHeight/2);
				group.addChild(label);
			}
		}
	},
	updateView:function(){

	},
	addClipedChild:function(child){
//		this._clippingNode.addChild(child);
		this.addChild(child);
	},
	createRectStencil:function(size,height){
		//以四个点确定的形状作为模版。至少要三个点才能确定形状
		var stencil = new cc.DrawNode();
		var color = cc.color(255,255,255,255);
		//宽度传0好像还是会有宽度？
		stencil.drawRect(cc.p(0, 0), cc.p(size,height), color, 0.001, color);
//		var rectangle = [
//		cc.p(0, 0),
//		cc.p(this.getContentSize().width, 0),
//		cc.p(this.getContentSize().width, this.getContentSize().height),
//		cc.p(0, this.getContentSize().height)
//		];
//		stencil.drawPoly(rectangle, color, 0, color);
//		var center = cc.p(this.getContentSize().width/2, this.getContentSize().height/2);
//		var radius = this.getContentSize().width/2;
//		stencil.drawDot(center, radius, color) 
//		stencil.drawCircle(center, radius, 360, 360, false, 0, color);
		return stencil;
	},
	reset:function(){
		//设置数据为初始状态
	},
	start:function(){
		//TODO 根据当前状态和是否有结果来判断是否执行动画
		if (cc.w.slots.STATE == cc.w.slots.STATE_RUNNING) {
			return;
		}
		
	},
	stop:function(){
		//强制停止动画，恢复到初始状态
		this.reset();
	},
});

/**
 * 老虎机,由五个SlotsColumnNode组成
 */
//如果要做从左到右延时运行的效果，可以考虑是初始化SlotsColumnNode时加延时ACTION
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
			var label = new cc.LabelTTF(""+i,"Arial",50);
			label.setColor(cc.color(255, 0, 0, 255));
			label.setPosition(columnNodeWidth/2, columnNodeHeight/2);
			columnNode.addChild(label);
		}
		cc.eventManager.addCustomListener(cc.w.slots.EVENT_CYCLED, function(event){ 
			if(event!=null){
				cc.log("cc.w.slots.EVENT_CYCLED!");
			}
		});
	},
	/**
	 * 当一个SlotsColumnNode完成一次循环
	 */
	onCycled:function(){
		cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_CYCLED);
	},
	start:function(){
		for ( var colNode in this._columnNodes) {
			colNode.start();
		}
	},
	stop:function(){
		for ( var colNode in this._columnNodes) {
			colNode.stop();
		}
	},
	onEnter:function(){
		this._super();
	},
	onExit:function(){
		this._super();
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_CYCLED);
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
		var slotsNode = new cc.w.view.SlotsNode(cc.winSize.width/10*8,cc.winSize.height/6);
		slotsNode.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
		this.addChild(slotsNode);
		
//		var drawNode = new cc.DrawNode();
//		var color = cc.color(255,255,255,255);
//		var center = cc.p(this.getContentSize().width/2, this.getContentSize().height/2);
//		var radius = this.getContentSize().width/5;
//		drawNode.drawDot(center, radius, color) 
//		this.addChild(drawNode);
		
//		var fontDef = new cc.FontDefinition(); 
//		fontDef.fontName = "Arial"; 
//		fontDef.fontSize = "60"; 
//		var label = new cc.LabelTTF("wwwww",fontDef);
		
	},
	onEnter:function(){
		this._super();
	},
});