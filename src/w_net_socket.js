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
			onOpen:function(webSocket){//可选
				cc.log("=====[onOpen]=====");
				webSocket.send("wwwwwwww");
			},
			onMessage:function(webSocket,data){//可选
				cc.log("=====[onMessage]====="+data);
				webSocket.close();
			},
			onError:function(webSocket){//可选
				cc.log("=====[onError]=====");
			},
			onClose:function(webSocket){//可选
				cc.log("=====[onClose]=====");
			}
		});
	var ws = cc.w.net.WebSocket.create(listener,"ws://192.168.1.199:3000");
 */
cc.w.net.WebSocket = cc.Class.extend({
    _WebSocket:WebSocket || window.WebSocket || window.MozWebSocket,
    _wsInstance:null,
    _url:null,
    _protocols:null,
    _l:null,
    _retryTimer4Reconnecting:null,//用于断线重连的cc.w.util.RetryTimer
    _isClosed:false,//是否已经关闭了。如果用户调用close()方法，当前SOCCKET会关闭且不可以再被使用，因为不会再连接了。
    /**
     * 创建后，会自动执行连接操作，当连接成功后会调用onOpen()方法
     * @param {cc.w.net.WebSocketEventListener}l 可选
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
        this._url = url;
        this._protocols = protocols;
    },
    enableReconnection:function(target,times,interval){
        if(this._retryTimer4Reconnecting||target==null||times<=0){
            return false;
        }
        this._retryTimer4Reconnecting = cc.w.util.RetryTimer.create(target,times,interval);
        return true;
    },
    connect:function(){
        if(this._isOpened()){
            return;
        }
        this._wsInstance =  new WebSocket(this._url,this._protocols
            //,proxyHost,proxyPort,headers
        );
        var self = this;
        if(this._l){
            this._wsInstance.onopen = function(event){
                if(self._l.onOpen){
                    self._l.onOpen(self);
                }
                self._stopReconnection();
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
                self._wsInstance = null;
                if(!self._isClosed&&self._retryTimer4Reconnecting&&self._retryTimer4Reconnecting.getLeftTimes()>0){
                    self._startReconnection();
                }else{
                    if(self._l.onClose){
                        self._l.onClose(self);
                    }
                }
            };
        }
    },
    send:function(data){
        if(this._isOpened())this._wsInstance.send(data);
    },
    close:function(){
        if(this._wsInstance){
            this._wsInstance.close();
            this._wsInstance = null;
        }
        this._stopReconnection();
        this._isClosed = true;
    },
    _isOpened:function(){
        if(this._wsInstance){
            return this._wsInstance.readyState == this._WebSocket.OPEN;
        }
        return false;
        //if (this.readyState == WebSocket.CLOSED || this.readyState == WebSocket.CLOSING)
    },
    _startReconnection:function(){
        if(!this._retryTimer4Reconnecting) {
            return;
        }
        var self = this;
        this._retryTimer4Reconnecting.start(function(leftTime){
            if(leftTime>=0){
            //    if(self._l) {
            //        if(self._l.onClose){
            //            self._l.onClose(self);
            //        }
            //    }
            //}else{
                cc.log("Reconnecting="+(self._retryTimer4Reconnecting._times-leftTime));
                self.connect();
            }
        });
    },
    _stopReconnection:function(){
        if(this._retryTimer4Reconnecting){
            this._retryTimer4Reconnecting.stop();
        }
    }
});
cc.w.net.WebSocket.create = function(l,url,protocols){
	var instance =  new cc.w.net.WebSocket();
	instance.init(l,url,protocols);
	return instance;
};