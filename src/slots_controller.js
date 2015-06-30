/**
 * 用于把老虎机定义事件名称转换为游戏主控制器中定义的事件名称
 */
cc.w.slots.mappingAction = function(action){
	switch (action) {
	case cc.w.slots.EVENT_LINE_SHOWN:
		//TODO:change cc.w.slots.ACTION TO cc.s.NotificationName.NAME
		action = cc.w.slots.EVENT_LINE_SHOWN;
		break;
	default:
		break;
	}
	return action;
};

/**
 * 老虎机阶段控制器
 */
cc.w.slots.SlotsStageContorller = cc.Class.extend({
	_stage:cc.w.slots.STAGE,
	_slotsView:null,
	_betView:null,
    /**
     * @param slotsView 老虎机组件+老虎机控制器
     * @param betView 押注组件+奖池组件
     */
	init:function(slotsView,betView){
		this._slotsView = slotsView;
        this._betView = betView;
	},
	/**
	 * 更新阶段的方法，根据传入新的阶段值来执行相应的方法
	 * @param newValue
	 */
	updateState:function(newValue){
        if (this._stage==newValue){
            return;
        }
        if(this._slotsView==null||this._betView==null){
            return;
        }
        this._stage = newValue;
        cc.log("=====DO UPDATE [STAGE]>=====",this._stage);
        cc.w.slots.STAGE = this._stage;
		if (this._stage == cc.w.slots.SLOTS_STAGE_NORMAL) {
			this._slotsView.setVisible(true);
            this._betView.setVisible(false);
        }else{
            this._slotsView.setVisible(false);
            this._betView.setVisible(true);
		}
	}
});
/**
 * 免费次数控制器，主要用来做动画。会根据init()方法传来的两个按钮来设置界面（添加按钮下面的文本，和免费次数文本）
 */
cc.w.slots.SlotsFreeLoopContorller = cc.Class.extend({
	_isRunning:false,
    _minLoopBtn:null,
    _minLoopCostLabel:null,
    _minFreeLoopLabel:null,
    _maxLoopBtn:null,
    _maxLoopCostLabel:null,
    _maxFreeLoopLabel:null,
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
	init:function(minCost,maxCost,minLoopBtn,minLoopCostLabel,minFreeLoopLabel,maxLoopBtn,maxLoopCostLabel,maxFreeLoopLabel){
        this._minLoopBtn = minLoopBtn;
        this._minLoopCostLabel = minLoopCostLabel;
        this._minFreeLoopLabel = minFreeLoopLabel;
        this._maxLoopBtn = maxLoopBtn;
        this._maxLoopCostLabel = maxLoopCostLabel;
        this._maxFreeLoopLabel = maxFreeLoopLabel;
        this.updateView(0,0,minCost,maxCost);
	},
    /**
     * 执行免费次数动画
     * @param leftTime 剩余免费次数
     */
	doFreeLoop:function(leftTime){
		if (this._isRunning) {
			return;
		}
		this._isRunning = true;
		cc.log("=====DO FreeLoop=====",leftTime);
        //leftTime--;
        this.updateView();
        //TEST
        //播放动画并在结束后执行广播
		cc.director.getScheduler().scheduleCallbackForTarget(this, function(){
			this._isRunning = false;
			cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_ON_FREE_LOOP_FINISHED);
		}, 2, 0, 0, false);
		//END TEST
	},
    /**
     * 更新界面，在第一次得到免费次数时需要调用来显示得到的免费次数，
     * 然后中心控制器会根据当前的状态是否为STATE_FREE_LOOP
     * 来决定是否调用doFreeLoop()方法
     * @param leftTime 剩余免费次数
     * @param loopLines 攻击方式，两种
     * @param minCost 普通攻击花费
     * @param maxCost 强攻花费
     */
    updateView:function(leftTime,loopLines,minCost,maxCost){
        if(this._minLoopBtn&&this._minLoopCostLabel&&this._minFreeLoopLabel
            &&this._maxLoopBtn&&this._maxLoopCostLabel&&this._maxFreeLoopLabel){
            if(loopLines == cc.w.slots.SLOTS_LOOP_LINES_MIN){
                if(leftTime==0){
                    this._minFreeLoopLabel.setVisible(false);
                    this._minLoopBtn.setVisible(true);
                    this._minLoopCostLabel.setVisible(true);
                }else{
                    this._minFreeLoopLabel.setVisible(true);
                    this._minFreeLoopLabel.setString(""+leftTime);
                    this._minLoopBtn.setVisible(false);
                    this._minLoopCostLabel.setVisible(false);
                }
                this._maxLoopBtn.setVisible(true);
                this._maxLoopCostLabel.setVisible(true);
                this._maxFreeLoopLabel.setVisible(false);
            }else {
                if (leftTime == 0) {
                    this._maxFreeLoopLabel.setVisible(false);
                    this._maxLoopBtn.setVisible(true);
                    this._maxLoopCostLabel.setVisible(true);
                } else {
                    this._maxFreeLoopLabel.setVisible(true);
                    this._maxFreeLoopLabel.setString("" + leftTime);
                    this._maxLoopBtn.setVisible(false);
                    this._maxLoopCostLabel.setVisible(false);
                }
                this._minLoopBtn.setVisible(true);
                this._minLoopCostLabel.setVisible(true);
                this._minFreeLoopLabel.setVisible(false);
            }
            this._minLoopCostLabel.setString(""+minCost);
            this._maxLoopCostLabel.setString(""+maxCost);
        }
    }
});
/**
 * 押注机控制器，可以押两个结果，并可以设置三种倍率，并有一个奖池
 * 使用时通过调用 init()方法来传入相关组件。
 * 按钮器为每个按钮提供的点击回调方法。需要在使用都为每个按钮添加对应的回调方法
 */
