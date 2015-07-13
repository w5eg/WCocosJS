cc.w.slots = {};
//老虎机属性
cc.w.slots.COLUMN_COUNT = 5;//一共多少列
cc.w.slots.ROW_COUNT = 3;//一共多少行,目前只支持三行
cc.w.slots.CELL_KIND_COUNT = 12;//图标种类数量
cc.w.slots.CYCLE_COUNT_MIN = 2;//最少要完成循滚动的次数,要求为偶数
cc.w.slots.CELL_IMAGES = [//图标所有种类的图片，目前有13种
                          "Icon_1",
                          "Icon_2",
                          "Icon_3",
                          "Icon_4",
                          "Icon_5",
                          "Icon_6",
                          "Icon_7",
                          "Icon_8",
                          "Icon_9",
//                          "Icon_10",
                          "Icon_a1",
                          "Icon_a2",
                          "Icon_a3"
                          ];
//全局变量
cc.w.slots.SLOTS_CELL_NODES = [];//存放所有SlotsCellNode
cc.w.slots.GROUP_NODE_HEIGHT = 0;
cc.w.slots.LINE_POINTS = null;//存放所有画线的点。在初始化老虎机是初始化
//老虎机执行模式，相当于压多少条线，目前只有最少和最多两种，最少为1条，最多（目前）为25条
cc.w.slots.SLOTS_LOOP_LINES_MIN = 1;//普通模式，花最少的钱
cc.w.slots.SLOTS_LOOP_LINES_MAX = -1;//加强模式，花最多的钱
cc.w.slots.SlotsLoopLines = cc.w.slots.SLOTS_LOOP_LINES_MIN;
/**
 * 老虎机阶段，分别为正常阶段和BOSS阶段，默认为普通阶段
 */
cc.w.slots.SLOTS_STAGE_NORMAL = 0;
cc.w.slots.SLOTS_STAGE_BOSS = 1;
cc.w.slots.STAGE = cc.w.slots.SLOTS_STAGE_NORMAL;
//老虎机状态
cc.w.slots.STATE_STOPED = 0;//表示静止
cc.w.slots.STATE_RUNNING = 1;//表示运行
cc.w.slots.STATE = cc.w.slots.STATE_STOPED;
//测试模式
cc.w.slots.MODE_DEBUG = false;//
cc.w.slots.MODE_DEBUG_SPEED = false;//
cc.w.slots.MODE_DEBUG_SlotsCellGroupNode = false;//
cc.w.slots.MODE_DEBUG_SlotsColumnNode = false;//
//老虎机结果
cc.w.slots.RESULT = null;//用于保存游戏结果数据，每次运行前会清除
cc.w.slots.CYCLE_COUNT = 0;//当前（第一列）循环滚动的次数（后面的列也要完成同样次数才能停止）
//监听的事件
cc.w.slots.EVENT_INIT = "cc.w.slots.EVENT_INIT";//老虎机执行运行事件,数据：cc.w.slots.Result对象
cc.w.slots.EVENT_START = "cc.w.slots.EVENT_START";//老虎机执行运行事件,数据：1为普通攻击，-1为强攻
cc.w.slots.EVENT_SHOW_LINE = "cc.w.slots.EVENT_SHOW_LINE";//老虎机执行显示线事件，数据：线数据在线数据数组中的索引
cc.w.slots.EVENT_RESULT = "cc.w.slots.EVENT_RESULT";//老虎机得到结果，数据：cc.w.slots.Result对象
cc.w.slots.EVENT_STAGE_CHANGED = "cc.w.slots.EVENT_STAGE_CHANGED";//老虎机阶段变化事件，目前只有两个阶段且不能回退，数据：0/1;0为普通阶段，1为BOSS阶段
cc.w.slots.EVENT_DO_SPECIAL_EFFECT = "cc.w.slots.EVENT_DO_SPECIAL_EFFECT";//老虎机执行特效事件，数据：0/1，表示特效事件列表索引
cc.w.slots.EVENT_RESET = "cc.w.slots.EVENT_GAME_RESET";//老虎机重置事件，主要就是把老虎机切换回第一阶段,数据无
//发出的事件
cc.w.slots.EVENT_CYCLED = "cc.w.slots.EVENT_CYCLED";//老虎机运行一个循环事件
cc.w.slots.EVENT_STOPPED = "cc.w.slots.EVENT_STOPPED";//老虎机停止事件(所有列都停止后调用)给外部使用
cc.w.slots.EVENT_SLOTS_STOPPED = "cc.w.slots.EVENT_SLOTS_STOPPED";//老虎机停止事件(所有列都停止后调用)内部使用
cc.w.slots.EVENT_LINE_SHOWN = "cc.w.slots.EVENT_LINE_SHOWN";//老虎机画一条线并播放线动画结束事件，数据：线分数
cc.w.slots.EVENT_ON_EFFECT_FINISHED = "cc.w.slots.EVENT_ON_EFFECT_FINISHED";//老虎机一次效果执行结束，发给中心用，有三个事件：画线结束，免费次数动画结束，加血动画结束，数据无
cc.w.slots.EVENT_ON_FREE_LOOP_FINISHED = "cc.w.slots.EVENT_ON_FREE_LOOP_FINISHED";//老虎机免费次数执行一次结束，数据无
cc.w.slots.EVENT_ON_BLOOD_INCREASE_FINISHED = "cc.w.slots.EVENT_ON_BLOOD_INCREASE_FINISHED";//老虎机加血特效执行一次结束，数据无
cc.w.slots.EVENT_AUTO_LOOP_MODE_CHANGED = "cc.w.slots.EVENT_AUTO_LOOP_MODE_CHANGED";//老虎机自动模式切换事件，数据：true/false;是否是自动执行模式
cc.w.slots.EVENT_BET_DONE = "cc.w.slots.EVENT_BET_DONE";//用户完成押注事件,数据：{"choice":value,"multiple":multiple}，choice为0/1，multiple为当前倍数值
//动画
/**开始运动动画*/
cc.w.slots.actionStart = function(){
//	var bounceDistance = 50;
//	var bounceAction = cc.moveBy(2, cc.p(0, bounceDistance)).easing(cc.easeBackIn());
	var duration = cc.w.slots.MODE_DEBUG_SPEED?0.5+5:0.5;
	var bounceAction2 = cc.moveBy(duration, cc.p(0, -cc.w.slots.GROUP_NODE_HEIGHT)).easing(cc.easeBackIn());
//	var seq = cc.sequence(bounceAction2)
//	return seq;
	return bounceAction2;
};
/**停止运动动画*/
cc.w.slots.actionStop = function(){
	var duration = cc.w.slots.MODE_DEBUG_SPEED?0.5+5:0.5;
	return cc.moveBy(duration, cc.p(0, -cc.w.slots.GROUP_NODE_HEIGHT)).easing(cc.easeBackOut());
};
/**匀速运动动画*/
cc.w.slots.actionConstant = function(){
	var duration = cc.w.slots.MODE_DEBUG_SPEED?0.2+1:0.2;
	return cc.moveBy(duration, cc.p(0, -cc.w.slots.GROUP_NODE_HEIGHT));
};
cc.w.slots.actionCellNode = function(){
	var duration = 0.5; 
	var a1 = cc.scaleTo(duration, 1.1);
	var a2 = cc.scaleTo(duration, 1.0);
	return cc.repeatForever(cc.sequence(a1,a2));
};
/////////////////////////////////////////////////////////////////////////////////////
/**
 * 老虎机一个CELL中的数据对象
 */
