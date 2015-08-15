var currentMoney = 10;
var totalMoney = 10;
var harvestedOil = 0;
var oilCost = 1;	
var oilPerDrill = 0;
var TOTAL_OIL = 120000000000000;
var background_color = '#87CEFA';
var POLLUTION_FACTOR = 1.144;
var pollution = 1000;
var RICHNESS_INTERVAL_FACTOR = 1.151;
var RICH_GUYS_MONEY = 5000000000;
var top100 = 0;
var influence = 0;
var influenceLevel = 0;

/*
Jag ska implementera en timer nånstans också,
som ska ligga uppe i hörnet och ticka.
Den startar igång när man tar första spadtaget.
*/


function Driller(id, cost, oil, increase) {
	this.id = "#" + id;
	this.cost = cost;
	this.oil = oil;
	this.increase = increase;
	this.amount = 0;
}

function Industry(id, cost, interest, increase){
	this.id = "#" + id;
	this.cost = cost;
	this.interest = interest;
	this.increase = increase;
	this.amount = 0;
}

var pickaxe = new Driller("pickaxe", 10, 1, 2);
var gnome = new Driller("gnome", 200, 5, 50);
var piledriver = new Driller("piledriver", 5000, 20, 200);
var oompa = new Driller("oompa", 25000, 100, 5000);
var mole = new Driller("mole", 100000, 500, 20000);
var exca = new Driller("exca", 20000000, 10000, 500000);
var oilDrill = new Driller("oilDrill", 100000000, 200000, 20000000);
var unknown = new Driller("unknown", 5, 99910000000, 1000000000);

var carFactory = new Industry("carFactory", 1000, 1, 500);
var toy = new Industry("toy", 1000000, 10, 500000);
var roadway = new Industry("roadway", 1000000000, 100, 1000000000);


$(document).ready(function(){
	$("#oilButton").click(function(){
		console.log("$" + currentMoney);
        console.log("lollan lollers lalle");
		currentMoney += oilCost*oilPerDrill;
		totalMoney += oilCost*oilPerDrill;
		harvestedOil += oilPerDrill;
		updateStats();
		polluting();
	});
	
	$(".driller").click(function(){
		var drillId = $(this).attr('id');
		var driller;	
		switch(drillId){
		case "pickaxe":
			driller = pickaxe;
			break;
		case "gnome":
			driller = gnome;
			break;
		case "piledriver":
			driller = piledriver;
			break;
		case "oompa":
			driller = oompa;
			break;
		case "miner":
			driller = miner;
			break;
		case "mole":
			driller = mole;
			break;
		case "exca":
			driller = exca;
			break;
		case "oilDrill":
			driller = oilDrill;
			break;
		case "unknown":
			driller = unknown;
			break;
		}
		if(driller.cost <= currentMoney){
			currentMoney -= driller.cost;
			oilPerDrill += driller.oil;
			driller.amount++;
			driller.cost += driller.increase*driller.amount;
			$(driller.id+"Cost").html("$"+driller.cost);
			$(driller.id+"Num").html(driller.amount);
			updateStats();
			if(driller.id === "#gnome" || driller.id === "#oompa" || driller.id === "#mole" || driller.id === "#unknown"){
				politicUpdate();
			};
		};
	});
	
	$(".industry").click(function(){
		var indId = $(this).attr('id');
		var industry;
		switch(indId){
			case "carFactory":
				industry = carFactory;
				break;
			case "toy":
				industry = toy;
				break;
			case "roadway":
				industry = roadway;
				break;
		};
		if(industry.cost <= currentMoney){
			currentMoney -= industry.cost;
			oilCost += industry.interest;
			industry.amount++;
			industry.cost += industry.amount*industry.increase;
			$(industry.id+"Cost").html("$"+industry.cost);
			$(industry.id+"Num").html(industry.amount);
			updateStats();
		};
	});
	
	
	
});


function updateStats(){
	$("#money").html("$"+currentMoney);
	$("#harvestedOil").html(harvestedOil+"L");
	$("#oilPerDrill").html(oilPerDrill+"L");
	$("#moneyPerDrill").html("$"+oilCost*oilPerDrill);
	$("#totalMoney").html("$"+totalMoney);
	richness();
	oilButtonUpdate();
	
};

function backUpdate(){
    var rgb = [1,3,5].map(function(o) {
        return background_color.slice(o,o+2);
    });
    var red = parseInt(rgb[0], 16);
    var green = parseInt(rgb[1], 16);
    var blue = parseInt(rgb[2], 16);
	
	

    if(1.6*red > green && 1.6*red > blue){
        red--;
    }
    else if(1.2*green > blue){
        green--;
    }
    else{
        blue--;
    }
    background_color = '#' + red.toString(16) + green.toString(16) + blue.toString(16);
	console.log(background_color);
    $('body').css('background-color', background_color);

}

function polluting(){
	if(harvestedOil > pollution){
		backUpdate();
		pollution *= POLLUTION_FACTOR;
		console.log(pollution);
	}
}

function richness(){
	if(currentMoney > RICH_GUYS_MONEY && top100 === 0){
		$("#richnessInfo").fadeIn();
		$("#richnessIndex").html("100th");
		top100 = 1;
	};
	/*if(currentMoney < 5000000000){
		$("#richnessInfo").fadeOut();
	};*/
	if(currentMoney > RICH_GUYS_MONEY*RICHNESS_INTERVAL_FACTOR && top100 === 1){
		RICH_GUYS_MONEY *= RICHNESS_INTERVAL_FACTOR;
		var place = $("#richnessIndex").html().split("th")[0];
		place--;
		console.log(place);
		$("#richnessIndex").html(place + "th");
	};
	if(currentMoney > 5000000000000000){
		$("#richnessIndex").html("second");
		$("#richnessInfo").fadeIn();
	};
};

function oilButtonUpdate(){
	if(oilPerDrill >= 1){
		$("#oilButton").html("<strong>Three!</strong>");
		$("#oilButton:active").css("top", "50px");
	};
};

function politicUpdate(){
	$("#politicBar").fadeIn();
	var height = $("#mercury").css("height").split("px");
	height = parseInt(height[0]);
	var bottom = $("#mercury").css("bottom").split("px");
	bottom = parseInt(bottom[0]);
	height += 16/Math.pow(2, influenceLevel);
	influence += 16/Math.pow(2, influenceLevel);
	bottom += 16/Math.pow(2, influenceLevel);
	$("#mercury").css("height", height);
	$("#mercury").css("bottom", bottom);
	checkInfluence();
}

function checkInfluence(){
	if(influence > 255){
		influenceLevel++;
		influence = 0;
		var height = 0;
		var bottom = -256;
		$("#mercury").css("height", height);
		$("#mercury").css("bottom", bottom);
		politicLevelUp();
	}
};

function politicLevelUp(){
	switch(influenceLevel){
		case 1:
			$("#toyContainer").fadeIn();
			break;
		case 2:
			$("#roadwayContainer").fadeIn();
			break;
	};
};