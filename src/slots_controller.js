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
cc.w.slots.SlotsController = cc.Class.extend({
	_enable:true,
	_inited:false,
	_actions:[
	          cc.w.slots.EVENT_START,
	          cc.w.slots.EVENT_SHOW_LINE,
	          cc.w.slots.EVENT_LINE_SHOWN,
	          ],
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
		var event_stoped = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			eventName: cc.w.slots.EVENT_STOPED,
			callback: function(event){
				if (event!=null) {
//					var target = event.getCurrentTarget();
					ViewFacade.getInstance().notifyObserver(
							new Notification(cc.w.slots.mappingAction(cc.w.slots.EVENT_STOPED),0));
					
					for (var i = 0; i < cc.w.slots.SLOTS_CELL_NODES.length; i++) {
						var cellNode = cc.w.slots.SLOTS_CELL_NODES[i];
//						cc.log(cellNode.getIndex());
						cellNode.doCellAnimation();
//						if (cellNode.getIndex()==13) {
//							cellNode.setVisible(false);
//						}
					}
				}
			}
		});    
		cc.eventManager.addListener(event_stoped, 1);
		//增加画线完成事件转发
		var event_stoped = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			eventName: cc.w.slots.EVENT_LINE_SHOWN,
			callback: function(event){
				if (event!=null) {
//					var target = event.getCurrentTarget();
					ViewFacade.getInstance().notifyObserver(
							new Notification(cc.w.slots.mappingAction(cc.w.slots.EVENT_LINE_SHOWN),0));
				}
			}
		});    
		cc.eventManager.addListener(event_stoped, 1);
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
		case cc.w.slots.EVENT_LINE_SHOWN:
			cc.log("=========EVENT_LINE_SHOWN=========");
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
			cc.w.slots.RESULT = new cc.w.slots.Result();
			var imagesData = 
				"1,1,1,1,1,"+
				"2,2,2,2,2,"+
				"3,3,3,3,3";
			var linesData = 
				[
				 "0,1,7,13,14:3:0",
				 "0,6,2,13,14:3:1",
				 "0,1,2,3,4:3:2",
				 "5,6,7,8,9:3:2",
				 "10,11,12,13,14:3:2",
				 "5,11,7,13,9:3:2",
				 ];
			
			cc.w.slots.RESULT.setImagesData(imagesData);
			cc.w.slots.RESULT.setLinesData(linesData);
			
			cc.eventManager.dispatchCustomEvent(cc.w.slots.mappingAction(cc.w.slots.EVENT_RESULT));
			//当真正请求数据时最后要调用这句来通知监听者们
			ViewFacade.getInstance().notifyObserver(
					new Notification(cc.w.slots.mappingAction(cc.w.slots.EVENT_RESULT),0));
		}, 0.2, false, 0, false);
	},
	setEnable:function(value){
		this._enable = value;
	},
	isEnable:function(){
		return this._enable;
	},
});