var Slots = cc.Sprite.extend({
	ctor:function(size){
		this._super();
		this.setContentSize(size);
	},
	onEnter:function(){
		this._super();
	},
	onExit:function(){
		this._super();
	},
});


var UsageLayerSlots = UsageBaseLayer.extend({
	_className:"UsageLayerSlots",
	ctor:function(){
		this._super();
		this.setupView();
	},
	setupView:function(){
		this._super();
	},
	onEnter:function(){
		this._super();
	},
});