cc.slots = {};
cc.slots.net = {};
cc.slots.net.HOST = "ws://192.168.1.199:3000";
cc.slots.net.RECONNECT_TIME = 5;//断线重连次数
cc.slots.net.RECONNECT_INTERVAL = 3;//断线重连间隔秒数
cc.slots.net.DEFAULT_TIMEOUT = 30;//请求超时时间

cc.slots.DataManager = cc.Class.extend({
    _webSocket:null,
    _l:null,
    _requestMap:null,//保存cc.slots.net.Request对象的Map,Key为responseId
    release:function(){
        this._l = null;
        if(this._webSocket){
            this._webSocket.close();
            this._webSocket = null;
        }
        if(this._requestMap){
            var reqs = this._requestMap.values();
            for(var i=0;i<reqs.length;i++){
                var req = reqs[i];
                req.stopTimeoutTimer();
            }
            this._requestMap = null;
        }
    },
    /**
     * @param {cc.w.net.WebSocketEventListener}l 可选
     */
    ctor:function(listener,host){
        this._l = listener;
        var _host = host?host:cc.slots.net.HOST;
        this._requestMap = new Map();
        var self = this;
        var mListener = new cc.w.net.WebSocketEventListener({
            onOpen: function (webSocket) {
                cc.log("=====[onOpen]=====");
                if(self._l){
                    self._l.onOpen();
                }
            },
            onMessage: function (webSocket, data) {
                cc.log("=====[onMessage]=====" + data);
                var jsonData ;
                if((data instanceof ArrayBuffer)&&data.byteLength>8){
                    var preData = new Uint32Array(data.slice(0,8));
                    var len = preData[1];
                    var msgId = preData[0];
                    var content = new TextDecoder('utf-8').decode(data.slice(8,len));
                    jsonData = JSON.parse(content);
                    cc.log("=====[onMessage]=====" +msgId);
                    cc.log("=====[onMessage]=====" +len);
                    cc.log("=====[onMessage]=====" +content);
                    var request = self._requestMap.get(msgId);
                    if(request&&request.getResponseId()==new Number(msgId)&&!request.isInvalid()){
                        var  responseCallback = request.getResponseCallback();
                        if(responseCallback){
                            responseCallback(jsonData);
                        }
                        request.stopTimeoutTimer();
                    }
                }
                if(self._l){
                    self._l.onMessage(data);
                }
            },
            onError: function (webSocket) {
                cc.log("=====[onError]=====");
                if(self._l){
                    self._l.onError();
                }
            },
            onClose: function (webSocket) {
                cc.log("=====[onClose]=====");
                if(self._l){
                    self._l.onClose();
                }
            }
        });
        this._webSocket= new cc.w.net.WebSocket(mListener, _host);
        this._webSocket.enableReconnection(this, cc.slots.net.RECONNECT_TIME, cc.slots.net.RECONNECT_INTERVAL);
    },
    connect:function(){
        if(this._webSocket){
            this._webSocket.connect();
        }
    },
    /**
     * 执行一次请求
     * @param {cc.slots.net.Request} request
     */
    request:function(request){
        if(this._webSocket==null||this._requestMap==null||request==null||request.isInvalid()){
            cc.w.log.e("cc.slots.DataManager","request() params error");
            return;
        }
        if(this._requestMap.get(request.getResponseId())){//如果之前有同样的请求，则不处理这个请求
            cc.w.log.e("cc.slots.DataManager","request exists");
            return;
        }
        //if(!this._webSocket._isOpened()){//如果没有连接，则直接执行回调
        //    request.getResponseCallback()();
        //    return;
        //}
        this._requestMap.put(request.getResponseId(),request);
        var self = this;
        var preLen = 8;
        var dataStr  = request.getParams();
        var charArr;
        if(dataStr){
            charArr = utf8.toByteArray(dataStr);
        }
        var dataLen = charArr?charArr.length:0;
        cc.log("dataLen:"+dataLen);
        var buffer = new ArrayBuffer(preLen+dataLen);
        cc.log("bufferLen:"+buffer.byteLength);
        var u32a = new Uint32Array(buffer,0,2);//创建数组来传前8Bytes的内容
        u32a[0] = request.getRequestId();
        u32a[1] = buffer.byteLength;
        if(charArr){//添加参数部分
            var dv = new DataView(buffer);
            for(var i= 0;i<charArr.length;i++){
                dv.setUint8(preLen+i,charArr[i]);
                cc.log("offset:"+(preLen+i)+"char="+charArr[i]);
            }
        }
        this._webSocket.send(buffer);
        cc.log("on send:"+new TextDecoder('utf-8').decode(buffer.slice(8)));
        cc.log("=====cc.slots.DataManager request start=====");
        request.startTimeoutTimer(request.getResponseCallback());
    }
});
/**
 * 请求对象，目前要求有_requestId和_responseId。
 * @type {Function}
 */
cc.slots.net.Request = cc.Class.extend({
    _isTimeout:false,
    _timeout:cc.slots.net.DEFAULT_TIMEOUT,
    _params:null,
    _requestId:-1,
    _responseId:-1,
    _responseCallback:null,
    _timeoutCallback:null,
    _timeoutKey:null,
    /**
     * @param responseCallback 响应回调 function(jsonData){}
     * @param requestId 请求ID，目前为4Byte的无符号数字
     * @param responseId 响应ID，目前为4Byte的无符号数字
     * @param params 请求参数，为Json格式字符串，可为空
     */
    ctor:function(responseCallback,requestId,responseId,params){
        this._responseCallback = responseCallback;
        this._requestId = requestId;
        this._responseId = responseId;
        this._params = params;
    },
    startTimeoutTimer:function(timeoutCallback){
        if(timeoutCallback==null||this._isTimeout){
            return;
        }
        this._timeoutCallback = timeoutCallback;
        this._timeoutKey = this.__instanceId + "";
        //callback, target, interval, repeat, delay, paused, key
        cc.director.getScheduler().schedule(function(){
            this._isTimeout = true;
            this._timeoutCallback();
        },this, this._timeout, 0, 0, false,this._timeoutKey);
    },
    stopTimeoutTimer:function(){
        this._isTimeout = true;
        if(this._timeoutKey==null){
            return;
        }
        cc.director.getScheduler().unschedule(this._timeoutKey,this);
        cc.log("=====cc.slots.DataManager request finished=====");
    },
    getRequestId:function(){
        return this._requestId;
    },
    getResponseId:function(){
        return this._responseId;
    },
    getParams:function(){
        return this._params;
    },
    getResponseCallback:function(){
        if(this._isTimeout){
            return null;
        }
        return this._responseCallback;
    },
    isInvalid:function(){
        return this._isTimeout;
    }
});