cc.w.slots.SlotCell = cc.Class.extend({
	_imageId:null,
});
/**
 * 通过图片ID来得到本地图片保存的路径
 * 图片ID为整数 1-13
 */
cc.w.slots.getCellImageById = function(imageId){
	if (imageId<=0||imageId>cc.w.slots.CELL_KIND_COUNT) {
		imageId = 1;
	}
	var index = imageId-1;
	return cc.w.slots.CELL_IMAGES[index];
};
cc.w.slots.getRandomImageId = function(){
	return cc.w.slots.getCellImageById(Math.ceil(cc.random0To1()*cc.w.slots.CELL_KIND_COUNT));
};
cc.w.slots.getLineAnimationLevel = function(score){
	/*11-20	1级特效
	  21-30	2级特效
	  31-40	3级特效
	  41-50	4级特效
	  51以上	5级特效*/
	var level = 0;
	if(score>=11)
		level = 1;
	if(score>=21)
		level = 2;
	if(score>=31)
		level = 3;
	if(score>=41)
		level = 4;
	if(score>=51)
		level = 5;
	return level;
};
cc.w.slots.getLineColor = function(lineId){
    var colorId = lineId%10;
    var color = null;
    switch (colorId){
        case 1:
            color = cc.color(255,0,0);
            break;
        case 2:
            color = cc.color(255,255,0);
            break;
        case 3:
            color = cc.color(0,0,255);
            break;
        case 4:
            color = cc.color(255,0,255);
            break;
        case 5:
            color = cc.color(255,125,0);
            break;
        case 6:
            color = cc.color(0,255,255);
            break;
        case 7:
            color = cc.color(133,58,26);
            break;
        case 8:
            color = cc.color(0,255,0);
            break;
        case 9:
            color = cc.color(125,0,255);
            break;
        default :
            color = cc.color(255,0,0);
            break;
    }
    return color;
};
cc.w.slots.doBigAniGold = function(score,parentNode,x,y,callBackOnAniOver,target){
    var level = cc.w.slots.getLineAnimationLevel(score);
    if(level<=1){
        if(callBackOnAniOver)callBackOnAniOver();
    	return null;
    }
    var aniName = "bigAniGold"+level;
    cc.log("PLAY BIG ANI:"+aniName);
    var ani = flax.assetsManager.createDisplay("res/anis.plist", aniName, {
		parent: parentNode,
		x: x,
		y: y
	});
    ani.autoDestroyWhenOver = true;
    if(callBackOnAniOver&&target){
        ani.onAnimationOver.add(callBackOnAniOver, target);
    }
    ani.play();
    return ani;
};
cc.w.slots.doBigAnimation = function(score,parentNode,x,y,callBackOnAniOver,target){
	var level = cc.w.slots.getLineAnimationLevel(score);
	if(level<=0){
        if(callBackOnAniOver)callBackOnAniOver();
		return;
	}
	var aniName = "lineBigAni"+level;
	cc.log("PLAY BIG ANI:"+aniName);
	var ani = flax.assetsManager.createDisplay("res/anis.plist", "lineBigAnis", {
		parent: parentNode,
		x: x,
		y: y
	});
	ani.autoDestroyWhenOver = true;
	if(callBackOnAniOver&&target){
		ani.onAnimationOver.add(callBackOnAniOver, target);
	}
	ani.gotoAndPlay(aniName);
	return ani;
};
cc.w.slots.doBloodAddAnimation = function(level,parentNode,x,y,callBackOnAniOver,target){
    if(level<=0){
        if(callBackOnAniOver)callBackOnAniOver();
    	return;
    }
    var aniName = "bloodAddAni"+level;
    cc.log("PLAY BIG ANI:"+aniName);
    var ani = flax.assetsManager.createDisplay("res/anis.plist", "bloodAddAnis", {
		parent: parentNode,
		x: x,
		y: y
	});
    ani.autoDestroyWhenOver = true;
    if(callBackOnAniOver&&target){
        ani.onAnimationOver.add(callBackOnAniOver, target);
    }
    ani.gotoAndPlay(aniName);
    return ani;
};
cc.w.slots.doFreeTimesAnimation = function(times,parentNode,x,y,callBackOnAniOver,target){
    var aniName = "aniFreeLoopMin";
    if(cc.w.slots.SlotsLoopLines == cc.w.slots.SLOTS_LOOP_LINES_MAX){
        aniName = "aniFreeLoopMax";
    }
    var ani = flax.assetsManager.createDisplay("res/anis.plist", aniName, {
		parent: parentNode,
		x: x,
		y: y
	});
    ani.autoDestroyWhenOver = true;
    if(callBackOnAniOver&&target){
        ani.onAnimationOver.add(callBackOnAniOver, target);
    }
    ani.play();
    return ani;
};
/**
 * 计算SlotsCellNode的索引
 * colIndex SlotsCellNode所有列索引
 * groupCellIndex SlotsCellNode所在SlotsCellGroupNode的索引（top=0,center=1,bottom=2）
 */
cc.w.slots.computeCellNodeIndex = function(colIndex,groupCellIndex){
	var index = groupCellIndex*cc.w.slots.COLUMN_COUNT+colIndex;
//	cc.log("CELL_INDEX = "+index + "(colIndex="+colIndex+" groupCellIndex="+groupCellIndex+")");
	return index;
};
/////////////////////////////////////////////////////////////////////////////////////
/**
 * 线对象
 */
