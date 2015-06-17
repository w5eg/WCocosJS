cc.w.view.UsageLayerSlots = cc.w.view.UsageBaseLayer.extend({
	_className:"UsageLayerSlots",
	_slotsNode:null,
	ctor:function(){
		this._super();
		this.setupView();
	},
	setupView:function(){
//		cc.log("UsageLayerSlots setupView");
		this._slotsNode = new cc.w.view.SlotsNode(cc.winSize.width/10*8,cc.winSize.height/3);
		this._slotsNode.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
		this.addChild(this._slotsNode);

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
		this.addTouchEventListenser();
//		setTimeout(fn, interval)
//		cc.director.getScheduler().scheduleCallbackForTarget(this, function(){
//		this.startAction();
//		}, 5, false, 0, false); 
	},
	onEnter:function(){
		this._super();
	},
	startAction:function(){
		cc.log("state==================="+cc.w.slots.STATE);
		if (cc.w.slots.STATE==cc.w.slots.STATE_STOPED) {
			cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_START);
		}else{
			cc.w.slots.RESULT = new cc.w.slots.Result();
			cc.w.slots.RESULT.setImages(
					"1,2,3,4,5,"+
					"6,7,8,9,10,"+
					"11,12,13,1,2"
			);
			cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_RESULT);
		}
	},
	addTouchEventListenser:function(){
		var touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			// When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
			swallowTouches: true,
			//onTouchBegan event callback function                      
			onTouchBegan: function (touch, event) { 
				var pos = touch.getLocation();
				var target = event.getCurrentTarget();  
				if ( cc.rectContainsPoint(target.getBoundingBox(),pos)) {
					target.startAction();
					return true;
				}
				return false;
			},
		});
		cc.eventManager.addListener(touchListener,this);
	}
});