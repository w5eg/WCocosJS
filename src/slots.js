cc.w.slots = {};

//老虎机状态
cc.w.slots.STATE_STOPED = 0;//表示静止
cc.w.slots.STATE_RUNNING = 1;//表示运行
cc.w.slots.STATE = cc.w.slots.STATE_STOPED;
//测试模式
cc.w.slots.MODE_DEBUG = false;//
cc.w.slots.MODE_DEBUG_SPEED = false;//
cc.w.slots.MODE_DEBUG_SlotsCellGroupNode = false;//
cc.w.slots.MODE_DEBUG_SlotsColumnNode = false;//
//老虎机结果
cc.w.slots.RESULT = null;//用于保存游戏结果数据，每次运行前会清除
cc.w.slots.CYCLE_COUNT_MIN = 3;//最少要完成循滚动的次数
cc.w.slots.CYCLE_COUNT = 0;//当前（第一列）循环滚动的次数（后面的列也要完成同样次数才能停止）
cc.w.slots.EVENT_START = "cc.w.slots.EVENT_START";//老虎机执行运行事件
cc.w.slots.EVENT_CYCLED = "cc.w.slots.EVENT_CYCLED";//老虎机运行一个循环事件
cc.w.slots.EVENT_RESULT = "cc.w.slots.EVENT_RESULT";//通知老虎机已经有结果，这时机器会自动判断并停止
cc.w.slots.EVENT_STOPED = "cc.w.slots.EVENT_STOPED";//老虎机停止事件(所有列表都停止后调用)
//动画
cc.w.slots.actionStart = function(){
//	var bounceDistance = 50;
//	var bounceAction = cc.moveBy(2, cc.p(0, bounceDistance)).easing(cc.easeBackIn());
	var duration = cc.w.slots.MODE_DEBUG_SPEED?0.5+5:0.5;
	var bounceAction2 = cc.moveBy(duration, cc.p(0, -cc.w.slots.GROUP_NODE_HEIGHT)).easing(cc.easeBackIn());
//	var seq = cc.sequence(bounceAction2)
//	return seq;
	return bounceAction2;
};//开始运动动画
cc.w.slots.actionStop = function(){
	var duration = cc.w.slots.MODE_DEBUG_SPEED?0.5+5:0.5;
	return cc.moveBy(duration, cc.p(0, -cc.w.slots.GROUP_NODE_HEIGHT)).easing(cc.easeBackOut());
};//停止运动动画
cc.w.slots.actionConstant = function(){
	var duration = cc.w.slots.MODE_DEBUG_SPEED?0.2+1:0.2;
	return cc.moveBy(duration, cc.p(0, -cc.w.slots.GROUP_NODE_HEIGHT));
};//匀速运动动画
cc.w.slots.GROUP_NODE_HEIGHT = 0;
cc.w.slots.COLUMN_COUNT = 5;
cc.w.slots.slotsColumnNodes = null;
/////////////////////////////////////////////////////////////////////////////////////
/**
 * 老虎机一个CELL中的数据对象
 */
cc.w.slots.SlotCell = cc.Class.extend({
	
});
/**
 * 老虎机结果对象
 */
cc.w.slots.Result = cc.Class.extend({
	_images:null,//结果图标集合，目前一共15个位置，共13种图片，ID为1-13
	_lineAnimation:"0",//目前有25条线，"0"表示没有，当有动画时的数据为:线数据+连续数量，例如"x,x,x,x,x:3",前5个数字表线的位置，最后一个数字表示连了几个图标，
	_bigAnimation:0,//大动画，根据当前得分倍数来处理，分6个阶段0为无动画1-5有不同的动画
	_specialEffect:0,//0表示没有，1表示免费次数，2表示加血
	setImages:function(images){
		this._images = images;
	},
	getImages:function(){
		return this._images;
	}
});

/////////////////////////////////////////////////////////////////////////////////////
/**
 * 老虎机的格子，一个格子显示一个图案，有一定的分数
 */
