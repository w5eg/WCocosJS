cc.w.usage = cc.w.usage||{};
/**
 * 用例对象数组
 */
cc.w.usage.usages = [
     {
    	 title:"EventDispatcher",
    	 linksrc:"src/usage_eventdispatcher.js",
    	 resource:g_resources,
    	 scene:function () {
    		 return new cc.w.Scene(new cc.w.usage.UsageLayerEventDispatcher());
    	 }
     },
     {
    	 title:"Slots",
    	 linksrc:"src/slots.js",
    	 resource:g_resources,
    	 scene:function () {
    		 return new cc.w.Scene(new cc.w.view.UsageLayerSlots());
    	 }
     }
];
/**
 * 打开一个用例页面
 */
cc.w.usage.pushUsageScene = function(idx){
	var usage = cc.w.usage.usages[idx];
	var res = usage.resource || [];
	cc.LoaderScene.preload(res, function () {
		var scene = usage.scene();
		if (scene) {
			cc.director.pushScene(new cc.TransitionProgressRadialCCW(0.5,scene));
		}
	}, this);
};
/**
 * 用例页面基础页面，提供返回按钮和背景色
 */
cc.w.view.UsageBaseLayer = cc.Layer.extend({
	_className:"UsageBaseLayer",
	ctor:function(){
		this._super();
		this.setupView();
	},
	setupView:function(){
		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
		this.addChild(layer);
		var size = cc.winSize;
		var closeItem = new cc.MenuItemImage(
				"res/CloseNormal.png",
				"res/CloseSelected.png",
				function () {
					cc.director.popScene();
				}, this);
		closeItem.attr({
			x: size.width-60,
			y: 60,
			anchorX: 0.5,
			anchorY: 0.5
		});
		var menu = new cc.Menu(closeItem);
		menu.x = 0;
		menu.y = 0;
		this.addChild(menu);
	},
});
/**
 * 用例列表页面
 */
cc.w.view.UsagesLayer = cc.Layer.extend({
	_className :"UsagesLayer",
	ctor:function(){
		this._super();
		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
		this.addChild(layer);
	},
	onEnter:function(){
		this._super();
		this.setupView();
	},
	setupView:function(){
		var sp = new cc.Sprite("res/HelloWorld.png");
		sp.setPosition(cc.winSize.width/2, cc.winSize.height/2);
		sp.setOpacity(50)
		this.addChild(sp);
//		sp.setColor(cc.color(255, 255, 0, 255));
		var menuItems = new Array();
//		cc.MenuItemFont.setFontName("Times New Roman");  
//		cc.MenuItemFont.setFontSize(86); 
		for (var i = 0; i <cc.w.usage.usages.length; i++) {
			var item = new cc.MenuItemFont(cc.w.usage.usages[i].title, this.menuItemCallback, this); 
			item.setFontSize(36);
			item.setFontName("Times New Roman");
			item.setTag(i);
			menuItems.push(item)
		}
		var menu = new cc.Menu(menuItems);
		menu.alignItemsVertically();
		this.addChild(menu);
	},
	menuItemCallback:function (sender) {
		cc.w.usage.pushUsageScene(sender.getTag())
	}, 
});