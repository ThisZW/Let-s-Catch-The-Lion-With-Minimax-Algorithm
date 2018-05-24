

var main = {

	chessboard: new Array(),

	//1 for waiting for player1, 2 for player1 to choose a spot
	//3 for waiting for player2, 4 for player2 to choose a spot
	//5 for winning.losing the game

	mode : 'player',

	init : function(){
		this.chessboard.length = 45;
		$('.cell').each(function(){
			//console.log(parseInt($(this).attr('id')));
			main.chessboard[parseInt($(this).attr('id'))] = chess[$(this).data('chess')];
		});
		this.player1Init();
	},

	player1Init : function(){
		$('.player-2-text').hide();
		$('.player-1-text').show();
		for (var i in this.chessboard){
			if( this.chessboard[i].chess !== 'none' && this.chessboard[i].player == "a"){
					$('#' + i).addClass('player-1-click');
			}
		}
	},


	player1SelectAction : function(i){
		$.each(this.chessboard[i].movable, function(key, result) {
		  if(main.chessboard[result(i)] !== undefined && main.chessboard[result(i)].player !== "a"){// && main.chessboard[result(i)].chess.chess == 'empty'){
		  	console.log('empty at' + result(i));
		  	$('#' + result(i)).addClass('player-1-go');
		  }
		});
	},

	player1GoAction : function(i){
		var oldId = $('.player-1-clicked').attr('id');
		var oldChess = this.chessboard[$('.player-1-clicked').attr('id')];
		console.log(oldChess);
		this.checkWinning(i, "b");
		if(oldChess.chess == "fu" && i < 20){
			setChess(chess.bigfuA, i);
			this.chessboard[i] = chess.bigfuA;
		} else {
			setChess(oldChess, i);
			this.chessboard[i] = oldChess;
		}
		setChess(chess.empty, oldId);
		this.chessboard[oldId] = chess.empty;
	},

	player2Init : function(){
		$('.player-1-text').hide();
		$('.player-2-text').show();
		for (var i in this.chessboard){
			if( this.chessboard[i].chess !== 'none' && this.chessboard[i].player == "b"){
					$('#' + i).addClass('player-2-click');
			}
		}
	},

	player2SelectAction : function(i){
		$.each(this.chessboard[i].movable, function(key, result) {
		  if(main.chessboard[result(i)] !== undefined && main.chessboard[result(i)].player !== "b"){// && main.chessboard[result(i)].chess.chess == 'empty'){
		  	console.log('empty at' + result(i));
		  	$('#' + result(i)).addClass('player-2-go');
		  }
		});
	},

	player2GoAction : function(i){
		var oldId = $('.player-2-clicked').attr('id');
		var oldChess = this.chessboard[$('.player-2-clicked').attr('id')];
		console.log(oldChess);
		this.checkWinning(i, "a");
		if(oldChess.chess == "fu" && i > 40){
			setChess(chess.bigfuB, i);
			this.chessboard[i] = chess.bigfuB;
		} else {
			setChess(oldChess, i);
			this.chessboard[i] = oldChess;
		}
		setChess(chess.empty, oldId);
		this.chessboard[oldId] = chess.empty;
	},

	AiInit : function(){
		$('.player-1-text').hide();
		$('.player-2-text').show();
		$('.player-2-text').text("Ai's turn");
		this.AiAction();
	},

	AiAction : function(){
		var result = this.minimax(3, 'b', this.chessboard);
		var from = result[1][0];
		var to = result[1][1];
		setTimeout(function(){
			main.AiMove(from, to);
			main.player1Init();
		}, 500);
	},

	AiMove : function(oldId, newId){
		var oldChess = this.chessboard[oldId];
		console.log(oldChess);
		this.checkWinning(newId, "a");
		if(oldChess.chess == "fu" && newId > 40){
			setChess(chess.bigfuB, newId);
			this.chessboard[newId] = chess.bigfuB;
		} else {
			setChess(oldChess, newId);
			this.chessboard[newId] = oldChess;
		}
		setChess(chess.empty, oldId);
		this.chessboard[oldId] = chess.empty;
		//this.getAllChess('');
	},


	checkWinning : function(i, player){
		console.log('test ' + this.chessboard[i].chess + ' ' + player);
		if(this.chessboard[i].chess == "ou" && this.chessboard[i].player == player){
			$('.gameover-text').show();
		}
	},

	minimax : function(depth, player, board){
			// Get available moves
		var nextMoves = new Array();
		for (c in board){
			if(board[c] != undefined && board[c].player == player){
				$.each(board[c].movable, function(i, val){
					if(board[val(c)] != undefined && board[val(c)].player != player){
						nextMoves.push([c, val(c)]);
					}
				});
			}
		}
		console.log(nextMoves);
		// Set maximizing and minimizing value for player
		var best;

		if(player === 'b') {
	 		best = -1000;
		} else {
	  		best = 1000;
		} 

		var current;
		var bestMove = -1;
		// Rank board at lowest depth
		if(depth === 0) {
	  		best = this.evaluateBoard(board);
		} else {
	  		for(var i = 0; i < nextMoves.length; i++) {
	  			var m = nextMoves[i];
	    		var newGameState = this.simulateMove(board, nextMoves[0], nextMoves[1]);
	    		if(player === 'b') {
	      			current = this.minimax(depth - 1, 'a', newGameState)[0];
			   		if(current > best) {
			        	best = current;
			        	bestMove = m;
			      	}
			    } 
	    		else {
		      		current = this.minimax(depth - 1, 'a', newGameState)[0];
		      		if(current < best) {
		        		best = current;
		        		bestMove = m;
		      		}
	    		}
	  		}
		}
		return [best, bestMove];
	},

	evaluateBoard : function(player, board){
		var sum = 0;
		var enemy = this.determineEnemy(player);
		for (c in board){
			if(board[c].player == player){
				sum += board[c].weight;
				$.each(board[c].movable, function(i, val){
					if(board[val(c)] != undefined && board[val(c)] != player){
						sum += board[c].mobility;
						console.log(board[c].mobility);
					}
				});
			}
			else {
				sum -= board[c].weight;
				$.each(board[c].movable, function(i, val){
					if(board[val(c)] != undefined && board[val(c)] != enemy){
						sum -= board[c].mobility;
					}
				});
			}
		}

		sum += this.isKillable(player, board) * 50;

		return sum;
		//console.log(sum);
	},

	isKillable : function(player, board){
		var enemy = this.determineEnemy(player);
		var enemyOu;
		for (c in board){
			if (board[c].player == enemy && board[c].chess == 'ou')
			enemyOu = c;
		}
		var enemyOuDanger = 0;
		for (c in board){
			if (board[c].player == player){
				$.each(board[c].movable, function(i, val){
					if (val(c) == enemyOu){
						enemyOuDanger ++;
					}
				});
			}
		}
		return enemyOuDanger;
	},

	determineEnemy : function (player){
		var enemy;
		if (player == 'a')
			enemy = 'b';
		else enemy = 'a';
		return enemy;
	},

	simulateMove: function(oldBoard, from, to){
		var board = jQuery.extend({}, oldBoard);
		board[to] = board[from];
		board[from] = chess.empty;
		return board;
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
		src : "img/blank.png",
		chess : "empty",
		player : "none",
		weight : 0,
		movable : {},
	},

	fuB : {
		src : "img/fuB.png",
		chess : 'fu',
		player : 'b',
		weight : 15,
		mobility: 1,
		movable : {
			down : move.down,
		},
	},

	fuA : {
		src : "img/fuA.png",
		chess : 'fu',
		player : 'a',
		weight : 15,
		mobility: 1,
		movable : {
			up : move.up,
		}
	},

	ouB : {
		src : "img/ouB.png",
		chess : 'ou',
		player : 'b',
		weight : 300,
		mobility: 8,
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
		weight : 300,
		mobility: 8,
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
		weight : 40,
		mobility: 6,
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
		weight : 40,
		mobility: 6,
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
		weight : 25,
		mobility: 3,
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
		weight : 25,
		mobility: 3,
		movable : {
			upRight : move.upRight,
			downRight : move.downRight,
			downLeft : move.downLeft,
			upLeft : move.upLeft,
		},
	},

	bigfuA : {
		src : "img/bigfuA.png",
		chess : 'bigfuA',
		player : 'a',
		weight : 35,
		mobility: 7,
		movable : {
			up : move.up,
			upRight : move.upRight,
			right : move.right,
			down : move.down,
			left : move.left,
			upLeft : move.upLeft,
		},
	},

	bigfuB : {
		src : "img/bigfuB.png",
		chess : 'bigfuB',
		player : 'b',
		weight : 35,
		mobility: 7,
		movable : {
			up : move.up,
			right : move.right,
			down : move.down,
			left : move.left,
			downRight : move.downRight,
			downLeft : move.downLeft,
		},
	},

};