cc.w.slots.BetNode = {};
cc.w.slots.BetNode.STATE_STOPED = 0;
cc.w.slots.BetNode.STATE_RUNNING = 1;
cc.w.slots.BetNodeController = cc.Class.extend({
	_betData:null,
	_state:cc.w.slots.BetNode.STATE_STOPED,
	_multipleIndex:-1,
	_betBtn1:null,//
	_betBtn2:null,//
	_multipleCBs:null,//倍数选项CHECKBOX组件数组
	_costLabel1:null,
	_costLabel2:null,
	_pondLabel:null,
	release:function(){
	},
	init:function(betData,betBtn1,betBtn2,multipleCBs,costLabel1,costLabel2,pondLabel){
		this._betData = betData;
		this._betBtn1 = betBtn1;
		this._betBtn2 = betBtn2;
		this._multipleCBs = multipleCBs;
		this._costLabel1 = costLabel1;
		this._costLabel2 = costLabel2;
		this._pondLabel = pondLabel;
		this.updateView(betData);
	},
	updateView:function(betData){
		if (betData==null){
			return;
		}
        if(this._costLabel1!=null&&this._costLabel2!=null){
            var multiple = 1;
            if (this._multipleIndex<betData.multiples.length) {
                multiple = betData.multiples[this._multipleIndex];
            }
            var costStr = (betData.cost*multiple)+"";
            this._costLabel1.setString(costStr);
            this._costLabel2.setString(costStr);
        }
        if(this._pondLabel!=null){
            this._pondLabel.setString(betData.pond+"");
        }
        if(this._multipleCBs!=null&&this._multipleCBs.length==betData.multiples.length){
            for(var i=0; i<this._multipleCBs.length; i++){
                var cb = this._multipleCBs[i];
                if(cb.muTxt)cb.muTxt.setString(""+this._betData.multiples[i]);//*注意：这里的muTxt是在FLAX资源中定义的
            }
            this.doChooseMultiple(this._multipleCBs[0]);
        }
	},
	onResult:function(betData){
		this._state = cc.w.slots.BetNode.STATE_STOPED;
		this.updateView(betData);
	},
	doBet:function(view){
		if (this._state==cc.w.slots.BetNode.STATE_RUNNING) {
			return false;
		}
		if (this._betData==null) {
			return false;
		}
		if (this._betBtn1==null||this._betBtn2==null) {
			return false;
		}
		//现在我们有两个按钮
		var value = 0;
		if (view === this._betBtn2) {
			value = 1;
		}
		cc.log("=====DO BET=====",value);
		var multiple = 1;
		if (this._multipleIndex<this._betData.multiples.length) {
			multiple = this._betData.multiples[this._multipleIndex];
		}
		cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_BET_DONE,{"choice":value,"multiple":multiple});
		this._state = cc.w.slots.BetNode.STATE_RUNNING;
		return true;
	},
	doChooseMultiple:function(view){
		if (this._state==cc.w.slots.BetNode.STATE_RUNNING) {
			return;
		}
		if (this._betData==null) {
			return false;
		}
		if (this._multipleCBs==null) {
			return false;
		}
		
		//现在我们有三个倍数按钮setSelected
		var index = this._multipleCBs.indexOf(view);
		if (index==-1) {
			return false;
		}
		//if (index==this._multipleIndex) {//因为FLAX生成的组件的状态不问题。所以这里注释掉来保证逻辑正常
		//	return false;
		//}
		this._multipleIndex = index;
		for (var i = 0; i < this._multipleCBs.length; i++) {
			var cb = this._multipleCBs[i];
			if (cb == view) {
				if(cb.setSelected){
                    cb.setSelected(true);
                    cb.enabled = false;
                }
			}else{
				if(cb.setSelected){
                    cb.setSelected(false);
                    cb.enabled = true;
                }
//				cb.runAction(cc.blink(2, 2));//TEST
			}
		}
		cc.log("=====DO ChooseMultiple=====",index);
	},
});
/**
 * 老虎机状态控制器,关联老虎机相关组件，并进行统一管理：统一的事件处理与转发
 * 用于处理:老虎机大部分操作，如下,
 * 老虎机和押注模式的切换处理，涉及组件有 SlotsNode,SlotsControl,BetNode,
 */
