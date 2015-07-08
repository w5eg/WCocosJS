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
 * 老虎机阶段控制器,接收事件，不发送事件
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
 * 自动播放控制器 ,不接收事件，发送事件
 * TODO: 长按事件实现，发送事件
 */
cc.w.slots.SlotsAutoLoopContorller = cc.Class.extend({
	_isRunning:false,
	_minLoopBtn:null,
	_maxLoopBtn:null,
	/**
	 * @param minLoopBtn 普通攻击按钮
	 * @param maxLoopBtn 强攻按钮
	 */
	init:function(minLoopBtn,maxLoopBtn){
		this._minLoopBtn = minLoopBtn;
		this._maxLoopBtn = maxLoopBtn;
		this.updateView();
	},
	updateView:function(){
	}
});
cc.w.slots.SlotsBigAnimationController = cc.Class.extend({
    _parentNode:null,
    _position:null,
    ctor:function(parentNode,position){
        this._parentNode = parentNode;
        this._position = position;
    },
    doEffect:function(score,callBackOnAniOver,target){
        if(this._parentNode==null||this._position==null){
            //callBackOnAniOver.call(this,target);
            callBackOnAniOver();
            return;
        }
        cc.w.slots.doBigAnimation(score,this._parentNode,this._position.x,this._position.y,callBackOnAniOver,target);
    }
});
/**
 * 加血特效控制器,接收事件，发送事件
 */
cc.w.slots.SlotsBloodIncreaseEffectController = cc.Class.extend({
	_isRunning:false,
    _parentNode:null,
    _position:null,
    _slotsNode:null,
    /**
     * @param parentNode
     * @param position
     * @param {cc.w.slots.SlotsNode}slotsNode 因为要做图标动画，所以传入这个参数
     */
	init:function(parentNode,position,slotsNode){
        this._parentNode = parentNode;
        this._position = position;
        this._slotsNode = slotsNode;
	},
    /**
     * 执行加血特效动画
     * @param {cc.w.slots.SpecialEffect}specialEffect
     */
    doEffect:function(specialEffect){
        if (specialEffect==null||this._isRunning||this._parentNode==null||this._position==null||this._slotsNode==null) {
            cc.w.log.e("cc.w.slots.SlotsBloodIncreaseEffectController","doEffect params error");
            cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_ON_BLOOD_INCREASE_FINISHED);
            return;
        }
        this._isRunning = true;
        cc.log("=====DO BloodIncreaseEffect=====");
 
        //播放动画并在结束后执行广播
        if(specialEffect.linePointIndexes.length>0){
            for(var i=0;i<specialEffect.linePointIndexes.length;i++){
                var cellIdx = specialEffect.linePointIndexes[i];
                var cellNode = cc.w.slots.SLOTS_CELL_NODES[cellIdx];
                cellNode.doCellAnimation(this._slotsNode._linesNode);
            }
        }
        this._isRunning = false;
        cc.w.slots.doBloodAddAnimation(specialEffect.getLevel(),this._parentNode,this._position.x,this._position.y,function(view){
        	this._isRunning = false;
        	if(specialEffect.linePointIndexes.length>0){
        		for(var i=0;i<specialEffect.linePointIndexes.length;i++){
        			var cellIdx = specialEffect.linePointIndexes[i];
        			var cellNode = cc.w.slots.SLOTS_CELL_NODES[cellIdx];
        			cellNode.reset();
        		}
        	}
        	cc.director.getScheduler().scheduleCallbackForTarget(this, function(){
        		cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_ON_BLOOD_INCREASE_FINISHED);
        	}, 0.05, 0, 0, false);
        },this);
		
    }
});
/**
 * 免费次数控制器，用来做动画。,接收事件，发送事件
 */
