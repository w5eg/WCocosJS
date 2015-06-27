cc.w.usage.UsageLayerSlots = cc.w.view.UsageBaseLayer.extend({
	_className:"UsageLayerSlots",
	_slotsNode:null,
	_slotsController:null,
	_betNodeController:null,
	_testLayer:null,
	_actions:[
	          //TEST 下面添加的事件主要是为了测试使用者是否能够收到事件
	          cc.w.slots.EVENT_LINE_SHOWN,
	          cc.w.slots.EVENT_CHOSEN,
	          ],
	ctor:function(){
		this._super();
		
		for (var i = 0; i < this._actions.length; i++) {
			var action = this._actions[i];
			ViewFacade.getInstance().addObserver(action, this);
		}
		
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
		btn.setUserData({"target":this,"data":"123"});
		btn.attr({
//			label:new cc.LabelTTF("中国", "Microsoft Yahei", 30),
//			fontSize:40,
			x:size.width/2,
			y:150+90,
//			width:200,
//			height:80,
//			preferredSize:cc.size(800, 600),
		});
		this.addChild(btn);
//		btn.addTargetWithActionForControlEvents(this, this.drawLine, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
		btn.addTouchEventListener(function(view,event){
			var target = view.getUserData().target;
			var data = view.getUserData().data;
//			cc.log("|||||||||||||||||||"+data);
			if (event==ccui.Widget.TOUCH_ENDED) {
				view.getUserData().target.drawLine();
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
		
//		var actions = new Array();
//		for (var i = 0; i < 24; i++) {
//			var action = cc.tintTo(1.35, cc.random0To1()*205, cc.random0To1()*205, cc.random0To1()*205);
//			actions.push(action);
//		}
//		btn.runAction(cc.repeat(cc.sequence(actions),-1));
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
		this._betNodeController = new cc.w.slots.BetNodeController();
		
		var betData = new cc.w.slots.BetData();
		
		var betBtn1 = this.createBtn(cc.p(60, 130), "res/btn_pink.png", "1",function(target,view,data){
			this.doBet(target,view,data);
		});
//		var betBtn1 = this.createBtn(cc.p(60, 130), "res/btn_pink.png", "1",betNodeController.betSelector());
		var betBtn2 = this.createBtn(cc.p(60+120, 130), "res/btn_pink.png", "2",function(target,view,data){
			this.doBet(target,view,data);
		});
		//betData,betBtn1,betBtn2,multipleCBs,costLabel1,costLabel2,pondLabel
		this._betNodeController.init(betData,betBtn1,betBtn2);
		
		this._slotsController.addBetNodeController(this._betNodeController);
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
		for (var i = 0; i < this._actions.length; i++) {
			var action = this._actions[i];
			ViewFacade.getInstance().removeObserver(action, this);
		}
	},
	startAction:function(){
		cc.log("state==================="+cc.w.slots.STATE);
		if (cc.w.slots.STATE==cc.w.slots.STATE_STOPED) {
			ViewFacade.getInstance().notifyObserver(
					new Notification(cc.w.slots.mappingAction(cc.w.slots.EVENT_START,0)));
		}else{
		}
	},
	doBet:function(target,view,data){
		var result = this._betNodeController.doBet();
		if (result) {
			cc.log(target,view,data);
			this._slotsController.getResult();
		}
	},
	handleNotification: function(notification){
		var notificationName = notification.notificationName;
		var data = notification.notificationData;
		switch (notificationName){
		case cc.w.slots.EVENT_LINE_SHOWN:
			cc.log("=====EVENT_LINE_SHOWN====="+data);
			break;
		case cc.w.slots.EVENT_CHOSEN:
			cc.log("=====EVENT_CHOSEN=====",data.choice,data.multiple);
			break;
		}
	},
	
	createBtn:function(position,imagePath,title,callback){
    	var btn = new ccui.Button(imagePath);
    	btn.attr({
    		x:position.x,
    		y:position.y,
    	});
    	this.addChild(btn);
    	btn.setUserData({"target":this,"data":"data"});
    	btn.addTouchEventListener(function(view, event){
    		if (event==ccui.Widget.TOUCH_ENDED&&callback) {
    			var target = view.getUserData().target;
    			var data = view.getUserData().data;
    			callback.call(target,target,view,data);
    		}
    	}, this);
    	btn.setTitleFontSize(18);
    	btn.setTitleText(title);
    	return btn;
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
				return true;
			},
			onTouchEnded:function(touch, event){
				var pos = touch.getLocation();
				var target = event.getCurrentTarget(); 
//				cc.log(")))))))))))))))))))))"+event.getEventCode());
				if ( cc.rectContainsPoint(target.getBoundingBox(),pos)) {
					target.startAction();

//					target._mZOrder*=-1;
//					target.reorderChild(target._testLayer, target._mZOrder)
					return true;
				}
			},
		});
		cc.eventManager.addListener(touchListener,this);
	}
});