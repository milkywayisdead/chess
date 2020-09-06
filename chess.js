// Шахматы

// file - номер столбеца,
// rank - номер ряда

const letters = {
	1: 'a',
	2: 'b',
	3: 'c',
	4: 'd',
	5: 'e',
	6: 'f',
	7: 'g',
	8: 'h'
} 

function getSquare(file, rank){
	// найти клетку
	return document.querySelector(`td[data-file="${file}"][data-rank="${rank}"]`);
}

function isEnemy(file, rank, selfcolor){
	// содержит ли клетка вражескую фигуру
	let square = getSquare(file, rank);

	if(square !== null && !isEmpty(file, rank)){
		return square.children[0].dataset.color !== selfcolor;
	}

	return false;
}

function isEmpty(file, rank){
	// пуста ли клетка
	let square = getSquare(file, rank);

	if(square !== null){
		return square.children.length === 0;
	}

	return false;
}

function getPieces(color){
	let pieces = [];
	for(let square of document.querySelectorAll('#chessboard td.square')){
		if(square.children.length && square.children[0].dataset.color === color){

			let pieceType = square.children[0].dataset.chesspiece;
			let chesspiece;
			let pieceProps = [color, square.dataset.file, square.dataset.rank];

			if(pieceType === 'pawn'){
				chesspiece = new Pawn(...pieceProps);
			}

			if(pieceType === 'rook'){
				chesspiece = new Rook(...pieceProps);
			}

			if(pieceType === 'knight'){
				chesspiece = new Knight(...pieceProps);
			}

			if(pieceType === 'bishop'){
				chesspiece = new Bishop(...pieceProps);
			}

			if(pieceType === 'queen'){
				chesspiece = new Queen(...pieceProps);
			}

			if(pieceType === 'king'){
				chesspiece = new King(...pieceProps);
			}

			pieces.push(chesspiece);
		}
	}

	return pieces;
}


class Piece {
	// фигура

	constructor(color, file, rank){
		this.color = color;
		this.file = Number(file);
		this.rank = Number(rank);
	}

	takeSquare(){
		// занять клетку

		let square = getSquare(this.file, this.rank);
		square.append(this.fa);
	}

	get props(){
		// основные свойства в виде массива
		return [this.color, this.file, this.rank];
	}
}


function createFaIconForChessPiece(piece){
	let fa = document.createElement('i');

	fa.classList.add('fas');
	fa.classList.add('fa-3x');
		
	if (piece.color === 'white'){
		fa.classList.add('piece-wh');
	} else if (piece.color === 'black'){
		fa.classList.add('piece-bl');
	}

	fa.classList.add(`fa-chess-${piece.piece}`);
	fa.dataset.color = piece.color;
	fa.dataset.chesspiece = piece.piece;
	
	return fa;
}



// метод фигур getAvailableSquares
// получает доступные для хода клетки

class Pawn extends Piece {
	// пешка

	constructor(color, file, rank){
		super(color, file, rank);
		this.piece = 'pawn';
		this.fa = createFaIconForChessPiece(this);	
	}

	getAvailableSquares() {
		// возможные ходы
		let squares = [];

		// клетки перед собой
		if (this.color === 'white' && this.rank + 1 <= 8 &&
			isEmpty(this.file, this.rank + 1)){
				squares.push(getSquare(this.file, this.rank + 1));
		} 

		if (this.color === 'black' && this.rank - 1 >= 1 && 
			isEmpty(this.file, this.rank - 1)){
				squares.push(getSquare(this.file, this.rank - 1));
		}


		// шаг на две клетки, если на стартовой позиции
		if (this.color === 'white' && this.rank === 2 && 
			isEmpty(this.file, 4) &&
			isEmpty(this.file, 3)){
				squares.push(getSquare(this.file, 4));	
		}

		if (this.color === 'black' && this.rank === 7 &&
			isEmpty(this.file, 5) &&
			isEmpty(this.file, 6)){
				squares.push(getSquare(this.file, 5));	
		}


		// клетки по диагонали, если там враги
		if(this.color === 'white' && isEnemy(this.file + 1, this.rank + 1, this.color)){
			squares.push(getSquare(this.file + 1, this.rank + 1));
		}

		if(this.color === 'white' && isEnemy(this.file - 1, this.rank + 1, this.color)){
			squares.push(getSquare(this.file - 1, this.rank + 1));
		}

		if(this.color === 'black' && isEnemy(this.file + 1, this.rank - 1, this.color)){
			squares.push(getSquare(this.file + 1, this.rank - 1));
		}

		if(this.color === 'black' && isEnemy(this.file - 1, this.rank - 1, this.color)){
			squares.push(getSquare(this.file - 1, this.rank - 1));
		}

		return squares;
	}

}



