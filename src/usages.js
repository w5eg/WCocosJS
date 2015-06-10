var Usages = [
     {
    	 title:"UsageLayerEventDispatcher",
    	 linksrc:"src/usage_eventdispatcher.js",
    	 resource:g_resources,
    	 scene:function () {
    		 return new cc.w.Scene(new UsageLayerEventDispatcher());
    	 }
     }
];
var pushUsageScene = function(idx){
	var usage = Usages[idx];
	var res = usage.resource || [];
	cc.LoaderScene.preload(res, function () {
		var scene = usage.scene();
		if (scene) {
			cc.director.pushScene(scene);
		}
	}, this);
};
var UsagesLayer = cc.Layer.extend({
	_className :"UsagesLayer",
	ctor:function(){
		this._super();
		var layer = new cc.LayerColor(cc.color(255,0,255));
		this.addChild(layer);
	},
	onEnter:function(){
		this._super();
		this.setupView();
	},
	setupView:function(){
		
		var sp = new cc.Sprite("res/HelloWorld.png");
		sp.setPosition(cc.winSize.width/2, cc.winSize.height/2);
		this.addChild(sp);
		
		var menuItems = new Array();
//		cc.MenuItemFont.setFontName("Times New Roman");  
//		cc.MenuItemFont.setFontSize(86); 
		for (var i = 0; i <Usages.length; i++) {
			var item = new cc.MenuItemFont(Usages[i].title, this.menuItemCallback, this); 
			item.setFontSize(36);
			item.setFontName("Times New Roman");
			item.setTag(i);
			menuItems.push(item)
		}
		cc.log(menuItems.length);
		var menu = new cc.Menu(menuItems);
		menu.alignItemsVertically();
		this.addChild(menu);
		
	},
	menuItemCallback:function (sender) {
		pushUsageScene(sender.getTag())
	}, 
});