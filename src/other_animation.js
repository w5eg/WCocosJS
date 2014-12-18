var otherAnimation = {};
otherAnimation.res = function(){
	return ["res/rope_break.plist"];
};

var spriteFrameCache = cc.spriteFrameCache;
otherAnimation.ropeBreak = function(){
	var animFrames = [];
	for (var i = 1; i <= 2; i++) {
		animFrames.push(spriteFrameCache.getSpriteFrame("rope_break_"+i+".png"));
	}
	var action = cc.animate(new cc.Animation(animFrames, 0.1)).repeat(1);
	return action;
};

otherAnimation.SpriteRopeBreak = cc.Sprite.extend({
	_animate:null,
	_spriteFrame:null,
	_self:null,
	ctor:function(){
		spriteFrameCache.addSpriteFrames("res/rope_break.plist");
		this._spriteFrame = spriteFrameCache.getSpriteFrame("rope_break_1.png");
		if (this._spriteFrame) {
			this._super(this._spriteFrame);
			this._animate = otherAnimation.ropeBreak();
			this.setOpacity(0);
			this._self = this;
		}else{
			this._super();
			var errorInfo = "动画所需资源未加载，网页需要提前加载资源";
			if(cc.sys.isNative){
				cc.error(errorInfo);
			}else{
				alert(errorInfo);
			}
		}
	},
	animate:function(){
		if(!this.hasResource())return;
		this.stopAllActions();
		this.setOpacity(255);
		
		this._animate = otherAnimation.ropeBreak();
		this.runAction(cc.sequence(this._animate,cc.callFunc(function(node){
			node.setOpacity(0);
		},this)));   
	},  

	stopAllActions:function(){
		this._super();
	},
	hasResource:function(){
		if (!this._spriteFrame){
			return false;
		}else{
			return true;
		}
	}
});