class King extends Piece {
	// король
	constructor(color, file, rank){
		super(color, file, rank);
		this.piece = 'king';
		this.fa = createFaIconForChessPiece(this);		
	}

	takeSquare(){
		super.takeSquare();

		if(this.color === 'black'){
			blackKing = this;
		} else if (this.color === 'white'){
			whiteKing = this;
		}
		
	}

	get hasMoved(){
		// двигался ли король
		for(let log of logs){
			if(log.piece === 'king' && log.color === this.color){
				return true;
			}
		}

		return false;
	}

	getAvailableSquares(){
		let squares = [];

		let steps = [
			[this.file, this.rank + 1],
			[this.file, this.rank - 1],
			[this.file - 1, this.rank],
			[this.file + 1, this.rank],
			[this.file - 1, this.rank + 1],
			[this.file + 1, this.rank + 1],
			[this.file - 1, this.rank - 1],
			[this.file + 1, this.rank - 1]
		];

		for(let step of steps){
			if(isEmpty(...step) || isEnemy(...step, this.color)){
				squares.push(getSquare(...step));
			}
		}

		return squares;
	}

	getSquaresToCastle(){
		let squares = [];

		// для рокировки влево
		if(this.castleAllowed('left')){
			squares.push(getSquare(this.file - 2, this.rank));
		}

		// для рокировки вправо
		if(this.castleAllowed('right')){
			squares.push(getSquare(this.file + 2, this.rank));
		}

		return squares;
	}

	get isChecked(){
		// находится ли король под шахом
		let bishop = new Bishop(...this.props);
		let knight = new Knight(...this.props);
		let rook = new Rook(...this.props);
		let possibleAttacks = [];

		// атакует ли вражеский слон или ферзь
		for(let square of new Bishop(...this.props).getAvailableSquares()){
			if(square.children.length){
				let color = square.children[0].dataset.color;
				let chesspiece = square.children[0].dataset.chesspiece;
				if(color !== this.color){
					if(chesspiece === 'bishop' || chesspiece === 'queen'){
						possibleAttacks.push(square);
					}
				}
			}
		} 

		//атакует ли вражеская ладья или ферзь
		for(let square of new Rook(...this.props).getAvailableSquares()){
			if(square.children.length){
				let color = square.children[0].dataset.color;
				let chesspiece = square.children[0].dataset.chesspiece;
				if(color !== this.color){
					if(chesspiece === 'rook' || chesspiece === 'queen'){
						possibleAttacks.push(square);
					}
				}
			}
		}

		// атакует ли вражеский конь
		for(let square of new Knight(...this.props).getAvailableSquares()){
			if(square.children.length){
				let color = square.children[0].dataset.color;
				let chesspiece = square.children[0].dataset.chesspiece;
				if(color !== this.color && chesspiece === 'knight'){
					possibleAttacks.push(square);
				}
			}
		}

		//атакует ли вражеский король
		for(let square of new King(...this.props).getAvailableSquares()){
			if(square.children.length){
				let color = square.children[0].dataset.color;
				let chesspiece = square.children[0].dataset.chesspiece;
				if(color !== this.color && chesspiece === 'king'){
					possibleAttacks.push(square);
				}
			}
		}

		//атакует ли вражеская пешка
		if(this.color === 'black'){
			for(let square of [[this.file - 1, this.rank - 1], [this.file + 1, this.rank - 1]]){
				if(isEnemy(...square, this.color)){
					if(getSquare(...square).children[0].dataset.chesspiece === 'pawn'){
						possibleAttacks.push(getSquare(square));
					}
				}
			}			
		}

		if(this.color === 'white'){
			for(let square of [[this.file - 1, this.rank + 1], [this.file + 1, this.rank + 1]]){
				if(isEnemy(...square, this.color)){
					if(getSquare(...square).children[0].dataset.chesspiece === 'pawn'){
						possibleAttacks.push(getSquare(square));
					}
				}
			}			
		}

		return possibleAttacks.length !== 0;
	}

