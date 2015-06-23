cc.w.usage.UsageLayerDrawNode = cc.w.view.UsageBaseLayer.extend({
	_className:"UsageLayerDrawNode",
	ctor:function(){
		this._super();
		this.setupView();
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