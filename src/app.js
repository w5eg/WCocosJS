var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        // ////////////////////////////
        // 1. super init first
        this._super();
        // ///////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the
		// program
        // you may modify it.
        // ask the window size
        var size = cc.winSize;
// var ss = ["1","2"];
// var vs = [];
// cc.log(ss.length);
// cc.log(vs.length);
// vs.push(ss);
// cc.log(vs.length);
// cc.yj.storeClient.buyItem();
        
        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
// cc.log("Menu is clicked!");
// jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","test","()V");
            	this.toNextScene();
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        // ///////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = 0;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 0.5,
            rotation: 180
        });
        this.addChild(this.sprite, 0);

        this.sprite.runAction(
            cc.sequence(
                cc.rotateTo(2, 0),
                cc.scaleTo(2, 1, 1)
            )
        );
        helloLabel.runAction(
            cc.spawn(
                cc.moveBy(2.5, cc.p(0, size.height - 40)),
                cc.tintTo(2.5,255,125,0)
            )
        );
        return true;
    },

	toNextScene:function(){
		var res = [];
		res.push("res/Plist.plist");
		res.push("res/Plist1.plist");
		
		res.push("res/1.png");
		res.push("res/normal1.png");
		var manRes = manAnimation.res();
		for (var i = 0; i < manRes.length; i++) {
			res.push(manRes[i]);
		}
		var otherAnimationRes = otherAnimation.res();
		for (var i = 0; i < otherAnimationRes.length; i++) {
			res.push(manRes[i]);
		}
		cc.LoaderScene.preload(res, function () {
			var secondScend = new cc.w.Scene(new SecondLayer());
			cc.director.runScene(secondScend);
		}, this);
	}
});
var breakAnimateSp;
var SecondLayer = cc.Layer.extend({
	ctor:function(){
		this._super();
		var layer = new cc.LayerColor(cc.color(55,55,55));
		this.addChild(layer);
		
		this.setupView();
		
		//用例：
//		var oMan = 
//			new cc.Sprite("res/normal1.png");//这是原来主角的精灵
//		oMan.x = (cc.winSize.width/2);
//		oMan.y =(cc.winSize.height/2);
//		this.addChild(oMan);
//		//创建一个主角动画精灵
//		var man = 
//			new manAnimation.Sprite();
//		man.x = oMan.getContentSize().width/2;
//		man.y = oMan.getContentSize().height/2;
//		//把主角动画精灵添加到原搂主角精灵中
//		oMan.addChild(man);
//		man.doAimateHard();//播放用力到出汗状态动画
//		man.doAimateNormal();//播放正常拉到宝物的动画，就是眼睛发光那个
//		oMan.setOpacity(0);//这里注意了！播放时要把原来主角设置为透明的。播放结束后再还原回来
//		man.stopAllActions();
//		cc.w.Layout.testNode(oMan);
		
// this.loadSth();
//		var action = doManAnimationNormalOnNode(man);
//		man.stopAction(action);
		
//		var action = getManAnimationHardOnNode();
//		man.runAction(action);
//		var background = new cc.Sprite("res/homepage_operation_physical.png");
//		background.x = (cc.winSize.width/2);
//		background.y =(cc.winSize.height/2);
//		this.addChild(background);
		
		var ps = new cc.w.ProgressSprite("res/homepage_physical_article_background.png");
		ps.x = (cc.winSize.width/2);
		ps.y =(cc.winSize.height-50);
//		ps.setContentSize(500, 500);
		ps.setProgress(1);
		this.addChild(ps);
		ps.setProgress(1.5);
		ps.setAnchorPoint(cc.p(0.5,1));
//		cc.w.Layout.testNode(ps);
		ps.runAction(cc.w.Action.swing(ps,3,90));
		
		breakAnimateSp = new otherAnimation.SpriteRopeBreak();
		breakAnimateSp.x = (cc.winSize.width/2);
		breakAnimateSp.y =(cc.winSize.height/2);
		this.addChild(breakAnimateSp);
		breakAnimateSp.animate();
	
		
//		this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
//			ps.stopAllActions();
//			cc.log(ps.getRotation());
//		})));
	},
	
	
	loadSth:function(){
		var spriteFrameCache = cc.spriteFrameCache;
		spriteFrameCache.addSpriteFrames("res/Plist.plist");
		var sp = new cc.Sprite(spriteFrameCache.getSpriteFrame("1.png"));
		
		this.addChild(sp);
		sp.x = (cc.winSize.width/2);
		sp.y =(cc.winSize.height/2);
		var animFrames = [];
		animFrames.push(spriteFrameCache.getSpriteFrame("1.png"));
		animFrames.push(spriteFrameCache.getSpriteFrame("2.png"));
		var animation = new cc.Animation(animFrames, 0.5);
		sp.runAction(cc.animate(animation).repeatForever());
		
		spriteFrameCache.addSpriteFrames("res/Plist1.plist");
		
// spriteFrameCache.addSpriteFrame(sp.getd"res/3.png");
// for (var i = 3; i <= 14; i++) {
// var sfn = "res/"+i+".png";
// var sf =
// new cc.SpriteFrame(sfn,cc.rect(0, 0,
// sp.getContentSize().width,sp.getContentSize().height))
// ;
// spriteFrameCache.addSpriteFrame(sf,sfn);
// }
		// (filename, rect, rotated, offset, originalSize)
		var sp1 = new cc.Sprite(
				spriteFrameCache.getSpriteFrame("3.png")
// new cc.SpriteFrame(
// "res/3.png"
// ,cc.rect(0, 0, sp.getContentSize().width,sp.getContentSize().height))
				);
		
		sp1.x = (sp.getContentSize().width/2);
		sp1.y =(sp.getContentSize().height/2);
		sp.addChild(sp1);
		cc.w.Layout.testNode(sp1);
		var animFrames1 = [];
		for (var i = 3; i <= 14; i++) {
			if(i===7||i===8)continue;
			var sfn = 
// "res/"+
			(i)+".png";
// cc.log(sfn);
			var sf = 
				spriteFrameCache.getSpriteFrame(sfn)
// new cc.SpriteFrame(sfn,cc.rect(0, 0, sp.getContentSize().width,
// sp.getContentSize().height))
				;
			animFrames1.push(sf);
		}
		var animation1 = new cc.Animation(animFrames1, 0.1);
		sp1.runAction(cc.animate(animation1).repeatForever());
		 
// sp.setAnchorPoint(cc.p(1, 1));
// var layer = new cc.LayerColor(cc.color(0,100,200,200));
// layer.setContentSize(sp.getContentSize());
// layer.setPosition(sp.getPosition());
// layer.setAnchorPoint(sp.getAnchorPoint());
// layer.ignoreAnchorPointForPosition(false);
// sp.getParent().addChild(layer);
	},
	
	setupView:function(){
		var size = cc.winSize;

		// add a "close" icon to exit the progress. it's an autorelease object
		var closeItem = new cc.MenuItemImage(
				res.CloseNormal_png,
				res.CloseSelected_png,
				function () {
 jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","test","()V");
//					cc.log("Menu is clicked!");
// cc.director.popScene();
//					breakAnimateSp.animate();
					cc.director.runScene(new cc.w.Scene(new HelloWorldLayer()));
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
		this.addChild(menu, 1);
	}
});

var HelloWorldScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new HelloWorldLayer();
		this.addChild(layer);
	}
});