cc.w.usage.UsageLayerSlots = cc.w.view.UsageBaseLayer.extend({
	_className:"UsageLayerSlots",
	_slotsNode:null,
	_slotsController:null,
	_testLayer:null,
	ctor:function(){
		this._super();
		this.setupView();
		
		var size = cc.winSize;
//		var item = new cc.MenuItemFont("draw line", this.drawLine, this); 
//		item.attr({
//			x:size.width/2,
//			y:150
//		})
//		item.setFontSize(46);
//		item.setFontName("Times New Roman");
//		var menu = new cc.Menu(item);
//		menu.x = 0;
//		menu.y = 0;
//		this.addChild(menu);
		
//		var btn = new cc.ControlButton(
//				new cc.LabelTTF("中国", "Microsoft Yahei", 40)
//				,
//				new cc.Sprite("res/btn.png")
//				);//		btn.setAnchorPoint(0.5, 0.5);
		
		var btn = new ccui.Button("res/btn1.png");
		btn.attr({
//			label:new cc.LabelTTF("中国", "Microsoft Yahei", 30),
//			fontSize:40,
			x:size.width/2,
			y:150,
//			width:200,
//			height:80,
//			preferredSize:cc.size(800, 600),
		});
		this.addChild(btn);
//		btn.addTargetWithActionForControlEvents(this, this.drawLine, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
		btn.addTouchEventListener(function(target,event){
			if (event==ccui.Widget.TOUCH_ENDED) {
				this.drawLine();
			}
		}, this);
		btn.setTitleFontSize(18);
		btn.setTitleText("SHOW LINES");
//		var label = new cc.LabelTTF("中国", "Microsoft Yahei", 40);
//		label.attr({
//			x:size.width/2,
//			y:150,
//		});
//		this.addChild(label);
//		var node = new cc.Sprite("res/1.png");
//		node.attr({
//			x:size.width/2,
//			y:150,
//		});
//		this.addChild(node);
		
//		var action = cc.fadeOut(1.5);
//		btn.runAction(cc.repeat(cc.sequence(action,action.reverse()),-1));
		
//		var action = cc.fadeTo(2.5,150);
//		var action1 = cc.fadeTo(1.5,255);
//		btn.runAction(cc.repeat(cc.sequence(action,action1),-1));
		var actions = new Array();
		for (var i = 0; i < 24; i++) {
			var action = cc.tintTo(1.35, cc.random0To1()*205, cc.random0To1()*205, cc.random0To1()*205);
			actions.push(action);
		}
		btn.runAction(cc.repeat(cc.sequence(actions),-1));
	},
	_lineIndex:0,
	drawLine:function(){
		if (cc.w.slots.RESULT==null||cc.w.slots.RESULT.getLines()==null||cc.w.slots.RESULT.getLines().length==0) {
			return;
		}
		if (this._slotsNode!=null) {
			var lineSize = cc.w.slots.RESULT.getLines().length;
			ViewFacade.getInstance().notifyObserver(
					new Notification(cc.w.slots.mappingAction(cc.w.slots.EVENT_SHOW_LINE),this._lineIndex));
//			this._slotsNode.drawLine(this._lineIndex);
			this._lineIndex++;
			if (this._lineIndex>=lineSize) {
				this._lineIndex = 0;
			}
		}
	},
	setupView:function(){
// cc.log("UsageLayerSlots setupView");
		this._slotsNode = new cc.w.view.SlotsNode(cc.winSize.width/10*8,cc.winSize.height/3);
		this._slotsNode.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
		this.addChild(this._slotsNode);
		
		this._slotsController = new cc.w.slots.SlotsController();
		this._slotsController.init();
		
//		this._testLayer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
//		this._testLayer.setContentSize(this.getContentSize());
//		this.addChild(this._testLayer);
// var drawNode = new cc.DrawNode();
// var color = cc.color(255,255,255,255);
// var center = cc.p(this.getContentSize().width/2,
// this.getContentSize().height/2);
// var radius = this.getContentSize().width/5;
// drawNode.drawDot(center, radius, color)
// this.addChild(drawNode);

// var fontDef = new cc.FontDefinition();
// fontDef.fontName = "Arial";
// fontDef.fontSize = "60";
// var label = new cc.LabelTTF("wwwww",fontDef);
		this.addTouchEventListenser();
// setTimeout(fn, interval)
// cc.director.getScheduler().scheduleCallbackForTarget(this, function(){
// this.startAction();
// }, 5, false, 0, false);
	},
	onEnter:function(){
		this._super();
	},
	onExit:function(){
		this._super();
		this._slotsController.release();
	},
	startAction:function(){
		cc.log("state==================="+cc.w.slots.STATE);
		if (cc.w.slots.STATE==cc.w.slots.STATE_STOPED) {
			ViewFacade.getInstance().notifyObserver(
					new Notification(cc.w.slots.mappingAction(cc.w.slots.EVENT_START,0)));
		}else{
		}
	},
	_mZOrder:-10,
	addTouchEventListenser:function(){
		var touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			// When "swallow touches" is true, then returning 'true' from the
			// onTouchBegan method will "swallow" the touch event, preventing
			// other listeners from using it.
			swallowTouches: true,
			// onTouchBegan event callback function
			onTouchBegan: function (touch, event) { 
				var pos = touch.getLocation();
				var target = event.getCurrentTarget();  
				if ( cc.rectContainsPoint(target.getBoundingBox(),pos)) {
					target.startAction();
					
//					target._mZOrder*=-1;
//					target.reorderChild(target._testLayer, target._mZOrder)
					return true;
				}
				return false;
			},
		});
		cc.eventManager.addListener(touchListener,this);
	}
});