cc.w.slots.SlotsController = cc.Class.extend({
	initialized:false,
	_betNodeController:null,
	_slotsFreeLoopController:null,
    _slotsStageController:null,
	_actions:[
	          cc.w.slots.EVENT_START,
	          cc.w.slots.EVENT_SHOW_LINE,
	          cc.w.slots.EVENT_DO_SPECIAL_EFFECT,
              cc.w.slots.EVENT_STAGE_CHANGED,
	          cc.w.slots.EVENT_RESULT
	          ],
	addBetNodeController:function(betNodeController){
		this._betNodeController = betNodeController;
	},
	addSlotsFreeLoopController:function(slotsFreeLoopController){
		this._slotsFreeLoopController = slotsFreeLoopController;
	},
	addSlotsStageController:function(slotsStageController){
		this._slotsStageController = slotsStageController;
	},
	init:function(){
		if (this.initialized) {
			return;
		}
		this.initialized = true;
		for (var i = 0; i < this._actions.length; i++) {
			var action = this._actions[i];
			ViewFacade.getInstance().addObserver(action, this);
		}
		
		//增加停止事件转发
		this.addCustomEventListener(cc.w.slots.EVENT_STOPPED,null);
		//增加画线完成事件转发
		this.addCustomEventListener(cc.w.slots.EVENT_LINE_SHOWN,null);
		this.addCustomEventListener(cc.w.slots.EVENT_ON_FREE_LOOP_FINISHED,null);
		this.addCustomEventListener(cc.w.slots.EVENT_BET_DONE,null);
	},
	addCustomEventListener:function(eventName,callback){
		cc.eventManager.addCustomListener(eventName, function(event){ 
			if (event!=null) {
//				var target = event.getCurrentTarget();
				var data = event.getUserData();
				ViewFacade.getInstance().notifyObserver(
						new Notification(cc.w.slots.mappingAction(eventName),data));
				if (callback!=null) {
					callback.call(this,event);
				}
			}
		});
	},
	release:function(){
		for (var i = 0; i < this._actions.length; i++) {
			var action = this._actions[i];
			ViewFacade.getInstance().removeObserver(action, this);
		}
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_STOPPED);
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_LINE_SHOWN);
	},
	handleNotification: function(notification){
		var notificationName = notification.notificationName;
		var data = notification.notificationData;
		switch (notificationName){
		case cc.w.slots.EVENT_START:
			this.start();
			break;
		case cc.w.slots.EVENT_SHOW_LINE:
            cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_SHOW_LINE,data);
			break;
		case cc.w.slots.EVENT_STAGE_CHANGED:
            //cc.log("=====EVENT_STAGE_CHANGED====="+data);
            if(this._slotsStageController){
                this._slotsStageController.updateState(data);
            }
			break;
		case cc.w.slots.EVENT_DO_SPECIAL_EFFECT:
//			cc.log("=====START_FREE_LOOP====="+data);
            if(this._slotsFreeLoopController)
                this._slotsFreeLoopController.doFreeLoop(data);
			break;
		case cc.w.slots.EVENT_RESULT:
            if(cc.w.slots.RESULT){
                if (cc.w.slots.RESULT.stage == cc.w.slots.SLOTS_STAGE_BOSS&&this._betNodeController!=null) {
                    this._betNodeController.onResult(data);
                }
                if(!cc.w.slots.RESULT.isFreeLoopMode()&&cc.w.slots.RESULT.getFreeLoopTime()>0){
                    if(this._slotsFreeLoopController)
                        this._slotsFreeLoopController.updateView(cc.w.slots.RESULT.getFreeLoopTime());
                }
                cc.log("=====EVENT_RESULT====="+data);
            }
			break;
		}
	},
	start:function(data){
		this.getResult();
        cc.log(cc.w.slots.STAGE);
		if (cc.w.slots.STAGE == cc.w.slots.SLOTS_STAGE_NORMAL&&cc.w.slots.STATE==cc.w.slots.STATE_STOPED) {
			cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_START);
		}
	},
	getResult:function(){
		// TODO 开始运动的同时，从后台请求结果
		// TEST
		this.testResult();
		// END TEST
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
			var linesData = //线数据，用“:”分隔为两部分，前部分为图标数据，后部分为星级数据
				[
				 "0,1,7,13,14:3",
				 "0,6,2,13,14:3",
				 "0,1,2,3,4:3",
				 "5,6,7,8,9:3",
				 "10,11,12,13,14:3",
				 "5,11,7,13,9:3"
				 ];
			var specialEffectsData =//特效数据，用“:”分隔为两部分，前部分为图标数据;后部分为星级数据，1表示免费次数，2表示加血
				[
				 "0,1,7,13,14:1",
				 "0,1,7,13,14:2"
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