cc.w.slots.Line = cc.Class.extend({
    lineId:0,//线ID
	len:2,//连了几个，最少两个
    score:0,
	_linePints:null,//组成线的所有点
	color:null,//线的颜色
	toString:function(){
		return "\n(Line){len="+this.len
//		+";linePints=\n"+this._linePints
		+";score=\n"+this.score
		+"}"
	},
	getPoints:function(){
		return this._linePints;
	},
	addPoint:function(linePoint){
		if (this._linePints==null) {
			this._linePints = [];
		}
		this._linePints.push(linePoint);
	}
});
/**
 * specialEffect "x,...x:y" x为点索引，y为特效类型, 1表示免费次数，2表示加血
 */
cc.w.slots.SLOTS_SPECIAL_EFFECT_TYPE_FL = 1;//免费次数
cc.w.slots.SLOTS_SPECIAL_EFFECT_TYPE_BL = 2;//加血
cc.w.slots.SpecialEffect = cc.Class.extend({
	linePointIndexes:null,//所有点的索引
	toString:function(){
		return "\n(SpecialEffect){type="+this.type
		+";linePointIndexes="+this.linePointIndexes
		+"}"
	},
    type:1,//1表示免费次数，2表示加血
    getLevel:function(){//目前免费次数和加血的逻辑是一样的
        var len = 0;
        if(this.linePointIndexes){
            len = this.linePointIndexes.length;
        }
        switch (len){
            case 3:
                return 1;
            case 4:
                return 2;
            case 5:
                return 3;
            default :
                return 0;
        }
    }//表示加血等级
});
/**
 * 组成线的点对象
 */
cc.w.slots.LinePoint = cc.Class.extend({
	_rect:null,
	_lines:null,//这个连线的点所关联的线们，一或多个
	index:0,//点在所有SlotsCellNode中的位置0-14，也就是SlotsCellNode的索引
	preOne:null,//当前点的前一个点
	nextOne:null,//当前点的后一个点
	setRect:function(rect){
		this._rect = rect;
	},
	getRect:function(){
		return this._rect;
	},
	reset:function(){
		this._rect = null;
		this._lines = null;
		this.preOne = null;
		this.nextOne = null;
	},
	toString:function(){
		return "\n(LinePoint)" +
				"{index="+this.index+";rect="+this._rect
				+";lines:"+(this._lines==null?0:this._lines.length)
				+"}"
	},
	relateToLine:function(line){
		if (this._lines==null) {
			this._lines = [];
		}else if(this._lines.indexOf(line)!=-1){
			return;
		}
		this._lines.push(line);
	},
	/**
	 * 根据当前传入的线和矩形来计算点的坐标
	 */
	computePointOfLine:function(line,hasOffset){
		if (this._lines==null||this._lines.length==0||this._rect==null) {
			cc.w.log.e("cc.w.slots.LinePoint", "this._lines==null||this.rect==null");
			return [cc.p(0, 0)];
		}
		var posX = this._rect.x + this._rect.width/2;
		var posY = this._rect.y - this._rect.height/2;

        //if(hasOffset){
        //    var linesCount = this._lines.length;
        //    var index = this._lines.indexOf(line);
        //
        //    if (index!=-1) {
        //        var top = this._rect.y;//+this._rect.height;
        //        posY = top - (index)*( this._rect.height/(linesCount+1) );
        //    }
        //}

		var points = [];
		var centerPoint = cc.p(posX,posY);
		
		
		if (this.preOne==null&&this.nextOne!=null) {
			posX = this._rect.x;
			points.push(cc.p(posX, posY));
		}
		
		points.push(centerPoint);
		
		if (this.preOne!=null&&this.nextOne==null) {
			posX = this._rect.x + this._rect.width;
			points.push(cc.p(posX, posY));
		}

		return points;
	}
});
/**
 * 押注数据
 */
cc.w.slots.BetData = cc.Class.extend({
	cost:0,//一次押注要花费的,但最终显示时还要乘以倍数
	multiples:[1,2,5],//倍数,默认使用倍数数组中的第一个
	//前两个参数可能是从房间数据得到的
	pond:0,//奖池总金额，每次押注会增加金额。
});

/**
 * 老虎机结果对象
 */