	static isChecked(file, rank, color){
		let king = new King(color, file, rank);
		return king.isChecked;
	}

	castleAllowed(side){
		// разрешена ли рокировка в сторону side

		let rookMoved = Rook.rookHasMoved(side, this.color);
		let rookOrKingMoved = this.hasMoved || rookMoved;
		let nothingBetween, kingIsSafe;

		// если король и ладья не двигались и король не под шахом
		if(!rookOrKingMoved && !this.isChecked){
			let rank = this.rank;

			// проверяем, свободны ли поля между ладьей и королем 
			let squaresBetween = [];
			if(side === 'left'){
				squaresBetween = [[this.file - 1, rank], [this.file - 2, rank], [this.file - 3, rank]];
			} else if(side === 'right'){
				squaresBetween = [[this.file + 1, rank], [this.file + 2, rank]];
			}
			nothingBetween = squaresBetween.every(square=>isEmpty(...square));
			kingIsSafe = squaresBetween.every(square=>!(King.isChecked(...square, this.color)));

			//console.log(nothingBetween, kingIsSafe);
			return nothingBetween && kingIsSafe;
		}

		return false;
	}

}


class Queen extends Piece {
	// ферзь
	constructor(color, file, rank){
		super(color, file, rank);
		this.piece = 'queen';
		this.fa = createFaIconForChessPiece(this);		
	}

	getAvailableSquares(){
		let rook = new Rook(...this.props);
		let bishop = new Bishop(...this.props);
		let squares = rook.getAvailableSquares().concat(bishop.getAvailableSquares());

		return squares;
	}

}


class Bishop extends Piece {
	// слон
	constructor(color, file, rank){
		super(color, file, rank);
		this.piece = 'bishop';
		this.fa = createFaIconForChessPiece(this);		
	}

	getAvailableSquares(){
		let squares = [];

		// клетки вверх и вправо
		for(let f=this.file+1, r=this.rank+1; f<9 && r<9; f++, r++){
			if(isEmpty(f, r) || isEnemy(f, r, this.color)){
				squares.push(getSquare(f, r));
			}

			if(!isEmpty(f, r) || isEnemy(f, r, this.color)){
				break;
			}
		}

		// клетки вверх и влево
		for(let f=this.file-1, r=this.rank+1; f>0 && r<9; f--, r++){
			if(isEmpty(f, r) || isEnemy(f, r, this.color)){
				squares.push(getSquare(f, r));
			}

			if(!isEmpty(f, r) || isEnemy(f, r, this.color)){
				break;
			}
		}

		// клетки вниз и вправо
		for(let f=this.file+1, r=this.rank-1; f<9 && r>0; f++, r--){
			if(isEmpty(f, r) || isEnemy(f, r, this.color)){
				squares.push(getSquare(f, r));
			}

			if(!isEmpty(f, r) || isEnemy(f, r, this.color)){
				break;
			}
		}

		// клетки вниз и влево
		for(let f=this.file-1, r=this.rank-1; f>0 && r>0; f--, r--){
			if(isEmpty(f, r) || isEnemy(f, r, this.color)){
				squares.push(getSquare(f, r));
			}

			if(!isEmpty(f, r) || isEnemy(f, r, this.color)){
				break;
			}
		}

		return squares;
	}

}