cc.w.view.SlotsCellNode = cc.Node.extend({
	_imageSprite:null,
	_clippingNode:null,
	ctor:function(size,height){
		this._super();
		this.setContentSize(size,height);
//		this.setAnchorPoint(0.5, 0.5);0
//		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
//		layer.setContentSize(this.getContentSize());
//		this.addChild(layer);
		this.setupView(size, height);
	},
	setupView:function(size, height){
		this._clippingNode = new cc.ClippingNode(this.createRectStencil(size, height));
		this._clippingNode.setInverted(false);
		this.addChild(this._clippingNode);
		
		this._imageSprite = new cc.MenuItemSprite();
		this._imageSprite.setContentSize(this.getContentSize());
		this._clippingNode.addChild(this._imageSprite);
		this.setImage("res/icon_1.png");
	},
	setImage:function(path){
		var sp = new cc.Sprite(path);
		if (this.getContentSize().width<sp.getContentSize().width) {
			var scaleValue = this.getContentSize().width/sp.getContentSize().width;
			sp.setScale(scaleValue, scaleValue);
		}else{
			sp.setPosition(this.getContentSize().width/2-sp.getContentSize().width/2, this.getContentSize().height/2-sp.getContentSize().height/2);
		}
		this._imageSprite.setNormalImage(sp);
	},
	createRectStencil:function(size,height){
		//以四个点确定的形状作为模版。至少要三个点才能确定形状
		var stencil = new cc.DrawNode();
		var color = cc.color(255,255,255,255);
		//宽度传0好像还是会有宽度？
		stencil.drawRect(cc.p(0, 0), cc.p(size,height), color, 0.001, color);
		return stencil;
	},
});
/**
 *格子组， 实现老虎机动画时的辅助组件，一个格子组里面有三个格子（SlotsCell）
 */