function setChess(chess, id){
	console.log(chess.src);
	$('#' + id).children('.img').attr('src', chess.src);
	$('#' + id).attr('data-player',chess.player);
	$('#' + id).attr('data-chess', chess);
}

function playWithPlayer () {
	main.mode = 'player';
	main.init();
}

function playWithAi(){
	main.mode = 'ai';
	main.init();
}


playWithAi();


$(document).on('click', '.chessboard', function(){
	$('.player-1-click').click(function(){
		//add/remove class here, if anything that needs chessboard object, write in
		//main.player1SelectAction.
		$('.player-1-clicked').addClass('player-1-click');
		$('.chessboard').find('*').removeClass('player-1-clicked').off('click');
		$(this).addClass('player-1-clicked');
		$(this).removeClass('player-1-click').off('click');
		$('.chessboard').find('*').removeClass('player-1-go');
		main.player1SelectAction($(this).attr('id'));
	});

	$('.player-1-go').click(function(){
		main.player1GoAction($(this).attr('id'));
		$(this).addClass('player-1-click');
		$('.chessboard').find('*')
			.removeClass(['player-1-clicked', 'player-1-go', 'player-1-click']).off('click');
		if(main.mode == "ai"){
			main.AiInit();
		} else {
			main.player2Init();
		}
	});

	$('.player-2-click').click(function(){
		//add/remove class here, if anything that needs chessboard object, write in
		//main.player1SelectAction.
		$('.player-2-clicked').addClass('player-2-click');
		$('.chessboard').find('*').removeClass('player-2-clicked').off('click');
		$(this).addClass('player-2-clicked');
		$(this).removeClass('player-2-click').off('click');
		$('.chessboard').find('*').removeClass('player-2-go');
		main.player2SelectAction($(this).attr('id'));
	});

	$('.player-2-go').click(function(){
		main.player2GoAction($(this).attr('id'));
		$(this).addClass('player-2-click');
		$('.chessboard').find('*')
			.removeClass(['player-2-clicked', 'player-2-go', 'player-2-click']).off('click');
		main.player1Init();
	});

});
