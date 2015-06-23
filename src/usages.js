/**
 * 用例对象数组
 */
cc.w.usage.usages = [
     {
    	 title:"EventDispatcher",
    	 resource:g_resources,
    	 scene:function () {
    		 return new cc.w.Scene(new cc.w.usage.UsageLayerEventDispatcher());
    	 }
     },
     {
    	 title:"DrawNode",
    	 resource:g_resources,
    	 scene:function () {
    		 return new cc.w.Scene(new cc.w.usage.UsageLayerDrawNode());
    	 }
     },
     {
    	 title:"Slots",
    	 resource:g_resources,
    	 scene:function () {
    		 return new cc.w.Scene(new cc.w.usage.UsageLayerSlots());
    	 }
     },
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
			cc.director.pushScene(
//					new cc.TransitionProgressRadialCCW(0.55,
							scene
//							)
					);
		}
	}, this);
};
/**
 * 用例列表页面
 */
cc.w.view.UsagesLayer = cc.Layer.extend({
	_className :"UsagesLayer",
	_nodeGrid:null,
	_bgImage:null,
	ctor:function(){
		this._super();
		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
		this.addChild(layer);
		this.setupView();
		
		var keyboardListener = cc.EventListener.create({
			event: cc.EventListener.KEYBOARD,
//			onKeyPressed:  function(keyCode, event){
			onKeyReleased:  function(keyCode, event){
				if(keyCode == cc.KEY.back){
					cc.director.end();
				}else if(keyCode == cc.KEY.home){
					//do something
				}
			}
		});
		cc.eventManager.addListener(keyboardListener, this);
	},
	onEnter:function(){
		this._super();
//		this._nodeGrid.runAction(cc.flipX3D(5));
//		this._nodeGrid.runAction(cc.flipY3D(5));
//		this._nodeGrid.runAction(cc.pageTurn3D(3.0, cc.size(15, 10)));
//		this._bgImage.runAction(cc.rotateBy(5, 0, 720));
//		var a = cc.flipX(true);
//		this._bgImage.runAction(a);
	},
	setupView:function(){
		var nums = [1,2,3];
		cc.log(nums);
		cc.log(nums.indexOf(3));
		this._nodeGrid = new cc.NodeGrid();
//		this._nodeGrid.setContentSize(100,this.getContentSize().height);
//		this._nodeGrid.setAnchorPoint(cc.p(0.5, 0.5));
//		this._nodeGrid.setPosition(cc.winSize.width/2, cc.winSize.height/2);
		this.addChild(this._nodeGrid);
		this._bgImage = new cc.Sprite("res/HelloWorld.png");
//		sp.setAnchorPoint(0, 0);
//		cc.log(cc.winSize.height);
//		cc.log(cc.winSize.width);
		this._bgImage.setPosition(cc.winSize.width/2, cc.winSize.height/2);
//		sp.setPosition(20, cc.winSize.height-sp.getContentSize().height-20);
//		sp.setOpacity(50)
		this._nodeGrid.addChild(this._bgImage);
		
		
//		sp.setColor(cc.color(255, 255, 0, 255));
		var menuItems = new Array();
//		cc.MenuItemFont.setFontName("Times New Roman");  
//		cc.MenuItemFont.setFontSize(86); 
		for (var i = 0; i <cc.w.usage.usages.length; i++) {
			var item = new cc.MenuItemFont(cc.w.usage.usages[i].title, this.menuItemCallback, this); 
			item.setFontSize(36);
			item.setFontName("Times New Roman");
			item.setTag(i);
			menuItems.push(item);
		}
		var menu = new cc.Menu(menuItems);
		menu.alignItemsVertically();
		this.addChild(menu);
	},
	menuItemCallback:function (sender) {
//		cc.director.end();
		cc.w.usage.pushUsageScene(sender.getTag())
	}, 
});