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
cc.w.slots.EVENT_STAGE_CHANGE = "cc.w.slots.EVENT_STAGE_CHANGE";//老虎机阶段变化事件，目前只有两个阶段且不能回退
cc.w.slots.EVENT_RESET = "cc.w.slots.EVENT_GAME_RESET";//老虎机重置事件，主要就是把老虎机切换回第一阶段

/**
 * 主要用来做动画。会根据init()方法传来的两个按钮来设置界面（添加按钮下面的文本，和免费次数文本）
 * 监听更新事件，并在事件发生时根据当前数据来执行updateView()方法。来更新界面
 */
cc.w.slots.SlotsControlContorller = cc.Node.extend({
	release:function(){
		
	},
	init:function(){
	},
	updateView:function(){
		//TODO: 更新状态与
	},
});
/**
 * 押注机控制器，可以押两个结果，并可以设置三种倍率，并有一个奖池
 * 使用时通过调用 init()方法来传入相关组件。
 * 按钮器为每个按钮提供的点击回调方法。需要在使用都为每个按钮添加对应的回调方法
 */
cc.w.slots.EVENT_CHOSEN = "cc.w.slots.EVENT_CHOSEN";//选择事件发生
cc.w.slots.EVENT_BET_RESULT = "cc.w.slots.EVENT_BET_RESULT";//监听到押注结果,0为失败，1为成功
cc.w.slots.BetNode = {};
cc.w.slots.BetNode.STATE_STOPED = 0;
cc.w.slots.BetNode.STATE_RUNNING = 1;
cc.w.slots.BetNodeController = cc.Class.extend({
	_betData:null,
	_state:cc.w.slots.BetNode.STATE_STOPED,
	_mutipleIndex:0,
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
		if (betData==null||this._costLabel1==null||this._costLabel2==null||this._pondLabel==null) {
			return;
		}
		var multiple = 1;
		if (this._mutipleIndex<betData.mutiples.length) {
			multiple = betData.mutiples[this._mutipleIndex];
		}
		var costStr = (betData.cost*multiple)+"";
		costLabel1.setString(costStr);
		costLabel2.setString(costStr);
		pondLabel.setString(betData.Pond+"");
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
		if (view==this._betBtn2) {
			value = 1;
		}
		cc.log("=====DO BET====="+value);
		var multiple = 1;
		if (this._mutipleIndex<this._betData.mutiples.length) {
			multiple = this._betData.mutiples[this._mutipleIndex];
		}
		cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_CHOSEN,{"choice":value,"multiple":multiple});
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
		this._mutipleIndex = index;
		for (var i = 0; i < this._multipleCBs.length; i++) {
			var cb = this._multipleCBs[i];
			if (cb == view) {
				cb.setSelected(true);
			}else{
				cb.setSelected(false);
			}
		}
	},
});
/**
 * 老虎机状态控制器,关联老虎机相关组件，并进行统一管理：统一的事件处理与转发
 * 用于处理:老虎机大部分操作，如下,
 * 老虎机和押注模式的切换处理，涉及组件有 SlotsNode,SlotsControl,BetNode,
 */
cc.w.slots.SlotsController = cc.Class.extend({
	_enable:true,
	_inited:false,
	_betNodeController:null,
	_actions:[
	          cc.w.slots.EVENT_START,
	          cc.w.slots.EVENT_SHOW_LINE,
	          cc.w.slots.EVENT_BET_RESULT,         
	          
	          cc.w.slots.EVENT_RESULT,         
	          ],
	addBetNodeController:function(betNodeController){
		this._betNodeController = betNodeController;
	},
	init:function(){
		if (this._inited) {
			return;
		}
		this._inited = true;
		for (var i = 0; i < this._actions.length; i++) {
			var action = this._actions[i];
			ViewFacade.getInstance().addObserver(action, this);
		}
		//增加停止事件转发
		this.addCustomEventListener(cc.w.slots.EVENT_STOPED, function(event){
			ViewFacade.getInstance().notifyObserver(
					new Notification(cc.w.slots.mappingAction(cc.w.slots.EVENT_STOPED),0));

			for (var i = 0; i < cc.w.slots.SLOTS_CELL_NODES.length; i++) {
				var cellNode = cc.w.slots.SLOTS_CELL_NODES[i];
//				cc.log(cellNode.getIndex());
				cellNode.doCellAnimation();
//				if (cellNode.getIndex()==13) {
//				cellNode.setVisible(false);
//				}
			}
		});
		//增加画线完成事件转发
		this.addCustomEventListener(cc.w.slots.EVENT_LINE_SHOWN,null);
		this.addCustomEventListener(cc.w.slots.EVENT_CHOSEN,function(){
//			cc.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww");
		});
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
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_STOPED);
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
			this.showLine(data);
			break;
		case cc.w.slots.EVENT_RESULT:
			this.showBetResult(data);
			break;
		}
	},
	start:function(){
		if (!this._enable) {
			return;
		}
		this.getResult();
		if (cc.w.slots.STATE==cc.w.slots.STATE_STOPED) {
			cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_START);
		}
	},
	showLine:function(lineIndex){
		cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_SHOW_LINE,lineIndex);
	},
	showBetResult:function(data){
		if (this._betNodeController!=null) {
			this._betNodeController.onResult(data);
		}
	},
// stop:function(){
// if (!this._enable) {
// return;
// }
// },
	getResult:function(){
		// TODO 开始运动的同时，从后台请求结果
		// TEST
		this.testResult();
		// END TEST
	},
	testResult:function(){
		cc.director.getScheduler().scheduleCallbackForTarget(this, function(){
			
			var stage = 0;
			var imagesData = 
				"1,1,1,1,1,"+
				"2,2,2,2,2,"+
				"3,3,3,3,3";
			var linesData = 
				[
				 "0,1,7,13,14:3",
				 "0,6,2,13,14:3",
				 "0,1,2,3,4:3",
				 "5,6,7,8,9:3",
				 "10,11,12,13,14:3",
				 "5,11,7,13,9:3",
				 ];
			var spicelEffectsData = 
				[
				 "0,1,7,13,14:1",
				 "0,1,7,13,14:2",
				 ];

			var betPond = 0;
			var betCost = 1000;
			var betMultiples = "1,2,5";
			
			cc.w.slots.RESULT = new cc.w.slots.Result();
			cc.w.slots.RESULT.stage = stage;
			cc.w.slots.RESULT.setImagesData(imagesData);
			cc.w.slots.RESULT.setLinesData(linesData);
			cc.w.slots.RESULT.setSpecialEffectsData(spicelEffectsData);
			
			cc.w.slots.RESULT.setBetData(betPond,betCost,betMultiples);
			
			cc.eventManager.dispatchCustomEvent(cc.w.slots.mappingAction(cc.w.slots.EVENT_RESULT));
			//当真正请求数据时最后要调用这句来通知监听者们
			ViewFacade.getInstance().notifyObserver(
					new Notification(cc.w.slots.mappingAction(cc.w.slots.EVENT_RESULT),cc.w.slots.RESULT));
		}, 0.2, false, 0, false);
	},
	setEnable:function(value){
		this._enable = value;
	},
	isEnable:function(){
		return this._enable;
	},
});