cc.w.usage.UsageLayerDrawNode = cc.w.view.UsageBaseLayer.extend({
	_className:"UsageLayerDrawNode",
	ctor:function(){
		this._super();
		this.setupView();
		var rect = cc.rect(0, 0, 50, 50);
		cc.log(rect.x+" "+rect.y+" "+rect.width+" "+rect.height);
		var nums = [1,2,3];
		cc.log(nums);
		cc.log(nums.indexOf(3));
		cc.log(nums.indexOf(100));//可用于判断是否包含
		var array = "1,2,3,4,5:3".split(":")[0].split(",");
		array.push("abc");
		cc.log(array);
	},
	setupView:function(){
		var draw = new cc.DrawNode();
		this.addChild(draw, 10);

		var winSize = cc.director.getWinSize();
		var centerPos = cc.p(winSize.width / 2, winSize.height / 2);
		var vertices4 = [

			cc.p(centerPos.x - 130, centerPos.y - 130),
			
			cc.p(centerPos.x - 130, centerPos.y + 130),
			
			cc.p(centerPos.x + 130, centerPos.y + 130),
			
			cc.p(centerPos.x + 130, centerPos.y - 130),
		
			cc.p(centerPos.x - 130, centerPos.y - 130)
		
		];
		 
		draw.drawCardinalSpline(vertices4, 1, 100, 15, cc.color(255, 255, 255, 255));

	},
});