class Knight extends Piece {
	// конь
	constructor(color, file, rank){
		super(color, file, rank);
		this.piece = 'knight';
		this.fa = createFaIconForChessPiece(this);		
	}

	getAvailableSquares(){
		let squares = [];
		let steps = [
			[this.file - 1, this.rank + 2],
			[this.file + 1, this.rank + 2],
			[this.file - 2, this.rank + 1],
			[this.file - 2, this.rank - 1],
			[this.file + 2, this.rank + 1],
			[this.file + 2, this.rank - 1],
			[this.file - 1, this.rank - 2],
			[this.file + 1, this.rank - 2],
		];

		for(let step of steps){
			if(isEmpty(...step) || isEnemy(...step, this.color)){
				squares.push(getSquare(...step));
			}
		}

		return squares;
	}

}


class Rook extends Piece {
	// ладья
	constructor(color, file, rank){
		super(color, file, rank);
		this.piece = 'rook';
		this.fa = createFaIconForChessPiece(this);

		let side;
		if (this.file === 1){
			side = 'left';
		}
		if (this.file === 8){
			side = 'right';
		}
		this.fa.dataset.side = side;
	}

	getAvailableSquares(){
		let squares = [];

		// клетки вправо
		for(let f=this.file+1; f<9; f++){
			if(isEmpty(f, this.rank) || isEnemy(f, this.rank, this.color)){
				squares.push(getSquare(f, this.rank));
			}

			if(!isEmpty(f, this.rank) || isEnemy(f, this.rank, this.color)){
				break;
			}
		}

		// клетки влево
		for(let f=this.file-1; f>0; f--){
			if(isEmpty(f, this.rank) || isEnemy(f, this.rank, this.color)){
				squares.push(getSquare(f, this.rank));
			}

			if(!isEmpty(f, this.rank) || isEnemy(f, this.rank, this.color)){
				break;
			}
		}

		// клетки вверх
		for(let r=this.rank+1; r<9; r++){
			if(isEmpty(this.file, r) || isEnemy(this.file, r, this.color)){
				squares.push(getSquare(this.file, r));
			}

			if(!isEmpty(this.file, r) || isEnemy(this.file, r, this.color)){
				break;
			}
		}

		// клетки вниз
		for(let r=this.rank-1; r>0; r--){
			if(isEmpty(this.file, r) || isEnemy(this.file, r, this.color)){
				squares.push(getSquare(this.file, r));
			}

			if(!isEmpty(this.file, r) || isEnemy(this.file, r, this.color)){
				break;
			}
		}

		return squares;
	}

	static rookHasMoved(side, color){
		// двигалась ли ладья
		// side='rigth' - правая
		// side='left' - левая

		for(let log of logs){
			if(log.side === side && log.piece === 'rook' && log.color === color){
				return true;
			}
		}

		return false;
	}

	static wasNotPawn(){
		// ладья не получена превращением пешки
	}

}


class Log {
	// запись хода
	constructor(dummy, current){
		this.id = turnNum;
		this.src = [dummy.file, dummy.rank];
		this.dest = [current.file, current.rank];
		this.color = dummy.color
		this.piece = dummy.piece;

		/* для определения ладьи (левая или правая);
		 исп. для определения, двигалась ли ладья */
		this.side = dummy.fa.dataset.side === undefined ? '' : dummy.fa.dataset.side;
	}

}


function removeAvailable(){
	// убрать доступные для хода клетки
	for(let square of document.querySelectorAll('.square-available')){
		square.classList.remove('square-available');
	}
}

