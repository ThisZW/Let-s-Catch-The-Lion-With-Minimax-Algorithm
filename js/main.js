

var main = {

	chessboard: new Array(),

	//1 for waiting for player1, 2 for player1 to choose a spot
	//3 for waiting for player2, 4 for player2 to choose a spot
	//5 for winning.losing the game
	status : 1,

	selectModePlayer : function(){
		this.chessboard.length = 45;
		$('.cell').each(function(){
			//console.log(parseInt($(this).attr('id')));
			main.chessboard[parseInt($(this).attr('id'))] = {
				chess: chess[$(this).data('chess')],
			};
		});
		this.player1Select();
	},

	selectModeAi : function(){
		console.log("???");
	},

	player1Select : function(){
		for (var i in this.chessboard){
			console.log(this.chessboard[i].chess.movable);
			console.log(i);
			if( this.chessboard[i].chess !== 'none' && this.chessboard[i].chess.player == "a"){
				$('#' + i).addClass('player-1-click');
			}
		}
	},

	player1SelectAction : function(i){
		$.each(this.chessboard[i].chess.movable, function( key, result ) {
		  if(main.chessboard[result(i)].chess !== undefined && main.chessboard[result(i)].chess.chess == 'empty'){
		  	console.log('empty at' + result(i));
		  }
		});
	},

	player1GoAction : function(i){
		$.each(this.chessboard[i].chess.movable, function( key, value ) {
		  console.log(value(i));
		});
	},

	player2SelectAction : function(i){
		$.each(this.chessboard[i].chess.movable, function( key, value ) {
		  console.log(value(i));
		});
	},

	player2GoAction : function(i){
		$.each(this.chessboard[i].chess.movable, function( key, value ) {
		  console.log(value(i));
		});
	},
};

var move = {
	up : function(id){
		return parseInt(id) - 10;
	},

	upRight: function(id){
		return parseInt(id) - 9;
	},

	right : function(id){
		return parseInt(id) + 1;
	},

	downRight : function(id){
		return parseInt(id) + 11;
	},

	down : function(id){
		return parseInt(id) + 10;
	},

	downLeft : function(id){
		return parseInt(id) + 9;
	},

	left : function(id){
		return parseInt(id) - 1;
	},

	upLeft : function(id){
		return parseInt(id) - 11;
	},
};

var chess = {

	empty: {
		src : "",
		chess : "empty",
		player : "none",
		movable : {},
	},

	fuB : {
		src : "img/fuB.png",
		chess : 'fu',
		player : 'b',
		movable : {
			down : move.down,
		},
	},

	fuA : {
		src : "img/fuA.png",
		chess : 'fu',
		player : 'a',
		movable : {
			up : move.up,
		}
	},

	ouB : {
		src : "img/ouB.png",
		chess : 'ou',
		player : 'b',
		movable : {
			up : move.up,
			upRight : move.upRight,
			right : move.right,
			downRight : move.downRight,
			down : move.down,
			downLeft : move.downLeft,
			left : move.left,
			upLeft : move.upLeft,
		},
	},

	ouA : {
		src : "img/ouA.png",
		chess : 'ou',
		player : 'a',
		movable : {
			up : move.up,
			upRight : move.upRight,
			right : move.right,
			downRight : move.downRight,
			down : move.down,
			downLeft : move.downLeft,
			left : move.left,
			upLeft : move.upLeft,
		},
	},

	hiB : {
		src : "img/hiB.png",
		chess : 'hi',
		player : 'b',
		movable : {
			up : move.up,
			right : move.right,
			down : move.down,
			left : move.left,
		},
	},

	hiA : {
		src : "img/hiA.png",
		chess : 'hi',
		player : 'a',
		movable : {
			up : move.up,
			right : move.right,
			down : move.down,
			left : move.left,
		},
	},

	kakuB : {
		src : "img/kakuB.png",
		chess : 'kaku',
		player : 'b',
		movable : {
			upRight : move.upRight,
			downRight : move.downRight,
			downLeft : move.downLeft,
			upLeft : move.upLeft,
		},
	},

	kakuA : {
		src : "img/kakuA.png",
		chess : 'kaku',
		player : 'a',
		movable : {
			upRight : move.upRight,
			downRight : move.downRight,
			downLeft : move.downLeft,
			upLeft : move.upLeft,
		},
	},

};




var ai = {
//
}



function playWithPlayer () {
	main.selectModePlayer();
}

function playWithAi(){
	main.selectModeAi();
}


playWithPlayer();


$(document).ready(function(){
	$('.player-1-click').click(function(){
		main.player1SelectAction($(this).attr('id'));
	});
	$('.player-2-click').click(function(){
		main.player2SelectAction($(this).attr('id'));
	});
	$('.player-1-go').click(function(){
		main.player1GoAction($(this).attr('id'));
	});
	$('.player-2-go').click(function(){
		main.player2GoAction($(this).attr('id'));
	});
})