cc.w.slots.Result = cc.Class.extend({
	_minLoopCost:0,//普通攻击花费
	_maxLoopCost:0,//强攻花费
	score:0,//总分数
	stage:0,//阶段,0表示老虎机阶段（普通阶段）1表示押注阶段（BOSS阶段）
	isAutoLoopMode:false,//是否是自动执行模式
    loopLines:0,//老虎机执行模式，相当于压多少条线，目前只有最少和最多两种，最少为1条，最多（目前）为25条
	_images:null,//结果图标集合，目前一共15个位置，共13种图片，ID为1-13
	_lines:null,//线动画+特效的数据组合在一起就是"x,x,x,x,x:y",x表线的位置，y表示连了几个图标
	_specialEffects:null,
	_betData:null,
	_isFreeLoopMode:null,
	_freeLoopTime:0,
	/**
	 * 因为要计算点与线的关联，所以点被定义为全局变量，用完后要还原
	 */
	reset:function(){
		if (this._lines==null){
			return;
		}
		for (var i = 0; i < this._lines.length; i++){
			var line = this._lines[i];
			var lps = line.getPoints();
			if (lps!=null) {
				for (var j = 0; j < lps.length; j++){
					var lp = lps[j];
					lp.reset();
				}
			}
		}
	},
    setLoopData:function(minLoopCost,maxLoopCost){
        this._minLoopCost = minLoopCost;
        this._maxLoopCost = maxLoopCost;
    },
	setImages:function(images){
		this._images = images;
	},
	setImagesData:function(data){
		var resultArray = data.split(",");
		this.setImages(resultArray);
	},
	getImages:function(){
		return this._images;
	},
	setSpecialEffectsData:function(data){
		if (data==null||data.length==0) {
			return;
		}
		
		this._specialEffects = [];
		
		for (var seIdx = 0; seIdx < data.length; seIdx++) {
			var pointsData = data[seIdx];
			var pointsDataArray = pointsData.split(":");
			if (pointsDataArray.length==2) {
				var se = new cc.w.slots.SpecialEffect();
				var linePointIndexes = pointsDataArray[0].split(",");
				var type = pointsDataArray[1];
				se.type = type;
				se.linePointIndexes = linePointIndexes;
				this._specialEffects.push(se);
			}else{
				cc.w.log.e("cc.w.slots.Result", "老虎机结果数据解析错误")
			}
		}
	},
	getSpecialEffects:function(){
		return this._specialEffects;
	},
	setLinesData:function(data){
		if (data==null||data.length==0) {
			return;
		}
		
		this._lines = [];
		
		for (var lineIndex = 0; lineIndex < data.length; lineIndex++) {
			var lineData = data[lineIndex];
			var lineDataArray = lineData.split(":");
			if (lineDataArray.length>=4) {
				var line = new cc.w.slots.Line();
				var linePointIndexes = lineDataArray[0].split(",");
				var lineLen = Number(lineDataArray[1]);
                var score = Number(lineDataArray[2]);
                var lineId = Number(lineDataArray[3]);
				line.len = lineLen;
                line.score = score;
                line.lineId = lineId;
				var prePoint = null;
				for (var i = 0; i < linePointIndexes.length; i++) {
					var idx = linePointIndexes[i];
					var point = cc.w.slots.LINE_POINTS[idx];
					line.addPoint(point);
					point.relateToLine(line);
					point.preOne = prePoint;
					if (prePoint!=null) {
						prePoint.nextOne = point;
					}
					prePoint = point;
				}
				this._lines.push(line);
			}else{
				cc.w.log.e("cc.w.slots.Result", "老虎机结果数据解析错误")
			}
//			cc.log("cc.w.slots.Result.getLines"+this.getLines());
//			cc.log("cc.w.slots.LINE_POINTS"+cc.w.slots.LINE_POINTS);
		}
	},
	getLines:function(){
		return this._lines;
	},
	/**
	 *betPond = 0;
	 *betCost = 1000;
	 *betMultiples = "1,2,5";
	 */
	setBetData:function(pond,cost,multiplesStr){
		var betData = new cc.w.slots.BetData();
		betData.pond = pond;
		betData.cost = cost;
		betData.multiples = multiplesStr.split(",");
		this._betData = betData;
	},
	getBetData:function(){
		return this._betData;
	},
	setFreeLoopData:function(isFreeLoopMode,freeLoopTime){
		this._isFreeLoopMode = isFreeLoopMode;
        this._freeLoopTime = freeLoopTime;
	},
	isFreeLoopMode:function(){
		return this._isFreeLoopMode;
	},
	getFreeLoopTime:function(){
		return this._freeLoopTime;
	}
});
cc.w.slots.stopAllCellAnimations = function(){
    for(var i=0; i<cc.w.slots.SLOTS_CELL_NODES.length;i++){
        cc.w.slots.SLOTS_CELL_NODES[i].reset();
    }
};
/////////////////////////////////////////////////////////////////////////////////////
//cc.w.view.LineCellNode = cc.Node.extend({
//});
/**
 * 显示线的组件
 */
