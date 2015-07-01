cc.w.usage.UsageLayerSlots = cc.w.view.UsageBaseLayer.extend({
	_className:"UsageLayerSlots",
	_slotsNode:null,
	_slotsController:null,
	_betNodeController:null,
	_testLayer:null,
	_actions:[
	          //TEST 下面添加的事件主要是为了测试使用者是否能够收到事件
	          cc.w.slots.EVENT_START,
	          cc.w.slots.EVENT_STOPPED,
	          cc.w.slots.EVENT_LINE_SHOWN,
	          cc.w.slots.EVENT_BET_DONE,
	          cc.w.slots.EVENT_ON_FREE_LOOP_FINISHED,
	          cc.w.slots.EVENT_AUTO_LOOP_MODE_CHANGED,
	],
	handleNotification: function(notification){
		var notificationName = notification.notificationName;
		var data = notification.notificationData;
		switch (notificationName){
		case cc.w.slots.EVENT_START:
			cc.log("=====[EVENT_START]====="+cc.w.slots.STAGE);
			break;
		case cc.w.slots.EVENT_LINE_SHOWN:
			cc.log("=====[EVENT_LINE_SHOWN]====="+data);
			break;
		case cc.w.slots.EVENT_BET_DONE:
			cc.log("=====[EVENT_BET_DONE]=====",data.choice,data.multiple);
			break;
		case cc.w.slots.EVENT_ON_FREE_LOOP_FINISHED:
			cc.log("=====[EVENT_ON_FREE_LOOP_FINISHED]=====");
			break;
		case cc.w.slots.EVENT_STOPPED:
			cc.log("=====[EVENT_STOPPED]=====");
			break;
		case cc.w.slots.EVENT_AUTO_LOOP_MODE_CHANGED:
			cc.log("=====[EVENT_AUTO_LOOP_MODE_CHANGED]====="+data);
			break;
		}
	},
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
//				);
//		btn.setAnchorPoint(0.5, 0.5);
		
		var btn = new ccui.Button("res/btn1.png");
		btn.setUserData({"target":this,"data":"123"});
		btn.attr({
//			label:new cc.LabelTTF("中国", "Microsoft Yahei", 30),
//			fontSize:40,
			x:size.width/2,
			y:150+90+30+10,
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
		if (cc.w.slots.RESULT==null||cc.w.slots.RESULT.getLines()==null) {
			return;
		}
        var lineSize = cc.w.slots.RESULT.getLines().length;
        ViewFacade.getInstance().notifyObserver(
                new Notification(cc.w.slots.mappingAction(cc.w.slots.EVENT_SHOW_LINE),this._lineIndex));
        this._lineIndex++;
        if (this._lineIndex>=lineSize) {
            this._lineIndex = 0;
        }
	},
	setupView:function(){

		this._slotsNode = new cc.w.view.SlotsNode(cc.winSize.width/10*8,cc.winSize.height/3);
		this._slotsNode.setPosition(this.getContentSize().width/2, this.getContentSize().height/2+100);
		this.addChild(this._slotsNode);

		//var btn = new ccui.Button();
		//btn.attr({
		//	x:50,
		//	y:50,
		//});
		//this.addChild(btn);
		//btn.setUserData({"target":this,"data":"data"});
		//btn.addTouchEventListener(function(view, event){
		//	if (event==ccui.Widget.TOUCH_ENDED&&callback) {
		//		var target = view.getUserData().target;
		//		var data = view.getUserData().data;
		//	}
		//}, this);
		//btn.setTitleText("WWWWW");

        this.createBtn(cc.p(60, 130+150), "res/btn_bf.png", "free",function(target,view,data){
            ViewFacade.getInstance().notifyObserver(
                new Notification(cc.w.slots.EVENT_DO_SPECIAL_EFFECT,10));
        });
        this.createBtn(cc.p(this.getContentSize().width-60, 130+150), "res/btn_bf.png", "STAGE",function(target,view,data){
            var stage = cc.w.slots.STAGE == cc.w.slots.SLOTS_STAGE_NORMAL?cc.w.slots.SLOTS_STAGE_BOSS:cc.w.slots.SLOTS_STAGE_NORMAL;
            ViewFacade.getInstance().notifyObserver(
                new Notification(cc.w.slots.EVENT_STAGE_CHANGED,stage));
        });


        var betBtn1 = this.createBtn(cc.p(60, 130+30), "res/btn_pink.png", "物理",function(target,view,data){
            this.doBet(target,view,data);
        });
//		var betBtn1 = flax.assetsManager.createDisplay("res/s.plist", "multiBtn",{parent: this, x:60, y:160});
//		flax.inputManager = new flax.InputManager();
//		flax.inputManager.addListener(betBtn1, this._betClick, InputType.click, this);
//		flax.inputManager.addListener(betBtn1, function(){
//			this.doBet(this, betBtn1, null)
//		}, InputType.click, this);
//		var betBtn1 = this.createBtn(cc.p(60, 130), "res/btn_pink.png", "1",betNodeController.betSelector());
        var betBtn2 = this.createBtn(cc.p(60+120, 130+30), "res/btn_pink.png", "魔法",function(target,view,data){
            this.doBet(target,view,data);
        });
        var multipleCBs = [];
        for (var i = 0; i < 3; i++) {
            multipleCBs.push(
                this.createBtn(cc.p(60+150+120+120*i, 130+30), "res/btn_blue.png", ""+new cc.w.slots.BetData().multiples[i],function(target,view,data){
                    this.doChooseMultiple(target,view,data);
                })
            );
        }
        var costLabel1,costLabel2,pondLabel;

        var slotsView = this._slotsNode,betView = betBtn1;

        //实例化对象，并调用init()方法
		this._slotsController = new cc.w.slots.SlotsController();
		this._slotsController.init();

        //添加免费次数控制器
        var freeLoopController  = new cc.w.slots.SlotsFreeLoopContorller();
        var minLoopBtn,minLoopCostLabel,minFreeLoopLabel,maxLoopBtn,maxLoopCostLabel,maxFreeLoopLabel;
        /**
         * @param minCost 普通攻击花费
         * @param maxCost 强攻花费
         * @param minLoopBtn 普通攻击按钮
         * @param minLoopCostLabel 普通攻击花费LABEL
         * @param minFreeLoopLabel 免费普通攻击剩余次数LABEL
         * @param maxLoopBtn 强攻按钮
         * @param maxLoopCostLabel 强攻花费LABEL
         * @param maxFreeLoopLabel 免费强攻剩余次数LABEL
         */
        freeLoopController.init(100,5000,minLoopCostLabel,minFreeLoopLabel,maxLoopBtn,maxLoopCostLabel,maxFreeLoopLabel);
        this._slotsController.addSlotsFreeLoopController(freeLoopController);

        //添加押注控制器
		this._betNodeController = new cc.w.slots.BetNodeController();
		var betData = new cc.w.slots.BetData();
		this._betNodeController.init(betData,betBtn1,betBtn2,multipleCBs,costLabel1,costLabel2,pondLabel);
		this._slotsController.addBetNodeController(this._betNodeController);

        //添加阶段切换控制器
        var stageController = new cc.w.slots.SlotsStageContorller();
		/**
		 * @param slotsView 老虎机组件+老虎机控制器
		 * @param betView 押注组件+奖池组件
		 */
        stageController.init(slotsView,betView);
        this._slotsController.addSlotsStageController(stageController);



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
		this.addTouchEventListener();
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
        //在对象回收前最好调用一下这个方法，内部主要做的事是移除事件监听
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
            this.testResult();
		}else{
		}
	},
	doBet:function(target,view,data){
		var result = this._betNodeController.doBet(view);
		if (result) {
			cc.log(target,view,data);
			this.testResult();
		}
	},
	doChooseMultiple:function(target,view,data){
		var result = this._betNodeController.doChooseMultiple(view);
		if (result) {
			cc.log(target,view,data);
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
    
    //_betClick:function(touch, event){
    //	var btn = event.currentTarget;
    //	this.doBet(this, btn, 0);
    //	cc.log("}}}}}}}}}}}}}}}}:"+btn.isSelected());
    //},
	
	_mZOrder:-10,
	addTouchEventListener:function(){
		var touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
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
			}
		});
		cc.eventManager.addListener(touchListener,this);
	},
    testResult:function(){
        cc.director.getScheduler().scheduleCallbackForTarget(this, function(){

            var minLoopCost = 100;//普通攻击花费
            var maxLoopCost = 5000;//强攻花费
            var betCost = 1000;//BOSS阶段的每次押注要花费的金额
            var betMultiples = "1,2,5";//BOSS阶段的押注倍数


            var stage = 1;//0,1,当前阶段，0为普通阶段，1为BOSS阶段
            var freeLoopTime = 0;//剩余免费次数
            var isFreeLoopMode = false;//是否是免费次数模式
            var isAutoLoopMode = false;//是否是自动执行模式
            var loopLines = 1;//压多少条线,只有两种，1是普通为1条线，-1是强攻，表示25条线(目前)

            var imagesData = //图标数据，用“,”分隔的图标ID
                "1,1,1,1,1,"+
                "2,2,2,2,2,"+
                "3,3,3,3,3";
            var linesData = //线数据，用“:”分隔为两部分，前部分为位置索引，从0-14，后部分为星级数据
                [
                    "0,1,2,3,4:5",
                    "5,6,7,8,9:5",
                    "10,11,12,13,14:5"
                ];
            var specialEffectsData =//特效数据，用“:”分隔为两部分，前部分为位置索引，从0-14;后部分为星级数据，1表示免费次数，2表示加血
                [
                    "0,1,7,13,14:1",
                    "5,11,7,13,9:2"
                ];

            var betPond = 0;//BOSS阶段时的奖池数据


            cc.w.slots.RESULT = new cc.w.slots.Result();
            cc.w.slots.RESULT.stage = stage;
            cc.w.slots.RESULT.setLoopData(minLoopCost,maxLoopCost);
            cc.w.slots.RESULT.setImagesData(imagesData);
            cc.w.slots.RESULT.setLinesData(linesData);
            cc.w.slots.RESULT.setSpecialEffectsData(specialEffectsData);
            cc.w.slots.RESULT.setBetData(betPond,betCost,betMultiples);
            cc.w.slots.RESULT.setFreeLoopData(isFreeLoopMode,freeLoopTime);

            //当真正请求数据时最后要调用这句来通知监听者们
            ViewFacade.getInstance().notifyObserver(
                new Notification(cc.w.slots.mappingAction(cc.w.slots.EVENT_RESULT),cc.w.slots.RESULT));
        }, 2, 0, 0, false);
    }
});


cc.w.UsageScene = cc.Scene.extend({
	_className:"WScene",
	ctor:function () {
		this._super();
		this.addChild(new cc.w.view.UsagesLayer());
	}
});