function setState(state){
	// изменение глоб. состояния

	if (state === 'wait'){
		state = 'Ожидание хода';
	} else if (state === 'select'){
		state = 'Выбор фигуры';
	}
	//document.getElementById('state').innerHTML = state;
}

function setTurn(turn){
	// изменение хода

	if(turn === 'white'){
		turn = 'белые';
	} else if (turn === 'black'){
		turn = 'чёрные';
	}
	document.getElementById('turn').innerHTML = turn;
}

function restart(){
	//рестарт

	turn = 'white';
	state = 'select';
	setTurn(turn);
	setState(state);

	for(let square of document.querySelectorAll('#chessboard td.square')){
		square.replaceChildren();
	}
	placePieces();
	document.getElementById('check-mate-status').innerHTML = '';
	resetOccupied();
	setOccupied();
	turnNum = 1;
	document.getElementById('turn-num').innerHTML = turnNum;
	logs = [];
	pawnToPromote = null;
}

function setOccupied(){
	for(let square of document.querySelectorAll('#chessboard td')){
		if(square.children.length){
			if(square.children[0].dataset.color === turn){
				square.classList.add('occupied');
			} 
		}
	}
}

function resetOccupied(){
	for(let square of document.querySelectorAll('#chessboard td')){
		square.classList.remove('occupied');
	}
}

let currentPiece = null; // выбранная фигура
let state = 'select'; // глобальное состояние - выбор фигуры
// state = 'wait' - ожидание выбора клетки для хода

let turn = 'white'; // чей ход
let turnNum = 1; // номер хода
let logs = []; // записи ходов
let whiteKing, blackKing; // короли
let pawnToPromote = null; //пешка для превращения


/* 
	Для превращения пешки.
	Проверки шаха и мата после превращения.
 */
for(let piece of document.querySelectorAll('.prom')){
	piece.addEventListener('click', function(event){
		if(pawnToPromote === null){
			return;
		}

		let promoted;

		if(this.dataset.chesspiece === 'queen'){
			promoted = new Queen(...pawnToPromote.props);
		} else if(this.dataset.chesspiece === 'bishop'){
			promoted = new Bishop(...pawnToPromote.props);
		} else if(this.dataset.chesspiece === 'knight'){
			promoted = new Knight(...pawnToPromote.props);
		} else if(this.dataset.chesspiece === 'rook'){
			promoted = new Rook(...pawnToPromote.props);
		}

		getSquare(pawnToPromote.file, pawnToPromote.rank).children[0].remove();
		promoted.takeSquare();
		document.getElementById('promotion').style.display = 'none';

		let mate = isMate(afterProm=true);
		if(mate){
			state = 'mate';
			let kngStr = '';
			if(pawnToPromote.color === 'white'){
				kngStr = 'чёрному';
			} else if (pawnToPromote.color === 'black') {
				kngStr = 'белому';
			}
			document.getElementById('check-mate-status').innerHTML = `Мат ${kngStr} королю`;
			return;
		}

		let checkMateStatus = document.getElementById('check-mate-status');
		if(pawnToPromote.color === 'white' && blackKing.isChecked){
			checkMateStatus.innerHTML = 'Шах чёрному королю!'
		} 

		if(pawnToPromote.color === 'black' && whiteKing.isChecked){
			checkMateStatus.innerHTML = 'Шах белому королю!'
		}

		if(!whiteKing.isChecked && !blackKing.isChecked){
			checkMateStatus.innerHTML = '';
		}

		pawnToPromote = null;

	});
};

