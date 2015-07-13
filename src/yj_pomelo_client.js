var yj_host = "192.168.1.28";
var yj_port = "3010";
cc.yj = {};
cc.yj.storeClient = {};
cc.yj.storeClient.buyItem = function(itemId,itemNum){
	var url = "Interaction.interactionHandler.buy";
	var param1 = {
			CheckpointId: 1,
			PropId: 1,
			PropNum: 1
	};

	var propShop = [];
	propShop[0] = param1;
	var obj = propShop;
	
	pomelo.init({
		host: yj_host,
		port: yj_port,
		log: true
	}, function() {
		pomelo.request(url, {propshop:obj,userName:37}, function(data) {
			if (data.code == 200) {
				cc.log(data.msg);
				cc.log(111);
			}else{
				cc.log(2222);
			}
		});
	});
};