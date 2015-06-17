/**
 * Created by Administrator on 2015/6/3.
 */
var ViewFacade = function(){
    this.observerMap = [];
};
ViewFacade.instance = null;
ViewFacade.getInstance = function(){
    if(ViewFacade.instance == null)
    {
        ViewFacade.instance = new ViewFacade();
    }
    return ViewFacade.instance;
};
ViewFacade.prototype = {
    observerMap : null,

    /**
     * 保存所有Notify对应的Observer
     * 用Notify名称作为键
     **/
    addObserver : function(notificationName, observer){
        var observers = this.observerMap[ notificationName ];
        if( observers )
        {
            for( var i = 0; i < observers.length; i ++ )
            {
                if( observers[i] == observer )
                {
                    return;
                }
            }

            observers.push( observer );
        }
        else
        {
            this.observerMap[ notificationName ] = [ observer ];
        }
    },

    /**
     * 保存所有Notify对应的Observer
     * 用Notify名称作为键
     **/
    removeObserver : function(notificationName, observer){
        var observers = this.observerMap[ notificationName ];

        if(observers == null) return;

        for( var i = 0; i < observers.length; i ++ )
        {
            if( observers[i] == observer )
            {
                observers.splice(i,1);
                break;
            }
        }

        if ( observers.length == 0 )
        {
            delete this.observerMap[ notificationName ];
        }
    },

    notifyObserver : function(notification){
        if( this.observerMap[ notification.notificationName ] != null )
        {
            var observers_ref = this.observerMap[ notification.notificationName ];
            var observers = [];
            var observer;
            var i = 0;
            var len = observers_ref.length;
            for (i = 0; i < len; i ++)
            {
                observer = observers_ref[ i ];
                observers.push( observer );
            }

            len = observers.length;
            for (i = 0; i < len; i++)
            {
                observer = observers[ i ];
                observer.handleNotification( notification );
            }
        }
    },

    clearObserver : function(){
        this.observerMap = [];
    }
};