cc.w.slots.LinesNode = cc.Node.extend({//TODO
	_cellRectWidth:0,//每个格子的宽
	_cellRectHeight:0,//每个格子的高
	_clippingNode:null,
	_drawNode:null,
	ctor:function(size,height){
		this._super();
		this.setContentSize(size,height);
//		this.setAnchorPoint(0.5, 0.5);
		
//		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
//		layer.setContentSize(this.getContentSize());
//		this.addChild(layer);
//		layer.setOpacity(150);
		
		this._clippingNode = new cc.ClippingNode(this.createRectStencil(size, height));
		this._clippingNode.setInverted(false);
		this.addChild(this._clippingNode);
		
		this.setupView();
//		this.updateView();
	},
	setupView:function(){
		
		this._drawNode = new cc.DrawNode();
		this._clippingNode.addChild(this._drawNode, 1);
		if (cc.w.slots.LINE_POINTS==null) {
			cc.w.slots.LINE_POINTS = [];
			for (var i = 0; i < cc.w.slots.COLUMN_COUNT*cc.w.slots.ROW_COUNT; i++) {
				var linePoint = new cc.w.slots.LinePoint();
				linePoint.index = i;
				cc.w.slots.LINE_POINTS[i] = linePoint;
			}
		}
//		cc.log("cc.w.slots.LINE_POINTS = "+cc.w.slots.LINE_POINTS);
	},
	updateView:function(){
//		this.removeAllChildren();
		if (cc.w.slots.RESULT==null||cc.w.slots.RESULT.getLines()==null) {
			return;
		}
		var width = this.getContentSize().width;
		var height = this.getContentSize().height;
		this._cellRectWidth = width/cc.w.slots.COLUMN_COUNT;
		this._cellRectHeight = height/cc.w.slots.ROW_COUNT;
		var totalCount = cc.w.slots.LINE_POINTS.length;
		for (var i = 0; i < totalCount; i++) {
			var linePoint = cc.w.slots.LINE_POINTS[i];
			var col = i%cc.w.slots.COLUMN_COUNT;
			var row = Math.floor(i/cc.w.slots.COLUMN_COUNT);
			var x = col*this._cellRectWidth;
			var y = height-row*this._cellRectHeight;
			var rect = cc.rect(x, y, this._cellRectWidth, this._cellRectHeight);
			linePoint.setRect(rect);
//			cc.log("######@@@@###### "+rect.x+"  "+rect.y);
//			cc.log("######@@@@###### "+row+"  "+col);
//			cc.log("######@@@@###### "+(row*cc.w.slots.COLUMN_COUNT+col));
		}
	},
	reset:function(){
		this._drawNode.clear();
	},
    drawSingleLine:function(line,hasOffset){
        if (line==null||line.getPoints()==null||line.getPoints().length==0) {
            return false;
        }
        var lineSize = 15;
        var positions = [];
        var lineColor = cc.w.slots.getLineColor(line.lineId);
        //转化linePoint to cc.p()数组，并画线
        for (var i = 0; i < line.getPoints().length; i++) {
            var point = line.getPoints()[i];
            var pos =
//				cc.p(point.getRect().x,point.getRect().y);
                point.computePointOfLine(line,hasOffset);
            for (var posIndex = 0; posIndex < pos.length; posIndex++) {
                positions.push(pos[posIndex]);
            }
            //TEST
//			this._drawNode.drawDot(pos, 5, cc.color(0, 0, 255, 128));
            //END TEST
        }
        var lineCount = 5;
        var midIndex = 2;
        lineSize/=lineCount;
        for(var i=0;i<lineCount;i++){
            if(i==midIndex){
                this._drawNode.drawCardinalSpline(positions, 1, 100, lineSize, lineColor);
                continue;
            }
            var newPositions;
            var mOffset = Math.abs(midIndex-i)-1;
            //cc.log("wwwwwwwwwwwwwwww"+mOffset);
            //if(mOffset>0){
            //    var offset = cc.p(0,(midIndex-i)*lineSize-lineSize/2*mOffset);
            //    newPositions = cc.w.util.makeOffsetPositions(positions,offset);
                //this._drawNode.drawCardinalSpline(newPositions, 1, 100, lineSize, lineColor);
            //}else{

            //}

            if(i<midIndex){
                var offset = cc.p(0,((lineSize-1)*mOffset)+lineSize/2);
                newPositions = cc.w.util.makeOffsetPositions(positions,offset);
                var colorOffset = -(mOffset+1)*50;
                var color = cc.color(
                    this._getNewColorValue(lineColor.r,colorOffset),
                    this._getNewColorValue(lineColor.g,colorOffset),
                    this._getNewColorValue(lineColor.b,colorOffset)
                );
                this._drawNode.drawCardinalSpline(newPositions, 1, 100, lineSize, color);
            }else{
                var offset = cc.p(0,(-(lineSize-1)*mOffset)-lineSize/2);
                newPositions = cc.w.util.makeOffsetPositions(positions,offset);
                var colorOffset = (mOffset+1)*50;
                var color = cc.color(
                    this._getNewColorValue(lineColor.r,colorOffset),
                    this._getNewColorValue(lineColor.g,colorOffset),
                    this._getNewColorValue(lineColor.b,colorOffset)
                );
                this._drawNode.drawCardinalSpline(newPositions, 1, 100, lineSize, color);
            }
        }
        return true;
    },
    _getNewColorValue:function(oColorValue,offsetValue){
        //var mOffsetValue = Math.abs(offsetValue);
        var newColorValue = oColorValue+offsetValue;
        //if(offsetValue<0){
        //    newColorValue = oColorValue-oColorValue*mOffsetValue;
        //}
        newColorValue = newColorValue<0?0:newColorValue;
        newColorValue = newColorValue>255?255:newColorValue;
        return newColorValue;
    },
    drawAllLines:function(){
        if (cc.w.slots.RESULT==null||cc.w.slots.RESULT.getLines()==null) {
            return;
        }
        this._drawNode.clear();
        for(var i=0;i<cc.w.slots.RESULT.getLines().length;i++){
            var line = cc.w.slots.RESULT.getLines()[i];
            this.drawSingleLine(line,true);
        }
    },
	_currentLineIndex:-1,
	drawLine:function(lineIndex){
		this._drawNode.clear();
		this._currentLineIndex = lineIndex;
		if (cc.w.slots.RESULT==null||cc.w.slots.RESULT.getLines()==null||cc.w.slots.RESULT.getLines().length<lineIndex) {
			return;
		}
		var line = cc.w.slots.RESULT.getLines()[lineIndex];
		if (!this.drawSingleLine(line)) {
			return;
		}

        cc.w.slots.stopAllCellAnimations();
		for (var i = 0; i < line.getPoints().length; i++) {
			var point = line.getPoints()[i];
            if(i<line.len){
                var cellNode = cc.w.slots.SLOTS_CELL_NODES[point.index];
                cellNode.doCellAnimation(this);
            }
		}

		//var action1 = cc.blink(1, 3);
		var action1 = cc.delayTime(0.1);
		var callback = cc.callFunc(this.onLineShown, this);
		var seq = cc.sequence(action1,callback);
		this._drawNode.runAction(seq);
//		var action = cc.fadeOut(0.5);
//		this._drawNode.runAction(cc.repeat(cc.sequence(action,action.reverse()),-1));
	},
	onLineShown:function(){
		//this._drawNode.setVisible(false);
		//cc.w.slots.stopAllCellAnimations();
		cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_LINE_SHOWN,this._currentLineIndex);
	},
	createRectStencil:function(size,height){
		var stencil = new cc.DrawNode();
		var color = cc.color(255,255,255,0);
		//宽度传0好像还是会有宽度？
		stencil.drawRect(cc.p(0, 0), cc.p(size,height), color, 0.00001, color);
		return stencil;
	},
	onEnter:function(){
		this._super();
	},
	onExit:function(){
		this._super();
	}
});
/////////////////////////////////////////////////////////////////////////////////////
/**
 * 老虎机的格子，一个格子显示一个图案，有一定的分数
 */
cc.w.view.SlotsCellNode = cc.Node.extend({
	_index:0,
	_imageSprite:null,
	_clippingNode:null,
	_cellNodeAni:null,
	ctor:function(size,height){
		this._super();
		this.setContentSize(size,height);
//		this.setAnchorPoint(0.5, 0.5);0
//		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
//		layer.setContentSize(this.getContentSize());
//		this.addChild(layer);
		this.setupView(size, height);
	},
	setupView:function(size, height){
		//this._clippingNode = new cc.ClippingNode(this.createRectStencil(size, height));
		//this._clippingNode.setInverted(false);
		//this.addChild(this._clippingNode);
		
		this._imageSprite = new cc.MenuItemSprite();
		this._imageSprite.setAnchorPoint(0, 0);
		this._imageSprite.setContentSize(this.getContentSize());
		this.addChild(this._imageSprite);
		this.setImage(cc.w.slots.getRandomImageId());
	},
	setImage:function(path){
		var sp = flax.assetsManager.createDisplay(slotIconRes.slotIcon, path)//new cc.Sprite(path);
		if (this.getContentSize().width<sp.getContentSize().width) {
			var scaleValue = this.getContentSize().width/sp.getContentSize().width;
			sp.setScale(scaleValue, scaleValue);
		}else{
			sp.setPosition(this.getContentSize().width/2-sp.getContentSize().width/2, this.getContentSize().height/2-sp.getContentSize().height/2);
		}
		this._imageSprite.setNormalImage(sp);
	},
	createRectStencil:function(size,height){
		var stencil = new cc.DrawNode();
		var color = cc.color(255,255,255,0);
		//宽度传0好像还是会有宽度？
		stencil.drawRect(cc.p(0, 0), cc.p(size,height), color, 0.00001, color);
		return stencil;
		//var sp = new cc.Sprite("res/btn.png");
		//sp.setAnchorPoint(cc.p());
		//return sp;
	},
	getIndex:function(){
		return this._index;
	},
	setIndex:function(index){
		this._index = index;
	},
    _aniParent:null,
	doCellAnimation:function(parent){
        this._aniParent = parent;
        var point = cc.w.slots.LINE_POINTS[this._index];
        if(point==null||point.getRect()==null){
        	return;
        }
        var x = point.getRect().x-35;
        var y = point.getRect().y+35;
        if(this._cellNodeAni==null) {
            this._cellNodeAni = flax.assetsManager.createDisplay("res/anis.plist", "slotsCellNodeAni", {
                parent: parent,
                x: x,
                y: y
            });
            this._cellNodeAni.play();
        }
	},
	reset:function(){
		this.stopAllActions();
        if(this._cellNodeAni&&this._aniParent) {
            this._cellNodeAni.stop();
            this._aniParent.removeChild(this._cellNodeAni);
            this._cellNodeAni = null;
        }
	}
});;
/**
 *格子组， 实现老虎机动画时的辅助组件，一个格子组里面有三个格子（SlotsCell）
 */