function isMate(afterProm=false){
	// Уже мат?
	let isMate = true;

	let king;
	if(turn === 'white' && !afterProm){
		king = blackKing;	
	} else {
		king = whiteKing;
	}

	if (turn === 'black' && !afterProm){
		king = whiteKing;
	} else {
		king = blackKing;
	}

	let pieces = getPieces(king.color);

	function tryToSaveTheKing(piece, square){
		// Проверяем, может ли ход фигуры избавить короля от шаха
		let kingIsSaved = false;
		
		let dummy = new piece.constructor(...piece.props);
		let killedDummy = null; // фигура, которую, возможно, снимут

		// убираем фигуру с прежнего места и задаем новые координаты		
		getSquare(piece.file, piece.rank).children[0].remove();
		piece.file = Number(square.dataset.file);
		piece.rank = Number(square.dataset.rank);

		// если в клетке вражеская фигура, то убираем её
		if(isEnemy(square.dataset.file, square.dataset.rank, piece.color)){
			killedDummy = square.children[0];
			//square.replaceChildren();
			killedDummy.remove();
		}

		piece.takeSquare();

		kingIsSaved = !king.isChecked;

		// возвращаем всё на места
		piece.file = Number(dummy.file);
		piece.rank = Number(dummy.rank);
		piece.takeSquare();

		// возвращаем снятую фигуру на место
		if (killedDummy !== null){
			square.append(killedDummy);
		}

		return kingIsSaved;
	}

	// может ли король сам уйти от шаха
	for(let square of king.getAvailableSquares()){
		if(tryToSaveTheKing(king, square)){
			return false;
		}
	}

	// может ли какой-либо ход какой-либо фигуры спасти его?
	for(let piece of pieces){
		if(piece.piece === 'king'){
			continue;
		}

		for(let square of piece.getAvailableSquares()){
			if(tryToSaveTheKing(piece, square)){
				return false;
			}
		}
	}

	return isMate;
}


