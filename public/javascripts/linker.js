/*
	multistr: true,
	debug:true,
	forin:true,
	noarg:true,
	noempty:true,
	eqeqeq:true,
	bitwise:true,
	strict:true,
	undef:true,
	unused:true,
	curly:true,
	browser:true,
	jquery:true,
	node:true,
	indent:4,
	devel:true
*/
function Linker(rootId, spaceX, spaceY, typeNumber){
	this.spaceX = spaceX || 8;
	this.spaceY = spaceY || 9;
	this.typeNum = typeNumber || 12;
	this.board = [];
	this.rootId = rootId
}
Linker.prototype.reset = function(spaceX, spaceY, typeNumber) {
	this.spaceX = spaceX || 8;
	this.spaceY = spaceY || 9;
	this.typeNum = typeNumber || 12;
	this.board = [];
	this.GenerateBoard();
	this.rander();
};
Linker.prototype._random = function(biggestNum) {
	return Math.round(Math.random()*(biggestNum-1)) + 1;
}

Linker.prototype.mapToAxisDis = function(axis, p1, p2) {
	if (typeof axis.x !== "undefined" && typeof axis.y === "undefined") {
		var start = +p1.y, end = +p2.y;
		if (start > end) {
			var temp = start;
			start = end;
			end = temp;
		}
		var distance = 0;
		for(var i= +start+1; i< end; ++i) {
			distance += this.board[i][axis.x]
		}
		return distance;
	} else if (typeof axis.y !== "undefined" && typeof axis.x === "undefined") {
		var start = +p1.x, end = +p2.x;
		if (start > end) {
			var temp = start;
			start = end;
			end = temp;
		}
		var distance = 0;
		for(var i=start +1; i<end; ++i) {
			distance += this.board[axis.y][i];
		}
		return distance;
	} else {
		return -1;
	}
};

Linker.prototype.distance = function(p1, axis) {
	var distance = 0;
	if (typeof axis.x !== "undefined" && typeof axis.y === "undefined") {
		// x axis
		if (p1.x >= axis.x) {
			for(var i= axis.x; i<p1.x; ++i) {
				distance += +this.board[p1.y][i];
			}
		} else {
			for(var i= +p1.x+1; i<= axis.x; ++i) {
				distance += +this.board[p1.y][i];
			}
		}
		return distance;;
	} else if (typeof axis.y !== "undefined" && typeof axis.x === "undefined") {
		// y axis
		if (p1.y >= axis.y) {
			for(var i=axis.y; i<p1.y; ++i) {
				distance += +this.board[i][p1.x];
			}
		} else {
			for(var i= +p1.y+1; i<=axis.y; ++i) {
				distance += +this.board[i][p1.x];
			}
		}
		return distance;
	} else {
		return -1;
	}
};

Linker.prototype.judgeConnect = function(position1, position2) {
	if (position1.x == position2.x && position1.y == position2.y) {
		return false;
	}
	for(var i=0; i<this.spaceX+2; ++i) {
		var axis = {"x":i};

		if (this.distance(position1, axis) === 0 
			&& this.distance(position2, axis) === 0 
			&& this.mapToAxisDis(axis, position1, position2) === 0){
			return true;
		} 
	}
	for(var j=0; j<this.spaceY + 2; ++j) {
		var axis = {"y": j};
		if (this.distance(position1, axis) === 0
			&& this.distance(position2, axis) === 0
			&& this.mapToAxisDis(axis, position1, position2) === 0) {
			return true;
		}
	}
	return false;
};

Linker.prototype.findPair = function(locate) {
	for(var i=0; i<this.spaceX; ++i) {
		for(var j=0; j<this.spaceY; ++j) {
			if (locate.y === j+1 && locate.x === i+1) {
				continue;
			}
			if (this.board[j+1][i+1] === this.board[locate.y][locate.x] ) {
				if (this.judgeConnect({"x":i+1, "y":j+1}, locate)) {
					//this.board[j+1][i+1] = 0;
					//this.board[locate.y][locate.x] = 0;
					return true;
				}
			}
		}
	}
	return false;
};


Linker.prototype.GenerateBoard = function() {
	var totalLocates = this.spaceX* this.spaceY /2;
	var numberAry = [];
	for(var i=0; i<totalLocates; ++i) {
		numberAry.push(this._random(this.typeNum));
	}
	numberAry = numberAry.concat(numberAry);
	var len = numberAry.length;
	for(var i=len-1; i>0; --i) {
		var j = this._random(len)%(i+1);
		var temp = numberAry[i];
		numberAry[i] = numberAry[j];
		numberAry[j] = temp;
	}
	for(var i=0; i<this.spaceY+2; ++i) {
		this.board[i] = [];
		for(var j=0; j<this.spaceX + 2; ++j) {
			if (i===0 || i=== this.spaceY+1) {
				this.board[i][j] = 0;
			} else if (j===0 || j===this.spaceX+1) {
				this.board[i][j] = 0;
			} else {
				this.board[i][j] = numberAry[(i-1)*(this.spaceX)+j-1];
			}
		}
	}

};