cc.w.view.SlotsCellGroupNode = cc.Node.extend({
	_cellNodeTop:null,
	_cellNodeCenter:null,
	_cellNodeBottom:null,
	_colIndex:0,//列索引，主要用于计算当前group中的cell对应和图片ID
//	_isLeader:false,//是否是头
	ctor:function(colIndex,size,height){
		this._super();
		this.setContentSize(size,height);
		this._colIndex = colIndex;
		cc.w.slots.GROUP_NODE_HEIGHT = height;
//		this.setAnchorPoint(0.5, 0.5);0
//		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
//		layer.setOpacity(30);
//		layer.setContentSize(this.getContentSize());
//		this.addChild(layer);
		
		this.setupView();
	},
//	setLeader:function(isLeader){
//		this._isLeader = isLeader;
//	},
//	isLeader:function(){
//		return this._isLeader;
//	},
	setColIndex:function(colIndex){
		this._colIndex = colIndex;
	},
	getColIndex:function(){
		return this._colIndex;
	},
//	setOpacity:function(newValue){
//		this._super(newValue);
//		for ( var c in this.getChildren()) {
//			c.setOpacity(newValue);
//		}
//	},
	setupView:function(){
		var cellCount = cc.w.slots.ROW_COUNT;
		var cellWidth = this.getContentSize().width;
		var cellHeight = this.getContentSize().height/cellCount;
		var fs = 10;
		for (var i = 0; i < cellCount; i++) {
			var cellNode = new cc.w.view.SlotsCellNode(cellWidth,cellHeight);
			cellNode.setPosition(0, cellHeight*i);
			if (i==2) {
				this._cellNodeTop = cellNode;
				var index = cc.w.slots.computeCellNodeIndex(this._colIndex, 0);
				this._cellNodeTop.setIndex(index);
//				cc.w.slots.SLOTS_CELL_NODES[index] = this._cellNodeTop;
				if (cc.w.slots.MODE_DEBUG_SlotsCellGroupNode) {
					var label = new cc.LabelTTF("TOP","Arial",fs);
					label.setTag(1001);
					label.setColor(cc.color(255, 255, 0, 255));
					label.setPosition(cellWidth/2, cellHeight/2);
					cellNode.addChild(label);
				}
			}
			if (i==1) {
				this._cellNodeCenter = cellNode;
				var index = cc.w.slots.computeCellNodeIndex(this._colIndex, 1);
				this._cellNodeCenter.setIndex(index);
//				cc.w.slots.SLOTS_CELL_NODES[index] = this._cellNodeCenter;
				if (cc.w.slots.MODE_DEBUG_SlotsCellGroupNode) {
					var label = new cc.LabelTTF("CENTER","Arial",fs);
					label.setTag(1002);
					label.setColor(cc.color(255, 255, 0, 255));
					label.setPosition(cellWidth/2, cellHeight/2);
					cellNode.addChild(label);
				}
			}
			if (i==0) {
				this._cellNodeBottom = cellNode;
				var index = cc.w.slots.computeCellNodeIndex(this._colIndex, 2);
				this._cellNodeBottom.setIndex(index);
//				cc.w.slots.SLOTS_CELL_NODES[index] = this._cellNodeBottom;
				if (cc.w.slots.MODE_DEBUG_SlotsCellGroupNode) {
					var label = new cc.LabelTTF("BOTTOM","Arial",fs);
					label.setTag(1003);
					label.setColor(cc.color(255, 255, 0, 255));
					label.setPosition(cellWidth/2, cellHeight/2);
					cellNode.addChild(label);
				}
			}
			this.addChild(cellNode);
		}
	},
	updateView:function(){
		if (cc.w.slots.RESULT==null) {
			return;
		}
		this._cellNodeTop.setImage(cc.w.slots.getCellImageById(cc.w.slots.RESULT.getImages()[this._cellNodeTop.getIndex()]));
		this._cellNodeCenter.setImage(cc.w.slots.getCellImageById(cc.w.slots.RESULT.getImages()[this._cellNodeCenter.getIndex()]));
		this._cellNodeBottom.setImage(cc.w.slots.getCellImageById(cc.w.slots.RESULT.getImages()[this._cellNodeBottom.getIndex()]));
		cc.w.slots.SLOTS_CELL_NODES[this._cellNodeTop.getIndex()] = this._cellNodeTop;
		cc.w.slots.SLOTS_CELL_NODES[this._cellNodeCenter.getIndex()] = this._cellNodeCenter;
		cc.w.slots.SLOTS_CELL_NODES[this._cellNodeBottom.getIndex()] = this._cellNodeBottom;
		cc.log("=====update cell====="+this._colIndex);
	},
	reset:function(){
		//TODO STH
		this._cellNodeTop.reset();
		this._cellNodeCenter.reset();
		this._cellNodeBottom.reset();
	}
});

/**
 * 老虎机的五个竖列中的一个，里面存放四个CELL组（SlotsCellGroupNode）
 */