cc.w.slots.SlotsFreeLoopContorller = cc.Class.extend({
	_isRunning:false,
    _minLoopBtn:null,
    _minLoopCostLabel:null,
    _minFreeLoopLabel:null,
    _maxLoopBtn:null,
    _maxLoopCostLabel:null,
    _maxFreeLoopLabel:null,
    
    _parentNode:null,
    _position:null,
    _slotsNode:null,
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
     * @param parentNode
     * @param position
     * @param {cc.w.slots.SlotsNode}slotsNode 因为要做图标动画，所以传入这个参数
     */
	initAnimation:function(parentNode,position,slotsNode){
		this._parentNode = parentNode;
		this._position = position;
		this._slotsNode = slotsNode;
	},
    /**
     * 执行免费次数动画
     * @param {Number}leftTime 剩余免费次数
     * @param {cc.w.slots.SpecialEffect}specialEffect
     */
	doFreeLoop:function(leftTime,specialEffect){
		if (specialEffect==null||this._isRunning||this._parentNode==null||this._position==null||this._slotsNode==null) {
			cc.w.log.e("cc.w.slots.SlotsFreeLoopContorller","doFreeLoop params error");
			cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_ON_FREE_LOOP_FINISHED);
			return;
		}
		this._isRunning = true;
		cc.log("=====DO FreeLoop=====",leftTime);
        this.updateView();
        
        //播放动画并在结束后执行广播
        if(specialEffect.linePointIndexes.length>0){
        	for(var i=0;i<specialEffect.linePointIndexes.length;i++){
        		var cellIdx = specialEffect.linePointIndexes[i];
        		var cellNode = cc.w.slots.SLOTS_CELL_NODES[cellIdx];
        		cellNode.doCellAnimation(this._slotsNode._linesNode);
        	}
        }
        this._isRunning = false;
        cc.w.slots.doFreeTimesAnimation(leftTime,this._parentNode,this._position.x,this._position.y,function(view){
        	this._isRunning = false;
        	if(specialEffect.linePointIndexes.length>0){
        		for(var i=0;i<specialEffect.linePointIndexes.length;i++){
        			var cellIdx = specialEffect.linePointIndexes[i];
        			var cellNode = cc.w.slots.SLOTS_CELL_NODES[cellIdx];
        			cellNode.reset();
        		}
        	}
        	cc.director.getScheduler().scheduleCallbackForTarget(this, function(){
        		cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_ON_FREE_LOOP_FINISHED);
        	}, 0.05, 0, 0, false);
        },this);
//        //TEST
//        //播放动画并在结束后执行广播
//		cc.director.getScheduler().scheduleCallbackForTarget(this, function(){
//			this._isRunning = false;
//			cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_ON_FREE_LOOP_FINISHED);
//		}, 2, 0, 0, false);
//		//END TEST
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
 * 押注机控制器，可以押两个结果，并可以设置三种倍率，并有一个奖池 ,不接收事件，发送事件
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
		if (betData==null||betData.multiples==null){
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
		this._betData = betData;
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
		if (index==this._multipleIndex) {//因为FLAX生成的组件的状态不问题。所以这里注释掉来保证逻辑正常,但现在又打开了，因为之前是通过按钮的selected属性来实现，现在通过修改帧来实现状态切换
			return false;
		}
		this._multipleIndex = index;
		for (var i = 0; i < this._multipleCBs.length; i++) {
			var cb = this._multipleCBs[i];
			if (cb == view) {
                if(cb.gotoAndPlay){
                    cb.gotoAndPlay("selected");
                }
                //if(cb.setSelected){
                //    cb.setSelected(true);
                //    cb.enabled = false;
                //}
			}else{
                if(cb.gotoAndPlay){
                    cb.gotoAndPlay("up");
                }
                //if(cb.setSelected){
                //    cb.setSelected(false);
                //    cb.enabled = true;
                //}
//				cb.runAction(cc.blink(2, 2));//TEST
			}
		}
		cc.log("=====DO ChooseMultiple=====",index);
	}
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
	_slotsBloodIncreaseEffectController:null,
    _slotsStageController:null,
    _slotsBigAnimationController:null,
	_actions:[
	          cc.w.slots.EVENT_START,
	          cc.w.slots.EVENT_SHOW_LINE,
	          cc.w.slots.EVENT_DO_SPECIAL_EFFECT,
              cc.w.slots.EVENT_STAGE_CHANGED,
              cc.w.slots.EVENT_INIT,
	          cc.w.slots.EVENT_RESULT
	          ],
	addBetNodeController:function(betNodeController){
		this._betNodeController = betNodeController;
	},
	addSlotsFreeLoopController:function(slotsFreeLoopController){
		this._slotsFreeLoopController = slotsFreeLoopController;
	},
	addSlotsBloodIncreaseEffectController:function(slotsBloodIncreaseEffectController){
		this._slotsBloodIncreaseEffectController = slotsBloodIncreaseEffectController;
	},
	addSlotsStageController:function(slotsStageController){
		this._slotsStageController = slotsStageController;
	},
    addSlotsBigAnimationController:function(slotsBigAnimationController){
        this._slotsBigAnimationController = slotsBigAnimationController;
    },
	ctor:function(){
		if (this.initialized) {
			return;
		}
		this.initialized = true;
		for (var i = 0; i < this._actions.length; i++) {
			var action = this._actions[i];
			ViewFacade.getInstance().addObserver(action, this);
		}
		
		//增加事件转发
		var target = this;
        this.addCustomEventListener(cc.w.slots.EVENT_SLOTS_STOPPED,function(){
        	if(cc.w.slots.RESULT&&cc.w.slots.RESULT.stage == cc.w.slots.SLOTS_STAGE_NORMAL){
        		if(target._slotsBigAnimationController){
        			cc.log("=====EVENT_SLOTS_STOPPED=====");
        			target._slotsBigAnimationController.doEffect(cc.w.slots.RESULT.score,function(){
        				ViewFacade.getInstance().notifyObserver(
        						new Notification(cc.w.slots.mappingAction(cc.w.slots.EVENT_STOPPED),cc.w.slots.RESULT));
        			},target);
        		}
        	}
        });
        this.addCustomEventListener(cc.w.slots.EVENT_BET_DONE,null);
        //增加完成事件转发,这三个事件，给中心时都转化为cc.w.slots.EVENT_ON_EFFECT_FINISHED
		this.addCustomEventListener(cc.w.slots.EVENT_LINE_SHOWN,null);
        this.addCustomEventListener(cc.w.slots.EVENT_ON_FREE_LOOP_FINISHED,null);
        this.addCustomEventListener(cc.w.slots.EVENT_ON_BLOOD_INCREASE_FINISHED,null);
	},
	addCustomEventListener:function(eventName,callback){
		cc.eventManager.addCustomListener(eventName, function(event){ 
			if (event!=null) {
				var target = event.getCurrentTarget();
				var data = event.getUserData();
                if(eventName==cc.w.slots.EVENT_LINE_SHOWN
                    ||eventName==cc.w.slots.EVENT_ON_FREE_LOOP_FINISHED
                    ||eventName==cc.w.slots.EVENT_ON_BLOOD_INCREASE_FINISHED
                ){
                    ViewFacade.getInstance().notifyObserver(
                        new Notification(cc.w.slots.mappingAction(cc.w.slots.EVENT_ON_EFFECT_FINISHED),data));
                }else{
                    ViewFacade.getInstance().notifyObserver(
                        new Notification(cc.w.slots.mappingAction(eventName),data));
                }
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
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_SLOTS_STOPPED);
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_BET_DONE);
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_LINE_SHOWN);
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_ON_FREE_LOOP_FINISHED);
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_ON_BLOOD_INCREASE_FINISHED);
	},
	handleNotification: function(notification){
		var notificationName = notification.notificationName;
		var data = notification.notificationData;
		switch (notificationName){
		case cc.w.slots.EVENT_INIT:
			this.initSlots(data);
			break;
		case cc.w.slots.EVENT_START:
			this.start();
			break;
		case cc.w.slots.EVENT_SHOW_LINE:
            cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_SHOW_LINE,data);
			break;
		case cc.w.slots.EVENT_STAGE_CHANGED:
            //cc.log("=====EVENT_STAGE_CHANGED====="+data);
            this.updateSlotsStage(data);
			break;
		case cc.w.slots.EVENT_DO_SPECIAL_EFFECT:
			cc.log("=====EVENT_DO_SPECIAL_EFFECT====="+data);
            this.doSpecialEffect(data);
			break;
		case cc.w.slots.EVENT_RESULT:
            if(data){
                cc.w.slots.RESULT = data;
                cc.log("=====EVENT_RESULT====="+data);

                if (cc.w.slots.RESULT.stage == cc.w.slots.SLOTS_STAGE_BOSS&&this._betNodeController!=null) {
                    this._betNodeController.onResult(data.getBetData());
                }

                if(cc.w.slots.RESULT.isFreeLoopMode()&&cc.w.slots.RESULT.getFreeLoopTime()>0){
                    if(this._slotsFreeLoopController)
                        this._slotsFreeLoopController.updateView(cc.w.slots.RESULT.getFreeLoopTime());
                }
            }
			break;
		}
	},
    /**
     * 初始化界面操作，根据当前阶段来做切换状态操作，根据数据来更新老虎机和押注界面
     * @param data cc.w.slots.Result
     */
    initSlots:function(data){
        if(data==null){
            return;
        }
        this.updateSlotsStage(data.stage);
        if(this._betNodeController){
            this._betNodeController.updateView(data);
        }
        if(this._slotsFreeLoopController){
            this._slotsFreeLoopController.updateView(data._freeLoopTime,data.loopLines,data._minLoopCost,data._maxLoopCost);
        }
    },
	start:function(data){
		if (cc.w.slots.STAGE == cc.w.slots.SLOTS_STAGE_NORMAL&&cc.w.slots.STATE==cc.w.slots.STATE_STOPED) {
			cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_START);
		}
	},
    updateSlotsStage:function(data){
        if(this._slotsStageController){
            this._slotsStageController.updateState(data);
        }
    },
    /**
     * 执行特效，一共两个特效，
     * @param {Number}effectIndex 特效索引
     */
    doSpecialEffect:function(effectIndex){
        var result = cc.w.slots.RESULT;
        if(result&&effectIndex<result.getSpecialEffects().length) {
            //cc.w.slots.SpecialEffect;
            var se = result.getSpecialEffects()[effectIndex];
            if (se.type == cc.w.slots.SLOTS_SPECIAL_EFFECT_TYPE_BL) {
                if(this._slotsBloodIncreaseEffectController){
                    this._slotsBloodIncreaseEffectController.doEffect(se);
                }
            } else {
                if (this._slotsFreeLoopController)
                    this._slotsFreeLoopController.doFreeLoop(result.getFreeLoopTime(),se);
            }
        }
    }
});