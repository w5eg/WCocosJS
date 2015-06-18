cc.w.slots.SlotsController = cc.Class.extend({
	_enable:true,
	_actions:[
	          cc.w.slots.EVENT_START,
	          cc.w.slots.EVENT_RESULT
	          ],
	ctor:function(){
		for (var i = 0; i < this._actions.length; i++) {
			var action = this._actions[i];
			ViewFacade.getInstance().addObserver(action, this);
		}
	},
	release:function(){
		for (var i = 0; i < this._actions.length; i++) {
			var action = this._actions[i];
			ViewFacade.getInstance().removeObserver(action, this);
		}
	},
	handleNotification: function(notification){
		var notificationName = notification.notificationName;
		var data = notification.notificationData;
		switch (notificationName){
		case cc.w.slots.EVENT_START:
				this.start();
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
			var resultStr = 
				"13,13,13,13,13,"+
				"10,10,10,10,10,"+
				"10,10,10,10,10";
			var resultArray = cc.w.str2Array(resultStr);
			cc.w.slots.RESULT.setImages(resultArray);
			cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_RESULT);
			//当真正请求数据时最后要调用这句来通知监听者们
			ViewFacade.getInstance().notifyObserver(
					new Notification(cc.w.slots.EVENT_RESULT,0));
		}, 1, false, 0, false);
	},
	setEnable:function(value){
		this._enable = value;
	},
	isEnable:function(){
		return this._enable;
	}
});