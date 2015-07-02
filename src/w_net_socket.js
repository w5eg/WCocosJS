/**
 * Created by w5e on 2015/7/2.
 */
/**
 * 事件监听器
 * var listener = cc.w.net.WebSocketEventListener.create({
			onOpen:function(webSocket){
			},
			onMessage:function(webSocket,data){
			},
			onError:function(webSocket){
			},
			onClose:function(webSocket){
			}
		});
 */
cc.w.net.WebSocketEventListener = cc.Class.extend({
    onOpen:null,
    onMessage:null,
    onError:null,
    onClose:null
});
cc.w.net.WebSocketEventListener.create = function(argObj){
	var instance =  new cc.w.net.WebSocketEventListener();
	if(argObj.onOpen)instance.onOpen = argObj.onOpen;
	if(argObj.onMessage)instance.onMessage = argObj.onMessage;
	if(argObj.onError)instance.onError = argObj.onError;
	if(argObj.onClose)instance.onClose = argObj.onClose;
	return instance;
};
/**
 	var listener = cc.w.net.WebSocketEventListener.create({
			onOpen:function(webSocket){
				cc.log("=====[onOpen]=====");
				webSocket.send("wwwwwwww");
			},
			onMessage:function(webSocket,data){
				cc.log("=====[onMessage]====="+data);
				webSocket.close();
			},
			onError:function(webSocket){
				cc.log("=====[onError]=====");
			},
			onClose:function(webSocket){
				cc.log("=====[onClose]=====");
			}
		});
	var ws = cc.w.net.WebSocket.create(listener,"ws://192.168.1.199:3000");
 */
cc.w.net.WebSocket = cc.Class.extend({
    _WebSocket:WebSocket || window.WebSocket || window.MozWebSocket,
    _wsInstance:null,
    /**
     * @param {cc.w.net.WebSocket} ws
     */
    onOpen:null,
    onMessage:null,
    onError:null,
    onClose:null,
    _l:null,
    /**
     * 创建后，会自动执行连接操作，当连接成功后会调用onOpen()方法
     * @param {cc.w.net.WebSocketEventListener}l
     * @param {string} url
     * @param {array or string} protocols
     //* @param {string} proxyHost
     //* @param {int} proxyPort
     //* @param {string} headers
     */
    init:function(l,url, protocols
        //, proxyHost, proxyPort, headers
    ){
        this._l = l;
        
        this._wsInstance =  new WebSocket(url,protocols
            //,proxyHost,proxyPort,headers
        );
        var self = this;
        this._wsInstance.onopen = function(event){
        	if(self._l.onOpen){
        		self._l.onOpen(self);
        	}
        };
        this._wsInstance.onmessage = function(event){
        	if(self._l.onMessage){
        		self._l.onMessage(self,event.data);
        	}
        };
        this._wsInstance.onerror = function(event){
        	if(self._l.onError){
        		self._l.onError(self);
        	}
        };
        this._wsInstance.onclose = function(event){
        	if(self._l.onClose){
        		self._l.onClose(self);
        	}
        };
    },
    send:function(data){
        if(this._wsInstance)this._wsInstance.send(data);
    },
    close:function(){
        if(this._wsInstance)this._wsInstance.close();
    }
});
cc.w.net.WebSocket.create = function(l,url,protocols){
	var instance =  new cc.w.net.WebSocket();
	instance.init(l,url,protocols);
	return instance;
};