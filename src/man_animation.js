var manAnimation = {};
manAnimation.res = function(){
	return ["res/man_normal.plist","res/man_hard.plist","res/man_sweats.plist"];
};
var spriteFrameCache = cc.spriteFrameCache;
manAnimation.normal = function(){
	var animFrames = [];
	for (var i = 1; i <= 4; i++) {
		animFrames.push(spriteFrameCache.getSpriteFrame("normal"+i+".png"));
	}
	var action = cc.animate(new cc.Animation(animFrames, 0.5)).repeatForever();
	return action;
};

manAnimation.hard = function(){
	var animFrames = [];
	for (var i = 1; i <= 2; i++) {
		animFrames.push(spriteFrameCache.getSpriteFrame(i+".png"));
	}
	var action = cc.animate(new cc.Animation(animFrames, 0.5)).repeatForever();
	return action;
};

manAnimation.sweats = function(){	
	var animFrames = [];
	for (var i = 3; i <= 14; i++) {
		if(i===7||i===8)continue;
		animFrames.push(spriteFrameCache.getSpriteFrame(i+".png"));
	}
	var action = cc.animate(new cc.Animation(animFrames, 0.2)).repeatForever();
	return action;
};
manAnimation.Sprite = cc.Sprite.extend({
	normalSprite:null,
	sweatsSprite:null,
	normalAnimate:null,
	hardAnimate:null,
	sweatsAnimate:null,
	normalSf1:null,
	ctor:function(){
		spriteFrameCache.addSpriteFrames("res/man_normal.plist");
		spriteFrameCache.addSpriteFrames("res/man_hard.plist");
		spriteFrameCache.addSpriteFrames("res/man_sweats.plist");
		this.normalSf1 = spriteFrameCache.getSpriteFrame("normal1.png");
		if (this.normalSf1) {
			var normalSp = new cc.Sprite(this.normalSf1);
			cc.SpriteFrame
			this._super();
			this.setContentSize(normalSp.getContentSize());
			this.normalSprite = new cc.Sprite(this.normalSf1);
			this.sweatsSprite = new cc.Sprite();//资源图片大小都一致
			this.normalSprite.setContentSize(this.getContentSize());
			this.sweatsSprite.setContentSize(this.getContentSize());
			this.sweatsSprite.setPosition(cc.p(this.getContentSize().width/2, this.getContentSize().height/2));
			this.normalSprite.setPosition(cc.p(this.getContentSize().width/2, this.getContentSize().height/2));
			this.addChild(this.normalSprite);
			this.addChild(this.sweatsSprite);
			this.normalAnimate = manAnimation.normal();
			this.hardAnimate = manAnimation.hard();
			this.sweatsAnimate = manAnimation.sweats();
		}else{
			this._super();
			var errorInfo = "主角动画所需资源未加载，网页需要提前加载资源";
			if(cc.sys.isNative){
				cc.error(errorInfo);
			}else{
				alert(errorInfo);
			}
		}
	},
	doAimateNormal:function(){
		if(!this.hasResource())return;
		
		this.stopAllActions();
		
		this.normalSprite.runAction(this.normalAnimate);
	},
	doAimateHard:function(){
		if(!this.hasResource())return;
		
		this.stopAllActions();
		
		this.normalSprite.runAction(this.hardAnimate);
		this.sweatsSprite.runAction(this.sweatsAnimate);
	},
	stopAllActions:function(){
		this._super();
		this.sweatsSprite.stopAllActions();
		this.normalSprite.stopAllActions();
	},
	hasResource:function(){
		if (!this.normalSf1){
			return false;
		}else{
			return true;
		}
	}
});