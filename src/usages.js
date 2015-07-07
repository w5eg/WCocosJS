/**
 * 用例对象数组
 */
cc.w.usage.usages = [
    {
        title: "EventDispatcher",
        resource: g_resources,
        scene: function () {
            return new cc.w.Scene(new cc.w.usage.UsageLayerEventDispatcher());
        }
    },
    {
        title: "DrawNode",
        resource: g_resources,
        scene: function () {
            return new cc.w.Scene(new cc.w.usage.UsageLayerDrawNode());
        }
    },
    {
        title: "Slots",
        resource: g_resources,
        scene: function () {
            return new cc.w.Scene(new cc.w.usage.UsageLayerSlots());
        }
    },
];
/**
 * 打开一个用例页面
 */
cc.w.usage.pushUsageScene = function (idx) {
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
    _className: "UsagesLayer",
    _nodeGrid: null,
    _bgImage: null,
    ctor: function () {
        this._super();
        var layer = new cc.LayerColor(cc.color(cc.random0To1() * 205, cc.random0To1() * 205, cc.random0To1() * 205, 255));
        this.addChild(layer);
        this.setupView();
        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
//			onKeyPressed:  function(keyCode, event){
            onKeyReleased: function (keyCode, event) {
                if (keyCode == cc.KEY.back) {
                    cc.director.end();
                } else if (keyCode == cc.KEY.home) {
                    //do something
                }
            }
        });
        cc.eventManager.addListener(keyboardListener, this);
    },
    onExit:function(){
    	this._super();
    	this._webSocket.close();
    },
    onEnter: function () {
        this._super();
        this.testWebSocket();
//		this._nodeGrid.runAction(cc.flipX3D(5));
//		this._nodeGrid.runAction(cc.flipY3D(5));
//		this._nodeGrid.runAction(cc.pageTurn3D(3.0, cc.size(15, 10)));
//		this._bgImage.runAction(cc.rotateBy(5, 0, 720));
//		var a = cc.flipX(true);
//		this._bgImage.runAction(a);


        /*
         1、时间       ：与其他Action一样，第一个参数都是时间
         2、初始半径：OrbitCamera设定相机在以绑定的Sprite为球心的求面上运动的，所以有个初始半径
         3、半径差    ：半径差大于0的话，相机会跨越不同的球面，这样看起来，Sprite就会变大或变小
         4、起始  z角：Sprite处于三维坐标系的原点，相机位置与原点的连线与yz面的夹角称为z角，
         5、z角差     ：z角改变180度，相当于从Sprite的正前方，绕到它的正后方
         6、起始  x角：Sprite处于三维坐标系的原点，相机位置与原点的连线与xz面的夹角成为x角，z角表示你俯视Sprite的角度
         7、x角差     ：起始x角为0度的时候，x角差表示你的视角与水平线的夹角*/
//		var orbit = cc.orbITCAMERA(5, 1, 0, 0, -90, 90, 0);
//		VAR ORBIT1 = CC.ORbitCamera(5, 1, 0, 90, -180, -90-180, 0);

        var orbit = cc.orbitCamera(5, 1, 0, 0, 360, 0, 0);
        var a = cc.sequence(orbit);
        this._bgImage.runAction(a.repeatForever());
        //播放动画
//		var winSize = cc.visibleRect;
//		var ani = flax.assetsManager.createDisplay("res/w.plist", "asset3", {parent: this, x: winSize.width/2, y: winSize.height/2, fps:60});
//		ani.play();

        cc.director.getScheduler().schedule(function () {
//			 this._bgImage.getCamera().restore();
//			 this._bgImage.cleanup();
        }, this, 2, 0, 0, false, this.__instanceId + "");
        var retryTimer = cc.w.util.RetryTimer.create(this, 5, 2);
        retryTimer.start(function (leftTime) {
            this._bgImage.stopAllActions();
            cc.log("leftTime=" + leftTime);
        });
//        retryTimer.stop();

    },
    setupView: function () {
        this._nodeGrid = new cc.NodeGrid();
//		this._nodeGrid.setContentSize(100,this.getContentSize().height);
//		this._nodeGrid.setAnchorPoint(cc.p(0.5, 0.5));
//		this._nodeGrid.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.addChild(this._nodeGrid);
        this._bgImage = new cc.Sprite("res/HelloWorld.png");
        this._bgImage.setScale(0.6, 0.6);
//		sp.setAnchorPoint(0, 0);
//		cc.log(cc.winSize.height);
//		cc.log(cc.winSize.width);
        this._bgImage.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
//		sp.setPosition(20, cc.winSize.height-sp.getContentSize().height-20);
//		sp.setOpacity(50)
        this._nodeGrid.addChild(this._bgImage);


//		sp.setColor(cc.color(255, 255, 0, 255));
        var menuItems = new Array();
//		cc.MenuItemFont.setFontName("Times New Roman");  
//		cc.MenuItemFont.setFontSize(86); 
        for (var i = 0; i < cc.w.usage.usages.length; i++) {
            var item = new cc.MenuItemFont(cc.w.usage.usages[i].title, this.menuItemCallback, this);
            item.setFontSize(36);
            item.setFontName("Times New Roman");
            item.setTag(i);
            menuItems.push(item);
        }
        var menu = new cc.Menu(menuItems);
        menu.alignItemsVertically();
        this.addChild(menu);
        
        //cc.w.slots.doLineAnimation(51,this,this.getContentSize().width/2,this.getContentSize().height/2);
        //cc.w.slots.doBloodAddAnimation(1,this,this.getContentSize().width/2,this.getContentSize().height/2);
        cc.w.slots.doFreeTimesAnimation(1, this, this.getContentSize().width / 2, this.getContentSize().height / 2, function (view) {
            cc.log(view);
        }, this);
        cc.w.view.addLongPressListener(this);
    },
    menuItemCallback: function (sender) {
//		cc.director.end();
        cc.w.usage.pushUsageScene(sender.getTag())
    },
    _webSocket:null,
    testWebSocket: function () {
//		var ws = new WebSocket("ws://192.168.1.199:3000");
//		ws.onopen = function(evt) {
//			cc.log("WS was opened.");
//		};
//		var l = cc.w.net.WebSocketEventListener.create({
//			onOpen:function(){
//				cc.log("=====www[ON OPEN]=====");
//			},
//		});
//		l.onOpen();
        var self = this;
        //alert("open");
        var listener = cc.w.net.WebSocketEventListener.create({
            onOpen: function (webSocket) {
                cc.log("=====[onOpen]=====");
                self.sendData(webSocket);
            },
            onMessage: function (webSocket, data) {
                cc.log("=====[onMessage]=====" + data);
//				webSocket.close();
            },
            onError: function (webSocket) {
                cc.log("=====[onError]=====");
            },
            onClose: function (webSocket) {
                cc.log("=====[onClose]=====");
            }
        });
        var ws = cc.w.net.WebSocket.create(listener, "ws://192.168.1.199:3000");
        ws.enableReconnection(this, 5, 3);
        ws.connect();
        this._webSocket = ws;
    },
    sendData: function (ws) {
//        var u32a = new Uint32Array(2);
//        u32a[0] = 1001;
//        u32a[1] = 1002;
//    	ws.send(u32a.buffer);
    	
    	
    	var preLen = 8;
    	var dataStr  = "ab中";
    	var charArr = utf8.toByteArray(dataStr);
    	var dataLen = charArr.length;
        cc.log("dataLen:"+dataLen);
        var buffer = new ArrayBuffer(preLen+dataLen);
        cc.log("bufferLen:"+buffer.byteLength);
    	var u32a = new Uint32Array(buffer,0,2);
    	u32a[0] = 1001;
    	u32a[1] = buffer.byteLength;
    	var dv = new DataView(buffer);
        for(var i= 0;i<charArr.length;i++){
            dv.setUint8(preLen+i,charArr[i]);
            cc.log("offset:"+(preLen+i)+"char="+charArr[i]);
        }
    	ws.send(buffer);
    	
//    	var buffer = new ArrayBuffer(8);
//    	var x = new DataView(buffer);
////    	x.setUint32(0, 32);
////    	x.setUint32(4, 1002);
//    	console.log(x.getUint32(0)); 
//    	console.log(x.getUint32(4)); 
//    	ws.send(x.buffer);
    	
//    	var blob = new Blob(["abc"]);
//    	ws.send(blob);
    }
});