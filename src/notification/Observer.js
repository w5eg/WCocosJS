/**
 * Created by Administrator on 2015/6/3.
 */
var Observer = cc.Scene.extend({
    _viewFacade:null,
    _childObserver:null,

    ctor: function () {
        this._super();

        this._viewFacade = ViewFacade.getInstance();

        this._childObserver = [];

        this.initObserver();
    },

    /**
     * 注册观察者
     *
     */
    registerObserver: function (notifyKey){
        this._viewFacade.addObserver(notifyKey, this);
        this._childObserver.push(notifyKey);
    },

    /**
     * 删除观察者
     *
     */
    removeObserver: function (notifyKey){
        this._viewFacade.removeObserver(notifyKey, this);
    },

    /**
     * 删除所有观察者
     *
     */
    removeAllObserver: function (){
        for(var key in this._childObserver){
            this.removeObserver(key);
        }
    },

    initObserver: function (){

    },

    handleNotification: function (notification){

    },

    onExit:function(){
        this.removeAllObserver();
        this._super();
    }
});