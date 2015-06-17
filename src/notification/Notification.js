/**
 * Created by Administrator on 2015/6/3.
 */
var Notification = function(name, data, type){
    this.notificationName = name;
    this.notificationData = data;
    this.notificationType = type;
};
Notification.prototype = {
    notificationName : "",
    notificationData : null,
    notificationType : ""
};