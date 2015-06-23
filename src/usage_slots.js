cc.w.usage.UsageLayerSlots = cc.w.view.UsageBaseLayer.extend({
	_className:"UsageLayerSlots",
	_slotsNode:null,
	_slotsController:null,
	_testLayer:null,
	ctor:function(){
		this._super();
		this.setupView();
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
					new Notification(cc.w.slots.EVENT_START,0));
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