cc.w.view.SlotsColumnNode = cc.Node.extend({
	_clippingNode:null,
    _groups:null,
    _headGroup:null,
    _commonGroups:null,
	_groupHeight:0,
	_state:0,
	_result:null,
	_isFirstCol:false,
	_index:0,
	ctor:function(index,size,height){
		this._super();
		this.setContentSize(size,height);
		this._index = index;
		this._clippingNode = new cc.ClippingNode(this.createRectStencil(size, height));
		this._clippingNode.setInverted(false);
		this.addChild(this._clippingNode);

//		this.setAnchorPoint(0.5, 0.5);
//		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
//		layer.setContentSize(this.getContentSize());
//		this.addClippedChild(layer);
		this.setupView();
	},
	setupView:function(){
		this.reset();
		this._groups = [];
		this._commonGroups = [];
		//每一列有四个组。
		var groupCount = 4;
		var groupWidth = this.getContentSize().width;
		var groupHeight = this.getContentSize().height;
		this._groupHeight = groupHeight;
		for (var i = 0; i < groupCount; i++) {
			var group = new cc.w.view.SlotsCellGroupNode(this._index,groupWidth,groupHeight);
//			group.setColIndex(this._index);
			if (i==0) {
//				group.setLeader(true);
				this._headGroup = group;
			}else{
//				group.setLeader(false);
				this._commonGroups.push(group);
			}
//			group.setOpacity(5);
			group.setPosition(0, this.getContentSize().height*2-i*groupHeight);
			this.addClippedChild(group);
			if (cc.w.slots.MODE_DEBUG_SlotsColumnNode) {
				var label = new cc.LabelTTF("Group"+i,"Arial",30);
				label.setTag(1003);
				label.setColor(cc.color(0, 255, 0, 255));
				label.setPosition(groupWidth/2, groupHeight/2);
				group.addChild(label);
			}
			this._groups.push(group);
		}
	},
	updateView:function(){
		this._commonGroups[0].updateView();
	},
	addClippedChild:function(child){
		if (cc.w.slots.MODE_DEBUG) {
			this.addChild(child);
		}else{
			this._clippingNode.addChild(child);
		}
	},
	createRectStencil:function(size,height){
		var stencil = new cc.DrawNode();
		var color = cc.color(255,255,255,0);
		//宽度传0好像还是会有宽度？
		stencil.drawRect(cc.p(0, 0), cc.p(size,height), color, 0.00001, color);
		//以四个点确定的形状作为模版。至少要三个点才能确定形状
//		var rectangle = [
//		cc.p(0, 0),
//		cc.p(this.getContentSize().width, 0),
//		cc.p(this.getContentSize().width, this.getContentSize().height),
//		cc.p(0, this.getContentSize().height)
//		];
//		stencil.drawPoly(rectangle, color, 0, color);
//		var center = cc.p(this.getContentSize().width/2, this.getContentSize().height/2);
//		var radius = this.getContentSize().width/2;
//		stencil.drawDot(center, radius, color) 
//		stencil.drawCircle(center, radius, 360, 360, false, 0, color);
		return stencil;
	},
	reset:function(){
		//设置数据为初始状态
		this._cycleCount = 0;
		this._result = null;
		this._state = cc.w.slots.STATE_STOPED;
		this.adjust();
	},
	resetCells:function(){
		if(this._commonGroups!=null)this._commonGroups[1].reset();
	},
	onSlotsStopped:function(){
		cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_SLOTS_STOPPED);
	},
	start:function(){
		//如果当前是运行状态并且有结果数据则的停止运行
		if (this._state == cc.w.slots.STATE_RUNNING&&this._result!=null) {
			if (this.getIndex()==cc.w.slots.COLUMN_COUNT-1) {//当最后一列也停止后，表示整个老虎机停止
				this.onSlotsStopped();
			}
			return;
		}
		if (cc.w.slots.CYCLE_COUNT!=0&&this._cycleCount>=cc.w.slots.CYCLE_COUNT) {
			this._result = cc.w.slots.RESULT;
		}
		if (cc.w.slots.CYCLE_COUNT==0&&cc.w.slots.RESULT!=null&&this.isFirstCol()&&this._cycleCount>=cc.w.slots.CYCLE_COUNT_MIN) {
			cc.w.slots.CYCLE_COUNT = this._cycleCount;
			this._result = cc.w.slots.RESULT;
		}
		
//		cc.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"+cc.w.slots.STATE);
		this.adjust();
		for (var i = 0; i < this._groups.length; i++) {
			var group = this._groups[i];
			var action ;
			if(this._state == cc.w.slots.STATE_STOPED){//如果当前状态是停止，做开始动画
				action = cc.w.slots.actionStart();
			}else{//当前状态不是停止状态（也就是运行状态）时，如果有结果，执行停止动画，否则执行匀速动画
				if (this._result==null) {
					action = cc.w.slots.actionConstant();
				}else{
					action = cc.w.slots.actionStop();
					if(i==0)this.updateView();
				}
			}
			if (group === this._headGroup) {
//				cc.log("group isLeader");
				var callback = cc.callFunc(this.onCycled, this);
				var seq = cc.sequence(action,callback);
				group.runAction(seq);
			}else{ 
//				cc.log("group is not Leader");
				group.runAction(action);
			}
		}
	},
	stop:function(){
		//强制停止动画，恢复到初始状态
		this.reset();
	},
	/**
	 * 因为动画使用的是moveBy,所以第一个循环做一次位置校正 TO-DO:考虑使用moveTo,计算具体坐标，并传参数给动画方法
	 */
	adjust:function(){
		if (this._commonGroups==null) {
			return;
		}
		for (var i = 0; i < this._commonGroups.length; i++) {
			var group = this._commonGroups[i];
			group.setPosition(0, this.getContentSize().height-i*this._groupHeight);
		}
	},
	_cycleCount:0,
	onCycled:function(){
		this._cycleCount+=1;
		if(this.isFirstCol())cc.log("=========onCycled========="+this._cycleCount);
		if (this._state == cc.w.slots.STATE_STOPED) {
			this._state = cc.w.slots.STATE_RUNNING;
		}
		cc.w.slots.STATE = this._state;
		cc.eventManager.dispatchCustomEvent(cc.w.slots.EVENT_CYCLED);
		var oldHeaderGroup = this._headGroup;
//		oldHeaderGroup.setLeader(false);
		this._headGroup = this._commonGroups.pop();
//		this._headGroup.setLeader(false);
		this._commonGroups.reverse();
		this._commonGroups.push(oldHeaderGroup);
		this._commonGroups.reverse();
		this._headGroup.setPosition(0, this.getContentSize().height*2-0*this._groupHeight);
		this.start();
	},
	setFirstCol:function(isFirstCol){
		this._isFirstCol = isFirstCol;
	},
	isFirstCol:function(){
		return this._isFirstCol;
	},
	getIndex:function(){
		return this._index;
	},
	setIndex:function(index){
		this._index = index;
	}
});