Linker.prototype.reOrder = function() {
	var curAry = [];
	for(var i=0; i<this.spaceY+2; ++i) {
		for(var j=0; j<this.spaceX + 2; ++j) {
			if (this.border[j][i] != 0) {
				curAry.push({"x":i, "y":j});
			}
		}
	}
	var len = curAry.length;
	for(var i= len-1; i>0; --i) {
		var j = this._random(len)%(i);
		var curLocate = curAry[i], swapLocate = curAry[j];
		var temp = this.board[curLocate.y][curLocate.x];
		this.board[curLocate.y][curLocate.x] = this.board[swapLocate.y][swapLocate.x];
		this.board[swapLocate.y][swapLocate.x] = temp;
	}
	if (!this.hasLinker()){
		this.reOrder();
	} else{
		this.rander();		
	}
};

Linker.prototype.rander = function() {
	var $root = $("#" + this.rootId);
	$root.empty();
	var totalWidth = (this.spaceX+2)*50 + 2;
	var totalHeight = (this.spaceY+2)*50 + 2;
	$root.width(totalWidth);
	$root.height(totalHeight);
	for(var j=0; j<this.spaceY+2; ++j) {
		for(var i=0;i<this.spaceX+2; ++i) {
			var value = this.board[j][i];
			var str = "<div class='size cell back"+value+"' value='"+value+"' x='"+i+"' y='"+j+"'></div>";
			$(str).appendTo($root);
		}
	}
};

Linker.prototype.testLinkers = function(position1, position2) {
	if (this.judgeConnect(position1, position2)) {
		this.board[position1.y][position1.x] = 0;
		this.board[position2.y][position2.x] = 0;
		$("div[x='"+position1.x+"'][y='"+position1.y+"']").addClass("backblack");
		$("div[x='"+position2.x+"'][y='"+position2.y+"']").addClass("backblack");
		if (this.testOver()){
			return true;
		} else{
			if (!this.hasLinker()) {
				this.reOrder();
			}
			return false;
		}
	}
};

Linker.prototype.testBoard = function() {
	var strAry = [];
	for (var i = 0; i < this.board.length; i++) {
		var len = this.board[i].length;
		var curAry = [];
		
		for(var j=0; j<len; ++j) {
			if (this.board[i][j] < 10) {
				curAry[j] = " " + this.board[i][j];
			} else{
				curAry[j] = this.board[i][j];
			}
		}
		strAry[i] = curAry.join("  ");
	};
	console.log(strAry.join("\n"));
	return strAry.join("\n");
};

Linker.prototype.testOver = function() {
	for(var i=0; i<this.spaceX+2; ++i) {
		for(var j=0; j<this.spaceY+2; ++j) {
			if (this.board[j][i] != 0) {
				return false;
			}
		}
	}
	return true;
};

Linker.prototype.hasLinker = function() {
	for(var i=0; i<this.spaceX; ++i) {
		for(var j=0; j<this.spaceY; ++j) {
			if( this.board[j+1][i+1] != 0) {
				if (this.findPair({"x":i+1, "y": j+1})){
					return true;
				}
			}
		}
	}
	return false;
};

var curSelect;

$(function(){
	var section = {spaceX:8, spaceY:9, typeNum:12};
	section.next = function(){
		//this.spaceX++;
		//this.spaceY
		this.typeNum++;
	}
	var testLinker = new Linker("board");
	testLinker.GenerateBoard();
	testLinker.testBoard();
	var maxX = testLinker.spaceX;
	var maxY = testLinker.spaceY;
	var me = testLinker;
	testLinker.rander();
	$("#start").click(function(){
		for(var i=0; i<testLinker.spaceX; ++i) {
			for(var j=0; j<testLinker.spaceY; ++j) {
				if( testLinker.board[j+1][i+1] != 0) {
					if (testLinker.findPair({"x":i+1, "y": j+1})){
						testLinker.testBoard();
						return;
					}
				}
			}
		}
	})
	$("#board").click(function(event){
		var $curElement = $(EventUtil.getTarget(event));
		if ($curElement.hasClass("cell")) {
			if (typeof curSelect === "undefined" || curSelect == null) {
				curSelect = {};
				curSelect.locate = {"x": $curElement.attr("x"), "y": $curElement.attr("y")};
				curSelect.value = $curElement.attr('value');
				if (curSelect.value != 0 && !$curElement.hasClass("backblack")) {
					$curElement.addClass("border");
				} else{
					curSelect = null;
				}
			} else {
				// linker
				var curValue = $curElement.attr('value');
				var curSelectValue = curSelect.value;
				if (curValue == curSelectValue) {
					var curLocate = {"x": $curElement.attr("x"), "y": $curElement.attr("y")};
					var curSelectLocate = curSelect.locate;//{"x": $curSelect.attr("x"), "y": $curSelect.attr("y")};
					if (testLinker.testLinkers(curLocate, curSelectLocate)){
						// over 
						section.next();
						testLinker.reset(section.spaceX, section.spaceY, section.typeNum);
					}
				}
				curSelect = null;
				$('.border').removeClass("border");
			}
		}
	})
	$("#reset").click(function(){
		section.next();
		testLinker.reset(section.spaceX, section.spaceY, section.typeNum);
		testLinker.testBoard();	
	})
})