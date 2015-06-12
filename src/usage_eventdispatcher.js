var CUSTOM_EVENT_NAMES = {
    "TEST":"CUSTOM_EVENT_TEST"
}; 
cc.w.usage.UsageLayerEventDispatcher = cc.w.view.UsageBaseLayer.extend({
	_className:"UsageLayerEventDispatcher",
	ctor:function(){
		this._super();
		this.setupView();
	},
	setupView:function(){
		this._super();
		var size = cc.winSize;
		var item = new cc.MenuItemFont("PERFOM CUSTOM EVENT", this.performEventMenuItemCallback, this); 
		item.attr({
			x:size.width/2,
			y:size.height/2
		})
		item.setFontSize(36);
		item.setFontName("Times New Roman");
		var menu = new cc.Menu(item);
		menu.x = 0;
		menu.y = 0;
		this.addChild(menu);
	},
	onEnter:function(){
		this._super();
		//进入后台 
		cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function(event){ 
			if(event!=null)cc.log("cc.game.EVENT_HIDE!"); 
		}); 
		//恢复显示 
		cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(event){ 
			if(event!=null)cc.log("cc.game.EVENT_SHOW"); 
		});
		cc.eventManager.addCustomListener(CUSTOM_EVENT_NAMES.TEST, this.testCustomEventCallback)
//		cc.eventManager.removeCustomListeners(CUSTOM_EVENT_NAMES.TEST);
	},
	testCustomEventCallback:function(event){
		if (event!=null&&event.getUserData()!=null) {
			cc.log("###"+event.getEventName()+" userData:"+event.getUserData().data);
		}
	},
	performEventMenuItemCallback:function(){
		cc.eventManager.dispatchCustomEvent(CUSTOM_EVENT_NAMES.TEST, {"data":"here we are!~"});
	},
	onExit:function(){
		this._super();
		cc.eventManager.removeCustomListeners(CUSTOM_EVENT_NAMES.TEST);
	}
});