/**
 * 老虎机,由五个SlotsColumnNode组成
 */
//如果要做从左到右延时运行的效果，可以考虑是初始化SlotsColumnNode时加延时ACTION
cc.w.view.SlotsNode = cc.Node.extend({//TODO change cc.w.view to cc.w.slots
	_columnNodes:null,
	_linesNode:null,
	ctor:function(size,height){
		this._super();
		this.setContentSize(size,height);
		this.setAnchorPoint(0.5, 0.5);
		this.setupView();
		this.setupLinesNode(size, height);
	},
	setupLinesNode:function(width,height){
		this._linesNode = new cc.w.slots.LinesNode(width,height);
		this.addChild(this._linesNode);
		this._linesNode.setLocalZOrder(10);
	},
	updateView:function(){
		if(this._linesNode!=null)this._linesNode.updateView();
	},
	drawLine:function(lineIndex){
		if(this._linesNode!=null)this._linesNode.drawLine(lineIndex);
	},
    drawAllLines:function(){
        if(this._linesNode!=null)this._linesNode.drawAllLines();
    },
	setupView:function(){
		//init the actions //cc.delayTime(5);
//		this.ignoreAnchorPointForPosition(false);
//		var layer = new cc.LayerColor(cc.color(cc.random0To1()*205,cc.random0To1()*205, cc.random0To1()*205, 255));
//		layer.setContentSize(this.getContentSize());
//		this.addChild(layer);
//		var sp = new cc.Sprite("res/CloseNormal.png");
//		sp.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
//		this.addChild(sp);
		this._columnNodes = [];
		var columnNodeWidth = this.getContentSize().width/cc.w.slots.COLUMN_COUNT;
		var columnNodeHeight = this.getContentSize().height;
		for (var i = 0; i < cc.w.slots.COLUMN_COUNT; i++) {
			var columnNode = new cc.w.view.SlotsColumnNode(i,columnNodeWidth,columnNodeHeight);
			if (i==0) {
				columnNode.setFirstCol(true);
			}
			columnNode.setIndex(i);
			columnNode.setPosition(columnNodeWidth*i, 0);
			this.addChild(columnNode);
			this._columnNodes.push(columnNode);
			if (cc.w.slots.MODE_DEBUG) {
				var label = new cc.LabelTTF(""+i,"Arial",50);
				label.setColor(cc.color(255, 0, 0, 255));
				label.setPosition(columnNodeWidth/2, columnNodeHeight/2);
				columnNode.addChild(label);
			}
		}

		var event_stopped = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			eventName: cc.w.slots.EVENT_SLOTS_STOPPED,
			callback: function(event){
				if (event!=null) {
					var target = event.getCurrentTarget();
					cc.w.slots.STATE = cc.w.slots.STATE_STOPED;
					target.updateView();
                    target.drawAllLines();
				}
			}
		});    
		cc.eventManager.addListener(event_stopped, this);
		//--------------
		var event_start = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			eventName: cc.w.slots.EVENT_START,
			callback: function(event){
				if (event!=null) {
					var target = event.getCurrentTarget();
					target.reset();
					target.start();
				}
			}
		});    
		cc.eventManager.addListener(event_start, this);
		//-----------------
		var event_show_line = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			eventName: cc.w.slots.EVENT_SHOW_LINE,
			callback: function(event){
				if (event!=null) {
					var target = event.getCurrentTarget();
					var lineIndex = event.getUserData();
					target.drawLine(lineIndex);
				}
			}
		});    
		cc.eventManager.addListener(event_show_line, this);
		//-----------------
		var event_stopped = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			eventName: cc.w.slots.EVENT_STOPPED,
			callback: function(event){
				if (event!=null) {
					var target = event.getCurrentTarget();
					target._linesNode.reset();
                    cc.w.slots.stopAllCellAnimations();
				}
			}
		});
		cc.eventManager.addListener(event_stopped, this);
		//-----------------
		var event_effect_finished = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			eventName: cc.w.slots.EVENT_ON_EFFECT_FINISHED,
			callback: function(event){
				if (event!=null) {
					var target = event.getCurrentTarget();
					target._linesNode.reset();
				}
			}
		});
		cc.eventManager.addListener(event_effect_finished, this);
		//-----------------
		this.reset();
	},
	reset:function(){
		cc.w.slots.STATE = cc.w.slots.STATE_STOPED;
		if(cc.w.slots.RESULT!=null){
			cc.w.slots.RESULT.reset();
			cc.w.slots.RESULT = null;
		}
		for (var i = 0; i < this._columnNodes.length; i++) {
			var columnNode = this._columnNodes[i];
			columnNode.reset();
		}
		if (this._linesNode!=null) {
			this._linesNode.reset();
		}
	},
	resetCells:function(){
		for (var i = 0; i < this._columnNodes.length; i++) {
			var columnNode = this._columnNodes[i];
			columnNode.resetCells();
		}
	},
	start:function(){
//		this.reset();
		this.resetCells();
		cc.w.slots.CYCLE_COUNT = 0;
		cc.w.slots.STATE = cc.w.slots.STATE_RUNNING;
		var delay = -0.5;
		for (var i = 0; i < this._columnNodes.length; i++) {
//			delay += 0.5;
			delay = i*0.2;
			var delayTime = cc.delayTime(delay);
			var callFunc = cc.callFunc(function(sender,data){
				this._columnNodes[data].start();
			},this,i);
			var seq = cc.sequence(delayTime,callFunc);
			this.runAction(seq);
		}
	},
	stop:function(){
		for ( var colNode in this._columnNodes) {
			colNode.stop();
		}
	},
	onEnter:function(){
		this._super();
	},
	onExit:function(){
		this._super();
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_START);
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_SLOTS_STOPPED);
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_SHOW_LINE);
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_STOPPED);
		cc.eventManager.removeCustomListeners(cc.w.slots.EVENT_ON_EFFECT_FINISHED);
	}
});