cc.w.view.SlotsCellGroupNode = cc.Node.extend({
	_cellNodeTop:null,
	_cellNodeCenter:null,
	_cellNodeBottom:null,
//	_isLeader:false,//是否是头
	ctor:function(size,height){
		this._super();
		this.setContentSize(size,height);
		cc.w.slots.GROUP_NODE_HEIGHT = height;
//		this.setAnchorPoint(0.5, 0.5);0
//		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
//		layer.setOpacity(30);
//		layer.setContentSize(this.getContentSize());
//		this.addChild(layer);
		
		this.setupView();
	},
//	setLeader:function(isLeader){
//		this._isLeader = isLeader;
//	},
//	isLeader:function(){
//		return this._isLeader;
//	},
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
		var fs = 10;
		for (var i = 0; i < cellCount; i++) {
			var cellNode = new cc.w.view.SlotsCellNode(cellWidth,cellHeight);
			cellNode.setPosition(0, cellHeight*i)
			if (i==2) {
				this._cellNodeTop = cellNode;
				if (cc.w.slots.MODE_DEBUG_SlotsCellGroupNode) {
					var label = new cc.LabelTTF("TOP","Arial",fs);
					label.setTag(1001);
					label.setColor(cc.color(255, 255, 0, 255));
					label.setPosition(cellWidth/2, cellHeight/2);
					cellNode.addChild(label);
				}
			}
			if (i==1) {
				this._cellNodeCenter = cellNode;
				if (cc.w.slots.MODE_DEBUG_SlotsCellGroupNode) {
					var label = new cc.LabelTTF("CENTER","Arial",fs);
					label.setTag(1002);
					label.setColor(cc.color(255, 255, 0, 255));
					label.setPosition(cellWidth/2, cellHeight/2);
					cellNode.addChild(label);
				}
			}
			if (i==0) {
				this._cellNodeBottom = cellNode;
				if (cc.w.slots.MODE_DEBUG_SlotsCellGroupNode) {
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
	updateView:function(){
		if (cc.w.slots.RESULT==null) {
			return;
		}
		this._cellNodeTop.setImage("res/icon_1.png");
		this._cellNodeCenter.setImage("res/icon_2.png");
		this._cellNodeBottom.setImage("res/icon_3.png");
	},
	reset:function(){
//		this._cellNodeTop.setVisible(true);
//		this._cellNodeCenter.setVisible(true);
//		this._cellNodeBottom.setVisible(true);
	}
});

/**
 * 老虎机的五个竖列中的一个，里面存放四个CELL组（SlotsCellGroupNode）
 */
cc.w.view.SlotsColumnNode = cc.Node.extend({
	_groups:null,
	_headGroup:null,
	_commonGroups:null,
	_clippingNode:null,
	_groupHeight:0,
	_state:0,
	_result:null,
	_isFirstCol:false,
	_index:0,
	ctor:function(size,height){
		this._super();
		this.setContentSize(size,height);
		this._clippingNode = new cc.ClippingNode(this.createRectStencil(size, height));
//		this.setStencil();
		this._clippingNode.setInverted(false);
		this.addChild(this._clippingNode);
//		this.setAnchorPoint(0.5, 0.5);
//		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
//		layer.setContentSize(this.getContentSize());
//		this.addClipedChild(layer);
		this.setupView();
	},
	setupView:function(){
		this.reset();
		this._groups = new Array();
		this._commonGroups = new Array();
		//第一列有四个组。
		var groupCount = 4;
		var groupWidth = this.getContentSize().width;
		var groupHeight = this.getContentSize().height;
		this._groupHeight = groupHeight;
		for (var i = 0; i < groupCount; i++) {
			Array.prototype.map;
			var group = new cc.w.view.SlotsCellGroupNode(groupWidth,groupHeight);
			if (i==0) {
//				group.setLeader(true);
				this._headGroup = group;
			}else{
//				group.setLeader(false);
				this._commonGroups.push(group);
			}
			
//			group.setOpacity(5);
			group.setPosition(0, this.getContentSize().height*2-i*groupHeight);
			this.addClipedChild(group);
			if (cc.w.slots.MODE_DEBUG_SlotsColumnNode) {
				var label = new cc.LabelTTF("Group"+i,"Arial",30);
				label.setTag(1003);
				label.setColor(cc.color(0, 255, 0, 255));
				label.setPosition(groupWidth/2, groupHeight/2);
				group.addChild(label);
			}
			this._groups.push(group);
		}
	},
	updateView:function(){
		this._commonGroups[0].updateView();
	},
	addClipedChild:function(child){
		if (cc.w.slots.MODE_DEBUG) {
			this.addChild(child);
		}else{
			this._clippingNode.addChild(child);
		}
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
		this._cycleCount = 0;
		this._result = null;
		this._state = cc.w.slots.STATE_STOPED;
	},
	resetCells:function(){
		if(this._commonGroups!=null)this._commonGroups[1].reset();
	},
	start:function(){
		//TODO 根据当前状态和是否有结果来判断是否执行动画
		if (this._state == cc.w.slots.STATE_RUNNING&&this._result!=null) {
			if (this.getIndex()==cc.w.slots.COLUMN_COUNT-1) {//
				cc.log("sssssssssssssssssssssssssssssssssssssssss");
				cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_STOPED);
			}
			return;
		}
		if (cc.w.slots.CYCLE_COUNT!=0&&this._cycleCount>=cc.w.slots.CYCLE_COUNT) {
			this._result = this;
		}
		if (cc.w.slots.CYCLE_COUNT==0&&cc.w.slots.RESULT!=null&&this.isFirstCol()&&this._cycleCount>=cc.w.slots.CYCLE_COUNT_MIN) {
			cc.w.slots.CYCLE_COUNT = this._cycleCount;
			this._result = cc.w.slots.RESULT;
		}
//		cc.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"+cc.w.slots.STATE);
		this.ajust();
		for (var i = 0; i < this._groups.length; i++) {
			var group = this._groups[i];
			var action ;
			if(this._state == cc.w.slots.STATE_STOPED){
				action = cc.w.slots.actionStart();
			}else{
				if (this._result==null) {
					action = cc.w.slots.actionConstant();
				}else{
					action = cc.w.slots.actionStop();
					this.updateView();
				}
			}
			if (group === this._headGroup) {
//				cc.log("group isLeader");
				var callback = cc.callFunc(this.onCycled, this);
				var seq = cc.sequence(action,callback);
				group.runAction(seq);
			}else{ 
//				cc.log("group is not Leader");
				group.runAction(action);
			}
		}
	},
	stop:function(){
		//强制停止动画，恢复到初始状态
		this.reset();
	},
	/**
	 * 因为动画使用的是moveBy,所以第一个循环做一次位置校正
	 */
	ajust:function(){
		for (var i = 0; i < this._commonGroups.length; i++) {
			var group = this._commonGroups[i];
			group.setPosition(0, this.getContentSize().height-i*this._groupHeight);
		}
	},
	_cycleCount:0,
	onCycled:function(){
		this._cycleCount+=1;
		if(this.isFirstCol())cc.log("=========onCycled========="+this._cycleCount);
		if (this._state == cc.w.slots.STATE_STOPED) {
			this._state = cc.w.slots.STATE_RUNNING;
		}
		cc.w.slots.STATE = this._state;
		cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_CYCLED);
		var oldHeaderGroup = this._headGroup;
//		oldHeaderGroup.setLeader(false);
		this._headGroup = this._commonGroups.pop();
//		this._headGroup.setLeader(false);
		this._commonGroups.reverse();
		this._commonGroups.push(oldHeaderGroup);
		this._commonGroups.reverse();
		this._headGroup.setPosition(0, this.getContentSize().height*2-0*this._groupHeight);
		this.start();
	},
	setFirstCol:function(isFirstCol){
		this._isFirstCol = isFirstCol;
	},
	isFirstCol:function(){
		return this._isFirstCol;
	},
	getIndex:function(){
		return this._index;
	},
	setIndex:function(index){
		this._index = index;
	}
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
		this.setupView();
	},
	setupView:function(){
		//init the actions //cc.delayTime(5);
//		this.ignoreAnchorPointForPosition(false);
//		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
//		layer.setContentSize(this.getContentSize());
//		this.addChild(layer);
//		var sp = new cc.Sprite("res/CloseNormal.png");
//		sp.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
//		this.addChild(sp);
		this._columnNodes = new Array();
		var columnNodeWidth = this.getContentSize().width/5;
		var columnNodeHeight = this.getContentSize().height;
		for (var i = 0; i < cc.w.slots.COLUMN_COUNT; i++) {
			var columnNode = new cc.w.view.SlotsColumnNode(columnNodeWidth,columnNodeHeight);
			if (i==0) {
				columnNode.setFirstCol(true);
			}
			columnNode.setIndex(i);
			columnNode.setPosition(columnNodeWidth*i, 0);
			this.addChild(columnNode);
			this._columnNodes.push(columnNode);
			if (cc.w.slots.MODE_DEBUG) {
				var label = new cc.LabelTTF(""+i,"Arial",50);
				label.setColor(cc.color(255, 0, 0, 255));
				label.setPosition(columnNodeWidth/2, columnNodeHeight/2);
				columnNode.addChild(label);
			}
		}
//		cc.eventManager.addCustomListener(cc.w.slots.EVENT_CYCLED, function(event){ 
//			if(event!=null){
//				cc.log("cc.w.slots.EVENT_CYCLED!");
//			}
//		});
		cc.eventManager.addCustomListener(cc.w.slots.EVENT_RESULT, function(event){ 
			if(event!=null){
				cc.w.slots.RESULT = this;
			}
		});
//		cc.eventManager.addCustomListener(cc.w.slots.EVENT_STOPED, this.reset);
//		cc.eventManager.addCustomListener(cc.w.slots.EVENT_STOPED, function(event){ 
//			if(event!=null){
//				cc.log(this);
//			}
//		});
		var event_stoped = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			eventName: cc.w.slots.EVENT_STOPED,
			callback: function(event){
				if (event!=null) {
					var target = event.getCurrentTarget();
					target.reset();
				}
			}
		});    
		cc.eventManager.addListener(event_stoped, this);
		var event_start = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			eventName: cc.w.slots.EVENT_START,
			callback: function(event){
				if (event!=null) {
					var target = event.getCurrentTarget();
					target.start();
				}
			}
		});    
		cc.eventManager.addListener(event_start, this);
		this.reset();
	},
	reset:function(){
		cc.w.slots.STATE = cc.w.slots.STATE_STOPED;
		cc.w.slots.RESULT = null;
		for (var i = 0; i < this._columnNodes.length; i++) {
			var columnNode = this._columnNodes[i];
			columnNode.reset();
		}
	},
	resetCells:function(){
		for (var i = 0; i < this._columnNodes.length; i++) {
			var columnNode = this._columnNodes[i];
			columnNode.resetCells();
		}
	},
	start:function(){
//		this.reset();
		this.resetCells();
		cc.w.slots.CYCLE_COUNT = 0;
		cc.w.slots.STATE = cc.w.slots.STATE_RUNNING;
		var delay = -0.5;
		for (var i = 0; i < this._columnNodes.length; i++) {
//			delay += 0.5;
			delay = i*0.2;
			var delayTime = cc.delayTime(delay);
			var callFunc = cc.callFunc(function(sender,data){
				this._columnNodes[data].start();
			},this,i);
			var seq = cc.sequence(delayTime,callFunc)
			this.runAction(seq);
		}
//			this._columnNodes[4].start(); 
//		this.scheduleOnce(function() {
//			cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_RESULT);
//		}, 3);
	},
	stop:function(){
		for ( var colNode in this._columnNodes) {
			colNode.stop();
		}
	},
	onEnter:function(){
		this._super();
//		this.start();
//		this.scheduleOnce(function() {
//			this.start();
//		}, 3+1+2);
	},
	onExit:function(){
		this._super();
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_CYCLED);
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_START);
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_STOPED);
	}
});
/////////////////////////////////////////////////////////////////////////////////////