document.addEventListener('DOMContentLoaded', function(){
	drawChessboard();
	placePieces();
	setState(state);
	setTurn(turn);
	setOccupied();
	document.getElementById('restart').addEventListener('click', restart);

	// отмена выбора фигуры по правому клику в любом месте доски
	document.getElementById('chessboard').addEventListener('contextmenu', function(event){
		event.preventDefault();
		if(currentPiece === null){
			return;
		}

		if(state === 'wait'){
			currentPiece = null;
			state = 'select';
			setState(state);
			removeAvailable();
		}

		document.querySelector('.faa-bounce').classList.remove('faa-bounce', 'animated');
	});
	
	document.querySelectorAll('#chessboard td.square').forEach(function(square){
		square.addEventListener('click', function(){

			if(state === 'mate' || pawnToPromote !== null){
				return;
			}

			// если фигура только выбирается
			if (this.children.length && state === 'select'){
				let piece = this.children[0];
				let pieceType = piece.dataset.chesspiece;
				let pieceProps = [piece.dataset.color, this.dataset.file, this.dataset.rank];
				let chesspiece;				
				
				// если фигура относится к стороне, у которой сейчас ход
				if(piece.dataset.color == turn){
					piece.classList.add('faa-bounce', 'animated');
					state = 'wait'; // ждем хода
					setState(state);

					// создание активной фигуры
					if(pieceType === 'pawn'){
						chesspiece = new Pawn(...pieceProps);
					}

					if(pieceType === 'rook'){
						chesspiece = new Rook(...pieceProps);
					}

					if(pieceType === 'knight'){
						chesspiece = new Knight(...pieceProps);
					}

					if(pieceType === 'bishop'){
						chesspiece = new Bishop(...pieceProps);
					}

					if(pieceType === 'queen'){
						chesspiece = new Queen(...pieceProps);
					}

					if(pieceType === 'king'){
						chesspiece = new King(...pieceProps);
					}

					currentPiece = chesspiece;

					// делаем доступные для хода клетки
					let squares = chesspiece.getAvailableSquares();
					if(chesspiece instanceof King){						
						squares = squares.concat(chesspiece.getSquaresToCastle());
					}

					for(let square of squares){
						square.classList.add('square-available');
					};

					// если доступных клеток нет, то сбрасываем активную фигуру и ждём
					if(!squares.length){
						piece.classList.remove('faa-bounce', 'animated');
						currentPiece = null;
						state = 'select';
						setState(state);
					}
				}
			}

			// если фигура уже выбрана
			if(currentPiece !== null && this.classList.contains('square-available') && state === 'wait'){

				let dummy = new currentPiece.constructor(...currentPiece.props); // сохраняем фигуру до хода
				let killedDummy = null; // фигура, которую, возможно, снимут

				// убираем фигуру с прежнего места и задаем новые координаты		
				getSquare(currentPiece.file, currentPiece.rank).replaceChildren();
				currentPiece.file = Number(this.dataset.file);
				currentPiece.rank = Number(this.dataset.rank);

				// если в клетке вражеская фигура, то убираем её
				if(isEnemy(this.dataset.file, this.dataset.rank, currentPiece.color)){
					killedDummy = this.children[0];
					this.replaceChildren(); 
				}

				currentPiece.takeSquare(); //перемещаем фигуру

				// создаем запись хода, но не сохраняем в логи
				let log = new Log(dummy, currentPiece);

				/* проверяем, оказывается ли "свой" король под шахом после хода;
				   если оказывается, то делаем откат */
				if((currentPiece.color === 'black' && blackKing.isChecked) ||
					(currentPiece.color === 'white' && whiteKing.isChecked)){ 
					currentPiece.file = Number(dummy.file);
					currentPiece.rank = Number(dummy.rank);
					currentPiece.takeSquare();

					// возвращаем снятую фигуру на место
					if (killedDummy !== null){
						this.append(killedDummy);
					}

					state = 'select';
					removeAvailable();
					return;
				}


				// перестановка ладьи при рокировке
				if(currentPiece instanceof King){
					let rook;

					if(dummy.file - currentPiece.file === 2){
						getSquare(1, currentPiece.rank).replaceChildren();
						rook = new Rook(currentPiece.color, currentPiece.file + 1, currentPiece.rank);
					}

					if(dummy.file - currentPiece.file === -2){
						getSquare(8, currentPiece.rank).replaceChildren();
						rook = new Rook(currentPiece.color, currentPiece.file - 1, currentPiece.rank);
					}

					if(rook !== undefined){
						//console.log(rook);
						rook.takeSquare();
					}
				}

				// добавить пешку для превращения
				if(currentPiece.piece === 'pawn' && (currentPiece.rank === 8 || currentPiece.rank === 1)){
					document.getElementById('promotion').style.display = 'block';
					pawnToPromote = new Pawn(...currentPiece.props);
				}


				/* если свой король не попадает под шах,
					то меняем состояние, обнуляем активную фигуру,
					переключаем ход, очищаем доступные для хода клетки,
					сохраняем запись хода
				*/
				currentPiece = null;
				state = 'select';
				setState(state);
				removeAvailable();
				logs.push(log);

				let mate = isMate();
				if(mate){
					state = 'mate';
					let kngStr = '';
					if(turn === 'white'){
						kngStr = 'чёрному';
					} else if (turn === 'black') {
						kngStr = 'белому';
					}
					document.getElementById('check-mate-status').innerHTML = `Мат ${kngStr} королю`;
					return;
				}


				// сообщения
				let checkMateStatus = document.getElementById('check-mate-status');
				if(turn === 'white' && blackKing.isChecked){
					checkMateStatus.innerHTML = 'Шах чёрному королю!'
				} 

				if(turn === 'black' && whiteKing.isChecked){
					checkMateStatus.innerHTML = 'Шах белому королю!'
				}

				if(!whiteKing.isChecked && !blackKing.isChecked){
					checkMateStatus.innerHTML = '';
				}


				// переключаем ход
				if(turn === 'white'){
					turn = 'black';
				} else if (turn === 'black'){
					turn = 'white';
					turnNum++; // увеличиваем номер хода
				}
				setTurn(turn);
				resetOccupied();
				setOccupied();
				document.getElementById('turn-num').innerHTML = turnNum;

			}
		
		});

	});
	
	
});


